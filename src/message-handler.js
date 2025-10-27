/**
 * Message Handler
 * Processes incoming WhatsApp messages and stores them in the database
 */

import { insertMessage } from './supabase-client.js';
import { insertMessageLocal } from './local-storage.js';
import {
  processMedia,
  shouldCaptureMessage,
  matchesKeywordFilter,
  extractMetadata,
  getMessageType,
} from './media-handler.js';
import config from './config.js';

// Check if we're in local mode
const isLocalMode = process.env.LOCAL_MODE === 'true';

/**
 * Get sender information from WhatsApp message
 * @param {Object} message - WhatsApp message object
 * @returns {Promise<Object>} Sender info
 */
async function getSenderInfo(message) {
  try {
    const contact = await message.getContact();

    // Try multiple sources for the display name
    const displayName = contact.pushname
      || contact.name
      || contact.verifiedName
      || contact.shortName
      || contact.number
      || 'Unknown';

    return {
      senderName: displayName,
      senderPhone: message.from,
    };
  } catch (error) {
    console.error('⚠️  Error getting sender info:', error.message);
    return {
      senderName: 'Unknown',
      senderPhone: message.from,
    };
  }
}

/**
 * Get group information from chat
 * @param {Object} chat - WhatsApp chat object
 * @returns {Object} Group info
 */
function getGroupInfo(chat) {
  return {
    groupName: chat.name || 'Unknown Group',
    groupId: chat.id._serialized,
  };
}

/**
 * Process and store a WhatsApp message
 * @param {Object} message - WhatsApp message object
 * @param {Object} chat - WhatsApp chat object
 * @returns {Promise<void>}
 */
export async function handleMessage(message, chat) {
  try {
    // Check if this is a group message from one of our configured groups
    if (!chat.isGroup) {
      return; // Only process group messages
    }

    const groupInfo = getGroupInfo(chat);

    // Check if this group is in our configured list
    if (!config.whatsapp.groups.includes(groupInfo.groupName)) {
      return; // Not one of our monitored groups
    }

    // Check if message should be captured
    if (!shouldCaptureMessage(message)) {
      return;
    }

    // Apply keyword filter if enabled
    if (config.features.enableKeywordFilter) {
      const matches = matchesKeywordFilter(
        message.body || '',
        config.features.filterKeywords
      );
      if (!matches) {
        console.log(`⏭️  Message filtered out (no keyword match)`);
        return;
      }
    }

    console.log(`\n📨 New message in ${groupInfo.groupName}`);

    // Get sender info
    const senderInfo = await getSenderInfo(message);
    console.log(`👤 From: ${senderInfo.senderName}`);

    // Process media if present
    let mediaData = null;
    if (message.hasMedia) {
      mediaData = await processMedia(message);
    }

    // Extract metadata
    const metadata = extractMetadata(message);

    // Prepare message data for database
    const messageData = {
      group_name: groupInfo.groupName,
      group_id: groupInfo.groupId,
      sender_name: senderInfo.senderName,
      sender_phone: senderInfo.senderPhone,
      message_body: message.body || null,
      message_type: mediaData ? mediaData.messageType : 'text',
      media_url: mediaData ? mediaData.mediaUrl : null,
      media_mimetype: mediaData ? mediaData.mediaMimetype : null,
      timestamp: new Date(message.timestamp * 1000).toISOString(),
      approval_status: 'pending',
      processed: false,
      metadata: metadata || {},
    };

    // Insert into appropriate storage backend
    if (isLocalMode) {
      await insertMessageLocal(messageData);
    } else {
      await insertMessage(messageData);
    }

    // Log success
    const preview = message.body
      ? message.body.substring(0, 50) + (message.body.length > 50 ? '...' : '')
      : '[Media]';
    console.log(`💬 "${preview}"`);
    console.log(`✅ Message captured successfully\n`);
  } catch (error) {
    console.error('❌ Error handling message:', error.message);
    console.error(error.stack);
  }
}

/**
 * Log message statistics periodically
 * @param {number} intervalMs - Interval in milliseconds
 */
export function startStatsLogger(intervalMs = 3600000) {
  // Default: every hour
  setInterval(async () => {
    try {
      let stats;

      if (isLocalMode) {
        const { getMessageStatsLocal } = await import('./local-storage.js');
        stats = await getMessageStatsLocal();
      } else {
        const { getMessageStats } = await import('./supabase-client.js');
        stats = await getMessageStats();
      }

      console.log('\n📊 Message Statistics:');
      console.log(`   Total messages: ${stats.total}`);
      console.log(`   Pending approval: ${stats.pending}`);
      console.log(`   Approved: ${stats.approved}`);
      console.log('');
    } catch (error) {
      console.error('❌ Error logging stats:', error.message);
    }
  }, intervalMs);
}

/**
 * Check if a chat should be monitored
 * @param {Object} chat - WhatsApp chat object
 * @returns {boolean} True if chat should be monitored
 */
export function shouldMonitorChat(chat) {
  if (!chat.isGroup) {
    return false;
  }

  const groupName = chat.name || '';
  return config.whatsapp.groups.includes(groupName);
}

/**
 * Get list of monitored group names
 * @returns {string[]} Array of group names
 */
export function getMonitoredGroups() {
  return config.whatsapp.groups;
}

export default {
  handleMessage,
  startStatsLogger,
  shouldMonitorChat,
  getMonitoredGroups,
};
