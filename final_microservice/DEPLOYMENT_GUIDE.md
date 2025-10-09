# Deployment Guide - Find My Stuff

> Instructions for deploying to production environments

## Deployment Options

This application can be deployed to various platforms:

1. **Cloud Platforms** - Heroku, AWS, Google Cloud, Azure
2. **Container Platforms** - Docker, Kubernetes
3. **VPS** - DigitalOcean, Linode, Vultr
4. **Serverless** - AWS Lambda, Vercel, Netlify (frontend only)

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Monitoring setup
- [ ] Backup strategy in place

## Option 1: Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

#### 1. Prepare Application

```bash
# Create Procfile in backend directory
echo "web: node api-gateway/server.js" > backend/Procfile

# Create .slugignore
echo "*.md" > .slugignore
echo "docs/" >> .slugignore
```

#### 2. Create Heroku Apps

```bash
# Login to Heroku
heroku login

# Create app for backend
heroku create your-app-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_production_secret
heroku config:set NODE_ENV=production
```

#### 3. Deploy Backend

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-backend
git push heroku main
```

#### 4. Run Migrations

```bash
heroku run npm run db:setup
heroku run npm run db:seed
```

#### 5. Deploy Frontend

```bash
# Update API URL in frontend
echo "VITE_API_URL=https://your-app-backend.herokuapp.com/api" > .env.production

# Build frontend
npm run build

# Deploy to Netlify/Vercel or serve from backend
```

## Option 2: Docker Deployment

### Create Dockerfiles

#### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY api-gateway/package*.json ./api-gateway/
COPY services/*/package*.json ./services/

# Install dependencies
RUN npm install
RUN cd api-gateway && npm install
RUN cd services/user-service && npm install
# ... repeat for all services

# Copy application code
COPY . .

EXPOSE 3000 3001 3002 3003 3004 3005

CMD ["npm", "start"]
```

#### Frontend Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: find_my_stuff
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: find_my_stuff
      DB_USER: postgres
      DB_PASSWORD: postgres
      JWT_SECRET: your_secret_key
    ports:
      - "3000:3000"
      - "3001:3001"
      - "3002:3002"
      - "3003:3003"
      - "3004:3004"
      - "3005:3005"
    depends_on:
      - postgres

  frontend:
    build: .
    environment:
      VITE_API_URL: http://localhost:3000/api
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec backend npm run db:setup

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Option 3: AWS Deployment

### Architecture

- **Frontend**: S3 + CloudFront
- **Backend**: EC2 or ECS
- **Database**: RDS PostgreSQL
- **Load Balancer**: Application Load Balancer

### Steps

#### 1. Setup RDS Database

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier find-my-stuff-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your_password \
  --allocated-storage 20
```

#### 2. Deploy Backend to EC2

```bash
# Launch EC2 instance
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone and setup
git clone your-repo
cd final_microservice/backend
npm install
npm run install:all

# Setup environment
cp .env.example .env
# Edit .env with RDS credentials

# Run migrations
npm run db:setup

# Install PM2 for process management
sudo npm install -g pm2
pm2 start scripts/start-all.js
pm2 save
pm2 startup
```

#### 3. Deploy Frontend to S3

```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Setup CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name your-bucket-name.s3.amazonaws.com
```

## Option 4: DigitalOcean Deployment

### Using App Platform

1. Connect GitHub repository
2. Configure build settings:
   - **Backend**: Node.js, Port 3000
   - **Frontend**: Static Site
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

### Using Droplet (VPS)

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Install Node.js and PostgreSQL
apt update
apt install -y nodejs npm postgresql postgresql-contrib

# Setup PostgreSQL
sudo -u postgres psql
CREATE DATABASE find_my_stuff;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE find_my_stuff TO your_user;
\q

# Clone and setup application
git clone your-repo
cd final_microservice

# Install dependencies
npm install
cd backend && npm install && npm run install:all

# Setup environment
cp .env.example .env
# Edit .env

# Run migrations
npm run db:setup

# Install PM2
npm install -g pm2

# Start services
cd backend
pm2 start scripts/start-all.js --name find-my-stuff
pm2 save
pm2 startup

# Setup Nginx reverse proxy
apt install -y nginx
```

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/find-my-stuff
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/find-my-stuff/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Gateway
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/find-my-stuff /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Setup SSL with Let's Encrypt
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

## Environment Variables for Production

```env
# Database
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=find_my_stuff_prod
DB_USER=prod_user
DB_PASSWORD=strong_password_here

# JWT
JWT_SECRET=very_long_random_string_change_this

# Node
NODE_ENV=production

# Services
API_GATEWAY_PORT=3000
USER_SERVICE_PORT=3001
ITEM_SERVICE_PORT=3002
SEARCH_SERVICE_PORT=3003
AI_SERVICE_PORT=3004
ANALYTICS_SERVICE_PORT=3005

# URLs (for service communication)
API_GATEWAY_URL=http://localhost:3000
USER_SERVICE_URL=http://localhost:3001
ITEM_SERVICE_URL=http://localhost:3002
SEARCH_SERVICE_URL=http://localhost:3003
AI_SERVICE_URL=http://localhost:3004
ANALYTICS_SERVICE_URL=http://localhost:3005

# Frontend
VITE_API_URL=https://your-domain.com/api
```

## Security Hardening

### 1. Environment Variables
- Never commit `.env` files
- Use secrets management (AWS Secrets Manager, HashiCorp Vault)
- Rotate secrets regularly

### 2. Database
- Use strong passwords
- Enable SSL connections
- Restrict network access
- Regular backups
- Enable query logging

### 3. Application
- Enable HTTPS only
- Set secure headers
- Implement rate limiting
- Add CSRF protection
- Enable CORS properly
- Sanitize all inputs

### 4. Server
- Keep OS updated
- Configure firewall
- Disable root login
- Use SSH keys only
- Install fail2ban
- Regular security audits

## Monitoring Setup

### Application Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Setup monitoring dashboard
pm2 link your-secret-key your-public-key
```

### Database Monitoring

```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;
SELECT pg_reload_conf();

-- Monitor slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

### Health Checks

```bash
# Setup health check endpoint monitoring
# Use services like UptimeRobot, Pingdom, or StatusCake
# Monitor: http://your-domain.com/health/services
```

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U your_user find_my_stuff > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
rm backup_$DATE.sql

# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

### Application Backups

```bash
# Backup uploaded files
tar -czf uploads_backup.tar.gz /path/to/uploads
aws s3 cp uploads_backup.tar.gz s3://your-backup-bucket/
```

## Rollback Plan

```bash
# Keep previous version
pm2 save --force

# If deployment fails
git checkout previous-tag
npm install
pm2 restart all

# Database rollback
psql -U your_user find_my_stuff < backup_previous.sql
```

## Performance Optimization

1. **Enable Gzip compression**
2. **Use CDN for static assets**
3. **Implement caching (Redis)**
4. **Database query optimization**
5. **Load balancing for services**
6. **Connection pooling**
7. **Image optimization**

## Post-Deployment Checklist

- [ ] All services running
- [ ] Database migrations applied
- [ ] SSL certificate installed
- [ ] Monitoring active
- [ ] Backups configured
- [ ] Health checks passing
- [ ] Performance acceptable
- [ ] Security scan completed
- [ ] Documentation updated
- [ ] Team notified

## Troubleshooting Production Issues

### Service Not Starting
```bash
pm2 logs
pm2 describe find-my-stuff
```

### Database Connection Issues
```bash
psql -U your_user -h your_host -d find_my_stuff
# Check firewall rules
# Verify credentials
```

### High Memory Usage
```bash
pm2 monit
# Restart services
pm2 restart all
```

## Support

For deployment issues:
1. Check logs: `pm2 logs`
2. Review error messages
3. Verify environment variables
4. Check service health endpoints
5. Review database connections

---

**Remember:** Always test deployments in a staging environment first!

