"use client";

import type { RuleSeverity, ValidationRule } from "@/lib/metric-model";

const inputClass =
  "w-full rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)]";

const SEVERITIES: RuleSeverity[] = ["info", "warning", "critical"];

export function ValidationRulesEditor({
  metricId,
  rules,
  onChange,
}: {
  metricId: string;
  rules: ValidationRule[];
  onChange: (rules: ValidationRule[]) => void;
}) {
  function update(index: number, patch: Partial<ValidationRule>) {
    onChange(rules.map((rule, i) => (i === index ? { ...rule, ...patch } : rule)));
  }

  function add() {
    onChange([
      ...rules,
      {
        id: `rule-${crypto.randomUUID().slice(0, 8)}`,
        metric_id: metricId,
        rule_type: "custom_check",
        severity: "warning",
        description: "",
        sql_check_template: "",
        failure_message: "",
        owner_action: "",
      },
    ]);
  }

  function remove(index: number) {
    onChange(rules.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--ink-soft)]">
          At least one rule is required for ready status.
        </p>
        <button
          type="button"
          onClick={add}
          className="text-sm text-[var(--brand)] hover:underline"
        >
          + Add rule
        </button>
      </div>

      {rules.length === 0 ? (
        <p className="rounded-md border border-dashed border-[var(--line-strong)] px-4 py-6 text-sm text-[var(--ink-faint)]">
          No validation rules yet. Add freshness, bounds, null checks, or
          reconciliation rules.
        </p>
      ) : (
        rules.map((rule, index) => (
          <div key={rule.id} className="surface-muted space-y-3 p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className={inputClass}
                placeholder="Rule type (e.g. bounds)"
                value={rule.rule_type}
                onChange={(e) => update(index, { rule_type: e.target.value })}
              />
              <select
                className={inputClass}
                value={rule.severity}
                onChange={(e) =>
                  update(index, {
                    severity: e.target.value as RuleSeverity,
                  })
                }
              >
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              className={inputClass}
              rows={2}
              placeholder="Description"
              value={rule.description}
              onChange={(e) => update(index, { description: e.target.value })}
            />
            <textarea
              className={`${inputClass} font-mono`}
              rows={3}
              placeholder="SQL check template"
              value={rule.sql_check_template}
              onChange={(e) =>
                update(index, { sql_check_template: e.target.value })
              }
            />
            <input
              className={inputClass}
              placeholder="Failure message"
              value={rule.failure_message}
              onChange={(e) =>
                update(index, { failure_message: e.target.value })
              }
            />
            <input
              className={inputClass}
              placeholder="Owner action"
              value={rule.owner_action}
              onChange={(e) => update(index, { owner_action: e.target.value })}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-sm text-[var(--critical)]"
              >
                Remove rule
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
