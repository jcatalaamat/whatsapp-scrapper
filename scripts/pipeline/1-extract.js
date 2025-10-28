import fs from 'fs';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  BATCH_SIZE: 25, // Process N messages at a time
  MAX_MESSAGES: null, // Set to limit (e.g., 50), or null for all
  RATE_LIMIT_DELAY: 1000, // ms between batches
  MIN_MESSAGE_LENGTH: 20, // Skip very short messages
  INPUT_DIR: './data/raw',
  OUTPUT_DIR: './data/extracted',
  PROGRESS_FILE: './data/extracted/progress.json'
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
  fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
}

// ============================================================================
// OPENAI CLIENT SETUP
// ============================================================================

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('❌ Error: No OpenAI API key found!');
  console.error('Please set OPENAI_API_KEY in your .env file');
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

// ============================================================================
// EXTRACTION PROMPT
// ============================================================================

const SYSTEM_PROMPT = `You are an expert at extracting structured information from WhatsApp messages in a Mexican beach community (Mazunte). Your task is to identify and extract information about EVENTS, PLACES, and SERVICES from messages that may be in Spanish, English, or mixed languages.

IMPORTANT RULES:
1. Process EVERY message - extract whatever you can find
2. A message may contain multiple entities (e.g., event at a place, service with location)
3. Extract partial data - missing fields should be null
4. Be generous - if it MIGHT be relevant, include it
5. ALWAYS extract sender_phone as primary contact (it's the WhatsApp number of the poster)
6. Look for names in signatures, contacts, "by X", "organized by X", etc.
7. Extract dates/times even if informal ("tomorrow", "tonight", "domingo")
8. Generate UUIDs for all entity IDs
9. Include original message_id for reference

ENTITY TYPES:

**EVENTS**: Workshops, classes, parties, ceremonies, concerts, markets, yoga, meditation, gatherings, volunteer activities, etc.

**PLACES**: Restaurants, cafes, beaches, venues, accommodations, studios, shops, galleries, healing centers, landmarks, etc.

**SERVICES**: Yoga instruction, massage, therapy, teaching, music lessons, art classes, food prep, rentals, repairs, beauty services, products, etc.

SCHEMAS:

Event:
{
  "id": "UUID",
  "title": "string",
  "description": "string | null",
  "date": "YYYY-MM-DD | null",
  "time": "HH:MM:SS | null",
  "location_name": "string | null",
  "category": "party | workshop | wellness | music | art | spirituality | food | sports | community | market | ceremony | other",
  "price": "string | null",
  "organizer_name": "string | null",
  "contact_whatsapp": "string | null",
  "contact_phone": "string | null",
  "contact_instagram": "string | null",
  "contact_email": "string | null",
  "original_message_id": "string"
}

Place:
{
  "id": "UUID",
  "name": "string",
  "type": "venue | restaurant | accommodation | activity | shop | studio | cafe | beach | other",
  "description": "string | null",
  "location_name": "string | null",
  "hours": "string | null",
  "price_range": "string | null",
  "contact_whatsapp": "string | null",
  "contact_phone": "string | null",
  "contact_instagram": "string | null",
  "tags": ["array of relevant tags"],
  "original_message_id": "string"
}

Service:
{
  "id": "UUID",
  "title": "string",
  "description": "string | null",
  "category": "wellness | art | education | food | accommodation | transportation | repair | beauty | music | healing | spiritual | other",
  "price_type": "fixed | hourly | daily | per-session | negotiable | donation | null",
  "price_amount": "number | null",
  "price_currency": "MXN | USD | null",
  "location_name": "string | null",
  "contact_whatsapp": "string | null",
  "contact_phone": "string | null",
  "contact_instagram": "string | null",
  "original_message_id": "string"
}

EXAMPLE:
Message: "Temazcal tonight at Hridaya 7pm. 200 pesos. WhatsApp 958-123-4567"
Extract:
{
  "events": [{
    "id": "uuid",
    "title": "Temazcal ceremony",
    "date": null,
    "time": "19:00:00",
    "location_name": "Hridaya",
    "category": "ceremony",
    "price": "200 MXN",
    "contact_whatsapp": "958-123-4567",
    "original_message_id": "msg-id"
  }],
  "places": [],
  "services": []
}

Return ONLY valid JSON:
{
  "events": [...],
  "places": [...],
  "services": [...]
}

If nothing found: {"events": [], "places": [], "services": []}`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function loadProgress() {
  if (fs.existsSync(CONFIG.PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG.PROGRESS_FILE, 'utf8'));
  }
  return {
    lastProcessedIndex: -1,
    processedMessageIds: [],
    stats: { events: 0, places: 0, services: 0, errors: 0 }
  };
}

function saveProgress(progress) {
  fs.writeFileSync(CONFIG.PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function saveEntities(events, places, services) {
  const eventsFile = `${CONFIG.OUTPUT_DIR}/events.json`;
  const placesFile = `${CONFIG.OUTPUT_DIR}/places.json`;
  const servicesFile = `${CONFIG.OUTPUT_DIR}/services.json`;

  // Load existing or create new
  let existingEvents = fs.existsSync(eventsFile) ? JSON.parse(fs.readFileSync(eventsFile, 'utf8')) : [];
  let existingPlaces = fs.existsSync(placesFile) ? JSON.parse(fs.readFileSync(placesFile, 'utf8')) : [];
  let existingServices = fs.existsSync(servicesFile) ? JSON.parse(fs.readFileSync(servicesFile, 'utf8')) : [];

  // Append new entities
  existingEvents.push(...events);
  existingPlaces.push(...places);
  existingServices.push(...services);

  // Save
  fs.writeFileSync(eventsFile, JSON.stringify(existingEvents, null, 2));
  fs.writeFileSync(placesFile, JSON.stringify(existingPlaces, null, 2));
  fs.writeFileSync(servicesFile, JSON.stringify(existingServices, null, 2));
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// AI EXTRACTION
// ============================================================================

async function extractFromMessages(messages) {
  const messagesText = messages.map((msg, idx) => {
    return `MESSAGE ${idx + 1}:
ID: ${msg.id}
Date: ${msg.timestamp}
Sender WhatsApp: ${msg.sender_phone}
Group: ${msg.group_name}
Text: ${msg.message_body}
Has Media: ${msg.media_url ? 'Yes' : 'No'}
---`;
  }).join('\n\n');

  const userPrompt = `Extract all events, places, and services from these ${messages.length} WhatsApp messages:

${messagesText}

Return ONLY valid JSON with this structure:
{
  "events": [...],
  "places": [...],
  "services": [...]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0,
      response_format: { type: 'json_object' }
    });

    const text = response.choices[0].message.content;
    const extracted = JSON.parse(text);

    // Generate REAL UUIDs for all entities (ChatGPT creates fake UUIDs)
    extracted.events?.forEach(e => { e.id = uuidv4(); });
    extracted.places?.forEach(p => { p.id = uuidv4(); });
    extracted.services?.forEach(s => { s.id = uuidv4(); });

    return extracted;
  } catch (error) {
    console.error('Error extracting from batch:', error.message);
    throw error;
  }
}

// ============================================================================
// MAIN PROCESSING
// ============================================================================

async function processMessages() {
  console.log('🚀 Starting OpenAI-powered entity extraction...\n');

  // Find latest messages file
  const files = fs.readdirSync(CONFIG.INPUT_DIR)
    .filter(f => f.startsWith('messages_') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error('❌ No message files found in data/raw/');
    console.error('💡 Run the WhatsApp scraper first to collect messages');
    process.exit(1);
  }

  const messagesFile = `${CONFIG.INPUT_DIR}/${files[0]}`;
  console.log(`📂 Using: ${files[0]}\n`);

  const allMessages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));

  // Filter messages with text content
  let messages = allMessages.filter(msg =>
    msg.message_body &&
    msg.message_body.trim().length >= CONFIG.MIN_MESSAGE_LENGTH
  );

  // Limit if configured
  if (CONFIG.MAX_MESSAGES && messages.length > CONFIG.MAX_MESSAGES) {
    console.log(`⚠️  Limiting to first ${CONFIG.MAX_MESSAGES} messages (CONFIG.MAX_MESSAGES)`);
    messages = messages.slice(0, CONFIG.MAX_MESSAGES);
  }

  console.log(`📊 Total messages in file: ${allMessages.length}`);
  console.log(`📝 Messages with text content (>=${CONFIG.MIN_MESSAGE_LENGTH} chars): ${messages.length}\n`);

  // Load progress
  const progress = loadProgress();
  const startIndex = progress.lastProcessedIndex + 1;

  if (startIndex > 0) {
    console.log(`▶️  Resuming from message ${startIndex + 1}...\n`);
  }

  // Process in batches
  const totalBatches = Math.ceil((messages.length - startIndex) / CONFIG.BATCH_SIZE);
  let currentBatch = 0;

  for (let i = startIndex; i < messages.length; i += CONFIG.BATCH_SIZE) {
    currentBatch++;
    const batch = messages.slice(i, i + CONFIG.BATCH_SIZE);
    const batchNum = currentBatch;
    const totalMessages = messages.length;

    console.log(`\n📦 Batch ${batchNum}/${totalBatches} (messages ${i + 1}-${Math.min(i + CONFIG.BATCH_SIZE, totalMessages)} of ${totalMessages})...`);

    try {
      const extracted = await extractFromMessages(batch);

      const eventsCount = extracted.events?.length || 0;
      const placesCount = extracted.places?.length || 0;
      const servicesCount = extracted.services?.length || 0;

      console.log(`   ✅ Found: ${eventsCount} events, ${placesCount} places, ${servicesCount} services`);

      // Save entities
      if (eventsCount > 0 || placesCount > 0 || servicesCount > 0) {
        saveEntities(
          extracted.events || [],
          extracted.places || [],
          extracted.services || []
        );
      }

      // Update progress
      progress.lastProcessedIndex = i + CONFIG.BATCH_SIZE - 1;
      progress.processedMessageIds.push(...batch.map(m => m.id));
      progress.stats.events += eventsCount;
      progress.stats.places += placesCount;
      progress.stats.services += servicesCount;
      saveProgress(progress);

      // Rate limiting
      if (i + CONFIG.BATCH_SIZE < messages.length) {
        await delay(CONFIG.RATE_LIMIT_DELAY);
      }

    } catch (error) {
      console.error(`   ❌ Error processing batch ${batchNum}:`, error.message);
      progress.stats.errors++;
      saveProgress(progress);
      await delay(CONFIG.RATE_LIMIT_DELAY * 3);
    }
  }

  // Final summary
  console.log('\n\n' + '='.repeat(60));
  console.log('✨ EXTRACTION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`📊 Total entities extracted:`);
  console.log(`   🎉 Events:   ${progress.stats.events}`);
  console.log(`   📍 Places:   ${progress.stats.places}`);
  console.log(`   🛠️  Services: ${progress.stats.services}`);
  console.log(`   ❌ Errors:   ${progress.stats.errors}`);
  console.log(`\n📁 Extracted data saved to: ${CONFIG.OUTPUT_DIR}/`);
  console.log('   - events.json');
  console.log('   - places.json');
  console.log('   - services.json');
  console.log('='.repeat(60) + '\n');

  return progress.stats;
}

// ============================================================================
// RUN
// ============================================================================

processMessages().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
