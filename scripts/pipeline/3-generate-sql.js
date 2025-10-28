import fs from 'fs';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  INPUT_DIR: './data/final',
  OUTPUT_FILE: './data/final/INSERTS.sql'
};

// ============================================================================
// SQL GENERATION
// ============================================================================

function escapeString(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function generateEventInsert(event) {
  const fields = [];
  const values = [];

  // Always include these fields
  fields.push('id', 'title');
  values.push(escapeString(event.id), escapeString(event.title));

  // Optional fields
  if (event.profile_id) {
    fields.push('profile_id');
    values.push(escapeString(event.profile_id));
  }
  if (event.description) {
    fields.push('description');
    values.push(escapeString(event.description));
  }
  if (event.date) {
    fields.push('date');
    values.push(escapeString(event.date));
  }
  if (event.time) {
    fields.push('time');
    values.push(escapeString(event.time));
  }
  if (event.location_name) {
    fields.push('location_name');
    values.push(escapeString(event.location_name));
  }
  if (event.lat !== null && event.lat !== undefined) {
    fields.push('lat', 'lng');
    values.push(event.lat, event.lng);
  }
  if (event.category) {
    fields.push('category');
    values.push(escapeString(event.category));
  }
  if (event.price) {
    fields.push('price');
    values.push(escapeString(event.price));
  }
  if (event.organizer_name) {
    fields.push('organizer_name');
    values.push(escapeString(event.organizer_name));
  }
  if (event.contact_phone) {
    fields.push('contact_phone');
    values.push(escapeString(event.contact_phone));
  }
  if (event.contact_whatsapp) {
    fields.push('contact_whatsapp');
    values.push(escapeString(event.contact_whatsapp));
  }
  if (event.contact_instagram) {
    fields.push('contact_instagram');
    values.push(escapeString(event.contact_instagram));
  }
  if (event.contact_email) {
    fields.push('contact_email');
    values.push(escapeString(event.contact_email));
  }
  if (event.city_id) {
    fields.push('city_id');
    values.push(escapeString(event.city_id));
  }
  if (event.approval_status) {
    fields.push('approval_status');
    values.push(escapeString(event.approval_status));
  }
  if (event.image_url) {
    fields.push('image_url');
    values.push(escapeString(event.image_url));
  }

  return `INSERT INTO events (${fields.join(', ')}) VALUES (${values.join(', ')});`;
}

function generatePlaceInsert(place) {
  const fields = [];
  const values = [];

  // Always include these fields
  fields.push('id', 'name');
  values.push(escapeString(place.id), escapeString(place.name));

  // Map extracted types to valid database enum values
  const typeMapping = {
    'studio': 'venue',
    'venue': 'venue',
    'restaurant': 'restaurant',
    'accommodation': 'accommodation',
    'activity': 'activity',
    'shop': 'shop',
    'cafe': 'cafe',
    'beach': 'beach',
    'other': 'other'
  };

  // Type field (map to valid enum, default to 'other')
  const mappedType = typeMapping[place.type?.toLowerCase()] || 'other';
  fields.push('type');
  values.push(escapeString(mappedType));

  // Category field (required NOT NULL field) - use a descriptive default based on type
  const categoryDefaults = {
    'venue': 'Venue',
    'restaurant': 'Restaurant',
    'accommodation': 'Accommodation',
    'activity': 'Activity',
    'shop': 'Shop',
    'cafe': 'Cafe',
    'beach': 'Beach',
    'other': 'Other'
  };
  fields.push('category');
  values.push(escapeString(place.category || categoryDefaults[mappedType] || 'Other'));

  // Description field (required - use name as fallback)
  fields.push('description');
  values.push(escapeString(place.description || `${place.name} in Mazunte`));

  // Location_name field (required - use 'Mazunte' as default)
  fields.push('location_name');
  values.push(escapeString(place.location_name || 'Mazunte'));
  if (place.lat !== null && place.lat !== undefined) {
    fields.push('lat', 'lng');
    values.push(place.lat, place.lng);
  }
  if (place.hours) {
    fields.push('hours');
    values.push(escapeString(place.hours));
  }
  if (place.price_range) {
    fields.push('price_range');
    values.push(escapeString(place.price_range));
  }
  if (place.contact_phone) {
    fields.push('contact_phone');
    values.push(escapeString(place.contact_phone));
  }
  if (place.contact_whatsapp) {
    fields.push('contact_whatsapp');
    values.push(escapeString(place.contact_whatsapp));
  }
  if (place.contact_instagram) {
    fields.push('contact_instagram');
    values.push(escapeString(place.contact_instagram));
  }
  if (place.tags && place.tags.length > 0) {
    fields.push('tags');
    values.push(`ARRAY[${place.tags.map(t => escapeString(t)).join(', ')}]`);
  }
  if (place.city_id) {
    fields.push('city_id');
    values.push(escapeString(place.city_id));
  }
  if (place.verified !== undefined) {
    fields.push('verified');
    values.push(place.verified ? 'TRUE' : 'FALSE');
  }
  if (place.images && place.images.length > 0) {
    fields.push('images');
    values.push(`ARRAY[${place.images.map(img => escapeString(img)).join(', ')}]`);
  }

  return `INSERT INTO places (${fields.join(', ')}) VALUES (${values.join(', ')});`;
}

function generateServiceInsert(service) {
  const fields = [];
  const values = [];

  // Always include these fields
  fields.push('id', 'title');
  values.push(escapeString(service.id), escapeString(service.title));

  // Optional fields
  if (service.profile_id) {
    fields.push('profile_id');
    values.push(escapeString(service.profile_id));
  }
  if (service.description) {
    fields.push('description');
    values.push(escapeString(service.description));
  }
  if (service.category) {
    fields.push('category');
    values.push(escapeString(service.category));
  }
  if (service.price_type) {
    fields.push('price_type');
    values.push(escapeString(service.price_type));
  }
  if (service.price_amount !== null && service.price_amount !== undefined) {
    fields.push('price_amount');
    values.push(service.price_amount);
  }
  if (service.price_currency) {
    fields.push('price_currency');
    values.push(escapeString(service.price_currency));
  }
  if (service.price_notes) {
    fields.push('price_notes');
    values.push(escapeString(service.price_notes));
  }
  if (service.location_name) {
    fields.push('location_name');
    values.push(escapeString(service.location_name));
  }
  if (service.lat !== null && service.lat !== undefined) {
    fields.push('lat', 'lng');
    values.push(service.lat, service.lng);
  }
  if (service.contact_phone) {
    fields.push('contact_phone');
    values.push(escapeString(service.contact_phone));
  }
  if (service.contact_whatsapp) {
    fields.push('contact_whatsapp');
    values.push(escapeString(service.contact_whatsapp));
  }
  if (service.contact_instagram) {
    fields.push('contact_instagram');
    values.push(escapeString(service.contact_instagram));
  }
  if (service.city_id) {
    fields.push('city_id');
    values.push(escapeString(service.city_id));
  }
  if (service.approval_status) {
    fields.push('approval_status');
    values.push(escapeString(service.approval_status));
  }
  if (service.image_url) {
    fields.push('image_url');
    values.push(escapeString(service.image_url));
  }

  return `INSERT INTO services (${fields.join(', ')}) VALUES (${values.join(', ')});`;
}

// ============================================================================
// MAIN GENERATION
// ============================================================================

function generateSQL() {
  console.log('🚀 Generating SQL INSERT statements...\n');
  console.log('='.repeat(60));

  const sql = [];

  // Header
  sql.push('-- Generated INSERT statements for Supabase');
  sql.push(`-- Generated: ${new Date().toISOString()}`);
  sql.push('-- Source: WhatsApp message extraction pipeline');
  sql.push('');
  sql.push('-- Instructions:');
  sql.push('-- 1. Copy this entire file');
  sql.push('-- 2. Open Supabase SQL Editor');
  sql.push('-- 3. Paste and run');
  sql.push('');

  // Load and generate events
  const eventsFile = `${CONFIG.INPUT_DIR}/events.json`;
  if (fs.existsSync(eventsFile)) {
    const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
    if (events.length > 0) {
      sql.push('');
      sql.push('-- ============================================');
      sql.push(`-- EVENTS (${events.length} total)`);
      sql.push('-- ============================================');
      sql.push('');
      events.forEach(event => {
        sql.push(generateEventInsert(event));
      });
      console.log(`✅ Generated ${events.length} event inserts`);
    }
  }

  // Load and generate places
  const placesFile = `${CONFIG.INPUT_DIR}/places.json`;
  if (fs.existsSync(placesFile)) {
    const places = JSON.parse(fs.readFileSync(placesFile, 'utf8'));
    if (places.length > 0) {
      sql.push('');
      sql.push('-- ============================================');
      sql.push(`-- PLACES (${places.length} total)`);
      sql.push('-- ============================================');
      sql.push('');
      places.forEach(place => {
        sql.push(generatePlaceInsert(place));
      });
      console.log(`✅ Generated ${places.length} place inserts`);
    }
  }

  // Load and generate services
  const servicesFile = `${CONFIG.INPUT_DIR}/services.json`;
  if (fs.existsSync(servicesFile)) {
    const services = JSON.parse(fs.readFileSync(servicesFile, 'utf8'));
    if (services.length > 0) {
      sql.push('');
      sql.push('-- ============================================');
      sql.push(`-- SERVICES (${services.length} total)`);
      sql.push('-- ============================================');
      sql.push('');
      services.forEach(service => {
        sql.push(generateServiceInsert(service));
      });
      console.log(`✅ Generated ${services.length} service inserts`);
    }
  }

  // Write to file
  const outputContent = sql.join('\n');
  fs.writeFileSync(CONFIG.OUTPUT_FILE, outputContent);

  console.log('\n' + '='.repeat(60));
  console.log('✨ SQL GENERATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`\n📄 SQL file: ${CONFIG.OUTPUT_FILE}`);
  console.log(`📏 Size: ${(outputContent.length / 1024).toFixed(2)} KB`);
  console.log('\n💡 Next steps:');
  console.log('   1. Open Supabase SQL Editor');
  console.log(`   2. Copy contents of ${CONFIG.OUTPUT_FILE}`);
  console.log('   3. Paste and run in SQL Editor');
  console.log('='.repeat(60) + '\n');
}

// ============================================================================
// RUN
// ============================================================================

try {
  generateSQL();
} catch (error) {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
}
