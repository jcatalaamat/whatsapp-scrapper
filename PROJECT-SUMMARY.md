# WhatsApp to Supabase Entity Extraction

Complete AI-powered system to extract structured events, places, and services from WhatsApp community messages.

---

## What This Does

Processes WhatsApp messages from Mazunte community groups and extracts structured data about local events, places, and services - ready to import into Supabase database.

**Input:** Raw WhatsApp messages (JSON)
**Output:** SQL INSERT statements with images, coordinates, and contact info

---

## Results

From 110 WhatsApp messages:
- **29 Events** (yoga, workshops, ceremonies, parties)
- **20 Places** (venues, studios, restaurants, beaches)
- **34 Services** (healing, teaching, food products)

**Data Quality:**
- 74 entities with images (68-75%)
- 100% have WhatsApp contact numbers
- 86% events have coordinates
- 100% places have coordinates
- All linked to profile `520e75eb-b615-4d9a-a369-b218373c6c05`

---

## How It Works

### 1. Message Scraping
WhatsApp client captures messages from configured groups and saves to JSON with media uploaded to Supabase storage.

### 2. AI Extraction
Claude 4.5 Haiku analyzes each message to identify events, places, and services. Extracts titles, descriptions, dates, prices, locations, and contact info. Handles Spanish/English messages.

### 3. Media Linking
Connects WhatsApp images to entities using message IDs. Images already hosted in Supabase storage.

### 4. Deduplication
Finds duplicate entries (same venue/event mentioned multiple times) and merges data, keeping the most complete information.

### 5. Profile Assignment
Links all entities to a system profile ID for ownership.

### 6. Coordinate Mapping
Matches location names against 45 landmarks with verified Google Maps coordinates. Automatic fuzzy matching by venue name.

### 7. SQL Generation
Creates INSERT statements for Supabase with all fields populated.

---

## Usage

### Quick Start
```bash
# Run complete extraction pipeline
yarn extract:full         # Extract entities (AI)
yarn extract:link-media   # Link images
yarn extract:dedupe       # Remove duplicates
yarn extract:set-profile  # Set profile_id
yarn extract:add-coords   # Add coordinates
yarn extract:sql          # Generate SQL

# Import to Supabase
# 1. Open INSERTS-README.md
# 2. Copy SQL to Supabase SQL Editor
# 3. Run imports
```

### Test First
```bash
yarn extract:sample  # Process only 30 messages (~45 seconds)
```

---

## Project Structure

```
whatsapp-scrapper/
├── src/                          # WhatsApp scraper
│   ├── index.js                 # Main entry point
│   ├── message-handler.js       # Message processing
│   └── media-handler.js         # Media upload
├── scripts/extraction/           # Entity extraction pipeline
│   ├── extract-entities-ai.js   # AI extraction (Claude)
│   ├── link-media-to-entities.js
│   ├── deduplicate-entities.js
│   ├── set-profile-id.js
│   ├── add-coordinates.js
│   └── generate-sql-inserts.js
├── docs/reference/
│   ├── mazunte-landmarks.json   # 45 landmarks with coordinates
│   └── tables-structure.md      # Database schema
├── data/
│   ├── messages_*.json          # Scraped messages
│   └── outputs/                 # Extraction results
│       └── with-coordinates/    # Final entity data
└── INSERTS-README.md            # SQL ready for Supabase
```

---

## Requirements

- Node.js 18+
- WhatsApp account (for scraping)
- Anthropic API key (for extraction)
- Supabase project (for storage & database)

---

## Configuration

### Environment Variables (`.env`)
```bash
# Supabase
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_STORAGE_BUCKET=whatsapp-media

# WhatsApp Groups (comma-separated)
WHATSAPP_GROUPS=Group Name 1,Group Name 2

# AI Extraction
ANTHROPIC_KEY=your-api-key
```

### Extraction Config
Edit scripts to adjust:
- Batch size (messages per AI call)
- Profile ID
- Coordinate matching logic

---

## Key Features

### AI Extraction
- Processes ALL messages (no keyword filtering)
- Handles multilingual content (Spanish/English)
- Extracts partial data (doesn't skip incomplete info)
- Generates UUIDs for all entities
- Preserves original message references

### Media Handling
- Images uploaded during scraping to Supabase storage
- Automatic linking to entities via message ID
- Direct URLs in SQL statements

### Deduplication
- Matches by name (case-insensitive)
- Merges data from duplicates
- Keeps most complete information
- Combines images from all instances

### Coordinate Mapping
- 45+ verified Mazunte landmarks
- Fuzzy name matching
- Handles aliases and variations
- Manual landmark file for easy updates

---

## Costs

- **AI Extraction**: ~$0.50 per 110 messages (Claude 4.5 Haiku)
- **Supabase**: Free tier sufficient for storage
- **WhatsApp**: Free (uses existing account)

---

## Output Example

**Event:**
```json
{
  "title": "Floorwork (Adultos) - Dance Class",
  "date": "2025-10-27",
  "time": "17:30:00",
  "location_name": "Foro Escénico Alternativo Mermejita",
  "lat": 15.6602,
  "lng": -96.5648,
  "price": "100 MXN",
  "image_url": "https://.../image.jpg",
  "contact_whatsapp": "5212213497548",
  "profile_id": "520e75eb-b615-4d9a-a369-b218373c6c05"
}
```

---

## Limitations

- Some dates are informal ("tomorrow", "tonight")
- Not all organizer names available
- Some locations too generic for coordinate matching
- Services often mobile/online (no fixed coordinates)

---

## Future Enhancements

- Automatic geocoding for unmatched locations
- Date parsing for informal references
- Profile creation per WhatsApp sender
- Duplicate detection across scrape sessions
- Image OCR for poster text extraction

---

## Documentation

- `scripts/extraction/README.md` - Extraction pipeline details
- `EXTRACTION-COMPLETE.md` - Final results summary
- `INSERTS-README.md` - SQL statements with usage
- `docs/reference/tables-structure.md` - Database schema

---

**Status:** Production ready
**Last Updated:** October 27, 2025
