import { BRAND } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ServiceSuggestion } from '@/components/cross-service/service-suggestion'
import Link from 'next/link'

export const metadata = { title: '¡Pedido Confirmado!' }

export default function CheckoutSuccessPage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold mb-2">¡Pedido Confirmado!</h1>
      <p className="text-[var(--c-text-muted)] mb-6">
        Tu orden ha sido recibida. Te contactaremos por WhatsApp para coordinar el envío y el pago.
      </p>

      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl p-4 text-sm text-left space-y-2 mb-8">
        <p><strong>¿Qué sigue?</strong></p>
        <ol className="list-decimal list-inside space-y-1 text-[var(--c-text-muted)]">
          <li>Recibirás un mensaje de WhatsApp con los detalles</li>
          <li>Realiza el pago con el método seleccionado</li>
          <li>Preparamos tu pedido y te avisamos al despachar</li>
          <li>Entrega en 24-48 horas en Santo Domingo</li>
        </ol>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/products">
          <Button variant="sales">Seguir Comprando</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="secondary">Mi Panel</Button>
        </Link>
      </div>

      <ServiceSuggestion current="sales" context="post_purchase" />
    </main>
  )
}
