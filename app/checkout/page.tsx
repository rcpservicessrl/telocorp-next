'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { PaymentSelector, type PaymentMethod } from '@/components/payments/payment-selector'
import { CouponInput } from '@/components/cart/coupon-input'
import { placeOrder } from './actions'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: 'Santo Domingo',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const shipping = subtotal >= 5000 ? 0 : 250
  const total = subtotal - couponDiscount + shipping

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">🛒</p>
        <p className="text-[var(--c-text-muted)]">Tu carrito está vacío.</p>
        <Link href="/products" className="text-[var(--c-info)] hover:underline text-sm mt-2 inline-block">
          Volver a la tienda
        </Link>
      </main>
    )
  }

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      setError('Selecciona un método de pago')
      return
    }
    setLoading(true)
    setError('')

    const result = await placeOrder({
      items: items.map(i => ({ id: i.id, title: i.title, qty: i.quantity, price: i.price })),
      customer: customerInfo,
      subtotal,
      discount: couponDiscount,
      coupon: couponCode || null,
      shipping,
      total,
      payment_method: paymentMethod,
      user_id: user?.id || null,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      clearCart()
      router.push(`/checkout/success?order=${result.orderId}`)
    }
  }

  const updateInfo = (field: string, value: string) => {
    setCustomerInfo({ ...customerInfo, [field]: value })
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Form */}
        <div className="md:col-span-3 space-y-6">
          {/* Step 1: Customer info */}
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold">1. Datos de envío</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nombre"
                value={customerInfo.name}
                onChange={(e) => updateInfo('name', e.target.value)}
                required
                placeholder="Tu nombre completo"
              />
              <Input
                label="WhatsApp"
                value={customerInfo.phone}
                onChange={(e) => updateInfo('phone', e.target.value)}
                required
                placeholder="809-000-0000"
              />
              <Input
                label="Email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => updateInfo('email', e.target.value)}
                required
              />
              <Input
                label="Ciudad"
                value={customerInfo.city}
                onChange={(e) => updateInfo('city', e.target.value)}
              />
            </div>
            <Input
              label="Dirección de entrega"
              value={customerInfo.address}
              onChange={(e) => updateInfo('address', e.target.value)}
              required
              placeholder="Calle, número, sector, referencia"
            />
          </Card>

          {/* Step 2: Payment */}
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold">2. Método de pago</h2>
            <PaymentSelector
              selected={paymentMethod}
              onSelect={setPaymentMethod}
              amount={total}
            />
          </Card>

          {/* Coupon */}
          <Card className="p-6 space-y-3">
            <h2 className="font-semibold">3. Cupón de descuento</h2>
            <CouponInput
              subtotal={subtotal}
              onApply={(discount, code) => { setCouponDiscount(discount); setCouponCode(code) }}
              onRemove={() => { setCouponDiscount(0); setCouponCode('') }}
              appliedCode={couponCode}
            />
          </Card>

          {error && (
            <p className="text-sm text-[var(--c-danger)] bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button
            variant="sales"
            size="lg"
            className="w-full"
            onClick={handlePlaceOrder}
            loading={loading}
            disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address || !paymentMethod}
          >
            Confirmar Pedido — RD$ {total.toLocaleString()}
          </Button>
        </div>

        {/* Order summary */}
        <div className="md:col-span-2">
          <Card className="sticky top-20 p-5 space-y-3">
            <h3 className="font-semibold text-sm">Tu pedido</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[var(--c-text-muted)] line-clamp-1 flex-1">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="shrink-0 ml-2">RD$ {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-[var(--c-border)] space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--c-text-muted)]">Subtotal</span>
                <span>RD$ {subtotal.toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[var(--c-success)]">
                  <span>Cupón ({couponCode})</span>
                  <span>-RD$ {couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--c-text-muted)]">Envío</span>
                <span>{shipping === 0 ? 'GRATIS' : `RD$ ${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold pt-1">
                <span>Total</span>
                <span className="text-[var(--c-sales)]">RD$ {total.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
