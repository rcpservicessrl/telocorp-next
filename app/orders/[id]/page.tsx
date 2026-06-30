import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ServiceSuggestion } from '@/components/cross-service/service-suggestion'

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Pedido recibido', icon: '📋' },
  { key: 'processing', label: 'Preparando', icon: '📦' },
  { key: 'shipped', label: 'Enviado', icon: '🚚' },
  { key: 'delivered', label: 'Entregado', icon: '✅' },
]

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  confirmed: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  completed: 3,
  cancelled: -1,
}

export default async function OrderTrackingPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const currentStep = STATUS_INDEX[order.status] ?? 0

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Tu Pedido</h1>
      <p className="text-[var(--c-text-muted)] mb-6">Seguimiento de tu compra en {BRAND.sales}</p>

      {/* Order summary */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Orden #{id.slice(0, 8)}</h2>
          <Badge variant={order.status === 'delivered' || order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}>
            {order.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[var(--c-text-dim)]">Total:</span>
            <p className="font-bold text-[var(--c-sales)]">RD$ {(order.total || 0).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[var(--c-text-dim)]">Pago:</span>
            <p className="font-medium">{order.payment_method}</p>
          </div>
          <div>
            <span className="text-[var(--c-text-dim)]">Productos:</span>
            <p className="font-medium">{order.items?.length || 0} items</p>
          </div>
          <div>
            <span className="text-[var(--c-text-dim)]">Fecha:</span>
            <p className="font-medium">
              {new Date(order.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Items list */}
        {order.items && (
          <div className="mt-4 pt-3 border-t border-[var(--c-border)] space-y-1">
            {order.items.map((item: { title: string; qty: number; price: number }, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[var(--c-text-muted)]">{item.title} × {item.qty}</span>
                <span>RD$ {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Timeline */}
      {order.status !== 'cancelled' ? (
        <Card className="p-5 mb-6">
          <h3 className="font-semibold mb-4">Estado del pedido</h3>
          <div className="space-y-0">
            {STATUS_STEPS.map((step, i) => {
              const isActive = i <= currentStep
              const isCurrent = i === currentStep

              return (
                <div key={step.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isActive ? 'bg-[var(--c-sales)] text-white' : 'bg-[var(--c-surface-2)] text-[var(--c-text-dim)]'
                    }`}>
                      {step.icon}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`w-0.5 h-8 ${isActive ? 'bg-[var(--c-sales)]' : 'bg-[var(--c-border)]'}`} />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-[var(--c-sales)]' : isActive ? '' : 'text-[var(--c-text-dim)]'}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ) : (
        <Card className="p-5 mb-6 border-[var(--c-danger)]/20">
          <p className="text-center text-[var(--c-danger)]">Esta orden fue cancelada.</p>
        </Card>
      )}

      {/* Contact */}
      <div className="text-center mb-6">
        <a
          href={`https://wa.me/8099038707?text=Hola, consulta sobre orden ${id.slice(0, 8)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--c-info)] hover:underline"
        >
          📱 ¿Preguntas? Escríbenos por WhatsApp
        </a>
      </div>

      <ServiceSuggestion current="sales" context="post_purchase" />
    </main>
  )
}
