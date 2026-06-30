'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

export async function saveTechnician(data: { name: string; specialization: string; avatar: string; rating: number; phone: string }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase.from('technicians').insert({
    name: data.name,
    specialization: data.specialization,
    avatar: data.avatar || '👨‍🔧',
    rating: data.rating || 5,
    phone: data.phone,
    jobs_completed: 0,
    active: true,
  })

  if (error) return { error: error.message }
  return { error: null }
}
