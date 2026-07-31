const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../public/whatsapp-products.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// --- Diccionario de correcciones (clave en minúscula -> corrección en minúscula) ---
// Errores claros de escritura y acentos que aparecen en el catálogo.
const SPELL = {
  'bosina': 'bocina',
  'bosisna': 'bocina',
  'bosna': 'bocina',
  'selfil': 'selfie',
  'notebooook': 'notebook',
  'noteboook': 'notebook',
  'microhoondas': 'microondas',
  'microhondas': 'microondas',
  'velocidsdes': 'velocidades',
  'velocidsd': 'velocidades',
  'baso': 'vaso',
  'sirvel': 'silver',
  'frezzer': 'freezer',
  'freezzer': 'freezer',
  'chupon': 'chupón',
  'magnetico': 'magnético',
  'magnetica': 'magnética',
  'tripode': 'trípode',
  'iluminacion': 'iluminación',
  'despues': 'después',
  'plastico': 'plástico',
  'silicon': 'silicona',
  'botellon': 'botellón',
};

// Correcciones contextuales de dos palabras (se aplican antes que las de palabra única)
const PHRASES = [
  [/aire\s+inverte\b/gi, 'Aire Inverter'],
  [/palo\s+de\s+selfil\b/gi, 'Palo de Selfie'],
  [/aro\s+de\s+lus\b/gi, 'Aro de Luz'],
  [/silicon\s+stick\b/gi, 'Silicona Stitch'],
];

// Tokens que deben permanecer en MAYÚSCULA (acrónimos / unidades / marcas)
const KEEP_UPPER = new Set([
  'RGB','PD','USB','TWS','BTU','PS4','PS5','MAH','SHS','GTS',
  'BT12','A12','K15','R9','S3','G04','D09','S16','LK','ZQS','JQS','WS',
  'MJ','CH','AKZ','IPX7','2M','3D',
]);

function preserveCase(original, replacement) {
  if (original === original.toUpperCase()) return replacement.toUpperCase();
  if (original[0] === original[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

// Reemplaza palabras mal escritas preservando el caso del contexto
function applySpelling(text) {
  let out = text;
  for (const [re, rep] of PHRASES) out = out.replace(re, rep);
  for (const [wrong, right] of Object.entries(SPELL)) {
    const re = new RegExp('\\b' + wrong + '\\b', 'gi');
    out = out.replace(re, (m) => preserveCase(m, right));
  }
  return out;
}

// ¿Es un código de modelo? (contiene dígito, o guion, o está en KEEP_UPPER)
function isCode(word) {
  const bare = word.replace(/[^A-Za-z0-9-]/g, '');
  if (/\d/.test(bare)) return true;
  if (bare.includes('-')) return true;
  if (KEEP_UPPER.has(bare.toUpperCase())) return true;
  if (bare.length <= 3 && bare === bare.toUpperCase() && /^[A-Z]+$/.test(bare)) return true;
  return false;
}

const SMALL_WORDS = new Set(['de','del','la','el','los','las','y','en','con','a','por','para','o','al']);

function smartTitleCase(title) {
  const words = title.split(/\s+/).filter(Boolean);
  return words.map((w, idx) => {
    const lower = w.toLowerCase();
    // Palabras cortas (preposiciones/artículos) en minúscula, salvo la primera
    if (idx !== 0 && SMALL_WORDS.has(lower)) return lower;
    if (isCode(w)) return w.toUpperCase();
    // Title case respetando acentos
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(' ');
}

function cleanTitle(raw) {
  let t = raw;
  // Quitar carácter de reemplazo/encoding corrupto y emojis
  t = t.replace(/\uFFFD/g, '');
  t = t.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\uFE0F]/gu, '');
  // Tomar solo la primera línea
  t = t.split('\n')[0];
  // Quitar cualquier símbolo/basura al inicio (deja letras o números)
  t = t.replace(/^[^\p{L}\p{N}]+/u, '');
  // Quitar dos puntos/espacios sobrantes al final
  t = t.replace(/[:\s]+$/,'').trim();
  // Colapsar espacios múltiples
  t = t.replace(/\s{2,}/g, ' ');
  return t;
}

let changed = 0;
const report = [];

for (const p of products) {
  const origTitle = p.title;
  let t = cleanTitle(p.title);
  t = applySpelling(t);
  t = smartTitleCase(t);
  // Capitalización de marca conocida
  t = t.replace(/\bIphone\b/g, 'iPhone');
  t = t.replace(/\s{2,}/g, ' ').trim();

  if (t !== origTitle) {
    report.push(`  "${origTitle.replace(/\n/g,' ')}"\n   -> "${t}"`);
    p.title = t;
    changed++;
  }

  if (p.description) {
    p.description = applySpelling(p.description);
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), 'utf8');

console.log(`Productos con título corregido: ${changed} de ${products.length}`);
console.log('\n--- CAMBIOS DE TÍTULO ---');
console.log(report.join('\n'));
