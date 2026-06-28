'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

/**
 * Generic status updater for any booking/order table.
 * Used by the StatusChanger component across all admin modules.
 */
export async function updateBookingStatus(
  table: 'repara_bookings' | 'instala_bookings' | 'lleva_requests' | 'orders',
  id: string,
  status: string
) {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const isAdmin = user.email?.endsWith('@telocg.com') || user.user_metadata?.role === 'admin'
  if (!isAdmin) return { error: 'Acceso denegado' }

  const { error } = await supabase
    .from(table)
    .update({ status })
    .eq('id', id)

  if (error) return { error: error.message }

  // Create notification for customer if user_id exists
  try {
    const { data: record } = await supabase
      .from(table)
      .select('user_id')
      .eq('id', id)
      .single()

    if (record?.user_id) {
      const typeMap: Record<string, string> = {
        repara_bookings: 'repair',
        instala_bookings: 'install',
        lleva_requests: 'delivery',
        orders: 'order',
      }

      await supabase.from('user_notifications').insert({
        user_id: record.user_id,
        type: typeMap[table] || 'system',
        title: 'Estado actualizado',
        body: `Tu solicitud ha cambiado a: ${status}`,
        metadata: { id, table, status },
        read: false,
      })
    }
  } catch {}

  return { error: null }
}
