import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Trash2, List, Grid3X3, Eye } from 'lucide-react';
import { useGears, useDeleteGear } from '../hooks/useGears';
import { formatVND } from '../lib/utils';
import { CATEGORIES } from '../lib/constants';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { ConditionBadge, CategoryTag, Badge } from '../components/ui/Badge';
import { RowSkeleton } from '../components/ui/Skeleton';
import Empty from '../components/ui/Empty';

export default function MyGearPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [confirmId, setConfirmId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: gearData = {}, isLoading } = useGears({ search, category, sort, page, limit });
  const gears = gearData.items || [];
  const totalPages = gearData.pagination?.totalPages || 1;

  const deleteMutation = useDeleteGear();

  const handleDelete = (id) => {
    deleteMutation.mutate(id, { onSuccess: () => setConfirmId(null) });
  };

  const totalItems = gearData.pagination?.total || 0;

  return (
    <div>
      <PageHeader
        title="My Gear"
        subtitle="Your personal hardware inventory"
        action={
          <Button size="sm" onClick={() => navigate('/add-gear')} className="gap-1.5">
            <PlusCircle size={14} /> Add Gear
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Inventory"
          action={
            <div className="flex items-center gap-2 flex-wrap">
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
                <option value="">All</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--color-muted)] outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
              >
                <option value="-createdAt">Newest</option>
                <option value="createdAt">Oldest</option>
                <option value="-price">Price ↓</option>
                <option value="price">Price ↑</option>
                <option value="name">Name</option>
              </select>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search gear…"
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] pl-8 pr-3 py-2 text-xs text-[var(--color-text)] placeholder:text-[var(--color-faint)] outline-none focus:border-[var(--color-accent)] transition-colors w-40"
                />
              </div>
              {totalItems > 0 && <Badge variant="accent">{totalItems}</Badge>}
            </div>
          }
        />

        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'flex flex-col gap-3'}>
            {[...Array(8)].map((_, i) => <RowSkeleton key={i} />)}
          </div>
        ) : gears.length === 0 ? (
          <Empty
            icon="◎"
            title="No gear here yet"
            description="Start by adding your first piece of hardware"
            action={
              <Button size="sm" onClick={() => navigate('/add-gear')} className="gap-1.5">
                <PlusCircle size={14} /> Add Gear
              </Button>
            }
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4 stagger">
            {gears.map((g) => (
              <div
                key={g._id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-4 hover:border-[var(--color-border2)] transition-all duration-150 group"
              >
                <div className="flex items-center justify-center h-auto mb-3 rounded-[var(--radius-sm)] bg-[var(--color-panel)] overflow-hidden">
                  {g.imageUrl ? (
                    <img src={g.imageUrl} alt={g.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                  ) : (
                    <span className="text-2xl">📷</span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--color-faint)] mb-1 flex items-center gap-1">
                  {g.category}
                </p>
                <p className="text-[13px] font-medium text-[var(--color-text)] leading-snug line-clamp-2 mb-2">{g.name}</p>
                <p className="font-[var(--font-mono)] text-[13px] text-[var(--color-accent)] font-bold mb-2">
                  {formatVND(g.price)}
                </p>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="subtle" size="sm" onClick={() => navigate(`/gear/${g._id}`)} className="flex-1 gap-1">
                    <Eye size={12} /> Detail
                  </Button>
                  {confirmId === g._id ? (
                    <Button variant="danger" size="sm" onClick={() => handleDelete(g._id)}>
                      ✓
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setConfirmId(g._id)}>
                      <Trash2 size={13} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {['Image', 'Name', 'Category', 'Brand', 'Price', 'Condition', ''].map((h) => (
                    <th key={h} className="pb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-faint)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="stagger">
                {gears.map((g) => (
                  <tr key={g._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)]/40 transition-colors group">
                    <td className="py-3.5 px-2">
                      {g.imageUrl ? (
                        <div className="w-10 h-10 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-panel)] flex items-center justify-center">
                          <img src={g.imageUrl} alt={g.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-panel)] flex items-center justify-center text-[var(--color-faint)]">
                          <span className="text-xs">📷</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="text-[13px] font-semibold text-[var(--color-text)]">{g.name}</span>
                    </td>
                    <td className="py-3.5 px-2">
                      <CategoryTag value={g.category} />
                    </td>
                    <td className="py-3.5 px-2 text-[13px] text-[var(--color-muted)]">{g.brand || '—'}</td>
                    <td className="py-3.5 px-2 font-[var(--font-mono)] text-[13px] text-[var(--color-accent)] font-bold whitespace-nowrap">
                      {formatVND(g.price)}
                    </td>
                    <td className="py-3.5 px-2"><ConditionBadge value={g.condition} /></td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button variant="subtle" size="sm" onClick={() => navigate(`/gear/${g._id}`)} className="gap-1">
                          <Eye size={12} /> Detail
                        </Button>
                        {confirmId === g._id ? (
                          <div className="flex items-center gap-2">
                            <Button variant="danger" size="sm" loading={deleteMutation.isPending} onClick={() => handleDelete(g._id)}>
                              Confirm
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmId(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(g._id)}
                            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-faint)] hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-faint)]">
              Page {page} of {totalPages}
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
