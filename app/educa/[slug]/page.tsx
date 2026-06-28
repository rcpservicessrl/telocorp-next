import { createSupabaseServer } from '@/lib/supabase-server'
import { BRAND } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createSupabaseServer()

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', slug)
    .single()

  if (!course) notFound()

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Course info */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="educa">{course.level}</Badge>
            <span className="text-xs text-[var(--c-text-dim)]">⏱ {course.duration}</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
          <p className="text-[var(--c-text-muted)] mb-6">{course.description}</p>

          {/* Instructor */}
          <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
            <div className="w-10 h-10 rounded-full bg-[var(--c-educa)] flex items-center justify-center text-white font-bold">
              {course.instructor?.[0] || '?'}
            </div>
            <div>
              <p className="text-sm font-medium">{course.instructor}</p>
              <p className="text-xs text-[var(--c-text-dim)]">Instructor</p>
            </div>
          </div>

          {/* Lessons */}
          <h2 className="text-lg font-semibold mb-3">Contenido del curso</h2>
          <div className="space-y-2">
            {(course.lessons || []).map((lesson: string, i: number) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--c-surface)] border border-[var(--c-border)]"
              >
                <span className="w-7 h-7 rounded-full bg-[var(--c-surface-2)] flex items-center justify-center text-xs font-medium">
                  {i + 1}
                </span>
                <span className="text-sm">{lesson}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar CTA */}
        <div>
          <Card className="sticky top-20 p-6 space-y-4">
            <div className="text-center">
              <span className="text-4xl block mb-2">{course.icon || '📘'}</span>
              <p className="text-sm text-[var(--c-text-muted)]">
                ★ {course.rating} · {course.students || 0} estudiantes
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--c-educa)]">Gratis</p>
              <p className="text-xs text-[var(--c-text-dim)]">Acceso completo</p>
            </div>

            <Link href={`/educa/${slug}/learn`}>
              <Button variant="educa" className="w-full">
                Empezar Curso
              </Button>
            </Link>

            <div className="text-xs text-[var(--c-text-dim)] space-y-1">
              <p>✓ {(course.lessons || []).length} lecciones</p>
              <p>✓ Quiz de certificación</p>
              <p>✓ Certificado digital al completar</p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
