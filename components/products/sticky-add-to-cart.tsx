'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import { Check } from 'lucide-react'

interface StickyAddToCartProps {
  product: { id: string; title: string; price: number; image: string }
}

/**
 * Sticky bottom bar on mobile — visible after scrolling past the main CTA button.
 */
export function StickyAddToCart({ product }: StickyAddToCartProps) {
  const { addItem } = useCart()
  const [visible, setVisible] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--c-surface)] border-t border-[var(--c-border)] p-3 flex items-center gap-3 shadow-lg">
      <div className="flex-1 min-w-0">
        <p className="text-xs line-clamp-1">{product.title}</p>
        <p className="text-sm font-bold text-[var(--c-sales)]">RD$ {product.price.toLocaleString()}</p>
      </div>
      <button
        onClick={handleAdd}
        className="shrink-0 px-4 py-2.5 bg-[var(--c-sales)] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
      >
        {added ? <><Check size={16} className="inline mr-1" />Añadido</> : 'Añadir 🛒'}
      </button>
    </div>
  )
}
