# 🚗 Easy Rent - Vehicle Rental System

A modern backend API for a vehicle rental management system built with Node.js, TypeScript, and Express.js.

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Server](#-running-the-server)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [API Endpoints](#-api-endpoints)
- [Development](#-development)

---

## 🎯 Project Overview

Easy Rent is a comprehensive vehicle rental management system that provides:
- **Vehicle Management** - Add, update, and manage vehicle inventory with real-time availability tracking
- **User Management** - Secure user registration and profile management
- **Booking System** - Complete rental booking workflow with pricing calculation
- **Authentication & Authorization** - Role-based access control (Admin and Customer)
- **Security** - Password hashing with bcrypt and JWT token-based authentication

---

## ✨ Features

- **User Authentication**
  - Secure user registration and login
  - JWT-based token authentication
  - Role-based access control (Admin/Customer)
  - Password hashing with bcrypt

- **Vehicle Management**
  - Add and manage vehicles with availability tracking
  - Support for multiple vehicle types (car, bike, van, SUV)
  - Daily rental pricing configuration
  - Real-time availability status updates

- **Booking System**
  - Create and manage vehicle bookings
  - Automatic price calculation based on rental duration
  - Booking status tracking (active, cancelled, returned)
  - Return vehicle functionality

- **Admin Features**
  - Full system access
  - Manage all vehicles and bookings
  - User management capabilities
  - System-wide reports and analytics

- **Customer Features**
  - Browse available vehicles
  - Create and manage personal bookings
  - View rental history

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **TypeScript** | Type-safe JavaScript |
| **Express.js** | Web framework |
| **PostgreSQL** | Relational database |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT authentication |
| **node-cron** | Scheduled tasks |
| **pg** | PostgreSQL client |

---

## 📁 Project Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts              # Server entry point
├── config/                # Configuration files
│   ├── db.ts             # Database connection setup
│   └── index.ts          # Config exports
├── middlewares/           # Express middlewares
│   ├── logger.ts         # Request logging
│   └── verifyToken.ts    # JWT verification
├── modules/               # Feature modules (modular architecture)
│   ├── auth/             # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.route.ts
│   │   └── auth.service.ts
│   ├── users/            # User management module
│   │   ├── user.controller.ts
│   │   ├── user.route.ts
│   │   └── user.service.ts
│   ├── vehicles/         # Vehicle management module
│   │   ├── vehicle.controller.ts
│   │   ├── vehicle.route.ts
│   │   └── vehicle.service.ts
│   └── bookings/         # Booking management module
│       ├── booking.controller.ts
│       ├── booking.route.ts
│       └── booking.service.ts
└── types/                 # TypeScript type definitions
    └── express.d.ts      # Extended Express types
```

### Architecture Pattern

The project follows a **modular layered architecture**:
- **Routes** - Define API endpoints and HTTP methods
- **Controllers** - Handle requests and responses
- **Services** - Contain business logic
- **Database** - Data persistence layer

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/kaziMuntasirRahman/easy_rent_server.git
cd easy_rent
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/easy_rent
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

4. **Setup PostgreSQL database**
```bash
# Create database
createdb easy_rent

# Run migrations/setup scripts
# (Create tables using SQL scripts provided)
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` / `production` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/easy_rent` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |

### Database Configuration

The database connection is configured in `src/config/db.ts`. Update the connection parameters in your `.env` file to match your PostgreSQL setup.

---

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```
Runs the server with hot-reload using `tsx watch`

### Build for Production
```bash
npm run build
```
Compiles TypeScript to JavaScript

### Production Mode
```bash
npm run build
node dist/server.js
```

The server will start on the configured PORT (default: 5000)

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  registration_number VARCHAR(255) NOT NULL UNIQUE,
  daily_rent_price DECIMAL(10, 2) NOT NULL,
  availability_status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id),
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Field Specifications

#### Users
| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | Primary Key, Auto-increment |
| name | VARCHAR(255) | Required |
| email | VARCHAR(255) | Required, Unique |
| password | VARCHAR(255) | Required, hashed |
| phone | VARCHAR(20) | Required |
| role | VARCHAR(50) | 'admin' or 'customer' |

#### Vehicles
| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | Primary Key, Auto-increment |
| vehicle_name | VARCHAR(255) | Required |
| type | VARCHAR(50) | 'car', 'bike', 'van', 'SUV' |
| registration_number | VARCHAR(255) | Required, Unique |
| daily_rent_price | DECIMAL(10,2) | Required, positive |
| availability_status | VARCHAR(50) | 'available' or 'booked' |

#### Bookings
| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | Primary Key, Auto-increment |
| customer_id | INTEGER | Foreign Key (users.id) |
| vehicle_id | INTEGER | Foreign Key (vehicles.id) |
| rent_start_date | DATE | Required |
| rent_end_date | DATE | Required, > start_date |
| total_price | DECIMAL(10,2) | Required, positive |
| status | VARCHAR(50) | 'active', 'cancelled', 'returned' |

---

## 🔐 Authentication & Authorization

### User Roles

**Admin**
- Full system access
- Manage vehicles, users, and all bookings
- View system-wide reports

**Customer**
- Register and manage personal account
- View available vehicles
- Create and manage own bookings

### Authentication Flow

1. **Registration**
   - User submits credentials via `/api/v1/auth/signup`
   - Password is hashed using bcrypt
   - User record is created in database

2. **Login**
   - User submits email and password via `/api/v1/auth/signin`
   - Password verified against stored hash
   - JWT token generated and returned

3. **Protected Requests**
   - Include token in Authorization header: `Bearer <token>`
   - Middleware verifies token validity and expiration
   - User identity confirmed and permissions checked
   - Request processed or rejected (401/403)

### Token Structure
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🌐 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/signup` | Public | Register new user account |
| POST | `/api/v1/auth/signin` | Public | Login and receive JWT token |

### User Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users` | Admin | Get all users |
| GET | `/api/v1/users/:userId` | Admin/Self | Get user details |
| PUT | `/api/v1/users/:userId` | Admin/Self | Update user profile |
| DELETE | `/api/v1/users/:userId` | Admin | Delete user account |

### Vehicle Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/vehicles` | Admin | Create new vehicle |
| GET | `/api/v1/vehicles` | Public | Get all vehicles |
| GET | `/api/v1/vehicles/:vehicleId` | Public | Get vehicle details |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin | Update vehicle |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin | Delete vehicle |

### Booking Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/bookings` | Customer | Create new booking |
| GET | `/api/v1/bookings` | Admin | Get all bookings |
| GET | `/api/v1/bookings/:bookingId` | Auth | Get booking details |
| PUT | `/api/v1/bookings/:bookingId` | Customer/Admin | Update booking |
| DELETE | `/api/v1/bookings/:bookingId` | Customer/Admin | Cancel booking |
| PUT | `/api/v1/bookings/:bookingId/return` | Customer/Admin | Return vehicle |

**For detailed request/response specifications, see [API_REFERENCE.md](API_REFERENCE.md)**

---

## 🛣️ Development

### Code Style
- TypeScript for type safety
- Follow existing code patterns and conventions
- Use proper error handling
- Add meaningful comments for complex logic

### Common Development Tasks

**Add a new feature module:**
1. Create folder in `src/modules/[feature]/`
2. Create `[feature].controller.ts` - Request handling
3. Create `[feature].service.ts` - Business logic
4. Create `[feature].route.ts` - API routes
5. Register routes in `src/app.ts`

**Add a new API endpoint:**
1. Define route in module's `.route.ts`
2. Create controller method in `.controller.ts`
3. Implement service logic in `.service.ts`
4. Add validation and error handling
5. Test with Postman or similar tool

### Testing
```bash
npm test
```

### Building
```bash
npm run build
```
Creates `dist/` folder with compiled JavaScript

---

## 📝 Additional Resources

- [API Reference Documentation](API_REFERENCE.md) - Detailed API specifications
- [Submission Guide](SUBMISSION_GUIDE.md) - Deployment and submission instructions
- [GitHub Repository](https://github.com/kaziMuntasirRahman/easy_rent_server)

---

## 📄 License

ISC License - See package.json for details

---

## 👤 Author

**Kazi Muntasir Rahman**
- GitHub: [@kaziMuntasirRahman](https://github.com/kaziMuntasirRahman)

---

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure and patterns when adding new features.

---

**Last Updated:** December 2025
