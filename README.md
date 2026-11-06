# 🍔 QuickBite - Online Food Delivery System (MERN Stack)

QuickBite is an end-to-end, full-featured **Online Food Delivery System** built with the modern MERN Stack (MongoDB, Express.js, React.js, Node.js). It includes a customer-facing responsive web application, an administrative management control portal, and an Express REST API backend connected to MongoDB.

---

## 📸 Key Features

### 1. 🍕 Customer Web Application
- **Modern Orange & Dark Design:** Premium responsive UI with smooth animations, high-contrast badges, and glassmorphic elements.
- **Hero Showcase:** High-impact banner highlighting 30-minute delivery, top ratings, and instant promotional coupon discounts.
- **Categorized Food Catalog:** Instant filtering across **Pizza, Burger, Biryani, Chinese, Desserts, and Beverages**.
- **Live Search & Filters:** Instant food search with pure vegetarian toggle (`Pure Veg`) and sorting (Recommended, Top Rated, Price Low-to-High, Price High-to-Low).
- **Interactive Food Cards:** Displays real-time stock availability, rating stars, prep time, price in INR (₹), and directly adjustable `[-] [qty] [+]` controls on cards.
- **Food Details Modal:** Full dish presentation with ingredient notes, tags (`Bestseller`, `Chef Special`, `Spicy`), and instant cart addition.
- **Promotional Coupons:** Built-in discount codes (`QUICK50` for 50% off up to ₹100, `FREEDEL` for free shipping, `TASTY20` for 20% off).

### 2. 🔐 User Authentication & Profile
- User registration and login with bcrypt salted password hashing.
- Stateless authentication using JSON Web Tokens (JWT).
- Profile management (name, phone number, saved delivery address).
- Guest-to-authenticated cart synchronization.

### 3. 🛒 Shopping Cart
- Real-time subtotal, 5% tax/GST, dynamic delivery fee (FREE for orders ≥ ₹500, else ₹40), and promo discount calculations.
- Persisted cart data saved in MongoDB for logged-in accounts and synchronized with browser storage for offline resilience.
- Item quantity adjustment and clear cart features with toast alerts.

### 4. 📦 Checkout & Live Order Tracking
- Full checkout form: recipient name, contact phone, street address, city, pin code, and delivery instructions.
- Multiple payment methods: **Cash on Delivery (COD)**, **UPI (Google Pay, PhonePe, Paytm)**, and **Credit/Debit Card**.
- Visual step-by-step order tracking timeline:
  - 🟡 **Pending** ➔ 🟣 **Confirmed** ➔ 🟡 **Preparing** ➔ 🔵 **Out for Delivery** ➔ 🟢 **Delivered**
- Real-time cancellation option for pending orders.

### 5. 🛡️ Admin Management Dashboard
- **Analytics Overview:** Real-time KPI statistics cards for:
  - **Total Revenue (₹)**
  - **Total Orders**
  - **Total Food Menu Items**
  - **Registered Customer Accounts**
- **Pipeline Status Grid:** Real-time visual counter across all order statuses.
- **Food Menu CRUD:** Add new food dishes, edit existing dishes, delete dishes, upload local images via Multer or assign high-res external URLs.
- **Orders Manager:** View detailed customer delivery information, ordered dish breakdowns, and switch order status from a single dropdown.
- **Categories Manager:** Add new menu categories with custom preview covers and delete categories.
- **User Directory:** Browse registered customer accounts, joined dates, and contact records.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend (Customer)** | React 18, Vite, React Router DOM 6, Axios, Lucide React, React Toastify, CSS3 |
| **Frontend (Admin)** | React 18, Vite, React Router DOM 6, Axios, Lucide React, React Toastify, CSS3 |
| **Backend API** | Node.js, Express.js, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `multer`, `dotenv` |
| **Database** | MongoDB with Mongoose ODM |

---

## 📁 Project Structure

```text
QuickBite/
├── backend/                  # Node.js & Express REST API Server
│   ├── config/               # Database connection config
│   │   └── db.js
│   ├── controllers/          # Business logic controllers
│   │   ├── adminController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/           # Auth and Multer upload middleware
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/               # Mongoose schema models
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Food.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/               # API endpoint routes
│   │   ├── adminRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/              # Local uploaded food images
│   ├── .env                  # Environment variables
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   ├── seed.js               # Database seeder script
│   └── server.js             # API entry point
│
├── frontend/                 # Customer React Web App (Port 5173)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── FoodCard.jsx
│   │   │   ├── FoodModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrderStatusBadge.jsx
│   │   │   ├── OrderTracker.jsx
│   │   │   └── SpecialOffers.jsx
│   │   ├── context/          # React Context (Auth & Cart state)
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/            # Application pages
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── TrackOrder.jsx
│   │   ├── services/
│   │   │   └── api.js        # Axios instance with JWT interceptor
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── admin/                    # Admin Management Dashboard (Port 5174)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── CategoryModal.jsx
│   │   │   ├── FoodModal.jsx
│   │   │   └── StatCard.jsx
│   │   ├── context/
│   │   │   └── AdminAuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── CategoryList.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FoodList.jsx
│   │   │   ├── OrderList.jsx
│   │   │   └── UserList.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json              # Monorepo root scripts
└── README.md
```

---

## 🔑 Default Credentials

### Administrator Account
- **URL:** [http://localhost:5174](http://localhost:5174)
- **Email:** `admin@quickbite.com`
- **Password:** `admin123`
*(A "Quick Fill" button is also provided on the Admin login screen for instant access)*

### Customer Demo Account
- **URL:** [http://localhost:5173/login](http://localhost:5173/login)
- **Email:** `john@example.com`
- **Password:** `user123`

---

## 🚀 How to Run in VS Code (Step-by-Step)

### Prerequisites
1. **Node.js:** v18+ or higher installed (`node -v`).
2. **MongoDB:** Running locally on default port 27017 or a MongoDB Atlas URI.

---

### Step 1: Seed the Database
Populate the database with sample artisanal pizzas, gourmet burgers, biryanis, wok dishes, categories, admin user, and sample orders:
```bash
cd backend
npm run seed
```

---

### Step 2: Start the Backend API Server
Open a terminal in VS Code:
```bash
cd backend
node server.js
```
The backend API server will start on **`http://localhost:5000`**.

---

### Step 3: Start the Customer Frontend
Open a **second terminal** in VS Code:
```bash
cd frontend
npm run dev
```
The customer store will open on **`http://localhost:5173`**.

---

### Step 4: Start the Admin Dashboard
Open a **third terminal** in VS Code:
```bash
cd admin
npm run dev
```
The admin control portal will run on **`http://localhost:5174`**.

---

## 📡 REST API Documentation Reference

### Authentication & Users (`/api/user`)
- `POST /api/user/register` - Create a new user account.
- `POST /api/user/login` - Authenticate user & return JWT token.
- `GET /api/user/profile` - Get logged-in user profile (`Bearer JWT` required).
- `PUT /api/user/profile` - Update user information & address (`Bearer JWT` required).
- `GET /api/user/all` - List all registered users (Admin only).

### Food Items (`/api/food`)
- `GET /api/food` - List food items with query filters (`search`, `category`, `vegOnly`, `sort`).
- `GET /api/food/:id` - Fetch single food item details.
- `POST /api/food` - Create a new food dish (Admin only, supports image upload).
- `PUT /api/food/:id` - Update food dish details / pricing (Admin only).
- `DELETE /api/food/:id` - Delete food dish from catalog (Admin only).

### Categories (`/api/category`)
- `GET /api/category` - List all available menu categories.
- `POST /api/category` - Create a new category (Admin only).
- `DELETE /api/category/:id` - Delete category (Admin only).

### Shopping Cart (`/api/cart`)
- `GET /api/cart` - Fetch current user's cart populated from MongoDB.
- `POST /api/cart/add` - Add item or increment quantity in MongoDB.
- `PUT /api/cart/update` - Set explicit quantity in MongoDB.
- `DELETE /api/cart/remove/:foodId` - Remove specific item from cart.
- `DELETE /api/cart/clear` - Empty user's cart.
- `POST /api/cart/sync` - Synchronize guest local cart upon sign in.

### Orders (`/api/order`)
- `POST /api/order` - Place a new order with items and delivery address.
- `GET /api/order/my-orders` - List all orders placed by the current user.
- `GET /api/order/all` - List all customer orders across the platform (Admin only).
- `GET /api/order/:id` - View single order details with live status tracker.
- `PUT /api/order/:id/status` - Update order status (Admin only).
- `PUT /api/order/:id/cancel` - Cancel a pending order.

### Admin Analytics (`/api/admin`)
- `GET /api/admin/stats` - Fetch aggregate metrics: total revenue, total orders, total foods, total users, orders by status breakdown, and recent orders.

---

## 🧪 Testing All Major Features

1. **Browsing:** Visit `http://localhost:5173`, click through category pills (Pizza, Burger, Biryani), toggle "Pure Veg", and sort by price/rating.
2. **Search:** Type "Biryani" or "Burger" in the search bar.
3. **Cart & Promo:** Add dishes to cart, enter promo code `QUICK50` or `FREEDEL` and watch the subtotal and discount update automatically.
4. **Checkout:** Fill out the delivery form, choose "Cash on Delivery", and click "Place Order".
5. **Live Tracker:** View the step-by-step order progress timeline.
6. **Admin Control:** Navigate to `http://localhost:5174`, log in with `admin@quickbite.com` / `admin123`, view the dashboard metrics, edit food items, add new dishes, and update the customer order status to "Preparing", "Out for Delivery", and "Delivered".

---

© 2026 QuickBite Technologies Inc. Built with the MERN Stack.

