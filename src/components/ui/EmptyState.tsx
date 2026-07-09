import Link from "next/link";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="surface grid-noise flex flex-col items-start gap-4 px-6 py-10">
      <div>
        <h2 className="font-display text-2xl text-[var(--ink)]">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--ink-soft)]">
          {description}
        </p>
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--bg-elevated)] hover:bg-[var(--brand-deep)]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
