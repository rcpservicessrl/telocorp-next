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
  images: string[]
  video: string
  specs: Record<string, string>
  featured: boolean
  active: boolean
}

export async function saveProduct(id: string | null, data: ProductData) {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const isAdmin = user.email?.endsWith('@telocg.com') || user.user_metadata?.role === 'admin'
  if (!isAdmin) return { error: 'Acceso denegado' }

  if (id) {
    const { error } = await supabase
      .from('products')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('products')
      .insert({ ...data, rating: 5.0, sold: 0 })
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

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

/**
 * Generate product specs using Gemini AI via Edge Function
 */
export async function generateSpecs(productName: string, category: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return { specs: null }

    const res = await fetch(`${supabaseUrl}/functions/v1/ai-specs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ product: productName, category }),
    })

    if (!res.ok) return { specs: null }
    const data = await res.json()
    return { specs: data.specs || data }
  } catch {
    return { specs: null }
  }
}

/**
 * Generate product description using Gemini AI via Edge Function
 */
export async function generateDescription(productName: string, category: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return { description: null }

    const res = await fetch(`${supabaseUrl}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        message: `Genera una descripción comercial profesional en español (2-3 oraciones) para el producto: "${productName}" (categoría: ${category}). Solo la descripción, sin comillas ni prefijos.`,
        context: 'Eres un copywriter de e-commerce dominicano. Escribe descripciones atractivas y concisas.',
      }),
    })

    if (!res.ok) return { description: null }
    const data = await res.json()
    const desc = (data.reply || data.response || '').replace(/^["']|["']$/g, '').trim()
    return { description: desc || null }
  } catch {
    return { description: null }
  }
}
