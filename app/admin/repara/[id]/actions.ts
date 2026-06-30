'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

export async function updateTicket(ticketId: string, status: string, technicianId: string) {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const isAdmin = user.email?.endsWith('@telocg.com') || user.user_metadata?.role === 'admin'
  if (!isAdmin) return { error: 'Acceso denegado' }

  const updateData: Record<string, unknown> = { status }
  if (technicianId) {
    updateData.technician_id = technicianId
    updateData.assigned_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('repara_bookings')
    .update(updateData)
    .eq('id', ticketId)

  if (error) return { error: error.message }

  // Notify customer
  try {
    const { data: ticket } = await supabase.from('repara_bookings').select('user_id').eq('id', ticketId).single()
    if (ticket?.user_id) {
      await supabase.from('user_notifications').insert({
        user_id: ticket.user_id,
        type: 'repair',
        title: 'Reparación actualizada',
        body: `Tu solicitud cambió a: ${status}${technicianId ? '. Técnico asignado.' : ''}`,
        metadata: { ticket_id: ticketId, status },
        read: false,
      })
    }
  } catch {}

  return { error: null }
}
