import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-[var(--color-accent)] hover:bg-blue-500 text-white shadow-[0_0_20px_var(--color-accent-glow)] hover:shadow-[0_0_30px_var(--color-accent-glow)]',
  ghost: 'border border-[var(--color-border2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] text-[var(--color-muted)]',
  danger: 'border border-[var(--color-rose)]/40 hover:bg-[var(--color-rose)]/10 text-[var(--color-rose)]',
  subtle: 'bg-[var(--color-accent-dim)] hover:bg-[var(--color-accent-dim)]/80 text-[var(--color-accent)] border border-[var(--color-accent)]/25',
};
const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-[var(--radius-sm)]',
  md: 'px-4 py-2.5 text-sm rounded-[var(--radius)]',
  lg: 'px-6 py-3 text-sm rounded-[var(--radius-lg)]',
};

export default function Button({ variant = 'primary', size = 'md', className, children, loading, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
        variants[variant], sizes[size], className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </button>
  );
}
