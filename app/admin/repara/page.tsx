import { createSupabaseServer } from '@/lib/supabase-server'
import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { StatusChanger } from '@/components/admin/status-changer'
import Link from 'next/link'

export const metadata = { title: `Admin — ${BRAND.repara}` }

const REPARA_STATUSES = ['pending', 'received', 'diagnosing', 'in_progress', 'quality_check', 'completed', 'ready_for_pickup', 'delivered', 'cancelled']

export default async function AdminReparaPage() {
  const supabase = await createSupabaseServer()
  const { data: tickets } = await supabase
    .from('repara_bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{BRAND.repara}</h1>
      <p className="text-sm text-[var(--c-text-muted)] mb-6">{tickets?.length || 0} solicitudes</p>

      <div className="space-y-3">
        {(tickets || []).map((t) => (
          <Link key={t.id} href={`/admin/repara/${t.id}`}>
            <Card hover className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">#{t.id?.slice(0, 8)} — {t.brand} {t.model}</p>
                  <p className="text-xs text-[var(--c-text-muted)]">{t.issue} · {t.customer_name} · {t.customer_phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusChanger table="repara_bookings" id={t.id} currentStatus={t.status} statuses={REPARA_STATUSES} />
                  <time className="text-xs text-[var(--c-text-dim)]">
                    {new Date(t.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}
                  </time>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {(!tickets || tickets.length === 0) && (
          <p className="text-center py-10 text-[var(--c-text-muted)]">Sin solicitudes de reparación.</p>
        )}
      </div>
    </div>
  )
}
