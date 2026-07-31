const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../public/whatsapp-products.json');
const backupPath = path.join(__dirname, '../public/whatsapp-products.full.json');
const imgDir = path.join(__dirname, '../public/TeloCorp/images');

function isValid(imgRef) {
  if (!imgRef) return false;
  const rel = imgRef.replace('TeloCorp/images/', '');
  const fp = path.join(imgDir, rel);
  try {
    return fs.existsSync(fp) && fs.statSync(fp).size > 0;
  } catch (e) {
    return false;
  }
}

const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Catálogo original: ${products.length} productos`);

// Save full backup once (source of truth, reversible)
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, JSON.stringify(products, null, 2), 'utf8');
  console.log(`Respaldo completo guardado en: ${path.basename(backupPath)}`);
}

const cleaned = [];
let promoted = 0;
let dropped = 0;

for (const p of products) {
  const gallery = [p.image, ...(p.images || [])].filter(Boolean);
  const validGallery = gallery.filter(isValid);

  if (validGallery.length === 0) {
    dropped++;
    continue; // no usable image -> exclude from live catalog
  }

  // Promote first valid image to primary if current primary is broken
  if (!isValid(p.image)) {
    promoted++;
  }
  p.image = validGallery[0];
  p.images = validGallery.slice(1);
  cleaned.push(p);
}

fs.writeFileSync(jsonPath, JSON.stringify(cleaned, null, 2), 'utf8');

console.log(`Productos con imagen válida: ${cleaned.length}`);
console.log(`Productos con imagen principal reparada (promovida): ${promoted}`);
console.log(`Productos excluidos (sin ninguna imagen válida): ${dropped}`);
console.log(`Catálogo limpio escrito en: ${path.basename(jsonPath)}`);
