import fs from 'fs';
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  BATCH_SIZE: 20, // Process N messages at a time (increased for Haiku speed)
  MAX_CONCURRENT_BATCHES: 3, // Process multiple batches in parallel
  RATE_LIMIT_DELAY: 500, // ms between batches (reduced for Haiku speed)
  MIN_MESSAGE_LENGTH: 20, // Skip very short messages
  OUTPUT_DIR: './data/outputs/full',
  PROGRESS_FILE: './data/outputs/full/progress.json'
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
  fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
}

// ============================================================================
// ANTHROPIC CLIENT SETUP
// ============================================================================

// Verify API key is available
const apiKey = process.env.ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
if (!apiKey) {
  console.error('❌ Error: No Anthropic API key found!');
  console.error('Please set ANTHROPIC_KEY in your .env file');
  process.exit(1);
}

const anthropic = new Anthropic({
  apiKey: apiKey
});

// ============================================================================
// EXTRACTION PROMPTS
// ============================================================================

const SYSTEM_PROMPT = `You are an expert at extracting structured information from WhatsApp messages in a Mexican beach community (Mazunte). Your task is to identify and extract information about EVENTS, PLACES, and SERVICES from messages that may be in Spanish, English, or mixed languages.

IMPORTANT INSTRUCTIONS:
1. Process EVERY message - do not filter by keywords
2. A single message may contain multiple entities (e.g., an event at a place, or a service announcement with event details)
3. Extract whatever information is available - partial data is OK
4. For missing fields, use null
5. Be generous in interpretation - if it MIGHT be an event/place/service, include it
6. **CRITICAL - Contact Info**:
   - ALWAYS extract the "Sender Phone/WhatsApp" field as the contact_whatsapp (this is the poster's WhatsApp number)
   - If additional phone/WhatsApp numbers are mentioned in the message text, prefer those over the sender phone
   - If the "Sender" field contains a name (not just numbers), use it as the organizer_name
   - Look for additional organizer/person names in the message text (signatures, "Contact X", "by X", etc.)
   - Preserve all contact information found in message text (phone, WhatsApp, Instagram, email)
7. **CRITICAL - Organizer/Poster Names**:
   - Look for names in signatures (patterns: "Love, María", "- Juan", "Con amor, X", "🙏 Name", etc.)
   - Look for "Contact X for...", "X offers...", "I'm X and I...", "Organized by X", "Soy X..."
   - Check for names before phone numbers or Instagram handles
   - Use these names in organizer_name field for events, or in service titles
8. Extract dates/times even if informal ("mañana", "tonight", "domingo", "this Sunday")
9. Extract locations/addresses even if informal
10. Generate UUIDs for all entity IDs
11. Always include the original message_id for reference

ENTITY DEFINITIONS:

**EVENTS**: Workshops, classes, gatherings, parties, ceremonies, concerts, markets, moon circles, cacao ceremonies, yoga sessions, dance events, meditation, sound healing, film screenings, volunteer activities, community gatherings, etc.

**PLACES**: Venues, restaurants, cafes, beaches, accommodation, studios, shops, galleries, healing centers, community spaces, landmarks, natural areas, etc.

**SERVICES**: Offerings by individuals or businesses - yoga instruction, massage, therapy, healing, teaching, music lessons, art classes, food preparation, accommodation rentals, transportation, repair services, beauty services, products for sale, etc.

SCHEMAS:

Events:
{
  "id": "UUID",
  "profile_id": null,
  "title": "string",
  "description": "string | null",
  "date": "YYYY-MM-DD | null",
  "time": "HH:MM:SS | null",
  "location_name": "string | null",
  "lat": null,
  "lng": null,
  "category": "party | workshop | wellness | music | art | spirituality | food | sports | community | market | ceremony | other",
  "price": "string | null",
  "organizer_name": "string | null",
  "contact_phone": "string | null",
  "contact_whatsapp": "string | null",
  "contact_instagram": "string | null",
  "contact_email": "string | null",
  "city_id": "mazunte",
  "approval_status": "pending",
  "original_message_id": "string"
}

Places:
{
  "id": "UUID",
  "name": "string",
  "type": "venue | restaurant | accommodation | activity | shop | studio | cafe | beach | other",
  "category": "string | null",
  "description": "string | null",
  "location_name": "string | null",
  "lat": null,
  "lng": null,
  "hours": "string | null",
  "price_range": "string | null",
  "contact_phone": "string | null",
  "contact_whatsapp": "string | null",
  "contact_instagram": "string | null",
  "contact_email": "string | null",
  "tags": ["array of relevant tags"],
  "city_id": "mazunte",
  "verified": false,
  "original_message_id": "string"
}

Services:
{
  "id": "UUID",
  "profile_id": null,
  "title": "string",
  "description": "string | null",
  "category": "wellness | art | education | food | accommodation | transportation | repair | beauty | music | healing | spiritual | other",
  "price_type": "fixed | hourly | daily | per-session | negotiable | donation | null",
  "price_amount": "number | null",
  "price_currency": "MXN | USD | null",
  "price_notes": "string | null",
  "location_name": "string | null",
  "lat": null,
  "lng": null,
  "contact_phone": "string | null",
  "contact_whatsapp": "string | null",
  "contact_instagram": "string | null",
  "contact_email": "string | null",
  "city_id": "mazunte",
  "approval_status": "pending",
  "original_message_id": "string"
}

EXAMPLES:

Message: "Temazcal ceremony tonight at 7pm in Hridaya. 200 pesos. Contact María +52 958 123 4567"
Extract:
{
  "events": [{
    "id": "generated-uuid",
    "title": "Temazcal ceremony",
    "description": "Temazcal ceremony",
    "date": null,
    "time": "19:00:00",
    "location_name": "Hridaya",
    "category": "ceremony",
    "price": "200 MXN",
    "organizer_name": "María",
    "contact_phone": "+52 958 123 4567",
    "contact_whatsapp": "+52 958 123 4567",
    "city_id": "mazunte",
    "approval_status": "pending",
    "original_message_id": "msg-id"
  }],
  "places": [],
  "services": []
}

Message: "I offer massage and energy healing. $500/hr. WhatsApp 958-123-4567"
Extract:
{
  "events": [],
  "places": [],
  "services": [{
    "id": "generated-uuid",
    "title": "Massage and energy healing",
    "description": "Massage and energy healing services",
    "category": "wellness",
    "price_type": "hourly",
    "price_amount": 500,
    "price_currency": "MXN",
    "contact_whatsapp": "958-123-4567",
    "city_id": "mazunte",
    "approval_status": "pending",
    "original_message_id": "msg-id"
  }]
}

Return ONLY valid JSON in this format:
{
  "events": [...],
  "places": [...],
  "services": []
}

If no entities found, return: {"events": [], "places": [], "services": []}`;

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
Sender Phone/WhatsApp: ${msg.sender_name}
Group: ${msg.group_name}
Text: ${msg.message_body}
---`;
  }).join('\n\n');

  const userPrompt = `Extract all events, places, and services from these ${messages.length} WhatsApp messages. Remember: process ALL messages, extract partial information, and generate UUIDs for all IDs.

${messagesText}

Return ONLY valid JSON with this structure:
{
  "events": [...],
  "places": [...],
  "services": []
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: userPrompt
      }]
    });

    // Extract JSON from response
    const text = response.content[0].text;

    // Try to parse JSON - handle potential markdown code blocks
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }

    const extracted = JSON.parse(jsonText);

    // Generate UUIDs for any entities missing them
    extracted.events?.forEach(e => { if (!e.id) e.id = uuidv4(); });
    extracted.places?.forEach(p => { if (!p.id) p.id = uuidv4(); });
    extracted.services?.forEach(s => { if (!s.id) s.id = uuidv4(); });

    return extracted;
  } catch (error) {
    console.error('Error extracting from batch:', error.message);
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
    throw error;
  }
}

// ============================================================================
// MAIN PROCESSING
// ============================================================================

async function processAllMessages() {
  console.log('🚀 Starting AI-powered entity extraction...\n');

  // Load messages
  const messagesFile = './data/messages_20251026_201832.json';
  const allMessages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));

  // Filter messages with substantial text content
  const messages = allMessages.filter(msg =>
    msg.message_body &&
    msg.message_body.trim().length >= CONFIG.MIN_MESSAGE_LENGTH
  );

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

    console.log(`\n📦 Processing batch ${batchNum}/${totalBatches} (messages ${i + 1}-${Math.min(i + CONFIG.BATCH_SIZE, totalMessages)} of ${totalMessages})...`);

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

      // Wait longer on error before continuing
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

processAllMessages().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
