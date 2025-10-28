import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  EXTRACTED_DIR: './data/extracted',
  FINAL_DIR: './data/final',
  RAW_DIR: './data/raw',
  PROFILE_ID: process.env.SYSTEM_PROFILE_ID || '520e75eb-b615-4d9a-a369-b218373c6c05',
  LANDMARKS_FILE: './data/outputs/Mazunte_Landmarks_Google_API.json'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function loadEntities(type) {
  const file = `${CONFIG.EXTRACTED_DIR}/${type}.json`;
  if (!fs.existsSync(file)) {
    console.log(`⚠️  No ${type}.json found, skipping...`);
    return [];
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveEntities(type, entities) {
  const dir = CONFIG.FINAL_DIR;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const file = `${dir}/${type}.json`;
  fs.writeFileSync(file, JSON.stringify(entities, null, 2));
  console.log(`✅ Saved ${entities.length} ${type} to ${file}`);
}

function loadLandmarks() {
  if (!fs.existsSync(CONFIG.LANDMARKS_FILE)) {
    console.log('⚠️  No landmarks file found, skipping coordinate mapping');
    return [];
  }
  const data = JSON.parse(fs.readFileSync(CONFIG.LANDMARKS_FILE, 'utf8'));
  return data;
}

function loadMessages() {
  const files = fs.readdirSync(CONFIG.RAW_DIR)
    .filter(f => f.startsWith('messages_') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.log('⚠️  No message files found in data/raw/, skipping media linking');
    return [];
  }

  const messagesFile = `${CONFIG.RAW_DIR}/${files[0]}`;
  console.log(`📂 Loading messages from: ${files[0]}`);
  return JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
}

// ============================================================================
// MEDIA LINKING
// ============================================================================

function linkMediaToEntities(entities, messages) {
  console.log(`\n🔗 Linking media URLs...`);

  // Create media lookup map
  const mediaMap = new Map();
  messages.forEach(msg => {
    if (msg.media_url) {
      mediaMap.set(msg.id, msg.media_url);
    }
  });

  console.log(`   Found ${mediaMap.size} messages with media`);

  let linked = 0;

  // Link media to entities
  entities.forEach(entity => {
    if (!entity.original_message_id) return;

    const mediaUrl = mediaMap.get(entity.original_message_id);
    if (mediaUrl) {
      // Events use image_url, Places use images array, Services use image_url
      if (entity.name) {
        // It's a place
        entity.images = entity.images || [];
        if (!entity.images.includes(mediaUrl)) {
          entity.images.push(mediaUrl);
        }
      } else {
        // It's an event or service
        entity.image_url = mediaUrl;
      }
      linked++;
    }
  });

  console.log(`   Linked media to ${linked}/${entities.length} entities`);
  return entities;
}

// ============================================================================
// DEDUPLICATION
// ============================================================================

function deduplicateEntities(entities, nameField = 'title') {
  console.log(`\n🔍 Deduplicating ${entities.length} entities...`);

  const seen = new Map();
  const deduplicated = [];

  for (const entity of entities) {
    const name = entity[nameField]?.toLowerCase().trim();
    if (!name) {
      deduplicated.push(entity);
      continue;
    }

    if (seen.has(name)) {
      // Merge with existing
      const existing = seen.get(name);

      // Keep non-null values, prefer longer descriptions
      Object.keys(entity).forEach(key => {
        if (entity[key] && !existing[key]) {
          existing[key] = entity[key];
        } else if (key === 'description' && entity[key] && entity[key].length > (existing[key]?.length || 0)) {
          existing[key] = entity[key];
        }
      });
    } else {
      seen.set(name, entity);
      deduplicated.push(entity);
    }
  }

  console.log(`   Reduced from ${entities.length} to ${deduplicated.length} (removed ${entities.length - deduplicated.length} duplicates)`);
  return deduplicated;
}

// ============================================================================
// PROFILE ASSIGNMENT
// ============================================================================

function assignProfileIds(entities) {
  console.log(`\n👤 Assigning profile IDs...`);
  return entities.map(e => ({
    ...e,
    profile_id: CONFIG.PROFILE_ID
  }));
}

// ============================================================================
// COORDINATE MAPPING
// ============================================================================

function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .trim();
}

function matchLocation(locationName, landmarks) {
  if (!locationName) return null;

  const normalized = normalizeString(locationName);

  // Find best match
  for (const landmark of landmarks) {
    const landmarkName = normalizeString(landmark.name);

    // Exact match
    if (normalized === landmarkName) {
      return { lat: landmark.lat, lng: landmark.lng };
    }

    // Contains match
    if (normalized.includes(landmarkName) || landmarkName.includes(normalized)) {
      return { lat: landmark.lat, lng: landmark.lng };
    }
  }

  return null;
}

function addCoordinates(entities, landmarks, locationField = 'location_name') {
  console.log(`\n📍 Adding coordinates...`);
  let matched = 0;

  const updated = entities.map(entity => {
    if (!entity[locationField]) {
      return entity;
    }

    const coords = matchLocation(entity[locationField], landmarks);
    if (coords) {
      matched++;
      return {
        ...entity,
        lat: coords.lat,
        lng: coords.lng
      };
    }

    return entity;
  });

  console.log(`   Matched ${matched}/${entities.length} entities to landmarks`);
  return updated;
}

// ============================================================================
// MAIN PROCESSING
// ============================================================================

async function processEntities() {
  console.log('🚀 Processing extracted entities...\n');
  console.log('='.repeat(60));

  // Load messages for media linking
  const messages = loadMessages();
  console.log(`📨 Loaded ${messages.length} messages`);

  // Load landmarks
  const landmarks = loadLandmarks();
  console.log(`📍 Loaded ${landmarks.length} landmarks for coordinate mapping\n`);

  // Process Events
  console.log('Processing EVENTS...');
  let events = loadEntities('events');
  if (events.length > 0) {
    events = linkMediaToEntities(events, messages);
    events = deduplicateEntities(events, 'title');
    events = assignProfileIds(events);
    events = addCoordinates(events, landmarks, 'location_name');
    // Add default fields
    events = events.map(e => ({
      ...e,
      city_id: 'mazunte',
      approval_status: 'pending',
      lat: e.lat || null,
      lng: e.lng || null
    }));
    saveEntities('events', events);
  }

  // Process Places
  console.log('\nProcessing PLACES...');
  let places = loadEntities('places');
  if (places.length > 0) {
    places = linkMediaToEntities(places, messages);
    places = deduplicateEntities(places, 'name');
    places = addCoordinates(places, landmarks, 'location_name');
    // Add default fields
    places = places.map(p => ({
      ...p,
      city_id: 'mazunte',
      verified: false,
      lat: p.lat || null,
      lng: p.lng || null
    }));
    saveEntities('places', places);
  }

  // Process Services
  console.log('\nProcessing SERVICES...');
  let services = loadEntities('services');
  if (services.length > 0) {
    services = linkMediaToEntities(services, messages);
    services = deduplicateEntities(services, 'title');
    services = assignProfileIds(services);
    services = addCoordinates(services, landmarks, 'location_name');
    // Add default fields
    services = services.map(s => ({
      ...s,
      city_id: 'mazunte',
      approval_status: 'pending',
      lat: s.lat || null,
      lng: s.lng || null
    }));
    saveEntities('services', services);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✨ PROCESSING COMPLETE!');
  console.log('='.repeat(60));
  console.log(`\n📊 Final counts:`);
  console.log(`   🎉 Events:   ${events.length}`);
  console.log(`   📍 Places:   ${places.length}`);
  console.log(`   🛠️  Services: ${services.length}`);
  console.log(`\n📁 Processed data saved to: ${CONFIG.FINAL_DIR}/`);
  console.log('='.repeat(60) + '\n');
}

// ============================================================================
// RUN
// ============================================================================

processEntities().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
