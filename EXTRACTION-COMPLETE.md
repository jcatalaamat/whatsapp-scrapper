# WhatsApp Entity Extraction - Complete

**Date:** October 27, 2025
**Source:** 110 WhatsApp messages from Mazunte community groups

---

## Summary

Extracted 83 unique entities (events, places, and services) from WhatsApp messages using AI, with automatic deduplication, media linking, and coordinate mapping.

---

## Results

### Entities Extracted
- **29 Events** - Yoga classes, workshops, ceremonies, dance sessions, community gatherings
- **20 Places** - Venues, studios, restaurants, beaches, wellness centers
- **34 Services** - Healing, teaching, massage, food products, wellness offerings

### Data Quality
- **Images**: 74 entities (68-75% coverage) have WhatsApp media images attached
- **Contact Info**: 100% have WhatsApp numbers from senders or message text
- **Coordinates**:
  - Events: 25/29 (86%)
  - Places: 20/20 (100%)
  - Services: 9/34 (26% - many are mobile/online)
- **Profile ID**: All entities linked to profile `520e75eb-b615-4d9a-a369-b218373c6c05`

---

## Files Generated

### Data Files
- `data/outputs/with-coordinates/events.json` - All events with images and coordinates
- `data/outputs/with-coordinates/places.json` - All places with images and coordinates
- `data/outputs/with-coordinates/services.json` - All services with images and coordinates

### Reference Files
- `docs/reference/mazunte-landmarks.json` - 45 landmarks with verified coordinates
- `INSERTS-README.md` - SQL INSERT statements ready for Supabase

---

## Complete Pipeline

```bash
# Full extraction workflow
yarn extract:full         # 1. Extract entities from messages (AI)
yarn extract:link-media   # 2. Link WhatsApp images
yarn extract:dedupe       # 3. Remove duplicates
yarn extract:set-profile  # 4. Set profile_id
yarn extract:add-coords   # 5. Add lat/lng from landmarks
yarn extract:sql          # 6. Generate SQL statements

# Quick commands
yarn extract:sample       # Test on 30 messages
yarn extract:clean        # Clean outputs
```

---

## Next Steps

1. **Import to Supabase**
   - Open `INSERTS-README.md`
   - Copy SQL for each table
   - Run in Supabase SQL Editor

2. **Review Data**
   - Check imported entities in dashboard
   - Update `approval_status` from 'pending' to 'approved'
   - Add missing information

3. **Enhance**
   - Add coordinates for unmatched locations
   - Upload additional images
   - Add more detailed descriptions

---

## Technical Details

### AI Extraction
- Model: Claude 4.5 Haiku
- Batch processing: 20 messages per batch
- Multilingual: Spanish/English support
- Cost: ~$0.50 for full extraction

### Deduplication
- Removed 20 duplicate entities
- Merged data from duplicates (images, contact info, descriptions)

### Coordinate Matching
- 45 landmarks with verified coordinates from Google Maps
- Fuzzy matching by name and location
- Automatic assignment via location name patterns

### Image Linking
- Images uploaded to Supabase storage during scraping
- Linked via `original_message_id` reference
- Direct URLs ready for import

---

## Data Limitations

- Some events have informal dates ("mañana", "tonight")
- Some prices are unclear or negotiable
- Not all messages had organizer names
- 4 events without coordinates (generic locations like "Mazunte, Mexico")
- 25 services without coordinates (mobile/online services)

---

## Project Structure

```
whatsapp-scrapper/
├── scripts/extraction/
│   ├── extract-entities-ai.js          # Main AI extraction
│   ├── link-media-to-entities.js       # Image linking
│   ├── deduplicate-entities.js         # Duplicate removal
│   ├── set-profile-id.js               # Profile assignment
│   ├── add-coordinates.js              # Coordinate mapping
│   └── generate-sql-inserts.js         # SQL generation
├── docs/reference/
│   ├── mazunte-landmarks.json          # Landmark coordinates
│   └── tables-structure.md             # Database schema
├── data/outputs/
│   └── with-coordinates/               # Final entity data
└── INSERTS-README.md                   # SQL ready for import
```

---

**Status:** Ready for Supabase import
