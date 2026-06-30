'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

export async function saveDriver(data: { name: string; phone: string; vehicle: string; zone: string }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase.from('drivers').insert({
    name: data.name,
    phone: data.phone,
    vehicle: data.vehicle,
    zone: data.zone,
    rating: 5,
    jobs_completed: 0,
    status: 'available',
    avatar: data.vehicle === 'motorcycle' ? '🏍️' : data.vehicle === 'van' ? '🚐' : '🚗',
  })

  if (error) return { error: error.message }
  return { error: null }
}
