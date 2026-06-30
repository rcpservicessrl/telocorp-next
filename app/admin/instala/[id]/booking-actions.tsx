'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { updateBooking } from './actions'

const STATUSES = ['pending', 'confirmed', 'technician_assigned', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled', 'rescheduled']

interface BookingActionsProps {
  bookingId: string
  currentStatus: string
  currentTechnician: string
  technicians: { id: string; name: string; specialization?: string }[]
}

export function BookingActions({ bookingId, currentStatus, currentTechnician, technicians }: BookingActionsProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [technicianId, setTechnicianId] = useState(currentTechnician)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const result = await updateBooking(bookingId, status, technicianId)
    setMessage(result.error || '✅ Booking actualizado')
    setSaving(false)
    router.refresh()
  }

  return (
    <Card className="p-5 space-y-4">
      <h3 className="font-semibold text-sm">Gestionar Booking</h3>

      <div>
        <label className="block text-sm font-medium mb-1.5">Estado</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-10 px-3 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]">
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Técnico asignado</label>
        <select value={technicianId} onChange={(e) => setTechnicianId(e.target.value)} className="w-full h-10 px-3 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]">
          <option value="">Sin asignar</option>
          {technicians.map(t => <option key={t.id} value={t.id}>{t.name}{t.specialization ? ` (${t.specialization})` : ''}</option>)}
        </select>
      </div>

      {message && <p className={`text-sm ${message.startsWith('✅') ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]'}`}>{message}</p>}
      <Button onClick={handleSave} loading={saving}>Guardar Cambios</Button>
    </Card>
  )
}
