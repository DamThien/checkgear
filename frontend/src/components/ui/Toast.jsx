import { useUIStore } from '../../store/uiStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const icons = {
  success: <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />,
  error: <AlertCircle size={15} className="text-rose-400 flex-shrink-0" />,
  info: <Info size={15} className="text-blue-400 flex-shrink-0" />,
};

export default function Toaster() {
  const { toasts, removeToast } = useUIStore();
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto glass border border-[var(--color-border2)] rounded-[var(--radius)] px-4 py-3 flex items-center gap-3 shadow-xl min-w-[260px] max-w-xs animate-fade-up"
        >
          {icons[t.type]}
          <span className="text-sm text-[var(--color-text)] flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="text-[var(--color-faint)] hover:text-[var(--color-muted)] transition-colors">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
