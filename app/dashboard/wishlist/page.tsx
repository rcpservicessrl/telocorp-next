'use client'

import { useEffect, useState } from 'react'
import { useWishlist } from '@/lib/wishlist-context'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WishlistButton } from '@/components/products/wishlist-button'
import Link from 'next/link'
import { BRAND } from '@/lib/utils'

interface Product {
  id: string
  title: string
  price: number
  image: string
  rating: number
}

export default function WishlistPage() {
  const { items } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    if (!supabase) { setLoading(false); return }

    supabase
      .from('products')
      .select('id, title, price, image, rating')
      .in('id', items)
      .then(({ data }) => {
        setProducts(data || [])
        setLoading(false)
      })
  }, [items])

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mis Favoritos</h1>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-[var(--c-surface-2)] rounded-xl" />)}
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Favoritos ❤️</h1>

      {products.length === 0 ? (
        <div className="text-center py-16 text-[var(--c-text-muted)]">
          <p className="text-4xl mb-3">💝</p>
          <p className="mb-4">No tienes favoritos aún.</p>
          <Link href="/products">
            <Button variant="sales">Explorar {BRAND.sales}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}>
              <Card hover className="flex items-center gap-4 p-3">
                <div className="w-16 h-16 rounded-lg bg-[var(--c-surface-2)] overflow-hidden shrink-0">
                  {p.image && (
                    <img
                      src={`https://wsrv.nl/?url=${encodeURIComponent(p.image)}&w=64&h=64&output=webp`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                  <p className="text-sm font-bold text-[var(--c-sales)]">RD$ {p.price.toLocaleString()}</p>
                  <p className="text-xs text-[var(--c-text-dim)]">★ {p.rating}</p>
                </div>
                <WishlistButton productId={p.id} size="sm" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
