import fs from 'fs';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  LANDMARKS_FILE: './docs/reference/mazunte-landmarks.json',
  INPUT_DIR: './data/outputs/final',
  OUTPUT_DIR: './data/outputs/with-coordinates'
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
  fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
}

// ============================================================================
// COORDINATE MATCHING
// ============================================================================

function loadLandmarks() {
  const landmarks = JSON.parse(fs.readFileSync(CONFIG.LANDMARKS_FILE, 'utf8'));

  // Create lookup map with name variations
  const lookupMap = new Map();

  landmarks.forEach(landmark => {
    // Add main name
    const mainKey = landmark.name.toLowerCase().trim();
    lookupMap.set(mainKey, landmark);

    // Add all aliases
    landmark.aliases.forEach(alias => {
      const aliasKey = alias.toLowerCase().trim();
      lookupMap.set(aliasKey, landmark);
    });
  });

  return lookupMap;
}

function findBestMatch(locationName, landmarkMap) {
  if (!locationName) return null;

  const searchTerm = locationName.toLowerCase().trim();

  // Direct match
  if (landmarkMap.has(searchTerm)) {
    return landmarkMap.get(searchTerm);
  }

  // Partial match - check if location contains landmark name
  for (const [key, landmark] of landmarkMap.entries()) {
    if (searchTerm.includes(key) || key.includes(searchTerm)) {
      return landmark;
    }
  }

  // Check for common patterns
  // "at X", "en X", "@ X"
  const atMatch = searchTerm.match(/(?:at|en|@)\s+([^,]+)/i);
  if (atMatch) {
    const venue = atMatch[1].trim();
    if (landmarkMap.has(venue)) {
      return landmarkMap.get(venue);
    }
  }

  return null;
}

function addCoordinates() {
  console.log('🗺️  Adding coordinates to entities...\n');

  // Load landmarks
  const landmarkMap = loadLandmarks();
  console.log(`📍 Loaded ${landmarkMap.size} landmark name variations\n`);

  // Load entities
  const events = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/events.json`, 'utf8'));
  const places = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/places.json`, 'utf8'));
  const services = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/services.json`, 'utf8'));

  let eventsMatched = 0;
  let placesMatched = 0;
  let servicesMatched = 0;

  // Add coordinates to events
  events.forEach(event => {
    const match = findBestMatch(event.location_name, landmarkMap);
    if (match) {
      event.lat = match.lat;
      event.lng = match.lng;
      event._matched_landmark = match.name; // For debugging
      eventsMatched++;
    }
  });

  // Add coordinates to places
  places.forEach(place => {
    // Try matching by place name first
    let match = findBestMatch(place.name, landmarkMap);
    if (!match) {
      // Try matching by location_name
      match = findBestMatch(place.location_name, landmarkMap);
    }

    if (match) {
      place.lat = match.lat;
      place.lng = match.lng;
      place._matched_landmark = match.name;
      placesMatched++;
    }
  });

  // Add coordinates to services
  services.forEach(service => {
    const match = findBestMatch(service.location_name, landmarkMap);
    if (match) {
      service.lat = match.lat;
      service.lng = match.lng;
      service._matched_landmark = match.name;
      servicesMatched++;
    }
  });

  // Save updated entities
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/events.json`, JSON.stringify(events, null, 2));
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/places.json`, JSON.stringify(places, null, 2));
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/services.json`, JSON.stringify(services, null, 2));

  console.log('✅ Coordinates added!\n');
  console.log('📊 Match Statistics:');
  console.log(`   🎉 Events:   ${eventsMatched} / ${events.length} (${Math.round(eventsMatched/events.length*100)}%)`);
  console.log(`   📍 Places:   ${placesMatched} / ${places.length} (${Math.round(placesMatched/places.length*100)}%)`);
  console.log(`   🛠️  Services: ${servicesMatched} / ${services.length} (${Math.round(servicesMatched/services.length*100)}%)`);
  console.log(`\n📁 Saved to: ${CONFIG.OUTPUT_DIR}/\n`);

  // Show some matches for verification
  console.log('🎯 Sample Matches:');
  events.filter(e => e._matched_landmark).slice(0, 5).forEach(e => {
    console.log(`   "${e.location_name}" → ${e._matched_landmark} (${e.lat}, ${e.lng})`);
  });

  // Show unmatched locations
  console.log('\n⚠️  Unmatched Locations:');
  const unmatchedEvents = events.filter(e => !e.lat && e.location_name).map(e => e.location_name);
  const unmatchedPlaces = places.filter(p => !p.lat && p.location_name).map(p => `${p.name} (${p.location_name})`);
  const unmatchedServices = services.filter(s => !s.lat && s.location_name).map(s => s.location_name);

  const allUnmatched = [...new Set([...unmatchedEvents, ...unmatchedPlaces, ...unmatchedServices])];
  allUnmatched.slice(0, 10).forEach(loc => {
    console.log(`   - ${loc}`);
  });

  if (allUnmatched.length > 10) {
    console.log(`   ... and ${allUnmatched.length - 10} more`);
  }
}

// ============================================================================
// RUN
// ============================================================================

addCoordinates();
