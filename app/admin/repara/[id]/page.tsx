import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TicketActions } from './ticket-actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminReparaDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data: ticket } = await supabase
    .from('repara_bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (!ticket) notFound()

  // Fetch technicians for assignment
  const { data: technicians } = await supabase
    .from('technicians')
    .select('id, name, specialization')
    .order('name')

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ticket #{id.slice(0, 8)}</h1>
        <Badge variant={ticket.status === 'completed' ? 'success' : ticket.status === 'cancelled' ? 'danger' : 'warning'}>
          {ticket.status}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">Dispositivo</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-[var(--c-text-dim)]">Tipo:</span> {ticket.device}</p>
            <p><span className="text-[var(--c-text-dim)]">Marca:</span> {ticket.brand}</p>
            <p><span className="text-[var(--c-text-dim)]">Modelo:</span> {ticket.model}</p>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">Cliente</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-[var(--c-text-dim)]">Nombre:</span> {ticket.customer_name}</p>
            <p><span className="text-[var(--c-text-dim)]">Tel:</span> {ticket.customer_phone}
              <a href={`https://wa.me/${(ticket.customer_phone || '').replace(/\D/g, '')}`} target="_blank" className="ml-2 text-[var(--c-success)]">💬</a>
            </p>
            <p><span className="text-[var(--c-text-dim)]">Modo:</span> {ticket.service_mode === 'pickup_delivery' ? '🚗 Recogida' : '🏪 En taller'}</p>
          </div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-sm mb-2">Problema</h3>
        <p className="text-sm"><span className="text-[var(--c-text-dim)]">Categoría:</span> {ticket.issue}</p>
        {ticket.description && <p className="text-sm text-[var(--c-text-muted)] mt-1">{ticket.description}</p>}
        {ticket.address && <p className="text-sm mt-2"><span className="text-[var(--c-text-dim)]">Dirección:</span> {ticket.address}</p>}
      </Card>

      <TicketActions
        ticketId={id}
        currentStatus={ticket.status}
        currentTechnician={ticket.technician_id || ''}
        technicians={technicians || []}
      />
    </div>
  )
}
