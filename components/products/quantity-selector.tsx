'use client'

import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  value: number
  onChange: (qty: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-1 border border-[var(--c-border)] rounded-lg overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 flex items-center justify-center hover:bg-[var(--c-surface-2)] disabled:opacity-30 transition-colors"
        aria-label="Reducir cantidad"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-medium">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 flex items-center justify-center hover:bg-[var(--c-surface-2)] disabled:opacity-30 transition-colors"
        aria-label="Aumentar cantidad"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
