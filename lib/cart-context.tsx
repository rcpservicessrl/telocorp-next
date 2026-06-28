'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string) => Promise<{ valid: boolean; discount: number; error?: string }>
  removeCoupon: () => void
  coupon: { code: string; discount: number } | null
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = 'telocorp_cart'
const COUPON_KEY = 'telocorp_coupon'

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) setItems(JSON.parse(stored))
      const storedCoupon = localStorage.getItem(COUPON_KEY)
      if (storedCoupon) setCoupon(JSON.parse(storedCoupon))
    } catch {}
    setLoaded(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    }
  }, [items, loaded])

  useEffect(() => {
    if (loaded) {
      if (coupon) {
        localStorage.setItem(COUPON_KEY, JSON.stringify(coupon))
      } else {
        localStorage.removeItem(COUPON_KEY)
      }
    }
  }, [coupon, loaded])

  // Sync wishlist/cart to DB when user logs in
  useEffect(() => {
    if (user && supabase && items.length > 0) {
      // Future: sync cart to server for abandoned cart recovery
    }
  }, [user, items])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))
  }

  const clearCart = () => {
    setItems([])
    setCoupon(null)
  }

  const applyCoupon = async (code: string): Promise<{ valid: boolean; discount: number; error?: string }> => {
    if (!supabase) return { valid: false, discount: 0, error: 'Servicio no disponible' }

    // Fetch coupons from site_settings
    const { data: settings } = await supabase
      .from('site_settings')
      .select('coupons')
      .single()

    if (!settings?.coupons) {
      return { valid: false, discount: 0, error: 'Cupón inválido' }
    }

    const coupons = settings.coupons as Record<string, number>
    const upperCode = code.toUpperCase()
    const discount = coupons[upperCode]

    if (discount === undefined) {
      return { valid: false, discount: 0, error: 'Cupón no encontrado' }
    }

    setCoupon({ code: upperCode, discount })
    return { valid: true, discount }
  }

  const removeCoupon = () => setCoupon(null)

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, applyCoupon, removeCoupon, coupon, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
