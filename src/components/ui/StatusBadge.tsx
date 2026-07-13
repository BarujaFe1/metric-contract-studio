import type { MetricStatus, RuleSeverity } from "@/lib/metric-model";
import { STATUS_LABELS } from "@/lib/metric-model";

const STATUS_STYLES: Record<MetricStatus, string> = {
  ready:
    "bg-[var(--ready-soft)] text-[var(--ready)] border-[color-mix(in_srgb,var(--ready)_25%,transparent)]",
  draft:
    "bg-[var(--draft-soft)] text-[var(--draft)] border-[color-mix(in_srgb,var(--draft)_25%,transparent)]",
  in_review:
    "bg-[var(--info-soft)] text-[var(--info)] border-[color-mix(in_srgb,var(--info)_25%,transparent)]",
  deprecated:
    "bg-[var(--deprecated-soft)] text-[var(--deprecated)] border-[color-mix(in_srgb,var(--deprecated)_25%,transparent)]",
};

const SEVERITY_STYLES: Record<RuleSeverity, string> = {
  critical: "bg-[var(--critical-soft)] text-[var(--critical)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  info: "bg-[var(--info-soft)] text-[var(--info)]",
};

export function StatusBadge({ status }: { status: MetricStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: RuleSeverity }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize ${SEVERITY_STYLES[severity]}`}
    >
      {severity}
    </span>
  );
}

export function DomainBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--ink-soft)]">
      {label}
    </span>
  );
}

export function GapBadge({ count }: { count: number }) {
  if (count <= 0) {
    return (
      <span className="inline-flex items-center rounded-md bg-[var(--ready-soft)] px-2 py-0.5 text-xs font-medium text-[var(--ready)]">
        No critical gaps
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-[var(--critical-soft)] px-2 py-0.5 text-xs font-medium text-[var(--critical)]">
      {count} critical gap{count === 1 ? "" : "s"}
    </span>
  );
}
