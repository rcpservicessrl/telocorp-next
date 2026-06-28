import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: `${BRAND.instala} — Servicios de Instalación`,
  description: 'Instalación profesional de TV, aires acondicionados, cámaras, paneles solares y más.',
}

const SERVICES = [
  { icon: '📺', name: 'TV / Sonido', desc: 'Montaje en pared, home theater, soundbar' },
  { icon: '❄️', name: 'Aire Acondicionado', desc: 'Split, multi-split, mantenimiento' },
  { icon: '📷', name: 'Cámaras CCTV', desc: 'Seguridad, DVR, acceso remoto' },
  { icon: '☀️', name: 'Paneles Solares', desc: 'Residencial y comercial' },
  { icon: '🌐', name: 'Redes / WiFi', desc: 'Cableado, routers, mesh, fibra' },
  { icon: '🔌', name: 'Eléctrico', desc: 'Breakers, tomacorrientes, iluminación' },
]

export default function InstalaPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-[var(--c-instala)]">🛠️</span> {BRAND.instala}
        </h1>
        <p className="text-[var(--c-text-muted)] max-w-2xl">
          Técnicos certificados instalan lo que necesites en tu hogar o negocio.
          Agenda, cotiza y paga — todo en línea.
        </p>
      </div>

      {/* Services grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Servicios disponibles</h2>
        <Link href="/instala/solicitar">
          <Button variant="instala" size="sm">Agendar Servicio</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {SERVICES.map((s) => (
          <Card key={s.name} hover className="cursor-pointer">
            <div className="text-center p-2">
              <span className="text-2xl block mb-1">{s.icon}</span>
              <h3 className="font-medium text-sm">{s.name}</h3>
              <p className="text-xs text-[var(--c-text-dim)]">{s.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Why us */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">¿Por qué {BRAND.instala}?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl mb-2">✅</p>
              <h3 className="font-medium text-sm">Técnicos Certificados</h3>
              <p className="text-xs text-[var(--c-text-dim)] mt-1">
                Verificados y con experiencia comprobable
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-2">🛡️</p>
              <h3 className="font-medium text-sm">Garantía Incluida</h3>
              <p className="text-xs text-[var(--c-text-dim)] mt-1">
                90 días de garantía en mano de obra
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-2">💳</p>
              <h3 className="font-medium text-sm">Pago Seguro</h3>
              <p className="text-xs text-[var(--c-text-dim)] mt-1">
                Paga cuando el trabajo esté completado
              </p>
            </div>
          </div>
        </div>
      </Card>
    </main>
  )
}
