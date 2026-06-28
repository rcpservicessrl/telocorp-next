import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (for use in Client Components)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for the database (based on existing schema)
export interface Product {
  id: string
  title: string
  category: string
  price: number
  cost: number
  stock: number
  sold: number
  discount: number
  rating: number
  description: string
  image: string
  images: string[]
  video: string
  specs: Record<string, string>
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  items: { id: string; title: string; qty: number; price: number }[]
  subtotal: number
  discount: number
  shipping: number
  coupon: string | null
  total: number
  customer: { name: string; phone: string; email: string; address: string; city: string }
  status: string
  payment_method: string
  notes: string
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  icon: string
  path: string
  duration: string
  level: string
  instructor: string
  students: number
  rating: number
  lessons: string[]
  quiz: { q: string; options: string[]; correct: number }[]
  active: boolean
  sort_order: number
}

export interface Driver {
  id: string
  name: string
  phone: string
  vehicle: string
  rating: number
  jobs_completed: number
  avatar: string
  status: string
  zone: string
}

export interface SiteSettings {
  id: string
  coupons: Record<string, number>
  free_shipping_threshold: number
  shipping_cost: number
  delivery_time: string
  whatsapp_number: string
  exit_popup_enabled: boolean
  popup_coupon_code: string
  popup_coupon_discount: number
  social_proof_enabled: boolean
  flash_sale_enabled: boolean
  upsell_enabled: boolean
  cardnet_enabled: boolean
  transfer_enabled: boolean
  paypal_enabled: boolean
  chatbot_enabled: boolean
  chatbot_context: string
  promo_banner_enabled: boolean
  promo_banner_text: string
  ga4_id: string
  pixel_id: string
}
