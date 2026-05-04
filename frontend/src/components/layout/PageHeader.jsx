export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold font-[var(--font-display)] text-[var(--color-text)] tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-[var(--color-faint)] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
