import express from 'express';
import GoldRate from '../models/GoldRate.js';
import { getCurrentGoldRates, fetchGoldRateFromAPI, updateGoldRatesDaily } from '../utils/goldRateService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/gold-rate
// @desc    Get current gold rates
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    let rates = await getCurrentGoldRates(GoldRate);
    let lastUpdated = null;
    
    // Get the most recent update date
    if (rates && Object.keys(rates).length > 0) {
      const latestRate = await GoldRate.findOne({ isActive: true })
        .sort({ date: -1 })
        .limit(1);
      if (latestRate) {
        lastUpdated = latestRate.date;
      }
    }
    
    // If no rates in database, return default rates
    if (!rates || Object.keys(rates).length === 0) {
      rates = {
        '22K': 6500,
        '18K': 5317,
        '14K': 4134,
        '24K': 7091
      };
    }
    
    res.json({
      success: true,
      rates,
      lastUpdated: lastUpdated || new Date(),
      date: new Date()
    });
  } catch (error) {
    console.error('Error in gold-rate route:', error);
    // Return default rates even on error
    res.json({
      success: true,
      rates: {
        '22K': 6500,
        '18K': 5317,
        '14K': 4134,
        '24K': 7091
      },
      lastUpdated: new Date(),
      date: new Date()
    });
  }
});

// @route   POST /api/gold-rate/update
// @desc    Update gold rates (Admin/Staff only)
// @access  Private/Admin
router.post('/update', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { rates, source = 'manual' } = req.body;

    // Deactivate old rates
    await GoldRate.updateMany({ isActive: true }, { isActive: false });

    // Create new rates
    const newRates = [];
    for (const [purity, ratePerGram] of Object.entries(rates)) {
      if (['22K', '18K', '14K', '24K'].includes(purity)) {
        const goldRate = await GoldRate.create({
          purity,
          ratePerGram,
          source,
          isActive: true
        });
        newRates.push(goldRate);
      }
    }

    res.json({
      success: true,
      message: 'Gold rates updated successfully',
      rates: newRates
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/gold-rate/fetch-api
// @desc    Fetch gold rates from API and update (Admin only)
// @access  Private/Admin
router.post('/fetch-api', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Fetch from API
    const apiRates = await fetchGoldRateFromAPI();

    // Deactivate old rates
    await GoldRate.updateMany({ isActive: true }, { isActive: false });

    // Create new rates
    const newRates = [];
    for (const [purity, ratePerGram] of Object.entries(apiRates)) {
      const goldRate = await GoldRate.create({
        purity,
        ratePerGram,
        source: 'api',
        isActive: true
      });
      newRates.push(goldRate);
    }

    res.json({
      success: true,
      message: 'Gold rates fetched and updated successfully',
      rates: newRates
    });
  } catch (error) {
    next(error) ;
  }
});

// @route   POST /api/gold-rate/auto-update
// @desc    Trigger automatic daily update (checks if already updated today)
// @access  Private/Admin
router.post('/auto-update', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await updateGoldRatesDaily(GoldRate);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        rates: result.rates,
        timestamp: result.timestamp,
        skipped: result.skipped || false
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || 'Failed to update gold rates',
        error: result.error?.message
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;

