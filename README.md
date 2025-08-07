# Pokemon Application - Full Stack Project

A comprehensive Pokemon application built with Angular frontend and NestJS backend, featuring advanced filtering, favorites system, CSV import, and user authentication.

## 🏗️ Project Overview

This is a full-stack application consisting of:
- **Frontend**: Angular 18 application with SSR, NgRx state management, and Tailwind CSS
- **Backend**: NestJS API with PostgreSQL database, JWT authentication, and Swagger documentation

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- pnpm package manager

### 1. Backend Setup
```fish
cd backend

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Database setup
pnpm prisma generate
pnpm prisma migrate dev

# Start backend
pnpm start:dev
```

### 2. Frontend Setup
```fish
cd frontend

# Install dependencies
pnpm install

# Start frontend
pnpm start
```

### 3. Access the Application
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## 📁 Project Structure

```
IniPod/
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── authentication/     # JWT authentication module
│   │   ├── pokemon/           # Pokemon CRUD & filtering
│   │   ├── database/          # Prisma configuration
│   │   └── common/            # Shared utilities
│   ├── prisma/                # Database schema & migrations
│   └── README.md             # Backend documentation
├── frontend/                  # Angular Frontend
│   ├── src/app/
│   │   ├── pages/            # Feature pages
│   │   ├── services/         # API services
│   │   ├── shared/           # Shared components
│   │   └── cores/            # Core services & guards
│   └── README.md            # Frontend documentation
└── README.md               # This file
```

## ✨ Features

### Core Features
- **Pokemon Management**: Complete CRUD operations with advanced filtering
- **User Authentication**: Secure JWT-based login/register system
- **Favorites System**: Users can mark/unmark Pokemon as favorites
- **CSV Import**: Bulk import Pokemon data from CSV files
- **Advanced Search**: Filter by types, generation, legendary status, speed ranges
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Technical Highlights
- **Full-Stack TypeScript**: End-to-end type safety
- **Modern Architecture**: Angular 18 + NestJS with best practices
- **State Management**: NgRx for predictable state updates
- **Database**: PostgreSQL with Prisma ORM
- **API Documentation**: Comprehensive Swagger documentation
- **SSR Support**: Angular Universal for better SEO and performance

## 🔧 Technology Stack

### Frontend
- **Framework**: Angular 18 with Standalone Components
- **State Management**: NgRx (Store, Effects, Selectors)
- **Styling**: Tailwind CSS with responsive design
- **HTTP Client**: Angular HttpClient with interceptors
- **Authentication**: JWT tokens with route guards
- **Build Tool**: Angular CLI with Webpack
- **SSR**: Angular Universal

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer for CSV processing
- **Testing**: Jest for unit and e2e tests

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Request validation with DTOs
- CORS configuration
- SQL injection prevention with Prisma
- XSS protection with sanitization
- Rate limiting (future enhancement)

## 📊 Database Schema

### Core Tables
- **Users**: User accounts with authentication
- **Pokemon**: Complete Pokemon data with stats
- **UserFavoritePokemon**: Many-to-many relationship for favorites

### Key Relationships
- Users can have multiple favorite Pokemon
- Pokemon can be favorited by multiple users
- Proper indexes for efficient filtering and searching

## 🚀 Deployment

### Development
```fish
# Backend (Terminal 1)
cd backend && pnpm start:dev

# Frontend (Terminal 2)
cd frontend && pnpm start
```

### Docker (Future)
- Multi-stage builds for optimized containers
- Docker Compose for easy orchestration
- Environment-specific configurations

## 🧪 Testing

### Backend Testing
```fish
cd backend
pnpm test           # Unit tests
pnpm test:e2e       # End-to-end tests
pnpm test:cov       # Coverage report
```

### Frontend Testing
```fish
cd frontend
pnpm test           # Unit tests
pnpm e2e            # End-to-end tests
```

## 📈 Performance Optimizations

### Frontend
- Lazy loading for routes
- OnPush change detection
- Bundle optimization
- Image lazy loading
- Service workers (future)

### Backend
- Database query optimization
- Proper indexing
- Response caching headers
- Pagination for large datasets
- Connection pooling

## 🔄 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement backend API endpoints
   - Add frontend components and services
   - Write tests for new features

2. **Code Quality**
   - TypeScript strict mode
   - ESLint and Prettier configuration
   - Pre-commit hooks (future)
   - Code review process

3. **Testing Strategy**
   - Unit tests for services and components
   - Integration tests for API endpoints
   - E2E tests for critical user flows


## 🐛 Known Issues & Roadmap

### Current Issues
- File upload size limits need configuration
- Error handling could be more granular
- Loading states need improvement

