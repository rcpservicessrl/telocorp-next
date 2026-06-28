import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase-server'

interface RelatedProductsProps {
  currentId: string
  category: string
}

export async function RelatedProducts({ currentId, category }: RelatedProductsProps) {
  const supabase = await createSupabaseServer()

  const { data: related } = await supabase
    .from('products')
    .select('id, title, price, image, rating')
    .eq('active', true)
    .eq('category', category)
    .neq('id', currentId)
    .limit(4)

  if (!related || related.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold mb-4">Productos relacionados</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {related.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl overflow-hidden hover:border-[var(--c-sales)] transition-colors group"
          >
            <div className="aspect-square bg-[var(--c-surface-2)] overflow-hidden">
              {p.image && (
                <img
                  src={`https://wsrv.nl/?url=${encodeURIComponent(p.image)}&w=200&output=webp&q=75`}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}
            </div>
            <div className="p-2">
              <h3 className="text-xs font-medium line-clamp-2">{p.title}</h3>
              <p className="text-sm font-bold text-[var(--c-sales)] mt-1">RD$ {p.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
