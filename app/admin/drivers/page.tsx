import { createSupabaseServer } from '@/lib/supabase-server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DriverForm } from './driver-form'

export const metadata = { title: 'Admin — Conductores' }

const VEH_ICONS: Record<string, string> = { motorcycle: '🏍️', car: '🚗', van: '🚐' }
const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'default'> = { available: 'success', busy: 'warning', offline: 'default' }

export default async function AdminDriversPage() {
  const supabase = await createSupabaseServer()
  const { data: drivers } = await supabase.from('drivers').select('*').order('rating', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Conductores</h1>
      <p className="text-sm text-[var(--c-text-muted)] mb-6">{drivers?.length || 0} conductores</p>

      <DriverForm />

      <div className="space-y-3 mt-6">
        {(drivers || []).map((d) => (
          <Card key={d.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{VEH_ICONS[d.vehicle] || '🚗'}</span>
              <div>
                <p className="font-medium text-sm">{d.name}</p>
                <p className="text-xs text-[var(--c-text-muted)]">
                  {d.phone || '—'} · {d.vehicle} · ★ {d.rating || 5} · {d.jobs_completed || 0} envíos · {d.zone || 'SD'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {d.phone && (
                <a href={`https://wa.me/${(d.phone || '').replace(/\D/g, '')}`} target="_blank" className="text-xs text-[var(--c-success)]">💬</a>
              )}
              <Badge variant={STATUS_VARIANT[d.status] || 'default'}>{d.status || 'offline'}</Badge>
            </div>
          </Card>
        ))}

        {(!drivers || drivers.length === 0) && (
          <p className="text-center py-8 text-[var(--c-text-muted)]">Sin conductores. Agrega el primero.</p>
        )}
      </div>
    </div>
  )
}
