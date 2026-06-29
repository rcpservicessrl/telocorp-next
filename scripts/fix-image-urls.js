// Fix product image URLs — remove leading slash so template builds correctly
const { createClient } = require('@supabase/supabase-js')

const sb = createClient(
  'https://bhdictzvboiojyxorfiq.supabase.co',
  'sb_publishable_AgpNN0k_KfW0moe6f1CKXg_qP2GKJCm'
)

async function main() {
  const { data: products } = await sb.from('products').select('id, title, image, images')
  
  let fixed = 0
  for (const p of products) {
    let needsUpdate = false
    let newImage = p.image || ''
    let newImages = p.images || []
    
    // Remove leading slash: /TeloCorp/... → TeloCorp/...
    if (newImage.startsWith('/TeloCorp/')) {
      newImage = newImage.slice(1) // Remove leading /
      needsUpdate = true
    }
    
    newImages = newImages.map(img => {
      if (img.startsWith('/TeloCorp/')) {
        needsUpdate = true
        return img.slice(1)
      }
      return img
    })
    
    if (needsUpdate) {
      const { error } = await sb.from('products').update({ image: newImage, images: newImages }).eq('id', p.id)
      if (error) {
        console.log(`[ERROR] ${p.title}: ${error.message}`)
      } else {
        console.log(`[FIXED] ${p.title} → ${newImage}`)
        fixed++
      }
    }
  }
  
  console.log(`\n✅ ${fixed} productos actualizados`)
}

main()
