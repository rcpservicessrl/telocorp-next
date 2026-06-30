'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

interface CourseData {
  title: string
  description: string
  icon: string
  duration: string
  level: string
  instructor: string
  lessons: string[]
  lesson_videos: string[]
  quiz: { q: string; options: string[]; correct: number }[]
  active: boolean
  sort_order: number
}

export async function saveCourse(id: string | null, data: CourseData) {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const isAdmin = user.email?.endsWith('@telocg.com') || user.user_metadata?.role === 'admin'
  if (!isAdmin) return { error: 'Acceso denegado' }

  const courseData = {
    title: data.title,
    description: data.description,
    icon: data.icon,
    duration: data.duration,
    level: data.level,
    instructor: data.instructor,
    lessons: data.lessons,
    lesson_videos: data.lesson_videos,
    quiz: data.quiz,
    active: data.active,
    sort_order: data.sort_order,
    students: 0,
    rating: 5,
    path: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }

  if (id) {
    const { error } = await supabase.from('courses').update(courseData).eq('id', id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('courses').insert(courseData)
    if (error) return { error: error.message }
  }

  return { error: null }
}

export async function deleteCourse(id: string) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}
