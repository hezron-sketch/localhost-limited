# PostgreSQL + Google OAuth Migration Guide

This guide documents the complete migration of the localhost-limited project from **Manus OAuth + MySQL/TiDB** to **Google OAuth + PostgreSQL**.

## Overview of Changes

### Database Migration
- **Old**: MySQL/TiDB (Manus managed)
- **New**: PostgreSQL (self-hosted or cloud-hosted)
- **Driver**: Changed from `mysql2` to `postgres-js`
- **Schema**: All tables converted to PostgreSQL syntax with proper types and enums

### Authentication Migration
- **Old**: Manus OAuth (proprietary)
- **New**: Google OAuth 2.0 (standard OAuth 2.0)
- **User Identifier**: Changed from `openId` to `googleId` (Google's `sub` claim)
- **Session**: JWT-based sessions remain the same, but payload updated for Google

## Step 1: PostgreSQL Database Setup

### Local Development

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # macOS
   brew install postgresql@15
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create a new database and user**:
   ```bash
   psql -U postgres
   
   -- Create database
   CREATE DATABASE localho1_local_limited;
   
   -- Create user
   CREATE USER localho1_admin WITH PASSWORD 'your_secure_password';
   
   -- Grant privileges
   ALTER ROLE localho1_admin SET client_encoding TO 'utf8';
   ALTER ROLE localho1_admin SET default_transaction_isolation TO 'read committed';
   ALTER ROLE localho1_admin SET default_transaction_deferrable TO on;
   ALTER ROLE localho1_admin SET default_transaction_read_only TO off;
   GRANT ALL PRIVILEGES ON DATABASE localho1_local_limited TO localho1_admin;
   
   -- Exit psql
   \q
   ```

3. **Set DATABASE_URL environment variable**:
   ```bash
   export DATABASE_URL="postgresql://localho1_admin:your_secure_password@localhost:5432/localho1_local_limited"
   ```

### Production Deployment

For production, use a managed PostgreSQL service:
- **AWS RDS**: https://aws.amazon.com/rds/postgresql/
- **DigitalOcean Managed Databases**: https://www.digitalocean.com/products/managed-databases/
- **Heroku Postgres**: https://www.heroku.com/postgres
- **Railway**: https://railway.app/

Set the `DATABASE_URL` environment variable with your production connection string.

## Step 2: Google OAuth Setup

### Create Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create a new project**:
   - Click "Select a Project" → "New Project"
   - Name: "Localhost Limited"
   - Click "Create"

3. **Enable Google+ API**:
   - In the search bar, search for "Google+ API"
   - Click on it and press "Enable"

4. **Create OAuth 2.0 Credentials**:
   - Go to "Credentials" in the left sidebar
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For local development: `http://localhost:3000/api/oauth/callback`
     - For production: `https://yourdomain.com/api/oauth/callback`
   - Click "Create"

5. **Copy credentials**:
   - Save your **Client ID** and **Client Secret**

### Set Environment Variables

```bash
# Backend
export GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="your-client-secret"
export GOOGLE_REDIRECT_URI="http://localhost:3000/api/oauth/callback"  # or production URL

# Frontend
export VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"  # Same as GOOGLE_CLIENT_ID
```

## Step 3: Database Migration

### Generate and Run Migrations

The schema has been converted to PostgreSQL. Run the migration:

```bash
npm run db:push
```

This command will:
1. Generate migration files based on `drizzle/schema.ts`
2. Apply migrations to your PostgreSQL database
3. Create all tables with proper types and enums

### Schema Changes

Key changes from MySQL to PostgreSQL:

| MySQL | PostgreSQL |
|-------|-----------|
| `int().autoincrement()` | `integer().generatedAlwaysAsIdentity()` |
| `mysqlTable()` | `pgTable()` |
| `mysqlEnum()` | `pgEnum()` |
| `varchar()` | `varchar()` |
| `timestamp().onUpdateNow()` | `timestamp().defaultNow()` |
| `onDuplicateKeyUpdate()` | Upsert logic in application code |

### User Table Changes

The `users` table schema has been updated:

```typescript
// Old (MySQL)
openId: varchar("openId", { length: 64 }).notNull().unique()
loginMethod: varchar("loginMethod", { length: 64 })

// New (PostgreSQL)
googleId: varchar("google_id", { length: 255 }).notNull().unique()
picture: text("picture")
loginMethod: varchar("login_method", { length: 64 }).default("google")
```

## Step 4: Code Changes

### Backend Changes

1. **SDK (server/_core/sdk.ts)**:
   - Rewritten to use Google OAuth 2.0 endpoints
   - Token exchange: `https://oauth2.googleapis.com/token`
   - User info: `https://www.googleapis.com/oauth2/v2/userinfo`
   - Session payload now uses `googleId` and `email` instead of `openId`

2. **Database (server/db.ts)**:
   - Changed from `mysql2` to `postgres-js` driver
   - `getUserByOpenId()` → `getUserByGoogleId()`
   - `upsertUser()` updated to use `googleId` instead of `openId`
   - Upsert logic rewritten for PostgreSQL (no `onDuplicateKeyUpdate`)

3. **OAuth Routes (server/_core/oauth.ts)**:
   - Updated to exchange Google authorization codes
   - User info extracted from Google's API response
   - Session token creation updated for Google user data

4. **Environment (server/_core/env.ts)**:
   - Removed Manus-specific variables: `appId`, `oAuthServerUrl`, `ownerOpenId`
   - Added Google OAuth variables: `googleClientId`, `googleClientSecret`, `googleRedirectUri`

### Frontend Changes

1. **Login URL Builder (client/src/const.ts)**:
   - Changed from Manus OAuth portal to Google OAuth
   - New URL: `https://accounts.google.com/o/oauth2/v2/auth`
   - Scopes: `openid email profile`

2. **Auth Hook (client/src/_core/hooks/useAuth.ts)**:
   - No changes needed - works with new user model

### Configuration Changes

1. **Drizzle Config (drizzle.config.ts)**:
   - Changed dialect from `mysql` to `postgresql`

2. **Vite Config (vite.config.ts)**:
   - Removed `vite-plugin-manus-runtime`

3. **Package.json**:
   - Removed `mysql2` dependency
   - Removed `vite-plugin-manus-runtime` dependency
   - `postgres` package already included

## Step 5: Data Migration (if needed)

If you have existing users in MySQL, you'll need to migrate them:

```typescript
// Example migration script
const oldUsers = await oldDb.select().from(oldUsersTable);

for (const user of oldUsers) {
  await newDb.insert(users).values({
    googleId: user.openId, // Map old ID to new format
    name: user.name,
    email: user.email,
    loginMethod: "migrated",
    lastSignedIn: user.lastSignedIn,
  });
}
```

## Step 6: Testing

### Run Tests

```bash
npm test
```

### Manual Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test login flow**:
   - Navigate to `http://localhost:3000`
   - Click "Get Started" or login button
   - You should be redirected to Google login
   - After authentication, you should be redirected back to the app

3. **Verify user creation**:
   - Check the `users` table in PostgreSQL:
   ```sql
   SELECT * FROM users;
   ```

## Deployment

### Environment Variables for Production

Set these environment variables in your production environment:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secure-jwt-secret
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/oauth/callback
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Build and Start

```bash
npm run build
npm run start
```

## Troubleshooting

### Database Connection Issues

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

**Solution**: Ensure PostgreSQL is running and the connection string is correct.

```bash
# Check PostgreSQL status
psql -U postgres -c "SELECT version();"
```

### Google OAuth Issues

**Error**: `Invalid client_id`

**Solution**: Verify your Google Client ID matches the one in your environment variables.

**Error**: `Redirect URI mismatch`

**Solution**: Ensure the redirect URI in your Google Cloud Console matches exactly:
- Local: `http://localhost:3000/api/oauth/callback`
- Production: `https://yourdomain.com/api/oauth/callback`

### Session Cookie Issues

**Error**: `Invalid session cookie`

**Solution**: Ensure `JWT_SECRET` is set and consistent across deployments.

## Rollback Plan

If you need to rollback to Manus OAuth:

1. Revert to the previous checkpoint
2. Restore MySQL/TiDB database from backup
3. Redeploy with old environment variables

## Security Considerations

1. **JWT Secret**: Use a strong, randomly generated secret for `JWT_SECRET`
2. **Google Credentials**: Never commit `GOOGLE_CLIENT_SECRET` to version control
3. **HTTPS**: Always use HTTPS in production for OAuth redirects
4. **Database**: Use SSL/TLS for PostgreSQL connections in production

## Support

For issues with:
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Drizzle ORM**: https://orm.drizzle.team/

## Summary of Files Changed

- `drizzle.config.ts` - Dialect changed to PostgreSQL
- `drizzle/schema.ts` - Schema converted to PostgreSQL types
- `server/db.ts` - Driver changed to postgres-js
- `server/_core/sdk.ts` - Rewritten for Google OAuth
- `server/_core/oauth.ts` - Updated for Google OAuth callback
- `server/_core/env.ts` - Updated environment variables
- `client/src/const.ts` - Updated login URL builder
- `vite.config.ts` - Removed Manus plugin
- `package.json` - Removed Manus dependencies
