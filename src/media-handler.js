/**
 * Media Handler
 * Downloads and uploads media from WhatsApp messages to Supabase Storage
 */

import { uploadMedia } from './supabase-client.js';

/**
 * Determine message type from MessageMedia
 * @param {Object} media - MessageMedia object from whatsapp-web.js
 * @returns {string} Message type
 */
export function getMessageType(media) {
  if (!media) return 'text';

  const mimetype = media.mimetype?.toLowerCase() || '';

  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype.includes('document') || mimetype.includes('pdf')) return 'document';

  return 'document'; // Default for unknown types
}

/**
 * Generate a safe filename from mimetype
 * @param {string} mimetype - MIME type
 * @returns {string} File extension
 */
function getFileExtension(mimetype) {
  const mimeMap = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'audio/mpeg': 'mp3',
    'audio/ogg': 'ogg',
    'audio/wav': 'wav',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  };

  return mimeMap[mimetype] || 'bin';
}

/**
 * Process and upload media from a WhatsApp message
 * @param {Object} message - WhatsApp message object
 * @returns {Promise<Object|null>} Media data or null if no media
 */
export async function processMedia(message) {
  try {
    // Check if message has media
    if (!message.hasMedia) {
      return null;
    }

    console.log('📎 Downloading media from message...');

    // Download media
    const media = await message.downloadMedia();

    if (!media) {
      console.log('⚠️  Media download returned null');
      return null;
    }

    // Get message type and mimetype
    const messageType = getMessageType(media);
    const mimetype = media.mimetype || 'application/octet-stream';

    console.log(`📎 Media downloaded: ${messageType} (${mimetype})`);

    // Convert base64 to buffer
    const buffer = Buffer.from(media.data, 'base64');

    // Generate filename
    const extension = getFileExtension(mimetype);
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}_${randomStr}.${extension}`;

    // Upload to Supabase Storage
    console.log('☁️  Uploading to Supabase Storage...');
    const publicUrl = await uploadMedia(buffer, filename, mimetype);

    return {
      messageType,
      mediaUrl: publicUrl,
      mediaMimetype: mimetype,
    };
  } catch (error) {
    console.error('❌ Error processing media:', error.message);
    // Don't throw - continue processing without media
    return null;
  }
}

/**
 * Check if a message type should be captured
 * @param {Object} message - WhatsApp message object
 * @returns {boolean} True if message should be captured
 */
export function shouldCaptureMessage(message) {
  // Skip system messages
  if (message.isStatus || message.broadcast) {
    return false;
  }

  // Capture text messages
  if (message.body && message.body.trim().length > 0) {
    return true;
  }

  // Capture messages with media
  if (message.hasMedia) {
    return true;
  }

  return false;
}

/**
 * Check if message matches keyword filter
 * @param {string} messageBody - Message text
 * @param {string[]} keywords - Keywords to filter by
 * @returns {boolean} True if message matches filter
 */
export function matchesKeywordFilter(messageBody, keywords) {
  if (!keywords || keywords.length === 0) {
    return true; // No filter = capture all
  }

  const bodyLower = messageBody.toLowerCase();

  return keywords.some(keyword => {
    const keywordLower = keyword.toLowerCase();
    return bodyLower.includes(keywordLower);
  });
}

/**
 * Extract comprehensive metadata from WhatsApp message
 * @param {Object} message - WhatsApp message object
 * @returns {Object} Metadata object
 */
export function extractMetadata(message) {
  const metadata = {};

  // Message Status & Flags
  if (message.isForwarded) {
    metadata.isForwarded = true;
    if (message.forwardingScore) {
      metadata.forwardCount = message.forwardingScore;
    }
  }

  if (message.isStarred) {
    metadata.isStarred = true;
  }

  if (message.isEphemeral) {
    metadata.isEphemeral = true;
  }

  if (message.isGif) {
    metadata.isGif = true;
  }

  // Author (for group messages)
  if (message.author && message.author !== message.from) {
    metadata.author = message.author;
  }

  // Device Type
  if (message.deviceType) {
    metadata.deviceType = message.deviceType;
  }

  // ACK Status (delivery/read receipts)
  if (message.ack !== undefined && message.ack !== null) {
    const ackStatus = {
      '-1': 'error',
      '0': 'pending',
      '1': 'sent',
      '2': 'received',
      '3': 'read',
      '4': 'played'
    };
    metadata.ackStatus = ackStatus[message.ack] || `unknown_${message.ack}`;
  }

  // Quoted Message (Reply)
  if (message.hasQuotedMsg) {
    metadata.hasQuotedMessage = true;
    // Could fetch quoted message details with message.getQuotedMessage() but async
  }

  // Reactions
  if (message.hasReaction) {
    metadata.hasReaction = true;
  }

  // Mentions
  if (message.mentionedIds && message.mentionedIds.length > 0) {
    metadata.mentionedIds = message.mentionedIds;
    metadata.mentionCount = message.mentionedIds.length;
  }

  // Group Mentions
  if (message.groupMentions && message.groupMentions.length > 0) {
    metadata.hasGroupMentions = true;
    metadata.groupMentionCount = message.groupMentions.length;
  }

  // Links
  if (message.links && message.links.length > 0) {
    metadata.links = message.links.map(link => ({
      url: link.link,
      isSuspicious: link.isSuspicious || false
    }));
    metadata.linkCount = message.links.length;
  }

  // Location
  if (message.location) {
    metadata.location = {
      latitude: message.location.latitude,
      longitude: message.location.longitude,
      description: message.location.description || null,
    };
  }

  // VCards (Contacts)
  if (message.vCards && message.vCards.length > 0) {
    metadata.hasContacts = true;
    metadata.contactCount = message.vCards.length;
  }

  // Media Duration (for audio/video)
  if (message.duration) {
    metadata.mediaDuration = message.duration;
  }

  // Group Invite
  if (message.inviteV4) {
    metadata.hasGroupInvite = true;
    metadata.inviteCode = message.inviteV4.inviteCode;
    metadata.inviteExpiration = message.inviteV4.inviteCodeExp;
  }

  // Order/Payment (for business messages)
  if (message.orderId) {
    metadata.orderId = message.orderId;
    if (message.token) {
      metadata.orderToken = message.token;
    }
  }

  // Polls
  if (message.type === 'poll_creation' || message.pollName) {
    metadata.isPoll = true;
    metadata.pollName = message.pollName;
    if (message.pollOptions) {
      metadata.pollOptions = message.pollOptions;
      metadata.pollOptionCount = message.pollOptions.length;
    }
    if (message.allowMultipleAnswers !== undefined) {
      metadata.pollAllowsMultiple = message.allowMultipleAnswers;
    }
  }

  // Events
  if (message.type === 'e2e_notification' || message.eventDescription) {
    metadata.isEvent = true;
    if (message.eventStartTime) metadata.eventStartTime = message.eventStartTime;
    if (message.eventEndTime) metadata.eventEndTime = message.eventEndTime;
    if (message.eventDescription) metadata.eventDescription = message.eventDescription;
    if (message.eventLocation) metadata.eventLocation = message.eventLocation;
  }

  // Buttons (interactive messages)
  if (message.dynamicReplyButtons) {
    metadata.hasButtons = true;
  }
  if (message.selectedButtonId) {
    metadata.selectedButton = message.selectedButtonId;
  }
  if (message.selectedRowId) {
    metadata.selectedRow = message.selectedRowId;
  }

  // Message Type (more detailed)
  if (message.type) {
    metadata.messageType = message.type;
  }

  return Object.keys(metadata).length > 0 ? metadata : {};
}

export default {
  processMedia,
  shouldCaptureMessage,
  matchesKeywordFilter,
  extractMetadata,
  getMessageType,
};
