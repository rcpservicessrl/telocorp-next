import { createSupabaseServer } from '@/lib/supabase-server'
import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export const metadata = {
  title: `${BRAND.educa} — Academia Online`,
  description: 'Cursos de tecnología, instalación y reparación. Aprende con expertos certificados.',
}

export default async function EducaPage() {
  const supabase = await createSupabaseServer()
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-[var(--c-educa)]">🎓</span> {BRAND.educa}
        </h1>
        <p className="text-[var(--c-text-muted)] max-w-2xl">
          Cursos prácticos de tecnología, instalación y reparación.
          Aprende con expertos certificados y obtén tu diploma digital.
        </p>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(courses || []).map((course) => (
          <Link key={course.id} href={`/educa/${course.id}`}>
            <Card hover className="h-full">
              <div className="text-3xl mb-3">{course.icon || '📘'}</div>
              <h3 className="font-semibold mb-1">{course.title}</h3>
              <p className="text-sm text-[var(--c-text-muted)] line-clamp-2 mb-3">
                {course.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-[var(--c-text-dim)]">
                <span>⏱ {course.duration}</span>
                <span>📊 {course.level}</span>
                <span>★ {course.rating}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {(!courses || courses.length === 0) && (
        <div className="text-center py-20 text-[var(--c-text-muted)]">
          <p className="text-4xl mb-4">📚</p>
          <p>Próximamente: cursos nuevos en preparación.</p>
        </div>
      )}
    </main>
  )
}
