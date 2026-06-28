'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { BRAND } from '@/lib/utils'
import { submitRepairRequest } from './actions'

const DEVICE_TYPES = [
  { id: 'phone', icon: '📱', name: 'Celular' },
  { id: 'laptop', icon: '💻', name: 'Laptop' },
  { id: 'tablet', icon: '📟', name: 'Tablet' },
  { id: 'tv', icon: '📺', name: 'TV' },
  { id: 'console', icon: '🎮', name: 'Consola' },
  { id: 'printer', icon: '🖨️', name: 'Impresora' },
  { id: 'ac', icon: '❄️', name: 'A/C / Inversor' },
  { id: 'other', icon: '🔌', name: 'Otro' },
]

const ISSUE_TYPES = [
  'Pantalla rota o dañada',
  'No enciende',
  'Batería no carga',
  'Se calienta mucho',
  'Problema de software',
  'Puerto de carga dañado',
  'Cámara no funciona',
  'Sonido / altavoz',
  'Botones no responden',
  'Otro problema',
]

export default function SolicitarReparaPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [deviceType, setDeviceType] = useState('')
  const [data, setData] = useState({
    brand: '',
    model: '',
    issue_category: '',
    issue_description: '',
    service_mode: 'in_store' as 'in_store' | 'pickup_delivery',
    name: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const result = await submitRepairRequest({
      device_type: deviceType,
      device_brand: data.brand,
      device_model: data.model,
      issue_category: data.issue_category,
      issue_description: data.issue_description,
      service_mode: data.service_mode,
      customer_name: data.name,
      customer_phone: data.phone,
      address: data.service_mode === 'pickup_delivery' ? data.address : '',
      user_id: user?.id || null,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push(`/repara/${result.ticketId}`)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{BRAND.repara}</h1>
      <p className="text-[var(--c-text-muted)] mb-6">Solicita una reparación en 3 pasos.</p>

      {/* Step 1: Device */}
      {step === 1 && (
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">1. ¿Qué dispositivo?</h2>
          <div className="grid grid-cols-4 gap-2">
            {DEVICE_TYPES.map((d) => (
              <button
                key={d.id}
                onClick={() => setDeviceType(d.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  deviceType === d.id
                    ? 'border-[var(--c-repara)] bg-purple-500/5'
                    : 'border-[var(--c-border)] hover:border-[var(--c-border-hover)]'
                }`}
              >
                <span className="text-xl block">{d.icon}</span>
                <span className="text-xs">{d.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Marca" value={data.brand} onChange={(e) => setData({ ...data, brand: e.target.value })} placeholder="Samsung, Apple, LG..." />
            <Input label="Modelo" value={data.model} onChange={(e) => setData({ ...data, model: e.target.value })} placeholder="Galaxy S24, iPhone 15..." />
          </div>

          <Button variant="repara" onClick={() => setStep(2)} disabled={!deviceType}>
            Siguiente →
          </Button>
        </Card>
      )}

      {/* Step 2: Problem */}
      {step === 2 && (
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">2. ¿Cuál es el problema?</h2>
          <div className="grid grid-cols-2 gap-2">
            {ISSUE_TYPES.map((issue) => (
              <button
                key={issue}
                onClick={() => setData({ ...data, issue_category: issue })}
                className={`p-3 rounded-lg border text-left text-sm transition-all ${
                  data.issue_category === issue
                    ? 'border-[var(--c-repara)] bg-purple-500/5'
                    : 'border-[var(--c-border)] hover:border-[var(--c-border-hover)]'
                }`}
              >
                {issue}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Describe el problema (opcional)</label>
            <textarea
              value={data.issue_description}
              onChange={(e) => setData({ ...data, issue_description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm resize-none placeholder:text-[var(--c-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]"
              placeholder="Detalla qué sucedió, cuándo empezó..."
            />
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(1)}>← Atrás</Button>
            <Button variant="repara" onClick={() => setStep(3)} disabled={!data.issue_category}>
              Siguiente →
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Contact */}
      {step === 3 && (
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">3. Datos de contacto</h2>

          <div className="space-y-3">
            <div className="flex gap-3">
              <label className={`flex-1 p-3 rounded-lg border text-center cursor-pointer transition-all ${data.service_mode === 'in_store' ? 'border-[var(--c-repara)] bg-purple-500/5' : 'border-[var(--c-border)]'}`}>
                <input type="radio" name="mode" className="sr-only" checked={data.service_mode === 'in_store'} onChange={() => setData({ ...data, service_mode: 'in_store' })} />
                <p className="text-sm font-medium">🏪 Llevar al taller</p>
              </label>
              <label className={`flex-1 p-3 rounded-lg border text-center cursor-pointer transition-all ${data.service_mode === 'pickup_delivery' ? 'border-[var(--c-repara)] bg-purple-500/5' : 'border-[var(--c-border)]'}`}>
                <input type="radio" name="mode" className="sr-only" checked={data.service_mode === 'pickup_delivery'} onChange={() => setData({ ...data, service_mode: 'pickup_delivery' })} />
                <p className="text-sm font-medium">🚗 Recogida a domicilio</p>
              </label>
            </div>

            <Input label="Nombre" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required placeholder="Tu nombre" />
            <Input label="WhatsApp" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} required placeholder="809-000-0000" />
            {data.service_mode === 'pickup_delivery' && (
              <Input label="Dirección de recogida" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} placeholder="Calle, sector, referencia" />
            )}
          </div>

          {error && <p className="text-sm text-[var(--c-danger)] bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(2)}>← Atrás</Button>
            <Button variant="repara" onClick={handleSubmit} loading={loading} disabled={!data.name || !data.phone}>
              Enviar Solicitud
            </Button>
          </div>
        </Card>
      )}
    </main>
  )
}
