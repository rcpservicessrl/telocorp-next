'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BRAND } from '@/lib/utils'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error)
        setLoading(false)
      } else {
        router.refresh()
        setTimeout(() => {
          window.location.href = redirect
        }, 500)
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu internet.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <img
          src="/assets/telocorpgroup-mark.png"
          alt={BRAND.group}
          className="h-16 w-16 mx-auto mb-4 rounded-2xl"
        />
        <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        <p className="text-sm text-[var(--c-text-muted)] mt-1">
          Accede a tu cuenta en {BRAND.group}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          autoComplete="email"
        />

        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="text-sm text-[var(--c-danger)] bg-red-500/10 px-3 py-2 rounded-lg" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Entrar
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--c-text-muted)] mt-6">
        ¿No tienes cuenta?{' '}
        <Link href="/auth/register" className="text-[var(--c-info)] hover:underline">
          Crear cuenta
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<div className="w-full max-w-sm h-96 animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
