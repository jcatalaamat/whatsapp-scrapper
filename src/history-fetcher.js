/**
 * History Fetcher Module
 * Fetches historical messages from WhatsApp groups
 */

import { handleMessage } from './message-handler.js';
import config from './config.js';

/**
 * Fetch historical messages from a chat
 * @param {Object} chat - WhatsApp chat object
 * @param {number} limit - Number of messages to fetch
 * @returns {Promise<Object>} Fetch results
 */
async function fetchChatHistory(chat, limit = 100) {
  try {
    console.log(`\n📚 Fetching up to ${limit} messages from "${chat.name}"...`);

    const messages = await chat.fetchMessages({ limit });

    console.log(`✅ Retrieved ${messages.length} messages from "${chat.name}"`);

    return {
      chatName: chat.name,
      chatId: chat.id._serialized,
      messageCount: messages.length,
      messages: messages,
    };
  } catch (error) {
    console.error(`❌ Error fetching history from "${chat.name}":`, error.message);
    return {
      chatName: chat.name,
      chatId: chat.id._serialized,
      messageCount: 0,
      messages: [],
      error: error.message,
    };
  }
}

/**
 * Process fetched messages through the message handler
 * @param {Array} messages - Array of WhatsApp messages
 * @param {Object} chat - WhatsApp chat object
 * @returns {Promise<Object>} Processing results
 */
async function processHistoricalMessages(messages, chat) {
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n⚙️  Processing ${messages.length} historical messages...`);

  for (const message of messages) {
    try {
      // Use the existing message handler
      await handleMessage(message, chat);
      processed++;

      // Show progress every 10 messages
      if (processed % 10 === 0) {
        console.log(`   Progress: ${processed}/${messages.length} messages processed`);
      }
    } catch (error) {
      if (error.message.includes('Not one of our monitored groups') ||
          error.message.includes('Only process group messages')) {
        skipped++;
      } else {
        errors++;
        console.error(`   Error processing message: ${error.message}`);
      }
    }
  }

  return {
    total: messages.length,
    processed,
    skipped,
    errors,
  };
}

/**
 * Backfill historical messages from all monitored groups
 * @param {Object} client - WhatsApp client instance
 * @param {number} messageLimit - Number of messages to fetch per group
 * @returns {Promise<Object>} Backfill summary
 */
export async function backfillHistory(client, messageLimit = 100) {
  console.log('\n' + '='.repeat(80));
  console.log('📚 BACKFILL MODE - Fetching Historical Messages');
  console.log('='.repeat(80));

  const monitoredGroups = config.whatsapp.groups;
  console.log(`\n🎯 Target groups (${monitoredGroups.length}):`);
  monitoredGroups.forEach((group, i) => {
    console.log(`   ${i + 1}. ${group}`);
  });

  const results = {
    totalGroups: 0,
    successfulGroups: 0,
    failedGroups: 0,
    totalMessages: 0,
    processedMessages: 0,
    skippedMessages: 0,
    errors: 0,
    details: [],
  };

  try {
    // Get all chats
    const chats = await client.getChats();
    console.log(`\n🔍 Scanning ${chats.length} total chats...`);

    // Filter for monitored groups
    const targetChats = chats.filter(chat => {
      return chat.isGroup && monitoredGroups.includes(chat.name);
    });

    console.log(`\n✅ Found ${targetChats.length} monitored groups`);

    if (targetChats.length === 0) {
      console.log('\n⚠️  No monitored groups found!');
      console.log('💡 Make sure the group names in .env exactly match the WhatsApp group names');
      return results;
    }

    // Fetch history from each group
    for (const chat of targetChats) {
      results.totalGroups++;

      const fetchResult = await fetchChatHistory(chat, messageLimit);

      if (fetchResult.error) {
        results.failedGroups++;
        results.details.push({
          group: fetchResult.chatName,
          status: 'failed',
          error: fetchResult.error,
        });
        continue;
      }

      // Process the fetched messages
      const processResult = await processHistoricalMessages(
        fetchResult.messages,
        chat
      );

      results.successfulGroups++;
      results.totalMessages += processResult.total;
      results.processedMessages += processResult.processed;
      results.skippedMessages += processResult.skipped;
      results.errors += processResult.errors;

      results.details.push({
        group: fetchResult.chatName,
        status: 'success',
        total: processResult.total,
        processed: processResult.processed,
        skipped: processResult.skipped,
        errors: processResult.errors,
      });
    }

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 BACKFILL SUMMARY');
    console.log('='.repeat(80));
    console.log(`\n✅ Groups processed: ${results.successfulGroups}/${results.totalGroups}`);
    console.log(`📨 Total messages fetched: ${results.totalMessages}`);
    console.log(`💾 Messages saved: ${results.processedMessages}`);
    console.log(`⏭️  Messages skipped: ${results.skippedMessages}`);
    console.log(`❌ Errors: ${results.errors}`);

    console.log('\n📋 Details by group:');
    results.details.forEach((detail, i) => {
      console.log(`\n   ${i + 1}. ${detail.group}`);
      if (detail.status === 'success') {
        console.log(`      ✅ ${detail.processed} messages saved`);
        console.log(`      ⏭️  ${detail.skipped} messages skipped`);
        if (detail.errors > 0) {
          console.log(`      ⚠️  ${detail.errors} errors`);
        }
      } else {
        console.log(`      ❌ Failed: ${detail.error}`);
      }
    });

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('\n❌ Backfill failed:', error.message);
    console.error(error.stack);
  }

  return results;
}

/**
 * Fetch history from a single group by name
 * @param {Object} client - WhatsApp client instance
 * @param {string} groupName - Name of the group
 * @param {number} messageLimit - Number of messages to fetch
 * @returns {Promise<Object>} Fetch results
 */
export async function backfillSingleGroup(client, groupName, messageLimit = 100) {
  console.log(`\n📚 Fetching history for "${groupName}"...`);

  try {
    const chats = await client.getChats();
    const targetChat = chats.find(chat => chat.isGroup && chat.name === groupName);

    if (!targetChat) {
      console.log(`\n❌ Group "${groupName}" not found`);
      console.log('\n💡 Available groups:');
      const groups = chats.filter(c => c.isGroup);
      groups.slice(0, 10).forEach((g, i) => {
        console.log(`   ${i + 1}. ${g.name}`);
      });
      return null;
    }

    const fetchResult = await fetchChatHistory(targetChat, messageLimit);

    if (!fetchResult.error) {
      const processResult = await processHistoricalMessages(
        fetchResult.messages,
        targetChat
      );

      console.log(`\n✅ Processed ${processResult.processed} messages`);
      return processResult;
    }

    return null;
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    return null;
  }
}

export default {
  backfillHistory,
  backfillSingleGroup,
};
