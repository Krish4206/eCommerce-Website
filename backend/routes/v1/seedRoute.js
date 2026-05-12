import express from "express";
import { Product } from "../../models/Product.js";
import { logger } from "../../utils/logger.js";

const router = express.Router();

const FASHION_PRODUCTS = [
  {
    name: "Classic Fit Premium Polo T-Shirt",
    description:
      "Premium cotton polo t-shirt with a modern fit. Features a button-down collar, ribbed cuffs, and a comfortable breathable fabric perfect for both casual and semi-formal occasions.",
    mrp: 1999,
    price: 799,
    discount: 60,
    brand: "Sanjish Originals",
    category: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 250,
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
        public_id: "p1",
      },
    ],
    colors: [
      { name: "Black", code: "#1a1a2e" },
      { name: "White", code: "#f8f9fa" },
      { name: "Navy", code: "#1e3a5f" },
    ],
    ratings: 4.5,
    numReviews: 234,
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "Slim Fit Stretchable Denim Jeans",
    description:
      "Modern slim fit jeans with advanced 4-way stretch technology. Comfortable, durable denim that moves with you throughout the day.",
    mrp: 2999,
    price: 1299,
    discount: 57,
    brand: "DenimCo India",
    category: "Men",
    sizes: ["28", "30", "32", "34", "36"],
    stock: 180,
    images: [
      {
        url: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400",
        public_id: "p2",
      },
    ],
    colors: [
      { name: "Indigo Blue", code: "#3b3b6d" },
      { name: "Black", code: "#1a1a2e" },
    ],
    ratings: 4.3,
    numReviews: 189,
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "Floral Print Summer Dress",
    description:
      "Beautiful floral print sundress made from lightweight, breathable fabric. Perfect for summer days and evening outings.",
    mrp: 2499,
    price: 999,
    discount: 60,
    brand: "Ziva Fashion",
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 120,
    images: [
      {
        url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400",
        public_id: "p3",
      },
    ],
    colors: [
      { name: "Blue Floral", code: "#4a90d9" },
      { name: "Pink Floral", code: "#e8a0b4" },
    ],
    ratings: 4.7,
    numReviews: 312,
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "Premium Leather Handbag",
    description:
      "Genuine leather handbag with gold-tone hardware. Features multiple compartments, a detachable shoulder strap, and a secure zip closure.",
    mrp: 4999,
    price: 2499,
    discount: 50,
    brand: "LuxeCraft",
    category: "Women",
    sizes: ["One Size"],
    stock: 75,
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
        public_id: "p4",
      },
    ],
    colors: [
      { name: "Tan Brown", code: "#8B6914" },
      { name: "Black", code: "#1a1a2e" },
    ],
    ratings: 4.8,
    numReviews: 456,
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",
    mrp: 12999,
    price: 5499,
    discount: 58,
    brand: "SoundWave",
    category: "Electronics",
    sizes: ["One Size"],
    stock: 90,
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        public_id: "p5",
      },
    ],
    colors: [
      { name: "Matte Black", code: "#2d2d2d" },
      { name: "Silver", code: "#c0c0c0" },
    ],
    ratings: 4.6,
    numReviews: 567,
    isFeatured: true,
    isBestseller: false,
  },
  {
    name: "Smart Fitness Tracker Watch",
    description:
      "Advanced fitness tracker with heart rate monitoring, SpO2 tracking, GPS, sleep analysis, and 14-day battery life.",
    mrp: 7999,
    price: 2999,
    discount: 63,
    brand: "TechFit",
    category: "Electronics",
    sizes: ["S", "M", "L"],
    stock: 200,
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        public_id: "p6",
      },
    ],
    colors: [
      { name: "Black", code: "#1a1a2e" },
      { name: "Blue", code: "#2563eb" },
    ],
    ratings: 4.4,
    numReviews: 789,
    isFeatured: false,
    isBestseller: true,
  },
  {
    name: "Organic Cotton Baby Bodysuit Set",
    description:
      "Set of 5 organic cotton bodysuits for babies. Ultra-soft, hypoallergenic, and gentle on sensitive skin. Snap closures for easy changing.",
    mrp: 1499,
    price: 599,
    discount: 60,
    brand: "LittleAngel",
    category: "Kids",
    sizes: ["0-3M", "3-6M", "6-12M", "12-18M"],
    stock: 300,
    images: [
      {
        url: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400",
        public_id: "p7",
      },
    ],
    colors: [{ name: "Pastel Mix", code: "#f0d9da" }],
    ratings: 4.9,
    numReviews: 1023,
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "Stainless Steel Water Bottle",
    description:
      "Double-wall vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12. BPA-free, leak-proof, and eco-friendly.",
    mrp: 1999,
    price: 799,
    discount: 60,
    brand: "EcoPure",
    category: "Home & Garden",
    sizes: ["500ml", "750ml", "1L"],
    stock: 500,
    images: [
      {
        url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
        public_id: "p8",
      },
    ],
    colors: [
      { name: "Stainless", code: "#c0c0c0" },
      { name: "Matte Black", code: "#2d2d2d" },
      { name: "Ocean Blue", code: "#2563eb" },
    ],
    ratings: 4.7,
    numReviews: 654,
    isFeatured: true,
    isBestseller: false,
  },
  {
    name: "Pro Running Shoes",
    description:
      "Lightweight performance running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole.",
    mrp: 6999,
    price: 3499,
    discount: 50,
    brand: "SportFlex",
    category: "Sports",
    sizes: ["7", "8", "9", "10", "11", "12"],
    stock: 150,
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        public_id: "p9",
      },
    ],
    colors: [
      { name: "Red/Black", code: "#dc2626" },
      { name: "Blue/White", code: "#2563eb" },
    ],
    ratings: 4.5,
    numReviews: 432,
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "Vitamin C Brightening Serum",
    description:
      "Professional-grade vitamin C serum with hyaluronic acid and vitamin E. Brightens skin, reduces dark spots, and boosts collagen.",
    mrp: 1499,
    price: 699,
    discount: 53,
    brand: "GlowLab",
    category: "Beauty",
    sizes: ["30ml", "50ml"],
    stock: 350,
    images: [
      {
        url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
        public_id: "p10",
      },
    ],
    colors: [],
    ratings: 4.6,
    numReviews: 876,
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "Classic Aviator Sunglasses",
    description:
      "Timeless aviator sunglasses with UV400 protection. Gold-tone frame with gradient lenses. Lightweight and comfortable for all-day wear.",
    mrp: 2999,
    price: 999,
    discount: 67,
    brand: "VueStyle",
    category: "Accessories",
    sizes: ["One Size"],
    stock: 200,
    images: [
      {
        url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        public_id: "p11",
      },
    ],
    colors: [
      { name: "Gold/Green", code: "#D4AF37" },
      { name: "Silver/Blue", code: "#C0C0C0" },
    ],
    ratings: 4.3,
    numReviews: 345,
    isFeatured: false,
    isBestseller: true,
  },
  {
    name: "Knit Cashmere Blend Sweater",
    description:
      "Luxurious cashmere-blend knit sweater. Incredibly soft, warm, and perfect for layering during colder months.",
    mrp: 3999,
    price: 1799,
    discount: 55,
    brand: "Sanjish Originals",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 100,
    images: [
      {
        url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400",
        public_id: "p12",
      },
    ],
    colors: [
      { name: "Charcoal", code: "#36454F" },
      { name: "Camel", code: "#C19A6B" },
      { name: "Burgundy", code: "#800020" },
    ],
    ratings: 4.4,
    numReviews: 234,
    isFeatured: true,
    isBestseller: false,
  },
  {
    name: "Yoga Mat Premium Non-Slip",
    description:
      "Extra thick 6mm yoga mat with alignment lines. Non-slip surface, eco-friendly TPE material, includes carrying strap.",
    mrp: 2499,
    price: 999,
    discount: 60,
    brand: "ZenFit",
    category: "Sports",
    sizes: ["Standard", "Extra Long"],
    stock: 280,
    images: [
      {
        url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
        public_id: "p13",
      },
    ],
    colors: [
      { name: "Purple", code: "#7C3AED" },
      { name: "Teal", code: "#0D9488" },
    ],
    ratings: 4.8,
    numReviews: 567,
    isFeatured: false,
    isBestseller: true,
  },
  {
    name: "Set of 6 Ceramic Dinner Plates",
    description:
      "Elegant ceramic dinner plate set. Microwave and dishwasher safe. Classic design that complements any table setting.",
    mrp: 3999,
    price: 1799,
    discount: 55,
    brand: "HomeElegance",
    category: "Home & Garden",
    sizes: ["Set of 6"],
    stock: 120,
    images: [
      {
        url: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=400",
        public_id: "p14",
      },
    ],
    colors: [
      { name: "White", code: "#FFFFFF" },
      { name: "Ivory", code: "#FFFFF0" },
    ],
    ratings: 4.5,
    numReviews: 432,
    isFeatured: false,
    isBestseller: false,
  },
  {
    name: "Kids Educational Tablet",
    description:
      "Children's learning tablet with pre-loaded educational games, e-books, and parental controls. Durable kid-proof design.",
    mrp: 5999,
    price: 2499,
    discount: 58,
    brand: "KiddoTech",
    category: "Kids",
    sizes: ["One Size"],
    stock: 85,
    images: [
      {
        url: "https://images.unsplash.com/photo-1587691592099-24045742e181?w=400",
        public_id: "p15",
      },
    ],
    colors: [
      { name: "Blue", code: "#2563eb" },
      { name: "Pink", code: "#ec4899" },
    ],
    ratings: 4.2,
    numReviews: 198,
    isFeatured: false,
    isBestseller: false,
  },
];

router.post("/seed", async (req, res) => {
  try {
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      return res.json({
        status: true,
        message: `Database already has ${existingCount} products. No seeding needed.`,
        count: existingCount,
      });
    }

    const products = await Product.insertMany(FASHION_PRODUCTS);
    logger.info(`Seeded ${products.length} products`);
    res.json({
      status: true,
      message: `Successfully seeded ${products.length} products!`,
      count: products.length,
    });
  } catch (error) {
    logger.error(`Seed error: ${error.message}`);
    res.status(500).json({ status: false, message: error.message });
  }
});

export default router;
