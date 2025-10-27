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

  // Pattern: After image_url line (https://... or NULL),
  // if next TWO lines are coordinates (numbers),
  // they should be removed

  const isImageUrl = line.match(/^\s+(NULL|'https:\/\/.*'),\s*$/);
  const nextIsCoordinate = nextLine.match(/^\s+(-?\d+\.?\d+),\s*$/);
  const nextNextIsCoordinate = nextNextLine.match(/^\s+(-?\d+\.?\d+),\s*$/);

  if (inEventsInsert && isImageUrl && nextIsCoordinate && nextNextIsCoordinate) {
    // This is the image_url line followed by two coordinates
    // Keep the image_url line, but skip the next two coordinate lines
    fixedLines.push(line);
    console.log(`Line ${i + 2}: Removing misplaced coordinate: ${nextLine.trim()}`);
    console.log(`Line ${i + 3}: Removing misplaced coordinate: ${nextNextLine.trim()}`);
    removedCount += 2;
    i += 2; // Skip the next two lines
    continue;
  }

  fixedLines.push(line);
}

// Write back
const fixedContent = fixedLines.join('\n');
fs.writeFileSync(insertsPath, fixedContent, 'utf8');

console.log(`\n✓ Removed ${removedCount} misplaced coordinate lines`);
console.log(`✓ File updated: ${insertsPath}`);
