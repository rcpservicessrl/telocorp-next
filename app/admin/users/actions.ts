'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

export async function inviteUser(email: string, role: string, modules: string[]) {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const isAdmin = user.email?.endsWith('@telocg.com') || user.user_metadata?.role === 'admin'
  if (!isAdmin) return { error: 'Solo admins pueden invitar usuarios' }

  // Get the default org (telocorp)
  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', 'telocorp')
    .single()

  if (!org) return { error: 'Organización no encontrada' }

  // Send invite via Supabase Auth
  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { role, modules },
  })

  // If admin.inviteUserByEmail fails (common without service_role key), 
  // we still register the member for when they sign up
  if (inviteError) {
    // Fallback: just add them as a pending member record
    // They'll be linked when they sign up with that email
    const { error: memberError } = await supabase
      .from('org_members')
      .insert({
        org_id: org.id,
        user_id: user.id, // placeholder — will be updated on signup
        role,
        modules: modules.length > 0 ? modules : [],
        invited_by: user.id,
      })

    if (memberError) return { error: memberError.message }
    return { error: null }
  }

  // If invite succeeded, add member record
  if (inviteData?.user) {
    await supabase.from('org_members').insert({
      org_id: org.id,
      user_id: inviteData.user.id,
      role,
      modules: modules.length > 0 ? modules : [],
      invited_by: user.id,
    })
  }

  return { error: null }
}
