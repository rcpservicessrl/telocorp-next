'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

interface ProductFiltersProps {
  categories: string[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [showFilters, setShowFilters] = useState(false)

  const currentCategory = searchParams.get('category') || ''
  const currentSort = searchParams.get('sort') || 'newest'

  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }, [router, searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams('q', search)
  }

  return (
    <div className="space-y-3 mb-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-text-dim)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full h-10 pl-9 pr-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm placeholder:text-[var(--c-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="h-10 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-surface-2)] transition-colors"
          aria-label="Filtros"
        >
          <SlidersHorizontal size={16} />
        </button>
      </form>

      {/* Filters row */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-[var(--c-surface)] border border-[var(--c-border)]">
          {/* Category */}
          <select
            value={currentCategory}
            onChange={(e) => updateParams('category', e.target.value)}
            className="h-8 px-2 text-xs bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-md"
          >
            <option value="">Todas las categorías</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={currentSort}
            onChange={(e) => updateParams('sort', e.target.value)}
            className="h-8 px-2 text-xs bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-md"
          >
            <option value="newest">Más nuevos</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="popular">Más vendidos</option>
            <option value="rating">Mejor valorados</option>
          </select>

          {/* Clear */}
          {(currentCategory || searchParams.get('q')) && (
            <button
              onClick={() => router.push('/products')}
              className="h-8 px-2 text-xs text-[var(--c-danger)] hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Active category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => updateParams('category', '')}
          className={`shrink-0 px-3 py-1 text-xs rounded-full border transition-colors ${
            !currentCategory ? 'bg-[var(--c-sales)] text-white border-[var(--c-sales)]' : 'border-[var(--c-border)] hover:border-[var(--c-border-hover)]'
          }`}
        >
          Todos
        </button>
        {categories.slice(0, 6).map(c => (
          <button
            key={c}
            onClick={() => updateParams('category', c)}
            className={`shrink-0 px-3 py-1 text-xs rounded-full border transition-colors ${
              currentCategory === c ? 'bg-[var(--c-sales)] text-white border-[var(--c-sales)]' : 'border-[var(--c-border)] hover:border-[var(--c-border-hover)]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
