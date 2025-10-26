/**
 * Local Storage Module
 * Saves WhatsApp messages to local JSON file for testing
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default output file
const DEFAULT_OUTPUT_FILE = join(__dirname, '..', 'data', 'messages.json');

/**
 * Get output file path from env or use default
 * @returns {string} Output file path
 */
function getOutputPath() {
  return process.env.LOCAL_OUTPUT_FILE || DEFAULT_OUTPUT_FILE;
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

    // Add timestamp and ID
    const newMessage = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
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
    pending: messages.filter(m => m.approval_status === 'pending').length,
    approved: messages.filter(m => m.approval_status === 'approved').length,
    rejected: messages.filter(m => m.approval_status === 'rejected').length,
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

export default {
  insertMessageLocal,
  getMessageStatsLocal,
  clearLocalMessages,
  getAllMessagesLocal,
  exportMessages,
};
