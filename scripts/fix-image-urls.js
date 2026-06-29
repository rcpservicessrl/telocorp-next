// Point product images to GitHub raw URLs (already uploaded)
const { createClient } = require('@supabase/supabase-js')

const sb = createClient(
  'https://bhdictzvboiojyxorfiq.supabase.co',
  'sb_publishable_AgpNN0k_KfW0moe6f1CKXg_qP2GKJCm'
)

// GitHub raw URL base for the images
const GITHUB_RAW = 'https://raw.githubusercontent.com/rcpservicessrl/telocorp-next/master/public/TeloCorp/images'

async function main() {
  const { data: products } = await sb.from('products').select('id, title, image, images')
  
  let fixed = 0
  for (const p of products) {
    let needsUpdate = false
    let newImage = p.image || ''
    let newImages = p.images || []
    
    // Fix: TeloCorp/images/imageX.png → GitHub raw URL
    if (newImage.startsWith('TeloCorp/images/')) {
      const filename = newImage.replace('TeloCorp/images/', '')
      newImage = `${GITHUB_RAW}/${filename}`
      needsUpdate = true
    }
    
    newImages = newImages.map(img => {
      if (img.startsWith('TeloCorp/images/')) {
        needsUpdate = true
        const filename = img.replace('TeloCorp/images/', '')
        return `${GITHUB_RAW}/${filename}`
      }
      return img
    })
    
    if (needsUpdate) {
      const { error } = await sb.from('products').update({ image: newImage, images: newImages }).eq('id', p.id)
      if (error) {
        console.log(`[ERROR] ${p.title}: ${error.message}`)
      } else {
        console.log(`[FIXED] ${p.title}`)
        fixed++
      }
    }
  }
  
  console.log(`\n✅ ${fixed} productos → GitHub raw URLs`)
}

main()
