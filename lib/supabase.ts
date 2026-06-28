import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Client-side Supabase client (browser).
 * Use for Client Components and auth state listeners.
 */
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null!

// Re-export types for convenience
export type { Product, Order, Course, Driver, SiteSettings } from '@/lib/database.types'
