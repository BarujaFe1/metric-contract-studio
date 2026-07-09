"use client";

import { useState } from "react";
import type { MetricContract } from "@/lib/metric-model";
import { exportMetricMarkdown } from "@/lib/markdown-export";

export function MarkdownExportButton({ metric }: { metric: MetricContract }) {
  const [done, setDone] = useState(false);

  function download() {
    const markdown = exportMetricMarkdown(metric);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${metric.slug || "metric-contract"}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={download}
      className="rounded-md border border-[var(--line-strong)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand-deep)]"
    >
      {done ? "Export complete" : "Export Markdown"}
    </button>
  );
}
