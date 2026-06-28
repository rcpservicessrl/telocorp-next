'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CreditCard, Building2, Globe } from 'lucide-react'

export type PaymentMethod = 'cardnet' | 'transfer' | 'paypal'

interface PaymentSelectorProps {
  enabledMethods?: { cardnet: boolean; transfer: boolean; paypal: boolean }
  selected: PaymentMethod | null
  onSelect: (method: PaymentMethod) => void
  amount?: number
}

const METHODS = [
  {
    id: 'cardnet' as const,
    label: 'Tarjeta (CardNET)',
    description: 'Visa, Mastercard, débito',
    icon: CreditCard,
  },
  {
    id: 'transfer' as const,
    label: 'Transferencia',
    description: 'Banreservas, Popular, BHD',
    icon: Building2,
  },
  {
    id: 'paypal' as const,
    label: 'PayPal',
    description: 'Pago internacional',
    icon: Globe,
  },
]

export function PaymentSelector({ enabledMethods, selected, onSelect, amount }: PaymentSelectorProps) {
  const methods = METHODS.filter(m => {
    if (!enabledMethods) return true
    return enabledMethods[m.id]
  })

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Método de pago</label>
      <div className="space-y-2">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={cn(
              'w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left',
              selected === method.id
                ? 'border-[var(--c-info)] bg-blue-500/5'
                : 'border-[var(--c-border)] hover:border-[var(--c-border-hover)] bg-[var(--c-surface)]'
            )}
          >
            <method.icon size={20} className={selected === method.id ? 'text-[var(--c-info)]' : 'text-[var(--c-text-muted)]'} />
            <div className="flex-1">
              <p className="text-sm font-medium">{method.label}</p>
              <p className="text-xs text-[var(--c-text-dim)]">{method.description}</p>
            </div>
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              selected === method.id ? 'border-[var(--c-info)]' : 'border-[var(--c-border)]'
            )}>
              {selected === method.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--c-info)]" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Payment instructions based on method */}
      {selected === 'transfer' && amount && (
        <div className="mt-3 p-4 rounded-xl bg-[var(--c-surface-2)] border border-[var(--c-border)] text-sm space-y-2">
          <p className="font-medium">Instrucciones de transferencia:</p>
          <ul className="space-y-1 text-[var(--c-text-muted)]">
            <li>• Banco: Banreservas</li>
            <li>• Cuenta: 9601234567</li>
            <li>• Tipo: Ahorro</li>
            <li>• Titular: Telo&apos; Corp Group SRL</li>
            <li>• Monto: <span className="font-bold text-[var(--c-text)]">RD$ {amount.toLocaleString()}</span></li>
          </ul>
          <p className="text-xs text-[var(--c-text-dim)]">
            Envía el comprobante por WhatsApp tras realizar la transferencia.
          </p>
        </div>
      )}

      {selected === 'paypal' && amount && (
        <div className="mt-3 p-4 rounded-xl bg-[var(--c-surface-2)] border border-[var(--c-border)] text-sm">
          <p className="text-[var(--c-text-muted)]">
            Serás redirigido a PayPal para completar el pago de{' '}
            <span className="font-bold text-[var(--c-text)]">USD$ {(amount / 60).toFixed(2)}</span>{' '}
            (aprox. RD$ {amount.toLocaleString()})
          </p>
        </div>
      )}
    </div>
  )
}
