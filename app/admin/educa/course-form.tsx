'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, X, GripVertical } from 'lucide-react'
import { saveCourse, deleteCourse } from './actions'

interface CourseFormProps {
  course?: {
    id: string
    title: string
    description: string
    icon: string
    duration: string
    level: string
    instructor: string
    lessons: string[]
    lesson_videos?: string[]
    quiz: { q: string; options: string[]; correct: number }[]
    active: boolean
    sort_order: number
  }
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const isEditing = !!course

  const [data, setData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    icon: course?.icon || '📘',
    duration: course?.duration || '2 horas',
    level: course?.level || 'Principiante',
    instructor: course?.instructor || '',
    active: course?.active ?? true,
    sort_order: course?.sort_order || 0,
  })

  const [lessons, setLessons] = useState<string[]>(course?.lessons || [''])
  const [lessonVideos, setLessonVideos] = useState<string[]>(course?.lesson_videos || [''])
  const [quiz, setQuiz] = useState<{ q: string; options: string[]; correct: number }[]>(
    course?.quiz || [{ q: '', options: ['', '', '', ''], correct: 0 }]
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Lessons
  const addLesson = () => { setLessons([...lessons, '']); setLessonVideos([...lessonVideos, '']) }
  const removeLesson = (i: number) => { setLessons(lessons.filter((_, idx) => idx !== i)); setLessonVideos(lessonVideos.filter((_, idx) => idx !== i)) }
  const updateLesson = (i: number, value: string) => { const l = [...lessons]; l[i] = value; setLessons(l) }
  const updateLessonVideo = (i: number, value: string) => { const v = [...lessonVideos]; v[i] = value; setLessonVideos(v) }

  // Quiz
  const addQuestion = () => setQuiz([...quiz, { q: '', options: ['', '', '', ''], correct: 0 }])
  const removeQuestion = (i: number) => setQuiz(quiz.filter((_, idx) => idx !== i))
  const updateQuestion = (i: number, field: string, value: unknown) => {
    const q = [...quiz]
    if (field === 'q') q[i].q = value as string
    else if (field === 'correct') q[i].correct = value as number
    else if (field.startsWith('opt')) {
      const optIdx = parseInt(field.replace('opt', ''))
      q[i].options[optIdx] = value as string
    }
    setQuiz(q)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.title) { setError('Título requerido'); return }
    if (lessons.filter(l => l.trim()).length === 0) { setError('Agrega al menos una lección'); return }

    setSaving(true)
    setError('')

    const result = await saveCourse(course?.id || null, {
      ...data,
      lessons: lessons.filter(l => l.trim()),
      lesson_videos: lessonVideos.filter((_, i) => lessons[i]?.trim()),
      quiz: quiz.filter(q => q.q.trim() && q.options.some(o => o.trim())),
    })

    if (result.error) { setError(result.error); setSaving(false) }
    else { router.push('/admin/educa'); router.refresh() }
  }

  const handleDelete = async () => {
    if (!course?.id || !confirm('¿Eliminar este curso?')) return
    await deleteCourse(course.id)
    router.push('/admin/educa'); router.refresh()
  }

  const update = (field: string, value: unknown) => setData({ ...data, [field]: value })

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic info */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Información del curso</h2>
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-1">
            <Input label="Icono" value={data.icon} onChange={(e) => update('icon', e.target.value)} placeholder="📘" />
          </div>
          <div className="col-span-5">
            <Input label="Título" value={data.title} onChange={(e) => update('title', e.target.value)} required placeholder="Reparación de Celulares" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Descripción</label>
          <textarea value={data.description} onChange={(e) => update('description', e.target.value)} rows={2} className="w-full px-3 py-2 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]" placeholder="Aprende a diagnosticar y reparar..." />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input label="Instructor" value={data.instructor} onChange={(e) => update('instructor', e.target.value)} placeholder="Juan Pérez" />
          <Input label="Duración" value={data.duration} onChange={(e) => update('duration', e.target.value)} placeholder="2 horas" />
          <div>
            <label className="block text-sm font-medium mb-1.5">Nivel</label>
            <select value={data.level} onChange={(e) => update('level', e.target.value)} className="w-full h-10 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm">
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
          </div>
          <Input label="Orden" type="number" value={data.sort_order} onChange={(e) => update('sort_order', Number(e.target.value))} />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={data.active} onChange={(e) => update('active', e.target.checked)} />
          Curso activo (visible para estudiantes)
        </label>
      </Card>

      {/* Lessons */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Lecciones</h2>
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="w-6 h-9 flex items-center justify-center text-xs text-[var(--c-text-dim)]">{i + 1}</span>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={lesson}
                  onChange={(e) => updateLesson(i, e.target.value)}
                  placeholder="Título de la lección"
                  className="w-full h-9 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--c-info)]"
                />
                <input
                  type="text"
                  value={lessonVideos[i] || ''}
                  onChange={(e) => updateLessonVideo(i, e.target.value)}
                  placeholder="URL YouTube (opcional)"
                  className="w-full h-8 px-3 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[var(--c-info)]"
                />
              </div>
              <button type="button" onClick={() => removeLesson(i)} className="w-9 h-9 flex items-center justify-center text-[var(--c-text-dim)] hover:text-[var(--c-danger)]">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addLesson} className="flex items-center gap-1 text-xs text-[var(--c-info)] hover:underline">
          <Plus size={12} /> Agregar lección
        </button>
      </Card>

      {/* Quiz */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Quiz de certificación</h2>
        <p className="text-xs text-[var(--c-text-dim)]">El estudiante necesita 70% para obtener el certificado.</p>

        <div className="space-y-4">
          {quiz.map((q, qi) => (
            <div key={qi} className="p-4 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-border)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--c-text-dim)]">Pregunta {qi + 1}</span>
                <button type="button" onClick={() => removeQuestion(qi)} className="text-xs text-[var(--c-danger)] hover:underline">Eliminar</button>
              </div>
              <input
                type="text"
                value={q.q}
                onChange={(e) => updateQuestion(qi, 'q', e.target.value)}
                placeholder="¿Cuál es...?"
                className="w-full h-9 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--c-info)]"
              />
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.correct === oi}
                      onChange={() => updateQuestion(qi, 'correct', oi)}
                      className="accent-[var(--c-success)]"
                      title="Marcar como correcta"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateQuestion(qi, `opt${oi}`, e.target.value)}
                      placeholder={`Opción ${oi + 1}`}
                      className="flex-1 h-8 px-2 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[var(--c-info)]"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[var(--c-text-dim)]">● = respuesta correcta</p>
            </div>
          ))}
        </div>
        <button type="button" onClick={addQuestion} className="flex items-center gap-1 text-xs text-[var(--c-info)] hover:underline">
          <Plus size={12} /> Agregar pregunta
        </button>
      </Card>

      {error && <p className="text-sm text-[var(--c-danger)] bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="educa" loading={saving}>{isEditing ? 'Guardar Cambios' : 'Crear Curso'}</Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
        {isEditing && <Button type="button" variant="danger" onClick={handleDelete} className="ml-auto">Eliminar</Button>}
      </div>
    </form>
  )
}
