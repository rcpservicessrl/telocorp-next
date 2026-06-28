import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { LocalBusinessJsonLd } from '@/components/seo/json-ld'

export const metadata = {
  title: 'Contacto',
  description: `Contacta a ${BRAND.group}. WhatsApp, email y ubicación en Santo Domingo, RD.`,
}

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <LocalBusinessJsonLd />
      <h1 className="text-3xl font-bold mb-2">Contacto</h1>
      <p className="text-[var(--c-text-muted)] mb-8">
        Estamos para ayudarte. Elige el canal que prefieras.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card hover className="p-5">
          <a href="https://wa.me/18096860050" target="_blank" rel="noopener noreferrer" className="block text-center">
            <span className="text-3xl block mb-2">📱</span>
            <h3 className="font-semibold">WhatsApp</h3>
            <p className="text-sm text-[var(--c-text-muted)] mt-1">Respuesta inmediata</p>
            <p className="text-xs text-[var(--c-info)] mt-2">+1 809-686-0050</p>
          </a>
        </Card>

        <Card hover className="p-5">
          <a href="mailto:info@telocg.com" className="block text-center">
            <span className="text-3xl block mb-2">✉️</span>
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-[var(--c-text-muted)] mt-1">Para consultas detalladas</p>
            <p className="text-xs text-[var(--c-info)] mt-2">info@telocg.com</p>
          </a>
        </Card>

        <Card hover className="p-5">
          <div className="text-center">
            <span className="text-3xl block mb-2">📍</span>
            <h3 className="font-semibold">Ubicación</h3>
            <p className="text-sm text-[var(--c-text-muted)] mt-1">Santo Domingo, RD</p>
            <p className="text-xs text-[var(--c-text-dim)] mt-2">Lun-Sáb 9AM-6PM</p>
          </div>
        </Card>

        <Card hover className="p-5">
          <div className="text-center">
            <span className="text-3xl block mb-2">🤖</span>
            <h3 className="font-semibold">Asistente IA</h3>
            <p className="text-sm text-[var(--c-text-muted)] mt-1">Disponible 24/7</p>
            <p className="text-xs text-[var(--c-text-dim)] mt-2">En la tienda online</p>
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-bold mb-4">Preguntas Frecuentes</h2>
      <div className="space-y-3">
        {[
          { q: '¿Cuánto tarda el envío?', a: 'En Santo Domingo 24-48 horas. Interior del país 2-4 días.' },
          { q: '¿Qué métodos de pago aceptan?', a: 'CardNET (Visa/MC), transferencia bancaria y PayPal.' },
          { q: '¿Tienen garantía?', a: 'Sí, 7 días para devoluciones y 90 días en reparaciones.' },
          { q: '¿Cómo sigo mi pedido?', a: 'Desde tu panel en /dashboard o por WhatsApp con tu número de orden.' },
          { q: '¿Hacen instalaciones fuera de Santo Domingo?', a: 'Por ahora cubrimos Gran Santo Domingo. Estamos expandiendo cobertura.' },
        ].map((faq, i) => (
          <Card key={i} className="p-4">
            <p className="font-medium text-sm">{faq.q}</p>
            <p className="text-sm text-[var(--c-text-muted)] mt-1">{faq.a}</p>
          </Card>
        ))}
      </div>
    </main>
  )
}
