# cPanel Deployment Guide - Localhost Limited

Complete guide for deploying your full-stack Node.js application to cPanel with PostgreSQL database.

## Prerequisites

- cPanel account with Node.js support (cPanel v102+)
- Domain: `localhostlimitedafrica.com`
- cPanel username: `localho1`
- PostgreSQL database support enabled
- SSH access enabled

## Step 1: Set Up PostgreSQL Database in cPanel

### Create Database

1. Log in to cPanel
2. Go to **PostgreSQL Databases**
3. Create new database:
   - **Database Name**: `localho1_localhost_limited`
   - **Database User**: `localho1_user`
   - **Password**: (generate strong password)
4. Click **Create Database**
5. Note the connection details:
   ```
   Host: localhost
   Port: 5432
   Database: localho1_localhost_limited
   User: localho1_user
   Password: (your password)
   ```

### Create Database Connection String

```
postgresql://localho1_user:PASSWORD@localhost:5432/localho1_localhost_limited
```

Replace `PASSWORD` with your actual password.

## Step 2: Upload Project Files

### Option A: Via Git (Recommended)

1. SSH into your cPanel account:
   ```bash
   ssh localho1@localhostlimitedafrica.com
   ```

2. Navigate to public_html:
   ```bash
   cd ~/public_html
   ```

3. Clone your repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/localhost-limited.git .
   ```

### Option B: Via FTP

1. Download all project files
2. Connect via FTP to your cPanel account
3. Upload to `/public_html` directory
4. Ensure `.cpanel.yml` is included

## Step 3: Configure Environment Variables

### Create .env File in cPanel

1. SSH into your account:
   ```bash
   ssh localho1@localhostlimitedafrica.com
   cd ~/public_html
   ```

2. Create `.env` file:
   ```bash
   nano .env
   ```

3. Add your environment variables:
   ```env
   NODE_ENV=production
   PORT=3077
   DATABASE_URL=postgresql://localho1_user:YOUR_PASSWORD@localhost:5432/localho1_localhost_limited
   
   JWT_SECRET=your-production-jwt-secret-key-32-chars-minimum
   VITE_APP_ID=your-production-app-id
   OAUTH_SERVER_URL=https://localhostlimitedafrica.com
   VITE_OAUTH_PORTAL_URL=https://localhostlimitedafrica.com
   
   OWNER_EMAIL=admin@localhostlimitedafrica.com
   OWNER_NAME=Admin User
   OWNER_OPEN_ID=your-owner-open-id
   
   RESEND_API_KEY=your-resend-api-key
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASSWORD=your-resend-api-key
   SMTP_FROM_EMAIL=noreply@localhostlimitedafrica.com
   SMTP_REPLY_TO=hr@localhostlimitedafrica.com
   
   BUILT_IN_FORGE_API_URL=https://localhostlimitedafrica.com
   BUILT_IN_FORGE_API_KEY=your-forge-api-key
   VITE_FRONTEND_FORGE_API_URL=https://localhostlimitedafrica.com
   VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key
   
   VITE_APP_TITLE=Localhost Limited
   VITE_APP_LOGO=https://your-cdn-url/logo.png
   ```

4. Save (Ctrl+X, then Y, then Enter)

## Step 4: Install Dependencies and Build

### SSH Commands

```bash
ssh localho1@localhostlimitedafrica.com
cd ~/public_html

# Install dependencies
npm install

# Run database migrations
npm run db:push

# Build for production
npm run build
```

## Step 5: Set Up Node.js Application in cPanel

### Via cPanel UI (Recommended)

1. Log in to cPanel
2. Go to **Node.js Selector** or **Setup Node.js App**
3. Click **Create Application**
4. Configure:
   - **Node.js version**: 22.x
   - **Application mode**: Production
   - **Application root**: `/public_html`
   - **Application URL**: `localhostlimitedafrica.com`
   - **Application startup file**: `dist/index.js` or `server/_core/index.ts`
   - **Port**: 3077
5. Click **Create**

### Via Command Line

```bash
# Create application configuration
cat > ~/.cpanel/nodejs/applications/localhost-limited.json << 'EOF'
{
  "name": "localhost-limited",
  "script": "dist/index.js",
  "nodeVersion": "22.x",
  "port": 3077,
  "domain": "localhostlimitedafrica.com",
  "appRoot": "/public_html"
}
EOF
```

## Step 6: Configure SSL Certificate

1. Go to cPanel **AutoSSL** or **Let's Encrypt for cPanel**
2. Select your domain: `localhostlimitedafrica.com`
3. Click **Issue**
4. Wait for certificate to be issued (usually instant)

## Step 7: Set Up Reverse Proxy

### Create .htaccess

Create or update `~/public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://127.0.0.1:3077/$1 [P,L]
</IfModule>

# Proxy WebSocket connections
<IfModule mod_proxy.c>
  ProxyRequests Off
  ProxyPreserveHost On
  ProxyPass / http://127.0.0.1:3077/
  ProxyPassReverse / http://127.0.0.1:3077/
</IfModule>
```

## Step 8: Verify Deployment

### Check Application Status

```bash
# SSH into cPanel
ssh localho1@localhostlimitedafrica.com

# Check if Node.js app is running
ps aux | grep node

# Check logs
tail -f ~/.cpanel/nodejs/applications/localhost-limited/logs/error.log
```

### Test Website

1. Visit `https://localhostlimitedafrica.com`
2. You should see your application
3. Test all pages and functionality

## Step 9: Set Up Auto-Restart

### Create Restart Script

```bash
# SSH into cPanel
ssh localho1@localhostlimitedafrica.com

# Create restart script
cat > ~/restart-app.sh << 'EOF'
#!/bin/bash
cd ~/public_html
npm run build
pkill -f "node dist/index.js"
npm start &
EOF

chmod +x ~/restart-app.sh
```

### Add to Cron (Optional)

```bash
# Edit crontab
crontab -e

# Add this line to restart daily at 2 AM
0 2 * * * ~/restart-app.sh
```

## Troubleshooting

### Application Not Starting

**Check logs:**
```bash
tail -f ~/.cpanel/nodejs/applications/localhost-limited/logs/error.log
```

**Common issues:**
- Missing `.env` file
- Wrong PORT number
- Database connection failed
- Missing dependencies

**Solution:**
```bash
cd ~/public_html
npm install
npm run db:push
npm start
```

### Database Connection Failed

**Verify connection:**
```bash
psql -h localhost -U localho1_user -d localho1_localhost_limited
```

**Check connection string in `.env`:**
```
DATABASE_URL=postgresql://localho1_user:PASSWORD@localhost:5432/localho1_localhost_limited
```

### Port Already in Use

**Find process using port 3077:**
```bash
lsof -i :3077
```

**Kill process:**
```bash
kill -9 <PID>
```

**Use different port:**
- Update `.env`: `PORT=3078`
- Update cPanel Node.js app settings

### SSL Certificate Issues

1. Go to cPanel **AutoSSL**
2. Click **Force Renewal**
3. Wait for certificate to be issued

### WebSocket Connection Failed

**Update `.htaccess`:**
```apache
<IfModule mod_proxy_wstunnel.c>
  ProxyPass /ws ws://127.0.0.1:3077/ws
  ProxyPassReverse /ws ws://127.0.0.1:3077/ws
</IfModule>
```

## Performance Optimization

### Enable Gzip Compression

Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### Set Cache Headers

Add to `.htaccess`:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## Maintenance

### Regular Updates

```bash
# SSH into cPanel
ssh localho1@localhostlimitedafrica.com
cd ~/public_html

# Update dependencies
npm update

# Rebuild
npm run build

# Restart application
pkill -f "node dist/index.js"
npm start &
```

### Database Backups

```bash
# Backup PostgreSQL database
pg_dump -h localhost -U localho1_user localho1_localhost_limited > backup.sql

# Restore from backup
psql -h localhost -U localho1_user localho1_localhost_limited < backup.sql
```

### Monitor Logs

```bash
# View real-time logs
tail -f ~/.cpanel/nodejs/applications/localhost-limited/logs/error.log

# View access logs
tail -f ~/logs/access_log
```

## Support

For cPanel-specific issues:
- cPanel Documentation: https://documentation.cpanel.net
- cPanel Support: https://cpanel.com/support

For application issues:
- Email: hr@localhostlimitedafrica.com
- Check application logs for error details

---

**Your application is now deployed on cPanel! 🚀**
