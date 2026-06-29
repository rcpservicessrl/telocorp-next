import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Client-side Supabase client (browser).
 * Uses @supabase/ssr createBrowserClient so cookies are properly managed
 * and the middleware can read the session.
 */
export const supabase = createBrowserClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)

// Re-export types for convenience
export type { Product, Order, Course, Driver, SiteSettings } from '@/lib/database.types'
