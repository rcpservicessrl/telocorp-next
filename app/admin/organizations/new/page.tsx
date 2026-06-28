'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { createOrganization } from './actions'

const ALL_MODULES = ['sales', 'educa', 'lleva', 'repara', 'instala']

export default function NewOrganizationPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [modules, setModules] = useState<string[]>(['sales'])
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleModule = (mod: string) => {
    setModules(prev => prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug) return

    setLoading(true)
    setError('')

    const result = await createOrganization({ name, slug, modules, plan })
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/admin/organizations')
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Nueva Organización</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <Input
            label="Nombre de la empresa"
            value={name}
            onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')) }}
            required
            placeholder="Mi Empresa SRL"
          />
          <Input
            label="Slug (URL)"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            required
            placeholder="mi-empresa"
            hint="Identificador único, solo letras y guiones"
          />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-sm">Módulos habilitados</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_MODULES.map(mod => (
              <label key={mod} className={`px-4 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                modules.includes(mod) ? 'border-[var(--c-info)] bg-blue-500/5 text-[var(--c-info)]' : 'border-[var(--c-border)]'
              }`}>
                <input type="checkbox" className="sr-only" checked={modules.includes(mod)} onChange={() => toggleModule(mod)} />
                {mod}
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-sm">Plan</h2>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full h-10 px-3 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg text-sm"
          >
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </Card>

        {error && <p className="text-sm text-[var(--c-danger)] bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={loading}>Crear Organización</Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}
