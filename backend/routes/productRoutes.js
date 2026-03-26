import express from 'express';
import { body } from 'express-validator';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';
import { calculateProductPrice } from '../utils/priceCalculator.js';
import { getCurrentGoldRates } from '../utils/goldRateService.js';
import GoldRate from '../models/GoldRate.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      metal,
      purity,
      occasion,
      style,
      minWeight,
      maxWeight,
      sort,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const dbQuery = { isActive: true };

    if (category) dbQuery.category = category;
    if (metal) dbQuery.metal = metal;
    if (purity) dbQuery.purity = purity;
    // Exclude products with occasion='NA' when filtering by occasion
    if (occasion) dbQuery.occasion = occasion;
    if (style) dbQuery.style = style;
    if (minWeight) dbQuery.weight = { ...(dbQuery.weight || {}), $gte: Number(minWeight) };
    if (maxWeight) dbQuery.weight = { ...(dbQuery.weight || {}), $lte: Number(maxWeight) };

    // Text search — regex is reliable without requiring a MongoDB text index
    if (search) {
      dbQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // DB-level sort (for fields that exist in the schema)
    let dbSort = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc' || sort === 'price_desc') {
      dbSort = { createdAt: -1 }; // price sort done after price calculation below
    } else if (sort === 'bestseller') {
      dbSort = { createdAt: -1 }; // badge sort done after price calculation below
    }

    const products = await Product.find(dbQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(dbSort);

    const total = await Product.countDocuments(dbQuery);

    // Get gold rates for price calculation
    const goldRates = await getCurrentGoldRates(GoldRate);

    // Calculate prices for each product
    let productsWithPrices = await Promise.all(
      products.map(async (product) => {
        const priceDetails = await calculateProductPrice(product, goldRates);
        return {
          ...product.toObject(),
          price: priceDetails.total,
          priceDetails
        };
      })
    );

    // Client-side sorting on computed price/badges
    if (sort === 'price_asc') {
      productsWithPrices = productsWithPrices.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'price_desc') {
      productsWithPrices = productsWithPrices.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === 'bestseller') {
      productsWithPrices = productsWithPrices.sort((a, b) => {
        const aBest = a.badges?.includes('Bestseller') ? 1 : 0;
        const bBest = b.badges?.includes('Bestseller') ? 1 : 0;
        if (aBest !== bBest) return bBest - aBest;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    res.json({
      success: true,
      products: productsWithPrices,
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

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get gold rates and calculate price
    const goldRates = await getCurrentGoldRates(GoldRate);
    const priceDetails = await calculateProductPrice(product, goldRates);

    res.json({
      success: true,
      product: {
        ...product.toObject(),
        price: priceDetails.total,
        priceDetails
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/barcode/:productId
// @desc    Get product by productId (for QR/barcode scanning)
// @access  Public
router.get('/barcode/:productId', async (req, res, next) => {
  try {
    const product = await Product.findOne({ 
      productId: req.params.productId,
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const goldRates = await getCurrentGoldRates(GoldRate);
    const priceDetails = await calculateProductPrice(product, goldRates);

    res.json({
      success: true,
      product: {
        ...product.toObject(),
        price: priceDetails.total,
        priceDetails
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin', 'staff'), async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      images: req.body.images || []
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product ID already exists' });
    }
    next(error);
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin', 'staff'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin', 'staff'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;

