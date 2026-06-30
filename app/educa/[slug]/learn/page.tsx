'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BRAND } from '@/lib/utils'
import { CheckCircle, Circle, Trophy, Play } from 'lucide-react'

interface CourseData {
  id: string
  title: string
  lessons: string[]
  lesson_videos?: string[] // YouTube URLs per lesson
  quiz: { q: string; options: string[]; correct: number }[]
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export default function LearnPage() {
  const params = useParams()
  const slug = params.slug as string
  const { user } = useAuth()

  const [course, setCourse] = useState<CourseData | null>(null)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [passed, setPassed] = useState(false)
  const [progressLoaded, setProgressLoaded] = useState(false)

  // Load course
  useEffect(() => {
    if (!supabase) return
    supabase.from('courses').select('*').eq('id', slug).single().then(({ data }) => {
      if (data) setCourse(data as unknown as CourseData)
    })
  }, [slug])

  // Load progress from Supabase (if authenticated)
  useEffect(() => {
    if (!supabase || !user || !course) return
    supabase.from('educa_progress')
      .select('progress, completed_lessons, quiz_score, completed')
      .eq('user_id', user.id)
      .eq('course_id', slug)
      .single()
      .then(({ data }) => {
        if (data) {
          if (data.completed_lessons) {
            setCompletedLessons(data.completed_lessons)
          }
          if (data.completed && data.quiz_score >= 70) {
            setQuizSubmitted(true)
            setPassed(true)
          }
        }
        setProgressLoaded(true)
      })
  }, [user, course, slug])

  // Save progress to Supabase
  const saveProgress = async (lessons: number[]) => {
    if (!supabase || !user || !course) return
    const progress = Math.round((lessons.length / course.lessons.length) * 100)
    await supabase.from('educa_progress').upsert({
      user_id: user.id,
      course_id: slug,
      progress,
      completed_lessons: lessons,
      completed: false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,course_id' })
  }

  const completeLesson = () => {
    let newCompleted = completedLessons
    if (!completedLessons.includes(currentLesson)) {
      newCompleted = [...completedLessons, currentLesson]
      setCompletedLessons(newCompleted)
      saveProgress(newCompleted)
    }
    if (course && currentLesson < course.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
    }
  }

  const allLessonsComplete = course ? completedLessons.length >= course.lessons.length : false

  const submitQuiz = async () => {
    if (!course) return
    const score = course.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correct ? 1 : 0), 0)
    const percentage = (score / course.quiz.length) * 100
    setPassed(percentage >= 70)
    setQuizSubmitted(true)

    // Save to DB
    if (user && supabase) {
      await supabase.from('educa_progress').upsert({
        user_id: user.id,
        course_id: slug,
        progress: 100,
        completed_lessons: completedLessons,
        quiz_score: percentage,
        completed: percentage >= 70,
        completed_at: percentage >= 70 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' })

      // Generate certificate if passed
      if (percentage >= 70) {
        await supabase.from('certificates').insert({
          user_id: user.id,
          course_id: slug,
          course_title: course.title,
          student_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Estudiante',
          score: percentage,
          quiz_score: percentage,
          issued_at: new Date().toISOString(),
        }).then(() => {})
      }
    }
  }

  if (!course) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--c-surface-2)] rounded w-1/3" />
          <div className="h-64 bg-[var(--c-surface-2)] rounded-xl" />
        </div>
      </main>
    )
  }

  if (quizSubmitted) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        {passed ? (
          <>
            <Trophy size={64} className="mx-auto text-[var(--c-educa)] mb-4" />
            <h1 className="text-2xl font-bold mb-2">¡Felicidades! 🎉</h1>
            <p className="text-[var(--c-text-muted)] mb-6">
              Completaste el curso &quot;{course.title}&quot; y aprobaste el quiz.
            </p>
            <Badge variant="educa" className="text-base px-4 py-1">Certificado obtenido ✓</Badge>
            <p className="text-sm text-[var(--c-text-dim)] mt-4">
              Tu certificado está disponible en tu panel.
            </p>
          </>
        ) : (
          <>
            <p className="text-5xl mb-4">📝</p>
            <h1 className="text-2xl font-bold mb-2">Necesitas repasar</h1>
            <p className="text-[var(--c-text-muted)] mb-6">
              Necesitas al menos 70% para obtener el certificado. ¡Inténtalo de nuevo!
            </p>
            <Button variant="educa" onClick={() => { setQuizSubmitted(false); setQuizAnswers([]) }}>
              Reintentar Quiz
            </Button>
          </>
        )}
      </main>
    )
  }

  if (showQuiz) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Quiz de Certificación</h1>
        <p className="text-[var(--c-text-muted)] mb-6">Aprueba con 70% para obtener tu certificado.</p>

        <div className="space-y-6">
          {course.quiz.map((q, qi) => (
            <Card key={qi} className="p-5">
              <p className="font-medium mb-3">{qi + 1}. {q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      quizAnswers[qi] === oi
                        ? 'border-[var(--c-educa)] bg-violet-500/5'
                        : 'border-[var(--c-border)] hover:border-[var(--c-border-hover)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${qi}`}
                      checked={quizAnswers[qi] === oi}
                      onChange={() => {
                        const newAnswers = [...quizAnswers]
                        newAnswers[qi] = oi
                        setQuizAnswers(newAnswers)
                      }}
                      className="accent-[var(--c-educa)]"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Button
          variant="educa"
          className="w-full mt-6"
          onClick={submitQuiz}
          disabled={quizAnswers.filter(a => a !== undefined).length < course.quiz.length}
        >
          Enviar Respuestas
        </Button>
      </main>
    )
  }

  // Get video for current lesson
  const currentVideo = course.lesson_videos?.[currentLesson] || ''
  const youtubeId = currentVideo ? getYouTubeId(currentVideo) : null

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar - lesson list */}
        <div className="md:col-span-1 order-2 md:order-1">
          <h3 className="font-semibold text-sm mb-3">Lecciones</h3>
          <div className="space-y-1">
            {course.lessons.map((lesson, i) => (
              <button
                key={i}
                onClick={() => setCurrentLesson(i)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  currentLesson === i
                    ? 'bg-[var(--c-educa)]/10 text-[var(--c-educa)]'
                    : 'hover:bg-[var(--c-surface-2)]'
                }`}
              >
                {completedLessons.includes(i) ? (
                  <CheckCircle size={16} className="text-[var(--c-success)] shrink-0" />
                ) : (
                  <Circle size={16} className="text-[var(--c-text-dim)] shrink-0" />
                )}
                <span className="line-clamp-1">{lesson}</span>
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-4 p-3 rounded-lg bg-[var(--c-surface)] border border-[var(--c-border)]">
            <p className="text-xs text-[var(--c-text-dim)] mb-1">Progreso</p>
            <div className="w-full h-2 bg-[var(--c-surface-2)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--c-educa)] rounded-full transition-all"
                style={{ width: `${(completedLessons.length / course.lessons.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[var(--c-text-muted)] mt-1">
              {completedLessons.length}/{course.lessons.length} completadas
            </p>
          </div>

          {!user && (
            <p className="mt-3 text-xs text-[var(--c-warning)] bg-amber-500/10 p-2 rounded-lg">
              ⚠️ Inicia sesión para guardar tu progreso
            </p>
          )}
        </div>

        {/* Main content area */}
        <div className="md:col-span-3 order-1 md:order-2">
          <Card className="p-6">
            <Badge variant="educa" className="mb-3">Lección {currentLesson + 1}</Badge>
            <h2 className="text-xl font-bold mb-4">{course.lessons[currentLesson]}</h2>

            {/* Video: YouTube embed or placeholder */}
            {youtubeId ? (
              <div className="aspect-video rounded-xl overflow-hidden mb-6 border border-[var(--c-border)]">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                  title={course.lessons[currentLesson]}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-video bg-[var(--c-surface-2)] rounded-xl flex items-center justify-center mb-6 border border-[var(--c-border)]">
                <div className="text-center">
                  <Play size={48} className="mx-auto text-[var(--c-educa)] mb-2" />
                  <p className="text-sm text-[var(--c-text-muted)]">Contenido de la lección</p>
                  <p className="text-xs text-[var(--c-text-dim)]">Video próximamente</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="educa" onClick={completeLesson}>
                {completedLessons.includes(currentLesson)
                  ? (currentLesson < course.lessons.length - 1 ? 'Siguiente Lección →' : '✓ Completada')
                  : 'Marcar Completada ✓'}
              </Button>

              {allLessonsComplete && (
                <Button variant="secondary" onClick={() => setShowQuiz(true)}>
                  🏆 Tomar Quiz de Certificación
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
