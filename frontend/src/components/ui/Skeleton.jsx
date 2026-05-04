import { cn } from '../../lib/utils';

export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />;
}

export function StatSkeleton() {
  return (
    <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 flex items-center gap-4">
      <Skeleton className="w-10 h-10 rounded-[var(--radius)]" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[var(--color-border)]">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-3.5 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-5 w-28 mt-1" />
    </div>
  );
}
