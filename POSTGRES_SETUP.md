# PostgreSQL Database Setup Guide

Complete step-by-step guide for setting up PostgreSQL for Localhost Limited project.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Docker Setup (Recommended)](#docker-setup-recommended)
3. [cPanel PostgreSQL Setup](#cpanel-postgresql-setup)
4. [Database Configuration](#database-configuration)
5. [Running Migrations](#running-migrations)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Option 1: macOS (Homebrew)

**Step 1: Install PostgreSQL**

```bash
brew install postgresql@15
```

**Step 2: Start PostgreSQL Service**

```bash
brew services start postgresql@15
```

**Step 3: Verify Installation**

```bash
psql --version
# Output: psql (PostgreSQL) 15.x
```

**Step 4: Create Database and User**

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL prompt, run:
CREATE DATABASE localhost_limited;
CREATE USER localhost_user WITH PASSWORD 'your-secure-password';
ALTER ROLE localhost_user SET client_encoding TO 'utf8';
ALTER ROLE localhost_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE localhost_user SET default_transaction_deferrable TO on;
ALTER ROLE localhost_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE localhost_limited TO localhost_user;
\q
```

**Step 5: Create Connection String**

```
postgresql://localhost_user:your-secure-password@localhost:5432/localhost_limited
```

---

### Option 2: Windows

**Step 1: Download PostgreSQL**

1. Go to [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Download PostgreSQL 15 installer
3. Run the installer

**Step 2: Installation Configuration**

- Installation directory: `C:\Program Files\PostgreSQL\15`
- Data directory: `C:\Program Files\PostgreSQL\15\data`
- Port: `5432`
- Superuser password: (set a strong password)
- Locale: `[Default locale]`

**Step 3: Create Database and User**

Open `pgAdmin 4` (installed with PostgreSQL):

1. Right-click **Databases** → **Create** → **Database**
2. Name: `localhost_limited`
3. Owner: `postgres`
4. Click **Save**

Create user:

1. Right-click **Login/Group Roles** → **Create** → **Login/Group Role**
2. Name: `localhost_user`
3. Go to **Definition** tab
4. Password: (set strong password)
5. Go to **Privileges** tab
6. Enable: `Can login`, `Create databases`
7. Click **Save**

Grant privileges:

```sql
GRANT ALL PRIVILEGES ON DATABASE localhost_limited TO localhost_user;
```

**Step 4: Create Connection String**

```
postgresql://localhost_user:your-secure-password@localhost:5432/localhost_limited
```

---

### Option 3: Linux (Ubuntu/Debian)

**Step 1: Install PostgreSQL**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**Step 2: Start PostgreSQL Service**

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Step 3: Create Database and User**

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE localhost_limited;
CREATE USER localhost_user WITH PASSWORD 'your-secure-password';
ALTER ROLE localhost_user SET client_encoding TO 'utf8';
ALTER ROLE localhost_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE localhost_user SET default_transaction_deferrable TO on;
ALTER ROLE localhost_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE localhost_limited TO localhost_user;
\q
```

**Step 4: Create Connection String**

```
postgresql://localhost_user:your-secure-password@localhost:5432/localhost_limited
```

---

## Docker Setup (Recommended)

### Why Docker?

- ✅ No installation required
- ✅ Isolated environment
- ✅ Easy to start/stop
- ✅ Same setup on all machines
- ✅ Easy cleanup

### Prerequisites

Install Docker: [docker.com/get-started](https://www.docker.com/get-started)

### Step 1: Create Docker Container

```bash
docker run --name localhost-limited-postgres \
  -e POSTGRES_USER=localhost_user \
  -e POSTGRES_PASSWORD=your-secure-password \
  -e POSTGRES_DB=localhost_limited \
  -p 5432:5432 \
  -d postgres:15
```

### Step 2: Verify Container is Running

```bash
docker ps | grep localhost-limited-postgres
```

You should see the container listed.

### Step 3: Create Connection String

```
postgresql://localhost_user:your-secure-password@localhost:5432/localhost_limited
```

### Step 4: Useful Docker Commands

```bash
# Stop container
docker stop localhost-limited-postgres

# Start container
docker start localhost-limited-postgres

# View logs
docker logs localhost-limited-postgres

# Connect to database
docker exec -it localhost-limited-postgres psql -U localhost_user -d localhost_limited

# Remove container
docker rm localhost-limited-postgres
```

---

## cPanel PostgreSQL Setup

### Step 1: Access cPanel

1. Log in to cPanel: `https://your-domain.com:2083`
2. Username: `localho1`
3. Password: (your cPanel password)

### Step 2: Create PostgreSQL Database

1. Go to **PostgreSQL Databases**
2. Click **Create New Database**
3. Fill in:
   - **Database Name**: `localhost_limited`
   - Click **Create Database**

### Step 3: Create PostgreSQL User

1. In **PostgreSQL Databases**, go to **Create New User**
2. Fill in:
   - **Username**: `localhost_user`
   - **Password**: (generate strong password)
   - **Password (again)**: (confirm password)
   - Click **Create User**

### Step 4: Add User to Database

1. In **PostgreSQL Databases**, scroll to **Add User to Database**
2. Select:
   - **User**: `localhost_user`
   - **Database**: `localhost_limited`
   - Click **Add User to Database**

### Step 5: Get Connection String

1. In **PostgreSQL Databases**, find your database
2. You'll see connection details:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `localhost_limited`
   - **User**: `localhost_user`
   - **Password**: (your password)

**Connection String Format:**

```
postgresql://localhost_user:your-password@localhost:5432/localhost_limited
```

---

## Database Configuration

### Step 1: Update Project Configuration

Your project is already configured for PostgreSQL. Verify `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Step 2: Create `.env` File

In your project root, create `.env`:

```env
# Database
DATABASE_URL=postgresql://localhost_user:your-secure-password@localhost:5432/localhost_limited

# Authentication
JWT_SECRET=your-super-secret-jwt-key-12345
VITE_APP_ID=local-dev-app-id
OAUTH_SERVER_URL=http://localhost:3000
VITE_OAUTH_PORTAL_URL=http://localhost:3000

# Owner
OWNER_EMAIL=admin@localhostlimitedafrica.com
OWNER_NAME=Admin User
OWNER_OPEN_ID=local-dev-owner-id

# Email
RESEND_API_KEY=re_your_resend_api_key_here
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_your_resend_api_key_here
SMTP_FROM_EMAIL=noreply@localhostlimitedafrica.com
SMTP_REPLY_TO=hr@localhostlimitedafrica.com

# APIs
BUILT_IN_FORGE_API_URL=http://localhost:3000
BUILT_IN_FORGE_API_KEY=local-dev-key
VITE_FRONTEND_FORGE_API_URL=http://localhost:3000
VITE_FRONTEND_FORGE_API_KEY=local-dev-key

# Branding
VITE_APP_TITLE=Localhost Limited
VITE_APP_LOGO=https://your-cdn-url/logo.png
```

### Step 3: Verify Connection

```bash
# Test connection
psql postgresql://localhost_user:your-password@localhost:5432/localhost_limited -c "SELECT 1;"
```

You should see:
```
 ?column?
----------
        1
(1 row)
```

---

## Running Migrations

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Generate Migrations

```bash
npm run db:push
```

This will:
1. Generate migration files from schema
2. Apply migrations to database
3. Create all tables

### Step 3: Verify Tables Created

```bash
# Connect to database
psql postgresql://localhost_user:your-password@localhost:5432/localhost_limited

# List tables
\dt

# You should see:
# - users
# - contactSubmissions
# - jobOpenings
# - marketingServices
# - blogPosts
# - organizationPartners
# - galleryImages
# - jobApplications
# - applicationStatusLog
```

---

## Verification

### Step 1: Check Database Connection

```bash
# From project root
npm run db:push
```

You should see:
```
✅ Migrations applied successfully
✅ Database schema created
```

### Step 2: Test Application

```bash
# Start dev server
npm run dev
```

Visit `http://localhost:3000` and verify:
- ✅ Home page loads
- ✅ Navigation works
- ✅ Services page displays
- ✅ Contact form works

### Step 3: Test Admin Panel

1. Go to `http://localhost:3000/admin/cms`
2. You should see the CMS dashboard
3. Try creating a test job or service

---

## Troubleshooting

### Error: "Connection refused"

**Cause:** PostgreSQL is not running

**Solution:**

```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Docker
docker start localhost-limited-postgres

# Windows
# Open Services (services.msc) and start PostgreSQL service
```

### Error: "Database does not exist"

**Cause:** Database wasn't created

**Solution:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE localhost_limited;
\q
```

### Error: "Role does not exist"

**Cause:** User wasn't created

**Solution:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create user
CREATE USER localhost_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE localhost_limited TO localhost_user;
\q
```

### Error: "Permission denied"

**Cause:** User doesn't have privileges

**Solution:**

```bash
# Connect as postgres
psql -U postgres

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE localhost_limited TO localhost_user;
\q
```

### Error: "Port 5432 already in use"

**Cause:** Another PostgreSQL instance is running

**Solution:**

```bash
# Find process using port 5432
lsof -i :5432

# Kill process
kill -9 <PID>

# Or use different port in Docker
docker run -p 5433:5432 ...
```

### Error: "Cannot connect to server"

**Cause:** Wrong connection string

**Solution:**

Verify connection string format:
```
postgresql://username:password@host:port/database
```

Example:
```
postgresql://localhost_user:my-password@localhost:5432/localhost_limited
```

### Error: "Migrations failed"

**Cause:** Database schema issue

**Solution:**

```bash
# Clear old migrations
rm -rf drizzle/migrations/*

# Regenerate migrations
npm run db:push
```

---

## Next Steps

1. ✅ PostgreSQL database is set up
2. ✅ Migrations are applied
3. ✅ Application is connected

**Now you can:**

- Start development: `npm run dev`
- Run tests: `npm test`
- Deploy to production
- Add more data via admin panel

---

## Useful PostgreSQL Commands

```bash
# Connect to database
psql postgresql://localhost_user:password@localhost:5432/localhost_limited

# List databases
\l

# List tables
\dt

# Describe table
\d table_name

# Exit
\q

# Backup database
pg_dump postgresql://localhost_user:password@localhost:5432/localhost_limited > backup.sql

# Restore database
psql postgresql://localhost_user:password@localhost:5432/localhost_limited < backup.sql
```

---

## Support

For PostgreSQL issues:
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- PostgreSQL Community: https://www.postgresql.org/community/

For project issues:
- Check application logs: `npm run dev`
- Review error messages carefully
- Check `.env` file for correct connection string

---

**Your PostgreSQL database is now ready! 🚀**
