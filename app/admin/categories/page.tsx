import { createSupabaseServer } from '@/lib/supabase-server'
import { Card } from '@/components/ui/card'
import { CategoryForm } from './category-form'
import { CategoryList } from './category-list'

export const metadata = { title: 'Admin — Categorías' }

export default async function AdminCategoriesPage() {
  const supabase = await createSupabaseServer()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  // Count products per category
  const { data: products } = await supabase.from('products').select('category')
  const counts: Record<string, number> = {}
  ;(products || []).forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1 })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Categorías</h1>
      <p className="text-sm text-[var(--c-text-muted)] mb-6">
        El margen se usa en la calculadora de precios al crear/editar productos.
      </p>

      <CategoryForm />

      <div className="mt-6">
        <CategoryList categories={categories || []} counts={counts} />
      </div>
    </div>
  )
}
