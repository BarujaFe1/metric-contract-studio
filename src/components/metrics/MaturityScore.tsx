"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import {
  maturityBand,
  type MaturityScoreResult,
} from "@/lib/maturity-score";

export function MaturityScore({
  result,
  compact = false,
}: {
  result: MaturityScoreResult;
  compact?: boolean;
}) {
  const band = maturityBand(result.score);
  const color =
    band === "high"
      ? "var(--score-high)"
      : band === "medium"
        ? "var(--score-mid)"
        : "var(--score-low)";

  const data = [
    { name: "earned", value: result.score },
    { name: "remaining", value: Math.max(0, 100 - result.score) },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-lg font-semibold tabular-nums"
          style={{ color }}
        >
          {result.score}
        </span>
        <span className="text-xs text-[var(--ink-faint)]">/100</span>
      </div>
    );
  }

  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Maturity score
          </p>
          <p className="font-display mt-1 text-4xl tracking-tight" style={{ color }}>
            {result.score}
            <span className="text-lg text-[var(--ink-faint)]">/100</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-[var(--ink-soft)]">
            {result.summary}
          </p>
        </div>
        <div className="h-24 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={28}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                <Cell fill={color} />
                <Cell fill="var(--bg-muted)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ul className="mt-5 space-y-3 border-t border-[var(--line)] pt-4">
        {result.components.map((component) => (
          <li key={component.id}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-[var(--ink)]">{component.label}</span>
              <span className="font-mono text-xs text-[var(--ink-soft)]">
                {component.earned}/{component.max}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-muted)]">
              <div
                className="h-full rounded-full bg-[var(--brand)]"
                style={{
                  width: `${(component.earned / component.max) * 100}%`,
                }}
              />
            </div>
            <ul className="mt-1.5 space-y-0.5">
              {component.details.map((detail, index) => (
                <li
                  key={`${component.id}-${index}`}
                  className="font-mono text-[11px] text-[var(--ink-faint)]"
                >
                  {detail}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
