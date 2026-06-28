import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: `${BRAND.lleva} — Envíos Express`,
  description: 'Envíos rápidos y seguros en República Dominicana. Cotiza y envía en minutos.',
}

export default function LlevaPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-[var(--c-lleva)]">📦</span> {BRAND.lleva}
        </h1>
        <p className="text-[var(--c-text-muted)] max-w-2xl">
          Envíos express en toda República Dominicana. Cotiza, paga y rastrea tu paquete en tiempo real.
        </p>
      </div>

      {/* Service options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <Card hover>
          <div className="text-center p-4">
            <span className="text-3xl block mb-2">⚡</span>
            <h3 className="font-semibold">Express</h3>
            <p className="text-sm text-[var(--c-text-muted)] mt-1">Entrega en 2-4 horas</p>
          </div>
        </Card>
        <Card hover>
          <div className="text-center p-4">
            <span className="text-3xl block mb-2">📅</span>
            <h3 className="font-semibold">Programado</h3>
            <p className="text-sm text-[var(--c-text-muted)] mt-1">Elige fecha y hora</p>
          </div>
        </Card>
        <Card hover>
          <div className="text-center p-4">
            <span className="text-3xl block mb-2">🏪</span>
            <h3 className="font-semibold">Mismo Día</h3>
            <p className="text-sm text-[var(--c-text-muted)] mt-1">Antes de las 9PM</p>
          </div>
        </Card>
      </div>

      {/* Quote form placeholder */}
      <Card>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Cotiza tu envío</h2>
          <p className="text-[var(--c-text-muted)] mb-6">
            Selecciona vehículo, tipo de servicio y destino para obtener un precio estimado.
          </p>
          <Link href="/lleva/solicitar">
            <Button variant="lleva" size="lg">Solicitar Envío</Button>
          </Link>
        </div>
      </Card>
    </main>
  )
}
