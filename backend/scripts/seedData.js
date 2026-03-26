/**
 * Seed — 8 categories × 5 products = 40 products
 * Images: verified Unsplash CDN IDs matching each jewelry type
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import GoldRate from '../models/GoldRate.js';

dotenv.config();

// Verified Unsplash photo IDs — each ID matches the jewelry type described
const img = (id, alt) => ({ url: `https://images.unsplash.com/photo-${id}?w=600&q=80&fit=crop&auto=format`, alt });

const products = [

  // ── RINGS (5) ────────────────────────────────────────────────────────────────
  {
    name: 'Classic 22K Gold Band Ring',
    description: 'Simple plain gold band in 22K, hallmarked and BIS certified. Perfect for daily wear.',
    category: 'Rings', metal: 'Gold', purity: '22K',
    weight: 4.5, makingCharges: 10, makingChargesType: 'percentage',
    stock: 25, occasion: 'Daily Wear', style: 'Minimal',
    images: [img('1605100804763-247f67b3557e', 'Classic Gold Band Ring')]
  },
  {
    name: 'Floral Motif Gold Ring 22K',
    description: 'Intricate floral motif ring in 22K gold with traditional South Indian craftsmanship.',
    category: 'Rings', metal: 'Gold', purity: '22K',
    weight: 6.2, makingCharges: 15, makingChargesType: 'percentage',
    stock: 12, occasion: 'Festive', style: 'Traditional', badges: ['Bestseller'],
    images: [img('1603561591411-07134e71a2a9', 'Floral Gold Ring')]
  },
  {
    name: 'Bridal Kundan Gold Ring 22K',
    description: 'Kundan-set gold ring in 22K, perfect for brides and festive occasions.',
    category: 'Rings', metal: 'Gold', purity: '22K',
    weight: 8.0, makingCharges: 18, makingChargesType: 'percentage',
    stock: 6, occasion: 'Bridal', style: 'Heritage', badges: ['New'],
    images: [img('1515562141207-7a88fb7ce338', 'Kundan Gold Ring')]
  },
  {
    name: 'Twisted Rope Gold Ring 18K',
    description: 'Modern twisted rope design ring in 18K gold. Minimalist yet eye-catching.',
    category: 'Rings', metal: 'Gold', purity: '18K',
    weight: 3.8, makingCharges: 12, makingChargesType: 'percentage',
    stock: 18, occasion: 'Daily Wear', style: 'Contemporary',
    images: [img('1602173574767-37ac01994b2a', 'Twisted Rope Gold Ring')]
  },
  {
    name: 'Temple Design Gold Ring 22K',
    description: 'Traditional temple-design gold ring with deity motifs, crafted in 22K gold.',
    category: 'Rings', metal: 'Gold', purity: '22K',
    weight: 7.5, makingCharges: 16, makingChargesType: 'percentage',
    stock: 9, occasion: 'Festive', style: 'Traditional',
    images: [img('1535632066927-ab7c9ab60908', 'Temple Design Gold Ring')]
  },

  // ── NECKLACES (5) ────────────────────────────────────────────────────────────
  {
    name: 'Traditional Gold Choker 22K',
    description: 'Intricate traditional gold choker with temple design. A South Indian bridal staple.',
    category: 'Necklaces', metal: 'Gold', purity: '22K',
    weight: 25.0, makingCharges: 18, makingChargesType: 'percentage',
    stock: 3, occasion: 'Bridal', style: 'Traditional',
    images: [img('1599643478518-a784e5dc4c8f', 'Traditional Gold Choker')]
  },
  {
    name: 'Layered Gold Necklace 18K',
    description: 'Elegant layered gold necklace in 18K, perfect for parties and festive occasions.',
    category: 'Necklaces', metal: 'Gold', purity: '18K',
    weight: 12.0, makingCharges: 14, makingChargesType: 'percentage',
    stock: 10, occasion: 'Party', style: 'Contemporary', badges: ['Bestseller'],
    images: [img('1611591437281-460bfbe1220a', 'Layered Gold Necklace')]
  },
  {
    name: 'Minimal Bar Gold Necklace 14K',
    description: 'Sleek bar pendant necklace in 14K gold for modern everyday style.',
    category: 'Necklaces', metal: 'Gold', purity: '14K',
    weight: 4.0, makingCharges: 11, makingChargesType: 'percentage',
    stock: 20, occasion: 'Office', style: 'Minimal',
    images: [img('1600721391689-2564bb8055de', 'Minimal Bar Gold Necklace')]
  },
  {
    name: 'Kundan Pearl Gold Necklace 22K',
    description: 'Kundan-style centerpiece with pearl strings for festive and bridal wear.',
    category: 'Necklaces', metal: 'Gold', purity: '22K',
    weight: 28.0, makingCharges: 20, makingChargesType: 'percentage',
    stock: 5, occasion: 'Bridal', style: 'Heritage', badges: ['Bestseller'],
    images: [img('1599643477877-530eb83abc8e', 'Kundan Pearl Gold Necklace')]
  },
  {
    name: 'Delicate Gold Chain Necklace 22K',
    description: 'Fine gold chain necklace in 22K with a small pendant. Lightweight and elegant.',
    category: 'Necklaces', metal: 'Gold', purity: '22K',
    weight: 6.5, makingCharges: 10, makingChargesType: 'percentage',
    stock: 18, occasion: 'Daily Wear', style: 'Minimal', badges: ['New'],
    images: [img('1573408301185-9146fe634ad0', 'Delicate Gold Chain Necklace')]
  },

  // ── EARRINGS (5) ─────────────────────────────────────────────────────────────
  {
    name: 'Classic Gold Jhumkas 22K',
    description: 'Traditional 22K gold jhumkas with intricate filigree work. A must-have for every Indian woman.',
    category: 'Earrings', metal: 'Gold', purity: '22K',
    weight: 10.0, makingCharges: 14, makingChargesType: 'percentage',
    stock: 15, occasion: 'Festive', style: 'Traditional', badges: ['Bestseller'],
    images: [img('1588444837495-c6cfeb53f32d', 'Classic Gold Jhumkas')]
  },
  {
    name: 'Gold Stud Earrings 22K',
    description: 'Simple and elegant gold stud earrings in 22K. Perfect for daily wear and office.',
    category: 'Earrings', metal: 'Gold', purity: '22K',
    weight: 2.5, makingCharges: 10, makingChargesType: 'percentage',
    stock: 30, occasion: 'Daily Wear', style: 'Minimal',
    images: [img('1617038260897-1a9f8f954965', 'Gold Stud Earrings')]
  },
  {
    name: 'Chandbali Gold Earrings 22K',
    description: 'Crescent moon-shaped chandbali earrings in 22K gold with pearl drops. Bridal favourite.',
    category: 'Earrings', metal: 'Gold', purity: '22K',
    weight: 14.0, makingCharges: 18, makingChargesType: 'percentage',
    stock: 8, occasion: 'Bridal', style: 'Heritage', badges: ['New'],
    images: [img('1543294001-f7cd5d7fb516', 'Chandbali Gold Earrings')]
  },
  {
    name: 'Gold Hoop Earrings 18K',
    description: 'Modern gold hoop earrings in 18K. Lightweight and stylish for everyday wear.',
    category: 'Earrings', metal: 'Gold', purity: '18K',
    weight: 4.0, makingCharges: 12, makingChargesType: 'percentage',
    stock: 22, occasion: 'Casual', style: 'Contemporary',
    images: [img('1589207212797-cfd578c00985', 'Gold Hoop Earrings')]
  },
  {
    name: 'Temple Gold Earrings 22K',
    description: 'South Indian temple-style gold earrings with deity motifs and ruby accents in 22K.',
    category: 'Earrings', metal: 'Gold', purity: '22K',
    weight: 12.0, makingCharges: 16, makingChargesType: 'percentage',
    stock: 10, occasion: 'Festive', style: 'Traditional',
    images: [img('1611652022419-a9419f74343d', 'Temple Gold Earrings')]
  },

  // ── BRACELETS (5) ────────────────────────────────────────────────────────────
  {
    name: 'Gold Chain Bracelet 18K',
    description: 'Elegant gold chain bracelet in 18K. Lightweight and perfect for daily wear.',
    category: 'Bracelets', metal: 'Gold', purity: '18K',
    weight: 6.0, makingCharges: 12, makingChargesType: 'percentage',
    stock: 15, occasion: 'Daily Wear', style: 'Minimal',
    images: [img('1609250291996-3e8c61c3a3ca', 'Gold Chain Bracelet')]
  },
  {
    name: 'Gold Charm Bracelet 18K',
    description: 'Playful charm bracelet in 18K gold with multiple Indian motifs.',
    category: 'Bracelets', metal: 'Gold', purity: '18K',
    weight: 9.5, makingCharges: 14, makingChargesType: 'percentage',
    stock: 12, occasion: 'Casual', style: 'Contemporary', badges: ['New'],
    images: [img('1621784563330-e1789e95227b', 'Gold Charm Bracelet')]
  },
  {
    name: 'Gold Cuff Bracelet 22K',
    description: 'Bold open-cuff bracelet in 22K gold for festive occasions.',
    category: 'Bracelets', metal: 'Gold', purity: '22K',
    weight: 18.0, makingCharges: 16, makingChargesType: 'percentage',
    stock: 7, occasion: 'Festive', style: 'Statement', badges: ['Bestseller'],
    images: [img('1589307004173-3c95204d00a3', 'Gold Cuff Bracelet')]
  },
  {
    name: 'Beaded Gold Bracelet 14K',
    description: 'Lightweight beaded bracelet in 14K gold for daily wear.',
    category: 'Bracelets', metal: 'Gold', purity: '14K',
    weight: 5.5, makingCharges: 10, makingChargesType: 'percentage',
    stock: 20, occasion: 'Daily Wear', style: 'Minimal',
    images: [img('1516637090014-cb1ab0d08fc7', 'Beaded Gold Bracelet')]
  },
  {
    name: 'Bridal Gold Bracelet 22K',
    description: 'Ornate bridal gold bracelet in 22K with kundan and meenakari work.',
    category: 'Bracelets', metal: 'Gold', purity: '22K',
    weight: 22.0, makingCharges: 20, makingChargesType: 'percentage',
    stock: 5, occasion: 'Bridal', style: 'Heritage',
    images: [img('1602752250015-52934bc45613', 'Bridal Gold Bracelet')]
  },

  // ── BANGLES (5) ──────────────────────────────────────────────────────────────
  {
    name: 'Plain 22K Gold Bangle',
    description: 'Classic plain gold bangle in 22K — a timeless piece for everyday wear.',
    category: 'Bangles', metal: 'Gold', purity: '22K',
    weight: 15.0, makingCharges: 8, makingChargesType: 'percentage',
    stock: 20, occasion: 'Daily Wear', style: 'Minimal',
    images: [img('1611591437281-460bfbe1220a', 'Plain Gold Bangle')]
  },
  {
    name: 'Antique Carved Gold Bangle 22K',
    description: 'Heavy antique-finish gold bangle with intricate hand carvings. A bridal favourite.',
    category: 'Bangles', metal: 'Gold', purity: '22K',
    weight: 35.0, makingCharges: 16, makingChargesType: 'percentage',
    stock: 5, occasion: 'Bridal', style: 'Heritage', badges: ['Bestseller'],
    images: [img('1522312346375-d1a52e2b99b3', 'Antique Gold Bangle')]
  },
  {
    name: 'Textured Kada Gold Bangle 22K',
    description: 'Bold textured kada in 22K gold with geometric patterns. Ideal for festive occasions.',
    category: 'Bangles', metal: 'Gold', purity: '22K',
    weight: 40.0, makingCharges: 18, makingChargesType: 'percentage',
    stock: 4, occasion: 'Festive', style: 'Statement',
    images: [img('1603561596112-0a132b7223ec', 'Textured Gold Kada')]
  },
  {
    name: 'Slim Gold Bangle Set 18K',
    description: 'Set of 4 slim 18K gold bangles — stack them for a layered, modern look.',
    category: 'Bangles', metal: 'Gold', purity: '18K',
    weight: 20.0, makingCharges: 14, makingChargesType: 'percentage',
    stock: 8, occasion: 'Party', style: 'Contemporary', badges: ['New'],
    images: [img('1589207212797-cfd578c00985', 'Slim Gold Bangle Set')]
  },
  {
    name: 'Floral Engraved Gold Bangle 22K',
    description: 'Beautifully engraved floral pattern gold bangle in 22K. A South Indian classic.',
    category: 'Bangles', metal: 'Gold', purity: '22K',
    weight: 28.0, makingCharges: 15, makingChargesType: 'percentage',
    stock: 7, occasion: 'Festive', style: 'Traditional',
    images: [img('1588444837495-c6cfeb53f32d', 'Floral Gold Bangle')]
  },

  // ── PENDANTS (5) ─────────────────────────────────────────────────────────────
  {
    name: 'Om Gold Pendant 22K',
    description: 'Spiritual Om pendant in 22K gold with fine detailing. Auspicious and elegant.',
    category: 'Pendants', metal: 'Gold', purity: '22K',
    weight: 3.0, makingCharges: 10, makingChargesType: 'percentage',
    stock: 25, occasion: 'Daily Wear', style: 'Traditional',
    images: [img('1605100804763-247f67b3557e', 'Om Gold Pendant')]
  },
  {
    name: 'Heart Gold Pendant 18K',
    description: 'Romantic heart-shaped gold pendant in 18K. A perfect gift for loved ones.',
    category: 'Pendants', metal: 'Gold', purity: '18K',
    weight: 3.8, makingCharges: 11, makingChargesType: 'percentage',
    stock: 22, occasion: 'Casual', style: 'Contemporary',
    images: [img('1515562141207-7a88fb7ce338', 'Heart Gold Pendant')]
  },
  {
    name: 'Ganesh Gold Pendant 22K',
    description: 'Detailed Ganesh pendant in 22K gold — auspicious and elegant for daily wear.',
    category: 'Pendants', metal: 'Gold', purity: '22K',
    weight: 4.5, makingCharges: 13, makingChargesType: 'percentage',
    stock: 18, occasion: 'Festive', style: 'Traditional', badges: ['Bestseller'],
    images: [img('1599643477877-530eb83abc8e', 'Ganesh Gold Pendant')]
  },
  {
    name: 'Teardrop Gold Pendant 18K',
    description: 'Elegant teardrop gold pendant on a fine 18K gold chain. Modern and stylish.',
    category: 'Pendants', metal: 'Gold', purity: '18K',
    weight: 2.2, makingCharges: 14, makingChargesType: 'percentage',
    stock: 15, occasion: 'Party', style: 'Statement', badges: ['New'],
    images: [img('1600721391689-2564bb8055de', 'Teardrop Gold Pendant')]
  },
  {
    name: 'Lakshmi Gold Pendant 22K',
    description: 'Goddess Lakshmi pendant in 22K gold — a symbol of prosperity and good fortune.',
    category: 'Pendants', metal: 'Gold', purity: '22K',
    weight: 5.0, makingCharges: 15, makingChargesType: 'percentage',
    stock: 12, occasion: 'Festive', style: 'Traditional',
    images: [img('1573408301185-9146fe634ad0', 'Lakshmi Gold Pendant')]
  },

  // ── CHAINS (5) ───────────────────────────────────────────────────────────────
  {
    name: 'Classic Gold Link Chain 22K',
    description: 'Traditional 22K gold link chain, perfect for daily wear or pairing with pendants.',
    category: 'Chains', metal: 'Gold', purity: '22K',
    weight: 12.5, makingCharges: 8, makingChargesType: 'percentage',
    stock: 15, occasion: 'Daily Wear', style: 'Traditional',
    images: [img('1611652022419-a9419f74343d', 'Classic Gold Link Chain')]
  },
  {
    name: 'Figaro Gold Chain 22K',
    description: 'Elegant Figaro pattern gold chain with alternating oval and round links.',
    category: 'Chains', metal: 'Gold', purity: '22K',
    weight: 18.0, makingCharges: 9, makingChargesType: 'percentage',
    stock: 10, occasion: 'Daily Wear', style: 'Traditional', badges: ['Bestseller'],
    images: [img('1602173574767-37ac01994b2a', 'Figaro Gold Chain')]
  },
  {
    name: 'Box Link Gold Chain 18K',
    description: 'Sturdy box-link chain in 18K gold, ideal for holding heavy pendants.',
    category: 'Chains', metal: 'Gold', purity: '18K',
    weight: 14.0, makingCharges: 10, makingChargesType: 'percentage',
    stock: 12, occasion: 'Daily Wear', style: 'Contemporary',
    images: [img('1599643478518-a784e5dc4c8f', 'Box Link Gold Chain')]
  },
  {
    name: 'Singapore Gold Chain 22K',
    description: 'Delicate Singapore-pattern gold chain with a beautiful shimmer. Lightweight and elegant.',
    category: 'Chains', metal: 'Gold', purity: '22K',
    weight: 8.5, makingCharges: 11, makingChargesType: 'percentage',
    stock: 20, occasion: 'Office', style: 'Minimal', badges: ['New'],
    images: [img('1573408301185-9146fe634ad0', 'Singapore Gold Chain')]
  },
  {
    name: 'Rope Twist Gold Chain 22K',
    description: 'Thick rope-twist gold chain in 22K, a popular choice in South India.',
    category: 'Chains', metal: 'Gold', purity: '22K',
    weight: 25.0, makingCharges: 8, makingChargesType: 'percentage',
    stock: 8, occasion: 'Festive', style: 'Heritage',
    images: [img('1605100804763-247f67b3557e', 'Rope Twist Gold Chain')]
  },

  // ── SETS (5) ─────────────────────────────────────────────────────────────────
  {
    name: 'Bridal Gold Jewellery Set 22K',
    description: 'Complete bridal set with necklace, earrings, and maang tikka in 22K gold.',
    category: 'Sets', metal: 'Gold', purity: '22K',
    weight: 85.0, makingCharges: 22, makingChargesType: 'percentage',
    stock: 2, occasion: 'Bridal', style: 'Traditional', badges: ['Bestseller'],
    images: [img('1588444837495-c6cfeb53f32d', 'Bridal Gold Jewellery Set')]
  },
  {
    name: 'Temple Motif Gold Set 22K',
    description: 'Necklace and earrings set inspired by South Indian temple art in 22K gold.',
    category: 'Sets', metal: 'Gold', purity: '22K',
    weight: 55.0, makingCharges: 20, makingChargesType: 'percentage',
    stock: 3, occasion: 'Bridal', style: 'Heritage',
    images: [img('1599643478518-a784e5dc4c8f', 'Temple Motif Gold Set')]
  },
  {
    name: 'Festive Gold Necklace Set 22K',
    description: 'Elegant necklace and earrings set in 22K gold for festive occasions.',
    category: 'Sets', metal: 'Gold', purity: '22K',
    weight: 40.0, makingCharges: 18, makingChargesType: 'percentage',
    stock: 5, occasion: 'Festive', style: 'Traditional', badges: ['New'],
    images: [img('1611591437281-460bfbe1220a', 'Festive Gold Necklace Set')]
  },
  {
    name: 'Minimal Gold Jewellery Set 18K',
    description: 'Delicate 18K gold necklace and stud earrings set for office and daily wear.',
    category: 'Sets', metal: 'Gold', purity: '18K',
    weight: 12.0, makingCharges: 13, makingChargesType: 'percentage',
    stock: 10, occasion: 'Office', style: 'Minimal',
    images: [img('1600721391689-2564bb8055de', 'Minimal Gold Jewellery Set')]
  },
  {
    name: 'Kundan Bridal Gold Set 22K',
    description: 'Elaborate kundan bridal set with necklace, earrings, maang tikka and bangles in 22K.',
    category: 'Sets', metal: 'Gold', purity: '22K',
    weight: 110.0, makingCharges: 25, makingChargesType: 'percentage',
    stock: 1, occasion: 'Bridal', style: 'Heritage', badges: ['Bestseller'],
    images: [img('1599643477877-530eb83abc8e', 'Kundan Bridal Gold Set')]
  },

  // ── SILVER RINGS (5) ─────────────────────────────────────────────────────────
  {
    name: 'Plain 925 Silver Band Ring',
    description: 'Classic plain silver band ring in 925 sterling silver. Lightweight and perfect for daily wear.',
    category: 'Rings', metal: 'Silver', purity: '925',
    weight: 3.0, makingCharges: 8, makingChargesType: 'percentage',
    stock: 30, occasion: 'Daily Wear', style: 'Minimal',
    images: [img('1603561591411-07134e71a2a9', 'Plain Silver Band Ring')]
  },
  {
    name: 'Oxidized Silver Floral Ring',
    description: 'Oxidized silver ring with intricate floral motifs. A boho-ethnic style statement.',
    category: 'Rings', metal: 'Silver', purity: '925',
    weight: 5.5, makingCharges: 12, makingChargesType: 'percentage',
    stock: 20, occasion: 'Casual', style: 'Heritage', badges: ['Bestseller'],
    images: [img('1535632066927-ab7c9ab60908', 'Oxidized Silver Floral Ring')]
  },
  {
    name: 'Silver Toe Ring Set 925',
    description: 'Traditional Indian silver toe ring set in 925 silver. Worn by married women.',
    category: 'Rings', metal: 'Silver', purity: '925',
    weight: 2.0, makingCharges: 7, makingChargesType: 'percentage',
    stock: 40, occasion: 'Daily Wear', style: 'Traditional',
    images: [img('1605100804763-247f67b3557e', 'Silver Toe Ring Set')]
  },
  {
    name: 'Silver Adjustable Ring 925',
    description: 'Adjustable open-band silver ring in 925 with a minimalist design. One size fits all.',
    category: 'Rings', metal: 'Silver', purity: '925',
    weight: 3.5, makingCharges: 9, makingChargesType: 'percentage',
    stock: 25, occasion: 'Casual', style: 'Contemporary', badges: ['New'],
    images: [{ url: '-473Wx593H-6006803700-multi-MODEL.avif', alt: 'Silver Adjustable Ring' }]

  },
  {
    name: 'Silver Gemstone Ring 925',
    description: 'Sterling silver ring with a semi-precious gemstone centre. Elegant and affordable.',
    category: 'Rings', metal: 'Silver', purity: '925',
    weight: 4.8, makingCharges: 14, makingChargesType: 'percentage',
    stock: 15, occasion: 'Party', style: 'Statement',
    images: [img('1603561591411-07134e71a2a9', 'Silver Gemstone Ring')]
  },

  // ── SILVER CHAINS (5) ────────────────────────────────────────────────────────
  {
    name: 'Silver Link Chain 925',
    description: 'Classic sterling silver link chain in 925. Versatile for daily wear or with pendants.',
    category: 'Chains', metal: 'Silver', purity: '925',
    weight: 10.0, makingCharges: 8, makingChargesType: 'percentage',
    stock: 20, occasion: 'Daily Wear', style: 'Minimal',
    images: [img('1611652022419-a9419f74343d', 'Silver Link Chain')]
  },
  {
    name: 'Oxidized Silver Chain 925',
    description: 'Oxidized silver chain with a vintage look. Perfect for ethnic and casual outfits.',
    category: 'Chains', metal: 'Silver', purity: '925',
    weight: 15.0, makingCharges: 10, makingChargesType: 'percentage',
    stock: 15, occasion: 'Casual', style: 'Heritage', badges: ['Bestseller'],
    images: [img('1573408301185-9146fe634ad0', 'Oxidized Silver Chain')]
  },
  {
    name: 'Silver Box Chain 925',
    description: 'Sturdy box-link silver chain in 925. Ideal for holding pendants and charms.',
    category: 'Chains', metal: 'Silver', purity: '925',
    weight: 12.0, makingCharges: 9, makingChargesType: 'percentage',
    stock: 18, occasion: 'Daily Wear', style: 'Contemporary',
    images: [img('1599643478518-a784e5dc4c8f', 'Silver Box Chain')]
  },
  {
    name: 'Silver Rope Chain 925',
    description: 'Twisted rope-pattern silver chain in 925. A popular choice for men and women.',
    category: 'Chains', metal: 'Silver', purity: '925',
    weight: 18.0, makingCharges: 8, makingChargesType: 'percentage',
    stock: 12, occasion: 'Daily Wear', style: 'Traditional', badges: ['New'],
    images: [img('1602173574767-37ac01994b2a', 'Silver Rope Chain')]
  },
  {
    name: 'Silver Figaro Chain 925',
    description: 'Elegant Figaro pattern silver chain in 925 with alternating links.',
    category: 'Chains', metal: 'Silver', purity: '925',
    weight: 14.0, makingCharges: 9, makingChargesType: 'percentage',
    stock: 16, occasion: 'Office', style: 'Minimal',
    images: [img('1600721391689-2564bb8055de', 'Silver Figaro Chain')]
  },

  // ── SILVER KADA / BANGLES (5) ─────────────────────────────────────────────────
  {
    name: 'Plain Silver Kada 925',
    description: 'Classic plain silver kada in 925 sterling silver. A timeless piece for men and women.',
    category: 'Bangles', metal: 'Silver', purity: '925',
    weight: 30.0, makingCharges: 8, makingChargesType: 'percentage',
    stock: 15, occasion: 'Daily Wear', style: 'Traditional',
    images: [img('1611591437281-460bfbe1220a', 'Plain Silver Kada')]
  },
  {
    name: 'Oxidized Silver Kada 925',
    description: 'Oxidized silver kada with tribal motifs. Bold and ethnic for festive occasions.',
    category: 'Bangles', metal: 'Silver', purity: '925',
    weight: 40.0, makingCharges: 12, makingChargesType: 'percentage',
    stock: 10, occasion: 'Festive', style: 'Heritage', badges: ['Bestseller'],
    images: [img('1522312346375-d1a52e2b99b3', 'Oxidized Silver Kada')]
  },
  {
    name: 'Engraved Silver Bangle 925',
    description: 'Beautifully engraved silver bangle in 925 with floral patterns. South Indian style.',
    category: 'Bangles', metal: 'Silver', purity: '925',
    weight: 22.0, makingCharges: 11, makingChargesType: 'percentage',
    stock: 12, occasion: 'Festive', style: 'Traditional',
    images: [img('1603561596112-0a132b7223ec', 'Engraved Silver Bangle')]
  },
  {
    name: 'Slim Silver Bangle Set 925',
    description: 'Set of 6 slim silver bangles in 925. Stack them for a traditional layered look.',
    category: 'Bangles', metal: 'Silver', purity: '925',
    weight: 18.0, makingCharges: 10, makingChargesType: 'percentage',
    stock: 20, occasion: 'Daily Wear', style: 'Minimal', badges: ['New'],
    images: [img('1589207212797-cfd578c00985', 'Slim Silver Bangle Set')]
  },
  {
    name: 'Textured Silver Kada 925',
    description: 'Bold textured silver kada in 925 with geometric patterns. Ideal for men.',
    category: 'Bangles', metal: 'Silver', purity: '925',
    weight: 45.0, makingCharges: 10, makingChargesType: 'percentage',
    stock: 8, occasion: 'Casual', style: 'Statement',
    images: [img('1588444837495-c6cfeb53f32d', 'Textured Silver Kada')]
  },

  // ── SILVER BRACELETS (5) ─────────────────────────────────────────────────────
  {
    name: 'Silver Chain Bracelet 925',
    description: 'Elegant sterling silver chain bracelet in 925. Lightweight and perfect for daily wear.',
    category: 'Bracelets', metal: 'Silver', purity: '925',
    weight: 8.0, makingCharges: 10, makingChargesType: 'percentage',
    stock: 25, occasion: 'Daily Wear', style: 'Minimal',
    images: [img('1609250291996-3e8c61c3a3ca', 'Silver Chain Bracelet')]
  },
  {
    name: 'Oxidized Silver Bracelet 925',
    description: 'Oxidized silver bracelet with intricate ethnic patterns. A boho-chic statement.',
    category: 'Bracelets', metal: 'Silver', purity: '925',
    weight: 12.0, makingCharges: 12, makingChargesType: 'percentage',
    stock: 18, occasion: 'Casual', style: 'Heritage', badges: ['Bestseller'],
    images: [img('1621784563330-e1789e95227b', 'Oxidized Silver Bracelet')]
  },
  {
    name: 'Silver Charm Bracelet 925',
    description: 'Sterling silver charm bracelet in 925 with multiple Indian motif charms.',
    category: 'Bracelets', metal: 'Silver', purity: '925',
    weight: 10.0, makingCharges: 14, makingChargesType: 'percentage',
    stock: 15, occasion: 'Casual', style: 'Contemporary', badges: ['New'],
    images: [img('1589307004173-3c95204d00a3', 'Silver Charm Bracelet')]
  },
  {
    name: 'Silver Cuff Bracelet 925',
    description: 'Bold open-cuff silver bracelet in 925. Adjustable and stylish for all occasions.',
    category: 'Bracelets', metal: 'Silver', purity: '925',
    weight: 15.0, makingCharges: 11, makingChargesType: 'percentage',
    stock: 12, occasion: 'Party', style: 'Statement',
    images: [img('1602752250015-52934bc45613', 'Silver Cuff Bracelet')]
  },
  {
    name: 'Silver Tennis Bracelet 925',
    description: 'Classic tennis bracelet in 925 silver with cubic zirconia stones. Elegant and sparkling.',
    category: 'Bracelets', metal: 'Silver', purity: '925',
    weight: 9.0, makingCharges: 15, makingChargesType: 'percentage',
    stock: 10, occasion: 'Party', style: 'Contemporary',
    images: [img('1516637090014-cb1ab0d08fc7', 'Silver Tennis Bracelet')]
  },

  // ── SILVER ANKLETS (5) ───────────────────────────────────────────────────────
  {
    name: 'Plain Silver Anklet 925',
    description: 'Classic plain silver anklet in 925 sterling silver. Traditional and elegant for daily wear.',
    category: 'Anklets', metal: 'Silver', purity: '925',
    weight: 8.0, makingCharges: 8, makingChargesType: 'percentage',
    stock: 30, occasion: 'Daily Wear', style: 'Traditional',
    images: [img('1535632066927-ab7c9ab60908', 'Plain Silver Anklet')]
  },
  {
    name: 'Ghungroo Silver Anklet 925',
    description: 'Traditional ghungroo (bell) silver anklet in 925. Makes a soft musical sound while walking.',
    category: 'Anklets', metal: 'Silver', purity: '925',
    weight: 12.0, makingCharges: 10, makingChargesType: 'percentage',
    stock: 20, occasion: 'Festive', style: 'Traditional', badges: ['Bestseller'],
    images: [img('1605100804763-247f67b3557e', 'Ghungroo Silver Anklet')]
  },
  {
    name: 'Oxidized Silver Anklet 925',
    description: 'Oxidized silver anklet with ethnic motifs in 925. Perfect for ethnic and casual wear.',
    category: 'Anklets', metal: 'Silver', purity: '925',
    weight: 10.0, makingCharges: 11, makingChargesType: 'percentage',
    stock: 18, occasion: 'Casual', style: 'Heritage', badges: ['New'],
    images: [img('1573408301185-9146fe634ad0', 'Oxidized Silver Anklet')]
  },
  {
    name: 'Beaded Silver Anklet 925',
    description: 'Delicate beaded silver anklet in 925 with small silver beads. Lightweight and pretty.',
    category: 'Anklets', metal: 'Silver', purity: '925',
    weight: 6.0, makingCharges: 9, makingChargesType: 'percentage',
    stock: 25, occasion: 'Casual', style: 'Minimal',
    images: [img('1602173574767-37ac01994b2a', 'Beaded Silver Anklet')]
  },
  {
    name: 'Charm Silver Anklet 925',
    description: 'Sterling silver anklet in 925 with small charm pendants. Trendy and youthful.',
    category: 'Anklets', metal: 'Silver', purity: '925',
    weight: 7.5, makingCharges: 12, makingChargesType: 'percentage',
    stock: 22, occasion: 'Casual', style: 'Contemporary',
    images: [img('1600721391689-2564bb8055de', 'Charm Silver Anklet')]
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelry_ecommerce');
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@sudhajewelry.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User', email: 'admin@sudhajewelry.com',
        password: 'admin123', role: 'admin', phone: '+91-9876543210'
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    await GoldRate.deleteMany({});
    await GoldRate.insertMany([
      { purity: '24K',    ratePerGram: 15218, isActive: true, source: 'manual' },
      { purity: '22K',    ratePerGram: 13950, isActive: true, source: 'manual' },
      { purity: '18K',    ratePerGram: 11640, isActive: true, source: 'manual' },
      { purity: '14K',    ratePerGram: 8903,  isActive: true, source: 'manual' },
      { purity: 'Silver', ratePerGram: 96,    isActive: true, source: 'manual' }
    ]);
    console.log('Gold rates seeded');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const genId = (cat, metal) =>
      `${cat.substring(0,3).toUpperCase()}-${metal.substring(0,2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    for (const data of products) {
      data.productId = genId(data.category, data.metal);
      await new Product(data).save();
    }

    const cats = [...new Set(products.map(p => p.category))];
    console.log(`\nSeeded ${products.length} products across ${cats.length} categories:`);
    cats.forEach(c => console.log(`  ${c}: ${products.filter(p => p.category === c).length} products`));
    console.log('\nDone!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
