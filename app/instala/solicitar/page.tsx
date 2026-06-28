'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { BRAND } from '@/lib/utils'
import { submitInstalaBooking } from './actions'

const SERVICES = [
  { id: 'tv_mount', name: 'Montaje de TV', price: 2500 },
  { id: 'ac_install', name: 'Instalación A/C Split', price: 8500 },
  { id: 'ac_maintenance', name: 'Mantenimiento A/C', price: 3500 },
  { id: 'cctv', name: 'Cámaras de Seguridad', price: 12000 },
  { id: 'solar', name: 'Panel Solar', price: 25000 },
  { id: 'network', name: 'Red WiFi / Cableado', price: 4500 },
  { id: 'electrical', name: 'Trabajo Eléctrico', price: 3000 },
  { id: 'home_theater', name: 'Home Theater', price: 6000 },
]

const TIME_SLOTS = [
  { id: 'morning', label: '🌅 Mañana (8am - 12pm)' },
  { id: 'afternoon', label: '☀️ Tarde (12pm - 5pm)' },
  { id: 'evening', label: '🌙 Noche (5pm - 8pm)' },
]

export default function SolicitarInstalaPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [selectedService, setSelectedService] = useState('')
  const [data, setData] = useState({
    description: '',
    preferred_date: '',
    preferred_time: '',
    name: '',
    phone: '',
    address: '',
    access_instructions: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const service = SERVICES.find(s => s.id === selectedService)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !data.name || !data.phone || !data.address) return

    setLoading(true)
    setError('')

    const result = await submitInstalaBooking({
      service_id: selectedService,
      service_name: service?.name || '',
      description: data.description,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      customer_name: data.name,
      customer_phone: data.phone,
      address: data.address,
      access_instructions: data.access_instructions,
      estimated_cost: service?.price || 0,
      user_id: user?.id || null,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push(`/instala/${result.bookingId}`)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{BRAND.instala}</h1>
      <p className="text-[var(--c-text-muted)] mb-6">Agenda tu servicio de instalación.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service selection */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">¿Qué servicio necesitas?</h2>
          <div className="grid grid-cols-2 gap-2">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedService(s.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedService === s.id
                    ? 'border-[var(--c-instala)] bg-emerald-500/5'
                    : 'border-[var(--c-border)] hover:border-[var(--c-border-hover)]'
                }`}
              >
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-[var(--c-instala)]">Desde RD$ {s.price.toLocaleString()}</p>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Detalles del trabajo (opcional)</label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm resize-none placeholder:text-[var(--c-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]"
              placeholder="Ej: TV 65 pulgadas en pared de concreto, segundo piso..."
            />
          </div>
        </Card>

        {/* Schedule */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">¿Cuándo te viene bien?</h2>
          <Input
            label="Fecha preferida"
            type="date"
            value={data.preferred_date}
            onChange={(e) => setData({ ...data, preferred_date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
          <div>
            <label className="block text-sm font-medium mb-1.5">Horario</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setData({ ...data, preferred_time: slot.id })}
                  className={`p-2 rounded-lg border text-center text-xs transition-all ${
                    data.preferred_time === slot.id
                      ? 'border-[var(--c-instala)] bg-emerald-500/5'
                      : 'border-[var(--c-border)] hover:border-[var(--c-border-hover)]'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Contact & Address */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Datos de contacto</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required placeholder="Tu nombre" />
            <Input label="WhatsApp" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} required placeholder="809-000-0000" />
          </div>
          <Input label="Dirección" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} required placeholder="Calle, número, sector" />
          <Input label="Instrucciones de acceso" value={data.access_instructions} onChange={(e) => setData({ ...data, access_instructions: e.target.value })} placeholder="Ej: Timbre 3B, portón azul" />
        </Card>

        {/* Summary & Submit */}
        {service && (
          <Card className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-xs text-[var(--c-text-dim)]">Precio estimado (puede variar)</p>
              </div>
              <p className="text-xl font-bold text-[var(--c-instala)]">RD$ {service.price.toLocaleString()}</p>
            </div>
          </Card>
        )}

        {error && <p className="text-sm text-[var(--c-danger)] bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}

        <Button
          type="submit"
          variant="instala"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={!selectedService || !data.name || !data.phone || !data.address}
        >
          Agendar Servicio
        </Button>
      </form>
    </main>
  )
}
