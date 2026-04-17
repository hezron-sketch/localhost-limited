# Google OAuth Setup Guide for Localhost Limited

This guide shows how to configure Google OAuth for your Localhost Limited project.

---

## Step 1: Create a Google Cloud Project

### 1.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click the project dropdown at the top
4. Click **NEW PROJECT**

### 1.2 Create New Project

- **Project name**: `Localhost Limited`
- **Organization**: (Leave blank or select your organization)
- Click **CREATE**

Wait for the project to be created (2-3 minutes).

---

## Step 2: Enable Google+ API

### 2.1 Enable the API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Google+ API"**
3. Click on **Google+ API**
4. Click **ENABLE**

### 2.2 Verify It's Enabled

- You should see "API Enabled" message
- Go back to **APIs & Services** → **Enabled APIs & services**
- Verify "Google+ API" is listed

---

## Step 3: Create OAuth 2.0 Credentials

### 3.1 Create OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (for testing/production)
3. Click **CREATE**

### 3.2 Fill in Consent Screen Details

**OAuth consent screen form:**

| Field | Value |
|-------|-------|
| **App name** | Localhost Limited |
| **User support email** | your-email@gmail.com |
| **Developer contact** | your-email@gmail.com |

Click **SAVE AND CONTINUE**

### 3.3 Add Scopes

1. Click **ADD OR REMOVE SCOPES**
2. Search for and select:
   - `email`
   - `profile`
   - `openid`
3. Click **UPDATE**
4. Click **SAVE AND CONTINUE**

### 3.4 Add Test Users (Optional)

- If using External, you can add test users
- Click **ADD USERS**
- Enter your email address
- Click **SAVE AND CONTINUE**

---

## Step 4: Create OAuth 2.0 Client ID

### 4.1 Go to Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS**
3. Select **OAuth client ID**

### 4.2 Configure OAuth Client

1. **Application type**: Select **Web application**
2. **Name**: `Localhost Limited Web Client`

### 4.3 Add Authorized Redirect URIs

Under **Authorized redirect URIs**, add these URLs:

**For Local Development:**
```
http://localhost:3000/api/oauth/callback
http://localhost:3001/api/oauth/callback
```

**For Production (Manus):**
```
https://3000-iu3nfapyax377eywezb66-2bc01a03.us2.manus.computer/api/oauth/callback
https://your-production-domain.com/api/oauth/callback
```

**For Production (Custom Domain):**
```
https://your-custom-domain.com/api/oauth/callback
```

Click **CREATE**

### 4.4 Copy Your Credentials

You'll see a popup with:
- **Client ID**
- **Client Secret**

**Save these securely** - you'll need them next.

---

## Step 5: Update Your Project Configuration

### 5.1 For Local Development

Create/update your `.env` file:

```env
# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret

# OAuth URLs
OAUTH_SERVER_URL=https://accounts.google.com
VITE_OAUTH_PORTAL_URL=http://localhost:3000
VITE_APP_ID=your-client-id.apps.googleusercontent.com

# Other required vars
JWT_SECRET=your-super-secret-jwt-key-12345
DATABASE_URL=mysql://root:root@localhost:3306/localhost_limited
# ... other variables
```

### 5.2 For Production (Manus)

1. Go to **Management UI** → **Settings** → **Secrets**
2. Add/update these secrets:

| Key | Value |
|-----|-------|
| `GOOGLE_OAUTH_CLIENT_ID` | Your Client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Your Client Secret |
| `OAUTH_SERVER_URL` | `https://accounts.google.com` |
| `VITE_OAUTH_PORTAL_URL` | Your production domain |
| `VITE_APP_ID` | Your Client ID |

---

## Step 6: Update Your Code (If Using Custom OAuth)

### 6.1 Modify OAuth Handler

If you want to customize the Google OAuth flow, update `server/_core/oauth.ts`:

```typescript
// Example: Custom Google OAuth handling
export async function handleGoogleCallback(code: string, state: string) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  
  // Exchange code for token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${process.env.VITE_OAUTH_PORTAL_URL}/api/oauth/callback`,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenResponse.json();
  
  // Get user info
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const user = await userResponse.json();
  
  // Store/update user in database
  return user;
}
```

---

## Step 7: Test Your Setup

### 7.1 Local Testing

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/admin/login`

3. Click **"Login with Google"**

4. You should be redirected to Google login

5. After login, you should be redirected back to your app

### 7.2 Production Testing

1. Deploy your app to production
2. Test the login flow with your production domain
3. Verify the callback URL matches your configuration

---

## Troubleshooting

### Error: "Redirect URI mismatch"

**Problem**: The redirect URI in your request doesn't match the configured one.

**Solution**:
1. Check your `.env` file - `VITE_OAUTH_PORTAL_URL` must match exactly
2. Verify the redirect URI in Google Cloud Console
3. Include the full path: `/api/oauth/callback`

### Error: "Invalid client ID"

**Problem**: Client ID is incorrect or expired.

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Copy the exact Client ID
3. Update your `.env` file
4. Restart your dev server

### Error: "Client secret is invalid"

**Problem**: Client secret is wrong or exposed.

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Delete the old credential
3. Create a new OAuth 2.0 Client ID
4. Copy the new secret
5. Update your `.env` file

### Login button not working

**Problem**: OAuth configuration not loaded.

**Solution**:
1. Verify all environment variables are set
2. Restart dev server: `npm run dev`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check browser console for errors (F12)

---

## Security Best Practices

✅ **DO:**
- Keep Client Secret private (never commit to Git)
- Use HTTPS in production
- Rotate credentials periodically
- Use environment variables for sensitive data
- Restrict redirect URIs to your domain only

❌ **DON'T:**
- Expose Client Secret in frontend code
- Use same credentials for dev and production
- Commit `.env` files to Git
- Share credentials via email or chat
- Use `http://` in production (use `https://`)

---

## Environment Variables Reference

```env
# Required
GOOGLE_OAUTH_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your-secret-here
OAUTH_SERVER_URL=https://accounts.google.com
VITE_OAUTH_PORTAL_URL=http://localhost:3000 (or your domain)
VITE_APP_ID=xxxx.apps.googleusercontent.com

# Optional
JWT_SECRET=your-jwt-secret
DATABASE_URL=mysql://...
RESEND_API_KEY=...
```

---

## Next Steps

1. ✅ Create Google Cloud Project
2. ✅ Enable Google+ API
3. ✅ Create OAuth 2.0 credentials
4. ✅ Add redirect URIs
5. ✅ Update environment variables
6. ✅ Test login flow
7. ✅ Deploy to production

---

## Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In for Web](https://developers.google.com/identity/sign-in/web)
- [OAuth 2.0 Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)

---

**Your project is now ready for Google OAuth authentication! 🚀**
