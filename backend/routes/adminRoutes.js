import express from 'express';
import fs from 'fs';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { generateSalesReportPDF, generateInventoryReportPDF, generateUserReportPDF } from '../utils/pdfGenerator.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders
      },
      recentOrders
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders (Admin view)
// @access  Private/Admin
router.get('/orders', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/reports/sales
// @desc    Generate sales report
// @access  Private/Admin
router.get('/reports/sales', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      status: { $ne: 'cancelled' }
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

    const { filepath, filename } = await generateSalesReportPDF(orders, startDate, endDate);

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
      }
      // Clean up the file after download
      setTimeout(() => {
        fs.unlink(filepath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });
      }, 5000);
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/reports/inventory
// @desc    Generate inventory report
// @access  Private/Admin
router.get('/reports/inventory', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const products = await Product.find({ isActive: true })
      .sort({ category: 1, name: 1 });

    const { filepath, filename } = await generateInventoryReportPDF(products);

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
      }
      // Clean up the file after download
      setTimeout(() => {
        fs.unlink(filepath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });
      }, 5000);
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/reports/users
// @desc    Generate user report
// @access  Private/Admin
router.get('/reports/users', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    const { filepath, filename } = await generateUserReportPDF(users);

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
      }
      // Clean up the file after download
      setTimeout(() => {
        fs.unlink(filepath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });
      }, 5000);
    });
  } catch (error) {
    next(error);
  }
});

export default router;

