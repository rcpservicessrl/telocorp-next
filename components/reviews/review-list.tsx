import { StarRating } from './star-rating'

export interface Review {
  id: string
  user_name: string
  rating: number
  text: string
  verified: boolean
  created_at: string
}

interface ReviewListProps {
  reviews: Review[]
  emptyMessage?: string
}

export function ReviewList({ reviews, emptyMessage = 'Sin reseñas todavía' }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-[var(--c-text-muted)] py-4 text-center">{emptyMessage}</p>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--c-surface-2)] flex items-center justify-center text-xs font-bold">
                {review.user_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-sm font-medium">{review.user_name}</p>
                {review.verified && (
                  <span className="text-xs text-[var(--c-success)]">✓ Compra verificada</span>
                )}
              </div>
            </div>
            <time className="text-xs text-[var(--c-text-dim)]">
              {new Date(review.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}
            </time>
          </div>
          <StarRating value={review.rating} readonly size="sm" />
          {review.text && <p className="text-sm text-[var(--c-text-muted)] mt-2">{review.text}</p>}
        </div>
      ))}
    </div>
  )
}
