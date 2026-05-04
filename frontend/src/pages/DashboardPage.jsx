import { useNavigate } from 'react-router-dom';
import { TrendingUp, Package, Layers, ArrowRight, Eye, ExternalLink } from 'lucide-react';
import { useDashboard, useCrawledProducts } from '../hooks/useGears';
import { useAuthStore } from '../store/authStore';
import { formatVND } from '../lib/utils';
import { CATEGORY_ICON } from '../lib/constants';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { StatSkeleton, CardSkeleton } from '../components/ui/Skeleton';

function StatCard({ icon: Icon, label, value, color = 'accent', delay = 0 }) {
  const colorMap = {
    accent: { bg: 'bg-[var(--color-accent-dim)]', text: 'text-[var(--color-accent)]', border: 'border-[var(--color-accent)]/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  };
  const c = colorMap[color];
  return (
    <div
      className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 flex items-center gap-4 transition-all duration-200 hover:border-[var(--color-border2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-10 h-10 rounded-[var(--radius)] ${c.bg} ${c.border} border flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={c.text} strokeWidth={1.75} />
      </div>
      <div>
        <p className="font-[var(--font-mono)] text-lg font-bold text-[var(--color-text)]">{value}</p>
        <p className="text-[11px] text-[var(--color-faint)] uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { canEdit } = useAuthStore();
  const editable = canEdit();
  const navigate = useNavigate();

  const { data: dash, isLoading: dashLoading } = useDashboard({ enabled: editable });
  const { data: products = [], isLoading: prodLoading } = useCrawledProducts();

  const byCategory = dash?.itemsByCategory || [];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      />

      {/* Stats */}
      {editable && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {dashLoading ? (
            <>
              <StatSkeleton /><StatSkeleton /><StatSkeleton />
            </>
          ) : (
            <>
              <StatCard icon={Package} label="Total Items" value={dash?.totalItems ?? 0} color="accent" delay={0} />
              <StatCard icon={TrendingUp} label="Total Value" value={formatVND(dash?.totalValue)} color="emerald" delay={60} />
              <StatCard icon={Layers} label="Categories" value={byCategory.length} color="amber" delay={120} />
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-6 gap-5">
        {/* Category breakdown */}
        {editable && (
          <Card className="col-span-2 animate-fade-up" style={{ animationDelay: '180ms' }}>
            <CardHeader title="By Category" />
            {dashLoading ? (
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="skeleton h-3 w-28" />
                    <div className="skeleton h-1.5 w-full" />
                  </div>
                ))}
              </div>
            ) : byCategory.length === 0 ? (
              <p className="text-xs text-[var(--color-faint)] py-4">No gear added yet.</p>
            ) : (
              <div className="flex flex-col gap-3.5">
                {byCategory.map((item) => {
                  const pct = dash?.totalValue ? Math.round((item.value / dash.totalValue) * 100) : 0;
                  return (
                    <div key={item.category}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-[var(--color-muted)] flex items-center gap-1.5">
                          <span>{CATEGORY_ICON[item.category] || '▪'}</span>
                          {item.category}
                        </span>
                        <span className="text-[10px] text-[var(--color-faint)] font-[var(--font-mono)]">
                          {item.count} · {pct}%
                        </span>
                      </div>
                      <div className="h-1 bg-[var(--color-surface)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--color-accent2)] to-[var(--color-accent)] rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!editable && (
              <div className="py-4 text-center">
                <p className="text-xs text-[var(--color-faint)] mb-3">Sign in to track your gear</p>
                <Button variant="subtle" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
              </div>
            )}
          </Card>
        )}

        {/* Market preview */}
        <Card className={`${editable ? 'col-span-4' : 'col-span-6'} animate-fade-up`} style={{ animationDelay: '220ms' }}>
          <CardHeader
            title="Market Preview"
            subtitle={`${products.length} products indexed from GearVN`}
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/market')} className="text-xs gap-1">
                View all <ArrowRight size={12} />
              </Button>
            }
          />
          {prodLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 stagger">
              {products.slice(0, 9).map((item) => (
                <div
                  key={item._id}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-4 hover:border-[var(--color-border2)] transition-all duration-150 group"
                >
                  {item.imageUrl && (
                    <div className="mb-3 flex items-center justify-center h-auto bg-[var(--color-panel)] rounded-[var(--radius-sm)] overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <p className="text-[10px] text-[var(--color-faint)] mb-2 flex items-center gap-1">
                    <span>{CATEGORY_ICON[item.category] || '▪'}</span>
                    {item.category || 'Gear'}
                  </p>
                  <p className="text-[13px] font-medium text-[var(--color-text)] leading-snug line-clamp-2 mb-2">{item.name}</p>
                  <p className="font-[var(--font-mono)] text-[14px] text-[var(--color-accent)] font-bold mb-3">
                    {formatVND(item.latestPrice)}
                  </p>
                  {item.productUrl && (
                    <a 
                      href={item.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 w-full py-2 text-xs text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-[var(--radius-sm)] hover:bg-[var(--color-accent)]/10 transition-colors"
                    >
                      <Eye size={12} /> View
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
