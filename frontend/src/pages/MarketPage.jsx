import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, List, Grid3X3, PlusCircle, Eye } from 'lucide-react';
import { useCrawledProducts } from '../hooks/useGears';
import { useAuthStore } from '../store/authStore';
import { formatVND } from '../lib/utils';
import { CATEGORY_ICON, CATEGORIES } from '../lib/constants';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { RowSkeleton } from '../components/ui/Skeleton';
import Empty from '../components/ui/Empty';
import { Badge } from '../components/ui/Badge';

export default function MarketPage() {
  const { data: allProducts = [], isLoading } = useCrawledProducts();
  const { canEdit } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const limit = 24;

  const filtered = allProducts.filter((p) => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || p.category === category;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / limit);
  const paginatedProducts = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div>
      <PageHeader
        title="Market"
        subtitle="Live product data from GearVN"
        action={<Badge variant="accent">{filtered.length} indexed</Badge>}
      />

      <Card>
        <CardHeader
          title="All Products"
          action={
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-faint)] hover:text-[var(--color-text)]'}`}
                >
                  <List size={14} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-faint)] hover:text-[var(--color-text)]'}`}
                >
                  <Grid3X3 size={14} />
                </button>
              </div>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--color-muted)] outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search…"
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] pl-8 pr-3 py-2 text-xs text-[var(--color-text)] placeholder:text-[var(--color-faint)] outline-none focus:border-[var(--color-accent)] transition-colors w-44"
                />
              </div>
            </div>
          }
        />

        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'flex flex-col gap-2'}>
            {[...Array(8)].map((_, i) => <RowSkeleton key={i} />)}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <Empty icon="◎" title="No products found" description="Try adjusting your search or filters" />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4 stagger">
            {paginatedProducts.map((item) => (
              <div
                key={item._id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-4 hover:border-[var(--color-border2)] transition-all duration-150 group"
              >
                <div className="flex items-center justify-center h-auto mb-3 rounded-[var(--radius-sm)] bg-[var(--color-panel)] overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                  ) : (
                    <span className="text-2xl">{CATEGORY_ICON[item.category] || '▪'}</span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--color-faint)] mb-1 flex items-center gap-1">
                  {CATEGORY_ICON[item.category] || '▪'} {item.category || 'Gear'}
                </p>
                <p className="text-[13px] font-medium text-[var(--color-text)] leading-snug line-clamp-2 mb-2">{item.name}</p>
                <p className="font-[var(--font-mono)] text-[13px] text-[var(--color-accent)] font-bold mb-2">
                  {formatVND(item.latestPrice)}
                </p>
                {canEdit() && (
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => navigate('/add-gear', { state: { autofill: item } })}
                    className="w-full gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <PlusCircle size={12} /> Add to My Gear
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)] stagger">
            {paginatedProducts.map((item) => (
              <div key={item._id} className="flex items-center gap-4 py-3.5 group">
                {item.imageUrl ? (
                  <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--color-surface2)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:border-[var(--color-border2)] transition-colors">
                    <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--color-surface2)] border border-[var(--color-border)] flex items-center justify-center text-base flex-shrink-0 group-hover:border-[var(--color-border2)] transition-colors">
                    {CATEGORY_ICON[item.category] || '▪'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--color-text)] truncate">{item.name}</p>
                  {item.category && (
                    <p className="text-[11px] text-[var(--color-faint)] mt-0.5">{item.category}</p>
                  )}
                </div>
                <p className="font-[var(--font-mono)] text-[13px] text-[var(--color-accent)] font-bold whitespace-nowrap">
                  {formatVND(item.latestPrice)}
                </p>
                {canEdit() && (
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => navigate('/add-gear', { state: { autofill: item } })}
                    className="opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                  >
                    <PlusCircle size={12} /> Add
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-faint)]">
              Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="text-xs text-[var(--color-faint)] px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
