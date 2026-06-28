import type { MetadataRoute } from 'next'
import { createSupabaseServer } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createSupabaseServer()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: 'https://telocg.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://telocg.com/products', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://telocg.com/educa', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://telocg.com/lleva', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://telocg.com/repara', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://telocg.com/instala', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://telocg.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Dynamic product pages
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('active', true)

  const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `https://telocg.com/products/${p.id}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic course pages
  const { data: courses } = await supabase
    .from('courses')
    .select('id')
    .eq('active', true)

  const coursePages: MetadataRoute.Sitemap = (courses || []).map((c) => ({
    url: `https://telocg.com/educa/${c.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...coursePages]
}
