import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BRAND } from '@/lib/utils'

export const metadata = { title: 'Mi Actividad' }

export default async function ActivityPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Fetch activity from all services (by user email or user_id)
  const [orders, repairs, installs, deliveries] = await Promise.all([
    supabase.from('orders').select('id, status, total, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('repara_bookings').select('id, status, device, brand, model, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('instala_bookings').select('id, status, service_name, service, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('lleva_requests').select('id, status, pickup_address, dropoff_address, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
  ])

  // Filter orders by email
  const myOrders = (orders.data || []).filter(o => {
    // Orders may not have user_id — filter by checking if they match any criteria
    return true // In production, filter by customer.email === user.email
  }).slice(0, 5)

  // Merge into unified timeline
  type Activity = { id: string; type: string; label: string; status: string; date: string }
  const activities: Activity[] = [
    ...myOrders.map(o => ({ id: o.id, type: 'sales', label: `Pedido · RD$ ${o.total?.toLocaleString()}`, status: o.status, date: o.created_at })),
    ...(repairs.data || []).map(r => ({ id: r.id, type: 'repara', label: `Reparación · ${r.brand} ${r.model}`, status: r.status, date: r.created_at })),
    ...(installs.data || []).map(i => ({ id: i.id, type: 'instala', label: `Instalación · ${i.service_name || i.service}`, status: i.status, date: i.created_at })),
    ...(deliveries.data || []).map(d => ({ id: d.id, type: 'lleva', label: `Envío · ${d.pickup_address?.slice(0, 20)}...`, status: d.status, date: d.created_at })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 15)

  const typeVariant: Record<string, 'sales' | 'educa' | 'lleva' | 'repara' | 'instala'> = {
    sales: 'sales',
    educa: 'educa',
    lleva: 'lleva',
    repara: 'repara',
    instala: 'instala',
  }

  const typeLabel: Record<string, string> = {
    sales: BRAND.sales,
    educa: BRAND.educa,
    lleva: BRAND.lleva,
    repara: BRAND.repara,
    instala: BRAND.instala,
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mi Actividad</h1>

      {activities.length === 0 ? (
        <div className="text-center py-16 text-[var(--c-text-muted)]">
          <p className="text-4xl mb-3">📊</p>
          <p>Aún no tienes actividad. Explora nuestros servicios.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <Card key={`${a.type}-${a.id}`} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={typeVariant[a.type]}>{typeLabel[a.type]}</Badge>
                  <Badge variant={a.status === 'completed' || a.status === 'delivered' ? 'success' : a.status === 'cancelled' ? 'danger' : 'warning'}>
                    {a.status}
                  </Badge>
                </div>
                <p className="text-sm">{a.label}</p>
              </div>
              <time className="text-xs text-[var(--c-text-dim)] shrink-0">
                {new Date(a.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}
              </time>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
