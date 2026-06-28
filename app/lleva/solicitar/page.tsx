'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { BRAND } from '@/lib/utils'
import { submitDeliveryRequest } from './actions'

const VEHICLE_TYPES = [
  { id: 'motorcycle', icon: '🏍️', name: 'Moto', desc: 'Paquetes pequeños', baseFare: 150, perKm: 25 },
  { id: 'car', icon: '🚗', name: 'Auto', desc: 'Paquetes medianos', baseFare: 300, perKm: 40 },
  { id: 'van', icon: '🚐', name: 'Van', desc: 'Cargas grandes', baseFare: 600, perKm: 60 },
]

const SERVICE_TYPES = [
  { id: 'express', label: '⚡ Express (2-4h)', multiplier: 1.5 },
  { id: 'standard', label: '📦 Estándar (mismo día)', multiplier: 1.0 },
  { id: 'scheduled', label: '📅 Programado', multiplier: 0.9 },
]

export default function SolicitarLlevaPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [vehicle, setVehicle] = useState('motorcycle')
  const [serviceType, setServiceType] = useState('standard')
  const [data, setData] = useState({
    pickup_address: '',
    dropoff_address: '',
    package_description: '',
    customer_name: '',
    customer_phone: '',
    pickup_contact: '',
    dropoff_contact: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const vehicleInfo = VEHICLE_TYPES.find(v => v.id === vehicle)!
  const serviceInfo = SERVICE_TYPES.find(s => s.id === serviceType)!
  // Estimate price (simplified without real distance)
  const estimatedDistance = 8 // km estimate for SD
  const estimatedPrice = Math.round((vehicleInfo.baseFare + vehicleInfo.perKm * estimatedDistance) * serviceInfo.multiplier)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.pickup_address || !data.dropoff_address || !data.customer_name || !data.customer_phone) return

    setLoading(true)
    setError('')

    const result = await submitDeliveryRequest({
      pickup_address: data.pickup_address,
      dropoff_address: data.dropoff_address,
      package_description: data.package_description,
      vehicle_type: vehicle,
      service_type: serviceType,
      estimated_fare: estimatedPrice,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      pickup_contact: data.pickup_contact || data.customer_phone,
      dropoff_contact: data.dropoff_contact || data.customer_phone,
      user_id: user?.id || null,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push(`/lleva/${result.requestId}`)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{BRAND.lleva}</h1>
      <p className="text-[var(--c-text-muted)] mb-6">Solicita un envío express.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Addresses */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Direcciones</h2>
          <Input
            label="📍 Dirección de recogida"
            value={data.pickup_address}
            onChange={(e) => setData({ ...data, pickup_address: e.target.value })}
            required
            placeholder="Calle, sector, ciudad"
          />
          <Input
            label="📍 Dirección de entrega"
            value={data.dropoff_address}
            onChange={(e) => setData({ ...data, dropoff_address: e.target.value })}
            required
            placeholder="Calle, sector, ciudad"
          />
          <Input
            label="Descripción del paquete"
            value={data.package_description}
            onChange={(e) => setData({ ...data, package_description: e.target.value })}
            placeholder="Ej: Caja mediana, frágil..."
          />
        </Card>

        {/* Vehicle */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Vehículo</h2>
          <div className="grid grid-cols-3 gap-2">
            {VEHICLE_TYPES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVehicle(v.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  vehicle === v.id
                    ? 'border-[var(--c-lleva)] bg-amber-500/5'
                    : 'border-[var(--c-border)] hover:border-[var(--c-border-hover)]'
                }`}
              >
                <span className="text-2xl block">{v.icon}</span>
                <p className="text-xs font-medium mt-1">{v.name}</p>
                <p className="text-xs text-[var(--c-text-dim)]">{v.desc}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Service type */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Tipo de servicio</h2>
          <div className="space-y-2">
            {SERVICE_TYPES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setServiceType(s.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  serviceType === s.id
                    ? 'border-[var(--c-lleva)] bg-amber-500/5'
                    : 'border-[var(--c-border)] hover:border-[var(--c-border-hover)]'
                }`}
              >
                <span className="text-sm">{s.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Contact */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Contacto</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre" value={data.customer_name} onChange={(e) => setData({ ...data, customer_name: e.target.value })} required placeholder="Tu nombre" />
            <Input label="WhatsApp" value={data.customer_phone} onChange={(e) => setData({ ...data, customer_phone: e.target.value })} required placeholder="809-000-0000" />
          </div>
        </Card>

        {/* Price estimate */}
        <Card className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Precio estimado</p>
              <p className="text-xs text-[var(--c-text-dim)]">Puede variar según distancia real</p>
            </div>
            <p className="text-2xl font-bold text-[var(--c-lleva)]">RD$ {estimatedPrice.toLocaleString()}</p>
          </div>
        </Card>

        {error && <p className="text-sm text-[var(--c-danger)] bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}

        <Button type="submit" variant="lleva" size="lg" className="w-full" loading={loading}>
          Solicitar Envío
        </Button>
      </form>
    </main>
  )
}
