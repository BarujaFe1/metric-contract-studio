import type { ValidationAlert } from "@/lib/validation";
import { SeverityBadge } from "@/components/ui/StatusBadge";

export function MissingFieldsPanel({ alerts }: { alerts: ValidationAlert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="surface-muted px-4 py-3 text-sm text-[var(--ready)]">
        Contract looks complete — no open alerts.
      </div>
    );
  }

  const critical = alerts.filter((a) => a.severity === "critical");
  const warnings = alerts.filter((a) => a.severity === "warning");
  const info = alerts.filter((a) => a.severity === "info");

  return (
    <div className="surface overflow-hidden">
      <div className="border-b border-[var(--line)] px-4 py-3">
        <h3 className="font-display text-lg">Gaps & alerts</h3>
        <p className="text-sm text-[var(--ink-soft)]">
          {critical.length} critical · {warnings.length} warning · {info.length}{" "}
          info
        </p>
      </div>
      <ul className="divide-y divide-[var(--line)]">
        {alerts.map((alert) => (
          <li key={alert.code} className="flex items-start gap-3 px-4 py-3">
            <SeverityBadge severity={alert.severity} />
            <div>
              <p className="text-sm text-[var(--ink)]">{alert.message}</p>
              {alert.field ? (
                <p className="mt-1 font-mono text-[11px] text-[var(--ink-faint)]">
                  field: {alert.field}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
