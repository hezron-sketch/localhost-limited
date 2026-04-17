# Localhost Limited - npm Setup Guide

This project is now fully configured to work with **npm** as the package manager.

## Quick Start with npm

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=mysql://root:root@localhost:3306/localhost_limited

# Authentication & OAuth
JWT_SECRET=your-super-secret-jwt-key-12345
VITE_APP_ID=local-dev-app-id
OAUTH_SERVER_URL=http://localhost:3000
VITE_OAUTH_PORTAL_URL=http://localhost:3000

# Owner Information
OWNER_EMAIL=admin@localhostlimitedafrica.com
OWNER_NAME=Admin User
OWNER_OPEN_ID=local-dev-owner-id

# Email (Resend API)
RESEND_API_KEY=re_your_resend_api_key_here
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_your_resend_api_key_here
SMTP_FROM_EMAIL=noreply@localhostlimitedafrica.com
SMTP_REPLY_TO=hr@localhostlimitedafrica.com

# Built-in APIs
BUILT_IN_FORGE_API_URL=http://localhost:3000
BUILT_IN_FORGE_API_KEY=local-dev-key
VITE_FRONTEND_FORGE_API_URL=http://localhost:3000
VITE_FRONTEND_FORGE_API_KEY=local-dev-key

# App Branding
VITE_APP_TITLE=Localhost Limited
VITE_APP_LOGO=https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/logo_482f18a6.png

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=http://localhost:3000
VITE_ANALYTICS_WEBSITE_ID=local-dev
```

### 3. Set Up Database

```bash
npm run db:push
```

This will:
- Generate migrations from the schema
- Create all tables in your MySQL database
- Set up all required ENUM types

### 4. Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## npm Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Push database migrations |
| `npm test` | Run vitest tests |
| `npm run format` | Format code with Prettier |
| `npm run check` | TypeScript type checking |

---

## Project Configuration

### .npmrc

The `.npmrc` file contains npm-specific settings:

```
legacy-peer-deps=true    # Handle peer dependency conflicts
save-exact=false         # Use caret ranges (^) for dependencies
engine-strict=false      # Allow Node version flexibility
```

### package.json

- **packageManager**: Set to `npm@10.0.0`
- **All pnpm-specific config removed**
- **All dependencies use standard npm syntax**

---

## Deployment to Server

### Prerequisites

- Node.js 22.13.0+
- npm 10.0.0+
- MySQL 8.0+

### Steps

1. **Clone the project**
   ```bash
   git clone <your-repo-url>
   cd localhost-limited
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** with production values

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Start the server**
   ```bash
   npm start
   ```

### Using PM2 for Process Management

```bash
npm install -g pm2

# Start the app
pm2 start "npm start" --name "localhost-limited"

# Auto-restart on reboot
pm2 startup
pm2 save

# View logs
pm2 logs localhost-limited
```

---

## Troubleshooting

### npm install fails

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use

```bash
PORT=3001 npm start
```

### Database connection error

```bash
# Verify MySQL is running
mysql -u root -p

# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Run migrations
npm run db:push
```

### TypeScript errors

```bash
npm run check
```

### Code formatting

```bash
npm run format
```

---

## Migration from pnpm

If you were previously using pnpm:

1. **Delete pnpm lock file**
   ```bash
   rm pnpm-lock.yaml
   ```

2. **Install with npm**
   ```bash
   npm install
   ```

3. **Use npm commands** instead of `pnpm`

---

## Project Structure

```
localhost-limited/
├── client/              # React frontend
├── server/              # Express backend
├── drizzle/             # Database schema
├── shared/              # Shared types
├── package.json         # npm configuration
├── .npmrc              # npm settings
├── .env                # Environment variables
└── LOCAL_SETUP.md      # Local development guide
```

---

## Support

For issues:
1. Check the troubleshooting section above
2. Review LOCAL_SETUP.md for local development
3. Check Vite docs: https://vitejs.dev
4. Check Drizzle ORM docs: https://orm.drizzle.team

---

**Happy coding with npm! 🚀**
