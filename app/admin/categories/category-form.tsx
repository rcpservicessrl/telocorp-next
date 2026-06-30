'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { addCategory } from './actions'

export function CategoryForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [margin, setMargin] = useState(50)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const result = await addCategory(name.trim(), margin)
    setMessage(result.error || '✅ Categoría agregada')
    if (!result.error) { setName(''); setMargin(50); router.refresh() }
    setSaving(false)
  }

  if (!open) return <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>+ Nueva Categoría</Button>

  return (
    <Card className="p-5 space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Celulares" />
        </div>
        <div className="w-24">
          <Input label="Margen %" type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value))} min={0} max={500} />
        </div>
        <Button type="submit" size="sm" loading={saving}>Agregar</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>×</Button>
      </form>
      {message && <p className={`text-xs ${message.startsWith('✅') ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]'}`}>{message}</p>}
    </Card>
  )
}
