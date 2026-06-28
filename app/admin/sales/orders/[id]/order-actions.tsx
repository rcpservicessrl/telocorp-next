'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { updateOrderStatus } from './actions'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled']

interface OrderActionsProps {
  orderId: string
  currentStatus: string
  notes: string
}

export function OrderActions({ orderId, currentStatus, notes: initialNotes }: OrderActionsProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(initialNotes)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const result = await updateOrderStatus(orderId, status, notes)
    setMessage(result.error || '✅ Orden actualizada')
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-sm">Gestionar Orden</h3>

      <div>
        <label className="block text-sm font-medium mb-1.5">Estado</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full h-10 px-3 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Notas internas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]"
          placeholder="Notas para el equipo..."
        />
      </div>

      {message && (
        <p className={`text-sm ${message.startsWith('✅') ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]'}`}>
          {message}
        </p>
      )}

      <Button onClick={handleSave} loading={saving}>
        Guardar Cambios
      </Button>
    </div>
  )
}
