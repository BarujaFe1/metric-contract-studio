"use client";

import { useMetricStore } from "@/lib/store";

export function DemoMetricLoader({
  mode = "merge",
  label = "Load demo metrics",
}: {
  mode?: "merge" | "replace";
  label?: string;
}) {
  const loadDemoMetrics = useMetricStore((s) => s.loadDemoMetrics);

  return (
    <button
      type="button"
      onClick={() => loadDemoMetrics(mode)}
      className="rounded-md border border-[var(--brand)] bg-[var(--brand-soft)] px-3 py-2 text-sm font-medium text-[var(--brand-deep)] hover:bg-[color-mix(in_srgb,var(--brand-soft)_70%,white)]"
    >
      {label}
    </button>
  );
}
