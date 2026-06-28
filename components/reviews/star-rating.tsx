'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
}

const sizes = { sm: 14, md: 18, lg: 24 }

export function StarRating({ value, onChange, size = 'md', readonly = false }: StarRatingProps) {
  const starSize = sizes[size]

  return (
    <div className={cn('flex gap-0.5', !readonly && 'cursor-pointer')} role="group" aria-label={`Calificación: ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            'transition-colors',
            readonly && 'cursor-default'
          )}
          aria-label={`${star} estrellas`}
        >
          <Star
            size={starSize}
            className={star <= value ? 'fill-amber-400 text-amber-400' : 'text-[var(--c-text-dim)]'}
          />
        </button>
      ))}
    </div>
  )
}
