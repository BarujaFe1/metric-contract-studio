# Metric contract methodology

## What is a metric contract?

A **metric contract** is a durable, reviewable definition of a business metric. It captures the decision context, calculation logic, data sources, ownership, validation expectations, and known limitations.

It is not a dashboard tile. It is the agreement that makes dashboard tiles trustworthy.

## Why metrics break

Metrics usually break for social and semantic reasons:

1. **Ambiguous grain** — order vs customer vs session vs day
2. **Hidden filters** — test users, bots, unpaid orders, internal accounts
3. **Unowned definitions** — “data team” owns everything, so nobody owns anything
4. **Ratio shortcuts** — rates without explicit numerator/denominator
5. **No misuse examples** — stakeholders invent interpretations under pressure

When two teams report different “conversion,” both may be locally consistent and globally incompatible.

## How to validate a metric

### Critical gates (cannot be `ready`)

- Owner present
- Business question present
- Formula present
- Source system + table present
- Grain present
- Refresh frequency present
- At least one validation rule
- Ratio/rate metrics include numerator and denominator

### Warning signals

- Empty limitations
- No incorrect usage example
- No default filters
- No required fields
- Generic owner labels (“data team”)
- Extremely short formula text

## How to interpret the maturity score

Score range: **0–100**, explainable by component:

| Component | Max |
| --- | --- |
| Business definition | 20 |
| Formula & fields | 20 |
| Source & granularity | 20 |
| Validations | 20 |
| Limitations & examples | 10 |
| Owner & maintenance | 10 |

Interpretation bands used in the product:

- **80+** strong governance signal
- **65–79** solid draft
- **40–64** early contract
- **&lt;40** unsafe for decisions

A high score means the contract is complete enough to govern — not that warehouse SQL is already perfect.

## What the product does not do

- Execute SQL on production warehouses
- Replace dbt/MetricFlow semantic layers
- Provide auth, permissions, or multi-user review queues
- Auto-generate metrics with AI

The MVP optimizes for clarity, portability, and portfolio signal.
