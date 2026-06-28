import { supabase, type Product } from '@/lib/supabase'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', slug)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Producto no encontrado' }

  return {
    title: `${product.title} — RD$ ${product.price.toLocaleString()}`,
    description: product.description || `Compra ${product.title} en TeloSales con envío express.`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.image || '' }],
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const imgUrl = product.image
    ? `https://wsrv.nl/?url=${encodeURIComponent(product.image.startsWith('http') ? product.image : `https://telocg.com/${product.image}`)}&w=800&output=webp&q=80`
    : ''

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-[var(--c-surface)] rounded-xl overflow-hidden">
          {imgUrl && <img src={imgUrl} alt={product.title} className="w-full h-full object-cover" />}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-[var(--c-success)] font-medium mb-2">✓ TeloSales Verificado</p>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <div className="flex items-baseline gap-3 mb-4">
            {product.discount > 0 && (
              <span className="text-[var(--c-text-muted)] line-through text-sm">
                RD$ {Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
              </span>
            )}
            <span className="text-2xl font-bold text-[var(--c-sales)]">
              RD$ {product.price.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded-full font-bold">
                -{product.discount}%
              </span>
            )}
          </div>

          <p className="text-sm text-[var(--c-text-muted)] mb-4">★ {product.rating} · {product.sold || 0} vendidos</p>
          <p className="text-sm mb-6">{product.description}</p>

          {/* Stock */}
          <p className={`text-sm mb-4 ${(product.stock || 0) <= 5 ? 'text-red-400 font-bold' : 'text-[var(--c-success)]'}`}>
            {(product.stock || 0) <= 5 ? `🔥 ¡Solo ${product.stock} en stock!` : `✓ ${product.stock} disponibles`}
          </p>

          {/* CTA */}
          <button className="w-full py-3 bg-[var(--c-sales)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
            Añadir al Carrito
          </button>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-[var(--c-text-muted)]">
            <span>🔒 Pago seguro CardNET</span>
            <span>🚚 Envío 24-48h</span>
            <span>↩️ Devolución 7 días</span>
            <span>✓ Garantía oficial</span>
          </div>

          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Especificaciones</h3>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key} className="border-b border-[var(--c-border)]">
                      <td className="py-2 text-[var(--c-text-muted)]">{key}</td>
                      <td className="py-2">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
