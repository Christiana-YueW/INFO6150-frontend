# Find My Stuff - Professional Microservices Demo

> A full-stack application demonstrating modern microservices architecture, built for interview discussions and technical demonstrations.

## 🎯 Project Overview

**Find My Stuff** is an item tracking application that helps users catalog and locate their belongings. This project showcases a professional microservices architecture with a React frontend, Node.js backend services, and PostgreSQL database.

### Key Features

- 📸 **Photo-based Item Tracking** - Upload photos and tag items with locations
- 🔍 **Advanced Search** - Filter and search items by name, location, or tags
- 🤖 **AI Assistant** - Natural language queries ("Where is my camera?")
- 📊 **Analytics Dashboard** - Statistics and activity tracking
- 👤 **User Management** - Authentication, profiles, and settings
- 🎨 **Modern UI** - Responsive React application with accessibility features

## 🏗️ Architecture

### System Design

```
┌─────────────────┐
│  React Frontend │  (Port 5173)
│   (Vite + React)│
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│   API Gateway   │  (Port 3000)
│  Authentication │
│     Routing     │
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┬────────┐
    ▼         ▼        ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  User  │ │  Item  │ │ Search │ │   AI   │ │Analytics│
│Service │ │Service │ │Service │ │Assistant│ │Service │
│ :3001  │ │ :3002  │ │ :3003  │ │ :3004  │ │ :3005  │
└───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    │          │          │          │          │
    └──────────┴──────────┴──────────┴──────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ PostgreSQL  │
                  │  Database   │
                  └─────────────┘
```

### Technology Stack

**Frontend:**
- React 19 with Hooks
- Vite for build tooling
- CSS Modules for styling
- Fetch API for HTTP requests

**Backend:**
- Node.js with Express
- JWT authentication
- RESTful API design
- Microservices architecture

**Database:**
- PostgreSQL 14+
- Connection pooling
- Normalized schema (3NF)
- Full-text search indexes

**DevOps:**
- Environment-based configuration
- Concurrent service management
- Health check endpoints
- Structured logging

## 📋 Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** v14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd final_microservice

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
npm run install:all
```

### 2. Database Setup

```bash
# Start PostgreSQL (if not running)
# macOS: brew services start postgresql@14
# Linux: sudo systemctl start postgresql

# Configure database
cd backend
cp .env.example .env
# Edit .env with your database credentials

# Create database and run migrations
npm run db:setup

# Seed with demo data
npm run db:seed
```

**Demo Credentials:**
- Email: `demo@example.com`
- Password: `demo123`

### 3. Start Services

```bash
# Terminal 1: Start backend services
cd backend
npm run dev

# Terminal 2: Start frontend
cd ..
npm run dev
```

### 4. Access Application

- **Frontend:** http://localhost:5173
- **API Gateway:** http://localhost:3000
- **Health Check:** http://localhost:3000/health/services

## 📁 Project Structure

```
final_microservice/
├── src/                          # React frontend
│   ├── components/              # React components
│   ├── services/                # API client layer
│   └── styles/                  # CSS files
├── backend/                      # Backend microservices
│   ├── api-gateway/             # API Gateway (Port 3000)
│   ├── services/                # Microservices
│   │   ├── user-service/        # User auth & profiles (Port 3001)
│   │   ├── item-service/        # Item CRUD (Port 3002)
│   │   ├── search-service/      # Search & filter (Port 3003)
│   │   ├── ai-assistant-service/# NLP queries (Port 3004)
│   │   └── analytics-service/   # Statistics (Port 3005)
│   ├── shared/                  # Shared utilities
│   │   ├── config/              # Configuration
│   │   ├── middleware/          # Middleware
│   │   └── utils/               # Utilities
│   ├── database/                # Database files
│   │   ├── migrations/          # Migration scripts
│   │   ├── seeds/              # Seed data
│   │   └── schema.sql          # Database schema
│   └── scripts/                # Utility scripts
└── public/                      # Static assets
```

## 🔑 Key Features Explained

### 1. Microservices Architecture

Each service is independently deployable and scalable:

- **User Service**: Handles authentication, registration, and profile management
- **Item Service**: CRUD operations for items with photo storage
- **Search Service**: Advanced filtering, full-text search, and tag management
- **AI Assistant**: Natural language processing for conversational queries
- **Analytics Service**: Dashboard statistics and activity logging

### 2. API Gateway Pattern

- Single entry point for all client requests
- JWT-based authentication
- Request routing to appropriate services
- Centralized error handling and logging
- CORS configuration

### 3. Database Design

**Tables:**
- `users` - User accounts with bcrypt password hashing
- `items` - Item catalog with photos and locations
- `locations` - Predefined and custom locations
- `activity_logs` - User activity tracking for analytics

**Features:**
- Foreign key constraints for data integrity
- Indexes for query optimization
- Full-text search capabilities
- Automatic timestamp updates

### 4. Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- SQL injection prevention (parameterized queries)
- CORS configuration
- Input validation
- Secure error messages (no sensitive data exposure)

## 📊 API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
```

### User Endpoints (Protected)

```
GET    /api/users/:userId
PUT    /api/users/:userId
PUT    /api/users/:userId/password
```

### Item Endpoints (Protected)

```
GET    /api/items
GET    /api/items/:itemId
POST   /api/items
PUT    /api/items/:itemId
DELETE /api/items/:itemId
GET    /api/locations
```

### Search Endpoints (Protected)

```
GET /api/search?query=...&location=...
GET /api/search/fulltext?query=...
GET /api/search/tags
```

### AI Assistant Endpoints (Protected)

```
POST /api/ai/query
GET  /api/ai/suggestions
```

### Analytics Endpoints (Protected)

```
GET /api/analytics/dashboard
GET /api/analytics/activity
GET /api/analytics/stats/locations
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd ..
npm test
```

## 🐳 Docker Support (Coming Soon)

Docker configuration for containerized deployment will be added.

## 📈 Scalability Considerations

1. **Horizontal Scaling**: Each service can scale independently
2. **Database Connection Pooling**: Efficient resource management
3. **Stateless Services**: No session state in services (JWT tokens)
4. **Service Isolation**: Failures don't cascade
5. **Load Balancing Ready**: Services can run multiple instances

## 🎓 Learning Outcomes

This project demonstrates:

- ✅ Microservices architecture patterns
- ✅ RESTful API design
- ✅ Database normalization and optimization
- ✅ Authentication and authorization
- ✅ Frontend-backend integration
- ✅ Error handling and logging
- ✅ Code organization and modularity
- ✅ Environment-based configuration

## 📝 Interview Talking Points

See `INTERVIEW_GUIDE.md` for detailed talking points on:
- Frontend architecture and React patterns
- Backend microservices design decisions
- Database schema and optimization
- Security implementations
- Scalability strategies

## 🤝 Contributing

This is a demo project for interview purposes.

## 📄 License

ISC

## 👤 Author

Created as a professional portfolio project demonstrating full-stack development skills with modern microservices architecture.

---

**Built with ❤️ for technical interviews and demonstrations**

