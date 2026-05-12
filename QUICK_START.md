# SANJISH - Quick Start Guide

Welcome to Sanjish! This guide will get you up and running in under 5 minutes.

## ⚡ 5-Minute Quick Start

### Step 1: Prerequisites Check
```bash
# Check if Node.js is installed
node --version  # Should be 16+

# Check if MongoDB is running
mongosh  # Should connect successfully
```

### Step 2: Backend Setup (2 minutes)
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sanjish_db
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
EOF

# Start server
npm run dev
```

**✓ Backend running on http://localhost:5000**

### Step 3: Frontend Setup (2 minutes)
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api/v1
EOF

# Start frontend
npm start
```

**✓ Frontend running on http://localhost:3000**

### Step 4: Seed Sample Data (1 minute)
```bash
cd backend
npm run seed:fashion
```

**✓ Database populated with 10 fashion products**

## 🎯 What's Ready to Use?

### ✅ Backend Features
- [x] Authentication (Login/Register)
- [x] Product Catalog with advanced filters
- [x] Shopping Cart
- [x] Wishlist
- [x] Reviews & Ratings
- [x] Orders
- [x] Coupons & Discounts
- [x] User Profiles
- [x] Admin Panel (basics)

### ✅ Frontend Components
- [x] Smart Homepage with sections
- [x] Advanced Product Listing Page
- [x] Filter Sidebar
- [x] Product Card (Myntra-like)
- [x] Product Details Page (Basic)
- [x] Shopping Cart
- [x] Wishlist Page
- [x] User Profile
- [x] Policy Pages

### ✅ Database Schemas
- [x] User (Enhanced with addresses, preferences)
- [x] Product (Production-grade with multiple fields)
- [x] Order (Complete with order tracking)
- [x] Cart
- [x] Review (Product reviews)
- [x] Wishlist
- [x] Coupon

## 📚 API Endpoints Ready

### Products
- `GET /api/v1/products` - List with filters
- `GET /api/v1/products/featured` - Featured products
- `GET /api/v1/products/bestsellers` - Best sellers
- `GET /api/v1/products/new-arrivals` - New arrivals
- `GET /api/v1/products/on-sale` - On sale
- `GET /api/v1/products/search?q=term` - Search

### Reviews
- `GET /api/v1/reviews/:productId` - Get reviews
- `POST /api/v1/reviews/:productId` - Add review
- `DELETE /api/v1/reviews/:reviewId` - Delete review

### Wishlist
- `GET /api/v1/wishlist` - Get wishlist
- `POST /api/v1/wishlist/add` - Add to wishlist
- `DELETE /api/v1/wishlist/remove` - Remove from wishlist

### Coupons
- `GET /api/v1/coupons` - Available coupons
- `POST /api/v1/coupons/validate` - Validate coupon
- `POST /api/v1/coupons/apply` - Apply coupon

## 🔧 Common Commands

### Backend
```bash
cd backend

# Development mode (auto-reload)
npm run dev

# Production mode
npm start

# Seed sample products
npm run seed:fashion

# Seed test data
npm run seed

# Check health
curl http://localhost:5000/health
```

### Frontend
```bash
cd frontend

# Development server
npm start

# Production build
npm run build

# Run tests
npm test

# Format code
npm run format
```

## 🗄️ Database

### Connect to MongoDB
```bash
# Using MongoDB Shell
mongosh mongodb://localhost:27017/sanjish_db

# Query sample
db.products.findOne()
```

### Sample Collections
- `users` - User accounts
- `products` - Product catalog (10 samples)
- `orders` - Customer orders
- `carts` - Shopping carts
- `wishlists` - User wishlists
- `reviews` - Product reviews
- `coupons` - Discount coupons

## 🌍 Frontend Routes

- `/` - Home
- `/products` - Product listing
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/wishlist` - Wishlist
- `/profile` - User profile
- `/login` - Login
- `/register` - Register
- `/shipping` - Shipping policy
- `/returns` - Return policy
- `/privacy` - Privacy policy
- `/terms` - Terms & conditions
- `/contact` - Contact us

## 🎨 Customize

### Colors (Update in CSS)
- Primary: `#ff9f43` (Orange)
- Dark: `#212121`
- Gray: `#999999`
- Success: `#27ae60` (Green)
- Danger: `#e74c3c` (Red)

### Brand Name
Search and replace `Sanjish` with your brand name in:
- `frontend/src/pages/PolicyPages.jsx`
- `frontend/src/pages/HomeEnhanced.jsx`
- `backend/server.js`

### Logo
Replace in `frontend/public/index.html`

## 📝 Sample Product Data

Sample fashion products included:
- Women: T-shirt, Jeans, Saree
- Men: Formal Shirt, Chinos
- Footwear: Running Shoes
- Accessories: Backpack, Sunglasses
- Home: Bedsheet Set

All priced in INR (₹) with discounts.

## 🔐 Authentication

### Default Admin (if seeded)
- Email: admin@sanjish.com
- Password: Admin@123

### Test User
- Email: user@test.com
- Password: TestUser@123

## 🚀 Next Steps

1. **Customize Brand**
   - Update logo and colors
   - Change business info in footer
   - Update policy pages

2. **Add More Products**
   - Use admin API or update seed script
   - Upload product images

3. **Implement Missing Pages**
   - Product detail page (enhance)
   - Checkout flow (complete)
   - User profile (enhance)

4. **Testing**
   - Create test accounts
   - Test complete user flow
   - Check mobile responsiveness

5. **Deployment**
   - Backend: Heroku/Railway
   - Frontend: Vercel/Netlify
   - Database: MongoDB Atlas

## 📞 Troubleshooting

### Backend won't start
```bash
# Clear node_modules
rm -rf node_modules
npm install

# Check if port 5000 is available
lsof -i :5000  # Kill if needed

# Check MongoDB connection
mongosh
```

### Frontend issues
```bash
# Clear cache
npm cache clean --force

# Clear node_modules
rm -rf node_modules
npm install

# Start with cache cleared
npm start
```

### API calls failing
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check MongoDB
mongosh
```

## 📖 Full Documentation

For detailed documentation, see: `SETUP_GUIDE.md`

This includes:
- Complete API documentation
- Database schema details
- Deployment instructions
- Feature implementation details

## 🎯 Architecture Overview

```
User Browser
    ↓
Frontend (React)
    ↓
Backend (Express.js)
    ↓
MongoDB
```

**Security Flow:**
- User logs in → JWT issued → Stored in Redux
- Every API request → JWT in header
- Backend verifies JWT → Process request
- Response sent back with data

## 💡 Key Features

1. **Smart Homepage** - Dynamic sections, trending products
2. **Advanced Filtering** - Category, price, brand, rating, discount
3. **Product Reviews** - User ratings and reviews
4. **Wishlist** - Save favorites for later
5. **Coupons** - Apply discount codes
6. **Order Tracking** - Real-time delivery updates
7. **Responsive Design** - Works on all devices
8. **Trust Badges** - Security, returns, original products

## 🎓 Learning Path

1. **New to project?** → Start with this Quick Start Guide
2. **Need API docs?** → Check SETUP_GUIDE.md
3. **Want to customize?** → Look at component files
4. **Need to debug?** → Check backend logs
5. **Ready to deploy?** → See Deployment section

## 🆘 Getting Help

### Documentation
- Setup Guide: `SETUP_GUIDE.md`
- This file: `QUICK_START.md`

### Support
- Email: support@sanjish.com
- Issues: Check GitHub issues

## 📜 License

This project is open source. Feel free to modify and use!

---

**Happy Coding! 🚀**

Need to get started? Run this:
```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend
cd frontend && npm install && npm start

# Terminal 3: (Optional) Seed data
cd backend && npm run seed:fashion
```

Then visit: **http://localhost:3000**

Enjoy your Sanjish e-commerce platform! ✨
