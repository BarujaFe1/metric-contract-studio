"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { MetricForm } from "@/components/forms/MetricForm";
import { ContractSkeleton } from "@/components/ui/Skeleton";
import { useMetricStore } from "@/lib/store";

export default function EditMetricPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const hydrate = useMetricStore((s) => s.hydrate);
  const hydrated = useMetricStore((s) => s.hydrated);
  const getMetric = useMetricStore((s) => s.getMetric);
  const updateMetric = useMetricStore((s) => s.updateMetric);
  const metrics = useMetricStore((s) => s.metrics);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const metric = useMemo(() => {
    if (!hydrated) return undefined;
    return getMetric(params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, params.id, metrics]);

  if (!hydrated) {
    return <ContractSkeleton />;
  }

  if (!metric) {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-3xl">Metric not found</h1>
        <Link href="/metrics" className="text-sm text-[var(--brand)] hover:underline">
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-[var(--ink-faint)]">
        <Link href="/metrics" className="hover:text-[var(--brand)]">
          Library
        </Link>
        <span aria-hidden> / </span>
        <Link
          href={`/metrics/${metric.id}`}
          className="hover:text-[var(--brand)]"
        >
          {metric.name}
        </Link>
        <span aria-hidden> / </span>
        <span className="text-[var(--ink-soft)]">Edit</span>
      </nav>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          Edit contract
        </p>
        <h1 className="font-display mt-1 text-4xl tracking-tight">
          {metric.name}
        </h1>
      </div>

      <MetricForm
        initial={metric}
        submitLabel="Save changes"
        onSubmit={(next) => {
          updateMetric(metric.id, next);
          router.push(`/metrics/${metric.id}`);
        }}
      />
    </div>
  );
}
