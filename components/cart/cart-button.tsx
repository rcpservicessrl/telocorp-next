'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export function CartButton() {
  const { itemCount } = useCart()

  return (
    <Link
      href="/cart"
      className="relative p-2 rounded-lg hover:bg-[var(--c-surface-2)] transition-colors"
      aria-label={`Carrito${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
    >
      <ShoppingCart size={18} />
      {itemCount > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--c-sales)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  )
}
