'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { saveDriver } from './actions'

export function DriverForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({ name: '', phone: '', vehicle: 'motorcycle', zone: 'Santo Domingo' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.name) return
    setSaving(true)
    const result = await saveDriver(data)
    setMessage(result.error || '✅ Conductor agregado')
    if (!result.error) { setData({ name: '', phone: '', vehicle: 'motorcycle', zone: 'Santo Domingo' }); router.refresh() }
    setSaving(false)
  }

  if (!open) return (
    <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>+ Agregar Conductor</Button>
  )

  return (
    <Card className="p-5 space-y-3">
      <h3 className="font-semibold text-sm">Nuevo Conductor</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input label="Nombre" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required placeholder="Carlos Ramírez" />
        <Input label="Teléfono" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="809-000-0000" />
        <div>
          <label className="block text-sm font-medium mb-1.5">Vehículo</label>
          <select value={data.vehicle} onChange={(e) => setData({ ...data, vehicle: e.target.value })} className="w-full h-10 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm">
            <option value="motorcycle">🏍️ Moto</option>
            <option value="car">🚗 Auto</option>
            <option value="van">🚐 Van</option>
          </select>
        </div>
        <Input label="Zona" value={data.zone} onChange={(e) => setData({ ...data, zone: e.target.value })} placeholder="Santo Domingo" />
        <div className="col-span-2 sm:col-span-4 flex gap-2 items-center">
          <Button type="submit" size="sm" loading={saving}>Guardar</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
          {message && <span className={`text-xs ${message.startsWith('✅') ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]'}`}>{message}</span>}
        </div>
      </form>
    </Card>
  )
}
