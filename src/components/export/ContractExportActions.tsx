"use client";

import { useState } from "react";
import { exportDbtMetricYaml } from "@/lib/dbt-export";
import { exportMetricMarkdown } from "@/lib/markdown-export";
import type { MetricContract } from "@/lib/metric-model";

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ContractExportActions({ metric }: { metric: MetricContract }) {
  const [message, setMessage] = useState<string | null>(null);

  function flash(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(null), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => {
          downloadBlob(
            `${metric.slug || "metric-contract"}.md`,
            exportMetricMarkdown(metric),
            "text/markdown;charset=utf-8",
          );
          flash("Markdown exported");
        }}
        className="rounded-md border border-[var(--line-strong)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium hover:border-[var(--brand)]"
      >
        Export Markdown
      </button>
      <button
        type="button"
        onClick={() => {
          downloadBlob(
            `${metric.slug || "metric"}.yml`,
            exportDbtMetricYaml(metric),
            "text/yaml;charset=utf-8",
          );
          flash("dbt YAML template exported");
        }}
        className="rounded-md border border-[var(--line-strong)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium hover:border-[var(--brand)]"
      >
        Export dbt YAML
      </button>
      {message ? (
        <span className="text-xs text-[var(--ink-soft)]" role="status">
          {message}
        </span>
      ) : null}
    </div>
  );
}
