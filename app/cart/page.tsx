'use client'

import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BRAND } from '@/lib/utils'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart()

  const shipping = subtotal >= 5000 ? 0 : 250
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-[var(--c-text-muted)] mb-6">Explora {BRAND.sales} y añade productos.</p>
        <Link href="/products">
          <Button variant="sales">Ver Tienda</Button>
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Carrito ({itemCount} items)</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="flex items-center gap-4 p-4">
              <div className="w-16 h-16 rounded-lg bg-[var(--c-surface-2)] overflow-hidden shrink-0">
                {item.image && (
                  <img
                    src={`https://wsrv.nl/?url=${encodeURIComponent(item.image)}&w=64&h=64&output=webp`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                <p className="text-sm font-bold text-[var(--c-sales)]">
                  RD$ {item.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-lg bg-[var(--c-surface-2)] flex items-center justify-center hover:bg-[var(--c-surface-3)] transition-colors"
                  aria-label="Reducir cantidad"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-[var(--c-surface-2)] flex items-center justify-center hover:bg-[var(--c-surface-3)] transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-[var(--c-text-dim)] hover:text-[var(--c-danger)] transition-colors"
                aria-label="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-20 p-5 space-y-4">
            <h2 className="font-semibold">Resumen</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--c-text-muted)]">Subtotal</span>
                <span>RD$ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--c-text-muted)]">Envío</span>
                <span className={shipping === 0 ? 'text-[var(--c-success)]' : ''}>
                  {shipping === 0 ? 'GRATIS' : `RD$ ${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[var(--c-text-dim)]">
                  Envío gratis en compras +RD$ 5,000
                </p>
              )}
              <div className="pt-2 border-t border-[var(--c-border)] flex justify-between font-bold">
                <span>Total</span>
                <span className="text-[var(--c-sales)]">RD$ {total.toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout" className="block">
              <Button variant="sales" className="w-full">
                Proceder al Pago
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </main>
  )
}
