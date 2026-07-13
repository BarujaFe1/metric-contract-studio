import Link from "next/link";
import { CONVERSION_CONFLICT } from "@/lib/conflict-case";

export default function ConversionConflictCasePage() {
  const { conflicting, resolution, interview_script } = CONVERSION_CONFLICT;

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="text-xs text-[var(--ink-faint)]">
        <Link href="/examples" className="hover:text-[var(--brand)]">
          Examples
        </Link>
        <span aria-hidden> / </span>
        <span className="text-[var(--ink-soft)]">Conflict case</span>
      </nav>

      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          Organizational case study
        </p>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          {CONVERSION_CONFLICT.title}
        </h1>
        <p className="max-w-3xl text-base text-[var(--ink-soft)]">
          {CONVERSION_CONFLICT.subtitle}
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--ink-soft)]">
          {CONVERSION_CONFLICT.context}
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        {conflicting.map((def) => (
          <article key={def.id} className="surface p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--critical)]">
              Conflicting definition
            </p>
            <h2 className="font-display mt-2 text-2xl tracking-tight">
              {def.team}
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-faint)]">
              Dashboard tile: {def.dashboard_label} · reported{" "}
              <span className="font-mono text-[var(--ink)]">
                {def.reported_value}
              </span>
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-[var(--ink-faint)]">Formula</dt>
                <dd className="mt-1 font-mono text-xs">{def.formula}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-faint)]">Grain</dt>
                <dd className="mt-1">{def.grain}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-faint)]">Filters</dt>
                <dd className="mt-1">{def.filters}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-faint)]">Numerator</dt>
                <dd className="mt-1">{def.numerator}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-faint)]">Denominator</dt>
                <dd className="mt-1">{def.denominator}</dd>
              </div>
            </dl>
            <p className="mt-4 rounded-md bg-[var(--critical-soft)] p-3 text-sm text-[var(--critical)]">
              {def.problem}
            </p>
          </article>
        ))}
      </section>

      <section className="surface space-y-4 border-[color-mix(in_srgb,var(--ready)_35%,var(--line))] p-6">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ready)]">
          Resolved by contract
        </p>
        <h2 className="font-display text-3xl tracking-tight">
          {resolution.contract_name}
        </h2>
        <p className="text-sm text-[var(--ink-soft)]">{resolution.decision}</p>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-[var(--ink-faint)]">Agreed formula</dt>
            <dd className="mt-1 font-mono text-xs">{resolution.agreed_formula}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--ink-faint)]">Agreed grain</dt>
            <dd className="mt-1">{resolution.agreed_grain}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--ink-faint)]">Agreed filters</dt>
            <dd className="mt-1">{resolution.agreed_filters}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--ink-faint)]">Owner</dt>
            <dd className="mt-1">{resolution.owner}</dd>
          </div>
        </dl>
        <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
          {resolution.organizational_impact.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={`/metrics/${resolution.contract_slug}`}
            className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--bg-elevated)]"
          >
            Open resolved contract
          </Link>
          <Link
            href="/metrics"
            className="rounded-md border border-[var(--line)] px-4 py-2 text-sm"
          >
            Load demos in library
          </Link>
        </div>
      </section>

      <section className="surface-muted p-5">
        <h2 className="font-display text-2xl tracking-tight">
          3–5 minute demo script
        </h2>
        <ol className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
          {interview_script.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="font-mono text-xs text-[var(--brand)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
