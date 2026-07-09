"use client";

import { create } from "zustand";
import { getDemoMetrics } from "./demo-data";
import {
  createEmptyMetric,
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
import { enforceReadyStatus } from "./validation";

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
  updateMetric: (id: string, patch: Partial<MetricContract>) => MetricContract | null;
  deleteMetric: (id: string) => void;
  filteredMetrics: () => MetricContract[];
}

function persist(metrics: MetricContract[]) {
  saveMetricsToStorage(metrics);
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
    const stored = loadMetricsFromStorage<MetricContract>();
    if (stored && stored.length > 0) {
      set({ metrics: stored, hydrated: true });
      return;
    }
    if (!wasDemoSeeded()) {
      const demos = getDemoMetrics();
      persist(demos);
      markDemoSeeded();
      set({ metrics: demos, hydrated: true });
      return;
    }
    set({ metrics: [], hydrated: true });
  },

  setFilters: (partial) => {
    set({ filters: { ...get().filters, ...partial } });
  },

  loadDemoMetrics: (mode = "merge") => {
    const demos = getDemoMetrics();
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
    set({ metrics: next, hydrated: true });
  },

  clearAll: () => {
    persist([]);
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
        slug:
          partial?.slug ||
          (partial?.name ? slugify(partial.name) : `metric-${Date.now()}`),
      }),
    );
    const next = [metric, ...get().metrics];
    persist(next);
    set({ metrics: next });
    return metric;
  },

  updateMetric: (id, patch) => {
    const current = get().getMetric(id);
    if (!current) return null;
    const merged: MetricContract = enforceReadyStatus({
      ...current,
      ...patch,
      id: current.id,
      updated_at: new Date().toISOString(),
      slug:
        patch.slug ||
        (patch.name ? slugify(patch.name) : current.slug) ||
        current.slug,
      fields: patch.fields ?? current.fields,
      validation_rules: patch.validation_rules ?? current.validation_rules,
      usage_examples: patch.usage_examples ?? current.usage_examples,
    });
    const next = get().metrics.map((m) => (m.id === current.id ? merged : m));
    persist(next);
    set({ metrics: next });
    return merged;
  },

  deleteMetric: (id) => {
    const next = get().metrics.filter((m) => m.id !== id && m.slug !== id);
    persist(next);
    set({ metrics: next });
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
