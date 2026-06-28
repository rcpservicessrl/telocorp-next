import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { ProductForm } from '../../product-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>
      <ProductForm product={product} />
    </div>
  )
}
