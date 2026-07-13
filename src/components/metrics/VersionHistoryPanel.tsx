"use client";

import { useMemo, useState } from "react";
import { diffContracts } from "@/lib/contract-diff";
import {
  getVersionsForMetric,
  type ContractVersion,
} from "@/lib/contract-versions";
import type { MetricContract } from "@/lib/metric-model";

export function VersionHistoryPanel({ metric }: { metric: MetricContract }) {
  const versions = useMemo(
    () => getVersionsForMetric(metric.id),
    // Re-read when version/status changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metric.id, metric.version, metric.status, metric.updated_at],
  );
  const [selected, setSelected] = useState<ContractVersion | null>(null);

  const compareTo =
    selected ??
    (versions.length > 1 ? versions[1] : versions.length === 1 ? versions[0] : null);
  const diff =
    compareTo && versions[0]
      ? diffContracts(compareTo.snapshot, metric)
      : [];

  return (
    <section className="surface space-y-3 p-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          Versioning
        </p>
        <h2 className="font-display mt-1 text-xl tracking-tight">
          History & diff
        </h2>
        <p className="mt-1 text-xs text-[var(--ink-soft)]">
          Local revision log stored in the browser. Compare current contract to
          a prior snapshot.
        </p>
      </div>

      {versions.length === 0 ? (
        <p className="text-sm text-[var(--ink-soft)]">
          No versions recorded yet. Save or load demos to start history.
        </p>
      ) : (
        <ul className="max-h-48 space-y-2 overflow-y-auto text-sm">
          {versions.map((version) => (
            <li key={version.id}>
              <button
                type="button"
                onClick={() => setSelected(version)}
                className={`w-full rounded-md border px-3 py-2 text-left transition ${
                  compareTo?.id === version.id
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                    : "border-[var(--line)] hover:border-[var(--brand)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs">v{version.version}</span>
                  <span className="text-xs text-[var(--ink-faint)]">
                    {version.source}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">
                  {version.change_summary}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {compareTo ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-[var(--ink-faint)]">
            Diff vs v{compareTo.version}
          </p>
          {diff.length === 0 ? (
            <p className="text-xs text-[var(--ink-soft)]">
              No governance field differences.
            </p>
          ) : (
            <ul className="space-y-2 text-xs">
              {diff.slice(0, 8).map((entry) => (
                <li
                  key={entry.path}
                  className="rounded-md border border-[var(--line)] bg-[var(--bg-muted)] p-2"
                >
                  <p className="font-medium text-[var(--ink)]">{entry.label}</p>
                  <p className="mt-1 text-[var(--critical)]">
                    − {entry.before}
                  </p>
                  <p className="text-[var(--ready)]">+ {entry.after}</p>
                </li>
              ))}
              {diff.length > 8 ? (
                <li className="text-[var(--ink-faint)]">
                  +{diff.length - 8} more fields
                </li>
              ) : null}
            </ul>
          )}
        </div>
      ) : null}
    </section>
  );
}
