# PostgreSQL Database Setup Guide

This guide walks you through setting up your PostgreSQL database for Localhost Limited.

## Prerequisites

- PostgreSQL 12+ installed locally or access to a PostgreSQL server
- Node.js 18+ installed
- Environment variables configured

## Step 1: Install PostgreSQL

### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Windows
Download and install from: https://www.postgresql.org/download/windows/

## Step 2: Create Database and User

Connect to PostgreSQL:
```bash
psql -U postgres
```

Create the database and user:
```sql
-- Create database
CREATE DATABASE localho1_local_limited;

-- Create user
CREATE USER localho1_admin WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE localho1_local_limited TO localho1_admin;

-- Connect to the database
\c localho1_local_limited

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO localho1_admin;

-- Exit
\q
```

## Step 3: Configure Environment Variables

Update your `.env` file (or set via Management UI secrets):

```env
DATABASE_URL=postgresql://localho1_admin:your_secure_password@localhost:5432/localho1_local_limited
```

**For production/cloud databases:**
```env
DATABASE_URL=postgresql://username:password@host:port/database_name?sslmode=require
```

Common cloud providers:
- **AWS RDS**: `postgresql://user:pass@xxx.rds.amazonaws.com:5432/dbname?sslmode=require`
- **DigitalOcean**: `postgresql://user:pass@xxx.db.ondigitalocean.com:25060/dbname?sslmode=require`
- **Railway**: `postgresql://user:pass@xxx.railway.app:5432/dbname?sslmode=require`
- **Supabase**: `postgresql://postgres:pass@xxx.supabase.co:5432/postgres?sslmode=require`

## Step 4: Initialize Database Schema

Run the initialization script to create all tables and enums:

```bash
node init-db.mjs
```

**Output:**
```
🔧 Starting database initialization...

📝 Creating enums...
✅ Enums created

📝 Creating tables...
✅ Tables created

📝 Creating indexes...
✅ Indexes created

🎉 Database initialization completed successfully!

📊 Summary:
   ✓ 12 enums created
   ✓ 8 tables created
   ✓ 18 indexes created
```

## Step 5: Seed Sample Data (Optional)

Populate the database with sample data:

```bash
node seed-db.mjs
```

**Output:**
```
🌱 Starting database seeding...

📝 Seeding admin user...
✅ Admin user seeded

📝 Seeding job openings...
✅ 3 job openings seeded

📝 Seeding marketing services...
✅ 4 marketing services seeded

📝 Seeding blog posts...
✅ 4 blog posts seeded

📝 Seeding organization partners...
✅ 3 organization partners seeded

📝 Seeding gallery images...
✅ 5 gallery images seeded

🎉 Database seeding completed successfully!
```

## Step 6: Verify Database Connection

Start the development server:

```bash
npm run dev
```

The server will connect to PostgreSQL and you should see no connection errors.

## Database Schema Overview

### Core Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts with Google OAuth |
| `contact_submissions` | Contact form submissions |
| `job_openings` | Job postings |
| `marketing_services` | Service offerings |
| `blog_posts` | Blog articles |
| `organization_partners` | Partner information |
| `gallery_images` | Website images |
| `job_applications` | Job application submissions |
| `application_status_log` | Audit log for application changes |

### Enums (Enum Types)

- `role`: `user`, `admin`
- `contact_status`: `new`, `reviewed`, `replied`, `archived`
- `job_type`: `full-time`, `part-time`, `contract`, `remote`
- `job_status`: `active`, `archived`
- `service_category`: `social-media`, `seo`, `content`, `other`
- `service_status`: `active`, `archived`
- `blog_category`: `organization`, `hr-sourcing`, `marketing`, `partnerships`
- `blog_status`: `draft`, `published`, `archived`
- `partner_type`: `corporate`, `startup`, `agency`, `other`
- `partner_status`: `active`, `inactive`
- `gallery_section`: `hero`, `services`, `team`, `partners`, `testimonials`, `other`
- `application_status`: `pending`, `reviewed`, `accepted`, `rejected`

## Troubleshooting

### Connection Refused
```
Error: Client network socket disconnected before secure TLS connection was established
```

**Solutions:**
1. Verify PostgreSQL is running: `psql -U postgres -c "SELECT 1"`
2. Check DATABASE_URL is correct
3. Ensure firewall allows port 5432
4. For cloud databases, verify SSL settings

### Permission Denied
```
Error: permission denied for schema public
```

**Solution:** Grant privileges:
```sql
GRANT ALL ON SCHEMA public TO localho1_admin;
```

### Table Already Exists
The `init-db.mjs` script uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times.

### Need to Reset Database

⚠️ **Warning: This will delete all data!**

```bash
psql -U postgres -c "DROP DATABASE IF EXISTS localho1_local_limited;"
psql -U postgres -c "CREATE DATABASE localho1_local_limited;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE localho1_local_limited TO localho1_admin;"
node init-db.mjs
node seed-db.mjs
```

## Production Deployment

### Using AWS RDS

1. Create RDS PostgreSQL instance
2. Get the endpoint (e.g., `xxx.rds.amazonaws.com`)
3. Set DATABASE_URL in environment:
   ```
   postgresql://admin:password@xxx.rds.amazonaws.com:5432/localhost_limited?sslmode=require
   ```
4. Run initialization script
5. Deploy application

### Using DigitalOcean

1. Create Managed PostgreSQL cluster
2. Get connection string from dashboard
3. Set DATABASE_URL
4. Run initialization script
5. Deploy application

### Using Railway

1. Create PostgreSQL database
2. Copy connection string from Railway dashboard
3. Set DATABASE_URL in Manus secrets
4. Run initialization script
5. Deploy application

## Backup and Restore

### Backup Database
```bash
pg_dump -U localho1_admin -h localhost localho1_local_limited > backup.sql
```

### Restore Database
```bash
psql -U localho1_admin -h localhost localho1_local_limited < backup.sql
```

## Next Steps

1. ✅ Database initialized
2. ✅ Sample data seeded
3. Start development server: `npm run dev`
4. Access admin panel at `/admin/login`
5. Login with Google OAuth
6. Manage content through the admin dashboard

## Support

For issues or questions:
- Check `.manus-logs/devserver.log` for connection errors
- Verify DATABASE_URL format
- Ensure PostgreSQL user has proper permissions
- Check firewall/network settings for cloud databases
