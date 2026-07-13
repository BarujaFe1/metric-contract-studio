import { diffContracts, summarizeDiff } from "./contract-diff";
import type { MetricContract } from "./metric-model";
import { normalizeContract } from "./metric-model";

export type VersionSource =
  | "create"
  | "update"
  | "submit_review"
  | "approve"
  | "reject"
  | "seed";

export interface ContractVersion {
  id: string;
  metric_id: string;
  version: number;
  created_at: string;
  source: VersionSource;
  change_summary: string;
  snapshot: MetricContract;
}

const VERSIONS_KEY = "metric-contract-studio:versions:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ver-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadAllVersions(): ContractVersion[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(VERSIONS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is ContractVersion => {
        return (
          !!item &&
          typeof item === "object" &&
          typeof (item as ContractVersion).id === "string" &&
          typeof (item as ContractVersion).metric_id === "string" &&
          typeof (item as ContractVersion).version === "number" &&
          !!(item as ContractVersion).snapshot
        );
      })
      .map((item) => ({
        ...item,
        snapshot: normalizeContract(item.snapshot),
      }));
  } catch {
    return [];
  }
}

export function saveAllVersions(versions: ContractVersion[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
}

export function getVersionsForMetric(metricId: string): ContractVersion[] {
  return loadAllVersions()
    .filter((v) => v.metric_id === metricId)
    .sort((a, b) => b.version - a.version);
}

export function recordVersion(input: {
  metric: MetricContract;
  previous?: MetricContract | null;
  source: VersionSource;
  summary?: string;
}): ContractVersion {
  const snapshot = normalizeContract(input.metric);
  const entries =
    input.previous != null
      ? diffContracts(normalizeContract(input.previous), snapshot)
      : [];
  const change_summary =
    input.summary ??
    (input.previous
      ? summarizeDiff(entries)
      : input.source === "seed"
        ? "Seeded demo contract"
        : "Initial version");

  const version: ContractVersion = {
    id: newId(),
    metric_id: snapshot.id,
    version: snapshot.version,
    created_at: new Date().toISOString(),
    source: input.source,
    change_summary,
    snapshot,
  };

  const existing = loadAllVersions().filter(
    (v) => !(v.metric_id === version.metric_id && v.version === version.version),
  );
  saveAllVersions([version, ...existing]);
  return version;
}

export function deleteVersionsForMetric(metricId: string): void {
  const next = loadAllVersions().filter((v) => v.metric_id !== metricId);
  saveAllVersions(next);
}

export function clearAllVersions(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(VERSIONS_KEY);
}

export function ensureSeedVersions(metrics: MetricContract[]): void {
  const existing = loadAllVersions();
  const known = new Set(existing.map((v) => `${v.metric_id}:${v.version}`));
  const toAdd: ContractVersion[] = [];
  for (const metric of metrics) {
    const key = `${metric.id}:${metric.version}`;
    if (known.has(key)) continue;
    toAdd.push({
      id: newId(),
      metric_id: metric.id,
      version: metric.version,
      created_at: metric.updated_at || metric.created_at,
      source: "seed",
      change_summary: "Seeded demo contract",
      snapshot: normalizeContract(metric),
    });
  }
  if (toAdd.length > 0) {
    saveAllVersions([...toAdd, ...existing]);
  }
}
