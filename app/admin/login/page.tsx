'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BRAND } from '@/lib/utils'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      // Verify this user is actually an admin
      const user = data.user
      const isAdmin = user?.email?.endsWith('@telocg.com') ||
        user?.user_metadata?.role === 'admin' ||
        user?.user_metadata?.role === 'owner'

      if (!isAdmin) {
        // Sign them out immediately — they shouldn't be here
        await supabase.auth.signOut()
        setError('Acceso denegado. Esta entrada es solo para administradores.')
        setLoading(false)
        return
      }

      // Admin confirmed — redirect to admin panel
      window.location.href = '/admin'
    } catch {
      setError('Error de conexión.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--c-bg)]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--c-surface-2)] flex items-center justify-center">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-xl font-bold">{BRAND.group}</h1>
          <p className="text-xs text-[var(--c-text-dim)] mt-1">Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo administrativo"
            required
            autoComplete="email"
          />

          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-sm text-[var(--c-danger)] bg-red-500/10 px-3 py-2 rounded-lg" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Acceder
          </Button>
        </form>
      </div>
    </main>
  )
}
