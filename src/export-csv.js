/**
 * Export Messages to CSV
 * Exports messages from local storage or Supabase to CSV format
 */

import { writeFileSync } from 'fs';
import { getAllMessagesLocal } from './local-storage.js';

/**
 * Convert message data to CSV row
 * @param {Object} message - Message object
 * @returns {string} CSV row
 */
function messageToCSVRow(message) {
  // Escape quotes in fields
  const escape = (str) => {
    if (str === null || str === undefined) return '';
    return `"${String(str).replace(/"/g, '""')}"`;
  };

  return [
    escape(message.id || ''),
    escape(message.created_at || ''),
    escape(message.group_name || ''),
    escape(message.sender_name || ''),
    escape(message.sender_phone || ''),
    escape(message.message_body || ''),
    escape(message.message_type || ''),
    escape(message.media_url || ''),
    escape(message.media_mimetype || ''),
    escape(message.timestamp || ''),
    escape(message.approval_status || ''),
    escape(message.processed || ''),
  ].join(',');
}

/**
 * Export messages to CSV file
 * @param {string} outputPath - Path to output CSV file
 * @param {boolean} fromLocal - Whether to export from local storage (true) or Supabase (false)
 * @returns {Promise<void>}
 */
export async function exportToCSV(outputPath, fromLocal = true) {
  try {
    console.log('\n📤 Exporting messages to CSV...');

    let messages;

    if (fromLocal) {
      messages = await getAllMessagesLocal();
      console.log(`✅ Loaded ${messages.length} messages from local storage`);
    } else {
      // TODO: Add Supabase export when needed
      const { supabase } = await import('./supabase-client.js');
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      messages = data;
      console.log(`✅ Loaded ${messages.length} messages from Supabase`);
    }

    if (messages.length === 0) {
      console.log('⚠️  No messages to export');
      return;
    }

    // CSV Header
    const header = [
      'id',
      'created_at',
      'group_name',
      'sender_name',
      'sender_phone',
      'message_body',
      'message_type',
      'media_url',
      'media_mimetype',
      'timestamp',
      'approval_status',
      'processed',
    ].join(',');

    // Convert messages to CSV rows
    const rows = messages.map(messageToCSVRow);

    // Combine header and rows
    const csv = [header, ...rows].join('\n');

    // Write to file
    writeFileSync(outputPath, csv, 'utf-8');

    console.log(`✅ Exported ${messages.length} messages to ${outputPath}`);
    console.log('\n📊 Export Summary:');
    console.log(`   Total messages: ${messages.length}`);

    const messageTypes = {};
    messages.forEach(m => {
      const type = m.message_type || 'text';
      messageTypes[type] = (messageTypes[type] || 0) + 1;
    });

    console.log('\n   By type:');
    Object.entries(messageTypes).forEach(([type, count]) => {
      console.log(`      ${type}: ${count}`);
    });

    const mediaCount = messages.filter(m => m.media_url).length;
    console.log(`\n   Messages with media: ${mediaCount}`);
    console.log(`   Text-only messages: ${messages.length - mediaCount}`);

  } catch (error) {
    console.error('❌ Error exporting to CSV:', error.message);
    throw error;
  }
}

/**
 * Export with filtering options
 * @param {string} outputPath - Path to output CSV file
 * @param {Object} options - Filter options
 * @returns {Promise<void>}
 */
export async function exportToCSVWithFilter(outputPath, options = {}) {
  const {
    groupName = null,
    messageType = null,
    approvalStatus = null,
    fromLocal = true,
  } = options;

  try {
    console.log('\n📤 Exporting filtered messages to CSV...');

    let messages;

    if (fromLocal) {
      messages = await getAllMessagesLocal();
    } else {
      const { supabase } = await import('./supabase-client.js');
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      messages = data;
    }

    // Apply filters
    if (groupName) {
      messages = messages.filter(m => m.group_name === groupName);
      console.log(`   Filtered to group: ${groupName}`);
    }

    if (messageType) {
      messages = messages.filter(m => m.message_type === messageType);
      console.log(`   Filtered to type: ${messageType}`);
    }

    if (approvalStatus) {
      messages = messages.filter(m => m.approval_status === approvalStatus);
      console.log(`   Filtered to status: ${approvalStatus}`);
    }

    if (messages.length === 0) {
      console.log('⚠️  No messages match the filters');
      return;
    }

    // Export filtered messages
    const header = [
      'id',
      'created_at',
      'group_name',
      'sender_name',
      'sender_phone',
      'message_body',
      'message_type',
      'media_url',
      'media_mimetype',
      'timestamp',
      'approval_status',
      'processed',
    ].join(',');

    const rows = messages.map(messageToCSVRow);
    const csv = [header, ...rows].join('\n');

    writeFileSync(outputPath, csv, 'utf-8');

    console.log(`✅ Exported ${messages.length} filtered messages to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error exporting filtered CSV:', error.message);
    throw error;
  }
}

export default {
  exportToCSV,
  exportToCSVWithFilter,
};
