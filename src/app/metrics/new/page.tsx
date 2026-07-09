"use client";

import { useRouter } from "next/navigation";
import { MetricForm } from "@/components/forms/MetricForm";
import { createEmptyMetric } from "@/lib/metric-model";
import { useMetricStore } from "@/lib/store";

export default function NewMetricPage() {
  const router = useRouter();
  const createMetric = useMetricStore((s) => s.createMetric);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          New contract
        </p>
        <h1 className="font-display mt-1 text-4xl tracking-tight">
          Create metric
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
          Fill the sections below. Maturity score and gap alerts update live as
          you write the contract.
        </p>
      </div>

      <MetricForm
        initial={createEmptyMetric()}
        submitLabel="Save metric"
        onSubmit={(metric) => {
          const created = createMetric(metric);
          router.push(`/metrics/${created.id}`);
        }}
      />
    </div>
  );
}
