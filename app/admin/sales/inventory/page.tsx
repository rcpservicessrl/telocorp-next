import { createSupabaseServer } from '@/lib/supabase-server'
import { BRAND } from '@/lib/utils'
import { InventoryManager } from './inventory-manager'

export const metadata = { title: `Inventario XLSX — ${BRAND.sales}` }

export default async function InventoryPage() {
  const supabase = await createSupabaseServer()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('category', { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Inventario — Importar / Exportar</h1>
      <p className="text-sm text-[var(--c-text-muted)] mb-6">
        Descarga el inventario como Excel, modifícalo y vuelve a subirlo para actualizar todo {BRAND.sales} de una vez.
      </p>
      <InventoryManager products={products || []} />
    </div>
  )
}
