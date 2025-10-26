/**
 * WhatsApp Listener for Mazunte Connect
 * Main entry point
 */

import config from './config.js';
import { setupSessionPersistence } from './session-manager.js';
import { initializeClient, startClient, stopClient } from './whatsapp-client.js';
import { testConnection } from './supabase-client.js';

/**
 * Main function
 */
async function main() {
  console.log('🌿 WhatsApp Listener for Mazunte Connect');
  console.log('==========================================\n');

  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('\n❌ Cannot connect to database. Please check your configuration.');
      console.error('   SUPABASE_URL and SUPABASE_SERVICE_KEY must be set correctly.\n');
      process.exit(1);
    }

    // Setup session persistence
    console.log('🔧 Setting up session persistence...');
    await setupSessionPersistence();

    // Initialize WhatsApp client
    const client = initializeClient();

    // Start the client
    await startClient();

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
