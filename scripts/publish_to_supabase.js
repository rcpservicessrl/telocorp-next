const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
const envLocalPath = path.join(__dirname, '../.env.local');
let supabaseUrl = 'https://bhdictzvboiojyxorfiq.supabase.co';

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/);
  if (urlMatch) supabaseUrl = urlMatch[1].trim();
}

const jsonPath = path.join(__dirname, '../public/whatsapp-products.json');

async function publish() {
  const args = process.argv.slice(2);
  const serviceRoleKey = args[0] || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.error('\n❌ ERROR: Falta la clave SUPABASE_SERVICE_ROLE_KEY.');
    console.log('\nUso del script:');
    console.log('  node scripts/publish_to_supabase.js <TU_SERVICE_ROLE_KEY>\n');
    console.log('Consigue la clave secreta "service_role" en:');
    console.log('  Supabase Dashboard > Settings > API > service_role (Secret Key)\n');
    process.exit(1);
  }

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ ERROR: No se encontró el archivo ${jsonPath}. Corre primero "node scripts/sync_whatsapp.js".`);
    process.exit(1);
  }

  console.log('--- Publicando catálogo de WhatsApp en Supabase ---');
  console.log(`URL del Proyecto: ${supabaseUrl}`);
  
  // Initialize supabase with the service_role key to bypass RLS
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Cargados ${products.length} productos del archivo JSON.`);

  // 1. Extract and auto-create categories
  const categories = [...new Set(products.map(p => p.category))];
  console.log(`Detectadas ${categories.length} categorías: ${categories.join(', ')}`);
  
  for (const catName of categories) {
    const { data: existing, error: selectErr } = await supabase
      .from('categories')
      .select('name')
      .eq('name', catName)
      .maybeSingle();

    if (selectErr) {
      console.error(`Error al verificar categoría ${catName}:`, selectErr.message);
      continue;
    }

    if (!existing) {
      let margin = 50;
      if (catName === 'Accesorios') margin = 100;
      if (catName === 'Audio' || catName === 'Iluminación') margin = 80;

      console.log(`Creando nueva categoría: "${catName}" con margen ${margin}%`);
      const { error: insertErr } = await supabase
        .from('categories')
        .insert({ name: catName, margin, active: true });

      if (insertErr) {
        console.error(`Error al crear categoría ${catName}:`, insertErr.message);
      }
    }
  }

  // 2. Format and Batch Upload (Upsert) products
  const productsToInsert = products.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    cost: p.cost,
    price: p.price,
    image: p.image,
    images: p.images,
    category: p.category,
    active: true,
    featured: false,
    stock: 15, // Default stock for new imports
    sold: 0,
    rating: 5.0
  }));

  console.log('Subiendo productos a Supabase...');
  
  // Upsert in batches of 50 to avoid payload size errors
  const batchSize = 50;
  let successful = 0;

  for (let i = 0; i < productsToInsert.length; i += batchSize) {
    const batch = productsToInsert.slice(i, i + batchSize);
    const { error: upsertErr } = await supabase
      .from('products')
      .upsert(batch, { onConflict: 'id' });

    if (upsertErr) {
      console.error(`❌ Error en el lote ${i / batchSize + 1}:`, upsertErr.message);
    } else {
      successful += batch.length;
      console.log(`✓ Lote ${i / batchSize + 1} subido (${batch.length} productos).`);
    }
  }

  console.log(`\n🎉 PROCESO COMPLETADO.`);
  console.log(`Se publicaron con éxito ${successful} de ${products.length} productos en producción.`);
}

publish();
