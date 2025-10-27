# Entity Extraction - Status & Next Steps

## ✅ Completed

### 1. Project Organization
- Created `scripts/extraction/` folder for all extraction scripts
- Created `data/outputs/` with `full/` and `samples/` subfolders
- Created `docs/reference/` for schema documentation
- Added npm scripts: `yarn extract:sample`, `yarn extract:full`, `yarn extract:clean`

### 2. AI Extraction Scripts

**Sample Script** (`scripts/extraction/extract-entities-ai-sample.js`):
- Processes first 30 messages for quick testing
- Uses Claude 4.5 Haiku (fast & cost-effective)
- Output: `data/outputs/samples/latest/`

**Full Script** (`scripts/extraction/extract-entities-ai.js`):
- Processes ALL messages in batches
- Resumable (progress tracking)
- Output: `data/outputs/full/`

### 3. Enhanced Contact & Name Extraction
- ✅ Extracts sender phone/WhatsApp from every message
- ✅ AI detects organizer names in message signatures
- ✅ AI looks for contact info in message text (phone, Instagram, email)
- ✅ Updated WhatsApp scraper to capture display names better (for future messages)

## 📊 Current Test Results

From 30 sample messages, extracted:
- **7 Events**
- **8 Places**
- **10 Services**

All with contact information (phone/WhatsApp numbers)!

## 🎯 Next Steps

### Step 1: Run Full Extraction
```bash
yarn extract:full
```
This will process ALL 110 messages with text content.

### Step 2: Generate SQL INSERT Statements
Create script to convert JSON → SQL INSERTS for Supabase

### Step 3: Create INSERTS-README.md
Organized SQL statements ready to run in Supabase

### Step 4: Review & Import
- Review extracted data quality
- Import to Supabase database

## 💡 Contact Info Strategy

Since many messages don't include explicit contact info:
1. **Sender Phone**: Always captured from `sender_phone` field
2. **Organizer Names**: AI extracts from:
   - Message signatures ("Love, María", "- Juan")
   - Self-introductions ("Soy X", "I'm X")
   - Contact mentions ("Contact María at...")
3. **Additional Contacts**: AI extracts any phone/Instagram/email from text

## 📝 Notes

- Future WhatsApp scrapes will capture better display names (updated scraper)
- Current messages use phone numbers as sender_name
- AI is smart enough to extract names from message content even without display names
