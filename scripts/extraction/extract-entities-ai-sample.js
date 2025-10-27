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
  SAMPLE_SIZE: 30, // Only process first N messages
  OUTPUT_DIR: './data/outputs/samples/latest',
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
   - Extract Instagram handles from text (e.g., "@username", "Instagram: username")
   - Extract email addresses from text
6b. **CRITICAL - Media & Links**:
   - If message has "Image/Media URL", add it to the images array for events/places
   - Extract URLs from "Links:" field (Google Maps, websites, etc.)
   - Google Maps links can be used for location coordinates (though we can't extract lat/lng here)
   - Website/Instagram links should be captured in appropriate fields
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

Return ONLY valid JSON in this format:
{
  "events": [...],
  "places": [...],
  "services": []
}

If no entities found, return: {"events": [], "places": [], "services": []}`;

// ============================================================================
// AI EXTRACTION
// ============================================================================

async function extractFromMessages(messages) {
  const messagesText = messages.map((msg, idx) => {
    // Extract links from metadata
    const metadataLinks = msg.metadata?.links?.map(l => l.url) || [];
    const hasMedia = msg.media_url ? true : false;

    let messageBlock = `MESSAGE ${idx + 1}:
ID: ${msg.id}
Date: ${msg.timestamp}
Sender Phone/WhatsApp: ${msg.sender_name}
Group: ${msg.group_name}`;

    if (hasMedia) {
      messageBlock += `\nImage/Media URL: ${msg.media_url}`;
    }

    if (metadataLinks.length > 0) {
      messageBlock += `\nLinks: ${metadataLinks.join(', ')}`;
    }

    messageBlock += `\nText: ${msg.message_body || '[No text, media only]'}
---`;

    return messageBlock;
  }).join('\n\n');

  const userPrompt = `Extract all events, places, and services from these ${messages.length} WhatsApp messages. Remember: process ALL messages, extract partial information, and generate UUIDs for all IDs.

${messagesText}

Return ONLY valid JSON with this structure:
{
  "events": [...],
  "places": [...],
  "services": []
}`;

  console.log(`\n🤖 Sending ${messages.length} messages to Claude 4.5 Haiku for analysis...\n`);

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
    console.error('❌ Error extracting from messages:', error.message);
    throw error;
  }
}

// ============================================================================
// MAIN PROCESSING
// ============================================================================

async function processSample() {
  console.log('🚀 Starting AI-powered entity extraction (SAMPLE MODE)...\n');

  // Load messages
  const messagesFile = './data/messages_20251026_201832.json';
  const allMessages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));

  // Filter messages with substantial text content
  const messagesWithText = allMessages.filter(msg =>
    msg.message_body &&
    msg.message_body.trim().length >= 20
  );

  // Take only first N messages as sample
  const messages = messagesWithText.slice(0, CONFIG.SAMPLE_SIZE);

  console.log(`📊 Total messages in file: ${allMessages.length}`);
  console.log(`📝 Messages with text content: ${messagesWithText.length}`);
  console.log(`🎯 Processing sample of: ${messages.length} messages\n`);

  // Show preview of messages being processed
  console.log('📋 Sample messages:');
  messages.slice(0, 5).forEach((msg, idx) => {
    const preview = msg.message_body.substring(0, 80).replace(/\n/g, ' ');
    console.log(`   ${idx + 1}. ${preview}...`);
  });
  if (messages.length > 5) {
    console.log(`   ... and ${messages.length - 5} more messages`);
  }

  // Extract entities
  const extracted = await extractFromMessages(messages);

  const eventsCount = extracted.events?.length || 0;
  const placesCount = extracted.places?.length || 0;
  const servicesCount = extracted.services?.length || 0;

  console.log('\n✅ Extraction complete!\n');
  console.log('='.repeat(60));
  console.log('📊 RESULTS:');
  console.log('='.repeat(60));
  console.log(`   🎉 Events:   ${eventsCount}`);
  console.log(`   📍 Places:   ${placesCount}`);
  console.log(`   🛠️  Services: ${servicesCount}`);
  console.log('='.repeat(60));

  // Save results
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/events.json`, JSON.stringify(extracted.events || [], null, 2));
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/places.json`, JSON.stringify(extracted.places || [], null, 2));
  fs.writeFileSync(`${CONFIG.OUTPUT_DIR}/services.json`, JSON.stringify(extracted.services || [], null, 2));

  console.log(`\n📁 Results saved to: ${CONFIG.OUTPUT_DIR}/\n`);

  // Show samples
  if (eventsCount > 0) {
    console.log('\n🎉 Sample Event:');
    console.log(JSON.stringify(extracted.events[0], null, 2));
  }
  if (placesCount > 0) {
    console.log('\n📍 Sample Place:');
    console.log(JSON.stringify(extracted.places[0], null, 2));
  }
  if (servicesCount > 0) {
    console.log('\n🛠️  Sample Service:');
    console.log(JSON.stringify(extracted.services[0], null, 2));
  }

  return extracted;
}

// ============================================================================
// RUN
// ============================================================================

processSample().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
