import { getAllProducts } from '@/lib/get-products'
import { BRAND } from '@/lib/utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ProductFilters } from '@/components/products/product-filters'
import { SocialProof } from '@/components/products/social-proof'
import { FlashSaleBanner } from '@/components/products/flash-sale-banner'
import { WishlistButton } from '@/components/products/wishlist-button'
import { ProductCardQuickAdd } from '@/components/products/product-card-quick-add'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `${BRAND.sales} — Tienda de Tecnología`,
  description: 'Catálogo de tecnología y accesorios premium con envío express en República Dominicana.',
}

interface Props {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  let products = await getAllProducts()

  // Filter by category
  if (params.category) {
    products = products.filter(p => p.category.toLowerCase() === params.category!.toLowerCase())
  }

  // Search by title or description
  if (params.q) {
    const qLower = params.q.toLowerCase()
    products = products.filter(p => 
      p.title.toLowerCase().includes(qLower) || 
      (p.description && p.description.toLowerCase().includes(qLower))
    )
  }

  // Sort
  switch (params.sort) {
    case 'price_asc':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      products.sort((a, b) => b.price - a.price)
      break
    case 'popular':
      products.sort((a, b) => (b.sold || 0) - (a.sold || 0))
      break
    case 'rating':
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    default:
      // Keep default order
      break
  }

  const allFullProducts = await getAllProducts()
  const categories = [...new Set(allFullProducts.map(p => p.category).filter(Boolean))]

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        <span className="text-[var(--c-sales)]">🛒</span> {BRAND.sales}
      </h1>
      <p className="text-[var(--c-text-muted)] mb-6">
        Tecnología y accesorios premium con envío express en toda RD.
      </p>

      <Suspense fallback={null}>
        <ProductFilters categories={categories} />
      </Suspense>

      {/* Flash sale countdown if products have discounts */}
      <FlashSaleBanner
        enabled={true}
        productCount={(products || []).filter(p => (p.discount ?? 0) > 0).length}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {(products || []).map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl overflow-hidden hover:border-[var(--c-sales)] transition-colors group"
          >
            <div className="aspect-square bg-[var(--c-surface-2)] overflow-hidden relative">
              {p.image && (
                <img
                  src={`https://wsrv.nl/?url=${encodeURIComponent(p.image.startsWith('http') ? p.image : `https://telocg.com/${p.image}`)}&w=400&output=webp&q=75`}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}
              {(p.discount ?? 0) > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{p.discount}%</span>
              )}
              <div className="absolute top-2 right-2">
                <WishlistButton productId={p.id} size="sm" />
              </div>
              <ProductCardQuickAdd product={{ id: p.id, title: p.title, price: p.price, image: p.image }} />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium line-clamp-2">{p.title}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[var(--c-sales)] font-bold">
                  RD$ {p.price.toLocaleString()}
                </span>
                {(p.discount ?? 0) > 0 && (
                  <span className="text-xs text-[var(--c-text-dim)] line-through">
                    RD$ {Math.round(p.price / (1 - (p.discount ?? 0) / 100)).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--c-text-dim)] mt-1">
                ★ {p.rating} · {p.sold || 0} vendidos
              </p>
            </div>
          </Link>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <div className="text-center py-20 text-[var(--c-text-muted)]">
          <p className="text-4xl mb-4">🔍</p>
          <p>No se encontraron productos{params.q ? ` para "${params.q}"` : ''}.</p>
        </div>
      )}

      {/* Social proof popups */}
      <SocialProof
        products={(products || []).slice(0, 10).map(p => ({ title: p.title, image: p.image }))}
        enabled={true}
      />
    </main>
  )
}
