import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { CourseForm } from '../course-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: course } = await supabase.from('courses').select('*').eq('id', id).single()
  if (!course) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Curso</h1>
      <CourseForm course={course} />
    </div>
  )
}
