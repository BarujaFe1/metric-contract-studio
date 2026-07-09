export function ContractSection({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="surface overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
        <div>
          <h2 className="font-display text-xl tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-[var(--ink-soft)]">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}
