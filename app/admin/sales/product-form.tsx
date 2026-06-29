'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Sparkles, Plus, X, GripVertical } from 'lucide-react'
import { saveProduct, deleteProduct, generateSpecs, generateDescription } from './actions'

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
    video: string
    specs: Record<string, string>
    featured: boolean
    active: boolean
  }
  categories?: string[]
}

export function ProductForm({ product, categories = [] }: ProductFormProps) {
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
    video: product?.video || '',
    featured: product?.featured || false,
    active: product?.active ?? true,
  })

  const [images, setImages] = useState<string[]>(product?.images || (product?.image ? [product.image] : []))
  const [specs, setSpecs] = useState<[string, string][]>(
    product?.specs ? Object.entries(product.specs) : [['', '']]
  )
  const [imageUrl, setImageUrl] = useState('')
  const [margin, setMargin] = useState(50)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState('')
  const [error, setError] = useState('')

  // Price calculator
  const suggestedPrice = Math.round(data.cost * (1 + margin / 100))
  const finalPrice = Math.round(suggestedPrice * (1 - data.discount / 100))
  const profit = finalPrice - data.cost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.title) { setError('Nombre del producto requerido'); return }
    setSaving(true)
    setError('')

    const specsObj: Record<string, string> = {}
    specs.forEach(([k, v]) => { if (k.trim() && v.trim()) specsObj[k.trim()] = v.trim() })

    const result = await saveProduct(product?.id || null, {
      ...data,
      image: images[0] || '',
      images,
      video: data.video,
      specs: specsObj,
    })

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
    if (!confirm('¿Eliminar este producto permanentemente?')) return
    const result = await deleteProduct(product.id)
    if (result.error) { setError(result.error) }
    else { router.push('/admin/sales'); router.refresh() }
  }

  // Gallery management
  const addImageUrl = () => {
    if (imageUrl.trim()) { setImages([...images, imageUrl.trim()]); setImageUrl('') }
  }
  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i))
  const moveImage = (from: number, to: number) => {
    const arr = [...images]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    setImages(arr)
  }

  // Specs management
  const addSpec = () => setSpecs([...specs, ['', '']])
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i))
  const updateSpec = (i: number, field: 0 | 1, value: string) => {
    const newSpecs = [...specs]
    newSpecs[i] = [...newSpecs[i]] as [string, string]
    newSpecs[i][field] = value
    setSpecs(newSpecs)
  }

  // AI features
  const handleAiSpecs = async () => {
    if (!data.title) { setError('Ingresa el nombre del producto primero'); return }
    setAiLoading('specs')
    const result = await generateSpecs(data.title, data.category)
    if (result.specs) {
      setSpecs(Object.entries(result.specs))
    }
    setAiLoading('')
  }

  const handleAiDescription = async () => {
    if (!data.title) { setError('Ingresa el nombre del producto primero'); return }
    setAiLoading('desc')
    const result = await generateDescription(data.title, data.category)
    if (result.description) {
      setData({ ...data, description: result.description })
    }
    setAiLoading('')
  }

  const update = (field: string, value: unknown) => setData({ ...data, [field]: value })

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic info */}
      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Información del producto</h2>

        <Input
          label="Nombre"
          value={data.title}
          onChange={(e) => update('title', e.target.value)}
          required
          placeholder="iPhone 15 Pro Max 256GB"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5">Categoría</label>
            <input
              list="categories-list"
              value={data.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full h-10 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]"
              placeholder="Seleccionar o escribir nueva"
            />
            <datalist id="categories-list">
              {categories.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <Input
            label="Video URL (opcional)"
            value={data.video}
            onChange={(e) => update('video', e.target.value)}
            placeholder="https://youtube.com/..."
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-1.5">Descripción</label>
          <textarea
            value={data.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm resize-none placeholder:text-[var(--c-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]"
            placeholder="Descripción del producto..."
          />
          <button
            type="button"
            onClick={handleAiDescription}
            disabled={aiLoading === 'desc'}
            className="absolute top-0 right-0 flex items-center gap-1 px-2 py-1 text-xs text-[var(--c-educa)] hover:bg-purple-500/10 rounded-md transition-colors"
          >
            <Sparkles size={12} />
            {aiLoading === 'desc' ? 'Generando...' : 'IA'}
          </button>
        </div>
      </Card>

      {/* Pricing calculator */}
      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Precio y finanzas</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input label="Costo (RD$)" type="number" value={data.cost} onChange={(e) => update('cost', Number(e.target.value))} min={0} />
          <div>
            <label className="block text-sm font-medium mb-1.5">Margen %</label>
            <input
              type="number"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full h-10 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]"
              min={0} max={500}
            />
          </div>
          <Input label="Precio (RD$)" type="number" value={data.price} onChange={(e) => update('price', Number(e.target.value))} min={0} />
          <Input label="Descuento %" type="number" value={data.discount} onChange={(e) => update('discount', Number(e.target.value))} min={0} max={100} />
        </div>

        {/* Price suggestion */}
        {data.cost > 0 && (
          <div className="p-3 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-border)] text-sm space-y-1">
            <p className="text-[var(--c-text-dim)]">💡 Calculadora de precio</p>
            <p>Sugerido (costo + {margin}%): <strong className="text-[var(--c-sales)]">RD$ {suggestedPrice.toLocaleString()}</strong></p>
            {data.discount > 0 && <p>Con descuento (-{data.discount}%): <strong>RD$ {finalPrice.toLocaleString()}</strong></p>}
            <p>Ganancia estimada: <strong className={profit > 0 ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]'}>RD$ {profit.toLocaleString()}</strong>
              {data.price > 0 && <span className="text-[var(--c-text-dim)]"> ({Math.round(((data.price - data.cost) / data.price) * 100)}% margen real)</span>}
            </p>
            {suggestedPrice !== data.price && (
              <button type="button" onClick={() => update('price', suggestedPrice)} className="text-xs text-[var(--c-info)] hover:underline">
                Usar precio sugerido →
              </button>
            )}
          </div>
        )}

        <Input label="Stock" type="number" value={data.stock} onChange={(e) => update('stock', Number(e.target.value))} min={0} />
      </Card>

      {/* Image gallery */}
      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Galería de imágenes</h2>

        {/* Current images */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {images.map((url, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-[var(--c-surface-2)] border border-[var(--c-border)]">
                <img src={`https://wsrv.nl/?url=${encodeURIComponent(url)}&w=120&h=120&output=webp`} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {i > 0 && (
                    <button type="button" onClick={() => moveImage(i, i - 1)} className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs">←</button>
                  )}
                  <button type="button" onClick={() => removeImage(i)} className="w-6 h-6 rounded bg-red-500/80 flex items-center justify-center">
                    <X size={12} />
                  </button>
                  {i < images.length - 1 && (
                    <button type="button" onClick={() => moveImage(i, i + 1)} className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs">→</button>
                  )}
                </div>
                {i === 0 && <span className="absolute top-1 left-1 text-[8px] bg-[var(--c-sales)] text-white px-1 rounded">Principal</span>}
              </div>
            ))}
          </div>
        )}

        {/* Add image URL */}
        <div className="flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Pegar URL de imagen..."
            className="flex-1 h-9 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--c-info)]"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl() } }}
          />
          <button type="button" onClick={addImageUrl} className="h-9 px-3 text-sm bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-surface-3)]">
            Agregar
          </button>
        </div>
        <p className="text-xs text-[var(--c-text-dim)]">La primera imagen será la principal. Arrastra para reordenar.</p>
      </Card>

      {/* Specs */}
      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Especificaciones</h2>
          <button
            type="button"
            onClick={handleAiSpecs}
            disabled={aiLoading === 'specs'}
            className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--c-educa)] hover:bg-purple-500/10 rounded-md transition-colors"
          >
            <Sparkles size={12} />
            {aiLoading === 'specs' ? 'Generando...' : 'Generar con IA'}
          </button>
        </div>

        <div className="space-y-2">
          {specs.map(([key, val], i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => updateSpec(i, 0, e.target.value)}
                placeholder="Clave (ej: Pantalla)"
                className="flex-1 h-9 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--c-info)]"
              />
              <input
                type="text"
                value={val}
                onChange={(e) => updateSpec(i, 1, e.target.value)}
                placeholder="Valor (ej: 6.7 OLED)"
                className="flex-1 h-9 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--c-info)]"
              />
              <button type="button" onClick={() => removeSpec(i)} className="w-9 h-9 flex items-center justify-center text-[var(--c-text-dim)] hover:text-[var(--c-danger)] rounded-lg hover:bg-red-500/10">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addSpec} className="flex items-center gap-1 text-xs text-[var(--c-info)] hover:underline">
          <Plus size={12} /> Agregar especificación
        </button>
      </Card>

      {/* Options */}
      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Opciones</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={data.active} onChange={(e) => update('active', e.target.checked)} className="rounded" />
            Activo (visible en tienda)
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={data.featured} onChange={(e) => update('featured', e.target.checked)} className="rounded" />
            Destacado
          </label>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <p className="text-sm text-[var(--c-danger)] bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Actions */}
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
