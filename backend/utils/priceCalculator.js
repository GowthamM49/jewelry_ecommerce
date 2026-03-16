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
    // Silver rate (mock - in production, fetch from API)
    const silverRate = 80; // per gram
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
  const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const gst = items.reduce((sum, item) => {
    const itemGst = (item.totalPrice * 3) / 100; // 3% GST
    return sum + itemGst;
  }, 0);
  const total = subtotal + gst;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

