import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OrderActions } from './order-actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orden #{id.slice(0, 8)}</h1>
        <Badge variant={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}>
          {order.status}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Customer */}
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">Cliente</h3>
          <div className="text-sm space-y-1">
            <p>{order.customer?.name}</p>
            <p className="text-[var(--c-text-muted)]">{order.customer?.phone}</p>
            <p className="text-[var(--c-text-muted)]">{order.customer?.email}</p>
            <p className="text-[var(--c-text-muted)]">{order.customer?.address}, {order.customer?.city}</p>
          </div>
        </Card>

        {/* Payment */}
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">Pago</h3>
          <div className="text-sm space-y-1">
            <p>Método: <span className="font-medium">{order.payment_method}</span></p>
            <p>Subtotal: RD$ {order.subtotal?.toLocaleString()}</p>
            <p>Envío: RD$ {order.shipping?.toLocaleString()}</p>
            {order.discount > 0 && <p>Descuento: -RD$ {order.discount?.toLocaleString()}</p>}
            <p className="font-bold text-[var(--c-sales)]">Total: RD$ {order.total?.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Items */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-sm mb-3">Productos</h3>
        <div className="space-y-2">
          {(order.items || []).map((item: { id: string; title: string; qty: number; price: number }, i: number) => (
            <div key={i} className="flex justify-between text-sm py-2 border-b border-[var(--c-border)] last:border-0">
              <span>{item.title} × {item.qty}</span>
              <span className="font-medium">RD$ {(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <OrderActions orderId={id} currentStatus={order.status} notes={order.notes || ''} />
    </div>
  )
}
