import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookingActions } from './booking-actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminInstalaDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data: booking } = await supabase.from('instala_bookings').select('*').eq('id', id).single()
  if (!booking) notFound()

  const { data: technicians } = await supabase.from('technicians').select('id, name, specialization').order('name')

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Booking #{id.slice(0, 8)}</h1>
        <Badge variant={booking.status === 'completed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'instala'}>
          {booking.status}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">Servicio</h3>
          <div className="text-sm space-y-1">
            <p className="font-medium">{booking.service_name || booking.service}</p>
            {booking.description && <p className="text-[var(--c-text-muted)]">{booking.description}</p>}
            <p className="text-[var(--c-instala)] font-bold">RD$ {(booking.estimated_cost || 0).toLocaleString()}</p>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">Cliente</h3>
          <div className="text-sm space-y-1">
            <p>{booking.customer_name}</p>
            <p>{booking.customer_phone} <a href={`https://wa.me/${(booking.customer_phone || '').replace(/\D/g, '')}`} target="_blank" className="text-[var(--c-success)]">💬</a></p>
            <p className="text-[var(--c-text-muted)]">{booking.address}</p>
            {booking.preferred_date && <p>📅 {booking.preferred_date} — {booking.preferred_time || 'por confirmar'}</p>}
          </div>
        </Card>
      </div>

      <BookingActions
        bookingId={id}
        currentStatus={booking.status}
        currentTechnician={booking.technician_id || ''}
        technicians={technicians || []}
      />
    </div>
  )
}
