'use client'

import { useState } from 'react'
import { StarRating } from './star-rating'
import { Button } from '@/components/ui/button'

interface ReviewFormProps {
  onSubmit: (rating: number, text: string) => Promise<{ error: string | null }>
}

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Selecciona una calificación')
      return
    }

    setLoading(true)
    setError('')

    const result = await onSubmit(rating, text)
    if (result.error) {
      setError(result.error)
    } else {
      setSubmitted(true)
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="p-4 rounded-xl bg-green-500/10 text-green-400 text-sm text-center">
        ¡Gracias por tu reseña! ⭐
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
      <p className="text-sm font-medium">¿Cómo fue tu experiencia?</p>
      <StarRating value={rating} onChange={setRating} size="lg" />

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Cuéntanos más (opcional)"
        rows={3}
        className="w-full px-3 py-2 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg text-sm resize-none placeholder:text-[var(--c-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]"
      />

      {error && <p className="text-xs text-[var(--c-danger)]">{error}</p>}

      <Button type="submit" size="sm" loading={loading}>
        Enviar Reseña
      </Button>
    </form>
  )
}
