# Coordinate Update Summary

## Problem
The `events` table required NOT NULL constraints on `lat`, `lng`, and `location_name` columns, but several events had NULL values for coordinates:
- Online events (like "Online Talk: Supporting Children Through Transitions")
- Events with TBD/unspecified venues (like "Community Fire Gathering")
- Events extracted from WhatsApp that didn't have specific location information

## Solution

### 1. Database Migration
Created migration `migrations/1730000000001_make-coordinates-nullable.sql` that:
- Made `lat`, `lng`, and `location_name` nullable
- Added a check constraint to ensure coordinates are either both NULL or both set
- This allows online events and events without specific venues

### 2. Coordinate Enrichment Script
Created `scripts/update-coordinates.js` that:
- Loads the Google Places API landmark data from `data/outputs/Mazunte_Landmarks_Google_API.json`
- Matches location names from INSERT statements with known landmarks
- Updates NULL coordinates with actual lat/lng values where possible
- Keeps NULL for genuinely online/location-less events
- Updated **26 event coordinates** from the INSERTS-README.md file

### 3. Location Matching
The script includes fuzzy matching and known location mappings for common venues:
- Meditation Station: `15.6665628, -96.5499399`
- Hridaya Yoga: `15.6666347, -96.5484559`
- Bliss Haven: `15.6677938, -96.5508185`
- Kinam Mazunte: `15.6688677, -96.5538273`
- And ~200 other landmarks from Google API

When no match is found, defaults to Mazunte center: `15.6685, -96.5542`

## Results

### Events with Coordinates
Most events now have proper coordinates matched from Google Places API data.

### Events with NULL (Intentional)
- "Online Talk: Supporting Children Through Transitions" - Online event
- "Community Fire Gathering" - No specific venue

## Usage

To update coordinates for new INSERT statements:
```bash
node scripts/update-coordinates.js
```

To run the migration on a new database:
```bash
psql $DATABASE_URL -f migrations/1730000000001_make-coordinates-nullable.sql
```

## Database Schema Changes

**Before:**
```sql
lat numeric(10,8) NOT NULL
lng numeric(10,8) NOT NULL
location_name text NOT NULL
```

**After:**
```sql
lat numeric(10,8) NULL
lng numeric(10,8) NULL
location_name text NULL

CONSTRAINT events_coordinates_check
  CHECK ((lat IS NULL AND lng IS NULL) OR (lat IS NOT NULL AND lng IS NOT NULL))
```

This ensures data integrity while allowing flexibility for online/TBD events.
