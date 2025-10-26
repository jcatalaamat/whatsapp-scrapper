# WhatsApp Listener Implementation Guide

## For Future Claude Code Instances

This document explains the architecture, design decisions, and implementation details of the WhatsApp Listener service for Mazunte Connect. Read this first before making any changes.

---

## Table of Contents
1. [Project Context](#project-context)
2. [Architecture Overview](#architecture-overview)
3. [Database Strategy (CRITICAL)](#database-strategy-critical)
4. [How to Work with This Project](#how-to-work-with-this-project)
5. [Migration Management](#migration-management)
6. [Deployment Guide](#deployment-guide)
7. [Troubleshooting](#troubleshooting)

---

## Project Context

### What is Mazunte Connect?
- iOS/Android app for discovering events, retreats, yoga classes, restaurants, and conscious spaces in Mazunte, Mexico
- Solves the "WhatsApp chaos" problem where community events are buried in group chats
- Currently in production with active users
- Main tech stack: Next.js (web), Expo (mobile), Supabase (backend)
- Main project location: Separate repository (not this one)

### What is This WhatsApp Listener?
- **Standalone Node.js service** that monitors WhatsApp groups
- Captures messages about events, offerings, and services from 3-4 community WhatsApp groups
- Automatically stores them in Supabase with "pending" approval status
- Later, admins can review and approve messages to create proper events in the main app
- **This is a separate service from the main Mazunte Connect app**

### Why Does This Exist?
- Community members post events in WhatsApp groups constantly
- Manually copying those posts into the app is tedious
- This automates the flow: WhatsApp → Supabase → (Admin Review) → App

---

## Architecture Overview

### High-Level Flow
```
WhatsApp Group Message
    ↓
whatsapp-web.js captures it
    ↓
Extract: sender, body, media, timestamp, group name
    ↓
If media exists → Upload to Supabase Storage (bucket: whatsapp-media)
    ↓
Insert into whatsapp_messages table (approval_status: 'pending')
    ↓
Store in Supabase for admin review
```

### Service Components

```
src/
├── index.js              # Entry point, orchestrates everything
├── config.js             # Environment variable management
├── supabase-client.js    # Supabase connection and operations
├── session-manager.js    # Store/retrieve WhatsApp session from Supabase
├── whatsapp-client.js    # WhatsApp Web connection and event listeners
├── message-handler.js    # Process incoming messages, coordinate storage
└── media-handler.js      # Upload media files to Supabase Storage
```

### Key Technologies
- `whatsapp-web.js` - WhatsApp Web API wrapper (uses Puppeteer under the hood)
- `@supabase/supabase-js` - Supabase JavaScript client
- `node-pg-migrate` - Database migration management
- `dotenv` - Environment variable loading

---

## Database Strategy (CRITICAL)

### THE MOST IMPORTANT THING TO UNDERSTAND

**This service connects to the SAME Supabase instance as the main Mazunte Connect app, but uses its OWN migration system.**

This is safe because:
1. **Different migration system** - This service uses `node-pg-migrate`, the main app uses something else (probably Prisma)
2. **Different tables** - This service only creates and manages the `whatsapp_messages` table
3. **No conflicts** - The two migration systems never touch each other's tables
4. **Shared database** - Both services can query each other's tables if needed (e.g., admin panel in main app can query `whatsapp_messages`)

### What This Means for You

**DO:**
- Run migrations in this project using `npm run migrate up`
- Create new migrations for WhatsApp listener features in the `migrations/` folder
- Connect to the production Supabase instance
- Use the `SUPABASE_SERVICE_KEY` for server-side operations

**DO NOT:**
- Try to integrate this migration system with the main app's migrations
- Modify tables that belong to the main Mazunte Connect app
- Reset the database or run destructive operations
- Touch anything outside the `whatsapp_messages` table and `whatsapp-sessions` table

### Database Schema

#### Table: `whatsapp_messages`
Stores all messages captured from WhatsApp groups.

```sql
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name TEXT NOT NULL,
  group_id TEXT NOT NULL,
  sender_name TEXT,
  sender_phone TEXT NOT NULL,
  message_body TEXT,
  message_type TEXT, -- 'text', 'image', 'video', 'audio', 'document'
  media_url TEXT, -- Supabase Storage public URL
  media_mimetype TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  approval_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);
```

#### Table: `whatsapp_sessions`
Stores WhatsApp Web session data to survive Render restarts.

```sql
CREATE TABLE whatsapp_sessions (
  id TEXT PRIMARY KEY DEFAULT 'default',
  session_data TEXT NOT NULL, -- Base64-encoded session
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Supabase Storage Bucket: `whatsapp-media`
Stores images, videos, and other media files from WhatsApp messages.
- Public bucket (files are accessible via public URL)
- Files organized by date: `YYYY/MM/DD/filename`

---

## How to Work with This Project

### Initial Setup (First Time)

1. **Clone and Install**
   ```bash
   cd whatsapp-scrapper
   npm install
   ```

2. **Create .env File**
   ```bash
   cp .env.example .env
   ```

3. **Get Required Environment Variables**
   - `SUPABASE_URL` - From Supabase Dashboard → Project Settings → API
   - `SUPABASE_SERVICE_KEY` - From Supabase Dashboard → Project Settings → API → `service_role` key (NOT anon key!)
   - `WHATSAPP_GROUPS` - Comma-separated list of group names to monitor

4. **Run Migrations**
   ```bash
   npm run migrate up
   ```
   This creates the `whatsapp_messages` and `whatsapp_sessions` tables.

5. **Create Supabase Storage Bucket**
   - Go to Supabase Dashboard → Storage
   - Create a new public bucket named `whatsapp-media`
   - Set it to public access

6. **Start the Service Locally**
   ```bash
   npm start
   ```
   - A QR code will appear in the terminal
   - Scan it with WhatsApp on your phone (Settings → Linked Devices → Link a Device)
   - The service starts listening to configured groups

### Making Changes

**When adding a new feature:**
1. Check if it requires database schema changes
2. If yes, create a new migration: `npm run migrate create feature-name`
3. Write the migration SQL in `migrations/XXXXXX_feature-name.sql`
4. Test locally: `npm run migrate up`
5. Implement the feature in `src/`
6. Test thoroughly locally before deploying

**When debugging:**
1. Check logs first: `npm start` outputs detailed logs
2. Check Supabase Dashboard → Table Editor → `whatsapp_messages` to see captured data
3. Check Supabase Dashboard → Storage → `whatsapp-media` to see uploaded files
4. Use `console.log` liberally in development

**When deploying:**
1. Ensure all migrations are committed
2. Push to GitHub
3. Render will automatically deploy
4. Run migrations on Render: Set `RUN_MIGRATIONS=true` in Render env vars (or run manually via Render shell)
5. Check Render logs for QR code or connection status

---

## Migration Management

### Creating a New Migration

```bash
npm run migrate create your_migration_name
```

This creates a file like `migrations/1234567890_your_migration_name.sql`.

### Writing Migrations

Always write both UP and DOWN migrations:

```sql
-- Up Migration
CREATE TABLE example (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Down Migration
-- DROP TABLE example;
```

### Running Migrations

**Locally:**
```bash
npm run migrate up    # Apply all pending migrations
npm run migrate down  # Rollback last migration
```

**On Render:**
- Option 1: Set `RUN_MIGRATIONS=true` environment variable (auto-runs on start)
- Option 2: Use Render Shell → `npm run migrate up`

### Migration Safety Rules

1. **Never modify existing migrations** - Create new ones instead
2. **Always test locally first** - Don't test migrations in production
3. **Use transactions** - Wrap migrations in `BEGIN` / `COMMIT`
4. **Backup before major changes** - Use Supabase dashboard to export table data
5. **Never drop tables without explicit approval** - Especially production tables

---

## Deployment Guide

### Deploying to Render (Free Tier)

**Prerequisites:**
- GitHub repository with this code
- Supabase project with service key
- Render account

**Steps:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial WhatsApp listener setup"
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repo
   - Settings:
     - Name: `mazunte-whatsapp-listener`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: `Starter` (free)

3. **Set Environment Variables in Render**
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `WHATSAPP_GROUPS` (e.g., `Inner Ascend Tribe,BEYOND Community,Mazunte Connect`)
   - `SUPABASE_STORAGE_BUCKET=whatsapp-media`
   - `NODE_ENV=production`
   - `RUN_MIGRATIONS=true` (optional, auto-runs migrations on start)

4. **Deploy and Scan QR Code**
   - Render will deploy automatically
   - Open Render Logs
   - Look for the QR code ASCII art (or copy the QR string and paste into https://qrcode.show)
   - Scan with WhatsApp on your phone
   - Service is now live 24/7

5. **Verify It's Working**
   - Send a test message in one of the configured WhatsApp groups
   - Check Supabase Dashboard → Table Editor → `whatsapp_messages`
   - You should see the message with `approval_status = 'pending'`

### Render Free Tier Limitations

**Ephemeral Storage:**
- Render free tier has no persistent disk storage
- Files written to disk are lost on restart/redeploy
- **Solution:** We store the WhatsApp session in Supabase (see `session-manager.js`)
- This means you don't have to re-scan QR code on every deploy

**Automatic Sleep:**
- Free tier services spin down after 15 minutes of inactivity
- **Solution:** Use a cron job or uptime monitor to ping the service every 10 minutes
- Or upgrade to Starter plan ($7/month) for always-on service

**CPU/Memory Limits:**
- Free tier has limited resources
- Should be fine for monitoring 3-4 groups
- If you see crashes, upgrade to Starter plan

---

## Troubleshooting

### QR Code Not Appearing

**Symptoms:** Service starts but no QR code in logs

**Causes & Fixes:**
1. Session already exists in Supabase → Check `whatsapp_sessions` table
2. Puppeteer/Chrome not starting → Check Render logs for Chromium errors
3. Try deleting the session: `DELETE FROM whatsapp_sessions WHERE id = 'default'`

### Messages Not Being Captured

**Symptoms:** Service is running but `whatsapp_messages` table is empty

**Checks:**
1. Verify group names in `WHATSAPP_GROUPS` match exactly (case-sensitive)
2. Check if your WhatsApp account is actually in those groups
3. Check Render logs for errors
4. Try sending a test message and watch logs in real-time

### Media Not Uploading

**Symptoms:** Messages captured but `media_url` is null

**Checks:**
1. Verify Supabase Storage bucket `whatsapp-media` exists
2. Check bucket is set to public access
3. Verify `SUPABASE_SERVICE_KEY` has storage permissions
4. Check logs for upload errors

### Service Disconnecting

**Symptoms:** Service works initially but stops after a few hours

**Causes & Fixes:**
1. WhatsApp Web session expired → Service should auto-reconnect, check logs
2. Render free tier spinning down → Implement uptime monitor or upgrade
3. Internet connectivity issues → Check Render status page
4. WhatsApp rate limiting → Reduce frequency of operations (if any)

### Migration Errors

**Symptoms:** `npm run migrate up` fails

**Checks:**
1. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct
2. Check if migration already ran: `SELECT * FROM pgmigrations;`
3. Check for SQL syntax errors in migration file
4. Verify Supabase project is online

### Common Error Messages

**"Invalid API key"**
- Using anon key instead of service key
- Fix: Use `service_role` key from Supabase Dashboard

**"Bucket not found"**
- Storage bucket doesn't exist
- Fix: Create `whatsapp-media` bucket in Supabase Dashboard → Storage

**"Group not found"**
- Group name doesn't match exactly
- Fix: Print all group names (`client.getChats()`) and copy the exact name

**"Protocol error: Connection closed"**
- Puppeteer/Chromium crashed
- Fix: Restart service, check Render resources, upgrade if needed

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SUPABASE_URL` | Yes | Supabase project URL | `https://abc123.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Yes | Supabase service role key (NOT anon key) | `eyJhbGc...` |
| `WHATSAPP_GROUPS` | Yes | Comma-separated group names to monitor | `Group1,Group2,Group3` |
| `SUPABASE_STORAGE_BUCKET` | No | Supabase storage bucket name | `whatsapp-media` (default) |
| `NODE_ENV` | No | Environment mode | `production` or `development` |
| `RUN_MIGRATIONS` | No | Auto-run migrations on start | `true` or `false` |
| `PORT` | No | HTTP server port (for health checks) | `3000` (default) |

---

## Future Enhancements (Ideas)

When the user asks for new features, consider these common requests:

### 1. Admin Approval Panel
- Build a simple Next.js page in the main Mazunte Connect app
- Query `whatsapp_messages WHERE approval_status = 'pending'`
- Show message preview, media, sender info
- Buttons: "Approve" (create event), "Reject", "Edit & Approve"

### 2. Keyword Filtering
- Only capture messages that look like events/offerings
- Detect keywords: "Offering:", "Event:", "Ceremony:", dates, times
- Use regex or simple NLP to filter noise

### 3. Auto-Categorization
- Parse message content to detect event type (yoga, ceremony, workshop, etc.)
- Automatically assign category for easier approval
- Use OpenAI API or local keyword matching

### 4. Multi-Language Support
- Detect Spanish vs English messages
- Store language in metadata
- Translate for admin review if needed

### 5. Duplicate Detection
- Check if similar message already exists
- Prevent duplicate entries from cross-posting between groups

### 6. Webhook Notifications
- When new message arrives, POST to a webhook endpoint
- Notify admins in real-time (Slack, Discord, Telegram, etc.)

### 7. Scheduled Message Summary
- Daily digest of pending messages
- Send email to admins with summary

### 8. Message Analytics
- Track which groups are most active
- Detect trends (e.g., more yoga posts on Mondays)
- Show stats in admin dashboard

---

## Security Considerations

### API Keys
- **Never commit `.env` file to Git** (it's in `.gitignore`)
- Use Render environment variables for production secrets
- Rotate `SUPABASE_SERVICE_KEY` if compromised

### WhatsApp Session Security
- Session is stored encrypted in Supabase
- Only accessible by this service (via service key)
- If leaked, revoke the session: Delete from `whatsapp_sessions` table and unlink device in WhatsApp

### Data Privacy
- Only monitor groups you're a member of
- Notify group members that posts may be captured for the app
- Don't capture personal conversations (only community event posts)
- Add user consent flow if required by local regulations

### Supabase RLS (Row Level Security)
- The `whatsapp_messages` table doesn't have RLS policies by default
- If exposing via API, add RLS policies to restrict access
- Example: Only admins can query pending messages

---

## Architecture Decisions Log

### Why Separate Migration System?
- Main Mazunte Connect app has its own migration workflow (likely Prisma)
- Keeping migrations separate prevents conflicts and maintains service independence
- Easier for future developers to understand each service in isolation

### Why Store Session in Supabase?
- Render free tier has ephemeral storage
- Storing session in database means no QR re-scan on redeploys
- Alternative was to use external storage (S3), but Supabase is already available

### Why Use whatsapp-web.js Instead of Official API?
- WhatsApp Business API requires business approval and costs money
- whatsapp-web.js uses WhatsApp Web (free, no approval needed)
- Trade-off: Less reliable, but good enough for this use case

### Why Approval Workflow?
- Not all WhatsApp messages are actual events/offerings (lots of chatter)
- Manual review ensures quality control
- Prevents spam or inappropriate content in the app

### Why Node.js Instead of Python/Go/etc?
- Consistency with main Mazunte Connect stack (Next.js)
- whatsapp-web.js is the most mature WhatsApp library (Node.js only)
- Easy for frontend developers to understand and modify

---

## Testing Guide

### Local Testing

1. **Test Message Capture**
   ```bash
   npm start
   # Scan QR code
   # Send a test message in one of the configured groups
   # Check: SELECT * FROM whatsapp_messages;
   ```

2. **Test Media Upload**
   ```bash
   # Send an image in the group
   # Check Supabase Storage → whatsapp-media bucket
   # Verify media_url is populated in whatsapp_messages table
   ```

3. **Test Session Persistence**
   ```bash
   npm start  # Scan QR code
   # Stop service (Ctrl+C)
   npm start  # Should connect without QR code
   ```

4. **Test Migration Rollback**
   ```bash
   npm run migrate up
   npm run migrate down
   npm run migrate up
   # Verify database state is correct
   ```

### Production Testing

1. **Deploy to Render**
2. **Monitor Logs** for first 24 hours
3. **Send Test Messages** and verify they appear in Supabase
4. **Check Reconnection** by restarting the Render service

---

## Support & Resources

### Documentation
- [whatsapp-web.js Guide](https://wwebjs.dev/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [node-pg-migrate](https://salsita.github.io/node-pg-migrate/)
- [Render Docs](https://render.com/docs)

### Getting Help
- Check logs first (most issues are visible in logs)
- Search GitHub issues for whatsapp-web.js
- Check Supabase community forums
- Ask in Mazunte Connect developer chat (if applicable)

---

## Changelog

### Version 1.0.0 (Initial Release)
- WhatsApp group monitoring for 3-4 groups
- Message capture with sender info and timestamps
- Media upload to Supabase Storage
- Session persistence in Supabase
- Approval workflow (pending status by default)
- Render deployment support
- Migration system with node-pg-migrate

---

## License

MIT License - Part of the Mazunte Connect ecosystem.

---

**Last Updated:** October 2025
**Maintained By:** Mazunte Connect Team
**Contact:** hello@mazunteconnect.com
