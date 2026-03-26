import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productId: String, // Store productId for reference
  name: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  weight: Number,
  purity: String,
  metal: String,
  goldRate: Number, // Gold rate at time of order
  makingCharges: Number,
  makingChargesType: String,
  unitPrice: Number,
  totalPrice: Number
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  gst: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'sample', 'cod', 'other'],
    default: 'other'
  },
  paymentId: String,       // Razorpay payment_id after success
  razorpayOrderId: String, // Razorpay order_id
  notes: String,
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

// Generate order number before validation so `required` passes
orderSchema.pre('validate', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `ORD-${timestamp}-${randomNum}`;
  }
  next();
});

// Keep updatedAt in sync
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

