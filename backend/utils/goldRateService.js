/**
 * Gold Rate Service - Fetches live gold rates for Indian market
 *
 * Method:
 *  1. Fetch XAU/USD spot price from gold-api.com (free, no key)
 *  2. Fetch USD/INR exchange rate from open.er-api.com (free, no key)
 *  3. Convert: (XAU_USD / 31.1035) * USD_INR = spot 24K per gram in INR
 *  4. Apply India import duty (15%) + GST (3%) = 18% → multiply by 1.18
 *
 * This matches Indian market rates (goodreturns.in / Chennai rates).
 */

import https from 'https';

/**
 * Simple HTTPS GET helper — works on all Node versions (no fetch needed)
 */
const httpsGet = (url, headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = { headers };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse JSON response'));
        }
      });
    }).on('error', reject);
  });
};

/**
 * Calculate rates for different karats based on 24K rate
 * Ratios calibrated to match goodreturns.in Indian market rates
 */
const calculateKaratRates = (rate24K) => ({
  '24K': Math.round(rate24K),
  '22K': Math.round(rate24K * 0.9167),
  '18K': Math.round(rate24K * 0.7648),
  '14K': Math.round(rate24K * 0.5850)
});

/**
 * Fetch gold (22K) and silver rates from free public APIs
 * Returns: { '22K': number, 'Silver': number } in INR per gram
 */
export const fetchGoldRateFromAPI = async () => {
  try {
    // Step 1: Get XAU/USD (gold) and XAG/USD (silver) spot prices
    const [goldData, silverData] = await Promise.all([
      httpsGet('https://api.gold-api.com/price/XAU'),
      httpsGet('https://api.gold-api.com/price/XAG')
    ]);
    if (!goldData.price)  throw new Error('gold-api.com returned no gold price');
    if (!silverData.price) throw new Error('gold-api.com returned no silver price');

    const xauUsd = goldData.price;
    const xagUsd = silverData.price;

    // Step 2: Get USD/INR exchange rate
    const fxUrl = process.env.EXCHANGE_RATE_API_KEY
      ? `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`
      : 'https://open.er-api.com/v6/latest/USD';
    const fxData = await httpsGet(fxUrl);
    if (!fxData.rates?.INR) throw new Error('Exchange rate API returned no INR rate');
    const usdInr = fxData.rates.INR;

    // Step 3: Convert to INR per gram (1 troy oz = 31.1035 grams)
    const spot24K = (xauUsd * usdInr) / 31.1035;

    // Step 4: Apply India import duty (15%) + GST (3%) = 18% for gold
    const indiaRate24K = spot24K * 1.18;
    const indiaRate22K = Math.round(indiaRate24K * 0.9167);

    // Silver: import duty 10% + GST 3% = 13%
    const silverSpotPerGram = (xagUsd * usdInr) / 31.1035;
    const indiaSilver = Math.round(silverSpotPerGram * 1.13);

    const rates = {
      '24K': Math.round(indiaRate24K),
      '22K': indiaRate22K,
      '18K': Math.round(indiaRate24K * 0.7648),
      '14K': Math.round(indiaRate24K * 0.5850),
      'Silver': indiaSilver
    };

    console.log(`✅ Rates fetched — 22K: ₹${rates['22K']}/g, Silver: ₹${rates['Silver']}/g`);
    return rates;

  } catch (error) {
    console.error('⚠️  Live rate fetch failed, using fallback:', error.message);
    const fallback24K = 15218;
    return {
      '24K': fallback24K,
      '22K': Math.round(fallback24K * 0.9167),
      '18K': Math.round(fallback24K * 0.7648),
      '14K': Math.round(fallback24K * 0.5850),
      'Silver': 96  // ~₹96/g fallback (goodreturns.in approx)
    };
  }
};

// Remove unused calculateKaratRates — kept only for reference
// const calculateKaratRates = (rate24K) => { ... }

/**
 * Get current active gold rates from database
 */
export const getCurrentGoldRates = async (GoldRate) => {
  try {
    if (!GoldRate) throw new Error('GoldRate model not available');

    // Fetch up to 6 to cover all purities including Silver
    const rates = await GoldRate.find({ isActive: true })
      .sort({ date: -1 })
      .limit(6);

    const rateMap = {};
    if (rates && rates.length > 0) {
      rates.forEach(rate => {
        rateMap[rate.purity] = rate.ratePerGram;
      });
    }
    return rateMap;
  } catch (error) {
    console.error('Error fetching gold rates from database:', error);
    return {};
  }
};

/**
 * Check if gold rates have been updated today
 */
export const hasRatesUpdatedToday = async (GoldRate) => {
  try {
    if (!GoldRate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayRates = await GoldRate.findOne({
      isActive: true,
      date: { $gte: today, $lt: tomorrow }
    });
    return !!todayRates;
  } catch (error) {
    console.error('Error checking if rates updated today:', error);
    return false;
  }
};

/**
 * Automatically update gold rates daily
 * @param {object} options.forceIfManual - if true, fetch from API even if rates were updated today (but only if source is 'manual')
 */
export const updateGoldRatesDaily = async (GoldRate, options = {}) => {
  try {
    if (!GoldRate) {
      return { success: false, message: 'GoldRate model not available' };
    }

    const alreadyUpdated = await hasRatesUpdatedToday(GoldRate);
    if (alreadyUpdated) {
      // If forceIfManual, check if the existing rates are from manual/seed source
      if (options.forceIfManual) {
        const latestRate = await GoldRate.findOne({ isActive: true }).sort({ date: -1 });
        if (latestRate && latestRate.source !== 'manual') {
          console.log('Gold rates already updated today from API. Skipping update.');
          return { success: true, message: 'Rates already updated today', skipped: true };
        }
        console.log('Rates exist but are from manual/seed source — fetching live rates from API...');
      } else {
        console.log('Gold rates already updated today. Skipping update.');
        return { success: true, message: 'Rates already updated today', skipped: true };
      }
    }

    console.log('Fetching latest gold rates from API...');
    const apiRates = await fetchGoldRateFromAPI();

    if (!apiRates || Object.keys(apiRates).length === 0) {
      throw new Error('No rates received from API');
    }

    // Deactivate old rates
    await GoldRate.updateMany({ isActive: true }, { isActive: false });

    // Create new rates (save all including Silver)
    const newRates = [];
    for (const [purity, ratePerGram] of Object.entries(apiRates)) {
      if (['24K', '22K', '18K', '14K', 'Silver'].includes(purity)) {
        const goldRate = await GoldRate.create({
          purity,
          ratePerGram,
          source: 'api',
          isActive: true,
          date: new Date()
        });
        newRates.push(goldRate);
      }
    }

    console.log(`✅ Gold rates updated at ${new Date().toLocaleString()}:`, apiRates);
    return {
      success: true,
      message: 'Gold rates updated successfully',
      rates: newRates,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error updating gold rates:', error);
    return {
      success: false,
      message: error.message || 'Failed to update gold rates',
      error: error
    };
  }
};
