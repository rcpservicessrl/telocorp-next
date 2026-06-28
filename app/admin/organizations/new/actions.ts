'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

interface CreateOrgParams {
  name: string
  slug: string
  modules: string[]
  plan: string
}

export async function createOrganization(params: CreateOrgParams) {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const isAdmin = user.email?.endsWith('@telocg.com') || user.user_metadata?.role === 'admin'
  if (!isAdmin) return { error: 'Solo super-admins pueden crear organizaciones' }

  const { error } = await supabase
    .from('organizations')
    .insert({
      name: params.name,
      slug: params.slug,
      modules: params.modules,
      plan: params.plan,
      owner_id: user.id,
      active: true,
    })

  if (error) {
    if (error.message.includes('duplicate')) return { error: 'El slug ya está en uso' }
    return { error: error.message }
  }

  return { error: null }
}
