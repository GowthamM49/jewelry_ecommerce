import express from 'express';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { calculateProductPrice } from '../utils/priceCalculator.js';
import { getCurrentGoldRates } from '../utils/goldRateService.js';
import GoldRate from '../models/GoldRate.js';

const router = express.Router();
router.use(protect);

// GET /api/wishlist
router.get('/', async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('items.product');

    if (!wishlist) return res.json({ success: true, items: [] });

    const goldRates = await getCurrentGoldRates(GoldRate);
    const items = await Promise.all(
      wishlist.items
        .filter(i => i.product && i.product.isActive)
        .map(async (i) => {
          const priceDetails = await calculateProductPrice(i.product, goldRates);
          return {
            _id: i.product._id,
            productId: i.product.productId,
            name: i.product.name,
            category: i.product.category,
            metal: i.product.metal,
            purity: i.product.purity,
            weight: i.product.weight,
            price: priceDetails.total,
            images: i.product.images,
            badges: i.product.badges,
            addedAt: i.addedAt
          };
        })
    );

    res.json({ success: true, items });
  } catch (error) { next(error); }
});

// POST /api/wishlist/:productId — toggle (add if not present, remove if present)
router.post('/:productId', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    const exists = wishlist.items.find(
      i => i.product.toString() === req.params.productId
    );

    if (exists) {
      wishlist.items = wishlist.items.filter(
        i => i.product.toString() !== req.params.productId
      );
      await wishlist.save();
      return res.json({ success: true, action: 'removed' });
    } else {
      wishlist.items.push({ product: product._id });
      await wishlist.save();
      return res.json({ success: true, action: 'added' });
    }
  } catch (error) { next(error); }
});

// DELETE /api/wishlist/:productId
router.delete('/:productId', async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.json({ success: true });
    wishlist.items = wishlist.items.filter(
      i => i.product.toString() !== req.params.productId
    );
    await wishlist.save();
    res.json({ success: true });
  } catch (error) { next(error); }
});

export default router;
