// Restore product image URLs to point to Vercel static files (public/TeloCorp/images/)
// This is the permanent solution — images in public/ are served by Vercel at https://telocg.com/TeloCorp/images/
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
    
    // Convert GitHub Raw URL back to Vercel static URL
    if (newImage.includes('raw.githubusercontent.com/rcpservicessrl/telocorp-next/master/public/')) {
      const filename = newImage.split('/public/')[1] // e.g. TeloCorp/images/image2.png
      newImage = `https://telocg.com/${filename}`
      needsUpdate = true
    }
    
    newImages = newImages.map(img => {
      if (img.includes('raw.githubusercontent.com/rcpservicessrl/telocorp-next/master/public/')) {
        const filename = img.split('/public/')[1]
        return `https://telocg.com/${filename}`
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
  
  console.log(`\n✅ ${fixed} productos actualizados → telocg.com/TeloCorp/images/`)
}

main()
