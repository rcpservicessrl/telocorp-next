import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Buscando conductor', icon: '🔍' },
  { key: 'assigned', label: 'Conductor asignado', icon: '🚗' },
  { key: 'picked_up', label: 'Paquete recogido', icon: '📦' },
  { key: 'in_transit', label: 'En tránsito', icon: '🛣️' },
  { key: 'delivered', label: 'Entregado', icon: '✅' },
]

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  searching: 0,
  assigned: 1,
  pickup_en_route: 1,
  arrived_pickup: 1,
  picked_up: 2,
  in_transit: 3,
  arrived_dropoff: 3,
  delivered: 4,
  cancelled: -1,
}

export default async function LlevaTrackingPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data: request } = await supabase
    .from('lleva_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (!request) notFound()

  const currentStep = STATUS_INDEX[request.status] ?? 0

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{BRAND.lleva}</h1>
      <p className="text-[var(--c-text-muted)] mb-6">Seguimiento de tu envío</p>

      {/* Request summary */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Envío #{id.slice(0, 8)}</h2>
          <Badge variant={request.status === 'delivered' ? 'success' : request.status === 'cancelled' ? 'danger' : 'lleva'}>
            {request.status}
          </Badge>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-[var(--c-text-dim)]">📍 Recogida:</span>
            <span>{request.pickup_address}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--c-text-dim)]">📍 Entrega:</span>
            <span>{request.dropoff_address}</span>
          </div>
          {request.package_description && (
            <div className="flex items-start gap-2">
              <span className="text-[var(--c-text-dim)]">📦 Paquete:</span>
              <span>{request.package_description}</span>
            </div>
          )}
          <div className="flex items-center gap-4 pt-2 border-t border-[var(--c-border)]">
            <span className="text-[var(--c-text-dim)]">💰</span>
            <span className="font-bold text-[var(--c-lleva)]">RD$ {(request.estimated_fare || 0).toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-5">
        <h3 className="font-semibold mb-4">Estado del envío</h3>
        <div className="space-y-0">
          {STATUS_STEPS.map((step, i) => {
            const isActive = i <= currentStep
            const isCurrent = i === currentStep

            return (
              <div key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    isActive ? 'bg-[var(--c-lleva)] text-white' : 'bg-[var(--c-surface-2)] text-[var(--c-text-dim)]'
                  }`}>
                    {step.icon}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`w-0.5 h-8 ${isActive ? 'bg-[var(--c-lleva)]' : 'bg-[var(--c-border)]'}`} />
                  )}
                </div>
                <div className="pt-1">
                  <p className={`text-sm font-medium ${isCurrent ? 'text-[var(--c-lleva)]' : isActive ? '' : 'text-[var(--c-text-dim)]'}`}>
                    {step.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="mt-6 text-center">
        <a
          href={`https://wa.me/18096860050?text=Hola, consulta sobre envío ${id.slice(0, 8)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--c-info)] hover:underline"
        >
          📱 ¿Preguntas? Escríbenos por WhatsApp
        </a>
      </div>
    </main>
  )
}
