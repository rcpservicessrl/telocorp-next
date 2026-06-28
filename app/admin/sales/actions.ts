'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

interface ProductData {
  title: string
  category: string
  price: number
  cost: number
  stock: number
  discount: number
  description: string
  image: string
  featured: boolean
  active: boolean
}

export async function saveProduct(id: string | null, data: ProductData) {
  const supabase = await createSupabaseServer()

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const isAdmin = user.email?.endsWith('@telocg.com') || user.user_metadata?.role === 'admin'
  if (!isAdmin) return { error: 'Acceso denegado' }

  if (id) {
    // Update existing
    const { error } = await supabase
      .from('products')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) return { error: error.message }
  } else {
    // Create new
    const { error } = await supabase
      .from('products')
      .insert({
        ...data,
        rating: 5.0,
        sold: 0,
        images: data.image ? [data.image] : [],
        specs: {},
        video: '',
      })

    if (error) return { error: error.message }
  }

  return { error: null }
}

export async function deleteProduct(id: string) {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const isAdmin = user.email?.endsWith('@telocg.com') || user.user_metadata?.role === 'admin'
  if (!isAdmin) return { error: 'Acceso denegado' }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  return { error: null }
}
