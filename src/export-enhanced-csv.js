/**
 * Enhanced CSV Export
 * Exports messages with maximum useful information in clean CSV format
 */

import { writeFileSync } from 'fs';
import { getAllMessagesLocal } from './local-storage.js';

/**
 * Format a date to human-readable string
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * Extract phone number from WhatsApp ID
 * @param {string} phone - WhatsApp phone ID
 * @returns {string} Clean phone number
 */
function extractPhoneNumber(phone) {
  if (!phone) return '';
  // Extract number before @ symbol
  const match = phone.match(/^(\d+)/);
  return match ? match[1] : phone;
}

/**
 * Format metadata as readable string
 * @param {Object} metadata - Message metadata
 * @returns {string} Formatted metadata
 */
function formatMetadata(metadata) {
  if (!metadata || Object.keys(metadata).length === 0) return '';

  const items = [];
  if (metadata.hasQuotedMessage) items.push('Reply');
  if (metadata.isForwarded) items.push('Forwarded');
  if (metadata.mentionedIds?.length > 0) items.push(`Mentions: ${metadata.mentionedIds.length}`);
  if (metadata.links?.length > 0) items.push(`Links: ${metadata.links.length}`);

  return items.join('; ');
}

/**
 * Escape CSV field
 * @param {any} value - Value to escape
 * @returns {string} Escaped CSV field
 */
function escapeCSV(value) {
  if (value === null || value === undefined) return '';

  let str = String(value);

  // If field contains comma, newline, or quotes, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }

  return str;
}

/**
 * Convert message to enhanced CSV row
 * @param {Object} message - Message object
 * @param {number} index - Message index (for numbering)
 * @returns {string} CSV row
 */
function messageToEnhancedCSVRow(message, index) {
  const timestamp = formatDate(message.timestamp);
  const createdAt = formatDate(message.created_at);
  const senderPhone = extractPhoneNumber(message.sender_phone);
  const senderName = message.sender_name || senderPhone;
  const messageText = message.message_body || '';
  const messageType = message.message_type || 'text';
  const hasMedia = message.media_url ? 'Yes' : 'No';
  const mediaUrl = message.media_url || '';
  const mediaType = message.media_mimetype || '';
  const group = message.group_name || '';
  const status = message.approval_status || 'pending';
  const metadata = formatMetadata(message.metadata);
  const messageLength = messageText.length;
  const hasText = messageText ? 'Yes' : 'No';

  return [
    index + 1,                  // Row number
    escapeCSV(timestamp),       // When message was sent
    escapeCSV(group),           // WhatsApp group name
    escapeCSV(senderName),      // Sender name/number
    escapeCSV(senderPhone),     // Sender phone number
    escapeCSV(messageType),     // Message type (text/image/video/etc)
    escapeCSV(hasMedia),        // Has media? (Yes/No)
    escapeCSV(hasText),         // Has text? (Yes/No)
    escapeCSV(messageLength),   // Text length
    escapeCSV(messageText),     // Message text content
    escapeCSV(mediaUrl),        // Media file URL
    escapeCSV(mediaType),       // Media MIME type
    escapeCSV(metadata),        // Additional info (replies, forwards, etc)
    escapeCSV(status),          // Approval status
    escapeCSV(createdAt),       // When captured by system
    escapeCSV(message.id),      // Internal ID
  ].join(',');
}

/**
 * Export messages to enhanced CSV with maximum useful data
 * @param {string} outputPath - Path to output CSV file
 * @param {boolean} fromLocal - Whether to export from local storage
 * @returns {Promise<void>}
 */
export async function exportToEnhancedCSV(outputPath, fromLocal = true) {
  try {
    console.log('\n📤 Exporting messages to enhanced CSV...');

    let messages;

    if (fromLocal) {
      messages = await getAllMessagesLocal();
      console.log(`✅ Loaded ${messages.length} messages from local storage`);
    } else {
      const { default: supabase } = await import('./supabase-client.js');
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .order('timestamp', { ascending: true });

      if (error) throw error;
      messages = data;
      console.log(`✅ Loaded ${messages.length} messages from Supabase`);
    }

    if (messages.length === 0) {
      console.log('⚠️  No messages to export');
      return;
    }

    // Sort by timestamp (oldest first)
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // CSV Header with descriptive column names
    const header = [
      'Number',
      'Date & Time',
      'Group',
      'Sender Name',
      'Phone Number',
      'Type',
      'Has Media',
      'Has Text',
      'Text Length',
      'Message',
      'Media URL',
      'Media Type',
      'Extra Info',
      'Status',
      'Captured At',
      'ID'
    ].join(',');

    // Convert messages to CSV rows
    const rows = messages.map((msg, index) => messageToEnhancedCSVRow(msg, index));

    // Combine header and rows
    const csv = [header, ...rows].join('\n');

    // Write to file
    writeFileSync(outputPath, csv, 'utf-8');

    console.log(`✅ Exported ${messages.length} messages to ${outputPath}`);

    // Print detailed summary
    console.log('\n📊 Export Summary:');
    console.log(`   Total messages: ${messages.length}`);

    const byType = {};
    const byGroup = {};
    const withMedia = messages.filter(m => m.media_url).length;
    const withText = messages.filter(m => m.message_body).length;
    const withBoth = messages.filter(m => m.media_url && m.message_body).length;

    messages.forEach(m => {
      const type = m.message_type || 'text';
      const group = m.group_name || 'Unknown';
      byType[type] = (byType[type] || 0) + 1;
      byGroup[group] = (byGroup[group] || 0) + 1;
    });

    console.log('\n   📋 By Type:');
    Object.entries(byType).forEach(([type, count]) => {
      const pct = ((count / messages.length) * 100).toFixed(1);
      console.log(`      ${type}: ${count} (${pct}%)`);
    });

    console.log('\n   👥 By Group:');
    Object.entries(byGroup).forEach(([group, count]) => {
      const pct = ((count / messages.length) * 100).toFixed(1);
      console.log(`      ${group}: ${count} (${pct}%)`);
    });

    console.log('\n   💬 Content Breakdown:');
    console.log(`      Messages with media: ${withMedia}`);
    console.log(`      Messages with text: ${withText}`);
    console.log(`      Messages with both: ${withBoth}`);
    console.log(`      Media-only (no text): ${withMedia - withBoth}`);
    console.log(`      Text-only (no media): ${withText - withBoth}`);

    // Find date range
    if (messages.length > 0) {
      const oldest = new Date(messages[0].timestamp);
      const newest = new Date(messages[messages.length - 1].timestamp);
      console.log('\n   📅 Date Range:');
      console.log(`      Oldest: ${formatDate(oldest.toISOString())}`);
      console.log(`      Newest: ${formatDate(newest.toISOString())}`);

      const daysDiff = Math.ceil((newest - oldest) / (1000 * 60 * 60 * 24));
      console.log(`      Span: ${daysDiff} days`);
    }

    // Top senders
    const senders = {};
    messages.forEach(m => {
      const sender = m.sender_name || 'Unknown';
      senders[sender] = (senders[sender] || 0) + 1;
    });

    const topSenders = Object.entries(senders)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    console.log('\n   🏆 Top 5 Senders:');
    topSenders.forEach(([sender, count], i) => {
      const pct = ((count / messages.length) * 100).toFixed(1);
      console.log(`      ${i + 1}. ${sender}: ${count} messages (${pct}%)`);
    });

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('❌ Error exporting to enhanced CSV:', error.message);
    throw error;
  }
}

export default {
  exportToEnhancedCSV,
};
