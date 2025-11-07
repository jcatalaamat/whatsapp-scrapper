# WhatsApp Event Scraper for Mazunte Connect

Automated system to extract events, places, and services from WhatsApp messages and generate database inserts.

**Last Updated: November 6, 2025**

---

## Overview

This service bridges WhatsApp community groups with the [Mazunte Connect](https://mazunteconnect.com) app. It monitors configured WhatsApp groups, captures messages and media, extracts structured data using AI, and generates database INSERT statements for review and import.

**Problem it solves:** Community events are constantly shared in WhatsApp groups but manually copying them into the app is tedious. This automates the flow: WhatsApp → AI Extraction → Processed Data → SQL → Database.

## Pipeline Architecture

```
WhatsApp Messages
    ↓
1. BACKFILL (yarn wizard backfill local)
   - Captures messages and media
   - Stores in data/messages_*.json
    ↓
2. EXTRACTION (yarn pipeline:extract)
   - GPT-4o-mini extracts events/places/services
   - Outputs to data/extracted/*.json
    ↓
3. PROCESSING (yarn pipeline:process)
   - Links media via phone + text similarity
   - Deduplicates entries
   - Adds coordinates from landmarks
   - Outputs to data/final/*.json
    ↓
4. SQL GENERATION (yarn pipeline:sql)
   - Generates INSERT statements
   - Outputs to data/final/INSERTS.sql
    ↓
Admin reviews and imports to database
```

---

## Key Features

### Data Collection
- **Multi-Group Monitoring** - Monitor 3-4 WhatsApp groups simultaneously
- **Text & Media Capture** - Captures message text, images, videos, and metadata
- **Session Persistence** - WhatsApp session survives service restarts (no re-scanning QR code)
- **Media Storage** - Uploads images/videos to Supabase Storage

### AI Extraction
- **GPT-4o-mini Integration** - Intelligent entity extraction from conversational messages
- **Date Inference** - Accurately calculates dates from relative terms ("domingo", "mañana", "next week")
- **Multi-Language Support** - Handles Spanish and English messages
- **Contact Extraction** - Captures WhatsApp, Instagram, email, phone contacts

### Smart Media Linking
- **Phone Number Normalization** - Handles Mexican mobile prefix variations (521 vs 52)
- **Text Similarity Matching** - When sender has multiple images, picks the one that best matches event description
- **Fallback Strategies** - Multiple matching strategies ensure maximum image linkage

### Data Quality
- **Deduplication** - Removes duplicate events/places based on titles
- **Coordinate Mapping** - Links locations to landmarks from Google API data
- **Approval Workflow** - All entities default to "pending" status for admin review

---

## Recent Improvements (Nov 6, 2025)

### Media Linking Enhancement ✨
**Problem:** When a sender posted multiple images, the system would grab the first one, which might not match the extracted event.

**Solution:**
- Find ALL media messages from the same phone number
- Calculate text similarity between event description and each message text
- Pick the image from the message with the highest similarity score
- Example: Giuseppe posted 3 images - now "Temazcal - Inipi" event correctly links to the actual Temazcal announcement image, not a random photo

### Phone Number Normalization 📱
**Problem:** Mexican mobile numbers have variations that prevented matching:
- Raw data: `5219515097114` (with 1 after country code)
- GPT extracted: `+529515097114` (without the 1)

**Solution:**
- Normalize all phone numbers by removing `+` prefix
- Detect `521` prefix and convert to `52` for comparison
- Now `5219515097114` matches `+529515097114` automatically

### Date Inference Fix 📅
**Problem:** GPT was miscalculating relative dates - "domingo" (Sunday) on Thursday Nov 6 was being extracted as Nov 6 instead of Nov 9.

**Solution:**
- Enhanced prompt with specific examples of correct day-of-week calculations
- Added emphasis on accuracy vs. just filling in a date
- Now "Ecstatic Sunday" correctly dated as "2025-11-09" (actual Sunday)

### Database Trigger Management 🔧
**Problem:** Notification triggers were blocking event inserts because notification tables didn't exist yet.

**Solution:**
- Created migration structure for future notification system
- Temporarily disabled triggers with CASCADE to handle dependencies
- Events can now be inserted without errors

---

## Tech Stack

- **WhatsApp Integration:** `whatsapp-web.js` - WhatsApp Web API wrapper
- **AI Extraction:** OpenAI GPT-4o-mini via API
- **Database:** Supabase (PostgreSQL + Storage)
- **Runtime:** Node.js v18+
- **Migrations:** `node-pg-migrate`
- **Data Processing:** Custom pipeline scripts

---

## Prerequisites

1. **Supabase Project** with:
   - Service role key (not anon key)
   - Storage bucket named `whatsapp-media` (create in dashboard)

2. **WhatsApp Account**
   - Must be a member of the groups you want to monitor

3. **Render Account** (for deployment) or local Node.js environment

4. **GitHub Repository** (for deployment)

---

## Quick Start (Local Development)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd whatsapp-scrapper
yarn install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
WHATSAPP_GROUPS=Group Name 1,Group Name 2,Group Name 3
SUPABASE_STORAGE_BUCKET=whatsapp-media
```

**Important:**
- Use the **service role key**, not the anon key
- Group names must match exactly (case-sensitive)
- Create the `whatsapp-media` bucket in Supabase Dashboard → Storage (make it public)

### 3. Run Database Migrations

```bash
yarn migrate:up
```

This creates two tables:
- `whatsapp_messages` - Stores captured messages
- `whatsapp_sessions` - Stores WhatsApp Web session for persistence

### 4. Start the Service

```bash
yarn start
```

### 5. Scan QR Code

- A QR code will appear in the terminal
- Open WhatsApp on your phone
- Go to: **Settings → Linked Devices → Link a Device**
- Scan the QR code
- The service will start listening to your configured groups

---

## Deployment (Render)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial WhatsApp listener setup"
git push origin main
```

### 2. Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `mazunte-whatsapp-listener`
   - **Environment:** Node
   - **Build Command:** `yarn install`
   - **Start Command:** `yarn start`
   - **Instance Type:** Starter (free tier works, but paid tier recommended for 24/7 uptime)

### 3. Set Environment Variables in Render

Add these in Render Dashboard → Environment:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
WHATSAPP_GROUPS=Group1,Group2,Group3
SUPABASE_STORAGE_BUCKET=whatsapp-media
NODE_ENV=production
RUN_MIGRATIONS=true
```

### 4. Deploy and Scan QR Code

1. Render will automatically deploy your service
2. Open **Logs** in Render dashboard
3. Look for the QR code (ASCII art) or copy the QR string
4. Paste the string into [qrcode.show](https://qrcode.show)
5. Scan with WhatsApp on your phone
6. Service is now live 24/7

**Note:** On Render free tier, the service spins down after 15 minutes of inactivity. Upgrade to Starter plan ($7/month) for always-on service.

---

## Database Schema

### Table: `whatsapp_messages`

Stores all captured messages from WhatsApp groups.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `group_name` | TEXT | Group name (e.g., "Inner Ascend Tribe") |
| `group_id` | TEXT | WhatsApp group ID |
| `sender_name` | TEXT | Sender's display name |
| `sender_phone` | TEXT | Sender's WhatsApp ID |
| `message_body` | TEXT | Message text content |
| `message_type` | TEXT | 'text', 'image', 'video', 'audio', 'document' |
| `media_url` | TEXT | Supabase Storage public URL |
| `media_mimetype` | TEXT | MIME type of media file |
| `timestamp` | TIMESTAMPTZ | When message was sent |
| `approval_status` | TEXT | 'pending', 'approved', 'rejected' |
| `processed` | BOOLEAN | Whether converted to event/offering |
| `created_at` | TIMESTAMPTZ | When record was created |
| `metadata` | JSONB | Additional data (mentions, links, etc.) |

### Table: `whatsapp_sessions`

Stores WhatsApp Web session data (survives restarts).

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | Session identifier (default: 'default') |
| `session_data` | TEXT | Base64-encoded session blob |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## Usage

### Query Pending Messages

In your main Mazunte Connect app:

```sql
SELECT * FROM whatsapp_messages
WHERE approval_status = 'pending'
ORDER BY timestamp DESC;
```

### Approve a Message

```sql
UPDATE whatsapp_messages
SET approval_status = 'approved', processed = true
WHERE id = 'message-uuid';
```

### Get Statistics

```sql
SELECT
  COUNT(*) FILTER (WHERE approval_status = 'pending') as pending,
  COUNT(*) FILTER (WHERE approval_status = 'approved') as approved,
  COUNT(*) as total
FROM whatsapp_messages;
```

---

## Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `SUPABASE_URL` | Yes | Supabase project URL | - |
| `SUPABASE_SERVICE_KEY` | Yes | Service role key | - |
| `WHATSAPP_GROUPS` | Yes | Comma-separated group names | - |
| `SUPABASE_STORAGE_BUCKET` | No | Storage bucket name | `whatsapp-media` |
| `ENABLE_KEYWORD_FILTER` | No | Enable keyword filtering | `false` |
| `FILTER_KEYWORDS` | No | Keywords to filter by | - |
| `NODE_ENV` | No | Environment mode | `production` |
| `RUN_MIGRATIONS` | No | Auto-run migrations on start | `false` |

### Keyword Filtering

To only capture messages containing specific keywords:

```env
ENABLE_KEYWORD_FILTER=true
FILTER_KEYWORDS=Offering,Service,Event,Retreat,Workshop
```

Messages not containing any of these keywords will be ignored.

---

## Troubleshooting

### QR Code Not Appearing

- Check that Puppeteer/Chromium is installed correctly
- On Render, ensure you're using the correct buildpack
- Delete existing session: `DELETE FROM whatsapp_sessions WHERE id = 'default'`

### Messages Not Being Captured

- Verify group names match exactly (case-sensitive)
- Check your WhatsApp account is actually in those groups
- View Render logs for errors
- Use the group list feature to see all available groups

### Media Not Uploading

- Verify `whatsapp-media` bucket exists in Supabase
- Check bucket is set to **public** access
- Verify `SUPABASE_SERVICE_KEY` has storage permissions

### Service Disconnecting

- Render free tier spins down after 15 minutes inactivity
- Upgrade to Starter plan for 24/7 uptime
- Check WhatsApp Web session hasn't expired

### Migration Errors

- Ensure `SUPABASE_SERVICE_KEY` is correct (not anon key)
- Check if migrations already ran: `SELECT * FROM pgmigrations;`
- Verify Supabase project is online

---

## Project Structure

```
whatsapp-scrapper/
├── src/
│   ├── index.js              # Main entry point
│   ├── config.js             # Environment configuration
│   ├── supabase-client.js    # Supabase operations
│   ├── session-manager.js    # WhatsApp session persistence
│   ├── whatsapp-client.js    # WhatsApp Web connection
│   ├── message-handler.js    # Message processing
│   └── media-handler.js      # Media upload handling
├── migrations/
│   └── 1730000000000_create-whatsapp-tables.sql
├── .env.example              # Environment template
├── package.json
├── render.yaml               # Render deployment config
├── IMPLEMENTATION_GUIDE.md   # Detailed technical docs
└── README.md                 # This file
```

---

## Future Enhancements

- **Admin Panel** - Build UI in main app for reviewing pending messages
- **Auto-Categorization** - Use AI/NLP to detect event types
- **Multi-Language** - Detect and translate Spanish/English messages
- **Duplicate Detection** - Prevent duplicate entries from cross-posting
- **Webhook Notifications** - Real-time alerts when new messages arrive
- **Scheduled Summaries** - Daily digest emails of pending messages

---

## Privacy & Ethics

- This service only monitors groups you're a member of
- Uses your authorized WhatsApp Web session
- Does not bypass encryption or access external accounts
- Notify group members that posts may be captured for the app
- Intended for community-owned integrations, not surveillance

---

## Support

For detailed implementation guidance, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md).

**Made with 💚 for Mazunte Connect**

Contact: hello@mazunteconnect.com

---

## License

MIT License - Part of the Mazunte Connect ecosystem.
