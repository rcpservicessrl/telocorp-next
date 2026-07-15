'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { parseWhatsAppChat, ParsedProduct } from '@/lib/whatsapp-parser'

export async function getWhatsAppProducts() {
  try {
    const products = parseWhatsAppChat()
    return { products, error: null }
  } catch (e: any) {
    return { products: [], error: e.message }
  }
}

export async function importWhatsAppProducts(selectedProducts: ParsedProduct[]) {
  const supabase = await createSupabaseServer()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const isAdmin = user.email?.endsWith('@telocg.com') || 
                  user.user_metadata?.role === 'admin' || 
                  user.user_metadata?.role === 'owner'
  if (!isAdmin) return { error: 'Acceso denegado' }

  // 1. Auto-create categories in DB if they don't exist
  const categories = [...new Set(selectedProducts.map(p => p.category))]
  for (const catName of categories) {
    const { data: existing } = await supabase
      .from('categories')
      .select('name')
      .eq('name', catName)
      .maybeSingle()
      
    if (!existing) {
      let margin = 50
      if (catName === 'Accesorios') margin = 100
      if (catName === 'Audio' || catName === 'Iluminación') margin = 80
      
      await supabase.from('categories').insert({ name: catName, margin, active: true })
    }
  }

  // 2. Batch insert/upsert to Supabase products table
  const productsToInsert = selectedProducts.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    cost: p.cost,
    price: p.price,
    image: p.image,
    images: p.images,
    category: p.category,
    active: true,
    featured: false,
    stock: 15, // Default stock count
    sold: 0,
    rating: 5.0
  }))

  const { error } = await supabase
    .from('products')
    .upsert(productsToInsert, { onConflict: 'id' })

  if (error) {
    console.error('Error upserting products:', error)
    return { error: error.message }
  }

  return { error: null }
}
