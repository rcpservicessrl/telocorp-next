'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BRAND } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password, {
      full_name: name,
      phone,
    })

    if (error) {
      setError(error)
      setLoading(false)
    } else {
      router.push('/auth/verify?email=' + encodeURIComponent(email))
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/assets/telocorpgroup-mark.png"
            alt={BRAND.group}
            className="h-16 w-16 mx-auto mb-4 rounded-2xl"
          />
          <h1 className="text-2xl font-bold">Crear Cuenta</h1>
          <p className="text-sm text-[var(--c-text-muted)] mt-1">
            Únete a {BRAND.group}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre completo"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan Pérez"
            required
            autoComplete="name"
          />

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
            label="WhatsApp"
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="809-000-0000"
            hint="Para notificaciones de tus pedidos y servicios"
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            autoComplete="new-password"
          />

          {error && (
            <p className="text-sm text-[var(--c-danger)] bg-red-500/10 px-3 py-2 rounded-lg" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Crear Cuenta
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--c-text-muted)] mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-[var(--c-info)] hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  )
}
