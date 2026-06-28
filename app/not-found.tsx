import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BRAND } from '@/lib/utils'

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold mb-2">Página no encontrada</h1>
        <p className="text-[var(--c-text-muted)] mb-6">
          La página que buscas no existe en {BRAND.group}.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button>Ir al Inicio</Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary">Ver Tienda</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
