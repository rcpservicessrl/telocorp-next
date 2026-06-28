import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'Mis Pedidos' }

export default async function MyOrdersPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Get orders by customer email
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  // Filter orders that belong to this user (by email match in customer object)
  const myOrders = (orders || []).filter(o =>
    o.customer?.email === user.email
  )

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

      {myOrders.length === 0 ? (
        <div className="text-center py-16 text-[var(--c-text-muted)]">
          <p className="text-4xl mb-3">📦</p>
          <p>Aún no tienes pedidos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">Orden #{order.id?.slice(0, 8)}</p>
                <Badge variant={order.status === 'completed' || order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}>
                  {order.status}
                </Badge>
              </div>
              <div className="text-sm text-[var(--c-text-muted)] space-y-1">
                <p>{order.items?.length || 0} productos · RD$ {order.total?.toLocaleString()}</p>
                <p className="text-xs text-[var(--c-text-dim)]">
                  {new Date(order.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
