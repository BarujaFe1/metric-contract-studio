"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMetricStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/metrics", label: "Library" },
  { href: "/metrics/new", label: "New metric" },
  { href: "/examples", label: "Examples" },
  { href: "/methodology", label: "Methodology" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hydrate = useMetricStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--brand)] text-sm font-semibold text-[var(--bg-elevated)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]"
            >
              MC
            </span>
            <span>
              <span className="font-display block text-lg leading-none tracking-tight text-[var(--ink)]">
                Metric Contract Studio
              </span>
              <span className="text-xs text-[var(--ink-faint)]">
                Analytics governance toolkit
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : item.href === "/metrics"
                    ? pathname === "/metrics" ||
                      (pathname.startsWith("/metrics/") &&
                        !pathname.startsWith("/metrics/new"))
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                      : "text-[var(--ink-soft)] hover:bg-[var(--bg-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/metrics/new"
            className="rounded-md bg-[var(--brand)] px-3 py-2 text-sm font-medium text-[var(--bg-elevated)] transition hover:bg-[var(--brand-deep)]"
          >
            Create metric
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-[var(--line)] px-4 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs text-[var(--ink-soft)] hover:bg-[var(--bg-muted)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-[var(--ink-faint)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Metric Contract Studio — portfolio MVP for analytics engineering.</p>
          <p className="font-mono text-xs">localStorage · no backend · TypeScript</p>
        </div>
      </footer>
    </div>
  );
}
