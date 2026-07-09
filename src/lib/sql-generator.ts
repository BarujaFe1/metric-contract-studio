import { isRatioLike, type MetricContract } from "./metric-model";

function placeholder(value: string | null | undefined, fallback: string): string {
  if (!value || !value.trim()) return fallback;
  return value.trim();
}

export function generateSqlTemplate(metric: MetricContract): string {
  const slug = placeholder(metric.slug, "metric_name");
  const sourceTable = placeholder(metric.source_table, "{{ source_table }}");
  const grain = placeholder(metric.grain, "{{ grain_column }}");
  const filters = placeholder(
    metric.default_filters,
    "1 = 1 -- add default filters",
  );
  const header = [
    "-- Template gerado pelo Metric Contract Studio",
    `-- Métrica: ${metric.name || slug}`,
    `-- Tipo: ${metric.metric_type}`,
    "-- Revise nomes reais de schema/tabela antes de executar.",
    "-- Este SQL é um template documentado, não uma query pronta para produção.",
    "",
  ].join("\n");

  if (isRatioLike(metric.metric_type)) {
    const numerator = placeholder(
      metric.numerator_definition,
      "{{ numerator_condition }}",
    );
    const denominator = placeholder(
      metric.denominator_definition,
      "{{ denominator_condition }}",
    );

    return (
      header +
      `with base as (
  select
    ${grain} as metric_grain,
    (${numerator}) as numerator_flag,
    (${denominator}) as denominator_flag
  from ${sourceTable}
  where ${filters}
)
select
  metric_grain,
  sum(case when numerator_flag then 1 else 0 end) * 1.0 /
  nullif(sum(case when denominator_flag then 1 else 0 end), 0) as ${slug}
from base
group by metric_grain;`
    );
  }

  if (metric.metric_type === "sum") {
    const measure = placeholder(
      metric.fields.find((f) => f.required)?.source_column,
      "{{ measure_column }}",
    );
    return (
      header +
      `select
  ${grain} as metric_grain,
  sum(${measure}) as ${slug}
from ${sourceTable}
where ${filters}
group by 1;`
    );
  }

  if (metric.metric_type === "average") {
    const measure = placeholder(
      metric.fields.find((f) => f.required)?.source_column,
      "{{ measure_column }}",
    );
    return (
      header +
      `select
  ${grain} as metric_grain,
  avg(${measure}) as ${slug}
from ${sourceTable}
where ${filters}
group by 1;`
    );
  }

  if (metric.metric_type === "percentile") {
    const measure = placeholder(
      metric.fields.find((f) => f.required)?.source_column,
      "{{ measure_column }}",
    );
    return (
      header +
      `select
  ${grain} as metric_grain,
  percentile_cont(0.5) within group (order by ${measure}) as ${slug}
from ${sourceTable}
where ${filters}
group by 1;`
    );
  }

  // count (default)
  return (
    header +
    `select
  ${grain} as metric_grain,
  count(*) as ${slug}
from ${sourceTable}
where ${filters}
group by 1;`
  );
}

export function generateQualityChecklist(metric: MetricContract): string[] {
  return [
    `Confirm business question is still valid: "${metric.business_question || "—"}"`,
    `Validate grain "${metric.grain || "—"}" against source uniqueness`,
    `Reconcile ${metric.slug || "metric"} against a trusted source for the last 7 days`,
    "Check null rates on required fields",
    "Verify default filters do not silently drop valid rows",
    "Review limitations with a business stakeholder",
    "Confirm owner and refresh frequency are still accurate",
    "Run each validation rule SQL check template in a sandbox",
    "Document any known breakages in the contract limitations",
    "Export Markdown and attach to the metric wiki / PR",
  ];
}
