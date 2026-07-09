import Link from "next/link";
import {
  DOMAIN_LABELS,
  METRIC_TYPE_LABELS,
  type MetricContract,
} from "@/lib/metric-model";
import { calculateMaturityScore } from "@/lib/maturity-score";
import { validateMetric } from "@/lib/validation";
import {
  DomainBadge,
  GapBadge,
  StatusBadge,
} from "@/components/ui/StatusBadge";
import { MaturityScore } from "./MaturityScore";

export function MetricCard({ metric }: { metric: MetricContract }) {
  const maturity = calculateMaturityScore(metric);
  const validation = validateMetric(metric);

  return (
    <Link
      href={`/metrics/${metric.id}`}
      className="surface group block p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={metric.status} />
            <DomainBadge label={DOMAIN_LABELS[metric.domain]} />
            <span className="text-xs text-[var(--ink-faint)]">
              {METRIC_TYPE_LABELS[metric.metric_type]}
            </span>
          </div>
          <h3 className="font-display mt-3 text-xl tracking-tight text-[var(--ink)] group-hover:text-[var(--brand-deep)]">
            {metric.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-[var(--ink-faint)]">
            {metric.slug}
          </p>
        </div>
        <MaturityScore result={maturity} compact />
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        {metric.business_question || "No business question defined yet."}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-3">
        <GapBadge count={validation.criticalCount} />
        <span className="text-xs text-[var(--ink-faint)]">
          Owner: {metric.owner || "unassigned"}
        </span>
      </div>
    </Link>
  );
}
