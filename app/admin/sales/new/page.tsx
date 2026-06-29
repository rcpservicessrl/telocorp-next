import { createSupabaseServer } from '@/lib/supabase-server'
import { BRAND } from '@/lib/utils'
import { ProductForm } from '../product-form'

export const metadata = { title: `Nuevo Producto — ${BRAND.sales}` }

export default async function NewProductPage() {
  const supabase = await createSupabaseServer()

  const { data: allProducts } = await supabase
    .from('products')
    .select('category')
    .eq('active', true)

  const categories = [...new Set((allProducts || []).map(p => p.category).filter(Boolean))]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
