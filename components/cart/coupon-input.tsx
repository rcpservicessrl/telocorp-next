'use client'

import { useState } from 'react'
import { Tag, X } from 'lucide-react'

interface CouponInputProps {
  subtotal: number
  onApply: (discount: number, code: string) => void
  onRemove: () => void
  appliedCode?: string
}

export function CouponInput({ subtotal, onApply, onRemove, appliedCode }: CouponInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      })
      const data = await res.json()

      if (data.valid) {
        onApply(data.discount_amount, data.code)
        setCode('')
      } else {
        setError(data.error || 'Cupón no válido')
      }
    } catch {
      setError('Error al validar cupón')
    }

    setLoading(false)
  }

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-[var(--c-success)]" />
          <span className="text-sm text-[var(--c-success)] font-medium">{appliedCode}</span>
        </div>
        <button onClick={onRemove} className="text-[var(--c-text-dim)] hover:text-[var(--c-danger)]">
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError('') }}
          placeholder="Código de cupón"
          className="flex-1 h-9 px-3 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg text-sm uppercase placeholder:normal-case placeholder:text-[var(--c-text-dim)] focus:outline-none focus:ring-1 focus:ring-[var(--c-info)]"
        />
        <button
          onClick={handleApply}
          disabled={!code.trim() || loading}
          className="px-3 h-9 text-sm font-medium text-[var(--c-info)] hover:bg-[var(--c-surface-2)] rounded-lg disabled:opacity-50 transition-colors"
        >
          {loading ? '...' : 'Aplicar'}
        </button>
      </div>
      {error && <p className="text-xs text-[var(--c-danger)]">{error}</p>}
    </div>
  )
}
