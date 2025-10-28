-- Migration: Make coordinates nullable in all tables
-- Created: 2025-10-28
-- Description: Makes lat/lng nullable for events, places, and services (for online/TBD locations)

-- Events coordinates are already nullable (from migration 1730000000001)
-- But let's ensure they stay that way

-- Make places coordinates nullable
ALTER TABLE places ALTER COLUMN lat DROP NOT NULL;
ALTER TABLE places ALTER COLUMN lng DROP NOT NULL;

-- Make services coordinates nullable (if they have NOT NULL constraint)
ALTER TABLE services ALTER COLUMN lat DROP NOT NULL;
ALTER TABLE services ALTER COLUMN lng DROP NOT NULL;

-- Add check constraints to ensure if one coordinate is set, both are set
ALTER TABLE places ADD CONSTRAINT places_coordinates_check
  CHECK ((lat IS NULL AND lng IS NULL) OR (lat IS NOT NULL AND lng IS NOT NULL));

ALTER TABLE services ADD CONSTRAINT services_coordinates_check
  CHECK ((lat IS NULL AND lng IS NULL) OR (lat IS NOT NULL AND lng IS NOT NULL));

COMMENT ON CONSTRAINT places_coordinates_check ON places IS 'Ensures coordinates are either both NULL or both set';
COMMENT ON CONSTRAINT services_coordinates_check ON services IS 'Ensures coordinates are either both NULL or both set';
