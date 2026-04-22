# Environment Variables Guide

This document explains all environment variables used in Localhost Limited with dummy values for reference.

## Quick Reference Table

| Variable | Type | Required | Purpose | Example |
|----------|------|----------|---------|---------|
| `DATABASE_URL` | Server | ✅ Yes | PostgreSQL connection | `postgresql://user:pass@localhost:5432/db` |
| `GOOGLE_CLIENT_ID` | Server | ✅ Yes | Google OAuth Client ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Server | ✅ Yes | Google OAuth Secret (PRIVATE) | `GOCSPX-abcdefghijklmnop` |
| `GOOGLE_REDIRECT_URI` | Server | ✅ Yes | Google OAuth callback URL | `https://yourdomain.com/api/oauth/callback` |
| `VITE_GOOGLE_CLIENT_ID` | Client | ✅ Yes | Google OAuth ID (public) | `123456789-abc.apps.googleusercontent.com` |
| `JWT_SECRET` | Server | ✅ Yes | Session signing key | `your_secret_min_32_chars_long` |
| `VITE_APP_TITLE` | Client | ⚠️ Optional | App name | `Localhost Limited` |
| `VITE_APP_ID` | Client | ⚠️ Optional | App identifier | `localhost-limited-001` |
| `VITE_APP_LOGO` | Client | ⚠️ Optional | App logo URL | `https://cdn.com/logo.png` |
| `OWNER_NAME` | Server | ⚠️ Optional | Admin name | `John Doe` |
| `OWNER_EMAIL` | Server | ⚠️ Optional | Admin email | `admin@example.com` |
| `OWNER_OPEN_ID` | Server | ⚠️ Optional | Admin Google ID | `google-oauth2\|1234567890` |
| `RESEND_API_KEY` | Server | ⚠️ Optional | Email service key | `re_1234567890abcdefghijklmnop` |
| `SMTP_HOST` | Server | ⚠️ Optional | SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | Server | ⚠️ Optional | SMTP port | `587` |
| `SMTP_USER` | Server | ⚠️ Optional | SMTP username | `your-email@gmail.com` |
| `SMTP_PASSWORD` | Server | ⚠️ Optional | SMTP password | `your_app_password` |
| `SMTP_FROM_EMAIL` | Server | ⚠️ Optional | From email address | `noreply@example.com` |
| `SMTP_REPLY_TO` | Server | ⚠️ Optional | Reply-to email | `support@example.com` |
| `VITE_ANALYTICS_WEBSITE_ID` | Client | ⚠️ Optional | Analytics ID | `localhost-limited.com` |
| `VITE_ANALYTICS_ENDPOINT` | Client | ⚠️ Optional | Analytics endpoint | `https://analytics.example.com/api/event` |

## Detailed Configuration

### 1. Database Configuration (REQUIRED)

```env
# PostgreSQL Connection String
DATABASE_URL=postgresql://username:password@host:port/database_name
```

**Examples for different providers:**

**Local Development:**
```env
DATABASE_URL=postgresql://localho1_admin:mf^G^82:vHg2.iZ@localhost:5432/localho1_local_limited
```

**AWS RDS:**
```env
DATABASE_URL=postgresql://admin:password@mydb.rds.amazonaws.com:5432/localhost_limited?sslmode=require
```

**DigitalOcean:**
```env
DATABASE_URL=postgresql://doadmin:password@db-postgresql-nyc1-12345.ondigitalocean.com:25060/localhost_limited?sslmode=require
```

**Railway:**
```env
DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway?sslmode=require
```

**Supabase:**
```env
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres?sslmode=require
```

### 2. Google OAuth Configuration (REQUIRED)

**Get your credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URIs
6. Copy Client ID and Secret

```env
# Google OAuth Client ID (public - safe to expose)
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com

# Google OAuth Client Secret (PRIVATE - server-side only)
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz

# Google OAuth Redirect URI (must match Google Cloud Console)
GOOGLE_REDIRECT_URI=https://localhostlimitedafrica.com/api/oauth/callback

# Frontend Google Client ID (same as above, public)
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

**Redirect URI Examples:**
- Local: `http://localhost:3000/api/oauth/callback`
- Production: `https://yourdomain.com/api/oauth/callback`
- Manus preview: `https://3000-xxxxx.us2.manus.computer/api/oauth/callback`

### 3. Session & Security (REQUIRED)

```env
# JWT Secret for signing session cookies
# Generate with: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_12345
```

**Generate a secure JWT secret:**
```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows (using Node.js):
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Application Configuration (OPTIONAL)

```env
# Application name (displayed in browser title, emails)
VITE_APP_TITLE=Localhost Limited

# Application ID (for internal tracking)
VITE_APP_ID=localhost-limited-001

# Application logo URL (for emails, admin panel)
VITE_APP_LOGO=https://your-cdn.com/logo.png
```

### 5. Owner Information (OPTIONAL)

```env
# Owner's name
OWNER_NAME=John Doe

# Owner's email (for notifications)
OWNER_EMAIL=admin@localhostlimitedafrica.com

# Owner's Google OAuth ID (after first login, copy from database)
OWNER_OPEN_ID=google-oauth2|1234567890
```

**How to get OWNER_OPEN_ID:**
1. Login to your app with Google OAuth
2. Check the `users` table in your database
3. Copy the `google_id` value from your user record

### 6. Email Configuration (OPTIONAL)

**Option A: Using Resend**

```env
# Resend API Key
# Get from: https://resend.com/api-keys
RESEND_API_KEY=re_1234567890abcdefghijklmnop
```

**Option B: Using SMTP (Gmail, SendGrid, etc.)**

```env
# SMTP Server
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your_app_password_or_password
SMTP_FROM_EMAIL=noreply@localhostlimitedafrica.com
SMTP_REPLY_TO=support@localhostlimitedafrica.com
```

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the generated password as `SMTP_PASSWORD`

### 7. Analytics (OPTIONAL)

```env
# Analytics website ID (Plausible, Fathom, etc.)
VITE_ANALYTICS_WEBSITE_ID=localhost-limited.com

# Analytics endpoint URL
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com/api/event
```

### 8. Manus Built-in Services (OPTIONAL)

Only needed if using Manus platform services:

```env
# Manus API URL (for built-in services like LLM, storage)
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge

# Manus API Key (server-side - for backend access)
BUILT_IN_FORGE_API_KEY=sk_live_1234567890abcdefghijklmnop

# Manus API Key (client-side - for frontend access)
VITE_FRONTEND_FORGE_API_KEY=pk_live_1234567890abcdefghijklmnop

# Manus API URL (for frontend)
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge
```

## Complete Example .env File

```env
# ============================================================================
# REQUIRED VARIABLES
# ============================================================================

# Database
DATABASE_URL=postgresql://localho1_admin:mf^G^82:vHg2.iZ@localhost:5432/localho1_local_limited

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_REDIRECT_URI=https://localhostlimitedafrica.com/api/oauth/callback
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com

# Session
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_12345

# ============================================================================
# OPTIONAL VARIABLES
# ============================================================================

# Application
VITE_APP_TITLE=Localhost Limited
VITE_APP_ID=localhost-limited-001
VITE_APP_LOGO=https://your-cdn.com/logo.png

# Owner
OWNER_NAME=John Doe
OWNER_EMAIL=admin@localhostlimitedafrica.com
OWNER_OPEN_ID=google-oauth2|1234567890

# Email (Resend)
RESEND_API_KEY=re_1234567890abcdefghijklmnop

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=noreply@localhostlimitedafrica.com
SMTP_REPLY_TO=support@localhostlimitedafrica.com

# Analytics
VITE_ANALYTICS_WEBSITE_ID=localhost-limited.com
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com/api/event
```

## How to Set Environment Variables

### In Manus Management UI

1. Open Management UI → Settings → Secrets
2. Enter each secret value in the input fields
3. Click Save

### Locally (for development)

1. Create `.env` file in project root
2. Add variables from the examples above
3. Run `npm run dev`

### In Production

Set environment variables through your hosting provider:

**Railway:**
1. Go to Variables tab
2. Add each variable
3. Deploy

**DigitalOcean App Platform:**
1. Go to Settings → Environment
2. Add each variable
3. Deploy

**AWS Lambda/EC2:**
1. Set via AWS Secrets Manager or Parameter Store
2. Reference in application code

## Security Best Practices

✅ **DO:**
- Keep `GOOGLE_CLIENT_SECRET` private (server-side only)
- Use strong, random `JWT_SECRET`
- Never commit `.env` to version control
- Rotate secrets regularly
- Use different secrets for dev/staging/production

❌ **DON'T:**
- Expose `GOOGLE_CLIENT_SECRET` to frontend
- Commit `.env` files to git
- Use weak or default secrets
- Share secrets in chat/email
- Use same secrets across environments

## Troubleshooting

**"DATABASE_URL is required"**
- Check that `DATABASE_URL` is set
- Verify PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

**"Google OAuth failed"**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check `GOOGLE_REDIRECT_URI` matches Google Cloud Console
- Ensure Google+ API is enabled

**"Session not persisting"**
- Check `JWT_SECRET` is set
- Verify cookies are enabled in browser
- Check browser console for errors

**"Emails not sending"**
- Verify `RESEND_API_KEY` or SMTP credentials
- Check `SMTP_FROM_EMAIL` format
- Test email service separately

## Next Steps

1. ✅ Set up PostgreSQL and get connection string
2. ✅ Create Google OAuth credentials
3. ✅ Fill in all required environment variables
4. ✅ Run `npm run db:init` to create schema
5. ✅ Run `npm run db:seed` to add sample data
6. ✅ Run `npm run dev` to start development
