import express from 'express';
import GoldRate from '../models/GoldRate.js';
import { getCurrentGoldRates, fetchGoldRateFromAPI, updateGoldRatesDaily } from '../utils/goldRateService.js';
import { protect, authorize } from '../middleware/auth.js';

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
    
    // If no rates in database, return current market defaults
    if (!rates || Object.keys(rates).length === 0) {
      rates = {
        '24K': 15218,
        '22K': 13950,
        '18K': 11640,
        '14K': 8903,
        'Silver': 96
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
        '24K': 15218,
        '22K': 13950,
        '18K': 11640,
        '14K': 8903,
        'Silver': 96
      },
      lastUpdated: new Date(),
      date: new Date()
    });
  }
});

// @route   GET /api/gold-rate/history
// @desc    Get real stored gold rate history from MongoDB
// @access  Public
router.get('/history', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Fetch ALL rate records (active + historical) within the date range
    const records = await GoldRate.find({
      purity: { $in: ['22K', 'Silver'] },
      date: { $gte: since }
    }).sort({ date: 1 });

    // Group by date (YYYY-MM-DD), pick latest record per purity per day
    const byDate = {};
    for (const r of records) {
      const day = r.date.toISOString().split('T')[0];
      if (!byDate[day]) byDate[day] = {};
      byDate[day][r.purity] = r.ratePerGram;
    }

    // Get current active rates to fill today
    const activeRates = await GoldRate.find({ isActive: true, purity: { $in: ['22K', 'Silver'] } });
    const todayKey = new Date().toISOString().split('T')[0];
    if (!byDate[todayKey]) byDate[todayKey] = {};
    activeRates.forEach(r => { byDate[todayKey][r.purity] = r.ratePerGram; });

    // If we have fewer than 2 real data points, fill gaps by carrying forward last known value
    const allDates = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      allDates.push(d.toISOString().split('T')[0]);
    }

    let last22K = null;
    let lastSilver = null;

    // Seed last known values from before the range if available
    const beforeRange = await GoldRate.find({
      purity: { $in: ['22K', 'Silver'] },
      date: { $lt: since }
    }).sort({ date: -1 }).limit(2);
    beforeRange.forEach(r => {
      if (r.purity === '22K' && !last22K) last22K = r.ratePerGram;
      if (r.purity === 'Silver' && !lastSilver) lastSilver = r.ratePerGram;
    });

    const history = allDates.map(dateStr => {
      if (byDate[dateStr]?.['22K']) last22K = byDate[dateStr]['22K'];
      if (byDate[dateStr]?.['Silver']) lastSilver = byDate[dateStr]['Silver'];
      return {
        date: dateStr,
        label: new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        '22K': last22K || null,
        'Silver': lastSilver || null,
      };
    }).filter(d => d['22K'] || d['Silver']);

    res.json({ success: true, history, realData: records.length > 0 });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/gold-rate/rates
// @desc    Get 22K gold + Silver rates — admin override takes priority over API
// @access  Public
router.get('/rates', async (req, res, next) => {
  try {
    // Check for admin-set rates (source = 'manual') first
    const adminRates = await GoldRate.find({ isActive: true, source: 'manual' }).sort({ date: -1 });
    const adminMap = {};
    adminRates.forEach(r => { adminMap[r.purity] = r.ratePerGram; });

    let gold22K = adminMap['22K'] || null;
    let silver  = adminMap['Silver'] || null;
    let source  = 'admin';

    // If no admin override, use API/DB rates
    if (!gold22K || !silver) {
      const dbRates = await getCurrentGoldRates(GoldRate);
      if (!gold22K) { gold22K = dbRates['22K'] || null; source = 'api'; }
      if (!silver)  { silver  = dbRates['Silver'] || null; source = 'api'; }
    }

    // Last resort: fetch live from API
    if (!gold22K || !silver) {
      const live = await fetchGoldRateFromAPI();
      gold22K = gold22K || live['22K'];
      silver  = silver  || live['Silver'];
      source  = 'live';
    }

    const latestRate = await GoldRate.findOne({ isActive: true }).sort({ date: -1 });

    res.json({
      success: true,
      source,
      rates: { '22K': gold22K, Silver: silver },
      lastUpdated: latestRate?.date || new Date()
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/gold-rate/update
// @desc    Update gold rates (Admin/Staff only)
// @access  Private/Admin
router.post('/update', protect, authorize('admin', 'staff'), async (req, res, next) => {
  try {
    const { rates, source = 'manual' } = req.body;

    const puritiesToUpdate = Object.keys(rates).filter(p =>
      ['22K', '18K', '14K', '24K', 'Silver'].includes(p)
    );

    // Mark current active as inactive — they become historical records (NOT deleted)
    await GoldRate.updateMany(
      { isActive: true, purity: { $in: puritiesToUpdate } },
      { isActive: false }
    );

    // Insert new active rate — this is today's data point for the chart
    const newRates = [];
    for (const [purity, ratePerGram] of Object.entries(rates)) {
      if (puritiesToUpdate.includes(purity) && ratePerGram) {
        const goldRate = await GoldRate.create({
          purity,
          ratePerGram: Number(ratePerGram),
          source,
          isActive: true,
          date: new Date()
        });
        newRates.push(goldRate);
      }
    }

    res.json({ success: true, message: 'Rates updated successfully', rates: newRates });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/gold-rate/fetch-api
// @desc    Fetch gold rates from API and update (Admin only)
// @access  Private/Admin
router.post('/fetch-api', protect, authorize('admin'), async (req, res, next) => {
  try {
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
router.post('/auto-update', protect, authorize('admin'), async (req, res, next) => {
  try {
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

