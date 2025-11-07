const fs = require('fs');
const path = require('path');

// Helper function to escape strings for SQL
function sqlString(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') return value.toString();

  // Use dollar-quoted strings to handle quotes and special chars
  const str = value.toString().trim();
  // Check if string contains dollar signs - if so, use different delimiter
  if (str.includes('$$')) {
    return `$str$${str}$str$`;
  }
  return `$$${str}$$`;
}

// Helper function to create PostgreSQL array
function sqlArray(arr) {
  if (!arr || arr.length === 0) return 'ARRAY[]::TEXT[]';
  const items = arr.map(item => `'${item.replace(/'/g, "''")}'`).join(', ');
  return `ARRAY[${items}]`;
}

// Generate Places SQL
function generatePlacesSql() {
  const places = JSON.parse(fs.readFileSync('data/final/places.json'));

  const complete = places.filter(p => p.description && p.contact_whatsapp);
  const partial = places.filter(p => !p.description || !p.contact_whatsapp);

  // Complete places
  let sql = `-- PLACES: Complete Records (${complete.length} total)\n`;
  sql += `-- These places have descriptions and contact information\n\n`;
  sql += `BEGIN;\n\n`;

  complete.forEach((p, idx) => {
    // Use category if available, otherwise capitalize type as fallback
    const category = p.category || (p.type ? p.type.charAt(0).toUpperCase() + p.type.slice(1) : 'Venue');

    sql += `-- ${idx + 1}. ${p.name}\n`;
    sql += `INSERT INTO places (\n`;
    sql += `  id, name, type, category, description, location_name, hours, price_range,\n`;
    sql += `  contact_whatsapp, contact_phone, contact_instagram, contact_email,\n`;
    sql += `  tags, images, city_id, verified, lat, lng,\n`;
    sql += `  created_at, updated_at, eco_conscious, featured, hidden_by_reports\n`;
    sql += `) VALUES (\n`;
    sql += `  '${p.id}',\n`;
    sql += `  ${sqlString(p.name)},\n`;
    sql += `  ${sqlString(p.type)},\n`;
    sql += `  ${sqlString(category)},\n`;
    sql += `  ${sqlString(p.description)},\n`;
    sql += `  ${sqlString(p.location_name)},\n`;
    sql += `  ${sqlString(p.hours)},\n`;
    sql += `  ${sqlString(p.price_range)},\n`;
    sql += `  ${sqlString(p.contact_whatsapp)},\n`;
    sql += `  ${sqlString(p.contact_phone)},\n`;
    sql += `  ${sqlString(p.contact_instagram)},\n`;
    sql += `  ${sqlString(p.contact_email)},\n`;
    sql += `  ${sqlArray(p.tags)},\n`;
    sql += `  ${sqlArray(p.images)},\n`;
    sql += `  ${sqlString(p.city_id)},\n`;
    sql += `  ${p.verified === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${p.lat || 'NULL'},\n`;
    sql += `  ${p.lng || 'NULL'},\n`;
    sql += `  NOW(),\n`;
    sql += `  NOW(),\n`;
    sql += `  ${p.eco_conscious === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${p.featured === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${p.hidden_by_reports === true ? 'TRUE' : 'FALSE'}\n`;
    sql += `);\n\n`;
  });

  sql += `COMMIT;\n\n`;
  sql += `-- Verify inserts:\n`;
  sql += `SELECT COUNT(*) FROM places WHERE id IN (\n`;
  sql += complete.map(p => `  '${p.id}'`).join(',\n');
  sql += `\n);\n`;

  fs.writeFileSync('data/final/inserts/04_places_complete.sql', sql);
  console.log(`✅ Created 04_places_complete.sql (${complete.length} records)`);

  // Partial places
  sql = `-- PLACES: Partial Records (${partial.length} total)\n`;
  sql += `-- These places have basic info but missing descriptions or contact details\n\n`;
  sql += `BEGIN;\n\n`;

  partial.forEach((p, idx) => {
    // Use category if available, otherwise capitalize type as fallback
    const category = p.category || (p.type ? p.type.charAt(0).toUpperCase() + p.type.slice(1) : 'Venue');

    sql += `-- ${idx + 1}. ${p.name}\n`;
    sql += `INSERT INTO places (\n`;
    sql += `  id, name, type, category, description, location_name, hours, price_range,\n`;
    sql += `  contact_whatsapp, contact_phone, contact_instagram, contact_email,\n`;
    sql += `  tags, images, city_id, verified, lat, lng,\n`;
    sql += `  created_at, updated_at, eco_conscious, featured, hidden_by_reports\n`;
    sql += `) VALUES (\n`;
    sql += `  '${p.id}',\n`;
    sql += `  ${sqlString(p.name)},\n`;
    sql += `  ${sqlString(p.type)},\n`;
    sql += `  ${sqlString(category)},\n`;
    sql += `  ${sqlString(p.description)},\n`;
    sql += `  ${sqlString(p.location_name)},\n`;
    sql += `  ${sqlString(p.hours)},\n`;
    sql += `  ${sqlString(p.price_range)},\n`;
    sql += `  ${sqlString(p.contact_whatsapp)},\n`;
    sql += `  ${sqlString(p.contact_phone)},\n`;
    sql += `  ${sqlString(p.contact_instagram)},\n`;
    sql += `  ${sqlString(p.contact_email)},\n`;
    sql += `  ${sqlArray(p.tags)},\n`;
    sql += `  ${sqlArray(p.images)},\n`;
    sql += `  ${sqlString(p.city_id)},\n`;
    sql += `  ${p.verified === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${p.lat || 'NULL'},\n`;
    sql += `  ${p.lng || 'NULL'},\n`;
    sql += `  NOW(),\n`;
    sql += `  NOW(),\n`;
    sql += `  ${p.eco_conscious === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${p.featured === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${p.hidden_by_reports === true ? 'TRUE' : 'FALSE'}\n`;
    sql += `);\n\n`;
  });

  sql += `COMMIT;\n`;

  fs.writeFileSync('data/final/inserts/05_places_partial.sql', sql);
  console.log(`✅ Created 05_places_partial.sql (${partial.length} records)`);
}

// Generate Events SQL
function generateEventsSql() {
  const events = JSON.parse(fs.readFileSync('data/final/events.json'));

  const complete = events.filter(e => e.description && e.date && e.time && e.location_name);
  const partial = events.filter(e => e.description && (e.date || e.time) && !complete.includes(e));
  const sparse = events.filter(e => !complete.includes(e) && !partial.includes(e));

  // Complete events
  let sql = `-- EVENTS: Complete Records (${complete.length} total)\n`;
  sql += `-- These events have full information: description, date, time, location\n\n`;
  sql += `BEGIN;\n\n`;

  complete.forEach((e, idx) => {
    sql += `-- ${idx + 1}. ${e.title}\n`;
    sql += `INSERT INTO events (\n`;
    sql += `  id, title, profile_id, description, date, time, location_name,\n`;
    sql += `  category, price, organizer_name, contact_whatsapp, contact_phone,\n`;
    sql += `  contact_instagram, contact_email, image_url, city_id, approval_status,\n`;
    sql += `  lat, lng, eco_conscious, featured, cancelled, hidden_by_reports,\n`;
    sql += `  created_at, updated_at\n`;
    sql += `) VALUES (\n`;
    sql += `  '${e.id}',\n`;
    sql += `  ${sqlString(e.title)},\n`;
    sql += `  ${sqlString(e.profile_id)},\n`;
    sql += `  ${sqlString(e.description)},\n`;
    sql += `  ${e.date ? `'${e.date}'` : 'NULL'},\n`;
    sql += `  ${e.time ? `'${e.time}'` : 'NULL'},\n`;
    sql += `  ${sqlString(e.location_name)},\n`;
    sql += `  ${sqlString(e.category)},\n`;
    sql += `  ${sqlString(e.price)},\n`;
    sql += `  ${sqlString(e.organizer_name)},\n`;
    sql += `  ${sqlString(e.contact_whatsapp)},\n`;
    sql += `  ${sqlString(e.contact_phone)},\n`;
    sql += `  ${sqlString(e.contact_instagram)},\n`;
    sql += `  ${sqlString(e.contact_email)},\n`;
    sql += `  ${sqlString(e.image_url)},\n`;
    sql += `  ${sqlString(e.city_id)},\n`;
    sql += `  ${sqlString(e.approval_status)},\n`;
    sql += `  ${e.lat || 'NULL'},\n`;
    sql += `  ${e.lng || 'NULL'},\n`;
    sql += `  ${e.eco_conscious === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${e.featured === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${e.cancelled === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${e.hidden_by_reports === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  NOW(),\n`;
    sql += `  NOW()\n`;
    sql += `);\n\n`;
  });

  sql += `COMMIT;\n`;
  fs.writeFileSync('data/final/inserts/06_events_complete.sql', sql);
  console.log(`✅ Created 06_events_complete.sql (${complete.length} records)`);

  // Partial events
  sql = `-- EVENTS: Partial Records (${partial.length} total)\n`;
  sql += `-- These events have description but missing some date/time/location info\n\n`;
  sql += `BEGIN;\n\n`;

  partial.forEach((e, idx) => {
    sql += `-- ${idx + 1}. ${e.title}\n`;
    sql += `INSERT INTO events (\n`;
    sql += `  id, title, profile_id, description, date, time, location_name,\n`;
    sql += `  category, price, organizer_name, contact_whatsapp, contact_phone,\n`;
    sql += `  contact_instagram, contact_email, image_url, city_id, approval_status,\n`;
    sql += `  lat, lng, eco_conscious, featured, cancelled, hidden_by_reports,\n`;
    sql += `  created_at, updated_at\n`;
    sql += `) VALUES (\n`;
    sql += `  '${e.id}',\n`;
    sql += `  ${sqlString(e.title)},\n`;
    sql += `  ${sqlString(e.profile_id)},\n`;
    sql += `  ${sqlString(e.description)},\n`;
    sql += `  ${e.date ? `'${e.date}'` : 'NULL'},\n`;
    sql += `  ${e.time ? `'${e.time}'` : 'NULL'},\n`;
    sql += `  ${sqlString(e.location_name)},\n`;
    sql += `  ${sqlString(e.category)},\n`;
    sql += `  ${sqlString(e.price)},\n`;
    sql += `  ${sqlString(e.organizer_name)},\n`;
    sql += `  ${sqlString(e.contact_whatsapp)},\n`;
    sql += `  ${sqlString(e.contact_phone)},\n`;
    sql += `  ${sqlString(e.contact_instagram)},\n`;
    sql += `  ${sqlString(e.contact_email)},\n`;
    sql += `  ${sqlString(e.image_url)},\n`;
    sql += `  ${sqlString(e.city_id)},\n`;
    sql += `  ${sqlString(e.approval_status)},\n`;
    sql += `  ${e.lat || 'NULL'},\n`;
    sql += `  ${e.lng || 'NULL'},\n`;
    sql += `  ${e.eco_conscious === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${e.featured === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${e.cancelled === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${e.hidden_by_reports === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  NOW(),\n`;
    sql += `  NOW()\n`;
    sql += `);\n\n`;
  });

  sql += `COMMIT;\n`;
  fs.writeFileSync('data/final/inserts/07_events_partial.sql', sql);
  console.log(`✅ Created 07_events_partial.sql (${partial.length} records)`);

  // Sparse events
  sql = `-- EVENTS: Sparse Records (${sparse.length} total)\n`;
  sql += `-- These events have minimal information\n\n`;
  sql += `BEGIN;\n\n`;

  sparse.forEach((e, idx) => {
    sql += `-- ${idx + 1}. ${e.title}\n`;
    sql += `INSERT INTO events (\n`;
    sql += `  id, title, profile_id, description, date, time, location_name,\n`;
    sql += `  category, price, organizer_name, contact_whatsapp, contact_phone,\n`;
    sql += `  contact_instagram, contact_email, image_url, city_id, approval_status,\n`;
    sql += `  lat, lng, eco_conscious, featured, cancelled, hidden_by_reports,\n`;
    sql += `  created_at, updated_at\n`;
    sql += `) VALUES (\n`;
    sql += `  '${e.id}',\n`;
    sql += `  ${sqlString(e.title)},\n`;
    sql += `  ${sqlString(e.profile_id)},\n`;
    sql += `  ${sqlString(e.description)},\n`;
    sql += `  ${e.date ? `'${e.date}'` : 'NULL'},\n`;
    sql += `  ${e.time ? `'${e.time}'` : 'NULL'},\n`;
    sql += `  ${sqlString(e.location_name)},\n`;
    sql += `  ${sqlString(e.category)},\n`;
    sql += `  ${sqlString(e.price)},\n`;
    sql += `  ${sqlString(e.organizer_name)},\n`;
    sql += `  ${sqlString(e.contact_whatsapp)},\n`;
    sql += `  ${sqlString(e.contact_phone)},\n`;
    sql += `  ${sqlString(e.contact_instagram)},\n`;
    sql += `  ${sqlString(e.contact_email)},\n`;
    sql += `  ${sqlString(e.image_url)},\n`;
    sql += `  ${sqlString(e.city_id)},\n`;
    sql += `  ${sqlString(e.approval_status)},\n`;
    sql += `  ${e.lat || 'NULL'},\n`;
    sql += `  ${e.lng || 'NULL'},\n`;
    sql += `  ${e.eco_conscious === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${e.featured === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${e.cancelled === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${e.hidden_by_reports === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  NOW(),\n`;
    sql += `  NOW()\n`;
    sql += `);\n\n`;
  });

  sql += `COMMIT;\n`;
  fs.writeFileSync('data/final/inserts/08_events_sparse.sql', sql);
  console.log(`✅ Created 08_events_sparse.sql (${sparse.length} records)`);
}

// Generate Services SQL
function generateServicesSql() {
  const services = JSON.parse(fs.readFileSync('data/final/services.json'));

  const complete = services.filter(s => s.description && s.category && (s.price_type || s.price_amount));
  const partial = services.filter(s => (s.description || s.category) && !complete.includes(s));
  const sparse = services.filter(s => !complete.includes(s) && !partial.includes(s));

  // Complete services
  let sql = `-- SERVICES: Complete Records (${complete.length} total)\n`;
  sql += `-- These services have description, category, and pricing info\n\n`;
  sql += `BEGIN;\n\n`;

  complete.forEach((s, idx) => {
    sql += `-- ${idx + 1}. ${s.title}\n`;
    sql += `INSERT INTO services (\n`;
    sql += `  id, title, profile_id, description, category, price_type, price_amount,\n`;
    sql += `  price_currency, location_name, contact_whatsapp, contact_phone,\n`;
    sql += `  contact_instagram, city_id, approval_status, lat, lng,\n`;
    sql += `  available, verified, eco_conscious, featured, hidden_by_reports,\n`;
    sql += `  created_at, updated_at\n`;
    sql += `) VALUES (\n`;
    sql += `  '${s.id}',\n`;
    sql += `  ${sqlString(s.title)},\n`;
    sql += `  ${sqlString(s.profile_id)},\n`;
    sql += `  ${sqlString(s.description)},\n`;
    sql += `  ${sqlString(s.category)},\n`;
    sql += `  ${sqlString(s.price_type)},\n`;
    sql += `  ${s.price_amount || 'NULL'},\n`;
    sql += `  ${sqlString(s.price_currency)},\n`;
    sql += `  ${sqlString(s.location_name)},\n`;
    sql += `  ${sqlString(s.contact_whatsapp)},\n`;
    sql += `  ${sqlString(s.contact_phone)},\n`;
    sql += `  ${sqlString(s.contact_instagram)},\n`;
    sql += `  ${sqlString(s.city_id)},\n`;
    sql += `  ${sqlString(s.approval_status)},\n`;
    sql += `  ${s.lat || 'NULL'},\n`;
    sql += `  ${s.lng || 'NULL'},\n`;
    sql += `  ${s.available === false ? 'FALSE' : 'TRUE'},\n`;
    sql += `  ${s.verified === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${s.eco_conscious === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${s.featured === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${s.hidden_by_reports === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  NOW(),\n`;
    sql += `  NOW()\n`;
    sql += `);\n\n`;
  });

  sql += `COMMIT;\n`;
  fs.writeFileSync('data/final/inserts/09_services_complete.sql', sql);
  console.log(`✅ Created 09_services_complete.sql (${complete.length} records)`);

  // Partial services
  sql = `-- SERVICES: Partial Records (${partial.length} total)\n`;
  sql += `-- These services have some info but missing description or pricing\n\n`;
  sql += `BEGIN;\n\n`;

  partial.forEach((s, idx) => {
    sql += `-- ${idx + 1}. ${s.title}\n`;
    sql += `INSERT INTO services (\n`;
    sql += `  id, title, profile_id, description, category, price_type, price_amount,\n`;
    sql += `  price_currency, location_name, contact_whatsapp, contact_phone,\n`;
    sql += `  contact_instagram, city_id, approval_status, lat, lng,\n`;
    sql += `  available, verified, eco_conscious, featured, hidden_by_reports,\n`;
    sql += `  created_at, updated_at\n`;
    sql += `) VALUES (\n`;
    sql += `  '${s.id}',\n`;
    sql += `  ${sqlString(s.title)},\n`;
    sql += `  ${sqlString(s.profile_id)},\n`;
    sql += `  ${sqlString(s.description)},\n`;
    sql += `  ${sqlString(s.category)},\n`;
    sql += `  ${sqlString(s.price_type)},\n`;
    sql += `  ${s.price_amount || 'NULL'},\n`;
    sql += `  ${sqlString(s.price_currency)},\n`;
    sql += `  ${sqlString(s.location_name)},\n`;
    sql += `  ${sqlString(s.contact_whatsapp)},\n`;
    sql += `  ${sqlString(s.contact_phone)},\n`;
    sql += `  ${sqlString(s.contact_instagram)},\n`;
    sql += `  ${sqlString(s.city_id)},\n`;
    sql += `  ${sqlString(s.approval_status)},\n`;
    sql += `  ${s.lat || 'NULL'},\n`;
    sql += `  ${s.lng || 'NULL'},\n`;
    sql += `  ${s.available === false ? 'FALSE' : 'TRUE'},\n`;
    sql += `  ${s.verified === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${s.eco_conscious === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${s.featured === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${s.hidden_by_reports === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  NOW(),\n`;
    sql += `  NOW()\n`;
    sql += `);\n\n`;
  });

  sql += `COMMIT;\n`;
  fs.writeFileSync('data/final/inserts/10_services_partial.sql', sql);
  console.log(`✅ Created 10_services_partial.sql (${partial.length} records)`);

  // Sparse services
  sql = `-- SERVICES: Sparse Records (${sparse.length} total)\n`;
  sql += `-- These services have minimal information\n\n`;
  sql += `BEGIN;\n\n`;

  sparse.forEach((s, idx) => {
    sql += `-- ${idx + 1}. ${s.title}\n`;
    sql += `INSERT INTO services (\n`;
    sql += `  id, title, profile_id, description, category, price_type, price_amount,\n`;
    sql += `  price_currency, location_name, contact_whatsapp, contact_phone,\n`;
    sql += `  contact_instagram, city_id, approval_status, lat, lng,\n`;
    sql += `  available, verified, eco_conscious, featured, hidden_by_reports,\n`;
    sql += `  created_at, updated_at\n`;
    sql += `) VALUES (\n`;
    sql += `  '${s.id}',\n`;
    sql += `  ${sqlString(s.title)},\n`;
    sql += `  ${sqlString(s.profile_id)},\n`;
    sql += `  ${sqlString(s.description)},\n`;
    sql += `  ${sqlString(s.category)},\n`;
    sql += `  ${sqlString(s.price_type)},\n`;
    sql += `  ${s.price_amount || 'NULL'},\n`;
    sql += `  ${sqlString(s.price_currency)},\n`;
    sql += `  ${sqlString(s.location_name)},\n`;
    sql += `  ${sqlString(s.contact_whatsapp)},\n`;
    sql += `  ${sqlString(s.contact_phone)},\n`;
    sql += `  ${sqlString(s.contact_instagram)},\n`;
    sql += `  ${sqlString(s.city_id)},\n`;
    sql += `  ${sqlString(s.approval_status)},\n`;
    sql += `  ${s.lat || 'NULL'},\n`;
    sql += `  ${s.lng || 'NULL'},\n`;
    sql += `  ${s.available === false ? 'FALSE' : 'TRUE'},\n`;
    sql += `  ${s.verified === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${s.eco_conscious === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${s.featured === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  ${s.hidden_by_reports === true ? 'TRUE' : 'FALSE'},\n`;
    sql += `  NOW(),\n`;
    sql += `  NOW()\n`;
    sql += `);\n\n`;
  });

  sql += `COMMIT;\n`;
  fs.writeFileSync('data/final/inserts/11_services_sparse.sql', sql);
  console.log(`✅ Created 11_services_sparse.sql (${sparse.length} records)`);
}

// Main execution
console.log('🚀 Generating SQL insert files...\n');
generatePlacesSql();
generateEventsSql();
generateServicesSql();
console.log('\n✨ All SQL files generated successfully!');
console.log('\n📁 Files created in: data/final/inserts/');
console.log('\n📖 Test files first (01-03), then run batches (04-11) in order.');
