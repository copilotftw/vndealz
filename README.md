# VNDealz - Proxmox LXC Deployment Guide

This guide covers everything you need to set up the VNDealz application on a fresh Proxmox LXC container (Ubuntu/Debian) using a self-hosted GitHub Actions runner for continuous deployment.

## 1. System Requirements & Initial Setup

Update the system packages on your LXC (`192.168.1.106`):
```bash
apt update && apt upgrade -y
apt install -y curl git ufw nano unzip
```

## 2. Install Dependencies

### Node.js (v20 LTS) & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
```

### MariaDB & Redis
```bash
apt install -y mariadb-server redis-server
systemctl enable mariadb
systemctl enable redis-server
systemctl start mariadb
systemctl start redis-server
```

### Nginx
```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

## 3. Database Configuration

Run the secure installation (set root password, remove test db, etc.):
```bash
mysql_secure_installation
```

Log into MySQL to create the database and user:
```bash
mysql -u root -p
```
```sql
CREATE DATABASE vndealz;
CREATE USER 'vndealz'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON vndealz.* TO 'vndealz'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4. GitHub Actions Self-Hosted Runner Setup

Since you want automatic deployment on `git push`, we need to set up the runner.
1. Go to your GitHub Repository -> **Settings** -> **Actions** -> **Runners**.
2. Click **New self-hosted runner** -> Choose Linux -> x64.
3. Run the provided commands on your LXC (Recommended: Run as a non-root user).

```bash
# Create a user for the runner (do not run Actions as root)
adduser runner
usermod -aG sudo runner
su - runner

# Inside the runner user:
mkdir actions-runner && cd actions-runner
# ... download and configure runner from GitHub UI ...
./config.sh --url https://github.com/your-username/vndealz --token YOUR_TOKEN
sudo ./svc.sh install
sudo ./svc.sh start
```

## 5. Application Setup

Create the application directory and give permissions to your deployment user (e.g., `runner` or `root`):
```bash
mkdir -p /opt/vndealz
chown -R $USER:$USER /opt/vndealz
```

Create the `.env` file at `/opt/vndealz/.env`:
```env
BETTER_AUTH_URL="https://your-domain.com"
DATABASE_URL="mysql://vndealz:your_secure_password@127.0.0.1:3306/vndealz"
REDIS_URL="redis://127.0.0.1:6379"
BETTER_AUTH_SECRET="generate-a-random-secret"

# UploadThing
UPLOADTHING_SECRET="your-secret"
UPLOADTHING_APP_ID="your-app-id"

# Auth Providers
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email
RESEND_API_KEY="your-resend-api-key"
```

## 6. PM2 Configuration (ecosystem.config.js)

Create an `ecosystem.config.js` in `/opt/vndealz` to tell PM2 how to run your Next.js app:
```javascript
module.exports = {
  apps: [
    {
      name: 'vndealz',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3003',
      cwd: '/opt/vndealz',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
```

## 7. Nginx Reverse Proxy Setup

Create a new Nginx configuration file:
```bash
nano /etc/nginx/sites-available/vndealz
```
Paste the following (replace `your-domain.com`):
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
ln -s /etc/nginx/sites-available/vndealz /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 8. Continuous Deployment Workflow

With the GitHub Action `deploy.yml` configured in the codebase, any push to the `main` branch will automatically trigger the runner on your LXC to:
1. `git fetch origin main`
2. `npm ci`
3. `npx prisma db push && npx prisma generate`
4. `npm run build`
5. `pm2 restart vndealz`

Your app will automatically update and restart within seconds of a push!

---
*If you are using Cloudflare Tunnels instead of port forwarding, skip the Nginx configuration and point your Cloudflare Tunnel directly to `http://localhost:3003`.*
