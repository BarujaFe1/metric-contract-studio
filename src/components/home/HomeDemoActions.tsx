"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMetricStore } from "@/lib/store";

export function HomeDemoActions() {
  const loadDemoMetrics = useMetricStore((s) => s.loadDemoMetrics);
  const router = useRouter();

  function openDemos() {
    loadDemoMetrics("merge");
    router.push("/metrics");
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={openDemos}
        className="rounded-md bg-[var(--bg-elevated)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-deep)] hover:bg-white"
      >
        Load 5 demo contracts
      </button>
      <Link
        href="/metrics"
        className="rounded-md border border-white/30 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
      >
        Open library
      </Link>
      <Link
        href="/metrics/new"
        className="rounded-md border border-white/30 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
      >
        Create a contract
      </Link>
    </div>
  );
}
