import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the Google API landmarks data
const landmarksPath = path.join(__dirname, '../data/outputs/Mazunte_Landmarks_Google_API.json');
const landmarks = JSON.parse(fs.readFileSync(landmarksPath, 'utf8'));

// Create a map of location names to coordinates
const locationMap = new Map();

// Default coordinates for Mazunte center (fallback)
const MAZUNTE_CENTER = { lat: 15.6685, lng: -96.5542 };

// Build the location map with fuzzy matching support
landmarks.forEach(landmark => {
  const name = landmark.name.toLowerCase();
  const coords = {
    lat: landmark.latitude,
    lng: landmark.longitude
  };

  // Store with exact name
  locationMap.set(name, coords);

  // Store variations
  // Remove accents and special chars for fuzzy matching
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  locationMap.set(normalized, coords);
});

// Function to find coordinates for a location name
function findCoordinates(locationName) {
  if (!locationName) return MAZUNTE_CENTER;

  const searchName = locationName.toLowerCase();

  // Try exact match first
  if (locationMap.has(searchName)) {
    return locationMap.get(searchName);
  }

  // Try normalized match
  const normalized = searchName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (locationMap.has(normalized)) {
    return locationMap.get(normalized);
  }

  // Try partial matches
  for (const [key, coords] of locationMap.entries()) {
    if (key.includes(searchName) || searchName.includes(key)) {
      return coords;
    }
  }

  // Known location mappings
  const knownLocations = {
    'mazunte, mexico': MAZUNTE_CENTER,
    'mazunte': MAZUNTE_CENTER,
    'online': null, // Keep NULL for online events
    'meditation station': { lat: 15.6665628, lng: -96.5499399 },
    'hridaya yoga': { lat: 15.6666347, lng: -96.5484559 },
    'hridaya - salón nitya': { lat: 15.6666347, lng: -96.5484559 },
    'hridaya - nitya hall': { lat: 15.6666347, lng: -96.5484559 },
    'hridaya - anugraha hall': { lat: 15.6666347, lng: -96.5484559 },
    'bliss haven': { lat: 15.6677938, lng: -96.5508185 },
    'casa corzo': { lat: 15.6682, lng: -96.5538 },
    'kinam mazunte': { lat: 15.6688677, lng: -96.5538273 },
    'foro escénico alternativo mermejita': { lat: 15.6602, lng: -96.5648 },
    'hotel noga, zipolite': { lat: 15.6675, lng: -96.553 },
    'el chiringuito': { lat: 15.6678, lng: -96.5525 },
    'la galera, zipolite': { lat: 15.6655, lng: -96.5215 },
    'wamba': { lat: 15.6683, lng: -96.5528 },
    'camp, zipolite': { lat: 15.6658, lng: -96.522 },
    'cenzontle, calle rinconcito': { lat: 15.668, lng: -96.552 }
  };

  const lowerLocation = searchName.toLowerCase().trim();
  if (knownLocations[lowerLocation]) {
    return knownLocations[lowerLocation];
  }

  // If no match found and not online, use Mazunte center
  if (lowerLocation.includes('online')) {
    return null;
  }

  return MAZUNTE_CENTER;
}

// Read the INSERTS-README.md file
const insertsPath = path.join(__dirname, '../INSERTS-README.md');
let content = fs.readFileSync(insertsPath, 'utf8');

// Regular expression to find INSERT statements with NULL lat/lng
const insertRegex = /INSERT INTO events \([^)]+\) VALUES \([^;]+;/gs;

let updatedContent = content;
let updateCount = 0;

const matches = content.match(insertRegex);
if (matches) {
  matches.forEach(insertStatement => {
    // Match pattern: location_name, lat, lng, category
    // We want to find cases where lat and lng are NULL
    const lines = insertStatement.split('\n');

    // Find the line with location_name by looking for the pattern after date/time
    let locationLineIndex = -1;
    let locationName = null;

    for (let i = 0; i < lines.length; i++) {
      // Look for the pattern: 'location_name',
      // followed by: NULL, (lat)
      // followed by: NULL, (lng)
      if (lines[i].includes('NULL,') && lines[i + 1] && lines[i + 1].includes('NULL,')) {
        // Go back one line to get location name
        if (i > 0 && lines[i - 1].match(/'([^']+)',$/)) {
          locationName = lines[i - 1].match(/'([^']+)',$/)[1];
          locationLineIndex = i;
          break;
        }
      }
    }

    if (locationName && locationLineIndex >= 0) {
      const coords = findCoordinates(locationName);

      if (coords) {
        // Replace the two NULL lines with actual coordinates
        const oldLat = lines[locationLineIndex];
        const oldLng = lines[locationLineIndex + 1];
        const newLat = `  ${coords.lat},`;
        const newLng = `  ${coords.lng},`;

        lines[locationLineIndex] = newLat;
        lines[locationLineIndex + 1] = newLng;

        const updated = lines.join('\n');
        updatedContent = updatedContent.replace(insertStatement, updated);
        updateCount++;
        console.log(`Updated: ${locationName} -> (${coords.lat}, ${coords.lng})`);
      } else {
        console.log(`Keeping NULL for online event: ${locationName}`);
      }
    }
  });
}

// Write the updated content back
fs.writeFileSync(insertsPath, updatedContent, 'utf8');
console.log(`\n✓ Updated ${updateCount} location coordinates`);
