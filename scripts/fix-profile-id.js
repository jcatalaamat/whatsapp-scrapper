import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const YOUR_PROFILE_ID = '520e75eb-b615-4d9a-a369-b218373c6c05';

// Read the INSERTS-README.md file
const insertsPath = path.join(__dirname, '../INSERTS-README.md');
let content = fs.readFileSync(insertsPath, 'utf8');

// Split into lines
const lines = content.split('\n');

// Regular expression to find UUID patterns
const uuidRegex = /^  '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',$/;

let fixedCount = 0;
let isProfileIdLine = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Check if previous line was an id (event id), making this the profile_id line
  if (i > 0 && uuidRegex.test(lines[i - 1]) && uuidRegex.test(line)) {
    // This is a profile_id line (comes right after the event id)
    const currentId = line.match(/'([0-9a-f-]+)'/)[1];

    if (currentId !== YOUR_PROFILE_ID) {
      lines[i] = `  '${YOUR_PROFILE_ID}',`;
      fixedCount++;
      console.log(`Line ${i + 1}: Fixed profile_id from ${currentId} to ${YOUR_PROFILE_ID}`);
    }
  }
}

// Write back the updated content
const updatedContent = lines.join('\n');
fs.writeFileSync(insertsPath, updatedContent, 'utf8');

console.log(`\n✓ Fixed ${fixedCount} profile_id values to use your profile: ${YOUR_PROFILE_ID}`);
