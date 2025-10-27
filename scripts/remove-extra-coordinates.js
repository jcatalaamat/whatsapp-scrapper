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
let removedCount = 0;
let inEventsInsert = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
  const nextNextLine = i + 2 < lines.length ? lines[i + 2] : '';

  // Track if we're in an events INSERT section
  if (line.includes('INSERT INTO events')) {
    inEventsInsert = true;
  } else if (line.includes('INSERT INTO places') || line.includes('INSERT INTO services')) {
    inEventsInsert = false;
  }

  // Look for the pattern of extra coordinates:
  // - Current line is a coordinate (number like 15.6685 or -96.5542)
  // - Next line is also a coordinate
  // - Next-next line is 'mazunte'
  // This indicates extra coordinates that should be removed

  const isCoordinate = /^\s+(-?\d+\.?\d*),?\s*$/.test(line);
  const nextIsCoordinate = /^\s+(-?\d+\.?\d*),?\s*$/.test(nextLine);
  const nextNextIsMazunte = /^\s+'mazunte',?\s*$/.test(nextNextLine);

  if (inEventsInsert && isCoordinate && nextIsCoordinate && nextNextIsMazunte) {
    // Skip this line and the next (both are extra coordinates)
    console.log(`Line ${i + 1}: Removing extra coordinate: ${line.trim()}`);
    console.log(`Line ${i + 2}: Removing extra coordinate: ${nextLine.trim()}`);
    removedCount += 2;
    i++; // Skip the next line too
    continue;
  }

  fixedLines.push(line);
}

// Write back
const fixedContent = fixedLines.join('\n');
fs.writeFileSync(insertsPath, fixedContent, 'utf8');

console.log(`\n✓ Removed ${removedCount} extra coordinate lines`);
console.log(`✓ File updated: ${insertsPath}`);
