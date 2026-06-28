'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { inviteUser } from './actions'

const ROLES = ['admin', 'manager', 'operator', 'viewer'] as const
const MODULES = ['sales', 'educa', 'lleva', 'repara', 'instala'] as const

export function InviteUserForm() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>('operator')
  const [modules, setModules] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const toggleModule = (mod: string) => {
    setModules(prev => prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod])
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setMessage('')
    const result = await inviteUser(email, role, modules)
    setMessage(result.error || '✅ Invitación enviada')
    if (!result.error) {
      setEmail('')
      setModules([])
    }
    setLoading(false)
  }

  if (!open) {
    return (
      <div className="mb-6">
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          + Invitar Usuario
        </Button>
      </div>
    )
  }

  return (
    <Card className="p-5 mb-6 space-y-4">
      <h3 className="font-semibold text-sm">Invitar nuevo miembro</h3>
      <form onSubmit={handleInvite} className="space-y-3">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="usuario@email.com"
        />

        <div>
          <label className="block text-sm font-medium mb-1.5">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-10 px-3 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg text-sm"
          >
            {ROLES.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Módulos</label>
          <div className="flex flex-wrap gap-2">
            {MODULES.map(mod => (
              <label key={mod} className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                modules.includes(mod) ? 'border-[var(--c-info)] bg-blue-500/5 text-[var(--c-info)]' : 'border-[var(--c-border)]'
              }`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={modules.includes(mod)}
                  onChange={() => toggleModule(mod)}
                />
                {mod}
              </label>
            ))}
          </div>
          <p className="text-xs text-[var(--c-text-dim)] mt-1">Sin selección = acceso a todos los módulos de la org</p>
        </div>

        {message && (
          <p className={`text-sm ${message.startsWith('✅') ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]'}`}>
            {message}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" size="sm" loading={loading}>Enviar Invitación</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
        </div>
      </form>
    </Card>
  )
}
