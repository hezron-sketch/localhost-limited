# Localhost Limited - Local Development Setup

This guide will help you run the Localhost Limited project locally with MySQL.

## Prerequisites

- **Node.js**: 22.13.0+ (download from [nodejs.org](https://nodejs.org))
- **pnpm**: Package manager (install with `npm install -g pnpm`)
- **MySQL**: 8.0+ or MariaDB 10.5+

## Step 1: Install MySQL

### Option A: Using Docker (Recommended)

```bash
docker run --name localhost-limited-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=localhost_limited \
  -p 3306:3306 \
  -d mysql:8.0
```

### Option B: Install Locally

**macOS (Homebrew):**
```bash
brew install mysql
brew services start mysql
mysql -u root -e "CREATE DATABASE localhost_limited;"
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mysql-server
sudo mysql -u root -e "CREATE DATABASE localhost_limited;"
```

**Windows:**
Download from [mysql.com](https://dev.mysql.com/downloads/mysql/) and follow the installer.

## Step 2: Clone/Download the Project

```bash
# If you have the project as a ZIP file
unzip localhost-limited.zip
cd localhost-limited

# Or clone from GitHub
git clone <your-repo-url>
cd localhost-limited
```

## Step 3: Install Dependencies

```bash
pnpm install
```

## Step 4: Create `.env.local` File

Create a file named `.env.local` in the project root with:

```env
# Database
DATABASE_URL=mysql://root:root@localhost:3306/localhost_limited

# Authentication & OAuth
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
VITE_APP_ID=local-dev-app-id
OAUTH_SERVER_URL=http://localhost:3000
VITE_OAUTH_PORTAL_URL=http://localhost:3000

# Owner Information
OWNER_EMAIL=admin@localhostlimitedafrica.com
OWNER_NAME=Admin User
OWNER_OPEN_ID=local-dev-owner-id

# Email (Optional - for local testing)
RESEND_API_KEY=re_your_resend_api_key_here
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_your_resend_api_key_here
SMTP_FROM_EMAIL=noreply@localhostlimitedafrica.com
SMTP_REPLY_TO=hr@localhostlimitedafrica.com

# Built-in APIs (Local)
BUILT_IN_FORGE_API_URL=http://localhost:3000
BUILT_IN_FORGE_API_KEY=local-dev-key
VITE_FRONTEND_FORGE_API_URL=http://localhost:3000
VITE_FRONTEND_FORGE_API_KEY=local-dev-key

# App Branding
VITE_APP_TITLE=Localhost Limited
VITE_APP_LOGO=https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/logo-mAJanvygtVwYcoE3qDYBQ.webp
```

## Step 5: Set Up Database Schema

```bash
pnpm db:push
```

This will:
1. Generate migrations from the schema
2. Create all tables in your MySQL database
3. Set up all required ENUM types

## Step 6: Start Development Server

```bash
pnpm dev
```

The app will be available at: **http://localhost:3000**

## Step 7: Create Test Data (Optional)

You can add test data through the CMS dashboard:

1. Go to http://localhost:3000/admin/cms
2. Log in with your credentials
3. Add jobs, services, blog posts, etc.

## Available Commands

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Format code
pnpm format

# Build for production
pnpm build

# Push database migrations
pnpm db:push
```

## Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Make sure MySQL is running
```bash
# Docker
docker start localhost-limited-mysql

# macOS
brew services start mysql

# Ubuntu
sudo service mysql start
```

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 pnpm dev
```

### Database Schema Not Created
```bash
# Regenerate migrations
pnpm db:push

# If that doesn't work, manually create the database
mysql -u root -p -e "DROP DATABASE localhost_limited; CREATE DATABASE localhost_limited;"
pnpm db:push
```

### Authentication Issues
- Make sure `VITE_OAUTH_PORTAL_URL` is set to `http://localhost:3000`
- Check that `JWT_SECRET` is set (can be any random string for local dev)
- Clear browser cookies and try logging in again

## Project Structure

```
localhost-limited/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   └── App.tsx        # Main app component
│   └── public/            # Static files
├── server/                # Express backend
│   ├── db.ts              # Database queries
│   ├── routers.ts         # tRPC procedures
│   └── _core/             # Core utilities
├── drizzle/               # Database schema
│   ├── schema.ts          # Table definitions
│   └── migrations/        # SQL migrations
├── shared/                # Shared types
└── package.json           # Dependencies
```

## Database Tables

The project includes these tables:

- **users** - User accounts and authentication
- **contactSubmissions** - Contact form submissions
- **jobOpenings** - Job listings
- **jobApplications** - Job applications
- **marketingServices** - Service offerings
- **blogPosts** - Blog articles
- **organizationPartners** - Partner information
- **galleryImages** - Gallery images
- **applicationStatusLog** - Application status history

## Next Steps

1. ✅ Install MySQL
2. ✅ Set up `.env.local`
3. ✅ Run `pnpm install`
4. ✅ Run `pnpm db:push`
5. ✅ Run `pnpm dev`
6. ✅ Visit http://localhost:3000
7. ✅ Log in and explore the admin panel

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the project README.md
- Check Vite documentation: https://vitejs.dev
- Check Drizzle ORM docs: https://orm.drizzle.team

Happy coding! 🚀
