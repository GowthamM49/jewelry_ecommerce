/**
 * Calculate product price based on gold rate, weight, making charges, and GST
 */

export const calculateProductPrice = async (product, goldRate, gstRate = 3) => {
  let basePrice = 0;
  
  // Calculate base price based on metal type
  if (product.metal === 'Gold' && product.purity !== 'NA') {
    // Get gold rate for the specific purity
    const rate = goldRate[product.purity] || goldRate['22K'] || 0;
    basePrice = product.weight * rate;
  } else if (product.metal === 'Silver' && product.purity !== 'NA') {
    // Use Silver rate from DB (passed in goldRate map as 'Silver' key)
    const silverRate = goldRate['Silver'] || goldRate['925'] || 96; // fallback ₹96/g
    basePrice = product.weight * silverRate;
  } else if (product.metal === 'Platinum' && product.purity !== 'NA') {
    // Platinum rate (mock)
    const platinumRate = 3500; // per gram
    basePrice = product.weight * platinumRate;
  } else {
    // For diamond or fixed price items
    basePrice = product.fixedPrice || 0;
  }

  // Calculate making charges
  let makingCharges = 0;
  if (product.makingChargesType === 'percentage') {
    makingCharges = (basePrice * product.makingCharges) / 100;
  } else {
    makingCharges = product.makingCharges;
  }

  // Subtotal
  const subtotal = basePrice + makingCharges;

  // Calculate GST
  const gst = (subtotal * gstRate) / 100;

  // Total price
  const total = subtotal + gst;

  return {
    basePrice: Math.round(basePrice * 100) / 100,
    makingCharges: Math.round(makingCharges * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    total: Math.round(total * 100) / 100,
    gstRate
  };
};

export const calculateOrderTotal = (items) => {
  // totalPrice per item already includes GST (from calculateProductPrice)
  // So order total = sum of all item totalPrices
  const total = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  // Back-calculate subtotal and gst for display purposes (3% GST)
  const subtotal = Math.round((total / 1.03) * 100) / 100;
  const gst = Math.round((total - subtotal) * 100) / 100;

  return {
    subtotal,
    gst,
    total: Math.round(total * 100) / 100
  };
};

