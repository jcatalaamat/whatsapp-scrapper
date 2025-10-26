/**
 * Configuration Management
 * Loads and validates environment variables
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

/**
 * Validates that required environment variables are set
 * @param {string[]} requiredVars - Array of required variable names
 * @throws {Error} If any required variable is missing
 */
function validateEnv(requiredVars) {
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      'Please check your .env file or environment configuration.'
    );
  }
}

// Validate required variables
const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'WHATSAPP_GROUPS',
];

try {
  validateEnv(requiredVars);
} catch (error) {
  console.error('\n❌ Configuration Error:');
  console.error(error.message);
  process.exit(1);
}

/**
 * Parse comma-separated group names
 * @returns {string[]} Array of group names
 */
function parseGroupNames() {
  const groupsStr = process.env.WHATSAPP_GROUPS || '';
  return groupsStr
    .split(',')
    .map(g => g.trim())
    .filter(g => g.length > 0);
}

// Configuration object
const config = {
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    storageBucket: process.env.SUPABASE_STORAGE_BUCKET || 'whatsapp-media',
  },

  // WhatsApp
  whatsapp: {
    groups: parseGroupNames(),
    sessionId: process.env.WHATSAPP_SESSION_ID || 'default',
  },

  // Optional features
  features: {
    runMigrations: process.env.RUN_MIGRATIONS === 'true',
    enableKeywordFilter: process.env.ENABLE_KEYWORD_FILTER === 'true',
    filterKeywords: (process.env.FILTER_KEYWORDS || '')
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0),
  },

  // Server
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },

  // Database (for migrations)
  database: {
    connectionString: process.env.DATABASE_URL || `postgresql://postgres:${process.env.SUPABASE_SERVICE_KEY}@db.${process.env.SUPABASE_URL?.split('//')[1]?.split('.')[0]}.supabase.co:5432/postgres`,
  },
};

// Validation checks
if (config.whatsapp.groups.length === 0) {
  console.error('\n❌ Configuration Error:');
  console.error('WHATSAPP_GROUPS must contain at least one group name.');
  console.error('Example: WHATSAPP_GROUPS=Group1,Group2,Group3');
  process.exit(1);
}

// Log configuration (safe values only)
if (config.isDevelopment) {
  console.log('\n📋 Configuration loaded:');
  console.log(`  Environment: ${config.nodeEnv}`);
  console.log(`  Supabase URL: ${config.supabase.url}`);
  console.log(`  Storage Bucket: ${config.supabase.storageBucket}`);
  console.log(`  WhatsApp Groups (${config.whatsapp.groups.length}):`);
  config.whatsapp.groups.forEach((group, i) => {
    console.log(`    ${i + 1}. ${group}`);
  });
  console.log(`  Keyword Filter: ${config.features.enableKeywordFilter ? 'Enabled' : 'Disabled'}`);
  if (config.features.enableKeywordFilter && config.features.filterKeywords.length > 0) {
    console.log(`  Filter Keywords: ${config.features.filterKeywords.join(', ')}`);
  }
  console.log('');
}

export default config;
