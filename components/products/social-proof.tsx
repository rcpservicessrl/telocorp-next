'use client'

import { useEffect, useState } from 'react'

const NAMES = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Carmen', 'Pedro', 'Rosa', 'Miguel', 'Elena']
const CITIES = ['Santo Domingo', 'Santiago', 'La Vega', 'San Cristóbal', 'Puerto Plata']

interface SocialProofProps {
  products: { title: string; image: string }[]
  enabled?: boolean
}

/**
 * "Juan de Santo Domingo compró..." social proof popup.
 * Shows every 15-25 seconds with random product.
 */
export function SocialProof({ products, enabled = true }: SocialProofProps) {
  const [notification, setNotification] = useState<{ name: string; city: string; product: string; image: string; minutes: number } | null>(null)

  useEffect(() => {
    if (!enabled || products.length === 0) return

    const show = () => {
      const p = products[Math.floor(Math.random() * products.length)]
      const name = NAMES[Math.floor(Math.random() * NAMES.length)]
      const city = CITIES[Math.floor(Math.random() * CITIES.length)]
      const minutes = Math.floor(Math.random() * 30) + 1

      setNotification({ name, city, product: p.title.slice(0, 30), image: p.image, minutes })
      setTimeout(() => setNotification(null), 5000)
    }

    // First one after 8s
    const initial = setTimeout(show, 8000)
    // Then every 15-25s
    const interval = setInterval(show, 15000 + Math.random() * 10000)

    return () => { clearTimeout(initial); clearInterval(interval) }
  }, [products, enabled])

  if (!notification) return null

  return (
    <div className="fixed bottom-20 left-4 z-40 animate-in slide-in-from-left-full duration-300 max-w-xs">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-lg">
        {notification.image && (
          <img
            src={`https://wsrv.nl/?url=${encodeURIComponent(notification.image)}&w=48&h=48&output=webp`}
            alt=""
            className="w-10 h-10 rounded-lg object-cover bg-[var(--c-surface-2)]"
          />
        )}
        <div className="text-xs">
          <p>
            <strong>{notification.name}</strong> de {notification.city} compró
          </p>
          <p className="text-[var(--c-text-muted)]">{notification.product}...</p>
          <p className="text-[var(--c-text-dim)]">Hace {notification.minutes} min</p>
        </div>
      </div>
    </div>
  )
}
