import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { calculateProductPrice } from '../utils/priceCalculator.js';
import { getCurrentGoldRates } from '../utils/goldRateService.js';
import GoldRate from '../models/GoldRate.js';

const router = express.Router();

// All cart routes require auth
router.use(protect);

// GET /api/cart - get current user's cart
router.get('/', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.json({ success: true, cart: { user: req.user._id, items: [] } });
    }

    const goldRates = await getCurrentGoldRates(GoldRate);
    const items = await Promise.all(
      cart.items.map(async (i) => {
        const product = i.product;
        if (!product) return i;
        const priceDetails = await calculateProductPrice(product, goldRates);
        return {
          ...i.toObject(),
          product: {
            ...product.toObject(),
            price: priceDetails.total,
            priceDetails
          }
        };
      })
    );

    res.json({ success: true, cart: { ...cart.toObject(), items } });
  } catch (error) {
    next(error);
  }
});

// PUT /api/cart - replace entire cart (merge-friendly)
router.put('/', async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'items must be an array' });
    }

    // Validate all items and normalize
    const normalized = [];
    for (const item of items) {
      if (!item?.productId || !item?.quantity) {
        return res.status(400).json({ message: 'Each item must include productId and quantity' });
      }
      const qty = Number(item.quantity);
      if (!Number.isFinite(qty) || qty < 1) {
        return res.status(400).json({ message: 'Quantity must be >= 1' });
      }
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: 'Invalid product in cart' });
      }
      normalized.push({ product: product._id, quantity: qty });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: normalized } },
      { new: true, upsert: true }
    ).populate('items.product');

    // Reuse GET response shape (with computed prices)
    const goldRates = await getCurrentGoldRates(GoldRate);
    const itemsWithPrices = await Promise.all(
      cart.items.map(async (i) => {
        const product = i.product;
        if (!product) return i;
        const priceDetails = await calculateProductPrice(product, goldRates);
        return {
          ...i.toObject(),
          product: {
            ...product.toObject(),
            price: priceDetails.total,
            priceDetails
          }
        };
      })
    );
    res.json({ success: true, cart: { ...cart.toObject(), items: itemsWithPrices } });
  } catch (error) {
    next(error);
  }
});

// POST /api/cart/items - add or increment one item
router.post('/items', async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = Number(quantity);
    if (!productId || !Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({ message: 'productId and quantity (>=1) are required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      const created = await Cart.create({
        user: req.user._id,
        items: [{ product: product._id, quantity: qty }]
      });
      const populated = await created.populate('items.product');
      const goldRates = await getCurrentGoldRates(GoldRate);
      const itemsWithPrices = await Promise.all(
        populated.items.map(async (i) => {
          const p = i.product;
          const priceDetails = await calculateProductPrice(p, goldRates);
          return {
            ...i.toObject(),
            product: { ...p.toObject(), price: priceDetails.total, priceDetails }
          };
        })
      );
      return res.status(201).json({ success: true, cart: { ...populated.toObject(), items: itemsWithPrices } });
    }

    const existing = cart.items.find(i => i.product.toString() === product._id.toString());
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({ product: product._id, quantity: qty });
    }
    await cart.save();
    const populated = await cart.populate('items.product');
    const goldRates = await getCurrentGoldRates(GoldRate);
    const itemsWithPrices = await Promise.all(
      populated.items.map(async (i) => {
        const p = i.product;
        const priceDetails = await calculateProductPrice(p, goldRates);
        return {
          ...i.toObject(),
          product: { ...p.toObject(), price: priceDetails.total, priceDetails }
        };
      })
    );
    res.json({ success: true, cart: { ...populated.toObject(), items: itemsWithPrices } });
  } catch (error) {
    next(error);
  }
});

// PUT /api/cart/items/:productId - set quantity
router.put('/items/:productId', async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({ message: 'quantity must be >= 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(i => i.product.toString() === req.params.productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = qty;
    await cart.save();
    const populated = await cart.populate('items.product');
    const goldRates = await getCurrentGoldRates(GoldRate);
    const itemsWithPrices = await Promise.all(
      populated.items.map(async (i) => {
        const p = i.product;
        const priceDetails = await calculateProductPrice(p, goldRates);
        return {
          ...i.toObject(),
          product: { ...p.toObject(), price: priceDetails.total, priceDetails }
        };
      })
    );
    res.json({ success: true, cart: { ...populated.toObject(), items: itemsWithPrices } });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/items/:productId - remove one item
router.delete('/items/:productId', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.json({ success: true, cart: { user: req.user._id, items: [] } });
    }

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    const populated = await cart.populate('items.product');
    const goldRates = await getCurrentGoldRates(GoldRate);
    const itemsWithPrices = await Promise.all(
      populated.items.map(async (i) => {
        const p = i.product;
        const priceDetails = await calculateProductPrice(p, goldRates);
        return {
          ...i.toObject(),
          product: { ...p.toObject(), price: priceDetails.total, priceDetails }
        };
      })
    );
    res.json({ success: true, cart: { ...populated.toObject(), items: itemsWithPrices } });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart - clear cart
router.delete('/', async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } },
      { new: true, upsert: true }
    ).populate('items.product');
    res.json({ success: true, cart: cart.toObject() });
  } catch (error) {
    next(error);
  }
});

export default router;

