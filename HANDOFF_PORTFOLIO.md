# HANDOFF_PORTFOLIO.md — Metric Contract Studio

## Short title

Metric Contract Studio

## Short description

Web app for creating, validating, and exporting business metric contracts with maturity scoring.

## Medium description

Metric Contract Studio helps analytics engineers and data teams turn ambiguous KPIs into governed contracts — with formulas, grain, owners, validation rules, explainable maturity scores, SQL templates, and Markdown export. Built as a portfolio product for analytics engineering.

## Long description

Business teams often argue about revenue, conversion, churn, and activation because each dashboard encodes a different definition. Metric Contract Studio treats metrics as contracts: a shared artifact that captures the business question, calculation logic, source and grain, ownership, validation expectations, limitations, and misuse examples.

The MVP is a frontend-first Next.js application with TypeScript domain logic, pure validation rules, a 0–100 explainable maturity score, demo SaaS/e-commerce metrics, SQL template generation, and Markdown export. Persistence uses localStorage so the product is easy to run and demo. The goal is not another form — it is an internal-tool experience that proves governance thinking, data modeling judgment, and product sense for analytics engineering roles.

## Impact bullets

- Codifies metric governance into a reusable product workflow
- Makes completeness measurable with an explainable maturity score
- Reduces misuse via incorrect-usage examples and limitations
- Produces interview-ready artifacts (Markdown contract + SQL template)
- Demonstrates TypeScript modeling and testable analytics rules

## Stack summary

Next.js · TypeScript · Tailwind CSS · Zustand · localStorage · Recharts · Vitest

## Competencies demonstrated

- Analytics engineering / metric governance
- Conceptual data modeling
- Data quality validation design
- Technical documentation as product
- Internal-tool UX
- Strong TypeScript
- Product thinking for data teams

## How to present in an interview

1. Start with the pain: conflicting KPI definitions across teams.
2. Show a demo metric (conversion or churn) and walk the contract sections.
3. Open the maturity score and explain earned vs lost points.
4. Show a critical alert (e.g., rate without denominator) and why `ready` is blocked.
5. Generate SQL template + export Markdown as the operational handoff.
6. Close with honest MVP limits and the next architecture step (dbt/semantic layer sync).

## Honest limitations

- No backend/auth/multi-user collaboration
- SQL is templated documentation, not warehouse execution
- No dbt/MetricFlow integration yet
- localStorage only — not a multi-device source of truth

## Next steps

- API + database persistence
- Review workflow and contract versioning
- Export to dbt docs / semantic layer
- Optional Playwright coverage for create → validate → export

## Suggested LinkedIn post

Most dashboards don’t fail because of chart choices.
They fail because nobody agreed what “conversion” means.

I built Metric Contract Studio — a portfolio app where metrics become contracts:
definition, grain, owner, validations, maturity score, SQL template, and Markdown export.

It’s a small product with a serious point: analytics engineering is governance work, not only SQL work.

If you work with KPIs that keep drifting, this is the workflow I wish every team had before the board deck.
