'use client'

import { useEffect } from 'react'
import { trackRecentlyViewed } from '@/components/products/recently-viewed'

/**
 * Client-side effects for product detail page:
 * - Track recently viewed products
 */
export function ProductDetailClient({ productId }: { productId: string }) {
  useEffect(() => {
    trackRecentlyViewed(productId)
  }, [productId])

  return null
}
