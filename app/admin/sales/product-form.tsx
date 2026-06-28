'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { saveProduct, deleteProduct } from './actions'

interface ProductFormProps {
  product?: {
    id: string
    title: string
    category: string
    price: number
    cost: number
    stock: number
    discount: number
    description: string
    image: string
    images: string[]
    specs: Record<string, string>
    featured: boolean
    active: boolean
  }
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!product

  const [data, setData] = useState({
    title: product?.title || '',
    category: product?.category || '',
    price: product?.price || 0,
    cost: product?.cost || 0,
    stock: product?.stock || 0,
    discount: product?.discount || 0,
    description: product?.description || '',
    image: product?.image || '',
    featured: product?.featured || false,
    active: product?.active ?? true,
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const result = await saveProduct(product?.id || null, data)
    if (result.error) {
      setError(result.error)
      setSaving(false)
    } else {
      router.push('/admin/sales')
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!product?.id) return
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    const result = await deleteProduct(product.id)
    if (result.error) {
      setError(result.error)
    } else {
      router.push('/admin/sales')
      router.refresh()
    }
  }

  const update = (field: string, value: unknown) => setData({ ...data, [field]: value })

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Información básica</h2>

        <Input
          label="Título del producto"
          value={data.title}
          onChange={(e) => update('title', e.target.value)}
          required
          placeholder="iPhone 15 Pro Max 256GB"
        />

        <Input
          label="Categoría"
          value={data.category}
          onChange={(e) => update('category', e.target.value)}
          placeholder="celulares, laptops, accesorios..."
        />

        <div>
          <label className="block text-sm font-medium mb-1.5">Descripción</label>
          <textarea
            value={data.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm resize-none placeholder:text-[var(--c-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]"
            placeholder="Descripción del producto..."
          />
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Precio e inventario</h2>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Precio (RD$)"
            type="number"
            value={data.price}
            onChange={(e) => update('price', Number(e.target.value))}
            required
            min={0}
          />
          <Input
            label="Costo (RD$)"
            type="number"
            value={data.cost}
            onChange={(e) => update('cost', Number(e.target.value))}
            min={0}
          />
          <Input
            label="Stock"
            type="number"
            value={data.stock}
            onChange={(e) => update('stock', Number(e.target.value))}
            min={0}
          />
          <Input
            label="Descuento (%)"
            type="number"
            value={data.discount}
            onChange={(e) => update('discount', Number(e.target.value))}
            min={0}
            max={100}
          />
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Imagen</h2>
        <Input
          label="URL de imagen principal"
          value={data.image}
          onChange={(e) => update('image', e.target.value)}
          placeholder="https://..."
          hint="Usa la Edge Function upload-image para subir imágenes"
        />
        {data.image && (
          <img
            src={`https://wsrv.nl/?url=${encodeURIComponent(data.image)}&w=200&output=webp`}
            alt="Preview"
            className="w-32 h-32 rounded-lg object-cover bg-[var(--c-surface-2)]"
          />
        )}
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Opciones</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={data.active}
              onChange={(e) => update('active', e.target.checked)}
              className="rounded"
            />
            Activo (visible en tienda)
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={data.featured}
              onChange={(e) => update('featured', e.target.checked)}
              className="rounded"
            />
            Destacado
          </label>
        </div>
      </Card>

      {error && (
        <p className="text-sm text-[var(--c-danger)] bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="sales" loading={saving}>
          {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
        </Button>

        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>

        {isEditing && (
          <Button type="button" variant="danger" onClick={handleDelete} className="ml-auto">
            Eliminar
          </Button>
        )}
      </div>
    </form>
  )
}
