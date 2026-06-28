import { createSupabaseServer } from '@/lib/supabase-server'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { BRAND } from '@/lib/utils'

export const metadata = { title: 'Admin — Dashboard' }

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServer()

  // Fetch counts for overview
  const [products, orders, courses, drivers] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('drivers').select('id', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Productos', value: products.count || 0, icon: '🛒', color: 'var(--c-sales)' },
    { label: 'Órdenes', value: orders.count || 0, icon: '📋', color: 'var(--c-info)' },
    { label: 'Cursos', value: courses.count || 0, icon: '🎓', color: 'var(--c-educa)' },
    { label: 'Conductores', value: drivers.count || 0, icon: '🚗', color: 'var(--c-lleva)' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard — {BRAND.group}</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[var(--c-text-muted)]">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Acciones Rápidas</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/admin/sales" className="p-3 text-center rounded-lg bg-[var(--c-surface-2)] hover:bg-[var(--c-surface-3)] transition-colors text-sm">
              ➕ Nuevo Producto
            </a>
            <a href="/admin/educa" className="p-3 text-center rounded-lg bg-[var(--c-surface-2)] hover:bg-[var(--c-surface-3)] transition-colors text-sm">
              📚 Nuevo Curso
            </a>
            <a href="/admin/users" className="p-3 text-center rounded-lg bg-[var(--c-surface-2)] hover:bg-[var(--c-surface-3)] transition-colors text-sm">
              👤 Gestionar Usuarios
            </a>
            <a href="/admin/settings" className="p-3 text-center rounded-lg bg-[var(--c-surface-2)] hover:bg-[var(--c-surface-3)] transition-colors text-sm">
              ⚙️ Configuración
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
