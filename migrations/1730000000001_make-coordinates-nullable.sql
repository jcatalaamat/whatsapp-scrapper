-- Migration: Make coordinates nullable for online/TBD events
-- Created: 2025-10-27
-- Description: Allows events without specific physical locations (online events, TBD venues)

ALTER TABLE events ALTER COLUMN lat DROP NOT NULL;
ALTER TABLE events ALTER COLUMN lng DROP NOT NULL;
ALTER TABLE events ALTER COLUMN location_name DROP NOT NULL;

-- Add a check constraint to ensure if one coordinate is set, both are set
ALTER TABLE events ADD CONSTRAINT events_coordinates_check
  CHECK ((lat IS NULL AND lng IS NULL) OR (lat IS NOT NULL AND lng IS NOT NULL));

COMMENT ON CONSTRAINT events_coordinates_check ON events IS 'Ensures coordinates are either both NULL or both set';
