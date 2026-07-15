import fs from 'fs'
import path from 'path'

export interface ParsedProduct {
  id: string
  title: string
  description: string
  cost: number
  price: number
  image: string
  images: string[]
  category: string
  date: string
  originalText: string
}

/**
 * Parses the WhatsApp chat text file and groups messages by date/time
 * to extract unique products and calculate selling prices.
 */
export function parseWhatsAppChat(): ParsedProduct[] {
  const jsonPath = path.join(process.cwd(), 'public/whatsapp-products.json')
  
  if (fs.existsSync(jsonPath)) {
    try {
      const data = fs.readFileSync(jsonPath, 'utf8')
      return JSON.parse(data) as ParsedProduct[]
    } catch (e) {
      console.error('Error reading whatsapp-products.json, falling back to parser', e)
    }
  }

  const dirPath = path.join(process.cwd(), 'temp_whatsapp')
  
  if (!fs.existsSync(dirPath)) {
    console.error('Directory temp_whatsapp does not exist')
    return []
  }
  
  const files = fs.readdirSync(dirPath)
  const txtFile = files.find(f => f.endsWith('.txt'))
  
  if (!txtFile) {
    console.error('No .txt file found in temp_whatsapp')
    return []
  }
  
  const content = fs.readFileSync(path.join(dirPath, txtFile), 'utf8')
  const lines = content.split('\n')
  
  const rawMessages: Array<{
    date: string
    time: string
    sender: string
    text: string
    attachments: string[]
  }> = []

  const messageRegex = /^\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}\s*[AP]M)\]?\s*-\s*([^:]+):\s*(.*)$/i

  let currentMsg: typeof rawMessages[0] | null = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const match = line.match(messageRegex)
    if (match) {
      if (currentMsg) rawMessages.push(currentMsg)
      currentMsg = {
        date: match[1],
        time: match[2],
        sender: match[3],
        text: match[4],
        attachments: []
      }
      
      const att = match[4].match(/(IMG-\d{8}-WA\d{4}\.jpg|VID-\d{8}-WA\d{4}\.mp4)/i)
      if (att) currentMsg.attachments.push(att[1])
    } else {
      if (currentMsg) {
        currentMsg.text += '\n' + line
        const att = line.match(/(IMG-\d{8}-WA\d{4}\.jpg|VID-\d{8}-WA\d{4}\.mp4)/i)
        if (att) currentMsg.attachments.push(att[1])
      }
    }
  }
  if (currentMsg) rawMessages.push(currentMsg)

  // Smart Grouping: group contiguous messages by same sender within a 2-minute window
  const groups: Array<{
    sender: string
    timeStr: string
    timestamp: number
    attachments: string[]
    texts: string[]
  }> = []
  
  let currentGroup: typeof groups[0] | null = null

  for (const msg of rawMessages) {
    const timeStr = `${msg.date} ${msg.time}`
    // Parse time to simple approximate timestamp (just for diff calculation)
    const [dPart, tPart] = timeStr.split(' ')
    const [month, day, year] = dPart.split('/').map(Number)
    let [hour, min] = tPart.split(':').map(Number)
    const isPm = tPart.toLowerCase().includes('pm')
    if (isPm && hour < 12) hour += 12
    if (!isPm && hour === 12) hour = 0
    const fullYear = year < 100 ? 2000 + year : year
    const timestamp = new Date(fullYear, month - 1, day, hour, min).getTime()
    
    const diffMin = currentGroup ? Math.abs(timestamp - currentGroup.timestamp) / 60000 : 0
    
    if (currentGroup && currentGroup.sender === msg.sender && diffMin <= 2) {
      currentGroup.attachments.push(...msg.attachments)
      currentGroup.texts.push(msg.text)
    } else {
      if (currentGroup) groups.push(currentGroup)
      currentGroup = {
        sender: msg.sender,
        timeStr,
        timestamp,
        attachments: [...msg.attachments],
        texts: [msg.text]
      }
    }
  }
  if (currentGroup) groups.push(currentGroup)

  const parsedProducts: ParsedProduct[] = []

  for (const group of groups) {
    // Filter to only groups containing JPG images
    const images = [...new Set(group.attachments.filter(a => a.toLowerCase().endsWith('.jpg')))]
    if (images.length === 0) continue

    // Combine and clean text
    let combinedText = group.texts
      .map(t => t.replace(/(IMG-\d{8}-WA\d{4}\.jpg|VID-\d{8}-WA\d{4}\.mp4)\s*\(file attached\)/gi, '').trim())
      .filter(Boolean)
      .join('\n')
      .trim()
      
    // Deduplicate repetitive lines (e.g. Fady repeating the same description for multiple images in a batch)
    const uniqueLines = [...new Set(combinedText.split('\n'))]
    combinedText = uniqueLines.join('\n').trim()
    
    if (!combinedText) continue
    
    // Clean emojis & formatting for title extraction
    const rawLines = combinedText.split('\n').map(l => l.trim()).filter(Boolean)
    if (rawLines.length === 0) continue
    
    // Title is the first line, clean it from asterisks/emojis
    let title = rawLines[0]
      .replace(/^\*+/, '')
      .replace(/\*+$/, '')
      .replace(/^[🚨✅🔥👊🏽😍📌💎]+/g, '')
      .replace(/[🚨✅🔥👊🏽😍📌💎]+$/g, '')
      .trim()
      
    // If title is just "Vamos al Game" or similar, look for the next line
    if ((title.toLowerCase().includes('vamos al game') || title.length < 3) && rawLines.length > 1) {
      title = rawLines[1]
        .replace(/^\*+/, '')
        .replace(/\*+$/, '')
        .replace(/^[🚨✅🔥👊🏽😍📌💎]+/g, '')
        .replace(/[🚨✅🔥👊🏽😍📌💎]+$/g, '')
        .trim()
    }
    
    // Limit title length
    if (title.length > 80) {
      title = title.substring(0, 80) + '...'
    }

    // Try to extract cost price (unit cost)
    let cost = 0
    const pricePatterns = [
      /(?:unidad|neto|costo|precio)\s*(?:mayor)?\s*\$?([0-9,.]+)/i,
      /\$\s*([0-9,.]+)/i,
      /([0-9,.]+)\s*(?:pesos|rd)/i
    ]
    
    for (const pattern of pricePatterns) {
      const match = combinedText.match(pattern)
      if (match) {
        const val = parseInt(match[1].replace(/,/g, ''), 10)
        if (val > 0 && val < 50000) { // filter outliers
          cost = val
          break
        }
      }
    }
    
    // Calculate retail price with margins
    let price = 0
    if (cost > 0) {
      if (cost < 200) {
        price = cost * 2.5 // +150% markup
      } else if (cost < 1000) {
        price = cost * 2.0 // +100% markup
      } else {
        price = cost * 1.5 // +50% markup
      }
      
      // Clean rounding to nearest 5 or 10
      price = Math.round(price / 10) * 10
    }

    // Infer category
    let category = 'Accesorios'
    const lowerText = combinedText.toLowerCase()
    if (lowerText.includes('silla') || lowerText.includes('mesa') || lowerText.includes('playa')) {
      category = 'Mobiliario'
    } else if (lowerText.includes('aro') || lowerText.includes('luz') || lowerText.includes('bombillo') || lowerText.includes('led') || lowerText.includes('lámpara')) {
      category = 'Iluminación'
    } else if (lowerText.includes('audifono') || lowerText.includes('sonido') || lowerText.includes('humidificador') || lowerText.includes('bocina') || lowerText.includes('speaker') || lowerText.includes('sound')) {
      category = 'Audio'
    } else if (lowerText.includes('cable') || lowerText.includes('cargador') || lowerText.includes('cover') || lowerText.includes('protector')) {
      category = 'Accesorios'
    }

    // Build ID slug
    const cleanSlug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    
    const id = `${cleanSlug}-${images[0].substring(4, 12)}` // suffix with image timestamp unique part

    parsedProducts.push({
      id,
      title,
      description: combinedText,
      cost,
      price,
      image: `TeloCorp/images/${images[0]}`,
      images: images.slice(1).map(img => `TeloCorp/images/${img}`),
      category,
      date: group.timeStr,
      originalText: combinedText
    })
  }

  // Deduplicate products by title
  const seenTitles = new Set<string>()
  const uniqueProducts: ParsedProduct[] = []
  
  for (const p of parsedProducts) {
    if (!seenTitles.has(p.title.toLowerCase())) {
      seenTitles.add(p.title.toLowerCase())
      uniqueProducts.push(p)
    }
  }

  return uniqueProducts
}
