"use client";

import { useState } from "react";
import { APPROVAL_LABELS, type MetricContract } from "@/lib/metric-model";
import { useMetricStore } from "@/lib/store";
import { canSubmitForReview } from "@/lib/validation";

export function ApprovalPanel({ metric }: { metric: MetricContract }) {
  const submitForReview = useMetricStore((s) => s.submitForReview);
  const approveMetric = useMetricStore((s) => s.approveMetric);
  const rejectMetric = useMetricStore((s) => s.rejectMetric);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const gate = canSubmitForReview(metric);

  function run(
    action: () => { ok: true; metric: MetricContract } | { ok: false; reason: string },
    success: string,
  ) {
    const result = action();
    if (!result.ok) {
      setMessage(result.reason);
      return;
    }
    setMessage(success);
    setNote("");
  }

  return (
    <section className="surface space-y-3 p-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          Local review workflow
        </p>
        <h2 className="font-display mt-1 text-xl tracking-tight">Approval</h2>
        <p className="mt-1 text-xs text-[var(--ink-soft)]">
          Simulated single-browser review — not multi-user collaboration.
        </p>
      </div>

      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-[var(--ink-faint)]">State</dt>
          <dd className="font-medium text-[var(--ink)]">
            {APPROVAL_LABELS[metric.approval.state]}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[var(--ink-faint)]">Version</dt>
          <dd className="font-mono text-xs text-[var(--ink)]">v{metric.version}</dd>
        </div>
        {metric.approval.decision_note ? (
          <div>
            <dt className="text-[var(--ink-faint)]">Last note</dt>
            <dd className="mt-1 text-[var(--ink-soft)]">
              {metric.approval.decision_note}
            </dd>
          </div>
        ) : null}
      </dl>

      <label className="block text-sm">
        <span className="mb-1 block text-xs text-[var(--ink-faint)]">
          Decision note
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
          placeholder="Optional note for approve/reject"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {(metric.status === "draft" || metric.status === "ready") && (
          <button
            type="button"
            disabled={!gate.ok}
            title={gate.reason}
            onClick={() =>
              run(() => submitForReview(metric.id), "Submitted for review.")
            }
            className="rounded-md bg-[var(--brand)] px-3 py-2 text-sm font-medium text-[var(--bg-elevated)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit for review
          </button>
        )}
        {metric.status === "in_review" && (
          <>
            <button
              type="button"
              onClick={() =>
                run(
                  () => approveMetric(metric.id, note),
                  "Approved — status ready.",
                )
              }
              className="rounded-md bg-[var(--ready)] px-3 py-2 text-sm font-medium text-white"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() =>
                run(
                  () => rejectMetric(metric.id, note),
                  "Rejected — back to draft.",
                )
              }
              className="rounded-md border border-[var(--critical)] px-3 py-2 text-sm text-[var(--critical)]"
            >
              Reject
            </button>
          </>
        )}
      </div>

      {!gate.ok && metric.status !== "in_review" ? (
        <p className="text-xs text-[var(--warning)]">{gate.reason}</p>
      ) : null}
      {message ? (
        <p className="text-xs text-[var(--ink-soft)]" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
