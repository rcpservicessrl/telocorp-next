'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface WishlistContextType {
  items: string[]
  toggle: (productId: string) => void
  has: (productId: string) => boolean
  count: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)
const WISHLIST_KEY = 'telocorp_wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  }, [items, loaded])

  const toggle = (productId: string) => {
    setItems(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId])
  }

  const has = (productId: string) => items.includes(productId)

  return (
    <WishlistContext.Provider value={{ items, toggle, has, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}
