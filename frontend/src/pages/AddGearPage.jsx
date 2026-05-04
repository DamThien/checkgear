import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RotateCcw, CheckCircle } from 'lucide-react';
import { useCreateGear } from '../hooks/useGears';
import { CATEGORIES, CONDITIONS, CONDITION_LABEL } from '../lib/constants';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Select, Textarea } from '../components/ui/Input';
import PageHeader from '../components/layout/PageHeader';

const empty = { name: '', category: 'CPU', brand: '', price: '', purchaseDate: '', condition: 'good', notes: '', imageUrl: '' };

export default function AddGearPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState(empty);
  const [done, setDone] = useState(false);
  const createMutation = useCreateGear();

  // Auto-fill if navigated from Market with autofill state
  useEffect(() => {
    if (state?.autofill) {
      const item = state.autofill;
      setForm((f) => ({
        ...f,
        name: item.name || '',
        imageUrl: item.imageUrl || '',
        category: item.category || 'CPU',
        price: item.latestPrice || item.price || '',
      }));
    }
  }, [state]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    createMutation.mutate(
      { ...form, price: Number(form.price), purchaseDate: form.purchaseDate || null },
      {
        onSuccess: () => {
          setDone(true);
          setTimeout(() => {
            setDone(false);
            setForm(empty);
          }, 2000);
        },
      }
    );
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-emerald-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-bold font-[var(--font-display)] text-[var(--color-text)] mb-1">Gear added!</h2>
        <p className="text-sm text-[var(--color-faint)] mb-6">Redirecting you back to the form…</p>
        <Button variant="ghost" size="sm" onClick={() => navigate('/my-gear')}>View My Gear</Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Add Gear"
        subtitle="Add a new item to your hardware inventory"
        action={state?.autofill && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius)] bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            <span className="text-xs text-[var(--color-accent)] font-medium">Auto-filled from GearVN</span>
          </div>
        )}
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader title="Product Details" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Input label="Product Name *" placeholder="e.g. RTX 4070 Ti Super" value={form.name} onChange={set('name')} required />
              </div>
              <Select label="Category *" value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Brand" placeholder="ASUS, MSI, Corsair…" value={form.brand} onChange={set('brand')} />
              <Input label="Price (VND) *" type="number" min="1" placeholder="15000000" value={form.price} onChange={set('price')} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Purchase Date" type="date" value={form.purchaseDate} onChange={set('purchaseDate')} />
              <Select label="Condition" value={form.condition} onChange={set('condition')}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABEL[c]}</option>)}
              </Select>
            </div>

            <Input label="Image URL" placeholder="https://example.com/image.jpg" value={form.imageUrl} onChange={set('imageUrl')} />

            <Textarea label="Notes" rows={3} placeholder="Serial number, where purchased, warranty info…" value={form.notes} onChange={set('notes')} />

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="ghost" size="md" onClick={() => setForm(empty)} className="gap-1.5 flex-shrink-0">
                <RotateCcw size={13} /> Reset
              </Button>
              <Button type="submit" size="md" loading={createMutation.isPending} className="flex-1">
                Save Gear
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
