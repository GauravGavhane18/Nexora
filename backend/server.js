import express from 'express';
import cors from 'cors';
import helmet from 'helmet';//Security middleware
import morgan from 'morgan';//Logging middleware
import compression from 'compression';//Compression middleware
import mongoSanitize from 'express-mongo-sanitize';//Sanitize middleware
import xss from 'xss-clean';//XSS middleware
import rateLimit from 'express-rate-limit';//Rate limiting middleware
import { createServer } from 'http';//HTTP server
import { Server } from 'socket.io';//Socket.IO server
import dotenv from 'dotenv';//Environment variables

import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { setupSocketIO } from './config/socket.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import bundleRoutes from './routes/bundleRoutes.js';

import auctionRoutes from './routes/auctionRoutes.js';
import placeholderRoutes from './routes/placeholderRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3002",
  "https://nexora-frontend.onrender.com"
];

if (process.env.ALLOWED_ORIGINS) {
  const extraOrigins = process.env.ALLOWED_ORIGINS.split(',');
  allowedOrigins.push(...extraOrigins);
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// CORS configuration moved before rate limiter
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Setup Socket.IO
setupSocketIO(io);

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/seller', sellerRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/bundles', bundleRoutes);
app.use('/api/v1/auctions', auctionRoutes);
app.use('/api/placeholder', placeholderRoutes);

// Health check endpoint
app.get('/api/v1/health', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'NEXORA API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(` NEXORA Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(` Health check: http://localhost:${PORT}/api/v1/health`);
});
