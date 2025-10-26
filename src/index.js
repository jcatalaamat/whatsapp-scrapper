/**
 * WhatsApp Listener for Mazunte Connect
 * Main entry point
 */

import config from './config.js';
import { setupSessionPersistence } from './session-manager.js';
import { initializeClient, startClient, stopClient, getClient } from './whatsapp-client.js';
import { testConnection } from './supabase-client.js';
import { backfillHistory } from './history-fetcher.js';

// Check operation mode from env
const OPERATION_MODE = process.env.OPERATION_MODE || 'live';
const LOCAL_MODE = process.env.LOCAL_MODE === 'true';
const BACKFILL_ENABLED = process.env.BACKFILL_ENABLED === 'true';
const BACKFILL_ON_STARTUP = process.env.BACKFILL_ON_STARTUP === 'true';
const BACKFILL_MESSAGE_LIMIT = parseInt(process.env.BACKFILL_MESSAGE_LIMIT || '100', 10);

/**
 * Main function
 */
async function main() {
  console.log('🌿 WhatsApp Listener for Mazunte Connect');
  console.log('==========================================\n');

  // Display operation mode
  if (LOCAL_MODE) {
    console.log('🧪 MODE: Local Test (saving to JSON file)');
  } else if (BACKFILL_ON_STARTUP) {
    console.log('📚 MODE: Backfill (fetch history + monitor)');
  } else {
    console.log('🚀 MODE: Live (monitor new messages only)');
  }
  console.log('');

  try {
    // Test database connection (skip if in local mode)
    if (!LOCAL_MODE) {
      console.log('🔍 Testing database connection...');
      const dbConnected = await testConnection();

      if (!dbConnected) {
        console.error('\n❌ Cannot connect to database. Please check your configuration.');
        console.error('   SUPABASE_URL and SUPABASE_SERVICE_KEY must be set correctly.\n');
        process.exit(1);
      }
    } else {
      console.log('🧪 Skipping database check (local mode)');
    }

    // Setup session persistence
    console.log('🔧 Setting up session persistence...');
    await setupSessionPersistence();

    // Initialize WhatsApp client
    const client = initializeClient();

    // Start the client
    await startClient();

    // Wait for client to be ready if we need to backfill
    if (BACKFILL_ON_STARTUP && BACKFILL_ENABLED) {
      console.log('\n⏳ Waiting for WhatsApp client to be ready...');

      // Wait for ready event
      await new Promise((resolve) => {
        const client = getClient();
        if (client.info && client.info.wid) {
          resolve();
        } else {
          client.once('ready', resolve);
        }
      });

      console.log('✅ Client is ready, starting backfill...\n');

      // Run backfill
      await backfillHistory(getClient(), BACKFILL_MESSAGE_LIMIT);

      console.log('\n✅ Backfill complete, now monitoring for new messages...\n');
    }

    console.log('✨ Service is running...');
    console.log('   Press Ctrl+C to stop\n');
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function shutdown() {
  console.log('\n\n🛑 Shutting down gracefully...');

  try {
    await stopClient();
    console.log('✅ Cleanup complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error.message);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  shutdown();
});

// Start the application
main();
