import fs from 'fs';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  INPUT_DIR: './data/outputs/full-with-media',
  OUTPUT_DIR: './data/outputs/deduplicated'
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
  fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
}

// ============================================================================
// DEDUPLICATION LOGIC
// ============================================================================

function deduplicatePlaces(places) {
  const placesByName = new Map();
  const duplicates = [];

  places.forEach(place => {
    const key = place.name.toLowerCase().trim();

    if (placesByName.has(key)) {
      // Found duplicate - merge it
      const existing = placesByName.get(key);

      // Merge images
      if (place.images && place.images.length > 0) {
        existing.images = existing.images || [];
        place.images.forEach(img => {
          if (!existing.images.includes(img)) {
            existing.images.push(img);
          }
        });
      }

      // Prefer more complete data
      if (place.description && (!existing.description || place.description.length > existing.description.length)) {
        existing.description = place.description;
      }

      if (place.contact_phone && !existing.contact_phone) {
        existing.contact_phone = place.contact_phone;
      }

      if (place.contact_whatsapp && !existing.contact_whatsapp) {
        existing.contact_whatsapp = place.contact_whatsapp;
      }

      if (place.contact_instagram && !existing.contact_instagram) {
        existing.contact_instagram = place.contact_instagram;
      }

      if (place.website_url && !existing.website_url) {
        existing.website_url = place.website_url;
      }

      // Merge tags
      if (place.tags && place.tags.length > 0) {
        existing.tags = existing.tags || [];
        place.tags.forEach(tag => {
          if (!existing.tags.includes(tag)) {
            existing.tags.push(tag);
          }
        });
      }

      // Keep track for reporting
      duplicates.push({
        name: place.name,
        merged_id: place.id,
        kept_id: existing.id
      });
    } else {
      placesByName.set(key, place);
    }
  });

  return {
    deduplicated: Array.from(placesByName.values()),
    duplicates
  };
}

function deduplicateEvents(events) {
  // Events are harder - same event name might be on different dates
  // We'll dedupe by title + date combination
  const eventsByKey = new Map();
  const duplicates = [];

  events.forEach(event => {
    const key = `${event.title.toLowerCase().trim()}_${event.date || 'nodate'}`;

    if (eventsByKey.has(key)) {
      // Found duplicate - merge it
      const existing = eventsByKey.get(key);

      // Prefer event with image
      if (event.image_url && !existing.image_url) {
        existing.image_url = event.image_url;
      }

      // Prefer more complete data
      if (event.description && (!existing.description || event.description.length > existing.description.length)) {
        existing.description = event.description;
      }

      if (event.contact_phone && !existing.contact_phone) {
        existing.contact_phone = event.contact_phone;
      }

      if (event.contact_whatsapp && !existing.contact_whatsapp) {
        existing.contact_whatsapp = event.contact_whatsapp;
      }

      if (event.organizer_name && !existing.organizer_name) {
        existing.organizer_name = event.organizer_name;
      }

      if (event.time && !existing.time) {
        existing.time = event.time;
      }

      duplicates.push({
        title: event.title,
        date: event.date,
        merged_id: event.id,
        kept_id: existing.id
      });
    } else {
      eventsByKey.set(key, event);
    }
  });

  return {
    deduplicated: Array.from(eventsByKey.values()),
    duplicates
  };
}

function deduplicateServices(services) {
  // Services by title (case-insensitive)
  const servicesByTitle = new Map();
  const duplicates = [];

  services.forEach(service => {
    const key = service.title.toLowerCase().trim();

    if (servicesByTitle.has(key)) {
      // Found duplicate - merge it
      const existing = servicesByTitle.get(key);

      // Merge images
      if (service.images && service.images.length > 0) {
        existing.images = existing.images || [];
        service.images.forEach(img => {
          if (!existing.images.includes(img)) {
            existing.images.push(img);
          }
        });
      }

      // Prefer more complete data
      if (service.description && (!existing.description || service.description.length > existing.description.length)) {
        existing.description = service.description;
      }

      if (service.contact_phone && !existing.contact_phone) {
        existing.contact_phone = service.contact_phone;
      }

      if (service.contact_whatsapp && !existing.contact_whatsapp) {
        existing.contact_whatsapp = service.contact_whatsapp;
      }

      if (service.price_amount && !existing.price_amount) {
        existing.price_amount = service.price_amount;
        existing.price_type = service.price_type;
        existing.price_currency = service.price_currency;
      }

      duplicates.push({
        title: service.title,
        merged_id: service.id,
        kept_id: existing.id
      });
    } else {
      servicesByTitle.set(key, service);
    }
  });

  return {
    deduplicated: Array.from(servicesByTitle.values()),
    duplicates
  };
}

// ============================================================================
// MAIN
// ============================================================================

function deduplicateAll() {
  console.log('🔍 Checking for duplicate entities...\n');

  // Load entities
  const events = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/events.json`, 'utf8'));
  const places = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/places.json`, 'utf8'));
  const services = JSON.parse(fs.readFileSync(`${CONFIG.INPUT_DIR}/services.json`, 'utf8'));

  console.log('📊 Original counts:');
  console.log(`   🎉 Events:   ${events.length}`);
  console.log(`   📍 Places:   ${places.length}`);
  console.log(`   🛠️  Services: ${services.length}\n`);

  // Deduplicate
  const eventsResult = deduplicateEvents(events);
  const placesResult = deduplicatePlaces(places);
  const servicesResult = deduplicateServices(services);

  // Save deduplicated
  fs.writeFileSync(
    `${CONFIG.OUTPUT_DIR}/events.json`,
    JSON.stringify(eventsResult.deduplicated, null, 2)
  );
  fs.writeFileSync(
    `${CONFIG.OUTPUT_DIR}/places.json`,
    JSON.stringify(placesResult.deduplicated, null, 2)
  );
  fs.writeFileSync(
    `${CONFIG.OUTPUT_DIR}/services.json`,
    JSON.stringify(servicesResult.deduplicated, null, 2)
  );

  // Save duplicate report
  const report = {
    events: eventsResult.duplicates,
    places: placesResult.duplicates,
    services: servicesResult.duplicates
  };
  fs.writeFileSync(
    `${CONFIG.OUTPUT_DIR}/duplicates-report.json`,
    JSON.stringify(report, null, 2)
  );

  console.log('✅ Deduplication complete!\n');
  console.log('📊 Deduplicated counts:');
  console.log(`   🎉 Events:   ${eventsResult.deduplicated.length} (removed ${eventsResult.duplicates.length} duplicates)`);
  console.log(`   📍 Places:   ${placesResult.deduplicated.length} (removed ${placesResult.duplicates.length} duplicates)`);
  console.log(`   🛠️  Services: ${servicesResult.deduplicated.length} (removed ${servicesResult.duplicates.length} duplicates)`);
  console.log(`\n📁 Saved to: ${CONFIG.OUTPUT_DIR}/\n`);

  if (placesResult.duplicates.length > 0) {
    console.log('📍 Duplicate places merged:');
    placesResult.duplicates.forEach(dup => {
      console.log(`   - ${dup.name}`);
    });
    console.log('');
  }

  if (eventsResult.duplicates.length > 0) {
    console.log('🎉 Duplicate events merged:');
    eventsResult.duplicates.forEach(dup => {
      console.log(`   - ${dup.title} (${dup.date || 'no date'})`);
    });
    console.log('');
  }

  if (servicesResult.duplicates.length > 0) {
    console.log('🛠️  Duplicate services merged:');
    servicesResult.duplicates.forEach(dup => {
      console.log(`   - ${dup.title}`);
    });
    console.log('');
  }

  console.log('📋 Duplicate report saved to: duplicates-report.json\n');
}

// ============================================================================
// RUN
// ============================================================================

deduplicateAll();
