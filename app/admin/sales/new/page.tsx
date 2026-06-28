import { BRAND } from '@/lib/utils'
import { ProductForm } from '../product-form'

export const metadata = { title: `Nuevo Producto — ${BRAND.sales}` }

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>
      <ProductForm />
    </div>
  )
}
