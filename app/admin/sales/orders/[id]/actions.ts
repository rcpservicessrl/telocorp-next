'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

export async function updateOrderStatus(orderId: string, status: string, notes: string) {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const isAdmin = user.email?.endsWith('@telocg.com') || user.user_metadata?.role === 'admin'
  if (!isAdmin) return { error: 'Acceso denegado' }

  const { error } = await supabase
    .from('orders')
    .update({ status, notes })
    .eq('id', orderId)

  if (error) return { error: error.message }

  // Log to orders_history
  try {
    await supabase.from('orders_history').insert({
      order_id: orderId,
      action: `status_changed_to_${status}`,
      actor: user.email,
      details: notes ? { notes } : {},
    })
  } catch {}

  return { error: null }
}
