import Link from "next/link";
import { DEMO_METRICS } from "@/lib/demo-data";
import { DOMAIN_LABELS, METRIC_TYPE_LABELS } from "@/lib/metric-model";

export default function ExamplesPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          Demo catalog
        </p>
        <h1 className="font-display mt-1 text-4xl tracking-tight">
          SaaS & e-commerce examples
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
          Five ready-made contracts that show how governance looks for common
          business metrics. Load them into the library to explore scores, SQL,
          and Markdown export.
        </p>
        <Link
          href="/metrics"
          className="mt-4 inline-block text-sm font-medium text-[var(--brand)] hover:underline"
        >
          Open library to load demos →
        </Link>
      </div>

      <div className="space-y-4">
        {DEMO_METRICS.map((metric) => (
          <article key={metric.id} className="surface p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ink-faint)]">
              <span>{DOMAIN_LABELS[metric.domain]}</span>
              <span>·</span>
              <span>{METRIC_TYPE_LABELS[metric.metric_type]}</span>
              <span>·</span>
              <span className="font-mono">{metric.slug}</span>
            </div>
            <h2 className="font-display mt-2 text-2xl tracking-tight">
              {metric.name}
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              {metric.business_question}
            </p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[var(--ink-faint)]">Formula</dt>
                <dd className="mt-1 font-mono text-xs text-[var(--ink)]">
                  {metric.formula}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-faint)]">Source</dt>
                <dd className="mt-1 font-mono text-xs text-[var(--ink)]">
                  {metric.source_table}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-faint)]">Grain</dt>
                <dd className="mt-1 text-[var(--ink)]">{metric.grain}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-faint)]">Owner</dt>
                <dd className="mt-1 text-[var(--ink)]">{metric.owner}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">
              <span className="font-medium text-[var(--ink)]">Limitation: </span>
              {metric.limitations}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
