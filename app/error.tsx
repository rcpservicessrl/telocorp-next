'use client'

import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4">⚠️</p>
        <h2 className="text-xl font-bold mb-2">Algo salió mal</h2>
        <p className="text-sm text-[var(--c-text-muted)] mb-6">
          {error.message || 'Ocurrió un error inesperado. Intenta de nuevo.'}
        </p>
        <Button onClick={reset}>Reintentar</Button>
      </div>
    </div>
  )
}
