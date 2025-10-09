# Find My Stuff - Backend Microservices

A professional microservices architecture for the Find My Stuff application, demonstrating modern backend development practices.

## 🏗️ Architecture Overview

This backend consists of 6 microservices:

1. **API Gateway** (Port 3000) - Central entry point, authentication, routing
2. **User Service** (Port 3001) - User authentication and profile management
3. **Item Service** (Port 3002) - CRUD operations for items
4. **Search Service** (Port 3003) - Advanced search and filtering
5. **AI Assistant Service** (Port 3004) - Natural language query processing
6. **Analytics Service** (Port 3005) - Dashboard statistics and activity tracking

## 📋 Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database credentials
# At minimum, update DB_PASSWORD
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all service dependencies
npm run install:all
```

### 4. Setup Database

```bash
# Create database and run migrations
npm run db:setup

# Seed with demo data (optional but recommended)
npm run db:seed
```

This will create a demo user:
- **Email:** demo@example.com
- **Password:** demo123

### 5. Start All Services

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

All services will start on their respective ports. The API Gateway will be available at `http://localhost:3000`.

## 📡 API Endpoints

### Authentication (Public)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users (Protected)

- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `PUT /api/users/:userId/password` - Change password

### Items (Protected)

- `GET /api/items` - Get all items
- `GET /api/items/:itemId` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:itemId` - Update item
- `DELETE /api/items/:itemId` - Delete item
- `GET /api/locations` - Get available locations

### Search (Protected)

- `GET /api/search` - Advanced search with filters
- `GET /api/search/fulltext` - Full-text search
- `GET /api/search/tags` - Get all tags

### AI Assistant (Protected)

- `POST /api/ai/query` - Process natural language query
- `GET /api/ai/suggestions` - Get query suggestions

### Analytics (Protected)

- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/activity` - Get activity logs
- `GET /api/analytics/stats/locations` - Get location statistics

## 🔧 Individual Service Management

Start services individually:

```bash
npm run start:gateway    # API Gateway
npm run start:user       # User Service
npm run start:item       # Item Service
npm run start:search     # Search Service
npm run start:ai         # AI Assistant Service
npm run start:analytics  # Analytics Service
```

## 🗄️ Database Schema

### Tables

- **users** - User accounts and profiles
- **items** - User items with photos and locations
- **locations** - Predefined and custom locations
- **activity_logs** - User activity tracking

See `database/schema.sql` for complete schema definition.

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test
```

## 📊 Health Checks

Check service health:

```bash
# API Gateway health
curl http://localhost:3000/health

# All services health
curl http://localhost:3000/health/services
```

## 🐳 Docker Support (Coming Soon)

Docker configuration will be added for easy deployment.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention with parameterized queries
- CORS configuration
- Request validation
- Error handling without sensitive data exposure

## 📈 Scalability Features

- Connection pooling for database
- Stateless services for horizontal scaling
- Service isolation for independent deployment
- Microservices architecture for technology flexibility

## 🛠️ Development

### Project Structure

```
backend/
├── api-gateway/          # API Gateway service
├── services/             # Microservices
│   ├── user-service/
│   ├── item-service/
│   ├── search-service/
│   ├── ai-assistant-service/
│   └── analytics-service/
├── shared/               # Shared utilities
│   ├── config/          # Configuration
│   ├── middleware/      # Middleware
│   └── utils/           # Utilities
├── database/            # Database files
│   ├── migrations/      # Migration scripts
│   ├── seeds/          # Seed data
│   └── schema.sql      # Database schema
└── scripts/            # Utility scripts
```

### Adding a New Service

1. Create service directory in `services/`
2. Add `package.json` with dependencies
3. Create `server.js` with Express app
4. Add routes to API Gateway
5. Update startup scripts

## 📝 Environment Variables

See `.env.example` for all available configuration options.

## 🤝 Contributing

This is a demo project for interview purposes.

## 📄 License

ISC

