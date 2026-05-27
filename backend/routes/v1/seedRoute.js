import express from "express";
import { Product } from "../../models/Product.js";
import { User } from "../../models/User.js";
import { logger } from "../../utils/logger.js";

const router = express.Router();

const FASHION_PRODUCTS = [
  {
    name: "Classic Fit Premium Polo T-Shirt",
    description:
      "Premium cotton polo t-shirt. Button-down collar, ribbed cuffs. Perfect for casual wear.",
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
    ],
    ratings: 4.5,
    numReviews: 234,
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "Slim Fit Stretchable Denim Jeans",
    description:
      "Modern slim fit jeans with 4-way stretch. Comfortable denim that moves with you.",
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
      "Beautiful floral sundress. Lightweight, breathable fabric for summer days.",
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
      "Genuine leather handbag with gold-tone hardware. Multiple compartments.",
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
      "Premium wireless headphones with active noise cancellation, 30-hour battery.",
    mrp: 12999,
    price: 5499,
    discount: 58,
    brand: "SoundWave",
    category: "Accessories",
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
  },
  {
    name: "Smart Fitness Tracker Watch",
    description:
      "Advanced fitness tracker, heart rate monitoring, GPS, 14-day battery.",
    mrp: 7999,
    price: 2999,
    discount: 63,
    brand: "TechFit",
    category: "Accessories",
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
    isBestseller: true,
  },
  {
    name: "Organic Cotton Baby Bodysuit Set",
    description:
      "Set of 5 organic cotton bodysuits. Ultra-soft, hypoallergenic.",
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
    name: "Pro Running Shoes",
    description:
      "Lightweight performance running shoes. Responsive cushioning, breathable mesh.",
    mrp: 6999,
    price: 3499,
    discount: 50,
    brand: "SportFlex",
    category: "Footwear",
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
    name: "Casual Canvas Sneakers",
    description:
      "Classic canvas sneakers. Comfortable for everyday wear, durable sole.",
    mrp: 1999,
    price: 899,
    discount: 55,
    brand: "UrbanStep",
    category: "Footwear",
    sizes: ["7", "8", "9", "10", "11"],
    stock: 200,
    images: [
      {
        url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400",
        public_id: "p15",
      },
    ],
    colors: [
      { name: "White", code: "#FFFFFF" },
      { name: "Black", code: "#1a1a2e" },
    ],
    ratings: 4.3,
    numReviews: 321,
    isBestseller: true,
  },
  {
    name: "Classic Aviator Sunglasses",
    description:
      "Timeless aviator sunglasses. UV400 protection, gold-tone frame.",
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
    isBestseller: true,
  },
  {
    name: "Knit Cashmere Blend Sweater",
    description:
      "Luxurious cashmere-blend knit sweater. Soft, warm, perfect for layering.",
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
    ],
    ratings: 4.4,
    numReviews: 234,
    isFeatured: true,
  },
  {
    name: "Yoga Mat Premium Non-Slip",
    description:
      "Extra thick 6mm yoga mat with alignment lines. Eco-friendly TPE material.",
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
    isBestseller: true,
  },
  {
    name: "Cotton Linen Blend Kurta Set",
    description:
      "Traditional kurta set in cotton-linen blend. Comfortable ethnic wear.",
    mrp: 2999,
    price: 1299,
    discount: 57,
    brand: "EthnicVibe",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 85,
    images: [
      {
        url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400",
        public_id: "p14",
      },
    ],
    colors: [
      { name: "Mint Green", code: "#98FB98" },
      { name: "Coral", code: "#FF7F50" },
    ],
    ratings: 4.6,
    numReviews: 198,
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "Minimalist Leather Wallet",
    description:
      "Slim RFID-blocking leather wallet. 6 card slots, bill compartment.",
    mrp: 1999,
    price: 799,
    discount: 60,
    brand: "LuxeCraft",
    category: "Accessories",
    sizes: ["One Size"],
    stock: 350,
    images: [
      {
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
        public_id: "p16",
      },
    ],
    colors: [
      { name: "Brown", code: "#8B4513" },
      { name: "Black", code: "#1a1a2e" },
    ],
    ratings: 4.5,
    numReviews: 654,
    isBestseller: true,
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

    // Find admin user for createdBy field
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(400).json({
        status: false,
        message: "No admin user found. Create an admin user first.",
      });
    }

    const productsWithAdmin = FASHION_PRODUCTS.map((p) => ({
      ...p,
      createdBy: admin._id,
      mrp: p.mrp || Math.round(p.price * 2),
    }));

    const products = await Product.insertMany(productsWithAdmin);
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
