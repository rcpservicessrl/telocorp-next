'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist-context'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  size?: 'sm' | 'md'
}

export function WishlistButton({ productId, size = 'md' }: WishlistButtonProps) {
  const { toggle, has } = useWishlist()
  const inWishlist = has(productId)
  const iconSize = size === 'sm' ? 16 : 20

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(productId) }}
      className={cn(
        'rounded-full flex items-center justify-center transition-colors',
        size === 'sm' ? 'w-7 h-7' : 'w-9 h-9',
        'bg-[var(--c-surface-2)]/80 backdrop-blur-sm hover:bg-[var(--c-surface-3)]'
      )}
      aria-label={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        size={iconSize}
        className={inWishlist ? 'fill-red-500 text-red-500' : 'text-[var(--c-text-muted)]'}
      />
    </button>
  )
}
