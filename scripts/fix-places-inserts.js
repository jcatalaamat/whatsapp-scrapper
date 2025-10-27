import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_PROFILE_ID = '520e75eb-b615-4d9a-a369-b218373c6c05';

// Read the INSERTS-README.md file
const insertsPath = path.join(__dirname, '../INSERTS-README.md');
let content = fs.readFileSync(insertsPath, 'utf8');

// Split into lines
const lines = content.split('\n');
const fixedLines = [];
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Check if this is a places INSERT section with the problematic pattern
  if (line.includes('INSERT INTO places') && i + 1 < lines.length) {
    // Keep the INSERT INTO places line
    fixedLines.push(line);

    // Look ahead to find the column list and fix the trailing comma
    let j = i + 1;
    let inColumnList = false;

    while (j < lines.length) {
      const currentLine = lines[j];

      // Detect column list section
      if (currentLine.includes('id, name, type, category') || currentLine.includes('city_id, verified, created_by')) {
        inColumnList = true;
      }

      // Fix the trailing comma after created_by
      if (inColumnList && currentLine.match(/^\s*created_by\s*$/)) {
        fixedLines.push(currentLine);
        j++;
        // Skip to next line and fix the closing paren with comma
        if (lines[j] && lines[j].match(/^\s*\)\s+VALUES\s+\(/)) {
          fixedLines.push(') VALUES (');
          fixCount++;
          i = j;
          break;
        }
      } else if (currentLine.includes(') VALUES (')) {
        fixedLines.push(currentLine);
        i = j;
        break;
      } else {
        fixedLines.push(currentLine);
      }

      j++;
    }
    continue;
  }

  fixedLines.push(line);
}

// Write back
const fixedContent = fixedLines.join('\n');
fs.writeFileSync(insertsPath, fixedContent, 'utf8');

console.log(`\n✓ Fixed ${fixCount} places INSERT statements`);
console.log(`✓ File updated: ${insertsPath}`);
