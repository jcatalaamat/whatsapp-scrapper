import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the INSERTS-README.md file
const insertsPath = path.join(__dirname, '../INSERTS-README.md');
let content = fs.readFileSync(insertsPath, 'utf8');

// Split into lines
const lines = content.split('\n');
const fixedLines = [];
let addedCount = 0;
let inEventsInsert = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const nextLine = i + 1 < lines.length ? lines[i + 1] : '';

  // Track if we're in an events INSERT section
  if (line.includes('INSERT INTO events')) {
    inEventsInsert = true;
  } else if (line.includes('INSERT INTO places') || line.includes('INSERT INTO services')) {
    inEventsInsert = false;
  }

  // Look for the pattern where contact_whatsapp is followed directly by city_id
  // contact_whatsapp will be a phone number or NULL
  // city_id will be 'mazunte' (a string, not a phone number)

  const isContactValue = line.match(/^\s+('[0-9]+',|NULL,)\s*$/);
  const nextIsCityId = nextLine.match(/^\s+'mazunte',\s*$/);

  if (inEventsInsert && isContactValue && nextIsCityId) {
    // This is the contact_whatsapp line, and it's followed directly by city_id
    // We need to insert contact_instagram and contact_email (both NULL) here
    fixedLines.push(line);
    fixedLines.push('  NULL,'); // contact_instagram
    fixedLines.push('  NULL,'); // contact_email
    addedCount++;
    console.log(`Line ${i + 1}: Added missing contact_instagram and contact_email after ${line.trim()}`);
    continue;
  }

  fixedLines.push(line);
}

// Write back
const fixedContent = fixedLines.join('\n');
fs.writeFileSync(insertsPath, fixedContent, 'utf8');

console.log(`\n✓ Added missing fields to ${addedCount} events`);
console.log(`✓ File updated: ${insertsPath}`);
