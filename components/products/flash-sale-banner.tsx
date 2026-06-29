'use client'

import { useEffect, useState } from 'react'

interface FlashSaleBannerProps {
  enabled?: boolean
  productCount: number
}

/**
 * Countdown timer for flash sale urgency.
 * Resets at midnight — always shows time remaining today.
 */
export function FlashSaleBanner({ enabled = true, productCount }: FlashSaleBannerProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!enabled || productCount === 0) return

    const update = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(23, 59, 59, 999)
      const diff = midnight.getTime() - now.getTime()

      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [enabled, productCount])

  if (!enabled || productCount === 0 || !timeLeft) return null

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-2 px-4 text-sm">
      <span className="font-bold">⚡ OFERTAS DEL DÍA</span>
      <span className="mx-2">·</span>
      <span>{productCount} productos con descuento</span>
      <span className="mx-2">·</span>
      <span className="font-mono font-bold">{timeLeft}</span>
    </div>
  )
}
