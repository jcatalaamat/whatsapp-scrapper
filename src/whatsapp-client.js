/**
 * WhatsApp Client
 * Manages WhatsApp Web connection and message listening
 */

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { handleMessage, startStatsLogger, getMonitoredGroups } from './message-handler.js';
import { backupSession } from './session-manager.js';
import config from './config.js';

let client = null;
let isReady = false;

/**
 * Initialize WhatsApp client
 * @returns {Client} WhatsApp client instance
 */
export function initializeClient() {
  console.log('🔧 Initializing WhatsApp client...');

  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: './.wwebjs_auth',
    }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    },
  });

  setupEventHandlers();

  return client;
}

/**
 * Setup WhatsApp client event handlers
 */
function setupEventHandlers() {
  // QR Code event
  client.on('qr', (qr) => {
    console.log('\n' + '='.repeat(80));
    console.log('📱 WHATSAPP QR CODE - SCAN WITH YOUR PHONE');
    console.log('='.repeat(80));

    // Check if user wants link-only mode (no ASCII QR)
    const forceLinkOnly = process.env.FORCE_LINK_ONLY === 'true';

    if (forceLinkOnly) {
      console.log('\n⚠️  Terminal QR display is disabled (FORCE_LINK_ONLY=true)');
      console.log('\n❌ Note: qrcode.show does NOT work with WhatsApp authentication codes');
      console.log('✅ To see the QR code, set FORCE_LINK_ONLY=false in your .env file\n');
      console.log('💡 QR Code will refresh in 20 seconds...\n');
    } else {
      // Display instructions
      console.log('\n📱 HOW TO SCAN:');
      console.log('   1. Open WhatsApp on your phone');
      console.log('   2. Tap Menu (⋮) or Settings');
      console.log('   3. Tap "Linked Devices"');
      console.log('   4. Tap "Link a Device"');
      console.log('   5. Point your phone at the QR code below\n');

      console.log('='.repeat(80));
      console.log('👇 SCAN THIS QR CODE WITH WHATSAPP ON YOUR PHONE:');
      console.log('='.repeat(80) + '\n');

      try {
        // Generate ASCII QR code
        qrcode.generate(qr, { small: true });
      } catch (error) {
        console.log('[ERROR] Failed to generate QR code:', error.message);
        console.log('⚠️  Your terminal may not support QR code display');
        console.log('💡 Try setting FORCE_LINK_ONLY=true in .env and restart\n');
      }

      console.log('\n' + '='.repeat(80));
      console.log('💡 QR Code will refresh in 20 seconds...');
      console.log('💡 Make sure to scan it before it refreshes!\n');
    }
  });

  // Ready event
  client.on('ready', async () => {
    console.log('\n✅ WhatsApp client is ready!');
    isReady = true;

    // Backup session to Supabase
    try {
      await backupSession();
    } catch (error) {
      console.error('⚠️  Failed to backup session:', error.message);
    }

    // Display monitored groups
    const groups = getMonitoredGroups();
    console.log(`\n👀 Monitoring ${groups.length} group(s):`);
    groups.forEach((group, i) => {
      console.log(`   ${i + 1}. ${group}`);
    });
    console.log('\n🎧 Listening for messages...\n');

    // List all chats to verify group names
    try {
      const chats = await client.getChats();
      const groupChats = chats.filter(chat => chat.isGroup);

      console.log(`📋 Found ${groupChats.length} total groups in your WhatsApp:`);
      groupChats.slice(0, 10).forEach((chat, i) => {
        const isMonitored = groups.includes(chat.name);
        const indicator = isMonitored ? '✅' : '⚪';
        console.log(`   ${indicator} ${chat.name}`);
      });
      if (groupChats.length > 10) {
        console.log(`   ... and ${groupChats.length - 10} more`);
      }
      console.log('');
    } catch (error) {
      console.error('⚠️  Could not list groups:', error.message);
    }

    // Start periodic stats logger (every hour)
    startStatsLogger(3600000);
  });

  // Authenticated event
  client.on('authenticated', () => {
    console.log('✅ WhatsApp authentication successful');
  });

  // Authentication failure event
  client.on('auth_failure', (msg) => {
    console.error('❌ WhatsApp authentication failed:', msg);
    console.log('💡 You may need to scan the QR code again');
  });

  // Disconnected event
  client.on('disconnected', (reason) => {
    console.log(`⚠️  WhatsApp client disconnected: ${reason}`);
    console.log('🔄 Attempting to reconnect...');
    isReady = false;
  });

  // Message event
  client.on('message', async (message) => {
    try {
      const chat = await message.getChat();
      await handleMessage(message, chat);
    } catch (error) {
      console.error('❌ Error in message event handler:', error.message);
    }
  });

  // Loading screen event (shows connection progress)
  client.on('loading_screen', (percent, message) => {
    console.log(`⏳ Loading: ${percent}% - ${message}`);
  });

  // Error event
  client.on('error', (error) => {
    console.error('❌ WhatsApp client error:', error);
  });
}

/**
 * Start the WhatsApp client
 * @returns {Promise<void>}
 */
export async function startClient() {
  try {
    console.log('🚀 Starting WhatsApp client...');
    await client.initialize();
  } catch (error) {
    console.error('❌ Error starting WhatsApp client:', error.message);
    throw error;
  }
}

/**
 * Stop the WhatsApp client gracefully
 * @returns {Promise<void>}
 */
export async function stopClient() {
  try {
    if (client) {
      console.log('⏸️  Stopping WhatsApp client...');
      await client.destroy();
      console.log('✅ WhatsApp client stopped');
    }
  } catch (error) {
    console.error('❌ Error stopping WhatsApp client:', error.message);
  }
}

/**
 * Check if client is ready
 * @returns {boolean} True if client is ready
 */
export function isClientReady() {
  return isReady;
}

/**
 * Get the WhatsApp client instance
 * @returns {Client|null} Client instance or null
 */
export function getClient() {
  return client;
}

/**
 * Send a test message to verify client is working
 * @param {string} chatId - Chat ID to send test message to
 * @param {string} message - Message to send
 * @returns {Promise<void>}
 */
export async function sendTestMessage(chatId, message) {
  try {
    if (!isReady) {
      throw new Error('Client is not ready');
    }

    await client.sendMessage(chatId, message);
    console.log(`✅ Test message sent to ${chatId}`);
  } catch (error) {
    console.error('❌ Error sending test message:', error.message);
    throw error;
  }
}

/**
 * Get list of all groups the account is part of
 * @returns {Promise<Array>} Array of group chats
 */
export async function listGroups() {
  try {
    if (!isReady) {
      throw new Error('Client is not ready');
    }

    const chats = await client.getChats();
    return chats.filter(chat => chat.isGroup);
  } catch (error) {
    console.error('❌ Error listing groups:', error.message);
    throw error;
  }
}

export default {
  initializeClient,
  startClient,
  stopClient,
  isClientReady,
  getClient,
  sendTestMessage,
  listGroups,
};
