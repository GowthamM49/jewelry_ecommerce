import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import goldRateRoutes from './routes/goldRateRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import GoldRate from './models/GoldRate.js';
import { updateGoldRatesDaily } from './utils/goldRateService.js';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\nPlease create a .env file in the backend directory with the following:');
  console.error('PORT=5000');
  console.error('MONGODB_URI=mongodb://localhost:27017/jewelry_ecommerce');
  console.error('JWT_SECRET=your_super_secret_jwt_key_change_in_production');
  console.error('JWT_EXPIRE=7d');
  console.error('NODE_ENV=development');
  process.exit(1);
}

const app = express();

// Security middleware
app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Return false instead of throwing — avoids 500, sends proper 403
    return callback(null, false);
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/gold-rate', goldRateRoutes);
app.use('/api/admin', adminRoutes);
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelry_ecommerce')
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Schedule daily gold rate updates
    // Runs every day at 9:00 AM IST (3:30 AM UTC)
    // You can change the schedule by modifying the cron expression
    // Format: 'minute hour day month day-of-week'
    // '30 3 * * *' = 3:30 AM UTC daily (9:00 AM IST)
    const updateSchedule = process.env.GOLD_RATE_UPDATE_SCHEDULE || '30 3 * * *';
    
    cron.schedule(updateSchedule, async () => {
      console.log('🔄 Scheduled gold rate update triggered...');
      try {
        const result = await updateGoldRatesDaily(GoldRate);
        if (result.success && !result.skipped) {
          console.log('✅ Scheduled gold rate update completed successfully');
        } else if (result.skipped) {
          console.log('⏭️  Gold rate update skipped (already updated today)');
        }
      } catch (error) {
        console.error('❌ Error in scheduled gold rate update:', error);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata" // IST timezone
    });
    
    console.log(`📅 Gold rate auto-update scheduled: Daily at 9:00 AM IST (cron: ${updateSchedule})`);
    
    // Update rates on server startup — force fetch if rates are from seed/manual source
    updateGoldRatesDaily(GoldRate, { forceIfManual: true }).then(result => {
      if (result.success && !result.skipped) {
        console.log('✅ Initial gold rate update completed on server startup');
      } else if (result.skipped) {
        console.log('ℹ️  Gold rates already up to date');
      }
    }).catch(error => {
      console.error('⚠️  Could not update gold rates on startup:', error.message);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please:`);
        console.error(`1. Kill the process using port ${PORT}`);
        console.error(`2. Or change PORT in .env file`);
        console.error(`\nTo find and kill the process on Windows:`);
        console.error(`  netstat -ano | findstr :${PORT}`);
        console.error(`  taskkill /PID <PID> /F`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export default app;

