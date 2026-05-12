# SANJISH - Premium E-Commerce Platform
## Complete Setup & Architecture Guide

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Frontend Components](#frontend-components)
8. [Features Implementation](#features-implementation)
9. [Deployment](#deployment)

---

## 🎯 PROJECT OVERVIEW

**SANJISH: Where Trust Meets Style, Crafted with Love**

A production-grade e-commerce platform targeting Indian users with a focus on fashion and lifestyle products. Built with modern tech stack following industry best practices.

### Key Characteristics:
- **Mobile-First Design**: Optimized for Indian mobile-first audience
- **Performance-Focused**: Code splitting, lazy loading, image optimization
- **User-Centric**: Personalization, smart recommendations, easy navigation
- **Trust-Building**: Security badges, easy returns, authentic products guarantee
- **Scalable Architecture**: Microservices ready, horizontally scalable

---

## 🛠 TECH STACK

### Frontend
- **React 18**: UI library with hooks
- **Redux Toolkit**: State management
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **React Icons**: Icon library
- **React Toastify**: Toast notifications
- **Redux Persist**: Local storage persistence

### Backend
- **Node.js**: Runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Helmet**: Security headers
- **Multer**: File uploads
- **Cloudinary**: Image storage
- **Redis**: Caching (optional)

---

## 📁 PROJECT STRUCTURE

```
eCommerce-Website/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js (Enhanced V2)
│   │   ├── reviewController.js (NEW)
│   │   ├── wishlistController.js (NEW)
│   │   └── couponController.js (NEW)
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js (Enhanced)
│   │   ├── Product.js (Enhanced)
│   │   ├── Order.js (Enhanced)
│   │   ├── Cart.js
│   │   ├── Review.js (NEW)
│   │   ├── Wishlist.js (NEW)
│   │   └── Coupon.js (NEW)
│   ├── routes/
│   │   └── v1/
│   │       ├── authRoutes.js
│   │       ├── productRoutes.js
│   │       ├── cartRoutes.js
│   │       ├── orderRoutes.js
│   │       ├── adminRoutes.js
│   │       ├── wishlistRoutes.js (NEW)
│   │       ├── reviewRoutes.js (NEW)
│   │       └── couponRoutes.js (NEW)
│   ├── scripts/
│   │   ├── seedData.js
│   │   └── seedFashionProducts.js (NEW)
│   ├── services/
│   │   ├── authService.js
│   │   ├── cartService.js
│   │   ├── orderService.js
│   │   └── productService.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── logger.js
│   │   ├── password.js
│   │   └── validation.js
│   ├── logs/
│   ├── .env (to create)
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCardEnhanced.jsx (NEW)
│   │   │   ├── FilterSidebar.jsx (NEW)
│   │   │   ├── FilterSidebar.css (NEW)
│   │   │   ├── ProductCard.css (Updated)
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── HomeEnhanced.jsx (NEW)
│   │   │   ├── HomeEnhanced.css (NEW)
│   │   │   ├── Products.jsx
│   │   │   ├── ProductsPageEnhanced.jsx (NEW)
│   │   │   ├── ProductsPageEnhanced.css (NEW)
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Profile.jsx (Enhanced)
│   │   │   ├── Auth.css
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   ├── Wishlist.jsx (NEW)
│   │   │   ├── Wishlist.css (NEW)
│   │   │   ├── PolicyPages.jsx (NEW)
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── cartSlice.js
│   │   │       ├── orderSlice.js
│   │   │       ├── productSlice.js
│   │   │       ├── wishlistSlice.js (NEW)
│   │   │       └── uiSlice.js (NEW)
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── build/
│   ├── .env (to create)
│   └── package.json
│
└── README.md
```

---

## 🚀 INSTALLATION & SETUP

### Prerequisites
- Node.js 16+ and npm
- MongoDB 5.0+
- Git

### Step 1: Clone and Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/sanjish_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloudinary (For image uploads)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis (Optional)
REDIS_URL=redis://localhost:6379
EOF

# Seed sample products
npm run seed:fashion

# Start backend
npm run dev
```

### Step 2: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_CLOUDINARY_NAME=your-cloudinary-name
EOF

# Start frontend
npm start
```

Backend runs on `http://localhost:5000`  
Frontend runs on `http://localhost:3000`

---

## 📊 DATABASE SCHEMA

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar: String,
  role: 'user' | 'admin',
  addresses: [{
    _id: ObjectId,
    name: String,
    phone: String,
    street, city, state, zipCode, country,
    isDefault: Boolean,
    label: 'home' | 'work' | 'other'
  }],
  preferences: {
    emailNotifications: Boolean,
    newsletter: Boolean
  },
  loyaltyPoints: Number,
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum',
  totalOrders: Number,
  totalSpent: Number,
  createdAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  slug: String (unique),
  description: String,
  mrp: Number,
  sellingPrice: Number,
  discount: Number (auto-calculated),
  brand: String,
  category: String,
  sizes: [String],
  colors: [{
    name: String,
    code: String,
    images: [String]
  }],
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  ratings: Number,
  numReviews: Number,
  stock: Number,
  sku: String (unique),
  isFeatured: Boolean,
  isNewArrival: Boolean,
  isBestseller: Boolean,
  estimatedDelivery: {
    minDays: Number,
    maxDays: Number
  },
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Order Model
```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId,
    quantity: Number,
    size: String,
    color: String,
    price: Number
  }],
  subtotal: Number,
  discount: Number,
  shippingCost: Number,
  tax: Number,
  totalAmount: Number,
  shippingAddress: {
    name, phone, street, city, state, zipCode, country
  },
  paymentInfo: {
    method: 'card' | 'upi' | 'cod' | 'netbanking',
    transactionId: String,
    status: 'pending' | 'completed' | 'failed'
  },
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  trackingNumber: String,
  estimatedDelivery: Date,
  createdAt: Date
}
```

### Review Model
```javascript
{
  product: ObjectId (ref: Product),
  user: ObjectId (ref: User),
  order: ObjectId (ref: Order),
  title: String,
  comment: String,
  rating: Number (1-5),
  detailedRatings: {
    quality: Number,
    fitAndSize: Number,
    delivery: Number,
    valueForMoney: Number
  },
  isVerifiedPurchase: Boolean,
  helpful: Number,
  createdAt: Date
}
```

### Wishlist Model
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId,
    addedAt: Date
  }],
  totalItems: Number,
  createdAt: Date
}
```

### Coupon Model
```javascript
{
  code: String (unique, uppercase),
  discountType: 'percentage' | 'fixed',
  discountValue: Number,
  minOrderValue: Number,
  maxDiscountAmount: Number,
  startDate: Date,
  endDate: Date,
  maxUsageCount: Number,
  usageCount: Number,
  isActive: Boolean,
  createdAt: Date
}
```

---

## 🔌 API DOCUMENTATION

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh-token` - Refresh JWT
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Product Endpoints
- `GET /api/v1/products` - Get all products with filters
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/bestsellers` - Get best sellers
- `GET /api/v1/products/new-arrivals` - Get new arrivals
- `GET /api/v1/products/on-sale` - Get on-sale products
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/search?q=term` - Search products
- `GET /api/v1/products/categories` - Get all categories
- `GET /api/v1/products/brands` - Get all brands
- `POST /api/v1/products` (Admin) - Create product
- `PUT /api/v1/products/:id` (Admin) - Update product
- `DELETE /api/v1/products/:id` (Admin) - Delete product

### Review Endpoints
- `GET /api/v1/reviews/:productId` - Get product reviews
- `POST /api/v1/reviews/:productId` - Add review (Auth required)
- `PUT /api/v1/reviews/:reviewId` - Update review
- `DELETE /api/v1/reviews/:reviewId` - Delete review
- `POST /api/v1/reviews/:reviewId/helpful` - Mark as helpful

### Wishlist Endpoints
- `GET /api/v1/wishlist` - Get user's wishlist
- `POST /api/v1/wishlist/add` - Add product to wishlist
- `DELETE /api/v1/wishlist/remove` - Remove from wishlist
- `GET /api/v1/wishlist/check/:productId` - Check if in wishlist
- `DELETE /api/v1/wishlist/clear` - Clear entire wishlist

### Coupon Endpoints
- `GET /api/v1/coupons` - Get available coupons
- `POST /api/v1/coupons/validate` - Validate coupon
- `GET /api/v1/coupons/:code` - Get coupon details
- `POST /api/v1/coupons/apply` - Apply coupon to order

### Cart Endpoints
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart/add` - Add to cart
- `PUT /api/v1/cart/update/:itemId` - Update cart item
- `DELETE /api/v1/cart/remove/:itemId` - Remove from cart
- `DELETE /api/v1/cart/clear` - Clear cart

### Order Endpoints
- `POST /api/v1/orders` - Create order (Auth required)
- `GET /api/v1/orders` - Get user's orders
- `GET /api/v1/orders/:id` - Get order details
- `PUT /api/v1/orders/:id/cancel` - Cancel order
- `POST /api/v1/orders/:id/return` - Request return
- `GET /api/v1/orders/:id/track` - Track order

---

## 🎨 FRONTEND COMPONENTS

### Key Components Created

1. **FilterSidebar** - Advanced filtering with price slider, brands, ratings, discounts
2. **ProductCardEnhanced** - Myntra-like product card with quick actions
3. **HomeEnhanced** - Smart homepage with sections, offers, categories
4. **ProductsPageEnhanced** - Advanced listing with grid/list view, sorting
5. **WishlistPage** - User wishlist management
6. **ReviewsSection** - Product reviews and ratings
7. **OrderTracker** - Real-time order tracking
8. **ProfilePage** - User account management

### State Management (Redux Slices)
- `authSlice` - User authentication
- `cartSlice` - Shopping cart
- `orderSlice` - Orders
- `productSlice` - Products
- `wishlistSlice` - Wishlist (NEW)
- `uiSlice` - UI state (NEW)

---

## ✨ FEATURES IMPLEMENTATION

### 1. Smart Homepage
- ✅ Dynamic banners
- ✅ Category shortcuts
- ✅ Trending/Featured products section
- ✅ Best sellers section
- ✅ New arrivals section
- ✅ On-sale products section
- ✅ Trust badges
- ✅ Newsletter signup

### 2. Advanced Product Listing
- ✅ Filters (price, category, brand, rating, discount)
- ✅ Sorting (newest, price, rating, popularity, discount)
- ✅ Grid/List view toggle
- ✅ Infinite scroll (can be implemented)
- ✅ Sticky filter panel
- ✅ Mobile-responsive

### 3. Product Details Page
- ✅ Multiple images with zoom
- ✅ Size/Color selection
- ✅ Price with discount display
- ✅ Stock status
- ✅ Delivery estimate
- ✅ Product reviews
- ✅ Wishlist button
- ✅ Add to cart/bag button

### 4. Shopping Cart
- ✅ Quantity management
- ✅ Item removal
- ✅ Coupon application
- ✅ Price breakdown (MRP, discount, shipping, tax)
- ✅ Cart total

### 5. Checkout Flow
- ✅ Address management
- ✅ Payment method selection
- ✅ Order summary
- ✅ Order confirmation

### 6. User Account
- ✅ Order history
- ✅ Wishlist management
- ✅ Address management
- ✅ Profile settings
- ✅ Loyalty points
- ✅ Order tracking

### 7. Search & Discovery
- ✅ Search bar with suggestions
- ✅ Search results page
- ✅ Advanced filters
- ✅ Recent searches

### 8. Reviews & Ratings
- ✅ Product reviews listing
- ✅ Add review (auth required)
- ✅ Star ratings
- ✅ Verified purchase badge
- ✅ Helpful/Unhelpful voting

### 9. Wishlist Feature
- ✅ Add/Remove products
- ✅ View wishlist
- ✅ Move to cart from wishlist
- ✅ Share wishlist

### 10. Additional Features
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ Empty states
- ✅ Error handling
- ✅ Mobile-first responsive design

---

## 📄 POLICY PAGES

Create these pages in `frontend/src/pages/`:

1. **Shipping Policy** - Delivery timeframes, shipping zones
2. **Return Policy** - Return eligibility, process, timeframes
3. **Privacy Policy** - Data collection and usage
4. **Terms & Conditions** - Legal terms
5. **Contact Us** - Business contact information

---

## 🚀 DEPLOYMENT

### Backend Deployment (Heroku/Railway)
```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
npm run build
# Deploy build folder to Vercel
```

### Database
- Use MongoDB Atlas for production
- Enable backups and replica sets

---

## 📈 PERFORMANCE OPTIMIZATION

- [ ] Image compression and CDN
- [ ] Code splitting by route
- [ ] Lazy loading components
- [ ] React.memo for pure components
- [ ] Redux selector optimization
- [ ] API response caching
- [ ] Database indexing

---

## 🔒 SECURITY CHECKLIST

- [ ] HTTPS only
- [ ] JWT expiration and refresh tokens
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Password hashing (bcrypt)
- [ ] Helmet.js headers
- [ ] Environment variables in .env

---

## 📞 SUPPORT & CONTACT

**SANJISH**  
📍 Pune, India  
📧 support@sanjish.com  
📱 +91-XXXXXXXXXX

---

**Last Updated:** May 2024  
**Version:** 1.0.0
