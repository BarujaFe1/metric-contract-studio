# Technical Decisions — Metric Contract Studio

## ADR-001 — Local-first MVP (no backend)

**Decision:** Ship as a Next.js client app with Zustand + localStorage.

**Why:** Fastest path to a portfolio-ready demo that shows analytics governance judgment without auth, billing, or infra noise.

**Trade-off:** No multi-user sync, no audit trail server-side, data stays in the browser.

## ADR-002 — Pure domain modules over UI coupling

**Decision:** Keep validation, scoring, SQL, and Markdown export as pure TypeScript functions under `src/lib`.

**Why:** Easy to unit test; recruiters can read domain logic without React noise.

## ADR-003 — Dual validation layers

**Decision:**
1. Product rules in `validation.ts` (ready gates, warnings).
2. Structural Zod schemas for persistence payloads.

**Why:** Product rules encode governance policy; Zod protects against corrupt storage JSON.

## ADR-004 — Explainable maturity score (not a black box)

**Decision:** Score is the sum of six labeled components with earned/lost details.

**Why:** Governance products fail when scores cannot be defended in review.

## ADR-005 — SQL as template documentation

**Decision:** Generated SQL is annotated as a template, never executed against a warehouse.

**Why:** Avoid implying production semantic-layer execution in an MVP without connections.

## ADR-006 — Demo seed of five contracts

**Decision:** Auto-seed SaaS/e-commerce metrics on first visit.

**Why:** Time-to-value under five minutes for recruiters and hiring managers.

## ADR-007 — Remove unused `uuid` dependency

**Decision:** Use `crypto.randomUUID()` in the browser.

**Why:** Fewer dependencies, same capability in modern runtimes.
