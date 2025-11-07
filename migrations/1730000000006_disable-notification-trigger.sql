-- Temporarily disable the notification trigger until notification system is ready
-- This allows event inserts to work without triggering notifications

-- Drop the trigger (try both possible names)
DROP TRIGGER IF EXISTS queue_new_event_notifications_trigger ON events;
DROP TRIGGER IF EXISTS on_new_event_notify_users ON events;

-- Drop the function with CASCADE to remove all dependent triggers
DROP FUNCTION IF EXISTS queue_new_event_notifications() CASCADE;
