import { cn } from '../../lib/utils';

export default function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-[var(--color-panel)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6',
        hover && 'transition-all duration-200 hover:border-[var(--color-border2)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-5', className)}>
      <div>
        <h2 className="text-[15px] font-semibold text-[var(--color-text)] font-[var(--font-display)]">{title}</h2>
        {subtitle && <p className="text-xs text-[var(--color-faint)] mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
