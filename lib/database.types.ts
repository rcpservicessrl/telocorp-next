/**
 * Database types for Supabase — matches production schema.
 * This file defines the TypeScript interfaces for all tables.
 */

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

/**
 * Organization (empresa vinculada al ecosistema Telo' Corp Group).
 * Cada organización tiene sus propios módulos, usuarios y permisos.
 */
export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  modules: string[] // ['sales', 'educa', 'lleva', 'repara', 'instala']
  plan: 'free' | 'basic' | 'pro' | 'enterprise'
  owner_id: string
  settings: Record<string, unknown>
  active: boolean
  created_at: string
}

/**
 * Miembro de una organización con rol y permisos granulares.
 */
export interface OrgMember {
  id: string
  org_id: string
  user_id: string
  role: 'owner' | 'admin' | 'manager' | 'operator' | 'viewer'
  modules: string[] // módulos a los que tiene acceso
  permissions: Record<string, boolean>
  invited_by: string | null
  joined_at: string
}

/**
 * Supabase generated Database type (simplified).
 * Extend as tables are added.
 */
export interface Database {
  public: {
    Tables: {
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product> }
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> }
      courses: { Row: Course; Insert: Partial<Course>; Update: Partial<Course> }
      drivers: { Row: Driver; Insert: Partial<Driver>; Update: Partial<Driver> }
      site_settings: { Row: SiteSettings; Insert: Partial<SiteSettings>; Update: Partial<SiteSettings> }
      organizations: { Row: Organization; Insert: Partial<Organization>; Update: Partial<Organization> }
      org_members: { Row: OrgMember; Insert: Partial<OrgMember>; Update: Partial<OrgMember> }
    }
  }
}
