export type MetricStatus = "draft" | "in_review" | "ready" | "deprecated";
export type ApprovalState = "none" | "pending" | "approved" | "rejected";
export type MetricDomain =
  | "sales"
  | "product"
  | "finance"
  | "operations"
  | "marketing"
  | "support";
export type MetricType =
  | "count"
  | "sum"
  | "ratio"
  | "average"
  | "rate"
  | "percentile";
export type RuleSeverity = "info" | "warning" | "critical";
export type UsageExampleType = "correct" | "incorrect";

export interface MetricApproval {
  state: ApprovalState;
  submitted_at: string | null;
  decided_at: string | null;
  decision_note: string;
  reviewer_label: string;
}

export interface MetricField {
  id: string;
  metric_id: string;
  field_name: string;
  field_type: string;
  source_column: string;
  required: boolean;
  description: string;
  example_value: string;
}

export interface ValidationRule {
  id: string;
  metric_id: string;
  rule_type: string;
  severity: RuleSeverity;
  description: string;
  sql_check_template: string;
  failure_message: string;
  owner_action: string;
}

export interface UsageExample {
  id: string;
  metric_id: string;
  type: UsageExampleType;
  title: string;
  description: string;
  explanation: string;
}

export interface MetricContract {
  id: string;
  name: string;
  slug: string;
  status: MetricStatus;
  business_question: string;
  description: string;
  owner: string;
  domain: MetricDomain;
  metric_type: MetricType;
  formula: string;
  source_system: string;
  source_table: string;
  grain: string;
  refresh_frequency: string;
  default_filters: string;
  numerator_definition: string | null;
  denominator_definition: string | null;
  inclusion_rules: string;
  exclusion_rules: string;
  limitations: string;
  created_at: string;
  updated_at: string;
  /** Monotonic local revision counter (starts at 1). */
  version: number;
  approval: MetricApproval;
  fields: MetricField[];
  validation_rules: ValidationRule[];
  usage_examples: UsageExample[];
}

export function createEmptyApproval(
  partial?: Partial<MetricApproval>,
): MetricApproval {
  return {
    state: "none",
    submitted_at: null,
    decided_at: null,
    decision_note: "",
    reviewer_label: "",
    ...partial,
  };
}

export function normalizeContract(metric: MetricContract): MetricContract {
  return {
    ...metric,
    version: metric.version && metric.version > 0 ? metric.version : 1,
    approval: createEmptyApproval(metric.approval),
  };
}

export const DOMAIN_LABELS: Record<MetricDomain, string> = {
  sales: "Sales",
  product: "Product",
  finance: "Finance",
  operations: "Operations",
  marketing: "Marketing",
  support: "Support",
};

export const STATUS_LABELS: Record<MetricStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  ready: "Ready",
  deprecated: "Deprecated",
};

export const APPROVAL_LABELS: Record<ApprovalState, string> = {
  none: "No review",
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

export const METRIC_TYPE_LABELS: Record<MetricType, string> = {
  count: "Count",
  sum: "Sum",
  ratio: "Ratio",
  average: "Average",
  rate: "Rate",
  percentile: "Percentile",
};

export const DOMAINS: MetricDomain[] = [
  "sales",
  "product",
  "finance",
  "operations",
  "marketing",
  "support",
];

export const STATUSES: MetricStatus[] = [
  "draft",
  "in_review",
  "ready",
  "deprecated",
];

export const METRIC_TYPES: MetricType[] = [
  "count",
  "sum",
  "ratio",
  "average",
  "rate",
  "percentile",
];

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `metric-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyMetric(partial?: Partial<MetricContract>): MetricContract {
  const now = new Date().toISOString();
  const id = partial?.id ?? newId();
  const name = partial?.name ?? "";
  const base: MetricContract = {
    id,
    name,
    slug: name ? slugify(name) : "",
    status: "draft",
    business_question: "",
    description: "",
    owner: "",
    domain: "product",
    metric_type: "count",
    formula: "",
    source_system: "",
    source_table: "",
    grain: "",
    refresh_frequency: "",
    default_filters: "",
    numerator_definition: null,
    denominator_definition: null,
    inclusion_rules: "",
    exclusion_rules: "",
    limitations: "",
    created_at: now,
    updated_at: now,
    version: 1,
    approval: createEmptyApproval(),
    fields: [],
    validation_rules: [],
    usage_examples: [],
  };
  return normalizeContract({
    ...base,
    ...partial,
    id,
    fields: partial?.fields ?? base.fields,
    validation_rules: partial?.validation_rules ?? base.validation_rules,
    usage_examples: partial?.usage_examples ?? base.usage_examples,
    slug: partial?.slug ?? base.slug,
    approval: createEmptyApproval(partial?.approval),
    version: partial?.version ?? base.version,
  });
}

export function isRatioLike(type: MetricType): boolean {
  return type === "ratio" || type === "rate";
}
