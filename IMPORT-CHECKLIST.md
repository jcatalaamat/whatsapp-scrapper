# Import Checklist ✅

## Prerequisites

Before importing, ensure:
- [ ] You have Supabase access
- [ ] You have SQL Editor access
- [ ] Your tables exist (events, places, services)

## Step 1: Run Migrations

### Migration 1: Add city_id to services
**File**: `migrations/1730000000003_add-city-id-to-services.sql`

- [ ] Run migration to add city_id column to services table
- [ ] Verify: `SELECT city_id FROM services LIMIT 1;` works

### Migration 2: Make coordinates nullable
**File**: `migrations/1730000000004_make-all-coordinates-nullable.sql`

- [ ] Run migration to make lat/lng nullable in all tables
- [ ] This allows entities without specific locations (online events, mobile services, etc.)

## Step 2: Import Data

**File**: `data/final/INSERTS.sql` (20.48 KB)

### Import Summary:
- 23 events
- 12 places
- 10 services
- **Total: 45 entities**

### Verification Points:
✅ All UUIDs are valid (no fake patterns like `h7i7j7h7-...`)
✅ All places have `type`, `category`, and `description`
✅ All services have `city_id` field
✅ Images are linked (37 entities with media)
✅ Contact info preserved

- [ ] Opened SQL file
- [ ] Copied entire contents
- [ ] Pasted into Supabase SQL Editor
- [ ] Ran import
- [ ] No errors reported

## Step 3: Verify Import

Run these queries in Supabase:

```sql
-- Check counts
SELECT 'events' as table_name, COUNT(*) as count FROM events
UNION ALL
SELECT 'places', COUNT(*) FROM places
UNION ALL
SELECT 'services', COUNT(*) FROM services;
```

Expected results:
- [ ] events: 23 rows
- [ ] places: 12 rows
- [ ] services: 10 rows

```sql
-- Check data quality
SELECT
  COUNT(*) as total_events,
  COUNT(image_url) as with_images,
  COUNT(date) as with_dates,
  COUNT(contact_whatsapp) as with_whatsapp
FROM events;
```

Expected:
- [ ] total_events: 23
- [ ] with_images: ~17
- [ ] with_dates: ~16
- [ ] with_whatsapp: ~23

```sql
-- Check all places have required fields
SELECT COUNT(*) FROM places WHERE description IS NULL OR category IS NULL;
```

Expected:
- [ ] Result: 0 (no nulls)

```sql
-- Check services have city_id
SELECT COUNT(*) FROM services WHERE city_id = 'mazunte';
```

Expected:
- [ ] Result: 10 (all services)

## Step 4: Review Data

Sample queries to review imported data:

```sql
-- View recent events
SELECT title, date, location_name, image_url
FROM events
ORDER BY date DESC NULLS LAST
LIMIT 10;

-- View places with images
SELECT name, type, images[1] as first_image
FROM places
WHERE images IS NOT NULL
LIMIT 10;

-- View services
SELECT title, category, price_type, city_id
FROM services
LIMIT 10;
```

- [ ] Events look correct
- [ ] Places look correct
- [ ] Services look correct

## Common Issues & Fixes

### Issue: UUID constraint violation
**Symptom**: `invalid input syntax for type uuid`
**Fix**: Already resolved - all UUIDs are now valid

### Issue: NOT NULL constraint on places.description
**Symptom**: `null value in column "description"`
**Fix**: Already resolved - default descriptions added

### Issue: Column "city_id" doesn't exist in services
**Symptom**: `column "city_id" of relation "services" does not exist`
**Fix**: Run the migration (Step 1)

### Issue: places_type_check constraint violation
**Symptom**: `new row for relation "places" violates check constraint "places_type_check"`
**Fix**: Already resolved - types like 'studio' are now mapped to 'venue'

### Issue: NULL value in places.category
**Symptom**: `null value in column "category" of relation "places" violates not-null constraint`
**Fix**: Already resolved - category field now defaults to capitalized type name (e.g., 'Venue', 'Restaurant')

### Issue: Duplicate key violation
**Symptom**: `duplicate key value violates unique constraint`
**Fix**: If you've already imported once, either:
- Delete existing data first: `DELETE FROM events; DELETE FROM places; DELETE FROM services;`
- Or re-run pipeline to get new UUIDs: `yarn pipeline:clean && yarn pipeline:all`

## Success Criteria

✅ All 45 entities imported
✅ No SQL errors
✅ Images are viewable (check URLs)
✅ All required fields populated
✅ Ready to use in your app!

---

**Date**: October 28, 2025
**Pipeline Version**: 2.0
**Data Source**: 102 WhatsApp messages from Mazunte community group
