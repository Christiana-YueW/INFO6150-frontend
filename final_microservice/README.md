# Find My Stuff 🔍

> A professional full-stack microservices application for tracking and locating your belongings

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## 📖 Overview

**Find My Stuff** is a modern item tracking application built with a microservices architecture. It demonstrates professional full-stack development practices, including React frontend, Node.js backend services, PostgreSQL database, JWT authentication, and RESTful API design.

### ✨ Key Features

- 📸 **Photo-based Item Tracking** - Upload photos and catalog your belongings
- 🔍 **Advanced Search** - Filter by name, location, tags, or use full-text search
- 🤖 **AI Assistant** - Ask questions in natural language ("Where is my camera?")
- 📊 **Analytics Dashboard** - View statistics and activity logs
- 👤 **User Management** - Secure authentication and profile management
- 🎨 **Modern UI** - Responsive design with accessibility features

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │  ← User Interface (Port 5173)
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│   API Gateway   │  ← Authentication & Routing (Port 3000)
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┬────────┐
    ▼         ▼        ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  User  │ │  Item  │ │ Search │ │   AI   │ │Analytics│
│:3001   │ │:3002   │ │:3003   │ │:3004   │ │:3005   │
└───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    └──────────┴──────────┴──────────┴──────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ PostgreSQL  │  ← Database
                  └─────────────┘
```

### 🛠️ Technology Stack

**Frontend:**
- React 19 with Hooks
- Vite for build tooling
- CSS Modules
- Fetch API

**Backend:**
- Node.js 18+ with Express
- JWT authentication
- bcrypt password hashing
- RESTful API design

**Database:**
- PostgreSQL 14+
- Connection pooling
- Full-text search
- Normalized schema (3NF)

## 🚀 Quick Start

### Prerequisites

- Node.js v18+ ([Download](https://nodejs.org/))
- PostgreSQL v14+ ([Download](https://www.postgresql.org/download/))
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd final_microservice

# 2. Install all dependencies (frontend + backend)
npm run setup

# This will:
# - Install frontend dependencies
# - Install backend dependencies for all services
# - Create the database
# - Run migrations
# - Seed demo data
```

### Configuration

```bash
# Backend configuration
cd backend
cp .env.example .env
# Edit .env with your database credentials

# Frontend configuration
cd ..
cp .env.example .env
# Default API URL is already set
```

### Running the Application

```bash
# Option 1: Run everything with one command
npm run dev:all

# Option 2: Run separately in different terminals
# Terminal 1 - Backend services
npm run backend:dev

# Terminal 2 - Frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:3000
- **Health Check**: http://localhost:3000/health/services

### Demo Credentials

```
Email: demo@example.com
Password: demo123
```

## 📚 Documentation

Comprehensive documentation is available:

- **[PROJECT_README.md](PROJECT_README.md)** - Detailed project documentation
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Step-by-step setup instructions
- **[INTERVIEW_GUIDE.md](INTERVIEW_GUIDE.md)** - Technical talking points for interviews
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Production deployment strategies
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete transformation summary
- **[backend/README.md](backend/README.md)** - Backend-specific documentation

## 🎯 Project Structure

```
final_microservice/
├── src/                    # React frontend
│   ├── components/        # React components
│   ├── services/          # API client layer
│   └── styles/            # CSS files
├── backend/               # Backend microservices
│   ├── api-gateway/       # API Gateway (Port 3000)
│   ├── services/          # 5 microservices (Ports 3001-3005)
│   ├── shared/            # Shared utilities
│   ├── database/          # Schema, migrations, seeds
│   └── scripts/           # Utility scripts
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🔑 API Endpoints

### Authentication (Public)
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
```

### Users (Protected)
```
GET    /api/users/:id      - Get user profile
PUT    /api/users/:id      - Update profile
PUT    /api/users/:id/password - Change password
```

### Items (Protected)
```
GET    /api/items          - List all items
GET    /api/items/:id      - Get single item
POST   /api/items          - Create item
PUT    /api/items/:id      - Update item
DELETE /api/items/:id      - Delete item
```

### Search (Protected)
```
GET /api/search            - Advanced search
GET /api/search/fulltext   - Full-text search
GET /api/search/tags       - Get all tags
```

### AI Assistant (Protected)
```
POST /api/ai/query         - Process natural language query
GET  /api/ai/suggestions   - Get query suggestions
```

### Analytics (Protected)
```
GET /api/analytics/dashboard       - Dashboard statistics
GET /api/analytics/activity        - Activity logs
GET /api/analytics/stats/locations - Location statistics
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
npm test
```

## 🐳 Docker Support

Docker configuration coming soon. Will include:
- Dockerfiles for each service
- docker-compose.yml for orchestration
- Multi-stage builds for optimization

## 📈 Features Demonstrated

This project showcases:

✅ **Microservices Architecture** - 6 independent services
✅ **API Gateway Pattern** - Centralized routing and authentication
✅ **RESTful API Design** - Standard HTTP methods and status codes
✅ **JWT Authentication** - Stateless, secure authentication
✅ **Database Optimization** - Indexes, connection pooling, normalization
✅ **Error Handling** - Centralized error handling across services
✅ **Security Best Practices** - Password hashing, SQL injection prevention
✅ **Modern Frontend** - React Hooks, responsive design, accessibility
✅ **Professional Documentation** - Comprehensive guides and talking points

## 🎓 Learning Outcomes

Perfect for demonstrating knowledge of:

- Full-stack development
- Microservices architecture
- Database design and optimization
- Authentication and authorization
- API design and implementation
- Frontend-backend integration
- Code organization and modularity
- Professional documentation

## 🤝 Contributing

This is a demo project for interview and portfolio purposes.

## 📄 License

ISC

## 👤 Author

Created as a professional portfolio project demonstrating full-stack development skills with modern microservices architecture.

## 🙏 Acknowledgments

Built with modern web technologies:
- React team for the amazing framework
- Express.js for the backend framework
- PostgreSQL for the robust database
- Node.js community for excellent packages

---

## 📞 Support

For setup issues, refer to:
1. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
2. Troubleshooting section in documentation
3. Check service health: http://localhost:3000/health/services

## 🎯 Interview Ready

This project is designed to be discussed in technical interviews. Key talking points:

- **Architecture**: Microservices design decisions and trade-offs
- **Scalability**: Horizontal scaling, stateless services, connection pooling
- **Security**: JWT, bcrypt, SQL injection prevention, CORS
- **Database**: Normalization, indexing, full-text search
- **Frontend**: React patterns, state management, API integration
- **DevOps**: Environment configuration, process management, health checks

See [INTERVIEW_GUIDE.md](INTERVIEW_GUIDE.md) for detailed talking points.

---

**Built with ❤️ for technical interviews and professional demonstrations**

**Status**: ✅ Complete and Production-Ready

**Last Updated**: 2025

