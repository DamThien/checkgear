import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ExternalLink, ArrowRight } from 'lucide-react';
import { crawlApi } from '../services/api';
import { toast } from '../store/uiStore';
import { formatVND } from '../lib/utils';
import { CATEGORY_ICON } from '../lib/constants';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import Empty from '../components/ui/Empty';
import { RowSkeleton } from '../components/ui/Skeleton';

export default function PriceSearchPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const res = await crawlApi.search(keyword);
      setResults(res.data || []);
      setSearched(true);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (item) => {
    navigate('/add-gear', { state: { autofill: { ...item, latestPrice: item.price } } });
  };

  return (
    <div>
      <PageHeader
        title="Price Search"
        subtitle="Search real-time prices on GearVN"
      />

      <Card className="mb-5">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="RTX 4070, i7-13700K, DDR5 32GB…"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] pl-10 pr-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-faint)] outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-glow)] transition-all"
            />
          </div>
          <Button onClick={handleSearch} loading={loading} size="md" className="px-6 gap-2">
            <Search size={14} /> Search
          </Button>
        </div>

        {/* Suggestions */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] text-[var(--color-faint)] uppercase tracking-wider">Try:</span>
          {['RTX 4070', 'i5-14600K', 'DDR5', 'B650'].map((s) => (
            <button
              key={s}
              onClick={() => { setKeyword(s); }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      {(loading || searched) && (
        <Card>
          <CardHeader
            title={searched ? `Results for "${keyword}"` : 'Searching…'}
            action={searched && results.length > 0 && (
              <span className="text-[11px] text-[var(--color-faint)]">{results.length} found</span>
            )}
          />

          {loading ? (
            <div>{[...Array(5)].map((_, i) => <RowSkeleton key={i} />)}</div>
          ) : results.length === 0 ? (
            <Empty icon="◎" title={`No results for "${keyword}"`} description="Try a different keyword" />
          ) : (
            <div className="divide-y divide-[var(--color-border)] stagger">
              {results.map((item, i) => (
                <div key={item.url || i} className="flex items-center gap-4 py-4 group">
                  <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--color-surface2)] border border-[var(--color-border)] flex items-center justify-center text-base flex-shrink-0 group-hover:border-[var(--color-border2)] transition-colors">
                    {CATEGORY_ICON[item.category] || '▪'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--color-text)] leading-snug">{item.name}</p>
                    <p className="font-[var(--font-mono)] text-[13px] text-[var(--color-accent)] font-bold mt-1">
                      {formatVND(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-[var(--radius-sm)] text-[var(--color-faint)] hover:text-[var(--color-muted)] hover:bg-[var(--color-surface2)] transition-all"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                    <Button variant="subtle" size="sm" onClick={() => handleAutofill(item)} className="gap-1">
                      Add <ArrowRight size={11} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
