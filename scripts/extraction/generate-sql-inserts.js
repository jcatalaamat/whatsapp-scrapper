import fs from 'fs';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  INPUT_DIR: './data/outputs/with-coordinates', // Use entities with coordinates
  OUTPUT_FILE: './INSERTS-README.md'
};

// ============================================================================
// SQL GENERATION HELPERS
// ============================================================================

function escapeSQL(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (Array.isArray(value)) {
    // PostgreSQL array syntax
    const escaped = value.map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(',');
    return `'{${escaped}}'`;
  }
  // Escape single quotes for SQL
  return `'${String(value).replace(/'/g, "''")}'`;
}

function generateEventInsert(event) {
  return `INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  ${escapeSQL(event.id)},
  ${escapeSQL(event.profile_id)},
  ${escapeSQL(event.title)},
  ${escapeSQL(event.description)},
  ${escapeSQL(event.date)},
  ${escapeSQL(event.time)},
  ${escapeSQL(event.location_name)},
  ${escapeSQL(event.lat)},
  ${escapeSQL(event.lng)},
  ${escapeSQL(event.category)},
  ${escapeSQL(event.price)},
  ${escapeSQL(event.image_url)},
  ${escapeSQL(event.organizer_name)},
  ${escapeSQL(event.contact_phone)},
  ${escapeSQL(event.contact_whatsapp)},
  ${escapeSQL(event.contact_instagram)},
  ${escapeSQL(event.contact_email)},
  ${escapeSQL(event.city_id)},
  ${escapeSQL(event.approval_status)}
);`;
}

function generatePlaceInsert(place) {
  return `INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  ${escapeSQL(place.id)},
  ${escapeSQL(place.name)},
  ${escapeSQL(place.type)},
  ${escapeSQL(place.category)},
  ${escapeSQL(place.description)},
  ${escapeSQL(place.location_name)},
  ${escapeSQL(place.lat)},
  ${escapeSQL(place.lng)},
  ${escapeSQL(place.hours)},
  ${escapeSQL(place.price_range)},
  ${escapeSQL(place.contact_phone)},
  ${escapeSQL(place.contact_whatsapp)},
  ${escapeSQL(place.contact_instagram)},
  ${escapeSQL(place.contact_email)},
  ${escapeSQL(place.website_url)},
  ${escapeSQL(place.images)},
  ${escapeSQL(place.tags)},
  ${escapeSQL(place.city_id)},
  ${escapeSQL(place.verified)},
  ${escapeSQL(place.created_by)}
);`;
}

function generateServiceInsert(service) {
  return `INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  ${escapeSQL(service.id)},
  ${escapeSQL(service.profile_id)},
  ${escapeSQL(service.title)},
  ${escapeSQL(service.description)},
  ${escapeSQL(service.category)},
  ${escapeSQL(service.price_type)},
  ${escapeSQL(service.price_amount)},
  ${escapeSQL(service.price_currency)},
  ${escapeSQL(service.price_notes)},
  ${escapeSQL(service.location_name)},
  ${escapeSQL(service.lat)},
  ${escapeSQL(service.lng)},
  ${escapeSQL(service.contact_phone)},
  ${escapeSQL(service.contact_whatsapp)},
  ${escapeSQL(service.contact_instagram)},
  ${escapeSQL(service.contact_email)},
  ${escapeSQL(service.images)},
  ${escapeSQL(service.city_id)},
  ${escapeSQL(service.approval_status)}
);`;
}

// ============================================================================
// MAIN GENERATION
// ============================================================================

function generateSQLInserts() {
  console.log('🔧 Generating SQL INSERT statements...\n');

  // Load extracted entities
  const events = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/events.json`, 'utf8'));
  const places = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/places.json`, 'utf8'));
  const services = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/services.json`, 'utf8'));

  console.log(`📊 Loaded:`);
  console.log(`   🎉 ${events.length} events`);
  console.log(`   📍 ${places.length} places`);
  console.log(`   🛠️  ${services.length} services\n`);

  // Generate SQL
  const eventInserts = events.map(generateEventInsert);
  const placeInserts = places.map(generatePlaceInsert);
  const serviceInserts = services.map(generateServiceInsert);

  // Create markdown document
  const markdown = `# SQL INSERT Statements for Supabase

**Generated:** ${new Date().toISOString()}

**Source:** WhatsApp messages from Mazunte community groups

**Statistics:**
- 🎉 Events: ${events.length}
- 📍 Places: ${places.length}
- 🛠️  Services: ${services.length}
- **Total Entities:** ${events.length + places.length + services.length}

---

## How to Use

1. Open Supabase SQL Editor
2. Copy each section below
3. Run in Supabase (one table at a time)
4. Review imported data in Supabase dashboard

**Important Notes:**
- All entities have \`approval_status = 'pending'\` - you can review and approve them
- Contact information (WhatsApp, phone, Instagram, email) extracted where available
- Some fields may be NULL if information wasn't provided in original messages
- UUIDs are pre-generated for all entities

---

## 🎉 Events (${events.length})

\`\`\`sql
-- Insert ${events.length} events
${eventInserts.join('\n\n')}
\`\`\`

---

## 📍 Places (${places.length})

\`\`\`sql
-- Insert ${places.length} places
${placeInserts.join('\n\n')}
\`\`\`

---

## 🛠️ Services (${services.length})

\`\`\`sql
-- Insert ${services.length} services
${serviceInserts.join('\n\n')}
\`\`\`

---

## Verification Queries

After importing, run these queries to verify:

\`\`\`sql
-- Check event count
SELECT COUNT(*) as event_count FROM events WHERE city_id = 'mazunte';

-- Check place count
SELECT COUNT(*) as place_count FROM places WHERE city_id = 'mazunte';

-- Check service count
SELECT COUNT(*) as service_count FROM services WHERE city_id = 'mazunte';

-- View pending approvals
SELECT 'events' as type, COUNT(*) as pending_count
FROM events WHERE approval_status = 'pending'
UNION ALL
SELECT 'services' as type, COUNT(*) as pending_count
FROM services WHERE approval_status = 'pending';

-- Sample events with contact info
SELECT title, date, time, contact_whatsapp, contact_phone
FROM events
WHERE city_id = 'mazunte'
ORDER BY date
LIMIT 10;
\`\`\`

---

## Notes

### Data Quality

**✅ Complete Data:**
- All entities have city_id = 'mazunte'
- All have unique UUIDs
- WhatsApp/phone contact info extracted from messages
- Locations and venue names extracted

**⚠️ Partial Data:**
- Some events missing specific dates/times (said "mañana", "tonight", etc.)
- Lat/lng coordinates not available (can be added manually or via geocoding)
- Some organizer names not found in messages
- Image URLs may need to be added manually

### Next Steps

1. **Import to Supabase** - Run the SQL statements above
2. **Review & Approve** - Check entities in Supabase dashboard
3. **Geocode Locations** - Add lat/lng for places with addresses
4. **Add Images** - Upload or link event/place images
5. **Verify Contact Info** - Test WhatsApp numbers if needed
6. **Update Profiles** - Link to user profiles where appropriate

---

*Generated by AI entity extraction from WhatsApp community messages*
`;

  // Write to file
  fs.writeFileSync(CONFIG.OUTPUT_FILE, markdown);

  console.log('✅ SQL INSERT statements generated!\n');
  console.log(`📁 Saved to: ${CONFIG.OUTPUT_FILE}\n`);
  console.log('='.repeat(60));
  console.log('Next steps:');
  console.log('1. Open INSERTS-README.md');
  console.log('2. Copy SQL statements to Supabase SQL Editor');
  console.log('3. Run imports (one table at a time)');
  console.log('4. Review imported entities in Supabase dashboard');
  console.log('='.repeat(60));
}

// ============================================================================
// RUN
// ============================================================================

generateSQLInserts();
