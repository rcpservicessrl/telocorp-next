// Quick script to check product image URLs in Supabase
const { createClient } = require('@supabase/supabase-js')

const sb = createClient(
  'https://bhdictzvboiojyxorfiq.supabase.co',
  'sb_publishable_AgpNN0k_KfW0moe6f1CKXg_qP2GKJCm'
)

async function main() {
  const { data: products } = await sb.from('products').select('id, title, image, images')
  
  console.log(`Total products: ${products.length}\n`)
  
  let broken = 0
  let ok = 0
  
  for (const p of products) {
    const img = p.image || ''
    const isRelative = img && !img.startsWith('http')
    const isEmpty = !img
    
    if (isEmpty) {
      console.log(`[NO IMG] ${p.title}`)
      broken++
    } else if (isRelative) {
      console.log(`[RELATIVE] ${p.title} → ${img}`)
      broken++
    } else {
      // Check if URL is accessible
      try {
        const res = await fetch(img, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
        if (res.ok) {
          ok++
        } else {
          console.log(`[${res.status}] ${p.title} → ${img.slice(0, 60)}...`)
          broken++
        }
      } catch (e) {
        console.log(`[FAIL] ${p.title} → ${img.slice(0, 60)}...`)
        broken++
      }
    }
  }
  
  console.log(`\n✅ OK: ${ok} | ❌ Broken: ${broken}`)
}

main()
