"use client";

import { useState } from "react";

export function SqlTemplateViewer({ sql }: { sql: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[calc(var(--radius)-2px)] border border-[var(--line)] bg-[#1c2430]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <p className="font-mono text-xs text-white/60">SQL template</p>
        <button
          type="button"
          onClick={copy}
          className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white hover:bg-white/15"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-[#d8ebe5]">
        <code>{sql}</code>
      </pre>
    </div>
  );
}
