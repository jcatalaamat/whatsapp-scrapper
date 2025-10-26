# Deployment Guide - Render

Complete step-by-step guide to deploy your WhatsApp Listener to Render.

---

## Prerequisites

Before deploying, make sure you have:

1. ✅ Supabase project with service role key
2. ✅ Storage bucket `whatsapp-media` created in Supabase (set to public)
3. ✅ GitHub account
4. ✅ Render account (sign up at [render.com](https://render.com))
5. ✅ List of WhatsApp group names you want to monitor

---

## Step 1: Initialize Git Repository

If you haven't already initialized git:

```bash
git init
git add .
git commit -m "Initial commit: WhatsApp listener for Mazunte Connect"
```

---

## Step 2: Create GitHub Repository

### Option A: Using GitHub CLI

```bash
gh repo create whatsapp-listener --private --source=. --push
```

### Option B: Using GitHub Website

1. Go to [github.com/new](https://github.com/new)
2. Name: `whatsapp-listener`
3. Privacy: Private (recommended)
4. Don't initialize with README (we have one)
5. Click **Create repository**

Then push your code:

```bash
git remote add origin git@github.com:YOUR_USERNAME/whatsapp-listener.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Render

### 3.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Click **Connect a repository**
4. Authorize Render to access your GitHub
5. Select your `whatsapp-listener` repository

### 3.2 Configure Service

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `mazunte-whatsapp-listener` |
| **Region** | Oregon (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | Leave blank |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** (for testing) or **Starter** ($7/month for 24/7) |

### 3.3 Add Environment Variables

Click **Advanced** → Add the following environment variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
WHATSAPP_GROUPS=Group Name 1,Group Name 2,Group Name 3
SUPABASE_STORAGE_BUCKET=whatsapp-media
NODE_ENV=production
RUN_MIGRATIONS=true
```

**Important:**
- Replace `your-project.supabase.co` with your actual Supabase URL
- Use your **service role key**, not the anon key
- Group names must match exactly (case-sensitive)
- Separate multiple groups with commas, no quotes

### 3.4 Deploy

1. Click **Create Web Service**
2. Render will start building and deploying
3. Wait for "Deploy succeeded" message (takes 2-3 minutes)

---

## Step 4: Scan QR Code

### 4.1 View Logs

1. In your Render service dashboard, click **Logs** tab
2. Wait for the service to fully start
3. Look for: "📱 Scan this QR code with WhatsApp on your phone:"

### 4.2 Scan QR Code

**Method 1: Terminal QR Code (if visible)**
- If the ASCII QR code renders properly, scan it directly

**Method 2: Use QR Code String** (recommended for Render)
- Copy the long text string below the QR code
- Go to [qrcode.show](https://qrcode.show)
- Paste the string
- Scan the generated QR code

### 4.3 Link WhatsApp

1. Open WhatsApp on your phone
2. Go to **Settings** → **Linked Devices**
3. Tap **Link a Device**
4. Scan the QR code
5. Wait for "✅ WhatsApp client is ready!" in logs

---

## Step 5: Verify It's Working

### 5.1 Check Logs

You should see:
```
✅ WhatsApp client is ready!
👀 Monitoring 3 group(s):
   1. Group Name 1
   2. Group Name 2
   3. Group Name 3
🎧 Listening for messages...
```

### 5.2 Send Test Message

1. Send a message in one of your configured WhatsApp groups
2. Watch the Render logs - you should see:
   ```
   📨 New message in Group Name 1
   👤 From: Sender Name
   💬 "Test message"
   ✅ Message captured successfully
   ```

### 5.3 Check Database

1. Go to Supabase Dashboard → Table Editor
2. Open `whatsapp_messages` table
3. You should see your test message with `approval_status = 'pending'`

---

## Step 6: Ongoing Maintenance

### Update Code

When you make changes locally:

```bash
# Make your changes
git add .
git commit -m "Your change description"
npm run deploy  # This pushes to GitHub, triggering Render deploy
```

Or manually:

```bash
git push origin main
```

Render will automatically redeploy on every push to `main`.

### View Logs

```bash
npm run logs
```

Or visit: `https://dashboard.render.com/web/YOUR_SERVICE_ID/logs`

### Run Migrations

If you add new database migrations:

1. Push code to GitHub (Render auto-deploys)
2. Migrations run automatically on startup (because `RUN_MIGRATIONS=true`)

Or manually via Render Shell:
1. Go to your service → **Shell** tab
2. Run: `npm run migrate:up`

### Restart Service

If you need to restart:
1. Render Dashboard → Your service
2. Click **Manual Deploy** → **Deploy latest commit**

### Delete Session (if needed)

If WhatsApp session becomes invalid:

1. Go to Supabase Dashboard → SQL Editor
2. Run:
   ```sql
   DELETE FROM whatsapp_sessions WHERE id = 'default';
   ```
3. Restart the Render service
4. Scan QR code again

---

## Render Free Tier Limitations

### Spin Down After 15 Minutes

Free tier services spin down after 15 minutes of inactivity and restart when accessed.

**Problem:** WhatsApp connection drops when service spins down.

**Solutions:**
1. **Upgrade to Starter plan** ($7/month) - Recommended for production
2. **Use a cron job** to ping the service every 10 minutes (keeps it awake)
3. **Accept occasional disconnections** - Session persists, just need manual restart

### Ephemeral Storage

Free tier has no persistent disk storage.

**Solution:** We store the WhatsApp session in Supabase (already implemented). You won't need to re-scan QR codes on redeploys.

---

## Troubleshooting

### Build Fails

**Error:** `npm ERR! code ELIFECYCLE`

**Fix:**
- Check your `package.json` is valid
- Ensure all dependencies are in `dependencies`, not `devDependencies`
- Try locally: `npm install && npm start`

### QR Code Not Appearing

**Causes:**
- Puppeteer/Chromium not installing correctly
- Existing session in database

**Fixes:**
1. Check logs for Chromium installation errors
2. Delete session: `DELETE FROM whatsapp_sessions WHERE id = 'default';`
3. Restart service

### Messages Not Captured

**Causes:**
- Group names don't match exactly
- Your WhatsApp account isn't in those groups
- Session expired

**Fixes:**
1. Check logs for "Monitoring N group(s)" - verify group names
2. Send a test message and watch logs in real-time
3. Verify you're in the WhatsApp groups
4. Re-scan QR code if session expired

### Media Not Uploading

**Causes:**
- Storage bucket doesn't exist
- Bucket isn't public
- Service key doesn't have storage permissions

**Fixes:**
1. Create `whatsapp-media` bucket in Supabase
2. Set bucket to public: Settings → Public bucket = ON
3. Verify `SUPABASE_SERVICE_KEY` is correct

### Service Keeps Disconnecting

**Causes:**
- Free tier spinning down
- WhatsApp Web session expired

**Fixes:**
1. Upgrade to Starter plan ($7/month)
2. Check WhatsApp phone still has internet
3. Re-scan QR code if needed

---

## Useful Commands

```bash
# Deploy to Render (pushes to GitHub)
npm run deploy

# Test database connection
npm run check

# View logs
npm run logs

# Setup database (run migrations)
npm run db:setup

# Reset database (careful!)
npm run db:reset
```

---

## Cost Breakdown

### Render

| Plan | Cost | Features |
|------|------|----------|
| **Free** | $0/month | Spins down after 15 min inactivity |
| **Starter** | $7/month | Always-on, 512 MB RAM |
| **Standard** | $25/month | 2 GB RAM, more CPU |

**Recommendation:** Start with Free for testing, upgrade to Starter for production.

### Supabase

| Plan | Cost | Features |
|------|------|----------|
| **Free** | $0/month | 500 MB database, 1 GB storage |
| **Pro** | $25/month | 8 GB database, 100 GB storage |

**Recommendation:** Free tier is plenty for WhatsApp messages.

### Total Cost

- **Testing:** $0/month (Render Free + Supabase Free)
- **Production:** $7/month (Render Starter + Supabase Free)

---

## Next Steps

After successful deployment:

1. **Monitor for 24 hours** - Check logs, verify messages are captured
2. **Build admin panel** - Create UI in Mazunte Connect app to review pending messages
3. **Set up keyword filtering** - Only capture relevant messages
4. **Add webhook notifications** - Get notified when new messages arrive

---

## Support

For issues, check:
1. [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Technical details
2. [README.md](./README.md) - General overview
3. Render logs - Most issues are visible in logs
4. Supabase Dashboard - Verify data is being stored

---

**Made with 💚 for Mazunte Connect**

Contact: hello@mazunteconnect.com
