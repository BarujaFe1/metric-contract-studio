<div align="center">
  <img src="./assets/icon.png" alt="Metric Contract Studio Logo" width="120" height="120" />

  <h1>Metric Contract Studio</h1>

  <p><strong>Turn ambiguous KPIs into validated, scored, exportable metric contracts.</strong></p>
  <p><em>Analytics engineering governance — before the dashboard argument starts.</em></p>

  <p>
    <a href="https://metric-contract-studio.vercel.app"><strong>Live Demo</strong></a> •
    <a href="#problem">Problem</a> •
    <a href="#solution">Solution</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#what-this-project-demonstrates">Portfolio signal</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Vitest" src="https://img.shields.io/badge/Vitest-Tests-729B1B?style=for-the-badge&logo=vitest&logoColor=white" />
    <img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel" />
    <img alt="Governance" src="https://img.shields.io/badge/Focus-Metric%20Governance-0F5C4C?style=for-the-badge" />
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.png" alt="Metric Contract Studio overview" width="100%" />
</p>

---

## Status

**Portfolio MVP — code on `feat/contract-governance-demo`.** Frontend-only (Zustand + localStorage). Five demo contracts, local review/versioning, Markdown + dbt YAML templates, and a conversion conflict case.

Live URL: [https://metric-contract-studio.vercel.app](https://metric-contract-studio.vercel.app)

> **Deploy note:** Production currently tracks `main`. This branch’s governance features are live only after merge/redeploy. Until then, use `npm run dev` for the full walkthrough.

---

## Problem

Revenue, conversion, churn, and activation look simple on a slide — and collapse in production when:

- grain is tribal knowledge (order vs session vs user);
- filters live in Slack, not in a contract;
- owners are “data team”;
- rates have no numerator/denominator;
- dashboards reuse the same label with different SQL.

The missing layer is not another chart. It is a **reviewable definition**.

---

## Solution

**Metric Contract Studio** turns a KPI into a contract with:

- identity, business question, formula, source, grain, owner;
- validation rules and misuse examples;
- an **explainable maturity score (0–100)**;
- SQL template + quality checklist;
- Markdown export for wiki/PR handoff.

> **Governance notice**  
> This product documents and validates metric definitions. It does **not** execute SQL against warehouses and does **not** replace dbt/MetricFlow in the MVP.

---

## Product preview

<p align="center">
  <img src="./assets/screenshots/02-metrics-library.png" alt="Metrics library" width="100%" />
</p>

Five ready demo contracts — net revenue, conversion rate, monthly churn, average order value, user activation — with scores, gap badges, and owners.

---

## Core features

| Feature | What it does |
| --- | --- |
| Metric library | Filter by domain/status, open contracts, load demos |
| Contract editor | Sectioned form with live score + critical/warning alerts |
| Ready gates | Blocks `ready` / `in_review` when owner/formula/source/grain/rules (and ratio parts) are missing |
| Local review workflow | Submit → approve/reject (browser-simulated, not multi-user) |
| Version history + diff | Local revision log with governance-field diffs |
| Maturity score | Six explainable components totaling 100 |
| SQL templates | Documented templates by metric type |
| Markdown + dbt YAML export | Wiki/PR handoff + semantic-layer **documentation** template |
| Conflict case | Marketing vs Product “conversion rate” resolved into one contract |
| Local persistence | `localStorage` with Zod soft-parse on load |

---

## Architecture

```text
src/
├── app/                 # Next.js App Router pages (+ /cases/conversion-conflict)
├── components/          # UI, forms, export, approval, version history
└── lib/                 # Pure domain
    ├── metric-model.ts
    ├── validation.ts
    ├── maturity-score.ts
    ├── contract-diff.ts
    ├── contract-versions.ts
    ├── sql-generator.ts
    ├── markdown-export.ts
    ├── dbt-export.ts
    ├── conflict-case.ts
    ├── schemas.ts       # Zod persistence boundary
    ├── storage.ts
    ├── store.ts
    └── demo-data.ts
```

Details: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

<p align="center">
  <img src="./assets/architecture-pipeline.png" alt="Pipeline" width="100%" />
</p>

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Zustand** + **localStorage**
- **Zod** (persistence validation)
- **Recharts** (maturity visualization)
- **Vitest** + ESLint + GitHub Actions CI
- **Vercel** deploy

---

## Quick start

### Prerequisites

- Node.js 20+
- npm

### Run locally

```bash
git clone https://github.com/BarujaFe1/metric-contract-studio.git
cd metric-contract-studio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demos seed automatically on first visit.

### Environment

```bash
cp .env.example .env.local
```

No secrets required for the MVP. See `.env.example`.

---

## Scripts

```bash
npm run dev         # development server
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Vitest
npm run build       # production build
npm run quality     # lint + typecheck + test + build
```

---

## Tests

Domain tests cover slugify, validation gates, ready enforcement, maturity scoring, SQL/Markdown generation, demo consistency, and Zod payload parsing.

See [`docs/TESTING.md`](./docs/TESTING.md).

---

## Technical decisions & trade-offs

| Choice | Trade-off |
| --- | --- |
| Local-first, no backend | Instant demo; no multi-user sync |
| Pure `lib/` domain | Easy tests; UI stays thin |
| SQL as template only | Honest about non-execution |
| Explainable score | More code than a single heuristic |

More: [`docs/TECHNICAL_DECISIONS.md`](./docs/TECHNICAL_DECISIONS.md)

---

## Roadmap

- **Now:** Local contracts, score, local review + version diff, Markdown/dbt YAML templates, conflict case, CI
- **Next:** Shared persistence (API + Postgres) and real multi-user review
- **Later:** Wired MetricFlow/dbt sync, connected quality checks, Playwright E2E

---

## What this project demonstrates

- Analytics engineering **governance thinking** (definition before dashboard)
- Organizational storytelling via a **metric conflict case**
- Typed domain modeling with **testable pure functions**
- Local review/versioning as an honest MVP of approval workflows
- Portfolio honesty: clear MVP boundaries (no fake multi-tenant backend)

---

## How I would present this in an interview

1. **Problem:** Open `/cases/conversion-conflict` — two dashboards, same label, incompatible grain.
2. **Resolution:** Open `Taxa de conversão` — one agreed formula/grain/owner.
3. **Policy:** Show critical gates + maturity breakdown.
4. **Workflow:** Submit for review → approve → show version history/diff.
5. **Handoff:** Export Markdown + dbt YAML (documentation template, not executed).
6. **Trade-off:** Why local-first first; what real collaboration would require next.

Interview framing: [`docs/portfolio-case.md`](./docs/portfolio-case.md) · [`docs/PORTFOLIO_HANDOFF.md`](./docs/PORTFOLIO_HANDOFF.md)

---

## Documentation map

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- [`docs/TECHNICAL_DECISIONS.md`](./docs/TECHNICAL_DECISIONS.md)
- [`docs/TESTING.md`](./docs/TESTING.md)
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)
- [`docs/AUDIT_REPORT.md`](./docs/AUDIT_REPORT.md)
- [`docs/HANDOFF.md`](./docs/HANDOFF.md)
- [`docs/PORTFOLIO_HANDOFF.md`](./docs/PORTFOLIO_HANDOFF.md)
- [`docs/CHANGELOG.md`](./docs/CHANGELOG.md)
- [`docs/metric-contract-methodology.md`](./docs/metric-contract-methodology.md)

---

## Author

**Felipe Alirio Baruja**

- Portfolio: [barujafe.vercel.app](https://barujafe.vercel.app/)
- GitHub: [@BarujaFe1](https://github.com/BarujaFe1)
- LinkedIn: [Gustavo Felipe Alirio Baruja](https://www.linkedin.com/in/barujafe/)

---

## License

MIT © 2026 Felipe Alirio Baruja — see [`LICENSE`](./LICENSE).
