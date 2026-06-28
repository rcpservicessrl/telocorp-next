import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: `${BRAND.repara} — Reparación de Dispositivos`,
  description: 'Servicio técnico profesional. Reparamos tu celular, laptop, TV y más con garantía.',
}

const DEVICE_TYPES = [
  { icon: '📱', name: 'Celulares', desc: 'iPhone, Samsung, Xiaomi...' },
  { icon: '💻', name: 'Laptops', desc: 'Dell, HP, Mac, Lenovo...' },
  { icon: '📺', name: 'Televisores', desc: 'Smart TV, LED, OLED...' },
  { icon: '🎮', name: 'Consolas', desc: 'PS5, Xbox, Nintendo...' },
  { icon: '🖨️', name: 'Impresoras', desc: 'Láser, Inkjet, 3D...' },
  { icon: '❄️', name: 'Inversores/AC', desc: 'Split, portátil, industrial...' },
]

export default function ReparaPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-[var(--c-repara)]">🔧</span> {BRAND.repara}
        </h1>
        <p className="text-[var(--c-text-muted)] max-w-2xl">
          Centro de servicio técnico profesional. Diagnosticamos, cotizamos y reparamos
          tus dispositivos con garantía de 90 días.
        </p>
      </div>

      {/* Device types */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">¿Qué dispositivo necesitas reparar?</h2>
        <Link href="/repara/solicitar">
          <Button variant="repara" size="sm">Solicitar Reparación</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {DEVICE_TYPES.map((d) => (
          <Card key={d.name} hover className="cursor-pointer">
            <div className="text-center p-2">
              <span className="text-2xl block mb-1">{d.icon}</span>
              <h3 className="font-medium text-sm">{d.name}</h3>
              <p className="text-xs text-[var(--c-text-dim)]">{d.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Process */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Describe', desc: 'Cuéntanos qué le pasa a tu dispositivo' },
              { step: '2', title: 'Cotización', desc: 'Recibe un presupuesto sin compromiso' },
              { step: '3', title: 'Reparamos', desc: 'Nuestros técnicos trabajan en tu equipo' },
              { step: '4', title: 'Listo', desc: 'Te avisamos cuando esté listo para recoger' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-8 h-8 rounded-full bg-[var(--c-repara)] text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  {s.step}
                </div>
                <h3 className="font-medium text-sm">{s.title}</h3>
                <p className="text-xs text-[var(--c-text-dim)] mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </main>
  )
}
