import fs from 'fs';

// ============================================================================
// CONFIGURATION
// ============================================================================

const PROFILE_ID = '520e75eb-b615-4d9a-a369-b218373c6c05';

const CONFIG = {
  INPUT_DIR: './data/outputs/deduplicated',
  OUTPUT_DIR: './data/outputs/final'
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
  fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
}

// ============================================================================
// SET PROFILE ID
// ============================================================================

function setProfileIds() {
  console.log(`🔧 Setting profile_id to: ${PROFILE_ID}\n`);

  // Load entities
  const events = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/events.json`, 'utf8'));
  const places = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/places.json`, 'utf8'));
  const services = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/services.json`, 'utf8'));

  // Set profile_id for events
  events.forEach(event => {
    event.profile_id = PROFILE_ID;
  });

  // Set profile_id for services
  services.forEach(service => {
    service.profile_id = PROFILE_ID;
  });

  // Places don't have profile_id in the schema, they have created_by
  places.forEach(place => {
    place.created_by = PROFILE_ID;
  });

  // Save updated entities
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/events.json`, JSON.stringify(events, null, 2));
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/places.json`, JSON.stringify(places, null, 2));
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/services.json`, JSON.stringify(services, null, 2));

  console.log('✅ Profile IDs set!\n');
  console.log('📊 Updated:');
  console.log(`   🎉 ${events.length} events → profile_id set`);
  console.log(`   📍 ${places.length} places → created_by set`);
  console.log(`   🛠️  ${services.length} services → profile_id set`);
  console.log(`\n📁 Saved to: ${CONFIG.OUTPUT_DIR}/\n`);
}

// ============================================================================
// RUN
// ============================================================================

setProfileIds();
