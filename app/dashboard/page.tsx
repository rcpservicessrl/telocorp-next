import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { BRAND, VERTICALS } from '@/lib/utils'
import { SmartSuggestions } from '@/components/ai/smart-suggestions'
import Link from 'next/link'

export const metadata = { title: 'Mi Panel' }

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Hola, {displayName} 👋</h1>
        <p className="text-[var(--c-text-muted)]">
          Tu panel unificado en {BRAND.group}
        </p>
      </div>

      {/* Quick actions */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {Object.entries(VERTICALS).map(([key, v]) => (
          <Link
            key={key}
            href={v.href}
            className="flex flex-col items-center p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] transition-colors text-center"
          >
            <span className="text-2xl mb-2">{v.icon}</span>
            <span className="text-xs font-medium">{v.name}</span>
          </Link>
        ))}
      </section>

      {/* Activity summary */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Actividad Reciente</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/dashboard/orders" className="p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] transition-colors">
            <p className="text-sm font-medium">📦 Mis Pedidos</p>
            <p className="text-xs text-[var(--c-text-dim)] mt-1">Historial de compras</p>
          </Link>
          <Link href="/dashboard/notifications" className="p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] transition-colors">
            <p className="text-sm font-medium">🔔 Notificaciones</p>
            <p className="text-xs text-[var(--c-text-dim)] mt-1">Actualizaciones de tus servicios</p>
          </Link>
          <Link href="/dashboard/profile" className="p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] transition-colors">
            <p className="text-sm font-medium">👤 Mi Perfil</p>
            <p className="text-xs text-[var(--c-text-dim)] mt-1">Editar datos personales</p>
          </Link>
          <Link href="/products" className="p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] transition-colors">
            <p className="text-sm font-medium">🛒 Ir a la tienda</p>
            <p className="text-xs text-[var(--c-text-dim)] mt-1">Explorar productos</p>
          </Link>
        </div>
      </section>

      {/* AI Suggestions */}
      <section className="mt-8">
        <SmartSuggestions />
      </section>

      {/* Account info */}
      <section className="mt-10 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Tu Cuenta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[var(--c-text-dim)]">Email:</span>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <span className="text-[var(--c-text-dim)]">WhatsApp:</span>
            <p className="font-medium">{user.user_metadata?.phone || 'No registrado'}</p>
          </div>
          <div>
            <span className="text-[var(--c-text-dim)]">Miembro desde:</span>
            <p className="font-medium">
              {new Date(user.created_at).toLocaleDateString('es-DO', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
