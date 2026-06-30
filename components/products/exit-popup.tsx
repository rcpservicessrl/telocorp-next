'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const EXIT_POPUP_KEY = 'telo_exit_popup_shown'

interface ExitPopupProps {
  couponCode?: string
  discount?: number
}

/**
 * Exit-intent popup — shows when mouse leaves viewport.
 * Only shown once per session.
 */
export function ExitPopup({ couponCode = 'PRIMERA10', discount = 10 }: ExitPopupProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Don't show if already shown this session
    if (sessionStorage.getItem(EXIT_POPUP_KEY)) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem(EXIT_POPUP_KEY)) {
        setShow(true)
        sessionStorage.setItem(EXIT_POPUP_KEY, '1')
      }
    }

    // Only trigger after 5 seconds on page
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 5000)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[var(--c-surface)] border border-[var(--c-border)] rounded-2xl p-8 text-center shadow-2xl">
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-[var(--c-surface-2)]"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <p className="text-4xl mb-3">🎁</p>
        <h2 className="text-xl font-bold mb-2">¡Espera!</h2>
        <p className="text-[var(--c-text-muted)] mb-4">
          Llévate un <span className="text-[var(--c-sales)] font-bold">{discount}% de descuento</span> en tu primera compra
        </p>

        <div className="bg-[var(--c-surface-2)] border border-dashed border-[var(--c-sales)] rounded-xl p-4 mb-4">
          <p className="text-xs text-[var(--c-text-dim)] mb-1">Usa este código en el checkout:</p>
          <p className="text-2xl font-mono font-bold text-[var(--c-sales)]">{couponCode}</p>
        </div>

        <Link href="/products" onClick={() => setShow(false)}>
          <Button variant="sales" className="w-full">
            Ver Productos con Descuento
          </Button>
        </Link>

        <button onClick={() => setShow(false)} className="mt-3 text-xs text-[var(--c-text-dim)] hover:underline">
          No gracias, seguir navegando
        </button>
      </div>
    </div>
  )
}
