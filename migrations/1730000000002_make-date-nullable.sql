-- Migration: Make date column nullable for recurring events
-- Some events are recurring (e.g., weekly yoga classes) and don't have specific dates

-- Make date column nullable
ALTER TABLE events
ALTER COLUMN date DROP NOT NULL;

-- Add a helpful comment
COMMENT ON COLUMN events.date IS 'Event date. NULL for recurring events without a specific date.';
