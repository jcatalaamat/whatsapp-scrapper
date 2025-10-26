/**
 * Supabase Client
 * Handles database operations and storage for WhatsApp messages
 */

import { createClient } from '@supabase/supabase-js';
import config from './config.js';

// Initialize Supabase client with service key (server-side)
const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Insert a WhatsApp message into the database
 * @param {Object} messageData - Message data to insert
 * @returns {Promise<Object>} Inserted message record
 */
export async function insertMessage(messageData) {
  try {
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .insert([messageData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`✅ Message saved to database (ID: ${data.id})`);
    return data;
  } catch (error) {
    console.error('❌ Error inserting message:', error.message);
    throw error;
  }
}

/**
 * Upload a file to Supabase Storage
 * @param {Buffer} fileBuffer - File data as Buffer
 * @param {string} fileName - Name of the file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} Public URL of uploaded file
 */
export async function uploadMedia(fileBuffer, fileName, mimeType) {
  try {
    const bucket = config.supabase.storageBucket;

    // Create a unique file path with date organization
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = Date.now();
    const filePath = `${year}/${month}/${day}/${timestamp}_${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log(`✅ Media uploaded: ${filePath}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error('❌ Error uploading media:', error.message);
    throw error;
  }
}

/**
 * Save WhatsApp session data to database
 * @param {string} sessionId - Session identifier
 * @param {string} sessionData - Base64-encoded session data
 * @returns {Promise<void>}
 */
export async function saveSession(sessionId, sessionData) {
  try {
    const { error } = await supabase
      .from('whatsapp_sessions')
      .upsert({
        id: sessionId,
        session_data: sessionData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw error;
    }

    console.log(`✅ Session saved to database (ID: ${sessionId})`);
  } catch (error) {
    console.error('❌ Error saving session:', error.message);
    throw error;
  }
}

/**
 * Load WhatsApp session data from database
 * @param {string} sessionId - Session identifier
 * @returns {Promise<string|null>} Base64-encoded session data or null if not found
 */
export async function loadSession(sessionId) {
  try {
    const { data, error } = await supabase
      .from('whatsapp_sessions')
      .select('session_data')
      .eq('id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        console.log('ℹ️  No existing session found in database');
        return null;
      }
      throw error;
    }

    console.log(`✅ Session loaded from database (ID: ${sessionId})`);
    return data.session_data;
  } catch (error) {
    console.error('❌ Error loading session:', error.message);
    return null;
  }
}

/**
 * Delete WhatsApp session from database
 * @param {string} sessionId - Session identifier
 * @returns {Promise<void>}
 */
export async function deleteSession(sessionId) {
  try {
    const { error } = await supabase
      .from('whatsapp_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      throw error;
    }

    console.log(`✅ Session deleted from database (ID: ${sessionId})`);
  } catch (error) {
    console.error('❌ Error deleting session:', error.message);
    throw error;
  }
}

/**
 * Get statistics about captured messages
 * @returns {Promise<Object>} Message statistics
 */
export async function getMessageStats() {
  try {
    const { data: total } = await supabase
      .from('whatsapp_messages')
      .select('id', { count: 'exact', head: true });

    const { data: pending } = await supabase
      .from('whatsapp_messages')
      .select('id', { count: 'exact', head: true })
      .eq('approval_status', 'pending');

    const { data: approved } = await supabase
      .from('whatsapp_messages')
      .select('id', { count: 'exact', head: true })
      .eq('approval_status', 'approved');

    return {
      total: total || 0,
      pending: pending || 0,
      approved: approved || 0,
    };
  } catch (error) {
    console.error('❌ Error getting message stats:', error.message);
    return { total: 0, pending: 0, approved: 0 };
  }
}

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
export async function testConnection() {
  try {
    const { error } = await supabase
      .from('whatsapp_messages')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

export default supabase;
