/**
 * Session Manager
 * Manages WhatsApp Web session persistence in Supabase
 * Solves Render's ephemeral storage issue
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { saveSession, loadSession, deleteSession } from './supabase-client.js';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Local session directory
const SESSION_DIR = join(__dirname, '..', '.wwebjs_auth');
const SESSION_FILE = join(SESSION_DIR, 'session.txt');

/**
 * Ensure session directory exists
 */
function ensureSessionDir() {
  if (!existsSync(SESSION_DIR)) {
    mkdirSync(SESSION_DIR, { recursive: true });
  }
}

/**
 * Check if local session exists
 * @returns {boolean} True if session file exists locally
 */
export function hasLocalSession() {
  return existsSync(SESSION_FILE);
}

/**
 * Save session to local file
 * @param {string} sessionData - Session data to save
 */
function saveLocalSession(sessionData) {
  ensureSessionDir();
  writeFileSync(SESSION_FILE, sessionData, 'utf8');
  console.log('💾 Session saved locally');
}

/**
 * Load session from local file
 * @returns {string|null} Session data or null if not found
 */
function loadLocalSession() {
  if (hasLocalSession()) {
    const data = readFileSync(SESSION_FILE, 'utf8');
    console.log('💾 Session loaded from local file');
    return data;
  }
  return null;
}

/**
 * Delete local session file
 */
function deleteLocalSession() {
  if (hasLocalSession()) {
    const fs = await import('fs');
    fs.unlinkSync(SESSION_FILE);
    console.log('🗑️  Local session deleted');
  }
}

/**
 * Restore session from Supabase to local storage
 * Called on service startup
 * @returns {Promise<boolean>} True if session was restored
 */
export async function restoreSession() {
  try {
    console.log('🔄 Checking for existing session in Supabase...');

    const sessionId = config.whatsapp.sessionId;
    const sessionData = await loadSession(sessionId);

    if (!sessionData) {
      console.log('ℹ️  No session found - will need to scan QR code');
      return false;
    }

    // Decode and save to local storage
    const decodedData = Buffer.from(sessionData, 'base64').toString('utf8');
    saveLocalSession(decodedData);

    console.log('✅ Session restored from Supabase');
    return true;
  } catch (error) {
    console.error('❌ Error restoring session:', error.message);
    return false;
  }
}

/**
 * Backup session from local storage to Supabase
 * Called after successful WhatsApp authentication
 * @returns {Promise<boolean>} True if backup was successful
 */
export async function backupSession() {
  try {
    console.log('🔄 Backing up session to Supabase...');

    const localData = loadLocalSession();
    if (!localData) {
      console.log('⚠️  No local session to backup');
      return false;
    }

    // Encode and save to Supabase
    const encodedData = Buffer.from(localData).toString('base64');
    const sessionId = config.whatsapp.sessionId;

    await saveSession(sessionId, encodedData);

    console.log('✅ Session backed up to Supabase');
    return true;
  } catch (error) {
    console.error('❌ Error backing up session:', error.message);
    return false;
  }
}

/**
 * Delete session from both local storage and Supabase
 * @returns {Promise<void>}
 */
export async function clearSession() {
  try {
    console.log('🗑️  Clearing session...');

    // Delete from Supabase
    const sessionId = config.whatsapp.sessionId;
    await deleteSession(sessionId);

    // Delete local
    await deleteLocalSession();

    console.log('✅ Session cleared');
  } catch (error) {
    console.error('❌ Error clearing session:', error.message);
  }
}

/**
 * Setup session persistence
 * Call this before initializing WhatsApp client
 * @returns {Promise<void>}
 */
export async function setupSessionPersistence() {
  ensureSessionDir();

  // Try to restore from Supabase on startup
  const restored = await restoreSession();

  if (restored) {
    console.log('♻️  Using existing WhatsApp session');
  } else {
    console.log('🆕 Starting fresh WhatsApp session');
  }
}

/**
 * Get session info for debugging
 * @returns {Object} Session information
 */
export function getSessionInfo() {
  return {
    hasLocal: hasLocalSession(),
    sessionDir: SESSION_DIR,
    sessionFile: SESSION_FILE,
    sessionId: config.whatsapp.sessionId,
  };
}

export default {
  setupSessionPersistence,
  backupSession,
  restoreSession,
  clearSession,
  hasLocalSession,
  getSessionInfo,
};
