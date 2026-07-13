"use client";

import { create } from "zustand";
import {
  clearAllVersions,
  deleteVersionsForMetric,
  ensureSeedVersions,
  recordVersion,
} from "./contract-versions";
import { getDemoMetrics } from "./demo-data";
import {
  createEmptyApproval,
  createEmptyMetric,
  normalizeContract,
  slugify,
  type MetricContract,
  type MetricDomain,
  type MetricStatus,
} from "./metric-model";
import {
  loadMetricsFromStorage,
  markDemoSeeded,
  saveMetricsToStorage,
  wasDemoSeeded,
} from "./storage";
import { canSubmitForReview, enforceReadyStatus } from "./validation";

interface MetricFilters {
  domain: MetricDomain | "all";
  status: MetricStatus | "all";
  query: string;
}

interface MetricStore {
  metrics: MetricContract[];
  hydrated: boolean;
  filters: MetricFilters;
  hydrate: () => void;
  setFilters: (partial: Partial<MetricFilters>) => void;
  loadDemoMetrics: (mode?: "merge" | "replace") => void;
  clearAll: () => void;
  getMetric: (id: string) => MetricContract | undefined;
  createMetric: (partial?: Partial<MetricContract>) => MetricContract;
  updateMetric: (
    id: string,
    patch: Partial<MetricContract>,
  ) => MetricContract | null;
  deleteMetric: (id: string) => void;
  submitForReview: (
    id: string,
  ) => { ok: true; metric: MetricContract } | { ok: false; reason: string };
  approveMetric: (
    id: string,
    note?: string,
  ) => { ok: true; metric: MetricContract } | { ok: false; reason: string };
  rejectMetric: (
    id: string,
    note?: string,
  ) => { ok: true; metric: MetricContract } | { ok: false; reason: string };
  filteredMetrics: () => MetricContract[];
}

function persist(metrics: MetricContract[]) {
  saveMetricsToStorage(metrics.map((m) => normalizeContract(m)));
}

function bumpVersion(metric: MetricContract): MetricContract {
  return {
    ...metric,
    version: (metric.version || 1) + 1,
    updated_at: new Date().toISOString(),
  };
}

export const useMetricStore = create<MetricStore>((set, get) => ({
  metrics: [],
  hydrated: false,
  filters: {
    domain: "all",
    status: "all",
    query: "",
  },

  hydrate: () => {
    if (get().hydrated) return;
    const stored = loadMetricsFromStorage();
    if (stored && stored.length > 0) {
      const metrics = stored.map((m) => normalizeContract(m));
      ensureSeedVersions(metrics);
      set({ metrics, hydrated: true });
      return;
    }
    if (!wasDemoSeeded()) {
      const demos = getDemoMetrics().map((m) => normalizeContract(m));
      persist(demos);
      markDemoSeeded();
      ensureSeedVersions(demos);
      set({ metrics: demos, hydrated: true });
      return;
    }
    set({ metrics: [], hydrated: true });
  },

  setFilters: (partial) => {
    set({ filters: { ...get().filters, ...partial } });
  },

  loadDemoMetrics: (mode = "merge") => {
    const demos = getDemoMetrics().map((m) => normalizeContract(m));
    let next: MetricContract[];
    if (mode === "replace") {
      next = demos;
    } else {
      const existingIds = new Set(get().metrics.map((m) => m.id));
      const existingSlugs = new Set(get().metrics.map((m) => m.slug));
      const toAdd = demos.filter(
        (d) => !existingIds.has(d.id) && !existingSlugs.has(d.slug),
      );
      next = [...get().metrics, ...toAdd];
    }
    persist(next);
    markDemoSeeded();
    ensureSeedVersions(demos);
    set({ metrics: next, hydrated: true });
  },

  clearAll: () => {
    persist([]);
    clearAllVersions();
    set({ metrics: [] });
  },

  getMetric: (id) => get().metrics.find((m) => m.id === id || m.slug === id),

  createMetric: (partial) => {
    const metric = enforceReadyStatus(
      createEmptyMetric({
        ...partial,
        id: partial?.id ?? crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        approval: createEmptyApproval(partial?.approval),
        slug:
          partial?.slug ||
          (partial?.name ? slugify(partial.name) : `metric-${Date.now()}`),
      }),
    );
    const next = [metric, ...get().metrics];
    persist(next);
    recordVersion({ metric, previous: null, source: "create" });
    set({ metrics: next });
    return metric;
  },

  updateMetric: (id, patch) => {
    const current = get().getMetric(id);
    if (!current) return null;
    const merged: MetricContract = enforceReadyStatus(
      normalizeContract({
        ...current,
        ...patch,
        id: current.id,
        updated_at: new Date().toISOString(),
        version: current.version,
        slug:
          patch.slug ||
          (patch.name ? slugify(patch.name) : current.slug) ||
          current.slug,
        fields: patch.fields ?? current.fields,
        validation_rules: patch.validation_rules ?? current.validation_rules,
        usage_examples: patch.usage_examples ?? current.usage_examples,
        approval: patch.approval
          ? createEmptyApproval(patch.approval)
          : current.approval,
      }),
    );
    const bumped = bumpVersion(merged);
    const next = get().metrics.map((m) => (m.id === current.id ? bumped : m));
    persist(next);
    recordVersion({
      metric: bumped,
      previous: current,
      source: "update",
    });
    set({ metrics: next });
    return bumped;
  },

  deleteMetric: (id) => {
    const current = get().getMetric(id);
    const next = get().metrics.filter((m) => m.id !== id && m.slug !== id);
    persist(next);
    if (current) deleteVersionsForMetric(current.id);
    set({ metrics: next });
  },

  submitForReview: (id) => {
    const current = get().getMetric(id);
    if (!current) return { ok: false, reason: "Metric not found." };
    const gate = canSubmitForReview(current);
    if (!gate.ok) return { ok: false, reason: gate.reason || "Cannot submit." };
    const now = new Date().toISOString();
    const updated = bumpVersion(
      normalizeContract({
        ...current,
        status: "in_review",
        approval: createEmptyApproval({
          state: "pending",
          submitted_at: now,
          decided_at: null,
          decision_note: "",
          reviewer_label: "Local reviewer (simulated)",
        }),
      }),
    );
    const next = get().metrics.map((m) => (m.id === current.id ? updated : m));
    persist(next);
    recordVersion({
      metric: updated,
      previous: current,
      source: "submit_review",
      summary: "Submitted for review",
    });
    set({ metrics: next });
    return { ok: true, metric: updated };
  },

  approveMetric: (id, note = "") => {
    const current = get().getMetric(id);
    if (!current) return { ok: false, reason: "Metric not found." };
    if (current.status !== "in_review") {
      return { ok: false, reason: "Only in-review contracts can be approved." };
    }
    const gate = canSubmitForReview({ ...current, status: "draft" });
    if (!gate.ok) {
      return {
        ok: false,
        reason: gate.reason || "Critical gaps block approval.",
      };
    }
    const now = new Date().toISOString();
    const updated = bumpVersion(
      normalizeContract({
        ...current,
        status: "ready",
        approval: createEmptyApproval({
          ...current.approval,
          state: "approved",
          decided_at: now,
          decision_note: note || "Approved as source of truth.",
          reviewer_label:
            current.approval.reviewer_label || "Local reviewer (simulated)",
        }),
      }),
    );
    const next = get().metrics.map((m) => (m.id === current.id ? updated : m));
    persist(next);
    recordVersion({
      metric: updated,
      previous: current,
      source: "approve",
      summary: "Approved → ready",
    });
    set({ metrics: next });
    return { ok: true, metric: updated };
  },

  rejectMetric: (id, note = "") => {
    const current = get().getMetric(id);
    if (!current) return { ok: false, reason: "Metric not found." };
    if (current.status !== "in_review") {
      return { ok: false, reason: "Only in-review contracts can be rejected." };
    }
    const now = new Date().toISOString();
    const updated = bumpVersion(
      normalizeContract({
        ...current,
        status: "draft",
        approval: createEmptyApproval({
          ...current.approval,
          state: "rejected",
          decided_at: now,
          decision_note: note || "Rejected — revise and resubmit.",
          reviewer_label:
            current.approval.reviewer_label || "Local reviewer (simulated)",
        }),
      }),
    );
    const next = get().metrics.map((m) => (m.id === current.id ? updated : m));
    persist(next);
    recordVersion({
      metric: updated,
      previous: current,
      source: "reject",
      summary: "Rejected → draft",
    });
    set({ metrics: next });
    return { ok: true, metric: updated };
  },

  filteredMetrics: () => {
    const { metrics, filters } = get();
    const q = filters.query.trim().toLowerCase();
    return metrics.filter((m) => {
      if (filters.domain !== "all" && m.domain !== filters.domain) return false;
      if (filters.status !== "all" && m.status !== filters.status) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.slug.toLowerCase().includes(q) ||
        m.owner.toLowerCase().includes(q) ||
        m.business_question.toLowerCase().includes(q)
      );
    });
  },
}));
