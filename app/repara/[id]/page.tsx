import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Recibida', icon: '📋' },
  { key: 'in_progress', label: 'En reparación', icon: '🔧' },
  { key: 'completed', label: 'Completada', icon: '✅' },
  { key: 'delivered', label: 'Entregada', icon: '📦' },
]

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  received: 1,
  diagnosing: 1,
  in_progress: 1,
  quality_check: 2,
  completed: 2,
  ready_for_pickup: 2,
  delivered: 3,
  cancelled: -1,
}

export default async function RepairTicketPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data: ticket } = await supabase
    .from('repara_bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (!ticket) notFound()

  const currentStep = STATUS_INDEX[ticket.status] ?? 0

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{BRAND.repara}</h1>
      <p className="text-[var(--c-text-muted)] mb-6">Seguimiento de tu reparación</p>

      {/* Ticket summary */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Ticket #{id.slice(0, 8)}</h2>
          <Badge variant={ticket.status === 'completed' ? 'success' : ticket.status === 'cancelled' ? 'danger' : 'warning'}>
            {ticket.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[var(--c-text-dim)]">Dispositivo:</span>
            <p className="font-medium">{ticket.brand} {ticket.model}</p>
          </div>
          <div>
            <span className="text-[var(--c-text-dim)]">Problema:</span>
            <p className="font-medium">{ticket.issue}</p>
          </div>
          <div>
            <span className="text-[var(--c-text-dim)]">Cliente:</span>
            <p className="font-medium">{ticket.customer_name}</p>
          </div>
          <div>
            <span className="text-[var(--c-text-dim)]">Fecha:</span>
            <p className="font-medium">
              {new Date(ticket.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-5">
        <h3 className="font-semibold mb-4">Estado de tu reparación</h3>
        <div className="space-y-0">
          {STATUS_STEPS.map((step, i) => {
            const isActive = i <= currentStep
            const isCurrent = i === currentStep

            return (
              <div key={step.key} className="flex gap-3">
                {/* Line + dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    isActive ? 'bg-[var(--c-repara)] text-white' : 'bg-[var(--c-surface-2)] text-[var(--c-text-dim)]'
                  }`}>
                    {step.icon}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`w-0.5 h-8 ${isActive ? 'bg-[var(--c-repara)]' : 'bg-[var(--c-border)]'}`} />
                  )}
                </div>
                {/* Label */}
                <div className="pt-1">
                  <p className={`text-sm font-medium ${isCurrent ? 'text-[var(--c-repara)]' : isActive ? 'text-[var(--c-text)]' : 'text-[var(--c-text-dim)]'}`}>
                    {step.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Contact */}
      <div className="mt-6 text-center">
        <a
          href={`https://wa.me/18096860050?text=Hola, consulta sobre ticket ${id.slice(0, 8)}`}
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
