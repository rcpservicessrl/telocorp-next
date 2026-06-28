'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { Check } from 'lucide-react'

interface AddToCartButtonProps {
  product: {
    id: string
    title: string
    price: number
    image: string
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button
      variant="sales"
      size="lg"
      className="w-full"
      onClick={handleAdd}
    >
      {added ? (
        <>
          <Check size={18} />
          ¡Añadido!
        </>
      ) : (
        'Añadir al Carrito'
      )}
    </Button>
  )
}
