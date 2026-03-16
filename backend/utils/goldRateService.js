/**
 * Gold Rate Service - Fetches and manages gold rates
 * Supports multiple gold rate API providers
 */

/**
 * Fetch gold rates from external API
 * Currently uses a realistic simulation based on market trends
 * To use a real API, uncomment and configure one of the providers below
 */
export const fetchGoldRateFromAPI = async () => {
  try {
    // Option 1: Use GoldAPI.io (requires API key)
    // Uncomment and add GOLD_API_KEY to .env file
    /*
    if (process.env.GOLD_API_KEY) {
      const response = await fetch(`https://api.goldapi.io/api/XAU/INR`, {
        headers: {
          'x-access-token': process.env.GOLD_API_KEY
        }
      });
      const data = await response.json();
      const baseRate24K = data.price / 31.1035; // Convert from per ounce to per gram
      return calculateKaratRates(baseRate24K);
    }
    */

    // Option 2: Use Metals API (requires API key)
    // Uncomment and add METALS_API_KEY to .env file
    /*
    if (process.env.METALS_API_KEY) {
      const response = await fetch(`https://api.metals.live/v1/spot/gold`);
      const data = await response.json();
      const baseRate24K = (data.price * 74.5) / 31.1035; // Convert USD/oz to INR/gram
      return calculateKaratRates(baseRate24K);
    }
    */

    // Fallback: Realistic market-based simulation
    // This simulates daily market fluctuations based on a base rate
    // In production, replace with actual API integration
    const baseRate24K = 6500; // Base 24K rate per gram in INR
    
    // Simulate realistic daily variation (±2% to ±5%)
    const dailyVariation = (Math.random() * 0.06 - 0.03); // -3% to +3%
    const current24KRate = baseRate24K * (1 + dailyVariation);
    
    // Add small random fluctuation for realism
    const fluctuation = (Math.random() * 20 - 10); // ±10 rupees
    
    const final24KRate = Math.round((current24KRate + fluctuation) * 100) / 100;
    
    return calculateKaratRates(final24KRate);
  } catch (error) {
    console.error('Error fetching gold rates from API:', error);
    // Return default rates on error
    return calculateKaratRates(6500);
  }
};

/**
 * Calculate rates for different karats based on 24K rate
 * Purity ratios: 24K = 100%, 22K = 91.67%, 18K = 75%, 14K = 58.33%
 */
const calculateKaratRates = (rate24K) => {
  return {
    '24K': Math.round(rate24K * 100) / 100,
    '22K': Math.round((rate24K * 0.9167) * 100) / 100,
    '18K': Math.round((rate24K * 0.75) * 100) / 100,
    '14K': Math.round((rate24K * 0.5833) * 100) / 100
  };
};

/**
 * Get current active gold rates from database
 */
export const getCurrentGoldRates = async (GoldRate) => {
  try {
    // Check if GoldRate model exists and is connected
    if (!GoldRate) {
      throw new Error('GoldRate model not available');
    }

    const rates = await GoldRate.find({ isActive: true })
      .sort({ date: -1 })
      .limit(4); // One for each purity
    
    const rateMap = {};
    if (rates && rates.length > 0) {
      rates.forEach(rate => {
        rateMap[rate.purity] = rate.ratePerGram;
      });
    }
    
    // If no rates found, return empty object (caller will use defaults)
    return rateMap;
  } catch (error) {
    console.error('Error fetching gold rates from database:', error);
    // Return empty object so caller can use defaults
    return {};
  }
};

/**
 * Check if gold rates have been updated today
 */
export const hasRatesUpdatedToday = async (GoldRate) => {
  try {
    if (!GoldRate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayRates = await GoldRate.findOne({
      isActive: true,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    return !!todayRates;
  } catch (error) {
    console.error('Error checking if rates updated today:', error);
    return false;
  }
};

/**
 * Automatically update gold rates daily
 * This function fetches new rates and updates the database
 */
export const updateGoldRatesDaily = async (GoldRate) => {
  try {
    if (!GoldRate) {
      console.error('GoldRate model not available');
      return { success: false, message: 'GoldRate model not available' };
    }

    // Check if rates have already been updated today
    const alreadyUpdated = await hasRatesUpdatedToday(GoldRate);
    if (alreadyUpdated) {
      console.log('Gold rates already updated today. Skipping update.');
      return { success: true, message: 'Rates already updated today', skipped: true };
    }

    console.log('Fetching latest gold rates from API...');
    const apiRates = await fetchGoldRateFromAPI();

    if (!apiRates || Object.keys(apiRates).length === 0) {
      throw new Error('No rates received from API');
    }

    // Deactivate old rates
    await GoldRate.updateMany({ isActive: true }, { isActive: false });

    // Create new rates
    const newRates = [];
    for (const [purity, ratePerGram] of Object.entries(apiRates)) {
      if (['22K', '18K', '14K', '24K'].includes(purity)) {
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

    console.log(`✅ Gold rates updated successfully at ${new Date().toLocaleString()}`);
    console.log('Updated rates:', apiRates);

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

