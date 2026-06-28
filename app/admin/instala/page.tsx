import { createSupabaseServer } from '@/lib/supabase-server'
import { BRAND } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { StatusChanger } from '@/components/admin/status-changer'

export const metadata = { title: `Admin — ${BRAND.instala}` }

const INSTALA_STATUSES = ['pending', 'confirmed', 'technician_assigned', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled', 'rescheduled']

export default async function AdminInstalaPage() {
  const supabase = await createSupabaseServer()
  const { data: bookings } = await supabase
    .from('instala_bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  const statusVariant = (s: string) => {
    if (s === 'completed') return 'success' as const
    if (s === 'cancelled') return 'danger' as const
    if (s === 'in_progress' || s === 'en_route') return 'info' as const
    return 'warning' as const
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{BRAND.instala}</h1>
      <p className="text-sm text-[var(--c-text-muted)] mb-6">{bookings?.length || 0} servicios</p>

      <div className="space-y-3">
        {(bookings || []).map((b) => (
          <Card key={b.id} hover className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">#{b.id?.slice(0, 8)} — {b.service_name || b.service}</p>
                <p className="text-xs text-[var(--c-text-muted)]">{b.customer_name} · {b.customer_phone} · {b.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--c-instala)]">RD$ {(b.estimated_cost || 0).toLocaleString()}</span>
                <StatusChanger table="instala_bookings" id={b.id} currentStatus={b.status} statuses={INSTALA_STATUSES} />
              </div>
            </div>
            {b.preferred_date && (
              <p className="text-xs text-[var(--c-text-dim)] mt-1">📅 {b.preferred_date} — {b.preferred_time || 'por confirmar'}</p>
            )}
          </Card>
        ))}

        {(!bookings || bookings.length === 0) && (
          <p className="text-center py-10 text-[var(--c-text-muted)]">Sin servicios de instalación.</p>
        )}
      </div>
    </div>
  )
}
