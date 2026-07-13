import type { MetricContract } from "./metric-model";

export type DiffKind = "changed" | "added" | "removed";

export interface ContractDiffEntry {
  path: string;
  label: string;
  before: string;
  after: string;
  kind: DiffKind;
}

const GOVERNANCE_FIELDS: Array<{
  path: keyof MetricContract;
  label: string;
}> = [
  { path: "name", label: "Name" },
  { path: "slug", label: "Slug" },
  { path: "status", label: "Status" },
  { path: "business_question", label: "Business question" },
  { path: "description", label: "Description" },
  { path: "owner", label: "Owner" },
  { path: "domain", label: "Domain" },
  { path: "metric_type", label: "Metric type" },
  { path: "formula", label: "Formula" },
  { path: "source_system", label: "Source system" },
  { path: "source_table", label: "Source table" },
  { path: "grain", label: "Grain" },
  { path: "refresh_frequency", label: "Refresh frequency" },
  { path: "default_filters", label: "Default filters" },
  { path: "numerator_definition", label: "Numerator" },
  { path: "denominator_definition", label: "Denominator" },
  { path: "inclusion_rules", label: "Inclusion rules" },
  { path: "exclusion_rules", label: "Exclusion rules" },
  { path: "limitations", label: "Limitations" },
];

function display(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

function summarizeCollection(
  items: Array<{ id: string }> | undefined,
  pick: (item: { id: string }) => string,
): string {
  if (!items || items.length === 0) return "(empty)";
  return items.map(pick).join(" | ");
}

/**
 * Diff two contract snapshots focusing on governance fields.
 * Nested collections are summarized for readability.
 */
export function diffContracts(
  before: MetricContract,
  after: MetricContract,
): ContractDiffEntry[] {
  const entries: ContractDiffEntry[] = [];

  for (const field of GOVERNANCE_FIELDS) {
    const left = display(before[field.path]);
    const right = display(after[field.path]);
    if (left === right) continue;
    entries.push({
      path: String(field.path),
      label: field.label,
      before: left || "(empty)",
      after: right || "(empty)",
      kind: !left ? "added" : !right ? "removed" : "changed",
    });
  }

  const fieldsBefore = summarizeCollection(before.fields, (f) => {
    const field = before.fields.find((x) => x.id === f.id);
    return field
      ? `${field.field_name}:${field.source_column}`
      : f.id;
  });
  const fieldsAfter = summarizeCollection(after.fields, (f) => {
    const field = after.fields.find((x) => x.id === f.id);
    return field
      ? `${field.field_name}:${field.source_column}`
      : f.id;
  });
  if (fieldsBefore !== fieldsAfter) {
    entries.push({
      path: "fields",
      label: "Fields",
      before: fieldsBefore,
      after: fieldsAfter,
      kind: "changed",
    });
  }

  const rulesBefore = summarizeCollection(
    before.validation_rules,
    (r) => {
      const rule = before.validation_rules.find((x) => x.id === r.id);
      return rule ? `${rule.rule_type}/${rule.severity}` : r.id;
    },
  );
  const rulesAfter = summarizeCollection(after.validation_rules, (r) => {
    const rule = after.validation_rules.find((x) => x.id === r.id);
    return rule ? `${rule.rule_type}/${rule.severity}` : r.id;
  });
  if (rulesBefore !== rulesAfter) {
    entries.push({
      path: "validation_rules",
      label: "Validation rules",
      before: rulesBefore,
      after: rulesAfter,
      kind: "changed",
    });
  }

  const examplesBefore = summarizeCollection(before.usage_examples, (e) => {
    const ex = before.usage_examples.find((x) => x.id === e.id);
    return ex ? `${ex.type}:${ex.title}` : e.id;
  });
  const examplesAfter = summarizeCollection(after.usage_examples, (e) => {
    const ex = after.usage_examples.find((x) => x.id === e.id);
    return ex ? `${ex.type}:${ex.title}` : e.id;
  });
  if (examplesBefore !== examplesAfter) {
    entries.push({
      path: "usage_examples",
      label: "Usage examples",
      before: examplesBefore,
      after: examplesAfter,
      kind: "changed",
    });
  }

  const approvalBefore = `${before.approval?.state ?? "none"}|${before.approval?.decision_note ?? ""}`;
  const approvalAfter = `${after.approval?.state ?? "none"}|${after.approval?.decision_note ?? ""}`;
  if (approvalBefore !== approvalAfter) {
    entries.push({
      path: "approval",
      label: "Approval",
      before: approvalBefore,
      after: approvalAfter,
      kind: "changed",
    });
  }

  return entries;
}

export function summarizeDiff(entries: ContractDiffEntry[]): string {
  if (entries.length === 0) return "No governance field changes";
  if (entries.length <= 3) {
    return entries.map((e) => e.label).join(", ");
  }
  return `${entries
    .slice(0, 3)
    .map((e) => e.label)
    .join(", ")} (+${entries.length - 3} more)`;
}
