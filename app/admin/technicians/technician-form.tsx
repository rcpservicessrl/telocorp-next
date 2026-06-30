'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { saveTechnician } from './actions'

export function TechnicianForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({ name: '', specialization: '', avatar: '👨‍🔧', rating: 5, phone: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.name) return
    setSaving(true)
    const result = await saveTechnician(data)
    setMessage(result.error || '✅ Técnico agregado')
    if (!result.error) { setData({ name: '', specialization: '', avatar: '👨‍🔧', rating: 5, phone: '' }); router.refresh() }
    setSaving(false)
  }

  if (!open) return (
    <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>+ Agregar Técnico</Button>
  )

  return (
    <Card className="p-5 space-y-3">
      <h3 className="font-semibold text-sm">Nuevo Técnico</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input label="Nombre" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required placeholder="Juan Pérez" />
        <Input label="Especialidad" value={data.specialization} onChange={(e) => setData({ ...data, specialization: e.target.value })} placeholder="Celulares, TV..." />
        <Input label="Teléfono" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="809-000-0000" />
        <Input label="Avatar" value={data.avatar} onChange={(e) => setData({ ...data, avatar: e.target.value })} placeholder="👨‍🔧" />
        <div className="col-span-2 sm:col-span-4 flex gap-2 items-center">
          <Button type="submit" size="sm" loading={saving}>Guardar</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
          {message && <span className={`text-xs ${message.startsWith('✅') ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]'}`}>{message}</span>}
        </div>
      </form>
    </Card>
  )
}
