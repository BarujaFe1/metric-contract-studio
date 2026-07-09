import Link from "next/link";

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          Methodology
        </p>
        <h1 className="font-display mt-1 text-4xl tracking-tight">
          What is a metric contract?
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--ink-soft)]">
          A metric contract is a reviewable definition of a business KPI: the
          question it answers, how it is calculated, where it comes from, who
          owns it, how it is validated, and how it should not be used.
        </p>
      </div>

      <section className="surface prose-contract p-6">
        <h2>Why metrics break</h2>
        <p>
          Metrics fail socially before they fail mathematically. Two dashboards
          can both be &quot;correct&quot; while answering different questions —
          different grains, filters, refund policies, or attribution windows.
        </p>
        <p>
          Without a contract, debates become opinion contests. With a contract,
          disagreements become change requests against a shared artifact.
        </p>

        <h2>How to validate a metric</h2>
        <ul>
          <li>Confirm owner, business question, and formula exist.</li>
          <li>Lock grain and default filters to prevent silent scope drift.</li>
          <li>Require at least one validation rule with an owner action.</li>
          <li>For rates/ratios, define numerator and denominator explicitly.</li>
          <li>Document limitations and incorrect usage examples.</li>
        </ul>

        <h2>How to read the maturity score</h2>
        <p>
          The score is explainable and capped at 100. It rewards business
          clarity, formula/fields, source/grain, validations,
          limitations/examples, and ownership/maintenance. A high score does not
          mean the SQL is production-perfect — it means the contract is
          governable.
        </p>

        <h2>What this product does not do</h2>
        <ul>
          <li>It does not execute SQL against your warehouse.</li>
          <li>It does not replace dbt semantic layers in the MVP.</li>
          <li>It does not manage permissions or multi-user workflows.</li>
          <li>It does not auto-generate metrics with AI.</li>
        </ul>
      </section>

      <p className="text-sm text-[var(--ink-soft)]">
        Full write-up in{" "}
        <span className="font-mono text-xs">
          docs/metric-contract-methodology.md
        </span>
        . Explore demos on the{" "}
        <Link href="/examples" className="text-[var(--brand)] hover:underline">
          examples
        </Link>{" "}
        page.
      </p>
    </div>
  );
}
