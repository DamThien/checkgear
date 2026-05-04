import { cn } from '../../lib/utils';

export default function Input({ label, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-muted)]">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-faint)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-glow)]',
          className
        )}
        {...props}
      />
    </div>
  );
}

export function Select({ label, className, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-muted)]">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-glow)] cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-muted)]">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-faint)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-glow)] resize-none',
          className
        )}
        {...props}
      />
    </div>
  );
}
