"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/metrics/MetricCard";
import { DemoMetricLoader } from "@/components/metrics/DemoMetricLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { LibrarySkeleton } from "@/components/ui/Skeleton";
import {
  DOMAINS,
  DOMAIN_LABELS,
  STATUSES,
  STATUS_LABELS,
} from "@/lib/metric-model";
import { useMetricStore } from "@/lib/store";

export default function MetricsLibraryPage() {
  const hydrate = useMetricStore((s) => s.hydrate);
  const hydrated = useMetricStore((s) => s.hydrated);
  const metrics = useMetricStore((s) => s.metrics);
  const filters = useMetricStore((s) => s.filters);
  const setFilters = useMetricStore((s) => s.setFilters);
  const filteredMetrics = useMetricStore((s) => s.filteredMetrics);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const visible = useMemo(
    () => (hydrated ? filteredMetrics() : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, metrics, filters],
  );

  if (!hydrated) {
    return <LibrarySkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Metric library
          </p>
          <h1 className="font-display mt-1 text-4xl tracking-tight">
            Contracts in use
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
            Browse, filter, and open metric contracts. Scores and gap badges
            surface governance health at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DemoMetricLoader />
          <Link
            href="/metrics/new"
            className="rounded-md bg-[var(--brand)] px-3 py-2 text-sm font-medium text-[var(--bg-elevated)] hover:bg-[var(--brand-deep)]"
          >
            New metric
          </Link>
        </div>
      </div>

      <div className="surface grid gap-3 p-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-[var(--ink-faint)]">Search</span>
          <input
            value={filters.query}
            onChange={(e) => setFilters({ query: e.target.value })}
            placeholder="Name, owner, question…"
            className="w-full rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-[var(--ink-faint)]">Domain</span>
          <select
            value={filters.domain}
            onChange={(e) =>
              setFilters({
                domain: e.target.value as typeof filters.domain,
              })
            }
            className="w-full rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
          >
            <option value="all">All domains</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {DOMAIN_LABELS[d]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-[var(--ink-faint)]">Status</span>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({
                status: e.target.value as typeof filters.status,
              })
            }
            className="w-full rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {metrics.length === 0 ? (
        <EmptyState
          title="Library is empty"
          description="Load SaaS/e-commerce demo metrics or create your first contract from scratch."
          actionHref="/metrics/new"
          actionLabel="Create first metric"
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No metrics match these filters"
          description="Try clearing search or switching domain/status filters."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      )}
    </div>
  );
}
