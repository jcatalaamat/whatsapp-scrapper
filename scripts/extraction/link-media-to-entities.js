import fs from 'fs';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  MESSAGES_FILE: './data/messages_20251026_201832.json',
  ENTITIES_DIR: './data/outputs/full',
  OUTPUT_DIR: './data/outputs/full-with-media'
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
  fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
}

// ============================================================================
// MEDIA LINKING
// ============================================================================

function linkMediaToEntities() {
  console.log('🔗 Linking media URLs to extracted entities...\n');

  // Load messages (to get media URLs)
  const messages = JSON.parse(fs.readFileSync(CONFIG.MESSAGES_FILE, 'utf8'));

  // Create a lookup map: message_id -> media info
  const mediaMap = new Map();
  messages.forEach(msg => {
    const mediaInfo = {
      media_url: msg.media_url,
      links: msg.metadata?.links?.map(l => l.url) || []
    };

    if (mediaInfo.media_url || mediaInfo.links.length > 0) {
      mediaMap.set(msg.id, mediaInfo);
    }
  });

  console.log(`📊 Found ${mediaMap.size} messages with media/links\n`);

  // Load extracted entities
  const events = JSON.parse(fs.readFileSync(`${CONFIG.ENTITIES_DIR}/events.json`, 'utf8'));
  const places = JSON.parse(fs.readFileSync(`${CONFIG.ENTITIES_DIR}/places.json`, 'utf8'));
  const services = JSON.parse(fs.readFileSync(`${CONFIG.ENTITIES_DIR}/services.json`, 'utf8'));

  let linkedEvents = 0;
  let linkedPlaces = 0;
  let linkedServices = 0;

  // Link media to events
  events.forEach(event => {
    const media = mediaMap.get(event.original_message_id);
    if (media) {
      // Events have image_url (single)
      if (media.media_url) {
        event.image_url = media.media_url;
        linkedEvents++;
      }

      // Store links in a custom field for reference
      if (media.links.length > 0) {
        event._links = media.links;
      }
    }
  });

  // Link media to places
  places.forEach(place => {
    const media = mediaMap.get(place.original_message_id);
    if (media) {
      // Places have images (array)
      if (media.media_url) {
        place.images = place.images || [];
        place.images.push(media.media_url);
        linkedPlaces++;
      }

      // Extract website URL from links
      if (media.links.length > 0) {
        // Look for non-maps links as website
        const websiteLink = media.links.find(link =>
          !link.includes('maps.google') &&
          !link.includes('maps.app.goo.gl') &&
          !link.includes('instagram.com')
        );

        if (websiteLink) {
          place.website_url = websiteLink;
        }

        // Store all links for reference
        place._links = media.links;
      }
    }
  });

  // Link media to services
  services.forEach(service => {
    const media = mediaMap.get(service.original_message_id);
    if (media) {
      // Services have images (array)
      if (media.media_url) {
        service.images = service.images || [];
        service.images.push(media.media_url);
        linkedServices++;
      }

      // Store links for reference
      if (media.links.length > 0) {
        service._links = media.links;
      }
    }
  });

  // Save updated entities
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/events.json`, JSON.stringify(events, null, 2));
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/places.json`, JSON.stringify(places, null, 2));
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/services.json`, JSON.stringify(services, null, 2));

  console.log('✅ Media linking complete!\n');
  console.log('📊 Results:');
  console.log(`   🎉 Events with images:   ${linkedEvents} / ${events.length}`);
  console.log(`   📍 Places with images:   ${linkedPlaces} / ${places.length}`);
  console.log(`   🛠️  Services with images: ${linkedServices} / ${services.length}`);
  console.log(`\n📁 Saved to: ${CONFIG.OUTPUT_DIR}/\n`);

  // Show examples
  const eventWithImage = events.find(e => e.image_url);
  const placeWithImage = places.find(p => p.images && p.images.length > 0);

  if (eventWithImage) {
    console.log('\n📸 Sample Event with Image:');
    console.log(`   Title: ${eventWithImage.title}`);
    console.log(`   Image: ${eventWithImage.image_url}`);
    if (eventWithImage._links) {
      console.log(`   Links: ${eventWithImage._links.join(', ')}`);
    }
  }

  if (placeWithImage) {
    console.log('\n📸 Sample Place with Image:');
    console.log(`   Name: ${placeWithImage.name}`);
    console.log(`   Images: ${placeWithImage.images.join(', ')}`);
    if (placeWithImage._links) {
      console.log(`   Links: ${placeWithImage._links.join(', ')}`);
    }
  }
}

// ============================================================================
// RUN
// ============================================================================

linkMediaToEntities();
