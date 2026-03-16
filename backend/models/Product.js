import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    index: true // For QR/barcode scanning
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Pendants', 'Chains', 'Sets']
  },
  metal: {
    type: String,
    required: true,
    enum: ['Gold', 'Silver', 'Platinum', 'Diamond']
  },
  purity: {
    type: String,
    required: true,
    enum: ['22K', '18K', '14K', '24K', '925', '999', 'NA'] // NA for non-metal items
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  weightUnit: {
    type: String,
    enum: ['grams', 'carats'],
    default: 'grams'
  },
  makingCharges: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  makingChargesType: {
    type: String,
    enum: ['fixed', 'percentage'],
    default: 'percentage'
  },
  occasion: {
    type: String,
    enum: ['Bridal', 'Daily Wear', 'Festive', 'Office', 'Party', 'Casual', 'NA'],
    default: 'NA'
  },
  style: {
    type: String,
    enum: ['Traditional', 'Minimal', 'Contemporary', 'Heritage', 'Statement', 'NA'],
    default: 'NA'
  },
  collectionName: {
    type: String,
    trim: true
  },
  warranty: {
    type: String,
    trim: true
  },
  careInstructions: {
    type: String,
    trim: true
  },
  badges: {
    type: [String],
    default: [] // e.g., ['New', 'Bestseller', 'Limited Stock', 'Made to Order']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text', category: 1, metal: 1 });

// Generate product ID before saving
productSchema.pre('save', async function(next) {
  if (!this.productId) {
    const categoryCode = this.category.substring(0, 3).toUpperCase();
    const metalCode = this.metal.substring(0, 2).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.productId = `${categoryCode}-${metalCode}-${randomNum}`;
  }
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;

