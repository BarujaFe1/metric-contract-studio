# Metric Contract Studio

Portfolio web app for creating, validating, documenting, and exporting **business metric contracts**.

Built as a career asset for analytics engineering: metric governance, data modeling judgment, data quality thinking, technical documentation, and internal-tool UX.

## Problem

Teams use metrics like revenue, conversion, churn, AOV, and activation without a single shared definition. That produces conflicting dashboards, unproductive debates, and weak decisions.

## Solution

Metric Contract Studio lets you define a metric as a contract:

- business question and description
- formula, fields, numerator/denominator
- source system/table, grain, refresh cadence
- validation rules and quality checklist
- limitations and correct/incorrect usage examples
- explainable maturity score (0–100)
- SQL template + Markdown export

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Zustand + localStorage
- Zod-ready model surface (pure validation functions)
- Recharts (maturity indicator)
- Vitest

No heavy backend in the MVP.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo metrics seed automatically on first visit.

## Test

```bash
npm test
npm run lint
```

## Core flows

1. Open **Library** to browse contracts
2. Click a metric to see score, alerts, SQL, checklist, export
3. **Create** or **Edit** a contract with live maturity feedback
4. Load demos again from the library if needed
5. Export Markdown from the detail page

## Metric contract methodology

A metric contract is a reviewable source of truth for a KPI. It answers:

- What business question does this metric answer?
- How is it calculated, at what grain, with which filters?
- Who owns it and how often does it refresh?
- How do we validate it and how can it be misused?

See `docs/metric-contract-methodology.md`.

## Demo metrics

1. Receita líquida
2. Taxa de conversão
3. Churn mensal
4. Ticket médio
5. Ativação de usuário

Details in `docs/examples.md`.

## Screenshots

> Placeholders — capture after local run for portfolio packaging.

- `docs/screenshots/home.png` — product thesis hero
- `docs/screenshots/library.png` — metric library with scores
- `docs/screenshots/detail.png` — contract detail + SQL + export
- `docs/screenshots/editor.png` — form with live maturity panel

## Limitations

- Persistence is browser `localStorage` only
- SQL templates are documentation aids, not executable warehouse jobs
- No auth, multi-user, dbt sync, or live query execution
- Playwright E2E is optional and not required for MVP

## Next steps

- Persist to SQLite/Postgres API
- dbt semantic layer / MetricFlow export
- Contract review workflow (draft → review → ready)
- Warehouse-connected validation runners
- Portfolio screenshots + short Loom walkthrough

## Portfolio handoff

See `HANDOFF_PORTFOLIO.md` for interview-ready copy.
