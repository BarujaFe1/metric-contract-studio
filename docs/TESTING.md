# Testing — Metric Contract Studio

## Tooling

- **Vitest** for unit tests (`src/tests/core.test.ts`)
- Domain-first coverage (no brittle UI snapshot suite in MVP)

## Commands

```bash
npm test
npm run test:watch
npm run typecheck
npm run lint
npm run quality   # lint + typecheck + test + build
```

## What is covered

| Area | Assertions |
| --- | --- |
| Slugify | Accents / punctuation |
| Validation | Missing owner, grain, rate numerator/denominator |
| Ready enforcement | Downgrade `ready` → `draft` when critical gaps exist |
| Maturity score | Demo high score; empty metric low score; component max = 100 |
| Markdown export | Key sections present |
| SQL templates | Ratio and sum shapes |
| Demo consistency | Exactly five named contracts with required fields |
| Zod boundary | Accepts demos; rejects corrupt payloads |

## Gaps (intentional for MVP)

- No Playwright E2E yet (localStorage + Next client hydration)
- No visual regression
- No warehouse integration tests (SQL is not executed)

## Adding tests

Prefer pure functions in `src/lib`. Keep fixtures via `createEmptyMetric` / `getDemoMetrics`.
