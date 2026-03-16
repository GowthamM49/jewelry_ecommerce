/**
 * Seed script to create initial admin user and sample products
 * Run with: node scripts/seedData.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import GoldRate from '../models/GoldRate.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelry_ecommerce');
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@sudhajewelry.com' });
    if (!adminExists) {
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@sudhajewelry.com',
        password: 'admin123',
        role: 'admin',
        phone: '+91-1234567890'
      });
      console.log('Admin user created:', admin.email);
    } else {
      console.log('Admin user already exists');
    }

    // Create sample gold rates
    const rates = [
      { purity: '22K', ratePerGram: 6500, isActive: true },
      { purity: '18K', ratePerGram: 5317, isActive: true },
      { purity: '14K', ratePerGram: 4134, isActive: true },
      { purity: '24K', ratePerGram: 7091, isActive: true }
    ];

    await GoldRate.deleteMany({});
    await GoldRate.insertMany(rates);
    console.log('Gold rates created');

    // Clear existing products to ensure clean slate with new diverse data
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Create sample products
    const products = [
      // RINGS
      {
        name: 'Classic Gold Band',
        description: 'Simple and elegant 22K gold band, perfect for daily wear.',
        category: 'Rings',
        metal: 'Gold',
        purity: '22K',
        weight: 4.5,
        makingCharges: 10,
        makingChargesType: 'percentage',
        stock: 20,
        occasion: 'Daily Wear',
        style: 'Minimal',
        images: [{ url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500', alt: 'Gold Band' }]
      },
      {
        name: 'Diamond Solitaire Ring',
        description: 'Stunning solitaire diamond ring set in 18K gold.',
        category: 'Rings',
        metal: 'Gold',
        purity: '18K',
        weight: 3.2,
        makingCharges: 15,
        makingChargesType: 'percentage',
        stock: 5,
        occasion: 'Bridal',
        style: 'Statement',
        badges: ['Bestseller'],
        images: [{ url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500', alt: 'Diamond Ring' }]
      },
      {
        name: 'Platinum Couple Band',
        description: 'Matching platinum bands for him and her.',
        category: 'Rings',
        metal: 'Platinum',
        purity: '925',
        weight: 8.5,
        makingCharges: 20,
        makingChargesType: 'percentage',
        stock: 8,
        occasion: 'Bridal',
        style: 'Contemporary',
        images: [{ url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500', alt: 'Platinum Rings' }]
      },
      {
        name: 'Twisted Rope Ring',
        description: 'Delicate twisted rope design ring for everyday elegance.',
        category: 'Rings',
        metal: 'Gold',
        purity: '18K',
        weight: 2.8,
        makingCharges: 9,
        makingChargesType: 'percentage',
        stock: 18,
        occasion: 'Daily Wear',
        style: 'Contemporary',
        images: [{ url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500', alt: 'Twisted Rope Ring' }]
      },
      {
        name: 'Vintage Floral Ring',
        description: 'Floral inspired vintage ring with intricate filigree work.',
        category: 'Rings',
        metal: 'Gold',
        purity: '22K',
        weight: 5.1,
        makingCharges: 17,
        makingChargesType: 'percentage',
        stock: 9,
        occasion: 'Festive',
        style: 'Heritage',
        images: [{ url: 'https://images.unsplash.com/photo-1521376278375-f34e7da7b1b0?w=500', alt: 'Vintage Floral Ring' }]
      },

      // NECKLACES
      {
        name: 'Traditional Gold Choker',
        description: 'Intricate traditional gold choker with temple design.',
        category: 'Necklaces',
        metal: 'Gold',
        purity: '22K',
        weight: 25.0,
        makingCharges: 18,
        makingChargesType: 'percentage',
        stock: 3,
        occasion: 'Bridal',
        style: 'Traditional',
        collectionName: 'Temple Collection',
        images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', alt: 'Gold Choker' }]
      },
      {
        name: 'Diamond Pendant Necklace',
        description: 'Delicate chain with a sparkling diamond pendant.',
        category: 'Necklaces',
        metal: 'Diamond',
        purity: '18K',
        weight: 6.5,
        makingCharges: 15,
        makingChargesType: 'percentage',
        stock: 12,
        occasion: 'Party',
        style: 'Contemporary',
        images: [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500', alt: 'Diamond Necklace' }]
      },
      {
        name: 'Silver Oxidized Necklace',
        description: 'Boho style oxidized silver necklace for casual wear.',
        category: 'Necklaces',
        metal: 'Silver',
        purity: '925',
        weight: 15.0,
        makingCharges: 12,
        makingChargesType: 'percentage',
        stock: 25,
        occasion: 'Casual',
        style: 'Heritage',
        images: [{ url: 'https://images.unsplash.com/photo-1603561596112-0a132b7223ec?w=500', alt: 'Silver Necklace' }]
      },
      {
        name: 'Layered Pearl Necklace',
        description: 'Three-layer pearl necklace with subtle gold accents.',
        category: 'Necklaces',
        metal: 'Gold',
        purity: '18K',
        weight: 22.0,
        makingCharges: 16,
        makingChargesType: 'percentage',
        stock: 7,
        occasion: 'Party',
        style: 'Contemporary',
        images: [{ url: 'https://images.unsplash.com/photo-1600093463592-9f61807aef11?w=500', alt: 'Layered Pearl Necklace' }]
      },
      {
        name: 'Minimal Bar Necklace',
        description: 'Sleek bar pendant necklace for modern everyday style.',
        category: 'Necklaces',
        metal: 'Gold',
        purity: '14K',
        weight: 4.0,
        makingCharges: 11,
        makingChargesType: 'percentage',
        stock: 20,
        occasion: 'Office',
        style: 'Minimal',
        images: [{ url: 'https://images.unsplash.com/photo-1543294001-8e79f6c33493?w=500', alt: 'Minimal Bar Necklace' }]
      },
      {
        name: 'Kundan Pearl Necklace',
        description: 'Kundan-style centerpiece with pearl strings for festive wear.',
        category: 'Necklaces',
        metal: 'Gold',
        purity: '22K',
        weight: 28.0,
        makingCharges: 20,
        makingChargesType: 'percentage',
        stock: 6,
        occasion: 'Festive',
        style: 'Traditional',
        images: [{ url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500', alt: 'Kundan Pearl Necklace' }]
      },
      {
        name: 'Infinity Pendant Necklace',
        description: 'Minimal infinity pendant necklace for daily wear.',
        category: 'Necklaces',
        metal: 'Gold',
        purity: '18K',
        weight: 3.6,
        makingCharges: 10,
        makingChargesType: 'percentage',
        stock: 30,
        occasion: 'Daily Wear',
        style: 'Minimal',
        images: [{ url: 'https://images.unsplash.com/photo-1600721391689-2564bb8055de?w=500', alt: 'Infinity Pendant Necklace' }]
      },
      {
        name: 'Silver Coin Necklace',
        description: 'Heritage-inspired silver coin necklace with oxidized finish.',
        category: 'Necklaces',
        metal: 'Silver',
        purity: '925',
        weight: 26.0,
        makingCharges: 14,
        makingChargesType: 'percentage',
        stock: 12,
        occasion: 'Festive',
        style: 'Heritage',
        images: [{ url: 'https://images.unsplash.com/photo-1617038260897-1a9f8f954965?w=500', alt: 'Silver Coin Necklace' }]
      },
      {
        name: 'Emerald Drop Necklace',
        description: 'Statement necklace with emerald drop charm and fine gold chain.',
        category: 'Necklaces',
        metal: 'Gold',
        purity: '18K',
        weight: 7.4,
        makingCharges: 15,
        makingChargesType: 'percentage',
        stock: 10,
        occasion: 'Party',
        style: 'Statement',
        images: [{ url: 'https://images.unsplash.com/photo-1602752250015-52934bc45613?w=500', alt: 'Emerald Drop Necklace' }]
      },

      // EARRINGS
      {
        name: 'Gold Jhumkas',
        description: 'Classic gold jhumkas with ruby embellishments.',
        category: 'Earrings',
        metal: 'Gold',
        purity: '22K',
        weight: 12.0,
        makingCharges: 14,
        makingChargesType: 'percentage',
        stock: 15,
        occasion: 'Festive',
        style: 'Traditional',
        images: [{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', alt: 'Gold Jhumkas' }]
      },
      {
        name: 'Diamond Studs',
        description: 'Elegant diamond studs suitable for office wear.',
        category: 'Earrings',
        metal: 'Diamond',
        purity: '18K',
        weight: 2.5,
        makingCharges: 10,
        makingChargesType: 'percentage',
        stock: 20,
        occasion: 'Office',
        style: 'Minimal',
        images: [{ url: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=500', alt: 'Diamond Studs' }]
      },
      {
        name: 'Silver Hoop Earrings',
        description: 'Large silver hoops, a timeless fashion statement.',
        category: 'Earrings',
        metal: 'Silver',
        purity: '925',
        weight: 8.0,
        makingCharges: 8,
        makingChargesType: 'percentage',
        stock: 30,
        occasion: 'Party',
        style: 'Contemporary',
        images: [{ url: 'https://images.unsplash.com/photo-1635767798638-3e2523422dc7?w=500', alt: 'Silver Hoops' }]
      },
      {
        name: 'Pearl Drop Earrings',
        description: 'Elegant pearl drops suspended from delicate gold hooks.',
        category: 'Earrings',
        metal: 'Gold',
        purity: '18K',
        weight: 4.2,
        makingCharges: 13,
        makingChargesType: 'percentage',
        stock: 16,
        occasion: 'Party',
        style: 'Contemporary',
        images: [{ url: 'https://images.unsplash.com/photo-1617038260897-41a1b960c07e?w=500', alt: 'Pearl Drop Earrings' }]
      },
      {
        name: 'Geometric Stud Earrings',
        description: 'Trendy geometric studs in brushed silver finish.',
        category: 'Earrings',
        metal: 'Silver',
        purity: '925',
        weight: 3.0,
        makingCharges: 7,
        makingChargesType: 'percentage',
        stock: 24,
        occasion: 'Daily Wear',
        style: 'Contemporary',
        images: [{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', alt: 'Geometric Stud Earrings' }]
      },
      {
        name: 'Temple Stud Earrings',
        description: 'Traditional temple-styled studs for festive and bridal looks.',
        category: 'Earrings',
        metal: 'Gold',
        purity: '22K',
        weight: 6.8,
        makingCharges: 15,
        makingChargesType: 'percentage',
        stock: 12,
        occasion: 'Festive',
        style: 'Traditional',
        badges: ['Bestseller'],
        images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', alt: 'Temple Stud Earrings' }]
      },
      {
        name: 'Minimal Hoop Earrings',
        description: 'Lightweight minimal hoops for everyday office wear.',
        category: 'Earrings',
        metal: 'Gold',
        purity: '18K',
        weight: 3.4,
        makingCharges: 10,
        makingChargesType: 'percentage',
        stock: 28,
        occasion: 'Office',
        style: 'Minimal',
        images: [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500', alt: 'Minimal Hoop Earrings' }]
      },
      {
        name: 'Emerald Drop Earrings',
        description: 'Statement emerald drop earrings with a refined finish.',
        category: 'Earrings',
        metal: 'Gold',
        purity: '18K',
        weight: 5.0,
        makingCharges: 14,
        makingChargesType: 'percentage',
        stock: 10,
        occasion: 'Party',
        style: 'Statement',
        images: [{ url: 'https://images.unsplash.com/photo-1602752250015-52934bc45613?w=500', alt: 'Emerald Drop Earrings' }]
      },
      {
        name: 'Silver Oxidized Jhumki',
        description: 'Heritage oxidized jhumki earrings in 925 silver.',
        category: 'Earrings',
        metal: 'Silver',
        purity: '925',
        weight: 9.0,
        makingCharges: 10,
        makingChargesType: 'percentage',
        stock: 18,
        occasion: 'Festive',
        style: 'Heritage',
        images: [{ url: 'https://images.unsplash.com/photo-1603561596112-0a132b7223ec?w=500', alt: 'Silver Oxidized Jhumki' }]
      },
      {
        name: 'Pearl Stud Earrings',
        description: 'Classic pearl studs—simple, elegant, and timeless.',
        category: 'Earrings',
        metal: 'Gold',
        purity: '14K',
        weight: 2.2,
        makingCharges: 9,
        makingChargesType: 'percentage',
        stock: 35,
        occasion: 'Daily Wear',
        style: 'Minimal',
        badges: ['New'],
        images: [{ url: 'https://images.unsplash.com/photo-1600093463592-9f61807aef11?w=500', alt: 'Pearl Stud Earrings' }]
      },

      // BANGLES & BRACELETS
      {
        name: 'Antique Gold Bangle',
        description: 'Heavy antique finish gold bangle with intricate carvings.',
        category: 'Bangles',
        metal: 'Gold',
        purity: '22K',
        weight: 35.0,
        makingCharges: 16,
        makingChargesType: 'percentage',
        stock: 4,
        occasion: 'Bridal',
        style: 'Heritage',
        collectionName: 'Antique Collection',
        images: [{ url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', alt: 'Gold Bangle' }]
      },
      {
        name: 'Sleek Diamond Bracelet',
        description: 'Tennis bracelet style with cubic zirconia.',
        category: 'Bracelets',
        metal: 'Silver',
        purity: '925',
        weight: 10.0,
        makingCharges: 12,
        makingChargesType: 'percentage',
        stock: 10,
        occasion: 'Party',
        style: 'Statement',
        images: [{ url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500', alt: 'Diamond Bracelet' }]
      },
      {
        name: 'Rose Gold Chain Bracelet',
        description: 'Trendy rose gold chain bracelet.',
        category: 'Bracelets',
        metal: 'Gold',
        purity: '18K',
        weight: 6.0,
        makingCharges: 12,
        makingChargesType: 'percentage',
        stock: 12,
        occasion: 'Casual',
        style: 'Minimal',
        images: [{ url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500', alt: 'Rose Gold Bracelet' }]
      },
      {
        name: 'Textured Gold Kada',
        description: 'Bold textured kada bangle ideal for festive occasions.',
        category: 'Bangles',
        metal: 'Gold',
        purity: '22K',
        weight: 40.0,
        makingCharges: 19,
        makingChargesType: 'percentage',
        stock: 5,
        occasion: 'Festive',
        style: 'Statement',
        collectionName: 'Royal Classics',
        images: [{ url: 'https://images.unsplash.com/photo-1621784563330-e1789e95227b?w=500', alt: 'Textured Gold Kada' }]
      },
      {
        name: 'Charm Bracelet',
        description: 'Playful charm bracelet with multiple gold motifs.',
        category: 'Bracelets',
        metal: 'Gold',
        purity: '18K',
        weight: 9.5,
        makingCharges: 14,
        makingChargesType: 'percentage',
        stock: 14,
        occasion: 'Casual',
        style: 'Contemporary',
        images: [{ url: 'https://images.unsplash.com/photo-1609250291996-3e8c61c3a3ca?w=500', alt: 'Charm Bracelet' }]
      },

      // PENDANTS & CHAINS
      {
        name: 'Om Pendant',
        description: 'Spiritual Om pendant in 22K gold.',
        category: 'Pendants',
        metal: 'Gold',
        purity: '22K',
        weight: 3.0,
        makingCharges: 10,
        makingChargesType: 'percentage',
        stock: 25,
        occasion: 'Daily Wear',
        style: 'Traditional',
        images: [{ url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500', alt: 'Om Pendant' }]
      },
      {
        name: 'Thick Gold Chain',
        description: 'Sturdy classic link chain for men.',
        category: 'Chains',
        metal: 'Gold',
        purity: '22K',
        weight: 30.0,
        makingCharges: 8,
        makingChargesType: 'percentage',
        stock: 6,
        occasion: 'Daily Wear',
        style: 'Traditional',
        collectionName: "Men's Collection",
        images: [{ url: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500', alt: 'Gold Chain' }]
      },
      {
        name: 'Heart Locket Pendant',
        description: 'Romantic heart-shaped locket with space for tiny photos.',
        category: 'Pendants',
        metal: 'Gold',
        purity: '18K',
        weight: 3.8,
        makingCharges: 11,
        makingChargesType: 'percentage',
        stock: 22,
        occasion: 'NA',
        style: 'Contemporary',
        images: [{ url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500', alt: 'Heart Locket Pendant' }]
      },
      {
        name: 'Box Link Chain',
        description: 'Strong and stylish box-link chain suitable for pendants.',
        category: 'Chains',
        metal: 'Gold',
        purity: '18K',
        weight: 18.0,
        makingCharges: 9,
        makingChargesType: 'percentage',
        stock: 11,
        occasion: 'Daily Wear',
        style: 'Contemporary',
        images: [{ url: 'https://images.unsplash.com/photo-1543294001-8e79f6c33493?w=500', alt: 'Box Link Chain' }]
      },
      {
        name: 'Figaro Link Chain',
        description: 'Classic Figaro pattern chain with alternating links for a premium look.',
        category: 'Chains',
        metal: 'Gold',
        purity: '22K',
        weight: 24.0,
        makingCharges: 10,
        makingChargesType: 'percentage',
        stock: 10,
        occasion: 'Daily Wear',
        style: 'Traditional',
        badges: ['Bestseller'],
        images: [{ url: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500', alt: 'Figaro Link Chain' }]
      },
      {
        name: 'Rope Twist Chain',
        description: 'Rope-twist chain that catches light beautifully, ideal for layering.',
        category: 'Chains',
        metal: 'Gold',
        purity: '18K',
        weight: 14.5,
        makingCharges: 9,
        makingChargesType: 'percentage',
        stock: 14,
        occasion: 'Party',
        style: 'Statement',
        images: [{ url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500', alt: 'Rope Twist Chain' }]
      },
      {
        name: 'Curb Chain (Unisex)',
        description: 'Bold curb chain with a clean finish—great for everyday wear.',
        category: 'Chains',
        metal: 'Gold',
        purity: '18K',
        weight: 20.0,
        makingCharges: 8,
        makingChargesType: 'percentage',
        stock: 9,
        occasion: 'Daily Wear',
        style: 'Contemporary',
        images: [{ url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500', alt: 'Curb Chain' }]
      },
      {
        name: 'Singapore Chain',
        description: 'Lightweight Singapore chain with a subtle shimmer for minimal styling.',
        category: 'Chains',
        metal: 'Gold',
        purity: '14K',
        weight: 8.5,
        makingCharges: 11,
        makingChargesType: 'percentage',
        stock: 22,
        occasion: 'Office',
        style: 'Minimal',
        badges: ['New'],
        images: [{ url: 'https://images.unsplash.com/photo-1602752250015-52934bc45613?w=500', alt: 'Singapore Chain' }]
      },
      {
        name: 'Silver Cuban Chain',
        description: 'Chunky Cuban link chain in 925 silver with a modern street-style vibe.',
        category: 'Chains',
        metal: 'Silver',
        purity: '925',
        weight: 32.0,
        makingCharges: 12,
        makingChargesType: 'percentage',
        stock: 16,
        occasion: 'Casual',
        style: 'Statement',
        images: [{ url: 'https://images.unsplash.com/photo-1617038260897-41a1b960c07e?w=500', alt: 'Silver Cuban Chain' }]
      },

      // SETS
      {
        name: 'Bridal Jewellery Set',
        description: 'Complete bridal set with necklace, earrings, and maang tikka.',
        category: 'Sets',
        metal: 'Gold',
        purity: '22K',
        weight: 85.0,
        makingCharges: 22,
        makingChargesType: 'percentage',
        stock: 2,
        occasion: 'Bridal',
        style: 'Traditional',
        badges: ['New', 'Made to Order'],
        collectionName: 'Bridal Collection',
        images: [{ url: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=500', alt: 'Bridal Set' }]
      },
      {
        name: 'Temple Motif Set',
        description: 'Necklace and earrings set inspired by South Indian temple art.',
        category: 'Sets',
        metal: 'Gold',
        purity: '22K',
        weight: 95.0,
        makingCharges: 24,
        makingChargesType: 'percentage',
        stock: 3,
        occasion: 'Bridal',
        style: 'Heritage',
        collectionName: 'Temple Collection',
        images: [{ url: 'https://images.unsplash.com/photo-1589307004173-3c95204d00a3?w=500', alt: 'Temple Motif Set' }]
      },
      {
        name: 'Diamond Cocktail Set',
        description: 'Statement diamond necklace and earrings set for evening events.',
        category: 'Sets',
        metal: 'Gold',
        purity: '18K',
        weight: 60.0,
        makingCharges: 21,
        makingChargesType: 'percentage',
        stock: 4,
        occasion: 'Party',
        style: 'Statement',
        badges: ['Limited Edition'],
        images: [{ url: 'https://images.unsplash.com/photo-1516637090014-cb1ab0d08fc7?w=500', alt: 'Diamond Cocktail Set' }]
      },

      // MANGALSUTRA (Mapped to Necklaces or Sets generally, but let's check schema. Schema has fixed categories. 
      // 'Mangalsutra' is NOT in the enum in Product.js: ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Pendants', 'Chains', 'Sets']
      // So we will categorize it to 'Necklaces' or 'Chains' and maybe add a tag or collection name if needed.
      {
        name: 'Traditional Mangalsutra',
        description: 'Black bead gold mangalsutra.',
        category: 'Necklaces',
        metal: 'Gold',
        purity: '22K',
        weight: 15.0,
        makingCharges: 12,
        makingChargesType: 'percentage',
        stock: 10,
        occasion: 'Daily Wear',
        style: 'Traditional',
        collectionName: 'Mangalsutras',
        images: [{ url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500', alt: 'Mangalsutra' }]
      }
    ];

    // Helper to generate productId
    const generateProductId = (category, metal) => {
      const categoryCode = category.substring(0, 3).toUpperCase();
      const metalCode = metal.substring(0, 2).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `${categoryCode}-${metalCode}-${randomNum}`;
    };

    // Use loop to trigger pre('save') middleware (optional now) but mainly to add IDs
    for (const productData of products) {
      if (!productData.productId) {
        productData.productId = generateProductId(productData.category, productData.metal);
      }
      const product = new Product(productData);
      await product.save();
    }
    console.log(`Created ${products.length} sample products`);

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
};

seedData();


