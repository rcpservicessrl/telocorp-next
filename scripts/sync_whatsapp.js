const fs = require('fs');
const path = require('path');

const srcDir = fs.existsSync(path.join(__dirname, '../Recursos')) ? path.join(__dirname, '../Recursos') : path.join(__dirname, '../temp_whatsapp');
const destDir = path.join(__dirname, '../public/TeloCorp/images');
const jsonDest = path.join(__dirname, '../public/whatsapp-products.json');

function sync() {
  console.log('--- WhatsApp Catalog Sync Started ---');
  
  if (!fs.existsSync(srcDir)) {
    console.error(`Source directory does not exist: ${srcDir}`);
    return;
  }
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir);
  // Filter out 0 byte files
  const validFiles = files.filter(f => {
    try {
      const s = fs.statSync(path.join(srcDir, f));
      return s.size > 0;
    } catch (e) {
      return false;
    }
  });

  const jpgFiles = validFiles.filter(f => f.toLowerCase().endsWith('.jpg'));
  console.log(`Found ${jpgFiles.length} valid non-zero JPG images in WhatsApp folder.`);
  
  let copied = 0;
  for (const file of jpgFiles) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(srcPath, destPath);
      copied++;
    }
  }
  console.log(`Copied ${copied} new JPG images. Total in public/TeloCorp/images: ${fs.readdirSync(destDir).length}`);

  // 2. Parse text file
  const txtFile = files.find(f => f.endsWith('.txt'));
  if (!txtFile) {
    console.error('No .txt file found in WhatsApp backup.');
    return;
  }
  
  console.log(`Parsing chat log: ${txtFile}`);
  const content = fs.readFileSync(path.join(srcDir, txtFile), 'utf8');
  const lines = content.split('\n');
  
  const rawMessages = [];
  const messageRegex = /^\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}\s*[AP]M)\]?\s*-\s*([^:]+):\s*(.*)$/i;

  let currentMsg = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const match = line.match(messageRegex);
    if (match) {
      if (currentMsg) rawMessages.push(currentMsg);
      currentMsg = {
        date: match[1],
        time: match[2],
        sender: match[3],
        text: match[4],
        attachments: []
      };
      
      const att = match[4].match(/(IMG-\d{8}-WA\d{4}\.jpg|VID-\d{8}-WA\d{4}\.mp4)/i);
      if (att) currentMsg.attachments.push(att[1]);
    } else {
      if (currentMsg) {
        currentMsg.text += '\n' + line;
        const att = line.match(/(IMG-\d{8}-WA\d{4}\.jpg|VID-\d{8}-WA\d{4}\.mp4)/i);
        if (att) currentMsg.attachments.push(att[1]);
      }
    }
  }
  if (currentMsg) rawMessages.push(currentMsg);

  // Group messages sent by same sender within a 2-minute window
  const groups = [];
  let currentGroup = null;

  for (const msg of rawMessages) {
    const timeStr = `${msg.date} ${msg.time}`;
    const [dPart, tPart] = timeStr.split(' ');
    const [month, day, year] = dPart.split('/').map(Number);
    let [hour, min] = tPart.split(':').map(Number);
    const isPm = tPart.toLowerCase().includes('pm');
    if (isPm && hour < 12) hour += 12;
    if (!isPm && hour === 12) hour = 0;
    const fullYear = year < 100 ? 2000 + year : year;
    const timestamp = new Date(fullYear, month - 1, day, hour, min).getTime();
    
    const diffMin = currentGroup ? Math.abs(timestamp - currentGroup.timestamp) / 60000 : 0;
    
    if (currentGroup && currentGroup.sender === msg.sender && diffMin <= 2) {
      currentGroup.attachments.push(...msg.attachments);
      currentGroup.texts.push(msg.text);
    } else {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = {
        sender: msg.sender,
        timeStr,
        timestamp,
        attachments: [...msg.attachments],
        texts: [msg.text]
      };
    }
  }
  if (currentGroup) groups.push(currentGroup);

  const parsedProducts = [];

  for (const group of groups) {
    const images = [...new Set(group.attachments.filter(a => a.toLowerCase().endsWith('.jpg')))];
    if (images.length === 0) continue;

    let combinedText = group.texts
      .map(t => t.replace(/(IMG-\d{8}-WA\d{4}\.jpg|VID-\d{8}-WA\d{4}\.mp4)\s*\(file attached\)/gi, '').trim())
      .filter(Boolean)
      .join('\n')
      .trim();
      
    const uniqueLines = [...new Set(combinedText.split('\n'))];
    combinedText = uniqueLines.join('\n').trim();
    
    if (!combinedText) continue;
    
    const rawLines = combinedText.split('\n').map(l => l.trim()).filter(Boolean);
    if (rawLines.length === 0) continue;
    
    const noisePatterns = [
      /vamos\s+al\s+game/i,
      /se\s+acab[oó]\s+el\s+descanso/i,
      /diseñ?os?\s+disponibles/i,
      /modelos?\s+disponibles/i,
      /aprovechar\s+las\s+ofertas/i,
      /l[aá]mina\s+de\s+diseñ?os?/i,
      /disponibles?\s+aqu[ií]/i,
      /quemarlo\s+ahora\s+mismo/i
    ];

    let candidateLines = rawLines.map(l => 
      l.replace(/^\*+/, '')
       .replace(/\*+$/, '')
       .replace(/^[🚨✅🔥👊🏽😍📌💎🏡✨🎉📱🎮]+/g, '')
       .replace(/[🚨✅🔥👊🏽😍📌💎🏡✨🎉📱🎮]+$/g, '')
       .trim()
    ).filter(l => l.length > 2);

    // Find first line not matching noise
    let titleLine = candidateLines.find(l => !noisePatterns.some(pat => pat.test(l)));

    if (!titleLine && candidateLines.length > 0) {
      // Fallback: clean noise out of first candidate line
      titleLine = candidateLines[0];
      for (const pat of noisePatterns) {
        titleLine = titleLine.replace(pat, '').trim();
      }
    }

    if (!titleLine || titleLine.length < 2) continue;

    let title = titleLine;
    if (title.length > 80) {
      title = title.substring(0, 80) + '...';
    }

    let cost = 0;
    const pricePatterns = [
      /(?:unidad|neto|costo|precio)\s*(?:mayor)?\s*\$?\s*([0-9,.]+)/i,
      /\$\s*([0-9,.]+)/i,
      /([0-9,.]+)\s*(?:pesos|rd)/i,
      /costo\s*:?\s*([0-9,.]+)/i
    ];
    
    for (const pattern of pricePatterns) {
      const match = combinedText.match(pattern);
      if (match) {
        const val = parseInt(match[1].replace(/,/g, ''), 10);
        if (val > 0 && val < 50000) {
          cost = val;
          break;
        }
      }
    }

    let category = 'Accesorios';
    const lowerText = combinedText.toLowerCase();
    if (lowerText.includes('silla') || lowerText.includes('mesa') || lowerText.includes('playa')) {
      category = 'Mobiliario';
    } else if (lowerText.includes('aro') || lowerText.includes('luz') || lowerText.includes('bombillo') || lowerText.includes('led') || lowerText.includes('lámpara') || lowerText.includes('lampara')) {
      category = 'Iluminación';
    } else if (lowerText.includes('audifono') || lowerText.includes('sonido') || lowerText.includes('humidificador') || lowerText.includes('bocina') || lowerText.includes('speaker') || lowerText.includes('sound')) {
      category = 'Audio';
    } else if (lowerText.includes('cable') || lowerText.includes('cargador') || lowerText.includes('cover') || lowerText.includes('protector')) {
      category = 'Accesorios';
    }
    
    let price = 0;
    if (cost > 0) {
      if (cost < 200) {
        price = cost * 2.5; // +150% ganancia
      } else if (cost < 1000) {
        price = cost * 2.0; // +100% ganancia
      } else if (cost < 3000) {
        price = cost * 1.5; // +50% ganancia
      } else {
        price = cost * 1.35; // +35% ganancia
      }
      price = Math.round(price / 10) * 10;
    } else {
      // Precio sugerido por categoría si no se especifica costo en la publicación
      if (category === 'Mobiliario') price = 4500;
      else if (category === 'Audio') price = 1250;
      else if (category === 'Iluminación') price = 850;
      else price = 450; // Accesorios
    }

    const videos = [...new Set(group.attachments.filter(a => a.toLowerCase().endsWith('.mp4')))];
    for (const v of videos) {
      const srcV = path.join(srcDir, v);
      const destV = path.join(destDir, v);
      if (fs.existsSync(srcV) && !fs.existsSync(destV)) {
        try {
          if (fs.statSync(srcV).size > 0) fs.copyFileSync(srcV, destV);
        } catch (e) {}
      }
    }

    const cleanSlug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const id = `${cleanSlug}-${images[0].substring(4, 12)}`;

    parsedProducts.push({
      id,
      title,
      description: combinedText,
      cost,
      price,
      image: `TeloCorp/images/${images[0]}`,
      images: images.slice(1).map(img => `TeloCorp/images/${img}`),
      video: videos.length > 0 ? `TeloCorp/images/${videos[0]}` : '',
      category,
      date: group.timeStr,
      originalText: combinedText
    });
  }

  // Deduplicate products by title
  const seenTitles = new Set();
  const uniqueProducts = [];
  
  for (const p of parsedProducts) {
    if (!seenTitles.has(p.title.toLowerCase())) {
      seenTitles.add(p.title.toLowerCase());
      uniqueProducts.push(p);
    }
  }

  console.log(`Extracted ${uniqueProducts.length} unique products.`);
  
  fs.writeFileSync(jsonDest, JSON.stringify(uniqueProducts, null, 2), 'utf8');
  console.log(`Saved JSON catalog data to: ${jsonDest}`);
  console.log('--- Sync Completed ---');
}

sync();
