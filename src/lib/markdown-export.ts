import {
  DOMAIN_LABELS,
  METRIC_TYPE_LABELS,
  STATUS_LABELS,
  type MetricContract,
} from "./metric-model";
import { calculateMaturityScore } from "./maturity-score";
import { generateQualityChecklist, generateSqlTemplate } from "./sql-generator";
import { validateMetric } from "./validation";

function section(title: string, body: string): string {
  return `## ${title}\n\n${body.trim()}\n`;
}

function bullet(label: string, value: string | null | undefined): string {
  return `- **${label}:** ${value && value.trim() ? value.trim() : "_not defined_"}`;
}

export function exportMetricMarkdown(metric: MetricContract): string {
  const maturity = calculateMaturityScore(metric);
  const validation = validateMetric(metric);
  const sql = generateSqlTemplate(metric);
  const checklist = generateQualityChecklist(metric);

  const identity = [
    bullet("Name", metric.name),
    bullet("Slug", metric.slug),
    bullet("Status", STATUS_LABELS[metric.status]),
    bullet("Domain", DOMAIN_LABELS[metric.domain]),
    bullet("Type", METRIC_TYPE_LABELS[metric.metric_type]),
    bullet("Owner", metric.owner),
    bullet("Created", metric.created_at),
    bullet("Updated", metric.updated_at),
  ].join("\n");

  const business = [
    bullet("Business question", metric.business_question),
    bullet("Description", metric.description),
    bullet("Inclusion rules", metric.inclusion_rules),
    bullet("Exclusion rules", metric.exclusion_rules),
  ].join("\n");

  const formula = [
    bullet("Formula", metric.formula),
    bullet("Numerator", metric.numerator_definition),
    bullet("Denominator", metric.denominator_definition),
    "",
    "### Fields",
    "",
    metric.fields.length === 0
      ? "_No fields defined._"
      : [
          "| Field | Type | Column | Required | Description | Example |",
          "| --- | --- | --- | --- | --- | --- |",
          ...metric.fields.map(
            (f) =>
              `| ${f.field_name} | ${f.field_type} | ${f.source_column} | ${f.required ? "yes" : "no"} | ${f.description} | ${f.example_value} |`,
          ),
        ].join("\n"),
  ].join("\n");

  const source = [
    bullet("Source system", metric.source_system),
    bullet("Source table", metric.source_table),
    bullet("Grain", metric.grain),
    bullet("Refresh frequency", metric.refresh_frequency),
    bullet("Default filters", metric.default_filters),
  ].join("\n");

  const rules =
    metric.validation_rules.length === 0
      ? "_No validation rules._"
      : metric.validation_rules
          .map(
            (r) =>
              `### ${r.rule_type} (${r.severity})\n\n${r.description}\n\n\`\`\`sql\n${r.sql_check_template || "-- no SQL check"}\n\`\`\`\n\n- Failure: ${r.failure_message}\n- Owner action: ${r.owner_action}`,
          )
          .join("\n\n");

  const examples =
    metric.usage_examples.length === 0
      ? "_No usage examples._"
      : metric.usage_examples
          .map(
            (e) =>
              `### ${e.type === "correct" ? "Correct" : "Incorrect"}: ${e.title}\n\n${e.description}\n\n_${e.explanation}_`,
          )
          .join("\n\n");

  const alerts =
    validation.alerts.length === 0
      ? "_No alerts._"
      : validation.alerts
          .map((a) => `- **${a.severity}** \`${a.code}\`: ${a.message}`)
          .join("\n");

  const scoreBreakdown = maturity.components
    .map(
      (c) =>
        `- **${c.label}:** ${c.earned}/${c.max}\n${c.details.map((d) => `  - ${d}`).join("\n")}`,
    )
    .join("\n");

  const parts = [
    `# Metric Contract: ${metric.name || metric.slug || "Untitled"}`,
    "",
    `> Maturity score: **${maturity.score}/100** — ${maturity.summary}`,
    "",
    section("Identity", identity),
    section("Business definition", business),
    section("Formula & fields", formula),
    section("Source & granularity", source),
    section("Validation rules", rules),
    section("Limitations", metric.limitations || "_not defined_"),
    section("Usage examples", examples),
    section("Maturity breakdown", scoreBreakdown),
    section("Alerts", alerts),
    section("SQL template", `\`\`\`sql\n${sql}\n\`\`\``),
    section(
      "Quality checklist",
      checklist.map((item, i) => `${i + 1}. ${item}`).join("\n"),
    ),
    "---",
    "",
    "_Exported from Metric Contract Studio._",
    "",
  ];

  return parts.join("\n");
}
