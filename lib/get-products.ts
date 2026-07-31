import { createSupabaseServer } from '@/lib/supabase-server'
import localProducts from '../public/whatsapp-products.json'

export interface CatalogProduct {
  id: string
  title: string
  description?: string
  price: number
  cost?: number
  category: string
  image: string
  images?: string[]
  video?: string
  stock?: number
  sold?: number
  discount?: number
  rating?: number
  featured?: boolean
  active?: boolean
  specs?: Record<string, any>
  created_at?: string
}

export async function getAllProducts(): Promise<CatalogProduct[]> {
  try {
    const supabase = await createSupabaseServer()
    const { data: dbProducts } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)

    const dbMap = new Map((dbProducts || []).map((p: any) => [p.id, p]))
    const merged: CatalogProduct[] = [...(dbProducts || [])]

    for (const item of localProducts as any[]) {
      if (!dbMap.has(item.id)) {
        merged.push({
          id: item.id,
          title: item.title,
          description: item.description || '',
          price: item.price || 0,
          cost: item.cost || 0,
          category: item.category || 'Accesorios',
          image: item.image || '',
          images: item.images || [],
          video: item.video || '',
          stock: 15,
          sold: 3,
          discount: 0,
          rating: 5.0,
          featured: false,
          active: true,
          specs: {},
          created_at: new Date().toISOString()
        })
      }
    }
    return merged
  } catch (error) {
    return localProducts as CatalogProduct[]
  }
}

export async function getSingleProduct(idOrSlug: string): Promise<CatalogProduct | null> {
  const all = await getAllProducts()
  return all.find(p => p.id === idOrSlug || p.id.toLowerCase() === idOrSlug.toLowerCase()) || null
}
