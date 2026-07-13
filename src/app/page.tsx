import Link from "next/link";
import { HomeDemoActions } from "@/components/home/HomeDemoActions";

const BENEFITS = [
  {
    title: "One definition",
    body: "Turn ambiguous KPIs into contracts with formula, grain, owner, and limits.",
  },
  {
    title: "Explainable maturity",
    body: "Score every metric from 0–100 and show exactly which points were earned or lost.",
  },
  {
    title: "Ship documentation",
    body: "Export Markdown, SQL templates, and quality checklists for wiki or PR review.",
  },
];

const JOURNEY = [
  "Open the library and load the five SaaS/e-commerce demos",
  "Inspect conversion rate — score, critical gaps, and ownership",
  "Review the SQL template and quality checklist",
  "Export Markdown for a wiki/PR handoff",
  "Create or edit a draft and watch ready-status gates fire live",
];

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-[18px] border border-[var(--line)] bg-[linear-gradient(135deg,#0f5c4c_0%,#0a3f35_48%,#1c2430_100%)] px-6 py-12 text-[var(--bg-elevated)] sm:px-10 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#d8ebe5]/60">
            Analytics engineering toolkit
          </p>
          <h1 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Metric Contract Studio
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#d8ebe5]/85 sm:text-lg">
            Business teams argue about revenue, conversion, and churn because
            nobody owns a single definition. This studio turns metrics into
            contracts — validated, scored, and exportable.
          </p>
          <div className="mt-8">
            <HomeDemoActions />
          </div>
          <p className="mt-4 text-xs text-[#d8ebe5]/55">
            Frontend-only demo · localStorage · no backend required
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {BENEFITS.map((item) => (
          <article key={item.title} className="surface p-5">
            <h2 className="font-display text-xl tracking-tight">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
              {item.body}
            </p>
          </article>
        ))}
      </section>

      <section className="surface grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Five-minute path
          </p>
          <h2 className="font-display mt-2 text-3xl tracking-tight">
            From ambiguous KPI to reviewable contract
          </h2>
          <ol className="mt-5 space-y-3 text-sm text-[var(--ink-soft)]">
            {JOURNEY.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="font-mono text-xs text-[var(--brand)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="surface-muted grid-noise flex flex-col justify-between p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              Demo set
            </p>
            <p className="font-display mt-2 text-2xl">5 ready contracts</p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Net revenue, conversion rate, monthly churn, average order value,
              and user activation — each with formula, grain, validations, and
              misuse examples.
            </p>
          </div>
          <Link
            href="/examples"
            className="mt-6 text-sm font-medium text-[var(--brand)] hover:underline"
          >
            Browse demo catalog →
          </Link>
        </div>
      </section>

      <section className="surface grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
        <div>
          <h2 className="font-display text-3xl tracking-tight">
            Why metrics break
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
            Dashboards disagree when grain, filters, and ownership are tribal
            knowledge. A metric contract makes the definition reviewable —
            before the board meeting, not during it.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-[var(--ink-soft)]">
            <li>• Missing owner and refresh cadence</li>
            <li>• Ratio metrics without numerator/denominator</li>
            <li>• No validation rules or misuse examples</li>
            <li>• SQL copied from Slack with no source of truth</li>
          </ul>
        </div>
        <div className="surface-muted grid-noise flex flex-col justify-between p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              Portfolio signal
            </p>
            <p className="font-display mt-2 text-2xl">
              Governance as a product
            </p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Built to demonstrate analytics engineering judgment, not just UI
              scaffolding.
            </p>
          </div>
          <Link
            href="/methodology"
            className="mt-6 text-sm font-medium text-[var(--brand)] hover:underline"
          >
            Read the methodology →
          </Link>
        </div>
      </section>
    </div>
  );
}
