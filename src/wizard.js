/**
 * Interactive Configuration Wizard
 * Helps users set up and run the WhatsApp listener
 */

import readline from 'readline';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ENV_PATH = join(__dirname, '..', '.env');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Promisified question function
 * @param {string} question - Question to ask
 * @returns {Promise<string>} User's answer
 */
function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Display wizard header
 */
function displayHeader() {
  console.log('\n' + '='.repeat(80));
  console.log('🧙 WhatsApp Listener Configuration Wizard');
  console.log('='.repeat(80));
  console.log('');
}

/**
 * Display main menu
 */
async function displayMainMenu() {
  console.log('\n📋 What would you like to do?\n');
  console.log('  1. 🚀 Start Live Mode (monitor new messages → Supabase)');
  console.log('  2. 📚 Start Backfill Mode (fetch old messages first → Supabase, then monitor)');
  console.log('  3. 🧪 Start Local Test Mode (monitor new messages → JSON file)');
  console.log('  4. 📚🧪 Start Local Backfill Mode (fetch old messages → JSON file, then monitor)');
  console.log('  5. ⚙️  Configure Settings (.env file)');
  console.log('  6. 📊 View Current Configuration');
  console.log('  7. ❌ Exit');
  console.log('');

  const choice = await ask('Enter your choice (1-7): ');
  return choice;
}

/**
 * Read current .env file
 * @returns {Object} Parsed env variables
 */
function readEnvFile() {
  if (!existsSync(ENV_PATH)) {
    return {};
  }

  const content = readFileSync(ENV_PATH, 'utf-8');
  const env = {};

  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return env;
}

/**
 * Update .env file with new values
 * @param {Object} updates - Key-value pairs to update
 */
function updateEnvFile(updates) {
  let content = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, 'utf-8') : '';

  Object.entries(updates).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
  });

  writeFileSync(ENV_PATH, content, 'utf-8');
  console.log(`\n✅ Updated .env file`);
}

/**
 * Display current configuration
 */
async function viewConfiguration() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 CURRENT CONFIGURATION');
  console.log('='.repeat(80));

  const env = readEnvFile();

  console.log('\n🔧 Operation Mode:');
  console.log(`   OPERATION_MODE: ${env.OPERATION_MODE || 'live (default)'}`);
  console.log(`   LOCAL_MODE: ${env.LOCAL_MODE || 'false (default)'}`);

  console.log('\n📚 Backfill Settings:');
  console.log(`   BACKFILL_ENABLED: ${env.BACKFILL_ENABLED || 'false (default)'}`);
  console.log(`   BACKFILL_MESSAGE_LIMIT: ${env.BACKFILL_MESSAGE_LIMIT || '100 (default)'}`);
  console.log(`   BACKFILL_ON_STARTUP: ${env.BACKFILL_ON_STARTUP || 'false (default)'}`);

  console.log('\n🎯 WhatsApp Groups:');
  const groups = env.WHATSAPP_GROUPS || 'Not configured';
  if (groups !== 'Not configured') {
    groups.split(',').forEach((group, i) => {
      console.log(`   ${i + 1}. ${group.trim()}`);
    });
  } else {
    console.log(`   ${groups}`);
  }

  console.log('\n💾 Storage:');
  console.log(`   Database: ${env.DATABASE_URL ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Supabase: ${env.SUPABASE_URL ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Local File: ${env.LOCAL_OUTPUT_FILE || './data/messages.json (default)'}`);

  console.log('\n' + '='.repeat(80));

  await ask('\nPress Enter to continue...');
}

/**
 * Configure settings
 */
async function configureSettings() {
  console.log('\n' + '='.repeat(80));
  console.log('⚙️  CONFIGURE SETTINGS');
  console.log('='.repeat(80));

  const env = readEnvFile();
  const updates = {};

  console.log('\n📚 Backfill Settings:\n');

  const backfillEnabled = await ask(`Enable backfill on startup? (yes/no) [${env.BACKFILL_ENABLED || 'no'}]: `);
  if (backfillEnabled) {
    updates.BACKFILL_ENABLED = backfillEnabled.toLowerCase() === 'yes' ? 'true' : 'false';
  }

  const messageLimit = await ask(`Number of messages to fetch per group? [${env.BACKFILL_MESSAGE_LIMIT || '100'}]: `);
  if (messageLimit) {
    updates.BACKFILL_MESSAGE_LIMIT = messageLimit;
  }

  console.log('\n🧪 Local Test Mode:\n');

  const localMode = await ask(`Save to local JSON instead of database? (yes/no) [${env.LOCAL_MODE || 'no'}]: `);
  if (localMode) {
    updates.LOCAL_MODE = localMode.toLowerCase() === 'yes' ? 'true' : 'false';
  }

  if (Object.keys(updates).length > 0) {
    updateEnvFile(updates);
  } else {
    console.log('\n✅ No changes made');
  }

  await ask('\nPress Enter to continue...');
}

/**
 * Start live mode
 */
async function startLiveMode() {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 STARTING LIVE MODE');
  console.log('='.repeat(80));
  console.log('\n✅ Live mode will monitor for NEW messages only');
  console.log('💾 Messages will be saved to Supabase database');
  console.log('\n⚠️  Make sure you have:');
  console.log('   1. Configured DATABASE_URL in .env');
  console.log('   2. Configured SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
  console.log('   3. Set WHATSAPP_GROUPS in .env');

  const confirm = await ask('\n▶️  Start live mode now? (yes/no): ');

  if (confirm.toLowerCase() === 'yes') {
    rl.close();
    updateEnvFile({ OPERATION_MODE: 'live', LOCAL_MODE: 'false', BACKFILL_ON_STARTUP: 'false' });
    console.log('\n🚀 Launching live mode...\n');

    // Import and start the main service
    const { default: startService } = await import('./index.js');
  } else {
    console.log('\n❌ Cancelled');
  }
}

/**
 * Start backfill mode
 */
async function startBackfillMode() {
  console.log('\n' + '='.repeat(80));
  console.log('📚 STARTING BACKFILL MODE');
  console.log('='.repeat(80));
  console.log('\n✅ Backfill mode will:');
  console.log('   1. Fetch historical messages from your groups');
  console.log('   2. Save them to the database');
  console.log('   3. Then start monitoring for new messages');

  const env = readEnvFile();
  const limit = await ask(`\nHow many messages to fetch per group? [${env.BACKFILL_MESSAGE_LIMIT || '100'}]: `);

  const messageLimit = limit || env.BACKFILL_MESSAGE_LIMIT || '100';

  const confirm = await ask(`\n▶️  Fetch up to ${messageLimit} messages per group? (yes/no): `);

  if (confirm.toLowerCase() === 'yes') {
    rl.close();
    updateEnvFile({
      OPERATION_MODE: 'backfill',
      LOCAL_MODE: 'false',
      BACKFILL_ENABLED: 'true',
      BACKFILL_ON_STARTUP: 'true',
      BACKFILL_MESSAGE_LIMIT: messageLimit,
    });
    console.log('\n🚀 Launching backfill mode...\n');

    // Import and start the main service
    const { default: startService } = await import('./index.js');
  } else {
    console.log('\n❌ Cancelled');
  }
}

/**
 * Start local test mode
 */
async function startLocalTestMode() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 STARTING LOCAL TEST MODE');
  console.log('='.repeat(80));
  console.log('\n✅ Local test mode will:');
  console.log('   1. Monitor for NEW messages only');
  console.log('   2. Save them to a local JSON file');
  console.log('   3. NOT touch the Supabase database');

  const env = readEnvFile();
  const outputFile = env.LOCAL_OUTPUT_FILE || './data/messages.json';

  console.log(`\n💾 Messages will be saved to: ${outputFile}`);

  const confirm = await ask('\n▶️  Start local test mode now? (yes/no): ');

  if (confirm.toLowerCase() === 'yes') {
    rl.close();
    updateEnvFile({ OPERATION_MODE: 'local_test', LOCAL_MODE: 'true', BACKFILL_ON_STARTUP: 'false' });
    console.log('\n🚀 Launching local test mode...\n');

    // Import and start the main service
    const { default: startService } = await import('./index.js');
  } else {
    console.log('\n❌ Cancelled');
  }
}

/**
 * Start local backfill mode
 */
async function startLocalBackfillMode() {
  console.log('\n' + '='.repeat(80));
  console.log('📚🧪 STARTING LOCAL BACKFILL MODE');
  console.log('='.repeat(80));
  console.log('\n✅ Local backfill mode will:');
  console.log('   1. Fetch historical messages from your groups');
  console.log('   2. Save them to a local JSON file');
  console.log('   3. Then start monitoring for new messages');
  console.log('   4. NOT touch the Supabase database');

  const env = readEnvFile();
  const limit = await ask(`\nHow many messages to fetch per group? [${env.BACKFILL_MESSAGE_LIMIT || '100'}]: `);
  const messageLimit = limit || env.BACKFILL_MESSAGE_LIMIT || '100';

  const outputFile = env.LOCAL_OUTPUT_FILE || './data/messages.json';
  console.log(`\n💾 Messages will be saved to: ${outputFile}`);

  const confirm = await ask(`\n▶️  Fetch up to ${messageLimit} messages per group to JSON file? (yes/no): `);

  if (confirm.toLowerCase() === 'yes') {
    rl.close();
    updateEnvFile({
      OPERATION_MODE: 'local_backfill',
      LOCAL_MODE: 'true',
      BACKFILL_ENABLED: 'true',
      BACKFILL_ON_STARTUP: 'true',
      BACKFILL_MESSAGE_LIMIT: messageLimit,
    });
    console.log('\n🚀 Launching local backfill mode...\n');

    // Import and start the main service
    const { default: startService } = await import('./index.js');
  } else {
    console.log('\n❌ Cancelled');
  }
}

/**
 * Main wizard function
 */
export async function runWizard() {
  displayHeader();

  let running = true;

  while (running) {
    const choice = await displayMainMenu();

    switch (choice) {
      case '1':
        await startLiveMode();
        running = false;
        break;

      case '2':
        await startBackfillMode();
        running = false;
        break;

      case '3':
        await startLocalTestMode();
        running = false;
        break;

      case '4':
        await startLocalBackfillMode();
        running = false;
        break;

      case '5':
        await configureSettings();
        break;

      case '6':
        await viewConfiguration();
        break;

      case '7':
        console.log('\n👋 Goodbye!\n');
        rl.close();
        running = false;
        process.exit(0);
        break;

      default:
        console.log('\n❌ Invalid choice. Please enter 1-7.');
    }
  }
}

// Run wizard if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runWizard().catch(error => {
    console.error('❌ Wizard error:', error);
    rl.close();
    process.exit(1);
  });
}

export default { runWizard };
