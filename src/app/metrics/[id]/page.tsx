"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MarkdownExportButton } from "@/components/export/MarkdownExportButton";
import { SqlTemplateViewer } from "@/components/export/SqlTemplateViewer";
import { ContractSection } from "@/components/metrics/ContractSection";
import { MaturityScore } from "@/components/metrics/MaturityScore";
import { MissingFieldsPanel } from "@/components/metrics/MissingFieldsPanel";
import {
  DomainBadge,
  SeverityBadge,
  StatusBadge,
} from "@/components/ui/StatusBadge";
import {
  DOMAIN_LABELS,
  METRIC_TYPE_LABELS,
  type MetricContract,
} from "@/lib/metric-model";
import { calculateMaturityScore } from "@/lib/maturity-score";
import {
  generateQualityChecklist,
  generateSqlTemplate,
} from "@/lib/sql-generator";
import { useMetricStore } from "@/lib/store";
import { validateMetric } from "@/lib/validation";

export default function MetricDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const hydrate = useMetricStore((s) => s.hydrate);
  const hydrated = useMetricStore((s) => s.hydrated);
  const getMetric = useMetricStore((s) => s.getMetric);
  const deleteMetric = useMetricStore((s) => s.deleteMetric);
  const metrics = useMetricStore((s) => s.metrics);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const metric = useMemo(() => {
    if (!hydrated) return undefined;
    return getMetric(params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, params.id, metrics]);

  if (!hydrated) {
    return <p className="text-sm text-[var(--ink-faint)]">Loading contract…</p>;
  }

  if (!metric) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl">Metric not found</h1>
        <p className="text-sm text-[var(--ink-soft)]">
          This contract is not in the local library.
        </p>
        <Link href="/metrics" className="text-sm text-[var(--brand)] hover:underline">
          Back to library
        </Link>
      </div>
    );
  }

  return <MetricDetailView metric={metric} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} onDelete={() => {
    deleteMetric(metric.id);
    router.push("/metrics");
  }} />;
}

function MetricDetailView({
  metric,
  confirmDelete,
  setConfirmDelete,
  onDelete,
}: {
  metric: MetricContract;
  confirmDelete: boolean;
  setConfirmDelete: (v: boolean) => void;
  onDelete: () => void;
}) {
  const maturity = calculateMaturityScore(metric);
  const validation = validateMetric(metric);
  const sql = generateSqlTemplate(metric);
  const checklist = generateQualityChecklist(metric);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={metric.status} />
            <DomainBadge label={DOMAIN_LABELS[metric.domain]} />
            <span className="text-xs text-[var(--ink-faint)]">
              {METRIC_TYPE_LABELS[metric.metric_type]}
            </span>
          </div>
          <h1 className="font-display mt-3 text-4xl tracking-tight">
            {metric.name}
          </h1>
          <p className="mt-1 font-mono text-sm text-[var(--ink-faint)]">
            {metric.slug}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--ink-soft)]">
            {metric.business_question || "No business question defined."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/metrics/${metric.id}/edit`}
            className="rounded-md bg-[var(--brand)] px-3 py-2 text-sm font-medium text-[var(--bg-elevated)] hover:bg-[var(--brand-deep)]"
          >
            Edit
          </Link>
          <MarkdownExportButton metric={metric} />
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-md border border-[var(--critical)] px-3 py-2 text-sm text-[var(--critical)]"
            >
              Delete
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onDelete}
                className="rounded-md bg-[var(--critical)] px-3 py-2 text-sm text-white"
              >
                Confirm delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <ContractSection title="Executive summary">
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <Item label="Owner" value={metric.owner || "—"} />
              <Item label="Refresh" value={metric.refresh_frequency || "—"} />
              <Item label="Source" value={`${metric.source_system || "—"} / ${metric.source_table || "—"}`} />
              <Item label="Grain" value={metric.grain || "—"} />
              <Item label="Formula" value={metric.formula || "—"} mono />
              <Item label="Default filters" value={metric.default_filters || "—"} mono />
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
              {metric.description || "No description yet."}
            </p>
          </ContractSection>

          <ContractSection title="Full contract">
            <div className="space-y-4 text-sm text-[var(--ink-soft)]">
              <Block title="Inclusion" body={metric.inclusion_rules} />
              <Block title="Exclusion" body={metric.exclusion_rules} />
              <Block title="Limitations" body={metric.limitations} />
              {(metric.numerator_definition || metric.denominator_definition) && (
                <>
                  <Block title="Numerator" body={metric.numerator_definition} />
                  <Block title="Denominator" body={metric.denominator_definition} />
                </>
              )}

              <div>
                <h3 className="mb-2 font-medium text-[var(--ink)]">Fields</h3>
                {metric.fields.length === 0 ? (
                  <p>No fields defined.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-xs">
                      <thead className="text-[var(--ink-faint)]">
                        <tr>
                          <th className="py-2 pr-3">Name</th>
                          <th className="py-2 pr-3">Type</th>
                          <th className="py-2 pr-3">Column</th>
                          <th className="py-2 pr-3">Required</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metric.fields.map((f) => (
                          <tr key={f.id} className="border-t border-[var(--line)]">
                            <td className="py-2 pr-3 text-[var(--ink)]">{f.field_name}</td>
                            <td className="py-2 pr-3">{f.field_type}</td>
                            <td className="py-2 pr-3 font-mono">{f.source_column}</td>
                            <td className="py-2 pr-3">{f.required ? "yes" : "no"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <h3 className="mb-2 font-medium text-[var(--ink)]">
                  Validation rules
                </h3>
                {metric.validation_rules.length === 0 ? (
                  <p>No validation rules.</p>
                ) : (
                  <ul className="space-y-3">
                    {metric.validation_rules.map((rule) => (
                      <li key={rule.id} className="surface-muted p-3">
                        <div className="mb-1 flex items-center gap-2">
                          <SeverityBadge severity={rule.severity} />
                          <span className="font-medium text-[var(--ink)]">
                            {rule.rule_type}
                          </span>
                        </div>
                        <p>{rule.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="mb-2 font-medium text-[var(--ink)]">
                  Usage examples
                </h3>
                {metric.usage_examples.length === 0 ? (
                  <p>No usage examples.</p>
                ) : (
                  <ul className="space-y-3">
                    {metric.usage_examples.map((ex) => (
                      <li key={ex.id} className="surface-muted p-3">
                        <p className="text-xs uppercase tracking-wide text-[var(--ink-faint)]">
                          {ex.type}
                        </p>
                        <p className="font-medium text-[var(--ink)]">{ex.title}</p>
                        <p className="mt-1">{ex.description}</p>
                        <p className="mt-1 italic">{ex.explanation}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </ContractSection>

          <ContractSection title="SQL template">
            <SqlTemplateViewer sql={sql} />
          </ContractSection>

          <ContractSection title="Quality checklist">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--ink-soft)]">
              {checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </ContractSection>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <MaturityScore result={maturity} />
          <MissingFieldsPanel alerts={validation.alerts} />
        </aside>
      </div>
    </div>
  );
}

function Item({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-[var(--ink-faint)]">{label}</dt>
      <dd className={`mt-1 text-[var(--ink)] ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function Block({
  title,
  body,
}: {
  title: string;
  body: string | null | undefined;
}) {
  return (
    <div>
      <h3 className="mb-1 font-medium text-[var(--ink)]">{title}</h3>
      <p>{body && body.trim() ? body : "—"}</p>
    </div>
  );
}
