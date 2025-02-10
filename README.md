# 🔗 Advanced URL Shortener

A professional URL shortening service built with Node.js, Express, MongoDB, Typescript, and Redis. This project features robust URL analytics, user authentication, and rate limiting to deliver a secure and scalable solution.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

**Live Demo**: [https://shortly-6g7j.onrender.com](https://shortly-6g7j.onrender.com)  
**API Documentation**: [Swagger Documentation](https://app.swaggerhub.com/apis/shortly/UrlShortner/1.0.0)

## 🗋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Challenges & Solutions](#challenges--solutions)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features
- **URL Shortening**
  - Custom alias support
  - Automatic short URL generation
  - URL validation
  - Topic-based organization

- **User Management**
  - Google OAuth integration
  - JWT authentication
  - Secure user sessions

- **Analytics**
  - Click tracking
  - Geographic location tracking
  - Device & browser analytics
  - Time-based statistics
  - Topic-wise analytics

- **Security**
  - Rate limiting
  - Redis-based caching
  - JWT authentication
  - Input validation

## 🔧 Tech Stack
- **Backend:** Node.js, Express.js, Typescript
- **Database:** MongoDB with Mongoose
- **Caching:** Redis
- **Authentication:** JWT, Google OAuth
- **Analytics:** Custom tracking system
- **DevOps:** Docker, Docker Compose

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- Redis
- Docker (optional)

### Environment Variables
Create a `.env` file:
```env
PORT=3000
MONGODB_URL=your_mongodb_uri
REDISPORT=redis://redis:6379
JWT_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:5000
BASE_URL=http://localhost:3000
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Irshadudheen/TinyURLX-shorting-Url-.git

```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
# Development
npm run dev

# Production
npm start
```

### Docker Setup
```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d
```

## 🗂 Project Structure
```plaintext
src/
|── errors/
|   |── Customerror.ts
|   └── Badrequesterror.ts 
├── config/
│   │   
│   └── redis.ts        # Redis configuration
├── middleware/
│   ├── auth.js
│   ├── rateLimiter.ts
│   └── analytics.ts
├── models/
│   ├── User.ts
│   ├── Url.ts
│   └── Analytics.ts
├── routes/
│   ├── urlRoute
│   ├── auth
│   └── analytics
│ 
├── service/
│    └── redisService.ts
|── app.ts
└── index.ts

```

## 🔗 API Documentation

The complete API documentation is available on SwaggerHub. The documentation includes detailed information about all endpoints, request/response formats, authentication requirements, and example usage.

**View API Documentation**: [https://app.swaggerhub.com/apis/shortly/UrlShortner/1.0.0](https://app.swaggerhub.com/apis/shortly/UrlShortner/1.0.0)

**Base URL**: `https://shortly-6g7j.onrender.com/api`

## 🌐 Deployment
This project is deployed on Render.com. [Live Demo](https://shortly-6g7j.onrender.com)

### Deployment Steps:
1. Fork this repository
2. Sign up on Render.com
3. Connect your GitHub repository
4. Configure environment variables
5. Deploy!

## 💡 Challenges & Solutions

### 1. High Concurrency URL Generation
**Challenge:**
Handling a large number of simultaneous requests for URL shortening can lead to race conditions or database conflicts.

**Solution:**
Implemented a Redis-based locking mechanism to ensure that no two processes generate the same short URL simultaneously. Redis's high performance and atomic operations make it ideal for managing distributed locks.

### 2. Analytics Performance
**Challenge:**
Collecting and analyzing click data for each URL in real-time without degrading the application's performance.

**Solution:**
Used MongoDB aggregation pipelines with time-based bucketing to efficiently group and analyze data. Redis caching further enhanced performance by reducing the frequency of database queries for frequently accessed analytics.

### 3. Rate Limiting
**Challenge:**
Preventing abuse from excessive API requests while ensuring legitimate users aren't affected.

**Solution:**
Implemented rate limiting using Redis to track API usage for each user or IP address. By setting limits on the number of requests per minute, the system can throttle excessive usage while maintaining seamless access for regular users. Responses include clear headers to inform users about their current usage and limits.

### 4. Security
**Challenge:**
Ensuring that the application is secure against common vulnerabilities such as SQL injection, XSS, and CSRF attacks.

**Solution:**
- **Input Validation:** All user inputs are validated using libraries like `express-validator` to prevent malicious data from being processed.
- **JWT Authentication:** Secure token-based authentication ensures that only authorized users can access protected resources.
- **Rate Limiting:** Protects against brute-force attacks by limiting repeated requests.
- **Environment Isolation:** Secrets and keys are stored securely using `.env` files and aren't exposed in the codebase.

## 🚀 Future Enhancements
1. QR Code generation for short URLs
2. Frontend UI using React.js
3. Advanced analytics dashboard








