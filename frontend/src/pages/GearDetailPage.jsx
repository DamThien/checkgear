import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, Tag, FileText, ExternalLink } from 'lucide-react';
import { useGears } from '../hooks/useGears';
import { formatVND } from '../lib/utils';
import { CATEGORY_ICON, CONDITION_LABEL } from '../lib/constants';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import Empty from '../components/ui/Empty';

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-[var(--radius)] bg-[var(--color-surface)]">
      <Icon size={16} className="text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-[10px] text-[var(--color-faint)] uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-[13px] text-[var(--color-text)]">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function GearDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: gears = [], isLoading } = useGears({});
  const gear = gears.find(g => g._id === id);

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Loading..."
          subtitle="Please wait"
        />
      </div>
    );
  }

  if (!gear) {
    return (
      <div>
        <PageHeader
          title="Gear Not Found"
          subtitle="This gear may have been deleted"
          action={
            <Button size="sm" onClick={() => navigate('/my-gear')} className="gap-1.5">
              <ArrowLeft size={14} /> Back to My Gear
            </Button>
          }
        />
        <Empty
          icon="◎"
          title="Gear not found"
          description="This gear may have been deleted or you don't have permission to view it"
          action={
            <Button size="sm" onClick={() => navigate('/my-gear')}>
              Go to My Gear
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={gear.name}
        subtitle="Gear Details"
        action={
          <Button size="sm" onClick={() => navigate('/my-gear')} className="gap-1.5">
            <ArrowLeft size={14} /> Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Section */}
        <Card className="lg:col-span-1">
          <CardHeader title="Image" />
          <div className="flex items-center justify-center p-4">
            {gear.imageUrl ? (
              <img 
                src={gear.imageUrl} 
                alt={gear.name} 
                className="max-h-80 max-w-full object-contain rounded-[var(--radius)]"
              />
            ) : (
              <div className="w-48 h-48 rounded-[var(--radius)] bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-faint)]">
                <div className="text-center">
                  <span className="text-4xl block mb-2">📷</span>
                  <p className="text-xs">No Image</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Details Section */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <CardHeader title="Product Information" />
            <div className="grid grid-cols-2 gap-3">
              <DetailItem 
                icon={Package} 
                label="Category" 
                value={gear.category} 
              />
              <DetailItem 
                icon={Tag} 
                label="Brand" 
                value={gear.brand || '—'} 
              />
              <DetailItem 
                icon={Calendar} 
                label="Condition" 
                value={CONDITION_LABEL[gear.condition] || gear.condition} 
              />
              <DetailItem 
                icon={Calendar} 
                label="Purchase Date" 
                value={gear.purchaseDate ? new Date(gear.purchaseDate).toLocaleDateString('vi-VN') : '—'} 
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Price Information" />
            <div className="grid grid-cols-2 gap-3">
              <DetailItem 
                icon={Tag} 
                label="Current Price" 
                value={formatVND(gear.price)} 
              />
              {gear.externalSource?.site && (
                <DetailItem 
                  icon={ExternalLink} 
                  label="External Source" 
                  value={gear.externalSource.site} 
                />
              )}
            </div>
          </Card>

          {gear.notes && (
            <Card>
              <CardHeader title="Notes" />
              <div className="p-3 rounded-[var(--radius)] bg-[var(--color-surface)]">
                <p className="text-[13px] text-[var(--color-text)] whitespace-pre-wrap">{gear.notes}</p>
              </div>
            </Card>
          )}

          {gear.externalSource?.url && (
            <Card>
              <CardHeader title="External Link" />
              <div className="p-3">
                <a 
                  href={gear.externalSource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[13px] text-[var(--color-accent)] hover:underline break-all"
                >
                  {gear.externalSource.url}
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}