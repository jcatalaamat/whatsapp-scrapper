# Environment Variables Reference

This document lists all environment variables used in the Mazunte Connect project and what they're for.

## Quick Start
Copy `.env.example` to `.env` and fill in your actual values.

## Next.js (Web App)

### `NEXT_PUBLIC_URL`
- **Default**: `http://localhost:3000`
- **Used for**: Base URL for the Next.js web app
- **Note**: Use `https://localhost:3000` if running with `--experimental-https`

### `NEXT_PUBLIC_SUPABASE_URL`
- **Used for**: Supabase API endpoint for web app
- **Example**: `https://ddbuvzotcasyanocqcsh.supabase.co`

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Used for**: Public anonymous key for Supabase client authentication
- **Get from**: Supabase dashboard > Settings > API

### `NEXT_PUBLIC_PROJECT_ID`
- **Used for**: Supabase project identifier
- **Get from**: Your Supabase project URL (the subdomain part)

## Expo (Mobile App)

### `EXPO_PUBLIC_URL`
- **Default**: `http://localhost:3000`
- **Used for**: Base URL for API calls from mobile app

### `EXPO_PUBLIC_USE_LOCAL_SUPABASE`
- **Values**: `true` or `false`
- **Used for**: Switch between local and remote Supabase
- **Usage**: Set to `true` for development, `false` for production
- **Note**: Just toggle this and restart Metro - no need to change URLs!

### Remote Supabase (Production)

#### `EXPO_PUBLIC_SUPABASE_URL`
- **Used for**: Remote/production Supabase instance URL
- **Get from**: Supabase dashboard

#### `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Used for**: Remote/production Supabase anonymous key
- **Get from**: Supabase dashboard > Settings > API

### Local Supabase (Development)

#### `EXPO_PUBLIC_SUPABASE_URL_LOCAL`
- **Default**: `http://localhost:54321`
- **Used for**: Local Supabase instance running via `npx supabase start`

#### `EXPO_PUBLIC_SUPABASE_ANON_KEY_LOCAL`
- **Default**: Standard local Supabase demo key
- **Used for**: Local development authentication
- **Note**: This is the default key from `npx supabase start`

## Authentication

### `SUPABASE_AUTH_JWT_SECRET`
- **Used for**: JWT token signing and verification
- **Required**: Must be at least 32 characters long
- **Security**: Keep this secret and never commit to version control

### Google Sign-In

#### `GOOGLE_IOS_SCHEME`
- **Format**: `com.googleusercontent.apps.YOUR_IOS_CLIENT_ID`
- **Used for**: iOS URL scheme for Google Sign-In redirect
- **Get from**: Google Cloud Console > OAuth 2.0 Client IDs

#### `GOOGLE_IOS_CLIENT_ID`
- **Format**: `XXXX.apps.googleusercontent.com`
- **Used for**: iOS app Google Sign-In
- **Get from**: Google Cloud Console > iOS OAuth client

#### `GOOGLE_WEB_CLIENT_ID`
- **Format**: `XXXX.apps.googleusercontent.com`
- **Used for**: Android Google Sign-In (uses web client)
- **Get from**: Google Cloud Console > Web OAuth client

#### `GOOGLE_SECRET`
- **Used for**: Server-side Google OAuth verification
- **Get from**: Google Cloud Console > OAuth client secret
- **Security**: Keep this secret

## Analytics & Monitoring

### PostHog

#### `EXPO_PUBLIC_POSTHOG_API_KEY`
- **Used for**: PostHog analytics and feature flags
- **Get from**: PostHog dashboard > Project Settings

#### `EXPO_PUBLIC_POSTHOG_HOST`
- **Default**: `https://us.i.posthog.com` or `https://eu.i.posthog.com`
- **Used for**: PostHog API endpoint region

### Sentry

#### `SENTRY_AUTH_TOKEN`
- **Used for**: Uploading source maps and release tracking
- **Get from**: Sentry > Settings > Auth Tokens
- **Security**: Keep this secret

## Google Services

### `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY`
- **Used for**: Location autocomplete in event/place creation
- **Get from**: Google Cloud Console > Google Maps Platform > Credentials
- **Enable**: Google Places API Web Service

### `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`
- **Used for**: Google Maps display on Android app
- **Get from**: Google Cloud Console > Google Maps Platform > Credentials
- **Note**: Currently used in app.config.js for Android config

## AdMob (Mobile Ads)

### iOS App

#### `EXPO_PUBLIC_ADMOB_IOS_APP_ID`
- **Format**: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`
- **Used for**: AdMob iOS app identifier
- **Get from**: AdMob dashboard > App settings

#### `EXPO_PUBLIC_ADMOB_IOS_EVENTS_BANNER`
- **Used for**: Banner ad on events list screen (iOS)

#### `EXPO_PUBLIC_ADMOB_IOS_PLACES_BANNER`
- **Used for**: Banner ad on places list screen (iOS)

#### `EXPO_PUBLIC_ADMOB_IOS_FAVORITES_BANNER`
- **Used for**: Banner ad on favorites screen (iOS)

#### `EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL`
- **Used for**: Full-screen interstitial ads (iOS)

#### `EXPO_PUBLIC_ADMOB_NATIVE_EVENTS_IOS`
- **Used for**: Native ads in events list (iOS)

#### `EXPO_PUBLIC_ADMOB_NATIVE_PLACES_IOS`
- **Used for**: Native ads in places list (iOS)

### Android App

#### `EXPO_PUBLIC_ADMOB_ANDROID_APP_ID`
- **Format**: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`
- **Used for**: AdMob Android app identifier
- **Get from**: AdMob dashboard > App settings

#### `EXPO_PUBLIC_ADMOB_ANDROID_EVENTS_BANNER`
- **Used for**: Banner ad on events list screen (Android)

#### `EXPO_PUBLIC_ADMOB_ANDROID_PLACES_BANNER`
- **Used for**: Banner ad on places list screen (Android)

#### `EXPO_PUBLIC_ADMOB_ANDROID_FAVORITES_BANNER`
- **Used for**: Banner ad on favorites screen (Android)

#### `EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL`
- **Used for**: Full-screen interstitial ads (Android)

#### `EXPO_PUBLIC_ADMOB_ANDROID_NATIVE_EVENTS`
- **Used for**: Native ads in events list (Android)

#### `EXPO_PUBLIC_ADMOB_ANDROID_NATIVE_PLACES`
- **Used for**: Native ads in places list (Android)

## Email

### `RESEND_API_KEY`
- **Used for**: Sending transactional emails via Resend API
- **Get from**: Resend dashboard > API Keys
- **Security**: Keep this secret

## Optional / Advanced

### `EXPO_OWNER`
- **Used for**: Expo organization/account name for EAS builds
- **Default**: `inner-ascend-expo`
- **Note**: Only needed if publishing to a specific Expo organization

---

## Setup Checklist

For a new Claude Code instance working on this project:

1. Copy `.env.example` to `.env`
2. **Required for basic development**:
   - Set Supabase credentials (URL and anon key)
   - Set `EXPO_PUBLIC_USE_LOCAL_SUPABASE=true` for local dev
3. **Required for Google Sign-In**:
   - Get Google OAuth credentials from Cloud Console
   - Set all `GOOGLE_*` variables
4. **Required for location features**:
   - Get Google Places API key
   - Set `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY`
5. **Optional services**:
   - PostHog for analytics
   - Sentry for error monitoring
   - AdMob for monetization
   - Resend for emails

## Notes

- Variables prefixed with `NEXT_PUBLIC_` are available in the Next.js browser bundle
- Variables prefixed with `EXPO_PUBLIC_` are available in the Expo mobile app
- All other variables are server-side only
- Never commit your `.env` file to version control
