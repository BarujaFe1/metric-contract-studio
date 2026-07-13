/**
 * Organizational storytelling case: two teams publish "conversion rate"
 * with incompatible definitions. The studio resolves the conflict into one
 * reviewable contract (aligned with the demo conversion metric).
 */

export interface ConflictingDefinition {
  id: string;
  team: string;
  dashboard_label: string;
  formula: string;
  grain: string;
  filters: string;
  numerator: string;
  denominator: string;
  reported_value: string;
  problem: string;
}

export interface ConflictResolution {
  contract_slug: string;
  contract_name: string;
  agreed_formula: string;
  agreed_grain: string;
  agreed_filters: string;
  owner: string;
  decision: string;
  organizational_impact: string[];
}

export const CONVERSION_CONFLICT = {
  id: "conversion-rate-conflict",
  title: "Conversion rate: two dashboards, one label, incompatible truth",
  subtitle:
    "Marketing and Product both report “conversion rate” — and disagree by ~8pp.",
  context:
    "In a SaaS/e-commerce org, Growth Marketing and Product Analytics both ship a tile named Conversion Rate. Leadership sees different numbers in the same weekly meeting. Neither definition is “wrong” in isolation — they answer different questions with the same label.",
  conflicting: [
    {
      id: "marketing-definition",
      team: "Growth Marketing",
      dashboard_label: "Conversion Rate",
      formula: "paid_orders / unique_users",
      grain: "user-month",
      filters: "exclude internal emails only",
      numerator: "Any paid order in the calendar month",
      denominator: "Unique users who visited the site that month",
      reported_value: "4.8%",
      problem:
        "Mixes sessions and users; includes unpaid returning browsers; inflates the base and hides funnel drop-offs.",
    },
    {
      id: "product-definition",
      team: "Product Analytics",
      dashboard_label: "Conversion Rate",
      formula: "completed_checkouts / qualified_sessions",
      grain: "qualified_session",
      filters: "exclude bots, staff, and incomplete tracking",
      numerator: "Sessions with a completed paid checkout",
      denominator: "Sessions that reached product detail with valid tracking",
      reported_value: "12.6%",
      problem:
        "Narrower funnel — higher rate, but not comparable to Marketing’s user-month view.",
    },
  ] satisfies ConflictingDefinition[],
  resolution: {
    contract_slug: "taxa-de-conversao",
    contract_name: "Taxa de conversão",
    agreed_formula:
      "count(distinct paid_order_id) / count(distinct qualified_session_id)",
    agreed_grain: "qualified_session (session that reached PDP with valid tracking)",
    agreed_filters:
      "exclude bots, staff accounts, and sessions with incomplete tracking",
    owner: "Bruno Costa (Growth Analytics)",
    decision:
      "Keep one public label (“Taxa de conversão”) with an explicit session-grain contract. Marketing keeps a separate contract for “user-month purchase rate” if still needed — different slug, different tile.",
    organizational_impact: [
      "Stops board-meeting number fights caused by shared labels",
      "Forces numerator/denominator and grain into a reviewable artifact",
      "Creates a Markdown/dbt handoff so wiki and semantic layer stay aligned",
      "Makes misuse explicit via incorrect-usage examples on the contract",
    ],
  } satisfies ConflictResolution,
  interview_script: [
    "Show the two conflicting definitions side by side",
    "Open the resolved Taxa de conversão contract",
    "Point at grain, filters, and incorrect usage example",
    "Submit for review → show version history / diff",
    "Export Markdown + dbt YAML as the handoff artifact",
  ],
} as const;
