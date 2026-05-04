import { CONDITION_COLOR, CONDITION_LABEL, CATEGORY_ICON } from '../../lib/constants';
import { cn } from '../../lib/utils';

export function ConditionBadge({ value }) {
  const color = CONDITION_COLOR[value] || '#94a3b8';
  return (
    <span
      style={{ color: '#05080f', background: color }}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
    >
      {CONDITION_LABEL[value] || value}
    </span>
  );
}

export function CategoryTag({ value }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--color-surface2)] border border-[var(--color-border)] text-xs text-[var(--color-muted)]">
      <span>{CATEGORY_ICON[value] || '▪'}</span>
      {value}
    </span>
  );
}

export function Badge({ children, variant = 'default', className }) {
  const styles = {
    default: 'bg-[var(--color-surface2)] text-[var(--color-muted)] border-[var(--color-border)]',
    accent: 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] border-[var(--color-accent)]/25',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest border', styles[variant], className)}>
      {children}
    </span>
  );
}
