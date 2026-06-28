'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBookingStatus } from '@/app/admin/actions'

interface StatusChangerProps {
  table: 'repara_bookings' | 'instala_bookings' | 'lleva_requests' | 'orders'
  id: string
  currentStatus: string
  statuses: string[]
}

export function StatusChanger({ table, id, currentStatus, statuses }: StatusChangerProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  const handleChange = async (newStatus: string) => {
    setStatus(newStatus)
    setSaving(true)
    await updateBookingStatus(table, id, newStatus)
    setSaving(false)
    router.refresh()
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className="h-7 px-2 text-xs bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--c-info)] disabled:opacity-50"
      onClick={(e) => e.stopPropagation()}
    >
      {statuses.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}
