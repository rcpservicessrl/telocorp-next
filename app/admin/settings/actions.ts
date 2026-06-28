'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

export async function saveSettings(data: Record<string, unknown>) {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const isAdmin = user.email?.endsWith('@telocg.com') || user.user_metadata?.role === 'admin'
  if (!isAdmin) return { error: 'Acceso denegado' }

  // Upsert site_settings (single row table)
  const { error } = await supabase
    .from('site_settings')
    .update(data)
    .eq('id', 'default')

  if (error) return { error: error.message }
  return { error: null }
}
