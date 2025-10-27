import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the INSERTS-README.md file
const insertsPath = path.join(__dirname, '../INSERTS-README.md');
let content = fs.readFileSync(insertsPath, 'utf8');

// Track all IDs we've seen and their line numbers
const idsUsed = new Map();
let duplicateCount = 0;

// Split into lines for easier processing
const lines = content.split('\n');

// Regular expression to find UUID patterns in the ID field
const uuidRegex = /^  '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',$/;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Check if this line looks like an ID line (after VALUES keyword)
  if (uuidRegex.test(line)) {
    const id = line.match(/'([0-9a-f-]+)'/)[1];

    if (idsUsed.has(id)) {
      // This is a duplicate! Generate a new UUID
      const newUuid = randomUUID();
      lines[i] = `  '${newUuid}',`;
      duplicateCount++;
      console.log(`Line ${i + 1}: Replaced duplicate ${id} with ${newUuid}`);
    } else {
      idsUsed.set(id, i);
    }
  }
}

// Write back the updated content
const updatedContent = lines.join('\n');
fs.writeFileSync(insertsPath, updatedContent, 'utf8');

console.log(`\n✓ Fixed ${duplicateCount} duplicate IDs`);
console.log(`✓ Total unique events: ${idsUsed.size}`);
