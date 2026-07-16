<div align="center">
  <img src="./assets/icon.png" alt="Metric Contract Studio Logo" width="120" height="120" />

  <h1>Metric Contract Studio</h1>

  <p><strong>Crie, valide, pontue e exporte contratos de métricas de negócio para governança de analytics.</strong></p>
  <p><strong>Create, validate, score and export business metric contracts for analytics engineering governance.</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a> ·
    <a href="#english">English</a> ·
    <a href="#live-demo">Live Demo</a> ·
    <a href="#stack">Stack</a> ·
    <a href="#architecture">Architecture</a> ·
    <a href="#quick-start">Quick Start</a> ·
    <a href="#author">Author</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Zustand" src="https://img.shields.io/badge/Zustand-localStorage-764ABC?style=for-the-badge" />
    <img alt="Zod" src="https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge" />
    <img alt="Status" src="https://img.shields.io/badge/Status-Lab%20demo-22C55E?style=for-the-badge" />
    <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
  </p>

  <p>
    <a href="https://metric-contract-studio.vercel.app"><strong>Live Demo</strong></a> ·
    <a href="https://github.com/BarujaFe1/metric-contract-studio"><strong>Repo</strong></a> ·
    <a href="https://barujafe.vercel.app/"><strong>Portfolio</strong></a> ·
    <a href="https://www.linkedin.com/in/barujafe/"><strong>LinkedIn</strong></a>
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.png" alt="Metric Contract Studio overview" width="100%" />
</p>

> **Lab / demo notice:** frontend-first portfolio app with **localStorage** persistence. Not a multi-user metric catalog, not a warehouse executor, and not a dbt/MetricFlow replacement.

---

## PT-BR

### Visão geral
O **Metric Contract Studio** trata métricas como contratos: pergunta de negócio, fórmula, grain, owner, validações, limitações, score de maturidade explicável, template SQL e export Markdown.

### Problema
Times discutem receita, conversão e churn porque cada dashboard carrega uma definição diferente — e ninguém tem um artefato compartilhado de governança.

### Para quem
Analytics engineers, data analysts e product analysts que precisam padronizar KPIs antes do deck executivo.

### Funcionalidades
- Biblioteca de métricas e editor de contrato
- Validação com Zod e regras de completude
- Score de maturidade 0–100 explicável (pontos ganhos/perdidos)
- Alertas críticos (ex.: taxa sem denominador)
- Geração de template SQL + export Markdown
- 5 métricas demo SaaS/e-commerce no primeiro acesso
- Testes Vitest da lógica de domínio

### Escopo e limites (honestos)
- Sem backend, auth ou colaboração multi-usuário
- SQL é documentação/template — **não executa** no warehouse
- Sem integração dbt / MetricFlow / semantic layer
- Persistência apenas em `localStorage`

---

## English

### Overview
**Metric Contract Studio** treats metrics as contracts: business question, formula, grain, owner, validations, limitations, explainable maturity score, SQL template and Markdown export.

### Problem
Teams argue about revenue, conversion and churn because every dashboard encodes a different definition — with no shared governance artifact.

### Who it is for
Analytics engineers, data analysts and product analysts who need KPI contracts before the board deck.

### Features
- Metrics library and contract editor
- Zod validation and completeness rules
- Explainable 0–100 maturity score (earned vs lost points)
- Critical alerts (e.g. rate without denominator)
- SQL template generation + Markdown export
- Five SaaS/e-commerce demo metrics on first visit
- Vitest coverage for domain logic

### Scope and honest limits
- No backend, auth or multi-user collaboration
- SQL is documentation/template — **does not execute** in a warehouse
- No dbt / MetricFlow / semantic-layer sync
- Persistence is `localStorage` only

---

## Live Demo

| Surface | URL |
|---|---|
| **Public lab** | [https://metric-contract-studio.vercel.app](https://metric-contract-studio.vercel.app) |
| **GitHub** | [https://github.com/BarujaFe1/metric-contract-studio](https://github.com/BarujaFe1/metric-contract-studio) |

**How to try:** open the app → browse demo contracts → open maturity score → trigger a validation alert → generate SQL template → export Markdown.

---

## Screenshots

<table>
  <tr>
    <td width="50%"><img src="./assets/screenshots/01-home-hero.png" alt="Home" /><br /><sub><strong>Home</strong></sub></td>
    <td width="50%"><img src="./assets/screenshots/02-metrics-library.png" alt="Library" /><br /><sub><strong>Metrics library</strong></sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="./assets/screenshots/03-metric-detail.png" alt="Detail" /><br /><sub><strong>Metric detail</strong></sub></td>
    <td width="50%"><img src="./assets/screenshots/04-metric-editor.png" alt="Editor" /><br /><sub><strong>Editor</strong></sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="./assets/screenshots/05-sql-and-export.png" alt="SQL export" /><br /><sub><strong>SQL + export</strong></sub></td>
    <td width="50%"><img src="./assets/screenshots/06-methodology.png" alt="Methodology" /><br /><sub><strong>Methodology</strong></sub></td>
  </tr>
</table>

---

## Stack

| Layer | Technology |
|---|---|
| App | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| State / validation | Zustand, Zod, uuid, localStorage |
| Charts / tests | Recharts, Vitest |

---

## Architecture

```txt
src/
  app/            Next.js App Router pages
  components/     UI (forms, metrics, layout, export)
  lib/            metric-model, validation, maturity-score, sql-generator, storage, store
  tests/          Vitest domain tests
assets/           icon, hero, screenshots
```

Flow: edit contract → validate → score maturity → SQL template / Markdown export → persist in browser storage.

---

## Quick Start

**Prerequisites:** Node.js 20+, npm, Git.

```bash
git clone https://github.com/BarujaFe1/metric-contract-studio.git
cd metric-contract-studio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo metrics load automatically on first visit.

```bash
npm test
```

---

## Technical decisions

- **Frontend-first** so the demo deploys without a database
- **Explainable maturity score** to make governance measurable, not subjective
- **SQL as artifact** (not execution) to keep warehouse risk out of the MVP
- **Zustand + localStorage** for a realistic internal-tool feel with zero infra

---

## Roadmap

- API + database persistence
- Review workflow and contract versioning
- Export to dbt docs / semantic layer
- Optional Playwright path: create → validate → export

---

## Author

**Felipe Alirio Baruja** — data / product / full-stack portfolio.

- Portfolio: [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- GitHub: [https://github.com/BarujaFe1](https://github.com/BarujaFe1)
- LinkedIn: [https://www.linkedin.com/in/barujafe/](https://www.linkedin.com/in/barujafe/)

---

## License

MIT — see [`LICENSE`](./LICENSE).
