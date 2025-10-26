-- Migration: Create WhatsApp Listener Tables
-- Created: 2025-10-26
-- Description: Creates tables for storing WhatsApp messages and session data

-- ============================================
-- UP MIGRATION
-- ============================================

-- Table: whatsapp_messages
-- Stores all captured messages from WhatsApp groups
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name TEXT NOT NULL,
  group_id TEXT NOT NULL,
  sender_name TEXT,
  sender_phone TEXT NOT NULL,
  message_body TEXT,
  message_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'image', 'video', 'audio', 'document'
  media_url TEXT, -- Supabase Storage public URL
  media_mimetype TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Constraints
  CONSTRAINT valid_message_type CHECK (message_type IN ('text', 'image', 'video', 'audio', 'document', 'sticker', 'location', 'contact')),
  CONSTRAINT valid_approval_status CHECK (approval_status IN ('pending', 'approved', 'rejected'))
);

-- Indexes for whatsapp_messages
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_approval ON whatsapp_messages(approval_status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_group_name ON whatsapp_messages(group_name);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_group_id ON whatsapp_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_timestamp ON whatsapp_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON whatsapp_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_sender_phone ON whatsapp_messages(sender_phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_processed ON whatsapp_messages(processed) WHERE NOT processed;

-- Table: whatsapp_sessions
-- Stores WhatsApp Web session data to survive service restarts
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  id TEXT PRIMARY KEY DEFAULT 'default',
  session_data TEXT NOT NULL, -- Base64-encoded session blob
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function: Update whatsapp_sessions.updated_at on modification
CREATE OR REPLACE FUNCTION update_whatsapp_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at for whatsapp_sessions
CREATE TRIGGER trigger_update_whatsapp_sessions_updated_at
  BEFORE UPDATE ON whatsapp_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_sessions_updated_at();

-- Comments for documentation
COMMENT ON TABLE whatsapp_messages IS 'Stores messages captured from WhatsApp groups for Mazunte Connect';
COMMENT ON COLUMN whatsapp_messages.group_name IS 'Human-readable group name (e.g., "Inner Ascend Tribe")';
COMMENT ON COLUMN whatsapp_messages.group_id IS 'WhatsApp group ID (e.g., "123456789@g.us")';
COMMENT ON COLUMN whatsapp_messages.sender_phone IS 'Sender WhatsApp ID (e.g., "521234567890@c.us")';
COMMENT ON COLUMN whatsapp_messages.approval_status IS 'Admin approval status for displaying in app';
COMMENT ON COLUMN whatsapp_messages.processed IS 'Whether this message has been processed into an event/offering';
COMMENT ON COLUMN whatsapp_messages.metadata IS 'Additional data (e.g., quoted message, mentions, links)';

COMMENT ON TABLE whatsapp_sessions IS 'Stores WhatsApp Web session to survive service restarts';
COMMENT ON COLUMN whatsapp_sessions.session_data IS 'Base64-encoded session blob from whatsapp-web.js';

-- ============================================
-- DOWN MIGRATION (commented out for safety)
-- ============================================

-- DROP TRIGGER IF EXISTS trigger_update_whatsapp_sessions_updated_at ON whatsapp_sessions;
-- DROP FUNCTION IF EXISTS update_whatsapp_sessions_updated_at();
-- DROP TABLE IF EXISTS whatsapp_sessions;
-- DROP TABLE IF EXISTS whatsapp_messages;
