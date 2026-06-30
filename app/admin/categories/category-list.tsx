'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { updateMargin, deleteCategory } from './actions'

interface Category {
  id: string
  name: string
  margin: number
}

export function CategoryList({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const router = useRouter()

  const handleMarginChange = async (id: string, newMargin: number) => {
    await updateMargin(id, newMargin)
    router.refresh()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar categoría "${name}"?`)) return
    await deleteCategory(id)
    router.refresh()
  }

  if (categories.length === 0) {
    return <p className="text-center py-8 text-[var(--c-text-muted)]">Sin categorías.</p>
  }

  return (
    <div className="space-y-2">
      {categories.map((c) => (
        <Card key={c.id} className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="font-medium text-sm w-32">{c.name}</p>
            <div className="flex items-center gap-1">
              <label className="text-xs text-[var(--c-text-dim)]">Margen:</label>
              <input
                type="number"
                defaultValue={c.margin || 50}
                min={0} max={500}
                onBlur={(e) => handleMarginChange(c.id, Number(e.target.value))}
                className="w-16 h-7 px-2 text-xs bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--c-info)]"
              />
              <span className="text-xs text-[var(--c-text-dim)]">%</span>
            </div>
            <span className="text-xs text-[var(--c-text-muted)]">{counts[c.name] || 0} productos</span>
          </div>
          <button onClick={() => handleDelete(c.id, c.name)} className="text-xs text-[var(--c-danger)] hover:underline">
            Eliminar
          </button>
        </Card>
      ))}
    </div>
  )
}
