import { BRAND } from '@/lib/utils'

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-2xl font-bold mb-2">Verifica tu correo</h1>
        <p className="text-[var(--c-text-muted)]">
          Te enviamos un enlace de confirmación. Revisa tu bandeja de entrada
          (y spam) para activar tu cuenta en {BRAND.group}.
        </p>
      </div>
    </main>
  )
}
