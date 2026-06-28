import { supabase, type Product } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TeloSales — Tienda de Tecnología',
  description: 'Catálogo de tecnología y accesorios premium con envío express en República Dominicana.',
}

async function getProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">TeloSales Store</h1>
      <p className="text-[var(--c-text-muted)] mb-8">
        Catálogo de tecnología y accesorios premium con envío express.
      </p>

      {/* TODO: Filters, search, sort */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <a
            key={p.id}
            href={`/products/${p.id}`}
            className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl overflow-hidden hover:border-[var(--c-sales)] transition-colors"
          >
            <div className="aspect-square bg-[var(--c-surface-2)]">
              {p.image && (
                <img
                  src={`https://wsrv.nl/?url=${encodeURIComponent(p.image.startsWith('http') ? p.image : `https://telocg.com/${p.image}`)}&w=400&output=webp&q=75`}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium line-clamp-2">{p.title}</h3>
              <p className="text-[var(--c-sales)] font-bold mt-1">
                RD$ {p.price.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--c-text-muted)]">
                ★ {p.rating} · {p.sold || 0} vendidos
              </p>
            </div>
          </a>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-[var(--c-text-muted)] py-20">
          Cargando catálogo...
        </p>
      )}
    </main>
  )
}
