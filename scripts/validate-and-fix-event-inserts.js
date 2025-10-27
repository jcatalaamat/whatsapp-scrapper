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

let i = 0;
while (i < lines.length) {
  const line = lines[i];

  // Look for INSERT INTO events
  if (line.includes('INSERT INTO events')) {
    // Copy INSERT and column definition
    fixedLines.push(line); // INSERT INTO events
    i++;

    // Copy all column definition lines until VALUES
    while (i < lines.length && !lines[i].includes('VALUES')) {
      fixedLines.push(lines[i]);
      i++;
    }

    if (i >= lines.length) break;
    fixedLines.push(lines[i]); // ) VALUES (
    i++;

    // Now collect all value lines until );
    const valueLines = [];
    while (i < lines.length && !lines[i].match(/^\s*\);?\s*$/)) {
      valueLines.push(lines[i]);
      i++;
    }

    // Count actual values (lines that look like values)
    const actualValues = valueLines.filter(l =>
      l.match(/^\s+/) && !l.match(/^\s*--/) && l.trim().length > 0
    );

    if (actualValues.length !== 19) {
      console.log(`\nFound INSERT with ${actualValues.length} values (expected 19)`);

      // Strategy: Remove extra NULLs that appear before 'mazunte'
      // Find 'mazunte' and 'pending', they should be the last 2 values
      const mazunteIndex = actualValues.findIndex(l => l.includes("'mazunte'"));
      const pendingIndex = actualValues.findIndex(l => l.includes("'pending'"));

      if (mazunteIndex > 0 && pendingIndex > 0) {
        // Count how many values before mazunte
        const valuesBefore = mazunteIndex;
        const shouldBeBefore = 17; // 17 values before city_id
        const excess = valuesBefore - shouldBeBefore;

        if (excess > 0) {
          console.log(`  Removing ${excess} excess NULL values before 'mazunte'`);

          // Remove excess NULLs working backwards from mazunte
          let removed = 0;
          const filtered = [];
          for (let j = 0; j < actualValues.length; j++) {
            if (j < mazunteIndex && removed < excess && actualValues[j].trim() === 'NULL,') {
              // Skip this NULL
              removed++;
              fixCount++;
            } else {
              filtered.push(actualValues[j]);
            }
          }

          // Add the filtered values
          filtered.forEach(v => fixedLines.push(v));
        } else {
          // No excess, keep as is
          actualValues.forEach(v => fixedLines.push(v));
        }
      } else {
        // Can't find markers, keep as is
        actualValues.forEach(v => fixedLines.push(v));
      }
    } else {
      // Correct count, keep as is
      actualValues.forEach(v => fixedLines.push(v));
    }

    // Add closing paren
    if (i < lines.length) {
      fixedLines.push(lines[i]); // );
    }
    i++;
    continue;
  }

  fixedLines.push(line);
  i++;
}

// Write back
const fixedContent = fixedLines.join('\n');
fs.writeFileSync(insertsPath, fixedContent, 'utf8');

console.log(`\n✓ Fixed ${fixCount} excess values`);
console.log(`✓ File updated: ${insertsPath}`);
