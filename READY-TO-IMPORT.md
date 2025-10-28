# ✅ Data Ready for Supabase Import

Your extraction pipeline has completed successfully! The data is now ready to import into your database.

## Summary

### Extracted Entities (from 102 messages)
- **23 Events** - Workshops, classes, ceremonies, parties, gatherings
- **12 Places** - Venues, studios, restaurants, accommodations
- **10 Services** - Healing, wellness, photography, massage, food

### Data Quality
- ✅ **Valid UUIDs** - All entities have real PostgreSQL-compatible UUIDs
- ✅ **Media Linked** - 37 entities have images (17 events, 12 places, 8 services)
- ✅ **Contact Info** - WhatsApp numbers, Instagram handles, emails extracted
- ✅ **Required Fields** - All NOT NULL constraints satisfied
- ✅ **Proper Escaping** - SQL-safe strings with apostrophes handled

## Import Instructions

### 1. Open the SQL File
File location: `data/final/INSERTS.sql` (20.04 KB)

### 2. Run Migration First (Important!)
Before importing, add the `city_id` column to services table:

1. Open Supabase SQL Editor
2. Copy contents of `migrations/1730000000003_add-city-id-to-services.sql`
3. Run the migration

### 3. Copy & Import Data
1. Open your Supabase project
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the entire contents of `data/final/INSERTS.sql`
5. Paste into the SQL Editor

### 4. Run the Import
Click **Run** to execute all INSERT statements

### 4. Verify Import
Check your tables:
```sql
SELECT COUNT(*) FROM events;   -- Should show 23
SELECT COUNT(*) FROM places;   -- Should show 12
SELECT COUNT(*) FROM services; -- Should show 10
```

## What's Included

### Events
- Title, description, dates, times
- Location names
- Categories (workshop, wellness, music, art, etc.)
- Pricing information
- Organizer names
- Contact information (WhatsApp, phone, email, Instagram)
- Image URLs (where available)
- Profile ID: `520e75eb-b615-4d9a-a369-b218373c6c05`
- Status: All pending approval

### Places
- Name, type, category
- Descriptions
- Location information
- Hours, price ranges
- Contact information
- Image arrays (where available)
- City: mazunte
- Status: Not verified

### Services
- Title, description
- Categories (wellness, healing, art, food, etc.)
- Pricing (type, amount, currency)
- Location information
- Contact information
- Image URLs (where available)
- Profile ID: `520e75eb-b615-4d9a-a369-b218373c6c05`
- Status: All pending approval

## Field Coverage

### Events with:
- ✅ Images: 17/23 (74%)
- ✅ Dates: 16/23 (70%)
- ✅ Times: 13/23 (57%)
- ✅ Locations: 21/23 (91%)
- ✅ Prices: 8/23 (35%)
- ✅ Contact info: 23/23 (100%)

### Places with:
- ✅ Images: 12/12 (100%)
- ✅ Type & Category: 12/12 (100%)
- ✅ Descriptions: 1/12 (8%)
- ✅ Contact info: 1/12 (8%)

### Services with:
- ✅ Images: 8/10 (80%)
- ✅ Descriptions: 8/10 (80%)
- ✅ Pricing: 7/10 (70%)
- ✅ Contact info: 10/10 (100%)

## Known Limitations

1. **No Coordinates** - Landmarks file not found, so lat/lng are NULL
   - To fix: Add landmarks file at `data/outputs/Mazunte_Landmarks_Google_API.json`
   - Re-run: `yarn pipeline:process` and `yarn pipeline:sql`

2. **Some Missing Data** - Not all messages contained complete information
   - This is expected from WhatsApp message extraction
   - Missing fields are NULL in database

3. **Dates May Be Past** - Some events have 2025 dates that may be incorrect
   - ChatGPT extracted dates from messages that said "tonight", "tomorrow"
   - Review and update dates after import

## Next Batch

To process more messages:

1. **Remove limit** in `scripts/pipeline/1-extract.js`:
   ```javascript
   MAX_MESSAGES: null  // Process all messages
   ```

2. **Clean and re-run**:
   ```bash
   yarn pipeline:clean
   yarn pipeline:all
   ```

3. **Import new SQL**:
   - New UUIDs will be generated
   - No duplicates with existing data

## Troubleshooting

### If import fails:

**UUID errors:**
- ✅ Already fixed - all UUIDs are now valid

**Category errors:**
- ✅ Already fixed - all places have category field

**Duplicate key errors:**
- Re-run extraction to get new UUIDs
- Or delete existing data first

**Foreign key errors:**
- Check profile_id exists in profiles table
- Default: `520e75eb-b615-4d9a-a369-b218373c6c05`

## Pipeline Commands Reference

```bash
# Run complete pipeline
yarn pipeline:all

# Run individual steps
yarn pipeline:extract   # Extract with ChatGPT
yarn pipeline:process   # Dedupe, link media, add coords
yarn pipeline:sql       # Generate SQL

# Clean up
yarn pipeline:clean     # Remove extracted/final data

# Collect more messages
yarn local:backfill     # Fetch WhatsApp history
```

## Cost

Processing these 102 messages cost approximately:
- **$0.02 USD** (OpenAI GPT-4o-mini)
- **5 API calls** (25 messages each)

---

**Status**: ✅ Ready to Import
**File**: data/final/INSERTS.sql
**Date**: October 28, 2025
**Size**: 20.04 KB
