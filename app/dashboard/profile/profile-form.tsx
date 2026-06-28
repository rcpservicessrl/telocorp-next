'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { updateProfile } from './actions'

interface ProfileFormProps {
  userId: string
  email: string
  initialData: {
    full_name: string
    phone: string
    address: string
    city: string
    avatar_url: string
  }
}

export function ProfileForm({ userId, email, initialData }: ProfileFormProps) {
  const [data, setData] = useState(initialData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const result = await updateProfile(userId, data)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' })
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar section */}
      <Card className="flex items-center gap-4 p-4">
        <div className="w-16 h-16 rounded-full bg-[var(--c-surface-2)] flex items-center justify-center text-2xl">
          {data.avatar_url ? (
            <img src={data.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span>{data.full_name?.[0]?.toUpperCase() || '?'}</span>
          )}
        </div>
        <div>
          <p className="font-medium">{data.full_name || 'Sin nombre'}</p>
          <p className="text-sm text-[var(--c-text-muted)]">{email}</p>
        </div>
      </Card>

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre completo"
          name="full_name"
          value={data.full_name}
          onChange={(e) => setData({ ...data, full_name: e.target.value })}
          placeholder="Juan Pérez"
        />

        <Input
          label="WhatsApp"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          placeholder="809-000-0000"
        />

        <Input
          label="Dirección"
          name="address"
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          placeholder="Calle, número, sector"
        />

        <Input
          label="Ciudad"
          name="city"
          value={data.city}
          onChange={(e) => setData({ ...data, city: e.target.value })}
          placeholder="Santo Domingo"
        />
      </div>

      {/* Email (readonly) */}
      <Input
        label="Correo electrónico"
        value={email}
        disabled
        hint="El email no se puede cambiar desde aquí"
      />

      {/* Message */}
      {message && (
        <p className={`text-sm px-3 py-2 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-500/10 text-green-400'
            : 'bg-red-500/10 text-red-400'
        }`}>
          {message.text}
        </p>
      )}

      {/* Submit */}
      <Button type="submit" loading={saving}>
        Guardar Cambios
      </Button>
    </form>
  )
}
