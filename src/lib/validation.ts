import {
  isRatioLike,
  type MetricContract,
  type MetricStatus,
} from "./metric-model";

export type AlertSeverity = "critical" | "warning" | "info";

export interface ValidationAlert {
  code: string;
  severity: AlertSeverity;
  field?: string;
  message: string;
}

export interface ValidationResult {
  alerts: ValidationAlert[];
  criticalCount: number;
  warningCount: number;
  canBeReady: boolean;
  suggestedStatus: MetricStatus;
}

const GENERIC_OWNERS = [
  "time de dados",
  "data team",
  "analytics",
  "bi",
  "equipe de dados",
  "dados",
];

function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

export function validateMetric(metric: MetricContract): ValidationResult {
  const alerts: ValidationAlert[] = [];

  if (isBlank(metric.owner)) {
    alerts.push({
      code: "missing_owner",
      severity: "critical",
      field: "owner",
      message: "Owner is required before a metric can be marked ready.",
    });
  }

  if (isBlank(metric.business_question)) {
    alerts.push({
      code: "missing_business_question",
      severity: "critical",
      field: "business_question",
      message: "Business question is required to define why the metric exists.",
    });
  }

  if (isBlank(metric.formula)) {
    alerts.push({
      code: "missing_formula",
      severity: "critical",
      field: "formula",
      message: "Formula is required for a reproducible metric definition.",
    });
  }

  if (isBlank(metric.source_system) || isBlank(metric.source_table)) {
    alerts.push({
      code: "missing_source",
      severity: "critical",
      field: "source_table",
      message: "Source system and source table are required.",
    });
  }

  if (isBlank(metric.grain)) {
    alerts.push({
      code: "missing_grain",
      severity: "critical",
      field: "grain",
      message: "Grain (granularity) is required to avoid double counting.",
    });
  }

  if (isBlank(metric.refresh_frequency)) {
    alerts.push({
      code: "missing_refresh_frequency",
      severity: "critical",
      field: "refresh_frequency",
      message: "Refresh frequency is required for operational ownership.",
    });
  }

  if (!metric.validation_rules || metric.validation_rules.length === 0) {
    alerts.push({
      code: "missing_validation_rules",
      severity: "critical",
      field: "validation_rules",
      message: "At least one validation rule is required.",
    });
  }

  if (isRatioLike(metric.metric_type)) {
    if (isBlank(metric.numerator_definition)) {
      alerts.push({
        code: "missing_numerator",
        severity: "critical",
        field: "numerator_definition",
        message: "Ratio/rate metrics require a numerator definition.",
      });
    }
    if (isBlank(metric.denominator_definition)) {
      alerts.push({
        code: "missing_denominator",
        severity: "critical",
        field: "denominator_definition",
        message: "Ratio/rate metrics require a denominator definition.",
      });
    }
  }

  if (isBlank(metric.limitations)) {
    alerts.push({
      code: "missing_limitations",
      severity: "warning",
      field: "limitations",
      message: "Limitations are empty — consumers may misuse the metric.",
    });
  }

  const hasIncorrectExample = metric.usage_examples.some(
    (example) => example.type === "incorrect",
  );
  if (!hasIncorrectExample) {
    alerts.push({
      code: "missing_incorrect_example",
      severity: "warning",
      field: "usage_examples",
      message: "Add at least one incorrect usage example to reduce misuse.",
    });
  }

  if (isBlank(metric.default_filters)) {
    alerts.push({
      code: "missing_default_filters",
      severity: "warning",
      field: "default_filters",
      message: "Default filters are empty — scope may be ambiguous.",
    });
  }

  const requiredFields = metric.fields.filter((field) => field.required);
  if (requiredFields.length === 0) {
    alerts.push({
      code: "missing_required_fields",
      severity: "warning",
      field: "fields",
      message: "No required fields are defined for this metric.",
    });
  }

  if (
    !isBlank(metric.owner) &&
    GENERIC_OWNERS.includes(metric.owner.trim().toLowerCase())
  ) {
    alerts.push({
      code: "generic_owner",
      severity: "warning",
      field: "owner",
      message: `Owner "${metric.owner}" is too generic. Prefer a named person or role.`,
    });
  }

  if (!isBlank(metric.formula) && metric.formula.trim().length < 12) {
    alerts.push({
      code: "short_formula",
      severity: "warning",
      field: "formula",
      message: "Formula text is very short — consider documenting the full expression.",
    });
  }

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const canBeReady = criticalCount === 0;

  let suggestedStatus: MetricStatus = metric.status;
  if (metric.status === "ready" && !canBeReady) {
    suggestedStatus = "draft";
  } else if (metric.status === "draft" && canBeReady) {
    suggestedStatus = "ready";
  }

  return {
    alerts,
    criticalCount,
    warningCount,
    canBeReady,
    suggestedStatus,
  };
}

export function enforceReadyStatus(metric: MetricContract): MetricContract {
  const result = validateMetric(metric);
  if (metric.status === "ready" && !result.canBeReady) {
    return { ...metric, status: "draft" };
  }
  return metric;
}
