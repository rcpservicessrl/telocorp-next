'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

export async function updateBooking(bookingId: string, status: string, technicianId: string) {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const updateData: Record<string, unknown> = { status }
  if (technicianId) {
    updateData.technician_id = technicianId
    updateData.assigned_at = new Date().toISOString()
  }

  const { error } = await supabase.from('instala_bookings').update(updateData).eq('id', bookingId)
  if (error) return { error: error.message }

  // Notify customer
  try {
    const { data: booking } = await supabase.from('instala_bookings').select('user_id').eq('id', bookingId).single()
    if (booking?.user_id) {
      await supabase.from('user_notifications').insert({
        user_id: booking.user_id,
        type: 'install',
        title: 'Servicio actualizado',
        body: `Tu solicitud de instalación cambió a: ${status}${technicianId ? '. Técnico asignado.' : ''}`,
        metadata: { booking_id: bookingId, status },
        read: false,
      })
    }
  } catch {}

  return { error: null }
}
