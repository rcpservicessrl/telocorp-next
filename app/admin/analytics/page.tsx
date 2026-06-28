import { createSupabaseServer } from '@/lib/supabase-server'
import { Card } from '@/components/ui/card'
import { BRAND } from '@/lib/utils'

export const metadata = { title: 'Admin — Analíticas' }

export default async function AdminAnalyticsPage() {
  const supabase = await createSupabaseServer()

  // Fetch aggregated data
  const [ordersRes, reparaRes, instalaRes, llevaRes, productsRes] = await Promise.all([
    supabase.from('orders').select('id, total, status, created_at'),
    supabase.from('repara_bookings').select('id, status, created_at'),
    supabase.from('instala_bookings').select('id, status, estimated_cost, created_at'),
    supabase.from('lleva_requests').select('id, status, estimated_fare, created_at'),
    supabase.from('products').select('id, price, stock, sold, cost'),
  ])

  const orders = ordersRes.data || []
  const repairs = reparaRes.data || []
  const installs = instalaRes.data || []
  const deliveries = llevaRes.data || []
  const products = productsRes.data || []

  // Calculate KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const inventoryValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0)
  const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0)
  const profit = orders.reduce((sum, o) => sum + (o.total || 0), 0) - products.reduce((sum, p) => sum + (p.cost || 0) * (p.sold || 0), 0)

  const activeRepairs = repairs.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length
  const activeInstalls = installs.filter(i => i.status !== 'completed' && i.status !== 'cancelled').length
  const activeDeliveries = deliveries.filter(d => d.status !== 'delivered' && d.status !== 'cancelled').length

  const instalaRevenue = installs.filter(i => i.status === 'completed').reduce((sum, i) => sum + (i.estimated_cost || 0), 0)
  const llevaRevenue = deliveries.filter(d => d.status === 'delivered').reduce((sum, d) => sum + (d.estimated_fare || 0), 0)

  // Recent 7 days orders
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const recentOrders = orders.filter(o => o.created_at > sevenDaysAgo)
  const recentRevenue = recentOrders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analíticas — {BRAND.group}</h1>

      {/* Revenue Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-xs text-[var(--c-text-dim)]">Revenue Total</p>
          <p className="text-2xl font-bold text-[var(--c-sales)]">RD$ {totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">{orders.length} órdenes</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--c-text-dim)]">Últimos 7 días</p>
          <p className="text-2xl font-bold text-[var(--c-success)]">RD$ {recentRevenue.toLocaleString()}</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">{recentOrders.length} órdenes</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--c-text-dim)]">Ganancia Est.</p>
          <p className="text-2xl font-bold text-[var(--c-info)]">RD$ {Math.max(profit, 0).toLocaleString()}</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">Revenue - Costo</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--c-text-dim)]">Inventario</p>
          <p className="text-2xl font-bold">RD$ {inventoryValue.toLocaleString()}</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">{totalSold} unidades vendidas</p>
        </Card>
      </div>

      {/* Per-vertical stats */}
      <h2 className="font-semibold mb-4">Por Vertical</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-l-4 border-l-[var(--c-sales)]">
          <p className="text-sm font-medium">{BRAND.sales}</p>
          <div className="mt-2 space-y-1 text-xs text-[var(--c-text-muted)]">
            <p>Completadas: <span className="font-medium text-[var(--c-text)]">{completedOrders}</span></p>
            <p>Pendientes: <span className="font-medium text-[var(--c-warning)]">{pendingOrders}</span></p>
            <p>Total: <span className="font-medium text-[var(--c-text)]">RD$ {totalRevenue.toLocaleString()}</span></p>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-[var(--c-repara)]">
          <p className="text-sm font-medium">{BRAND.repara}</p>
          <div className="mt-2 space-y-1 text-xs text-[var(--c-text-muted)]">
            <p>Total: <span className="font-medium text-[var(--c-text)]">{repairs.length}</span></p>
            <p>Activas: <span className="font-medium text-[var(--c-warning)]">{activeRepairs}</span></p>
            <p>Completadas: <span className="font-medium text-[var(--c-success)]">{repairs.length - activeRepairs}</span></p>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-[var(--c-instala)]">
          <p className="text-sm font-medium">{BRAND.instala}</p>
          <div className="mt-2 space-y-1 text-xs text-[var(--c-text-muted)]">
            <p>Total: <span className="font-medium text-[var(--c-text)]">{installs.length}</span></p>
            <p>Activas: <span className="font-medium text-[var(--c-warning)]">{activeInstalls}</span></p>
            <p>Revenue: <span className="font-medium text-[var(--c-text)]">RD$ {instalaRevenue.toLocaleString()}</span></p>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-[var(--c-lleva)]">
          <p className="text-sm font-medium">{BRAND.lleva}</p>
          <div className="mt-2 space-y-1 text-xs text-[var(--c-text-muted)]">
            <p>Total: <span className="font-medium text-[var(--c-text)]">{deliveries.length}</span></p>
            <p>En tránsito: <span className="font-medium text-[var(--c-warning)]">{activeDeliveries}</span></p>
            <p>Revenue: <span className="font-medium text-[var(--c-text)]">RD$ {llevaRevenue.toLocaleString()}</span></p>
          </div>
        </Card>
      </div>

      {/* Quick health indicators */}
      <h2 className="font-semibold mb-4">Indicadores</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-3 text-center">
          <p className="text-xl font-bold">{products.length}</p>
          <p className="text-xs text-[var(--c-text-dim)]">Productos</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-[var(--c-danger)]">{products.filter(p => (p.stock || 0) <= 5).length}</p>
          <p className="text-xs text-[var(--c-text-dim)]">Stock bajo</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold">{repairs.length + installs.length + deliveries.length}</p>
          <p className="text-xs text-[var(--c-text-dim)]">Servicios total</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-[var(--c-warning)]">{activeRepairs + activeInstalls + activeDeliveries}</p>
          <p className="text-xs text-[var(--c-text-dim)]">Activos ahora</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-[var(--c-success)]">{completedOrders + repairs.filter(r => r.status === 'completed').length + installs.filter(i => i.status === 'completed').length}</p>
          <p className="text-xs text-[var(--c-text-dim)]">Completados</p>
        </Card>
      </div>
    </div>
  )
}
