import { createSupabaseServer } from '@/lib/supabase-server'
import { BRAND } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export const metadata = { title: `Admin — ${BRAND.educa}` }

export default async function AdminEducaPage() {
  const supabase = await createSupabaseServer()
  const { data: courses } = await supabase.from('courses').select('*').order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{BRAND.educa}</h1>
          <p className="text-sm text-[var(--c-text-muted)]">{courses?.length || 0} cursos</p>
        </div>
        <Link href="/admin/educa/new" className="px-4 py-2 bg-[var(--c-educa)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
          + Nuevo Curso
        </Link>
      </div>

      <div className="space-y-3">
        {(courses || []).map((c) => (
          <Link key={c.id} href={`/admin/educa/${c.id}`}>
            <Card hover className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon || '📘'}</span>
                  <div>
                    <p className="font-medium text-sm">{c.title}</p>
                    <p className="text-xs text-[var(--c-text-muted)]">{c.instructor} · {c.level} · {c.duration} · {(c.lessons || []).length} lecciones</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--c-text-dim)]">★ {c.rating} · {c.students || 0} est.</span>
                  <Badge variant={c.active ? 'success' : 'default'}>
                    {c.active ? 'Activo' : 'Borrador'}
                  </Badge>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {(!courses || courses.length === 0) && (
          <p className="text-center py-10 text-[var(--c-text-muted)]">Sin cursos. Crea el primero.</p>
        )}
      </div>
    </div>
  )
}
