"use client";

import { useMemo, useState } from "react";
import {
  DOMAINS,
  DOMAIN_LABELS,
  METRIC_TYPES,
  METRIC_TYPE_LABELS,
  STATUSES,
  STATUS_LABELS,
  isRatioLike,
  slugify,
  type MetricContract,
  type MetricField,
  type UsageExample,
  type ValidationRule,
} from "@/lib/metric-model";
import { calculateMaturityScore } from "@/lib/maturity-score";
import { validateMetric } from "@/lib/validation";
import { MaturityScore } from "@/components/metrics/MaturityScore";
import { MissingFieldsPanel } from "@/components/metrics/MissingFieldsPanel";
import { ValidationRulesEditor } from "@/components/forms/ValidationRulesEditor";

type FormState = MetricContract;

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

const inputClass =
  "w-full rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)]";
const labelClass = "mb-1 block text-xs font-medium text-[var(--ink-soft)]";

export function MetricForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial: MetricContract;
  submitLabel: string;
  onSubmit: (metric: MetricContract) => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);

  const live = useMemo(() => {
    const validation = validateMetric(form);
    const maturity = calculateMaturityScore(form);
    return { validation, maturity };
  }, [form]);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && typeof value === "string") {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function updateField(index: number, patchField: Partial<MetricField>) {
    setForm((prev) => {
      const fields = prev.fields.map((f, i) =>
        i === index ? { ...f, ...patchField } : f,
      );
      return { ...prev, fields };
    });
  }

  function addField() {
    setForm((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          id: newId("field"),
          metric_id: prev.id,
          field_name: "",
          field_type: "string",
          source_column: "",
          required: true,
          description: "",
          example_value: "",
        },
      ],
    }));
  }

  function removeField(index: number) {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  }

  function updateExample(index: number, patchEx: Partial<UsageExample>) {
    setForm((prev) => ({
      ...prev,
      usage_examples: prev.usage_examples.map((e, i) =>
        i === index ? { ...e, ...patchEx } : e,
      ),
    }));
  }

  function addExample(type: UsageExample["type"]) {
    setForm((prev) => ({
      ...prev,
      usage_examples: [
        ...prev.usage_examples,
        {
          id: newId("ex"),
          metric_id: prev.id,
          type,
          title: "",
          description: "",
          explanation: "",
        },
      ],
    }));
  }

  function removeExample(index: number) {
    setForm((prev) => ({
      ...prev,
      usage_examples: prev.usage_examples.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Metric name is required.");
      return;
    }
    if (form.status === "ready" && !live.validation.canBeReady) {
      setError(
        "Cannot mark as ready while critical gaps remain. Fix alerts or keep status as draft.",
      );
      return;
    }
    onSubmit({
      ...form,
      slug: form.slug || slugify(form.name),
      updated_at: new Date().toISOString(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Section title="1. Metric identity">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => patch("name", e.target.value)}
                placeholder="Net revenue"
                required
              />
            </Field>
            <Field label="Slug">
              <input
                className={`${inputClass} font-mono`}
                value={form.slug}
                onChange={(e) => patch("slug", slugify(e.target.value))}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) =>
                  patch("status", e.target.value as MetricContract["status"])
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Domain">
              <select
                className={inputClass}
                value={form.domain}
                onChange={(e) =>
                  patch("domain", e.target.value as MetricContract["domain"])
                }
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {DOMAIN_LABELS[d]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Metric type">
              <select
                className={inputClass}
                value={form.metric_type}
                onChange={(e) =>
                  patch(
                    "metric_type",
                    e.target.value as MetricContract["metric_type"],
                  )
                }
              >
                {METRIC_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {METRIC_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Owner">
              <input
                className={inputClass}
                value={form.owner}
                onChange={(e) => patch("owner", e.target.value)}
                placeholder="Name + team"
              />
            </Field>
          </div>
        </Section>

        <Section title="2. Business definition">
          <div className="space-y-4">
            <Field label="Business question">
              <textarea
                className={inputClass}
                rows={2}
                value={form.business_question}
                onChange={(e) => patch("business_question", e.target.value)}
                placeholder="What decision does this metric support?"
              />
            </Field>
            <Field label="Description">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description}
                onChange={(e) => patch("description", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Inclusion rules">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.inclusion_rules}
                  onChange={(e) => patch("inclusion_rules", e.target.value)}
                />
              </Field>
              <Field label="Exclusion rules">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.exclusion_rules}
                  onChange={(e) => patch("exclusion_rules", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </Section>

        <Section title="3. Formula & fields">
          <div className="space-y-4">
            <Field label="Formula">
              <textarea
                className={`${inputClass} font-mono`}
                rows={3}
                value={form.formula}
                onChange={(e) => patch("formula", e.target.value)}
              />
            </Field>
            {isRatioLike(form.metric_type) ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Numerator definition">
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={form.numerator_definition ?? ""}
                    onChange={(e) =>
                      patch("numerator_definition", e.target.value || null)
                    }
                  />
                </Field>
                <Field label="Denominator definition">
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={form.denominator_definition ?? ""}
                    onChange={(e) =>
                      patch("denominator_definition", e.target.value || null)
                    }
                  />
                </Field>
              </div>
            ) : null}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Fields</p>
                <button
                  type="button"
                  onClick={addField}
                  className="text-sm text-[var(--brand)] hover:underline"
                >
                  + Add field
                </button>
              </div>
              {form.fields.length === 0 ? (
                <p className="text-sm text-[var(--ink-faint)]">
                  No fields yet. Add the columns this metric depends on.
                </p>
              ) : (
                form.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="surface-muted grid gap-3 p-3 sm:grid-cols-2"
                  >
                    <input
                      className={inputClass}
                      placeholder="Field name"
                      value={field.field_name}
                      onChange={(e) =>
                        updateField(index, { field_name: e.target.value })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Field type"
                      value={field.field_type}
                      onChange={(e) =>
                        updateField(index, { field_type: e.target.value })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Source column"
                      value={field.source_column}
                      onChange={(e) =>
                        updateField(index, { source_column: e.target.value })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Example value"
                      value={field.example_value}
                      onChange={(e) =>
                        updateField(index, { example_value: e.target.value })
                      }
                    />
                    <input
                      className={`${inputClass} sm:col-span-2`}
                      placeholder="Description"
                      value={field.description}
                      onChange={(e) =>
                        updateField(index, { description: e.target.value })
                      }
                    />
                    <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(index, { required: e.target.checked })
                        }
                      />
                      Required
                    </label>
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="justify-self-end text-sm text-[var(--critical)]"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Section>

        <Section title="4. Source & granularity">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Source system">
              <input
                className={inputClass}
                value={form.source_system}
                onChange={(e) => patch("source_system", e.target.value)}
              />
            </Field>
            <Field label="Source table">
              <input
                className={`${inputClass} font-mono`}
                value={form.source_table}
                onChange={(e) => patch("source_table", e.target.value)}
              />
            </Field>
            <Field label="Grain">
              <input
                className={inputClass}
                value={form.grain}
                onChange={(e) => patch("grain", e.target.value)}
                placeholder="order_id / day / user_id"
              />
            </Field>
            <Field label="Refresh frequency">
              <input
                className={inputClass}
                value={form.refresh_frequency}
                onChange={(e) => patch("refresh_frequency", e.target.value)}
                placeholder="Daily at 06:00 UTC"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Default filters">
                <textarea
                  className={`${inputClass} font-mono`}
                  rows={2}
                  value={form.default_filters}
                  onChange={(e) => patch("default_filters", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </Section>

        <Section title="5. Validations">
          <ValidationRulesEditor
            metricId={form.id}
            rules={form.validation_rules}
            onChange={(validation_rules: ValidationRule[]) =>
              setForm((prev) => ({ ...prev, validation_rules }))
            }
          />
        </Section>

        <Section title="6. Limitations & examples">
          <div className="space-y-4">
            <Field label="Limitations">
              <textarea
                className={inputClass}
                rows={3}
                value={form.limitations}
                onChange={(e) => patch("limitations", e.target.value)}
              />
            </Field>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addExample("correct")}
                className="text-sm text-[var(--brand)] hover:underline"
              >
                + Correct example
              </button>
              <button
                type="button"
                onClick={() => addExample("incorrect")}
                className="text-sm text-[var(--accent)] hover:underline"
              >
                + Incorrect example
              </button>
            </div>

            {form.usage_examples.map((example, index) => (
              <div key={example.id} className="surface-muted space-y-3 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-[var(--ink-faint)]">
                    {example.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExample(index)}
                    className="text-sm text-[var(--critical)]"
                  >
                    Remove
                  </button>
                </div>
                <input
                  className={inputClass}
                  placeholder="Title"
                  value={example.title}
                  onChange={(e) =>
                    updateExample(index, { title: e.target.value })
                  }
                />
                <textarea
                  className={inputClass}
                  rows={2}
                  placeholder="Description"
                  value={example.description}
                  onChange={(e) =>
                    updateExample(index, { description: e.target.value })
                  }
                />
                <textarea
                  className={inputClass}
                  rows={2}
                  placeholder="Explanation"
                  value={example.explanation}
                  onChange={(e) =>
                    updateExample(index, { explanation: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        </Section>

        {error ? (
          <div className="rounded-md border border-[var(--critical)] bg-[var(--critical-soft)] px-4 py-3 text-sm text-[var(--critical)]">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-md bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-[var(--bg-elevated)] hover:bg-[var(--brand-deep)]"
          >
            {submitLabel}
          </button>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <MaturityScore result={live.maturity} />
        <MissingFieldsPanel alerts={live.validation.alerts} />
      </aside>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface p-5">
      <h2 className="font-display mb-4 text-xl tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}
