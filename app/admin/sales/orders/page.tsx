import { createSupabaseServer } from '@/lib/supabase-server'
import { BRAND } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export const metadata = { title: `Admin — Órdenes` }

const STATUS_VARIANT: Record<string, 'warning' | 'info' | 'success' | 'danger' | 'default'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  completed: 'success',
  cancelled: 'danger',
}

export default async function AdminOrdersPage() {
  const supabase = await createSupabaseServer()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Órdenes — {BRAND.sales}</h1>

      <div className="space-y-3">
        {(orders || []).map((order) => (
          <Link key={order.id} href={`/admin/sales/orders/${order.id}`}>
            <Card hover className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-sm">#{order.id?.slice(0, 8)}</p>
                    <p className="text-xs text-[var(--c-text-dim)]">
                      {new Date(order.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">{order.customer?.name || 'Sin nombre'}</p>
                    <p className="text-xs text-[var(--c-text-dim)]">{order.customer?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-sm">RD$ {order.total?.toLocaleString()}</p>
                  <Badge variant={STATUS_VARIANT[order.status] || 'default'}>
                    {order.status}
                  </Badge>
                </div>
              </div>
              <div className="mt-2 text-xs text-[var(--c-text-muted)]">
                {order.items?.length || 0} items · {order.payment_method}
              </div>
            </Card>
          </Link>
        ))}

        {(!orders || orders.length === 0) && (
          <p className="text-center py-10 text-[var(--c-text-muted)]">Sin órdenes aún.</p>
        )}
      </div>
    </div>
  )
}
