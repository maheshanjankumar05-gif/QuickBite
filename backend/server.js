const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const Food = require('./models/Food');
const seedDatabase = require('./seed');

// Import routes
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '🚀 QuickBite Online Food Delivery API is running smoothly',
    version: '1.0.0',
    endpoints: {
      users: '/api/user',
      foods: '/api/food',
      cart: '/api/cart',
      orders: '/api/order',
      categories: '/api/category',
      admin: '/api/admin',
    },
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/user', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// Connect to Database & Start Server
const startServer = async () => {
  const isConnected = await connectDB();

  if (isConnected) {
    try {
      // Auto seed if empty
      const count = await Food.countDocuments();
      if (count === 0) {
        console.log('🍽️ No food items found in DB, auto-seeding initial menu and admin account...');
        await seedDatabase();
      }
    } catch (e) {
      console.warn('⚠️ Seeding check skipped:', e.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(` QuickBite Backend Server running on port ${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=================================================\n`);
  });
};

startServer();

