-- Fix notification trigger to handle null descriptions
-- This prevents the "null value in column body" error when events have no description

CREATE OR REPLACE FUNCTION queue_new_event_notifications()
RETURNS TRIGGER AS $$
DECLARE
    pref_record RECORD;
    event_category TEXT;
    notification_body TEXT;
BEGIN
    event_category := NEW.category;

    -- Use description if available, otherwise create a default message
    notification_body := COALESCE(
        NEW.description,
        'New ' || event_category || ' event in ' || NEW.city_id || '!'
    );

    -- Queue notifications for users who want to be notified about new events
    FOR pref_record IN
        SELECT user_id
        FROM user_notification_preferences
        WHERE new_events = true
        AND (preferred_categories IS NULL OR event_category = ANY(preferred_categories))
    LOOP
        INSERT INTO notification_queue (
            user_id,
            notification_type,
            title,
            body,
            data,
            scheduled_for,
            status
        ) VALUES (
            pref_record.user_id,
            'new_event',
            '✨ New ' || event_category || ' event: ' || NEW.title,
            notification_body,  -- Now guaranteed to be non-null
            jsonb_build_object(
                'event_id', NEW.id,
                'event_category', event_category,
                'type', 'new_event'
            ),
            NOW(),
            'pending'
        );
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
