import { createSupabaseServer } from '@/lib/supabase-server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TechnicianForm } from './technician-form'

export const metadata = { title: 'Admin — Técnicos' }

export default async function AdminTechniciansPage() {
  const supabase = await createSupabaseServer()
  const { data: technicians } = await supabase.from('technicians').select('*').order('name')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Técnicos</h1>
      <p className="text-sm text-[var(--c-text-muted)] mb-6">{technicians?.length || 0} técnicos registrados</p>

      <TechnicianForm />

      <div className="space-y-3 mt-6">
        {(technicians || []).map((t) => (
          <Card key={t.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{t.avatar || '👨‍🔧'}</span>
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-[var(--c-text-muted)]">{t.specialization || 'General'} · ★ {t.rating || 5} · {t.jobs_completed || 0} trabajos</p>
              </div>
            </div>
            <Badge variant={t.active !== false ? 'success' : 'default'}>
              {t.active !== false ? 'Activo' : 'Inactivo'}
            </Badge>
          </Card>
        ))}

        {(!technicians || technicians.length === 0) && (
          <p className="text-center py-8 text-[var(--c-text-muted)]">Sin técnicos. Agrega el primero arriba.</p>
        )}
      </div>
    </div>
  )
}
