import { z } from "zod";
import type { MetricContract } from "./metric-model";

export const metricStatusSchema = z.enum(["draft", "ready", "deprecated"]);
export const metricDomainSchema = z.enum([
  "sales",
  "product",
  "finance",
  "operations",
  "marketing",
  "support",
]);
export const metricTypeSchema = z.enum([
  "count",
  "sum",
  "ratio",
  "average",
  "rate",
  "percentile",
]);

export const metricFieldSchema = z.object({
  id: z.string().min(1),
  metric_id: z.string().min(1),
  field_name: z.string(),
  field_type: z.string(),
  source_column: z.string(),
  required: z.boolean(),
  description: z.string(),
  example_value: z.string(),
});

export const validationRuleSchema = z.object({
  id: z.string().min(1),
  metric_id: z.string().min(1),
  rule_type: z.string(),
  severity: z.enum(["info", "warning", "critical"]),
  description: z.string(),
  sql_check_template: z.string(),
  failure_message: z.string(),
  owner_action: z.string(),
});

export const usageExampleSchema = z.object({
  id: z.string().min(1),
  metric_id: z.string().min(1),
  type: z.enum(["correct", "incorrect"]),
  title: z.string(),
  description: z.string(),
  explanation: z.string(),
});

export const metricContractSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  slug: z.string(),
  status: metricStatusSchema,
  business_question: z.string(),
  description: z.string(),
  owner: z.string(),
  domain: metricDomainSchema,
  metric_type: metricTypeSchema,
  formula: z.string(),
  source_system: z.string(),
  source_table: z.string(),
  grain: z.string(),
  refresh_frequency: z.string(),
  default_filters: z.string(),
  numerator_definition: z.string().nullable(),
  denominator_definition: z.string().nullable(),
  inclusion_rules: z.string(),
  exclusion_rules: z.string(),
  limitations: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  fields: z.array(metricFieldSchema),
  validation_rules: z.array(validationRuleSchema),
  usage_examples: z.array(usageExampleSchema),
});

export const metricsArraySchema = z.array(metricContractSchema);

export type ParsedMetricsResult =
  | { ok: true; metrics: MetricContract[] }
  | { ok: false; metrics: []; error: string };

/**
 * Soft-parse metrics from untrusted JSON (e.g. localStorage).
 * Invalid payloads return ok:false instead of throwing.
 */
export function parseMetricsPayload(raw: unknown): ParsedMetricsResult {
  const result = metricsArraySchema.safeParse(raw);
  if (!result.success) {
    return {
      ok: false,
      metrics: [],
      error: result.error.issues
        .slice(0, 3)
        .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
        .join("; "),
    };
  }
  return { ok: true, metrics: result.data as MetricContract[] };
}
