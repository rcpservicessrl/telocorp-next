import { createSupabaseServer } from '@/lib/supabase-server'
import { BRAND } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { StatusChanger } from '@/components/admin/status-changer'

export const metadata = { title: `Admin — ${BRAND.lleva}` }

const LLEVA_STATUSES = ['pending', 'searching', 'assigned', 'pickup_en_route', 'arrived_pickup', 'picked_up', 'in_transit', 'arrived_dropoff', 'delivered', 'cancelled']

export default async function AdminLlevaPage() {
  const supabase = await createSupabaseServer()
  const { data: requests } = await supabase
    .from('lleva_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  const statusVariant = (s: string) => {
    if (s === 'delivered') return 'success' as const
    if (s === 'cancelled') return 'danger' as const
    if (s === 'in_transit' || s === 'picked_up') return 'info' as const
    return 'warning' as const
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{BRAND.lleva}</h1>
      <p className="text-sm text-[var(--c-text-muted)] mb-6">{requests?.length || 0} envíos</p>

      <div className="space-y-3">
        {(requests || []).map((r) => (
          <Card key={r.id} hover className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">#{r.id?.slice(0, 8)}</p>
                <p className="text-xs text-[var(--c-text-muted)]">{r.customer_name} · {r.customer_phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--c-lleva)]">RD$ {(r.estimated_fare || 0).toLocaleString()}</span>
                <StatusChanger table="lleva_requests" id={r.id} currentStatus={r.status} statuses={LLEVA_STATUSES} />
              </div>
            </div>
            <div className="mt-2 text-xs text-[var(--c-text-dim)] space-y-0.5">
              <p>📍 {r.pickup_address}</p>
              <p>📍 {r.dropoff_address}</p>
            </div>
          </Card>
        ))}

        {(!requests || requests.length === 0) && (
          <p className="text-center py-10 text-[var(--c-text-muted)]">Sin solicitudes de envío.</p>
        )}
      </div>
    </div>
  )
}
