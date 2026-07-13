import { describe, expect, it } from "vitest";
import { assertDemoConsistency, getDemoMetrics } from "@/lib/demo-data";
import { exportMetricMarkdown } from "@/lib/markdown-export";
import { calculateMaturityScore } from "@/lib/maturity-score";
import {
  createEmptyMetric,
  slugify,
  type MetricContract,
} from "@/lib/metric-model";
import { parseMetricsPayload } from "@/lib/schemas";
import { generateSqlTemplate } from "@/lib/sql-generator";
import { enforceReadyStatus, validateMetric } from "@/lib/validation";

describe("slug generation", () => {
  it("slugifies names with accents and spaces", () => {
    expect(slugify("Taxa de Conversão")).toBe("taxa-de-conversao");
    expect(slugify("  Receita Líquida!! ")).toBe("receita-liquida");
  });
});

describe("metric validation", () => {
  it("flags metric without owner as critical", () => {
    const metric = createEmptyMetric({
      name: "Test",
      business_question: "Why?",
      formula: "count(*) as metric_value",
      source_system: "wh",
      source_table: "analytics.fct",
      grain: "day",
      refresh_frequency: "daily",
      validation_rules: [
        {
          id: "r1",
          metric_id: "x",
          rule_type: "bounds",
          severity: "critical",
          description: "check",
          sql_check_template: "select 1",
          failure_message: "fail",
          owner_action: "fix",
        },
      ],
      owner: "",
    });
    const result = validateMetric(metric);
    expect(result.alerts.some((a) => a.code === "missing_owner")).toBe(true);
    expect(result.canBeReady).toBe(false);
  });

  it("flags metric without grain as critical", () => {
    const metric = createEmptyMetric({
      name: "Test",
      owner: "Ana",
      business_question: "Why?",
      formula: "count(*) as metric_value",
      source_system: "wh",
      source_table: "analytics.fct",
      grain: "",
      refresh_frequency: "daily",
      validation_rules: [
        {
          id: "r1",
          metric_id: "x",
          rule_type: "bounds",
          severity: "critical",
          description: "check",
          sql_check_template: "select 1",
          failure_message: "fail",
          owner_action: "fix",
        },
      ],
    });
    const result = validateMetric(metric);
    expect(result.alerts.some((a) => a.code === "missing_grain")).toBe(true);
  });

  it("requires numerator and denominator for rate metrics", () => {
    const metric = createEmptyMetric({
      name: "Conversion",
      owner: "Bruno",
      business_question: "What converts?",
      formula: "numerator / denominator expression",
      source_system: "wh",
      source_table: "analytics.fct_sessions",
      grain: "session_id",
      refresh_frequency: "hourly",
      metric_type: "rate",
      numerator_definition: null,
      denominator_definition: null,
      validation_rules: [
        {
          id: "r1",
          metric_id: "x",
          rule_type: "bounds",
          severity: "critical",
          description: "check",
          sql_check_template: "select 1",
          failure_message: "fail",
          owner_action: "fix",
        },
      ],
    });
    const result = validateMetric(metric);
    expect(result.alerts.some((a) => a.code === "missing_numerator")).toBe(true);
    expect(result.alerts.some((a) => a.code === "missing_denominator")).toBe(
      true,
    );
  });

  it("downgrades ready status when critical gaps exist", () => {
    const metric = createEmptyMetric({
      name: "Broken ready",
      status: "ready",
      owner: "",
      business_question: "",
      formula: "",
    });
    const enforced = enforceReadyStatus(metric);
    expect(enforced.status).toBe("draft");
  });

  it("keeps ready status when contract is complete", () => {
    const demo = getDemoMetrics()[0];
    const enforced = enforceReadyStatus({ ...demo, status: "ready" });
    expect(enforced.status).toBe("ready");
    expect(validateMetric(enforced).canBeReady).toBe(true);
  });
});

describe("maturity score", () => {
  it("scores a rich demo metric highly", () => {
    const demos = getDemoMetrics();
    const conversion = demos.find((m) => m.slug === "taxa-de-conversao");
    expect(conversion).toBeTruthy();
    const score = calculateMaturityScore(conversion as MetricContract);
    expect(score.score).toBeGreaterThanOrEqual(80);
    expect(score.components).toHaveLength(6);
    expect(score.components.reduce((s, c) => s + c.max, 0)).toBe(100);
  });

  it("scores an empty metric low", () => {
    const score = calculateMaturityScore(createEmptyMetric({ name: "Empty" }));
    expect(score.score).toBeLessThan(40);
  });
});

describe("markdown export", () => {
  it("includes key sections", () => {
    const metric = getDemoMetrics()[0];
    const md = exportMetricMarkdown(metric);
    expect(md).toContain("# Metric Contract:");
    expect(md).toContain("## Maturity breakdown");
    expect(md).toContain("## SQL template");
    expect(md).toContain(metric.name);
  });
});

describe("sql template generation", () => {
  it("generates ratio template for conversion rate", () => {
    const metric = getDemoMetrics().find(
      (m) => m.slug === "taxa-de-conversao",
    ) as MetricContract;
    const sql = generateSqlTemplate(metric);
    expect(sql).toContain("numerator_flag");
    expect(sql).toContain("denominator_flag");
    expect(sql).toContain(metric.source_table);
    expect(sql).toContain("group by metric_grain");
  });

  it("generates sum template for net revenue", () => {
    const metric = getDemoMetrics().find(
      (m) => m.slug === "receita-liquida",
    ) as MetricContract;
    const sql = generateSqlTemplate(metric);
    expect(sql).toContain("sum(");
    expect(sql).toContain(metric.slug);
  });
});

describe("demo data consistency", () => {
  it("has five complete demo metrics", () => {
    const result = assertDemoConsistency();
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(getDemoMetrics()).toHaveLength(5);
  });
});

describe("schema persistence boundary", () => {
  it("accepts valid demo metrics payload", () => {
    const parsed = parseMetricsPayload(getDemoMetrics());
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.metrics).toHaveLength(5);
    }
  });

  it("rejects corrupt payload without throwing", () => {
    const parsed = parseMetricsPayload([{ id: "broken" }]);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.length).toBeGreaterThan(0);
      expect(parsed.metrics).toEqual([]);
    }
  });
});
