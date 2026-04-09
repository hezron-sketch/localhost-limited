# Admin Dashboard Login Guide

## Quick Start

### Step 1: Access the Admin Dashboard URL
Navigate to:
```
https://your-domain.com/admin/submissions
```

Or if running locally:
```
http://localhost:3000/admin/submissions
```

---

## Login Flow

### Step 1: You'll See the Login Redirect
If you're not already logged in, you'll be redirected to the Manus OAuth login page.

**What happens:**
- The dashboard detects you're not authenticated
- You're automatically redirected to Manus login portal
- URL changes to: `https://api.manus.im/oauth/authorize?...`

### Step 2: Sign In with Manus OAuth
On the Manus login page:
1. Enter your **email address**
2. Enter your **password**
3. Click **"Sign In"**

**Or use social login:**
- Click **"Continue with Google"** (if available)
- Click **"Continue with GitHub"** (if available)

### Step 3: Grant Permissions (First Time Only)
First-time login may show a permissions screen:
1. Review the requested permissions
2. Click **"Authorize"** or **"Allow"**

### Step 4: Redirected Back to Dashboard
After successful authentication:
- You're redirected back to the admin dashboard
- Your session cookie is set
- You see the submissions management interface

---

## Access Control

### ✅ You Can Access the Dashboard If:
- ✅ You have a valid Manus account
- ✅ Your user account has `role = 'admin'` in the database
- ✅ You're logged in with an active session

### ❌ You Cannot Access If:
- ❌ You're not logged in (redirected to login)
- ❌ Your account has `role = 'user'` (redirected to home page)
- ❌ Your session has expired (redirected to login)

---

## How to Become an Admin

### Option 1: Owner Email (Automatic)
If you're using the **owner's email** (set in `OWNER_EMAIL` environment variable):
1. Log in for the first time
2. Your account is automatically promoted to `admin`
3. You can immediately access the admin dashboard

### Option 2: Database Update (Manual)
If you need to promote an existing user to admin:

**Via SQL:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

**Via Database UI (if available):**
1. Open the project's Database panel
2. Find the `users` table
3. Locate your user row
4. Change `role` from `'user'` to `'admin'`
5. Click Save

**Via Manus Management UI:**
1. Open your project dashboard
2. Go to **Database** panel
3. Click the `users` table
4. Find your user
5. Edit the `role` field to `'admin'`
6. Save changes

---

## First-Time Setup Checklist

### 1. Ensure You're an Admin
```bash
# Check your user role in the database
# You should see: role = 'admin'
SELECT id, email, role FROM users WHERE email = 'your@email.com';
```

### 2. Visit the Admin Dashboard
```
http://localhost:3000/admin/submissions
```

### 3. You Should See:
- ✅ Header: "Contact Submissions"
- ✅ Statistics cards showing submission counts
- ✅ Submissions table (may be empty if no submissions yet)
- ✅ Filter buttons and sort dropdown
- ✅ "Back to Site" button in top right

### 4. Test the Features
- Click a filter button (e.g., "New")
- Change the sort dropdown
- Try the pagination buttons
- Submit a test contact form to see it appear

---

## Session Management

### Your Session
- **Duration**: Typically 7-30 days (configurable)
- **Storage**: HTTP-only secure cookie (not accessible to JavaScript)
- **Scope**: Entire application (all pages)

### Logout
To log out:
1. Click the **logout button** (if available in your app)
2. Or navigate to: `/logout`
3. Your session cookie is cleared
4. Next page load redirects to login

### Session Expired?
If your session expires:
- You'll be redirected to the login page
- Log in again with your credentials
- You'll be redirected back to the admin dashboard

---

## Troubleshooting

### Problem: "Access Denied" or Redirected to Home Page
**Cause**: Your account doesn't have admin role

**Solution**:
1. Check your user role in database:
   ```sql
   SELECT role FROM users WHERE email = 'your@email.com';
   ```
2. If role is `'user'`, update it:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```
3. Refresh the page and try again

### Problem: Redirected to Login Page
**Cause**: You're not logged in or session expired

**Solution**:
1. Click "Sign In" or "Log In"
2. Enter your Manus credentials
3. Complete OAuth flow
4. You'll be redirected back to the dashboard

### Problem: Blank Page or 404 Error
**Cause**: Dashboard URL is incorrect or dev server isn't running

**Solution**:
1. Verify dev server is running: `pnpm dev`
2. Check the correct URL:
   - Local: `http://localhost:3000/admin/submissions`
   - Production: `https://your-domain.com/admin/submissions`
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for errors (F12)

### Problem: Can't Log In
**Cause**: Manus OAuth service issue or credentials incorrect

**Solution**:
1. Verify your email and password are correct
2. Try a different browser or incognito window
3. Clear browser cookies
4. Check if Manus OAuth service is online
5. Try again in a few minutes

### Problem: Dashboard Loads but No Data
**Cause**: Database connection issue or no submissions yet

**Solution**:
1. Submit a test contact form from the Contact page
2. Refresh the admin dashboard
3. Check database connection in server logs
4. Verify `DATABASE_URL` environment variable is set

---

## Security Best Practices

### ✅ Do:
- ✅ Use a strong, unique password
- ✅ Keep your login credentials private
- ✅ Log out when using shared computers
- ✅ Use HTTPS (not HTTP) in production
- ✅ Monitor admin activity regularly

### ❌ Don't:
- ❌ Share your login credentials
- ❌ Use the same password across services
- ❌ Log in on public WiFi (if possible)
- ❌ Leave your browser open and unattended
- ❌ Click suspicious login links

---

## Multi-Admin Setup

### Add Multiple Admins
You can promote multiple users to admin:

```sql
-- Promote multiple users
UPDATE users SET role = 'admin' WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
);

-- Verify
SELECT email, role FROM users WHERE role = 'admin';
```

### Remove Admin Access
To demote an admin back to regular user:

```sql
UPDATE users SET role = 'user' WHERE email = 'admin@example.com';
```

---

## API Access (Advanced)

### Direct API Calls
If you want to access the admin API programmatically:

```typescript
// Example: Fetch submissions via tRPC
const response = await fetch('/api/trpc/contact.list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Include session cookie
  body: JSON.stringify({
    json: {
      limit: 50,
      offset: 0,
      status: 'new',
    },
  }),
});

const data = await response.json();
console.log(data);
```

### Authentication Required
All admin endpoints require:
- Valid session cookie (set after OAuth login)
- User role = 'admin' in database
- Requests from authenticated context

---

## Environment Variables

### Required for Admin Dashboard
```bash
# OAuth Configuration
VITE_APP_ID=your_app_id
VITE_OAUTH_PORTAL_URL=https://api.manus.im
OAUTH_SERVER_URL=https://api.manus.im

# Database
DATABASE_URL=mysql://user:password@host/database

# Owner Email (optional, auto-promotes to admin)
OWNER_EMAIL=your@email.com
```

### Check Your Setup
```bash
# Verify environment variables are set
echo $DATABASE_URL
echo $VITE_APP_ID
echo $OWNER_EMAIL
```

---

## Support

### If You're Still Having Issues:
1. **Check the logs**: Run `pnpm dev` and look for errors
2. **Read the documentation**: See `ADMIN_DASHBOARD.md` for full feature guide
3. **Verify database**: Ensure `contactSubmissions` table exists
4. **Test manually**: Try submitting a contact form first
5. **Browser console**: Press F12 and check for JavaScript errors

---

## Quick Reference

| Task | URL/Command |
|------|-------------|
| Access Admin Dashboard | `http://localhost:3000/admin/submissions` |
| Log In | Click "Sign In" button or visit login page |
| Log Out | Click logout button or navigate to `/logout` |
| Check Your Role | `SELECT role FROM users WHERE email = 'your@email.com';` |
| Promote to Admin | `UPDATE users SET role = 'admin' WHERE email = 'your@email.com';` |
| View All Admins | `SELECT email FROM users WHERE role = 'admin';` |
| Start Dev Server | `pnpm dev` |
| Run Tests | `pnpm test` |

---

**Last Updated**: April 9, 2026  
**Status**: ✅ Ready for Production  
**Support**: See `ADMIN_DASHBOARD.md` for full feature documentation
