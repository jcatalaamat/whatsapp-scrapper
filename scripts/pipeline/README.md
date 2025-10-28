# WhatsApp Data Extraction Pipeline

Streamlined 3-step pipeline to extract events, places, and services from WhatsApp messages and prepare them for database import.

## Overview

This pipeline replaces the old multi-script extraction process with a simple, efficient workflow:

1. **Extract** - Use ChatGPT to identify entities from raw messages
2. **Process** - Deduplicate, add coordinates, assign profiles
3. **Generate SQL** - Create INSERT statements for Supabase

## Quick Start

### Prerequisites

1. Set `OPENAI_API_KEY` in your `.env` file
2. Have raw WhatsApp messages in `data/raw/`
3. Optionally set `SYSTEM_PROFILE_ID` in `.env` (defaults to predefined ID)

### Run Full Pipeline

```bash
yarn pipeline:all
```

This runs all 3 steps in sequence. Or run individually:

```bash
yarn pipeline:extract   # Step 1: Extract entities
yarn pipeline:process   # Step 2: Process & enhance
yarn pipeline:sql       # Step 3: Generate SQL
```

## Step Details

### Step 1: Extract (1-extract.js)

**What it does:**
- Uses OpenAI GPT-4o-mini to analyze WhatsApp messages
- Identifies events, places, and services
- Extracts titles, descriptions, dates, times, locations, prices, contacts
- Handles Spanish/English messages

**Configuration:**
Edit the `CONFIG` object in `1-extract.js`:
```javascript
{
  BATCH_SIZE: 25,        // Messages per API call
  MAX_MESSAGES: null,    // Limit processing (null = all)
  RATE_LIMIT_DELAY: 1000 // ms between batches
}
```

**Output:**
- `data/extracted/events.json`
- `data/extracted/places.json`
- `data/extracted/services.json`
- `data/extracted/progress.json` (for resuming)

**Cost:** ~$0.02 per 100 messages (GPT-4o-mini)

### Step 2: Process (2-process.js)

**What it does:**
- Deduplicates entities by name
- Assigns profile IDs (for ownership)
- Matches locations to known landmarks (coordinates)
- Adds default fields (city_id, approval_status, etc.)

**Configuration:**
Edit the `CONFIG` object in `2-process.js`:
```javascript
{
  PROFILE_ID: '520e75eb-...',  // Override with env var
  LANDMARKS_FILE: './data/outputs/Mazunte_Landmarks_Google_API.json'
}
```

**Output:**
- `data/final/events.json`
- `data/final/places.json`
- `data/final/services.json`

### Step 3: Generate SQL (3-generate-sql.js)

**What it does:**
- Creates SQL INSERT statements for each entity
- Only includes fields with values (skips nulls)
- Properly escapes strings and handles arrays

**Output:**
- `data/final/INSERTS.sql` - Ready to paste into Supabase SQL Editor

## Data Flow

```
WhatsApp Messages (raw/)
    ↓
[ 1-extract.js ] → ChatGPT Analysis
    ↓
Extracted Entities (extracted/)
    ↓
[ 2-process.js ] → Dedupe, Coords, Profiles
    ↓
Final Entities (final/)
    ↓
[ 3-generate-sql.js ] → SQL Generation
    ↓
INSERTS.sql → Copy to Supabase
```

## Tips

### Process Smaller Batches

Edit `1-extract.js` and set:
```javascript
MAX_MESSAGES: 50  // Process only first 50 messages
```

### Resume After Interruption

The extraction script saves progress. Just run again:
```bash
yarn pipeline:extract
```
It will resume from where it stopped.

### Clean Up Between Runs

```bash
yarn pipeline:clean
```

### Use Latest Messages

The extraction script automatically uses the newest file in `data/raw/`:
- `messages_20251026_201832.json` ← Will use this one
- `messages_20251026_205313.json`
- `messages.json`

## Comparison: Old vs New

### Old Pipeline (7+ steps)
```bash
yarn extract:full           # Claude Haiku, expensive
yarn extract:link-media     # Separate script
yarn extract:dedupe         # Separate script
yarn extract:set-profile    # Separate script
yarn extract:add-coords     # Separate script
yarn extract:sql            # Separate script
# Plus 10+ fix scripts scattered in /scripts
```

### New Pipeline (3 steps)
```bash
yarn pipeline:all
# Or individually: extract, process, sql
```

**Benefits:**
- 70% cheaper (GPT-4o-mini vs Claude)
- Simpler data capture (6 fields vs 14)
- Organized folders (raw/extracted/final)
- Single command execution
- Clear progression

## Troubleshooting

### "No message files found"
- Run WhatsApp scraper first: `yarn local:backfill`
- Check that `data/raw/` has JSON files

### "No OpenAI API key"
- Add `OPENAI_API_KEY=sk-...` to `.env`
- Get key from: https://platform.openai.com/api-keys

### "No landmarks file"
- Landmarks are optional
- Processing will skip coordinate matching
- Or create landmarks file at configured path

### Low extraction quality
- Increase `BATCH_SIZE` (25→30) for more context
- Or decrease for faster, focused extraction

## Next Steps

After running the pipeline:

1. Open `data/final/INSERTS.sql`
2. Copy the contents
3. Open Supabase SQL Editor
4. Paste and run
5. Check your tables: events, places, services

Done! 🎉
