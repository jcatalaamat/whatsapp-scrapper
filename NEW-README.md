# WhatsApp to Database Pipeline

Extract events, places, and services from WhatsApp community groups and import them into your Supabase database.

## What This Does

1. **Captures** WhatsApp messages from configured groups (with minimal data - only what's needed)
2. **Extracts** structured entities using AI (ChatGPT)
3. **Processes** data (deduplication, coordinates, profiles)
4. **Generates** SQL INSERT statements ready for Supabase

## Quick Start

### 1. Install

```bash
yarn install
cp .env.example .env
```

### 2. Configure

Edit `.env`:
```bash
# Required for WhatsApp scraping
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
WHATSAPP_GROUPS=Group Name 1,Group Name 2

# Required for entity extraction
OPENAI_API_KEY=sk-your-key-here
```

### 3. Collect Messages

**Option A: Live monitoring** (captures new messages as they come)
```bash
yarn start
```

**Option B: Backfill history** (fetch last 100 messages from groups)
```bash
yarn local:backfill
```

Messages are saved to `data/raw/messages_TIMESTAMP.json`

### 4. Run Extraction Pipeline

```bash
yarn pipeline:all
```

This runs 3 steps:
1. Extract entities from messages (AI)
2. Process & enhance data
3. Generate SQL INSERT statements

### 5. Import to Database

1. Open `data/final/INSERTS.sql`
2. Copy all content
3. Open Supabase SQL Editor
4. Paste and run

Done! Your events, places, and services are now in the database.

## Project Structure

```
whatsapp-scrapper/
├── src/                        # WhatsApp scraper
│   ├── index.js               # Main entry point
│   ├── message-handler.js     # Message processing (simplified)
│   └── local-storage.js       # Save to JSON
│
├── scripts/pipeline/          # NEW: Streamlined 3-step pipeline
│   ├── 1-extract.js          # AI extraction (ChatGPT)
│   ├── 2-process.js          # Dedupe, coords, profiles
│   ├── 3-generate-sql.js     # SQL generation
│   └── README.md             # Pipeline documentation
│
├── data/
│   ├── raw/                  # Raw WhatsApp messages
│   ├── extracted/            # AI-extracted entities
│   └── final/                # Processed & ready for DB
│       └── INSERTS.sql       # Generated SQL
│
└── migrations/               # Database schema
```

## Key Changes (Streamlined Version)

### Before
- 14 fields captured per message
- 7+ separate extraction scripts
- Complex folder structure (outputs/full/samples/deduplicated/etc.)
- Expensive AI (Claude)
- Scattered fix scripts

### After
- **6 essential fields** (id, group_name, sender_phone, message_body, timestamp, media_url)
- **3-step pipeline** (extract → process → sql)
- **Clean folders** (raw → extracted → final)
- **Cheaper AI** (ChatGPT ~70% less cost)
- **Organized structure**

## Commands

### WhatsApp Scraping
```bash
yarn start              # Live monitoring
yarn local:backfill     # Fetch history (local mode)
yarn backfill           # Fetch history (save to DB)
yarn sessions:list      # List captured sessions
```

### Extraction Pipeline
```bash
yarn pipeline:all       # Run all 3 steps
yarn pipeline:extract   # Step 1: AI extraction only
yarn pipeline:process   # Step 2: Processing only
yarn pipeline:sql       # Step 3: SQL generation only
yarn pipeline:clean     # Clear pipeline outputs
```

### Database
```bash
yarn migrate:up         # Run migrations
yarn test:db            # Test DB connection
```

## Configuration

### Process Smaller Batches

Edit `scripts/pipeline/1-extract.js`:
```javascript
const CONFIG = {
  MAX_MESSAGES: 50,  // Process only 50 messages
  BATCH_SIZE: 20,    // 20 messages per AI call
};
```

### Custom Profile ID

Set in `.env`:
```bash
SYSTEM_PROFILE_ID=your-profile-uuid
```

### Add More Landmarks

Edit or replace `data/outputs/Mazunte_Landmarks_Google_API.json` with your locations:
```json
[
  {
    "name": "Hridaya Yoga",
    "lat": 15.6625,
    "lng": -96.5652
  }
]
```

## Cost

- **WhatsApp scraping**: Free (uses your account)
- **Storage**: Free (Supabase free tier)
- **AI extraction**: ~$0.02 per 100 messages (GPT-4o-mini)

Example: 500 messages = ~$0.10

## What Gets Extracted

### Events
- Workshops, classes, parties, ceremonies, markets, gatherings
- Fields: title, description, date, time, location, price, contacts, category

### Places
- Restaurants, cafes, venues, studios, shops, beaches, accommodations
- Fields: name, type, description, location, hours, price_range, contacts, tags

### Services
- Yoga, massage, therapy, teaching, art classes, food, rentals, repairs
- Fields: title, description, category, pricing, location, contacts

All with:
- WhatsApp contact numbers
- Location coordinates (when matched)
- Profile IDs (for ownership)
- Original message references

## Data Quality

From 172 messages:
- **~30 events** extracted
- **~20 places** extracted
- **~35 services** extracted
- **100%** have contact numbers
- **80-90%** have coordinates (for known landmarks)

## Troubleshooting

### No messages extracted?
- Check messages are in `data/raw/`
- Verify they have meaningful text (>20 chars)
- Try smaller batch: Set `MAX_MESSAGES: 20` in 1-extract.js

### OpenAI API errors?
- Verify `OPENAI_API_KEY` in `.env`
- Check quota at https://platform.openai.com/usage
- Script will auto-retry with delays

### SQL errors in Supabase?
- Check your database has tables: events, places, services
- Run migrations: `yarn migrate:up`
- Verify column names match schema

### WhatsApp won't connect?
- Scan QR code when prompted
- Check you're in the configured groups
- Try: `yarn local` for local testing first

## Next Steps

1. **Test with sample**: Set `MAX_MESSAGES: 30` and run pipeline
2. **Review output**: Check `data/final/*.json` files
3. **Inspect SQL**: Open `data/final/INSERTS.sql`
4. **Import**: Copy SQL to Supabase
5. **Scale up**: Remove MAX_MESSAGES limit, process all

## Documentation

- [Pipeline Details](scripts/pipeline/README.md) - Step-by-step extraction process
- [Environment Variables](ENV_VARIABLES.md) - All configuration options
- [Deployment Guide](DEPLOYMENT.md) - Deploy to Render

## License

MIT

---

**Status**: Production Ready
**Last Updated**: October 2025
