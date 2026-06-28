import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Solicitud recibida', icon: '📋' },
  { key: 'confirmed', label: 'Confirmada', icon: '✅' },
  { key: 'en_route', label: 'Técnico en camino', icon: '🚗' },
  { key: 'in_progress', label: 'En progreso', icon: '🛠️' },
  { key: 'completed', label: 'Completado', icon: '🎉' },
]

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  technician_assigned: 1,
  en_route: 2,
  arrived: 2,
  in_progress: 3,
  completed: 4,
  cancelled: -1,
}

export default async function InstalaBookingPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data: booking } = await supabase
    .from('instala_bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (!booking) notFound()

  const currentStep = STATUS_INDEX[booking.status] ?? 0

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{BRAND.instala}</h1>
      <p className="text-[var(--c-text-muted)] mb-6">Seguimiento de tu servicio</p>

      {/* Booking summary */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Booking #{id.slice(0, 8)}</h2>
          <Badge variant={booking.status === 'completed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'instala'}>
            {booking.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[var(--c-text-dim)]">Servicio:</span>
            <p className="font-medium">{booking.service_name || booking.service}</p>
          </div>
          <div>
            <span className="text-[var(--c-text-dim)]">Estimado:</span>
            <p className="font-medium text-[var(--c-instala)]">RD$ {(booking.estimated_cost || 0).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[var(--c-text-dim)]">Fecha:</span>
            <p className="font-medium">{booking.preferred_date || 'Por confirmar'}</p>
          </div>
          <div>
            <span className="text-[var(--c-text-dim)]">Dirección:</span>
            <p className="font-medium line-clamp-1">{booking.address}</p>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-5">
        <h3 className="font-semibold mb-4">Estado</h3>
        <div className="space-y-0">
          {STATUS_STEPS.map((step, i) => {
            const isActive = i <= currentStep
            const isCurrent = i === currentStep

            return (
              <div key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    isActive ? 'bg-[var(--c-instala)] text-white' : 'bg-[var(--c-surface-2)] text-[var(--c-text-dim)]'
                  }`}>
                    {step.icon}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`w-0.5 h-8 ${isActive ? 'bg-[var(--c-instala)]' : 'bg-[var(--c-border)]'}`} />
                  )}
                </div>
                <div className="pt-1">
                  <p className={`text-sm font-medium ${isCurrent ? 'text-[var(--c-instala)]' : isActive ? '' : 'text-[var(--c-text-dim)]'}`}>
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
          href={`https://wa.me/18096860050?text=Hola, consulta sobre booking ${id.slice(0, 8)}`}
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
