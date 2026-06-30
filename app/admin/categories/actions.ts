'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

export async function addCategory(name: string, margin: number) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase.from('categories').insert({ name, margin, active: true })
  if (error) {
    if (error.message.includes('duplicate')) return { error: 'Ya existe' }
    return { error: error.message }
  }
  return { error: null }
}

export async function updateMargin(id: string, margin: number) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase.from('categories').update({ margin }).eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function deleteCategory(id: string) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}
