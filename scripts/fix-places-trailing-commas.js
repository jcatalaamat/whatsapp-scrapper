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
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const nextLine = i + 1 < lines.length ? lines[i + 1] : '';

  // Look for lines ending with a comma followed by a closing paren
  // This pattern: "  false," or "  'value'," followed by ");"
  if (line.match(/,\s*$/) && nextLine.match(/^\s*\);?\s*$/)) {
    // Remove the trailing comma
    const fixedLine = line.replace(/,\s*$/, '');
    fixedLines.push(fixedLine);
    fixCount++;
    console.log(`Line ${i + 1}: Removed trailing comma before closing paren`);
  } else {
    fixedLines.push(line);
  }
}

// Write back
const fixedContent = fixedLines.join('\n');
fs.writeFileSync(insertsPath, fixedContent, 'utf8');

console.log(`\n✓ Fixed ${fixCount} trailing commas`);
console.log(`✓ File updated: ${insertsPath}`);
