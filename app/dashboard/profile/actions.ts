'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

interface ProfileData {
  full_name: string
  phone: string
  address: string
  city: string
  avatar_url: string
}

export async function updateProfile(userId: string, data: ProfileData) {
  const supabase = await createSupabaseServer()

  // Verify the user is updating their own profile
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) {
    return { error: 'No autorizado' }
  }

  // Update user_profiles table
  const { error: profileError } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      full_name: data.full_name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      avatar_url: data.avatar_url,
      updated_at: new Date().toISOString(),
    })

  if (profileError) {
    return { error: profileError.message }
  }

  // Also update auth metadata for display in Header
  await supabase.auth.updateUser({
    data: {
      full_name: data.full_name,
      phone: data.phone,
    },
  })

  return { error: null }
}
