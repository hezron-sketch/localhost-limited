# Quick Start: PostgreSQL + Google OAuth

## For Local Development

### 1. Set Up PostgreSQL

```bash
# Create database and user
createdb localho1_local_limited
createuser localho1_admin
psql -U postgres -d postgres -c "ALTER USER localho1_admin WITH PASSWORD 'your_password';"
psql -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE localho1_local_limited TO localho1_admin;"
```

### 2. Set Environment Variables

Create a `.env.local` file in the project root:

```bash
DATABASE_URL="postgresql://localho1_admin:your_password@localhost:5432/localho1_local_limited"
JWT_SECRET="your-secure-jwt-secret-min-32-chars"
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/oauth/callback"
VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

### 3. Run Migrations

```bash
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Test Login

- Open `http://localhost:3000`
- Click "Get Started" to test Google OAuth login
- You should be redirected to Google's login page
- After authentication, you'll be logged into the app

## For Production Deployment

### 1. Set Up PostgreSQL (Cloud)

Use a managed PostgreSQL service:
- AWS RDS
- DigitalOcean Managed Databases
- Railway
- Heroku Postgres

Get your connection string and set it as `DATABASE_URL`.

### 2. Set Production Environment Variables

```bash
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secure-jwt-secret"
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="https://yourdomain.com/api/oauth/callback"
VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

### 3. Build and Deploy

```bash
npm run build
npm run start
```

## Key Differences from Manus OAuth

| Aspect | Manus OAuth | Google OAuth |
|--------|------------|--------------|
| **User ID** | `openId` | `googleId` (Google's `sub`) |
| **Database** | MySQL/TiDB | PostgreSQL |
| **Login URL** | Manus portal | Google Accounts |
| **Scopes** | Proprietary | `openid email profile` |
| **Token Exchange** | Manus API | Google OAuth 2.0 |

## Troubleshooting

### "Google OAuth credentials not configured"

Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in your environment.

### "Invalid redirect URI"

The redirect URI must match exactly in:
1. Your `.env` file (`GOOGLE_REDIRECT_URI`)
2. Google Cloud Console (Authorized redirect URIs)

### "Database connection failed"

Check that:
1. PostgreSQL is running
2. `DATABASE_URL` is correct
3. The database and user exist

### "Cannot find module 'postgres'"

Run `npm install` to install dependencies.

## Next Steps

1. Read the full [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed information
2. Check [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for Google Cloud setup details
3. Review the code changes in key files:
   - `server/_core/sdk.ts` - Google OAuth implementation
   - `server/db.ts` - PostgreSQL database helpers
   - `drizzle/schema.ts` - PostgreSQL schema

## Support

- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Drizzle ORM**: https://orm.drizzle.team/
