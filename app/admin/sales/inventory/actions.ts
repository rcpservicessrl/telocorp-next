'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import * as XLSX from 'xlsx'

/**
 * Export all products as XLSX (base64 encoded)
 */
export async function exportInventory() {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { fileBase64: null, error: 'No autorizado' }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('category', { ascending: true })

  if (!products) return { fileBase64: null, error: 'No se pudieron cargar productos' }

  // Prepare rows for Excel
  const rows = products.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    price: p.price,
    cost: p.cost || 0,
    stock: p.stock || 0,
    sold: p.sold || 0,
    discount: p.discount || 0,
    rating: p.rating || 5,
    description: p.description || '',
    image: p.image || '',
    active: p.active ? 'true' : 'false',
    featured: p.featured ? 'true' : 'false',
    specs: p.specs ? JSON.stringify(p.specs) : '',
  }))

  // Create workbook
  const ws = XLSX.utils.json_to_sheet(rows)

  // Set column widths
  ws['!cols'] = [
    { wch: 36 }, // id
    { wch: 40 }, // title
    { wch: 15 }, // category
    { wch: 10 }, // price
    { wch: 10 }, // cost
    { wch: 8 },  // stock
    { wch: 8 },  // sold
    { wch: 10 }, // discount
    { wch: 8 },  // rating
    { wch: 50 }, // description
    { wch: 50 }, // image
    { wch: 8 },  // active
    { wch: 8 },  // featured
    { wch: 40 }, // specs
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Inventario')

  // Convert to base64
  const buffer = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' })

  return { fileBase64: buffer, error: null }
}

/**
 * Import products from XLSX (base64 encoded)
 * - If row has existing `id`, UPDATE that product
 * - If row has no `id` or id not found, INSERT new product
 */
export async function importInventory(fileBase64: string) {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, created: 0, updated: 0, errors: ['No autorizado'] }

  const isAdmin = user.email?.endsWith('@telocg.com') || user.user_metadata?.role === 'admin'
  if (!isAdmin) return { success: false, created: 0, updated: 0, errors: ['Acceso denegado'] }

  // Parse XLSX
  let rows: Record<string, unknown>[]
  try {
    const workbook = XLSX.read(fileBase64, { type: 'base64' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    rows = XLSX.utils.sheet_to_json(sheet)
  } catch {
    return { success: false, created: 0, updated: 0, errors: ['Error al leer el archivo Excel'] }
  }

  if (!rows.length) {
    return { success: false, created: 0, updated: 0, errors: ['El archivo está vacío'] }
  }

  // Get existing product IDs for comparison
  const { data: existing } = await supabase.from('products').select('id')
  const existingIds = new Set((existing || []).map(p => p.id))

  let created = 0
  let updated = 0
  const errors: string[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2 // Excel row (1-indexed + header)

    // Validate required fields
    const title = String(row.title || '').trim()
    if (!title) {
      errors.push(`Fila ${rowNum}: título vacío, omitida`)
      continue
    }

    const price = Number(row.price) || 0
    if (price <= 0) {
      errors.push(`Fila ${rowNum}: precio inválido (${row.price})`)
      continue
    }

    // Parse specs if present
    let specs: Record<string, string> = {}
    if (row.specs && typeof row.specs === 'string') {
      try { specs = JSON.parse(row.specs as string) } catch { /* ignore invalid JSON */ }
    }

    // Build product data
    const productData = {
      title,
      category: String(row.category || 'sin-categoría').trim(),
      price,
      cost: Number(row.cost) || 0,
      stock: Number(row.stock) || 0,
      discount: Math.min(Math.max(Number(row.discount) || 0, 0), 100),
      description: String(row.description || '').trim(),
      image: String(row.image || '').trim(),
      images: row.image ? [String(row.image).trim()] : [],
      active: String(row.active).toLowerCase() !== 'false',
      featured: String(row.featured).toLowerCase() === 'true',
      specs,
      rating: Number(row.rating) || 5,
      sold: Number(row.sold) || 0,
    }

    const id = String(row.id || '').trim()

    if (id && existingIds.has(id)) {
      // UPDATE existing product
      const { error } = await supabase
        .from('products')
        .update({ ...productData, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        errors.push(`Fila ${rowNum}: error al actualizar "${title}" — ${error.message}`)
      } else {
        updated++
      }
    } else {
      // INSERT new product
      const { error } = await supabase
        .from('products')
        .insert(productData)

      if (error) {
        errors.push(`Fila ${rowNum}: error al crear "${title}" — ${error.message}`)
      } else {
        created++
      }
    }
  }

  return {
    success: errors.length === 0 || (created + updated) > 0,
    created,
    updated,
    errors,
  }
}
