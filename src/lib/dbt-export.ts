import {
  DOMAIN_LABELS,
  METRIC_TYPE_LABELS,
  type MetricContract,
} from "./metric-model";

function yamlEscape(value: string): string {
  if (value === "") return '""';
  if (/[:#{}[\],&*?|>!%@`]/.test(value) || value.includes("\n")) {
    return JSON.stringify(value);
  }
  return value;
}

function block(value: string, indent = 4): string {
  const pad = " ".repeat(indent);
  const lines = value.trim().split(/\r?\n/);
  if (lines.length <= 1) return yamlEscape(value.trim());
  return `|\n${lines.map((line) => `${pad}${line}`).join("\n")}`;
}

/**
 * Export a documentation-oriented YAML template inspired by dbt semantic
 * layer / MetricFlow style. This is NOT executed against a warehouse.
 */
export function exportDbtMetricYaml(metric: MetricContract): string {
  const typeHint =
    metric.metric_type === "rate" || metric.metric_type === "ratio"
      ? "ratio"
      : metric.metric_type === "average"
        ? "average"
        : metric.metric_type === "sum"
          ? "sum"
          : "simple";

  const lines: string[] = [
    `# Metric Contract Studio — dbt/MetricFlow-style export`,
    `# Documentation template only. Not wired to a warehouse.`,
    `# Generated for: ${metric.slug} (v${metric.version})`,
    ``,
    `version: 2`,
    ``,
    `metrics:`,
    `  - name: ${yamlEscape(metric.slug || "unnamed_metric")}`,
    `    label: ${yamlEscape(metric.name || metric.slug)}`,
    `    type: ${typeHint}`,
    `    description: ${block(metric.business_question || metric.description || "")}`,
    `    meta:`,
    `      domain: ${yamlEscape(DOMAIN_LABELS[metric.domain])}`,
    `      owner: ${yamlEscape(metric.owner || "unassigned")}`,
    `      status: ${yamlEscape(metric.status)}`,
    `      contract_version: ${metric.version}`,
    `      metric_type: ${yamlEscape(METRIC_TYPE_LABELS[metric.metric_type])}`,
    `      source_system: ${yamlEscape(metric.source_system || "")}`,
    `      source_table: ${yamlEscape(metric.source_table || "")}`,
    `      grain: ${yamlEscape(metric.grain || "")}`,
    `      refresh_frequency: ${yamlEscape(metric.refresh_frequency || "")}`,
    `      default_filters: ${block(metric.default_filters || "", 8)}`,
    `      formula: ${block(metric.formula || "", 8)}`,
    `      limitations: ${block(metric.limitations || "", 8)}`,
  ];

  if (metric.numerator_definition || metric.denominator_definition) {
    lines.push(`      numerator: ${block(metric.numerator_definition || "", 8)}`);
    lines.push(
      `      denominator: ${block(metric.denominator_definition || "", 8)}`,
    );
  }

  if (metric.fields.length > 0) {
    lines.push(`      fields:`);
    for (const field of metric.fields) {
      lines.push(`        - name: ${yamlEscape(field.field_name)}`);
      lines.push(`          type: ${yamlEscape(field.field_type)}`);
      lines.push(`          column: ${yamlEscape(field.source_column)}`);
      lines.push(`          required: ${field.required}`);
    }
  }

  if (metric.validation_rules.length > 0) {
    lines.push(`      validation_rules:`);
    for (const rule of metric.validation_rules) {
      lines.push(`        - type: ${yamlEscape(rule.rule_type)}`);
      lines.push(`          severity: ${yamlEscape(rule.severity)}`);
      lines.push(`          description: ${block(rule.description, 12)}`);
    }
  }

  lines.push(``);
  lines.push(`# Suggested model reference (placeholder):`);
  lines.push(
    `# models: ref('${metric.source_table || "your_model"}')`,
  );
  lines.push(``);

  return lines.join("\n");
}
