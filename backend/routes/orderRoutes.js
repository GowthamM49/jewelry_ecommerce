import express from 'express';
import { body } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { calculateProductPrice, calculateOrderTotal } from '../utils/priceCalculator.js';
import { getCurrentGoldRates } from '../utils/goldRateService.js';
import { generateInvoicePDF } from '../utils/pdfGenerator.js';
import GoldRate from '../models/GoldRate.js';
import fs from 'fs';
import Cart from '../models/Cart.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('shippingAddress').isObject().withMessage('Shipping address is required')
], async (req, res, next) => {
  try {
    const { items, shippingAddress, notes } = req.body;

    // Get current gold rates
    const goldRates = await getCurrentGoldRates(GoldRate);

    // Process order items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product || !product.isActive) {
          throw new Error(`Product ${item.productId} not found or inactive`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        // Calculate price
        const priceDetails = await calculateProductPrice(product, goldRates);
        const totalPrice = priceDetails.total * item.quantity;

        return {
          product: product._id,
          productId: product.productId,
          name: product.name,
          quantity: item.quantity,
          weight: product.weight,
          purity: product.purity,
          metal: product.metal,
          goldRate: goldRates[product.purity] || 0,
          makingCharges: priceDetails.makingCharges,
          makingChargesType: product.makingChargesType,
          unitPrice: priceDetails.total,
          totalPrice
        };
      })
    );

    // Calculate totals
    const totals = calculateOrderTotal(orderItems);

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal: totals.subtotal,
      gst: totals.gst,
      total: totals.total,
      shippingAddress,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images productId')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/:id/invoice
// @desc    Generate and download invoice PDF
// @access  Private
router.get('/:id/invoice', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check access
    if (order.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate PDF
    const { filepath, filename } = await generateInvoicePDF(order, order.user);

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error downloading invoice:', err);
        return res.status(500).json({ message: 'Error generating invoice' });
      }
      // Clean up file after download (optional)
      // fs.unlinkSync(filepath);
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin/Staff only)
// @access  Private/Admin
router.put('/:id/status', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
});

export default router;

