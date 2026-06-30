'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

interface QuickAddProps {
  product: { id: string; title: string; price: number; image: string }
}

/**
 * Quick add-to-cart button overlay on product cards in the catalog grid.
 */
export function ProductCardQuickAdd({ product }: QuickAddProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      onClick={handleAdd}
      className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[var(--c-sales)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110"
      aria-label="Agregar al carrito"
    >
      {added ? <Check size={14} /> : <ShoppingCart size={14} />}
    </button>
  )
}
