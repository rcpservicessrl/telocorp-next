'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const RV_KEY = 'telo_recentlyViewed'
const MAX_ITEMS = 8

interface Product {
  id: string
  title: string
  price: number
  image: string
}

export function trackRecentlyViewed(productId: string) {
  try {
    let rv = JSON.parse(localStorage.getItem(RV_KEY) || '[]') as string[]
    rv = rv.filter(id => id !== productId)
    rv.unshift(productId)
    rv = rv.slice(0, MAX_ITEMS)
    localStorage.setItem(RV_KEY, JSON.stringify(rv))
  } catch {}
}

export function RecentlyViewed({ currentId }: { currentId?: string }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    try {
      const rv = JSON.parse(localStorage.getItem(RV_KEY) || '[]') as string[]
      const ids = rv.filter(id => id !== currentId).slice(0, 6)
      if (ids.length === 0 || !supabase) return

      supabase
        .from('products')
        .select('id, title, price, image')
        .in('id', ids)
        .then(({ data }) => {
          if (data) {
            // Maintain localStorage order
            const sorted = ids.map(id => data.find(p => p.id === id)).filter(Boolean) as Product[]
            setProducts(sorted)
          }
        })
    } catch {}
  }, [currentId])

  if (products.length === 0) return null

  return (
    <section className="mt-10">
      <h3 className="text-sm font-semibold mb-3">Vistos recientemente</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="shrink-0 w-28 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg overflow-hidden hover:border-[var(--c-sales)] transition-colors"
          >
            <div className="aspect-square bg-[var(--c-surface-2)]">
              {p.image && (
                <img
                  src={`https://wsrv.nl/?url=${encodeURIComponent(p.image)}&w=112&output=webp&q=70`}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="p-1.5">
              <p className="text-[10px] line-clamp-1">{p.title}</p>
              <p className="text-xs font-bold text-[var(--c-sales)]">RD$ {p.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
