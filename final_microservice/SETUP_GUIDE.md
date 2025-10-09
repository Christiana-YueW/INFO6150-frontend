# Setup Guide - Find My Stuff

> Step-by-step instructions to get the project running locally

## Prerequisites Check

Before starting, ensure you have:

- [ ] Node.js v18 or higher (`node --version`)
- [ ] PostgreSQL v14 or higher (`psql --version`)
- [ ] npm or yarn (`npm --version`)
- [ ] Git (`git --version`)

## Installation Steps

### Step 1: Install PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### Step 2: Configure PostgreSQL

```bash
# Access PostgreSQL
psql postgres

# Create a user (if needed)
CREATE USER your_username WITH PASSWORD 'your_password';
ALTER USER your_username WITH SUPERUSER;

# Exit
\q
```

### Step 3: Clone and Install Dependencies

```bash
# Navigate to the project
cd final_microservice

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install all service dependencies
npm run install:all
```

### Step 4: Configure Environment

```bash
# In the backend directory
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use your preferred editor
```

**Required .env variables:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=find_my_stuff
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### Step 5: Setup Database

```bash
# Still in backend directory
npm run db:setup

# You should see:
# ✅ Connected to PostgreSQL server
# ✅ Database created successfully
# ✅ Database schema created successfully
```

### Step 6: Seed Demo Data (Optional but Recommended)

```bash
npm run db:seed

# You should see:
# ✅ Created demo user (email: demo@example.com, password: demo123)
# ✅ Created 8 sample items
# ✅ Created sample activity logs
```

### Step 7: Start Backend Services

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start

# You should see all services starting:
# 🚀 API Gateway running on port 3000
# 🚀 User Service running on port 3001
# 🚀 Item Service running on port 3002
# 🚀 Search Service running on port 3003
# 🚀 AI Assistant Service running on port 3004
# 🚀 Analytics Service running on port 3005
```

### Step 8: Start Frontend (New Terminal)

```bash
# Navigate back to project root
cd ..

# Copy frontend environment file
cp .env.example .env

# Start frontend
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
```

### Step 9: Verify Installation

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **API Health:** http://localhost:3000/health/services

You should see the login page. Use demo credentials:
- **Email:** demo@example.com
- **Password:** demo123

## Troubleshooting

### Issue: "Database connection failed"

**Solution:**
1. Check PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
2. Verify credentials in `.env` file
3. Test connection: `psql -U your_username -d find_my_stuff`

### Issue: "Port already in use"

**Solution:**
1. Check what's using the port: `lsof -i :3000` (replace 3000 with the port number)
2. Kill the process: `kill -9 <PID>`
3. Or change the port in `.env` file

### Issue: "Module not found"

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run install:all
```

### Issue: "JWT token invalid"

**Solution:**
1. Clear browser localStorage
2. Restart backend services
3. Login again

### Issue: "Cannot find module 'pg'"

**Solution:**
```bash
cd backend
npm install pg
cd services/user-service && npm install
cd ../item-service && npm install
cd ../search-service && npm install
cd ../ai-assistant-service && npm install
cd ../analytics-service && npm install
```

## Verification Checklist

After setup, verify:

- [ ] All 6 backend services are running
- [ ] Frontend is accessible at http://localhost:5173
- [ ] Can login with demo credentials
- [ ] Can see demo items on Browse page
- [ ] Can add a new item
- [ ] Can search for items
- [ ] Can ask AI assistant questions
- [ ] Can view dashboard statistics

## Next Steps

1. **Explore the Application**
   - Try adding items with photos
   - Use the search functionality
   - Ask the AI assistant questions
   - Check the analytics dashboard

2. **Review the Code**
   - Frontend: `src/components/`
   - Backend: `backend/services/`
   - Database: `backend/database/schema.sql`

3. **Read Documentation**
   - `PROJECT_README.md` - Project overview
   - `INTERVIEW_GUIDE.md` - Talking points
   - `backend/README.md` - Backend details

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Vite automatically reloads on file changes
- Backend: Use `npm run dev` for auto-reload with `--watch` flag

### Database Management

```bash
# Reset database
cd backend
npm run db:setup

# Re-seed data
npm run db:seed

# Access database directly
psql -U your_username -d find_my_stuff
```

### Viewing Logs

All services log to console. To see specific service logs:
```bash
# In separate terminals
cd backend/api-gateway && npm start
cd backend/services/user-service && npm start
# etc.
```

### Testing API Endpoints

Use curl or Postman:
```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'
```

## Stopping Services

```bash
# Press Ctrl+C in each terminal running services

# Or kill all node processes (use with caution)
killall node
```

## Clean Uninstall

```bash
# Remove node modules
rm -rf node_modules
rm -rf backend/node_modules
rm -rf backend/api-gateway/node_modules
rm -rf backend/services/*/node_modules

# Remove database
psql postgres -c "DROP DATABASE IF EXISTS find_my_stuff;"

# Remove environment files
rm .env
rm backend/.env
```

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages carefully
3. Check that all prerequisites are installed
4. Verify environment variables are set correctly
5. Try a clean reinstall

## Success!

If everything is working, you should be able to:
- ✅ Login to the application
- ✅ View and manage items
- ✅ Search and filter
- ✅ Use the AI assistant
- ✅ View analytics

**You're ready to demo the project!** 🎉

