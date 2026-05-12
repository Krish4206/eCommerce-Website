# MERN eCommerce Backend

A production-level scalable MERN eCommerce backend with complete authentication, product management, cart system, and order processing.

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   └── database.js      # MongoDB connection
├── middleware/          # Express middleware
│   ├── authMiddleware.js      # JWT verification & authorization
│   ├── errorHandler.js        # Global error handler
│   └── rateLimiter.js         # Rate limiting
├── models/              # Mongoose schemas
│   ├── User.js          # User schema
│   ├── Product.js       # Product schema
│   ├── Cart.js          # Cart schema
│   └── Order.js         # Order schema
├── routes/              # API routes
│   └── v1/
│       ├── authRoutes.js      # Auth endpoints
│       ├── productRoutes.js   # Product endpoints
│       ├── cartRoutes.js      # Cart endpoints
│       └── orderRoutes.js     # Order endpoints
├── services/            # Business logic (to be implemented)
├── controllers/         # Route controllers (to be implemented)
├── utils/               # Utility functions
│   ├── logger.js        # Logging system
│   ├── jwt.js           # JWT utilities
│   ├── password.js      # Password hashing
│   └── validation.js    # Input validation
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies
└── server.js            # Main server file
```

## 🚀 Features Implemented

### Phase 1: Backend Setup (COMPLETED ✅)
- ✅ MVC Architecture
- ✅ MongoDB connection with Mongoose
- ✅ Global error handler
- ✅ API versioning (/api/v1)
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ Logging system
- ✅ JWT utilities
- ✅ Password hashing (bcryptjs)
- ✅ Input validation framework
- ✅ CORS configuration
- ✅ Environment configuration

### Phase 2: Authentication (PENDING - MASTER PROMPT 2)
- Register API
- Login API  
- JWT access + refresh tokens
- Role-based authorization

### Phase 3: Product Module (PENDING - MASTER PROMPT 3)
- Product CRUD operations
- Filtering & search
- Pagination

### Phase 4: Cart System (PENDING - MASTER PROMPT 4)
- Add/remove items
- Update quantities

### Phase 5: Orders & Payment (PENDING - MASTER PROMPT 5)
- Order management
- Payment integration

## 📦 Installation

1. Clone the repository
```bash
cd backend
npm install
```

2. Create `.env` file from `.env.example`
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
```

## 🏃 Running the Server

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Auth Routes (To be implemented)
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
```

### Product Routes (To be implemented)
```
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products (admin)
PUT    /api/v1/products/:id (admin)
DELETE /api/v1/products/:id (admin)
```

### Cart Routes (To be implemented)
```
GET    /api/v1/cart
POST   /api/v1/cart/add
DELETE /api/v1/cart/:itemId
PUT    /api/v1/cart/:itemId
```

### Order Routes (To be implemented)
```
GET    /api/v1/orders
GET    /api/v1/orders/:id
POST   /api/v1/orders
GET    /api/v1/orders/admin/all (admin)
PUT    /api/v1/orders/admin/:id/status (admin)
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcryptjs
- Rate limiting to prevent abuse
- Security headers with Helmet
- CORS configuration
- Input validation
- Role-based authorization

## 📝 Environment Variables

See `.env.example` for all required variables.

## 📚 Next Steps

Follow the MASTER PROMPTS in order:
1. ✅ MASTER PROMPT 1: Full Project Setup (COMPLETED)
2. → MASTER PROMPT 2: Auth System
3. → MASTER PROMPT 3: Product Module
4. → MASTER PROMPT 4: Cart System
5. → MASTER PROMPT 5: Order + Payment
6. → MASTER PROMPT 6: Admin Panel APIs
7. → MASTER PROMPT 7: Frontend Setup (React)
8. → MASTER PROMPT 8: Product UI
9. → MASTER PROMPT 9: Advanced Features
10. → MASTER PROMPT 10: Deployment Ready

## 📄 License

ISC
