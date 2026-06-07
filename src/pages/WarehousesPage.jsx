import { useApp } from '../context/AppContext';
import { warehouses } from '../data/warehouseData';
import { PageHeader, Card } from '../components/ui';

export default function WarehousesPage() {
  const { t } = useApp();
  const p = t.warehousesPage;

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title={p.title} subtitle={p.subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {warehouses.map((wh) => (
          <Card key={wh.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{wh.name}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{wh.location}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex justify-between">
                <span>{wh.zones} {p.zones}</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{wh.skus.toLocaleString()} {p.skus}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>{p.utilization}</span>
                  <span className="font-bold text-omega-orange">{wh.utilization}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
                  <div className="h-full rounded-full bg-omega-orange" style={{ width: `${wh.utilization}%` }} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
