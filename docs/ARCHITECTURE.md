# Architecture — Metric Contract Studio

## Purpose

Provide a **local-first** studio for analytics engineers to define, validate, score, and export **metric contracts** — the governance layer that should exist before dashboards disagree.

## High-level shape

```text
Browser (Next.js App Router)
  ├── app/*                 UI routes
  ├── components/*          Presentation + forms
  └── lib/*                 Pure domain (model, validation, score, SQL, export)
         └── storage.ts     Persistence adapter (localStorage + Zod boundary)
```

There is **no server API** in the MVP. All CRUD happens in Zustand and persists to `localStorage`.

## Domain modules (`src/lib`)

| Module | Responsibility |
| --- | --- |
| `metric-model.ts` | Types, labels, empty factory, slugify |
| `validation.ts` | Critical/warning gates; ready-status enforcement |
| `maturity-score.ts` | Explainable 0–100 score with component breakdown |
| `sql-generator.ts` | Documented SQL templates + quality checklist |
| `markdown-export.ts` | Handoff artifact for wiki/PR |
| `demo-data.ts` | Five SaaS/e-commerce seed contracts |
| `schemas.ts` | Zod schemas + soft parse for untrusted JSON |
| `storage.ts` | localStorage read/write with schema validation |
| `store.ts` | Zustand store, hydrate/seed/filter CRUD |

## UI routes

| Route | Role |
| --- | --- |
| `/` | Value prop + five-minute demo path |
| `/metrics` | Library with filters + demo loader |
| `/metrics/new` | Create contract |
| `/metrics/[id]` | Detail, SQL, checklist, Markdown export |
| `/metrics/[id]/edit` | Edit with live score/alerts |
| `/examples` | Demo catalog |
| `/methodology` | Contract methodology |

## Data flow

```text
User / Demo seed
  → MetricContract
  → validateMetric()
  → calculateMaturityScore()
  → generateSqlTemplate() / exportMetricMarkdown()
  → saveMetricsToStorage() (JSON)
  → loadMetricsFromStorage() (Zod safeParse)
```

## Trust boundaries

- **Trusted:** in-memory store after validation/enforcement.
- **Untrusted:** anything from `localStorage` → must pass `parseMetricsPayload`.
- **Not executed:** SQL templates are documentation only.

## Future extension points (not in MVP)

- Persist to Postgres / Supabase with RLS
- Auth + workspace multi-tenancy
- Review workflow (draft → review → ready)
- Export to dbt docs / MetricFlow YAML
- Connected warehouse quality runners
