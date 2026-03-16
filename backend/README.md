# Backend API Documentation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jewelry_ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id_here
```

3. Start server:
```bash
npm run dev
```

## API Documentation

See main README.md for complete API endpoint documentation.

## Models

### Product
- `productId`: Unique identifier (auto-generated)
- `name`: Product name
- `description`: Product description
- `category`: Rings, Necklaces, Earrings, etc.
- `metal`: Gold, Silver, Platinum, Diamond
- `purity`: 22K, 18K, 14K, 24K, 925, 999, NA
- `weight`: Weight in grams
- `makingCharges`: Making charges amount
- `makingChargesType`: 'percentage' or 'fixed'
- `images`: Array of image objects
- `stock`: Available stock quantity

### User
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password (optional if using Google OAuth)
- `googleId`: Google OAuth ID (optional, for Google sign-in users)
- `role`: 'customer', 'staff', or 'admin'
- `phone`: Phone number
- `address`: Address object

### Order
- `orderNumber`: Unique order number (auto-generated)
- `user`: Reference to User
- `items`: Array of order items
- `subtotal`: Subtotal amount
- `gst`: GST amount
- `total`: Total amount
- `status`: Order status
- `paymentStatus`: Payment status
- `shippingAddress`: Shipping address

### GoldRate
- `purity`: 22K, 18K, 14K, 24K
- `ratePerGram`: Rate per gram
- `date`: Date of rate
- `source`: 'manual' or 'api'
- `isActive`: Active status

