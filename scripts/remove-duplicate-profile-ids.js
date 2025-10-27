import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_PROFILE_ID = '520e75eb-b615-4d9a-a369-b218373c6c05';

// Read the INSERTS-README.md file
const insertsPath = path.join(__dirname, '../INSERTS-README.md');
let content = fs.readFileSync(insertsPath, 'utf8');

// Split into lines for processing
const lines = content.split('\n');
const fixedLines = [];
let removedCount = 0;
let inInsertValues = false;
let seenProfileId = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Check if we're entering an INSERT VALUES section
  if (line.includes('VALUES (')) {
    inInsertValues = true;
    seenProfileId = false;
    fixedLines.push(line);
    continue;
  }

  // Check if we're exiting an INSERT VALUES section
  if (line.includes(');')) {
    inInsertValues = false;
    seenProfileId = false;
    fixedLines.push(line);
    continue;
  }

  // If we're in VALUES and this is a profile_id line
  if (inInsertValues && line.includes(`'${USER_PROFILE_ID}'`)) {
    if (!seenProfileId) {
      // Keep the first occurrence
      seenProfileId = true;
      fixedLines.push(line);
    } else {
      // Skip duplicate profile_id lines
      removedCount++;
      console.log(`Line ${i + 1}: Removed duplicate profile_id`);
    }
    continue;
  }

  // Keep all other lines
  fixedLines.push(line);
}

// Write back the fixed content
const fixedContent = fixedLines.join('\n');
fs.writeFileSync(insertsPath, fixedContent, 'utf8');

console.log(`\n✓ Removed ${removedCount} duplicate profile_id lines`);
console.log(`✓ File cleaned: ${insertsPath}`);
