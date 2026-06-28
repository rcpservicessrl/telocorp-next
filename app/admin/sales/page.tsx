import { createSupabaseServer } from '@/lib/supabase-server'
import { BRAND } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const metadata = { title: `Admin — ${BRAND.sales}` }

export default async function AdminSalesPage() {
  const supabase = await createSupabaseServer()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  // Count pending orders
  const { count: pendingCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{BRAND.sales}</h1>
          <p className="text-sm text-[var(--c-text-muted)]">{products?.length || 0} productos</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/sales/orders"
            className="px-4 py-2 bg-[var(--c-surface-2)] border border-[var(--c-border)] text-sm font-medium rounded-lg hover:bg-[var(--c-surface-3)] transition-colors relative"
          >
            📋 Órdenes
            {(pendingCount || 0) > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--c-danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/sales/new"
            className="px-4 py-2 bg-[var(--c-sales)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            + Nuevo Producto
          </Link>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--c-border)] text-left text-[var(--c-text-muted)]">
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Vendidos</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(products || []).map((p) => (
                <tr key={p.id} className="border-b border-[var(--c-border)] hover:bg-[var(--c-surface-2)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <img
                          src={`https://wsrv.nl/?url=${encodeURIComponent(p.image)}&w=40&h=40&output=webp`}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-[var(--c-surface-2)]"
                        />
                      )}
                      <div>
                        <p className="font-medium line-clamp-1">{p.title}</p>
                        <p className="text-xs text-[var(--c-text-dim)]">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">RD$ {p.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={(p.stock || 0) <= 5 ? 'text-[var(--c-danger)] font-bold' : ''}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.sold || 0}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.active ? 'success' : 'default'}>
                      {p.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/sales/${p.id}/edit`}
                      className="text-[var(--c-info)] hover:underline text-xs"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!products || products.length === 0) && (
          <div className="text-center py-10 text-[var(--c-text-muted)]">
            No hay productos. Crea el primero.
          </div>
        )}
      </div>
    </div>
  )
}
