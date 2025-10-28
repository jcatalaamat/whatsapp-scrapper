-- Migration: Add city_id to services table
-- Created: 2025-10-28
-- Description: Add city_id column to services table to match events and places

-- Add city_id column to services
ALTER TABLE services
ADD COLUMN city_id TEXT DEFAULT 'mazunte';

-- Add index for city_id
CREATE INDEX IF NOT EXISTS idx_services_city_id ON services(city_id);

COMMENT ON COLUMN services.city_id IS 'City where the service is offered (e.g., mazunte, zipolite)';
