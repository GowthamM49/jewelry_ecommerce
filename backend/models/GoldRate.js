import mongoose from 'mongoose';

const goldRateSchema = new mongoose.Schema({
  purity: {
    type: String,
    required: true,
    enum: ['22K', '18K', '14K', '24K']
  },
  ratePerGram: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  source: {
    type: String,
    default: 'manual' // 'manual' or 'api'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for active rates
goldRateSchema.index({ purity: 1, isActive: 1, date: -1 });

const GoldRate = mongoose.model('GoldRate', goldRateSchema);

export default GoldRate;

