/**
 * Local Storage Module
 * Saves WhatsApp messages to local JSON file for testing
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Session tracking
let currentSessionFile = null;
let sessionStartTime = null;

// Default output directory and file
const DEFAULT_OUTPUT_DIR = join(__dirname, '..', 'data');
const DEFAULT_OUTPUT_FILE = join(DEFAULT_OUTPUT_DIR, 'messages.json');

/**
 * Generate timestamped session filename
 * @returns {string} Filename with timestamp
 */
function generateSessionFilename() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `messages_${year}${month}${day}_${hours}${minutes}${seconds}.json`;
}

/**
 * Get output file path - creates new session file if USE_SESSION_FILES=true
 * @returns {string} Output file path
 */
function getOutputPath() {
  // Check if we should use session files
  const useSessionFiles = process.env.USE_SESSION_FILES === 'true';

  if (!useSessionFiles) {
    // Use single file mode (legacy behavior)
    return process.env.LOCAL_OUTPUT_FILE || DEFAULT_OUTPUT_FILE;
  }

  // Session file mode - create new file per session
  if (!currentSessionFile) {
    const outputDir = process.env.LOCAL_OUTPUT_FILE
      ? dirname(process.env.LOCAL_OUTPUT_FILE)
      : DEFAULT_OUTPUT_DIR;

    const filename = generateSessionFilename();
    currentSessionFile = join(outputDir, filename);
    sessionStartTime = new Date();

    console.log(`📁 New session file: ${filename}`);
  }

  return currentSessionFile;
}

/**
 * Ensure data directory exists
 */
function ensureDataDirectory() {
  const outputPath = getOutputPath();
  const dir = dirname(outputPath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`📁 Created data directory: ${dir}`);
  }
}

/**
 * Load existing messages from file
 * @returns {Array} Array of messages
 */
function loadMessages() {
  const outputPath = getOutputPath();

  if (!existsSync(outputPath)) {
    return [];
  }

  try {
    const data = readFileSync(outputPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('⚠️  Error reading local storage:', error.message);
    return [];
  }
}

/**
 * Save messages to file
 * @param {Array} messages - Array of messages
 */
function saveMessages(messages) {
  const outputPath = getOutputPath();
  ensureDataDirectory();

  try {
    writeFileSync(outputPath, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Error writing to local storage:', error.message);
    throw error;
  }
}

/**
 * Insert a message into local storage
 * @param {Object} messageData - Message data to store
 * @returns {Promise<void>}
 */
export async function insertMessageLocal(messageData) {
  try {
    const messages = loadMessages();

    // Add ID only (simplified - no created_at)
    const newMessage = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...messageData,
    };

    messages.push(newMessage);
    saveMessages(messages);

    console.log(`💾 Message saved locally (${messages.length} total)`);
  } catch (error) {
    console.error('❌ Error inserting message locally:', error.message);
    throw error;
  }
}

/**
 * Get message statistics from local storage
 * @returns {Promise<Object>} Message stats
 */
export async function getMessageStatsLocal() {
  const messages = loadMessages();

  const stats = {
    total: messages.length,
    pending: messages.length, // All messages are now implicitly pending
    approved: 0,
    rejected: 0,
  };

  return stats;
}

/**
 * Clear all local messages
 * @returns {Promise<void>}
 */
export async function clearLocalMessages() {
  saveMessages([]);
  console.log('🗑️  Local messages cleared');
}

/**
 * Get all messages from local storage
 * @returns {Promise<Array>} All messages
 */
export async function getAllMessagesLocal() {
  return loadMessages();
}

/**
 * Export messages to a specific file
 * @param {string} filePath - Target file path
 * @returns {Promise<void>}
 */
export async function exportMessages(filePath) {
  const messages = loadMessages();
  writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf-8');
  console.log(`📤 Exported ${messages.length} messages to ${filePath}`);
}

/**
 * List all session files in the data directory
 * @returns {Promise<Array>} Array of session file info
 */
export async function listSessionFiles() {
  const dir = DEFAULT_OUTPUT_DIR;

  if (!existsSync(dir)) {
    return [];
  }

  try {
    const files = readdirSync(dir)
      .filter(f => f.startsWith('messages_') && f.endsWith('.json'))
      .map(f => {
        const filePath = join(dir, f);
        const data = readFileSync(filePath, 'utf-8');
        const messages = JSON.parse(data);

        // Extract timestamp from filename
        const match = f.match(/messages_(\d{8})_(\d{6})\.json/);
        let sessionDate = 'Unknown';
        if (match) {
          const dateStr = match[1]; // YYYYMMDD
          const timeStr = match[2]; // HHMMSS
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          const hours = timeStr.substring(0, 2);
          const minutes = timeStr.substring(2, 4);
          const seconds = timeStr.substring(4, 6);

          sessionDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        return {
          filename: f,
          path: filePath,
          sessionDate,
          messageCount: messages.length,
        };
      })
      .sort((a, b) => b.filename.localeCompare(a.filename)); // Newest first

    return files;
  } catch (error) {
    console.error('⚠️  Error listing session files:', error.message);
    return [];
  }
}

/**
 * Get current session info
 * @returns {Object|null} Session info or null
 */
export function getCurrentSessionInfo() {
  if (!currentSessionFile) {
    return null;
  }

  return {
    filename: currentSessionFile.split('/').pop(),
    path: currentSessionFile,
    startTime: sessionStartTime,
  };
}

export default {
  insertMessageLocal,
  getMessageStatsLocal,
  clearLocalMessages,
  getAllMessagesLocal,
  exportMessages,
  listSessionFiles,
  getCurrentSessionInfo,
};
