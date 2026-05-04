export default function Empty({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-4xl mb-4 opacity-40">{icon}</div>}
      <p className="text-[var(--color-muted)] text-sm font-medium mb-1">{title}</p>
      {description && <p className="text-[var(--color-faint)] text-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}
