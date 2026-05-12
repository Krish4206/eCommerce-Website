import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

// Sample product data for Sanjish
const sampleProducts = [
  // WOMEN'S CLOTHING
  {
    name: "Premium Cotton T-Shirt",
    slug: "premium-cotton-tshirt-women",
    description:
      "Comfortable and stylish premium cotton t-shirt perfect for everyday wear. Crafted from 100% organic cotton with a soft finish.",
    shortDescription: "100% organic cotton t-shirt",
    mrp: 1999,
    sellingPrice: 999,
    brand: "StyleFit",
    category: "Women",
    subcategory: "Tops",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", code: "#000000", images: [] },
      { name: "White", code: "#FFFFFF", images: [] },
      { name: "Navy", code: "#001f3f", images: [] },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        alt: "Premium Cotton T-Shirt",
        isPrimary: true,
      },
    ],
    tags: ["cotton", "tshirt", "casual", "women"],
    stock: 45,
    sku: "SJ-WOMEN-TSHIRT-001",
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: false,
    ratings: 4.5,
    numReviews: 128,
    weight: 150,
    material: "100% Organic Cotton",
    returnDays: 7,
    isReturnable: true,
    isExchangeable: true,
    gst: 18,
    estimatedDelivery: { minDays: 2, maxDays: 5 },
    createdBy: new mongoose.Types.ObjectId(),
  },
  {
    name: "Casual Jeans - Slim Fit",
    slug: "casual-jeans-slim-fit-women",
    description:
      "Classic slim fit jeans with perfect stretch and comfort. Ideal for casual outings and everyday styling.",
    shortDescription: "Comfortable slim fit jeans",
    mrp: 3499,
    sellingPrice: 1749,
    brand: "DenimPro",
    category: "Women",
    subcategory: "Jeans",
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: [
      { name: "Dark Blue", code: "#1a3a52", images: [] },
      { name: "Light Blue", code: "#87ceeb", images: [] },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
        alt: "Casual Jeans",
        isPrimary: true,
      },
    ],
    tags: ["jeans", "denim", "casual", "women"],
    stock: 32,
    sku: "SJ-WOMEN-JEANS-001",
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isBestseller: true,
    ratings: 4.7,
    numReviews: 256,
    weight: 400,
    material: "98% Cotton, 2% Elastane",
    returnDays: 7,
    isReturnable: true,
    isExchangeable: true,
    gst: 18,
    estimatedDelivery: { minDays: 3, maxDays: 6 },
    createdBy: new mongoose.Types.ObjectId(),
  },
  {
    name: "Elegant Saree Collection",
    slug: "elegant-saree-collection-women",
    description:
      "Beautiful traditional saree with modern designs. Perfect for festivals and special occasions.",
    shortDescription: "Traditional saree with modern touch",
    mrp: 5999,
    sellingPrice: 2999,
    brand: "RoyalWeaves",
    category: "Women",
    subcategory: "Ethnic Wear",
    sizes: ["Free"],
    colors: [
      { name: "Red", code: "#FF0000", images: [] },
      { name: "Purple", code: "#800080", images: [] },
      { name: "Green", code: "#008000", images: [] },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1608686826221-f6f7d8ccb965?w=500",
        alt: "Elegant Saree",
        isPrimary: true,
      },
    ],
    tags: ["saree", "ethnic", "traditional", "women"],
    stock: 18,
    sku: "SJ-WOMEN-SAREE-001",
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: false,
    ratings: 4.8,
    numReviews: 89,
    weight: 300,
    material: "Pure Cotton Blend",
    returnDays: 7,
    isReturnable: true,
    isExchangeable: true,
    gst: 18,
    estimatedDelivery: { minDays: 2, maxDays: 4 },
    createdBy: new mongoose.Types.ObjectId(),
  },

  // MEN'S CLOTHING
  {
    name: "Premium Formal Shirt",
    slug: "premium-formal-shirt-men",
    description:
      "Professional formal shirt made from premium fabric. Perfect for office and formal occasions.",
    shortDescription: "Premium formal business shirt",
    mrp: 2499,
    sellingPrice: 1249,
    brand: "ClassicStyle",
    category: "Men",
    subcategory: "Shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", code: "#FFFFFF", images: [] },
      { name: "Light Blue", code: "#ADD8E6", images: [] },
      { name: "Black", code: "#000000", images: [] },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1596633512635-e45223ce4e29?w=500",
        alt: "Formal Shirt",
        isPrimary: true,
      },
    ],
    tags: ["shirt", "formal", "professional", "men"],
    stock: 55,
    sku: "SJ-MEN-SHIRT-001",
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    ratings: 4.6,
    numReviews: 342,
    weight: 200,
    material: "100% Cotton",
    returnDays: 7,
    isReturnable: true,
    isExchangeable: true,
    gst: 18,
    estimatedDelivery: { minDays: 2, maxDays: 5 },
    createdBy: new mongoose.Types.ObjectId(),
  },
  {
    name: "Casual Chinos Trouser",
    slug: "casual-chinos-trouser-men",
    description:
      "Comfortable casual chinos perfect for weekend wear. Available in multiple colors.",
    shortDescription: "Comfortable casual chinos",
    mrp: 2999,
    sellingPrice: 1499,
    brand: "ComfortWear",
    category: "Men",
    subcategory: "Trousers",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Khaki", code: "#C3B091", images: [] },
      { name: "Navy", code: "#001f3f", images: [] },
      { name: "Grey", code: "#808080", images: [] },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1473181308946-448a04e51179?w=500",
        alt: "Chinos Trouser",
        isPrimary: true,
      },
    ],
    tags: ["chinos", "casual", "trouser", "men"],
    stock: 40,
    sku: "SJ-MEN-CHINOS-001",
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    ratings: 4.4,
    numReviews: 156,
    weight: 350,
    material: "98% Cotton, 2% Elastane",
    returnDays: 7,
    isReturnable: true,
    isExchangeable: true,
    gst: 18,
    estimatedDelivery: { minDays: 2, maxDays: 5 },
    createdBy: new mongoose.Types.ObjectId(),
  },

  // FOOTWEAR
  {
    name: "Sports Running Shoes",
    slug: "sports-running-shoes",
    description:
      "High-performance running shoes with advanced cushioning technology. Designed for comfort and durability.",
    shortDescription: "Advanced running shoes",
    mrp: 5999,
    sellingPrice: 2999,
    brand: "ProFit",
    category: "Footwear",
    subcategory: "Sports Shoes",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: [
      { name: "Black", code: "#000000", images: [] },
      { name: "White", code: "#FFFFFF", images: [] },
      { name: "Red", code: "#FF0000", images: [] },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        alt: "Running Shoes",
        isPrimary: true,
      },
    ],
    tags: ["shoes", "sports", "running", "footwear"],
    stock: 52,
    sku: "SJ-SHOES-RUNNING-001",
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    ratings: 4.7,
    numReviews: 421,
    weight: 450,
    material: "Mesh + Synthetic",
    returnDays: 14,
    isReturnable: true,
    isExchangeable: true,
    gst: 18,
    estimatedDelivery: { minDays: 3, maxDays: 6 },
    createdBy: new mongoose.Types.ObjectId(),
  },

  // ACCESSORIES
  {
    name: "Casual Backpack",
    slug: "casual-backpack-travel",
    description:
      "Spacious casual backpack perfect for daily use and travel. Multiple compartments for organization.",
    shortDescription: "Versatile travel backpack",
    mrp: 2499,
    sellingPrice: 1249,
    brand: "VoyageGear",
    category: "Accessories",
    subcategory: "Bags",
    sizes: ["One Size"],
    colors: [
      { name: "Black", code: "#000000", images: [] },
      { name: "Navy", code: "#001f3f", images: [] },
      { name: "Grey", code: "#808080", images: [] },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Backpack",
        isPrimary: true,
      },
    ],
    tags: ["backpack", "bag", "travel", "accessories"],
    stock: 38,
    sku: "SJ-BAG-BACKPACK-001",
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    ratings: 4.5,
    numReviews: 203,
    weight: 600,
    material: "Polyester",
    returnDays: 14,
    isReturnable: true,
    isExchangeable: true,
    gst: 18,
    estimatedDelivery: { minDays: 2, maxDays: 5 },
    createdBy: new mongoose.Types.ObjectId(),
  },
  {
    name: "Stylish Sunglasses",
    slug: "stylish-sunglasses-uv",
    description:
      "Premium sunglasses with 100% UV protection. Stylish design suitable for all face shapes.",
    shortDescription: "UV-protected stylish sunglasses",
    mrp: 1999,
    sellingPrice: 999,
    brand: "VisionStyle",
    category: "Accessories",
    subcategory: "Eyewear",
    sizes: ["One Size"],
    colors: [
      { name: "Black Lens", code: "#000000", images: [] },
      { name: "Brown Lens", code: "#8B4513", images: [] },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
        alt: "Sunglasses",
        isPrimary: true,
      },
    ],
    tags: ["sunglasses", "eyewear", "accessories"],
    stock: 60,
    sku: "SJ-ACCESSORY-SUNGLASSES-001",
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: false,
    ratings: 4.6,
    numReviews: 175,
    weight: 50,
    material: "Polycarbonate",
    returnDays: 14,
    isReturnable: true,
    isExchangeable: true,
    gst: 18,
    estimatedDelivery: { minDays: 2, maxDays: 4 },
    createdBy: new mongoose.Types.ObjectId(),
  },

  // HOME & LIVING
  {
    name: "Premium Bedsheet Set",
    slug: "premium-bedsheet-set-cotton",
    description:
      "Luxurious 600 TC cotton bedsheet set. Includes 1 fitted sheet, 1 flat sheet, and 2 pillowcases.",
    shortDescription: "600 TC premium cotton bedsheets",
    mrp: 3999,
    sellingPrice: 1999,
    brand: "HomeComfort",
    category: "Home & Living",
    subcategory: "Bedding",
    sizes: ["Single", "Double", "King"],
    colors: [
      { name: "White", code: "#FFFFFF", images: [] },
      { name: "Blue", code: "#0000FF", images: [] },
      { name: "Beige", code: "#F5F5DC", images: [] },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1615200491411-07be7200a8ee?w=500",
        alt: "Bedsheet Set",
        isPrimary: true,
      },
    ],
    tags: ["bedsheet", "cotton", "home", "bedroom"],
    stock: 28,
    sku: "SJ-HOME-BEDSHEET-001",
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    ratings: 4.8,
    numReviews: 289,
    weight: 800,
    material: "100% Cotton",
    returnDays: 7,
    isReturnable: true,
    isExchangeable: true,
    gst: 18,
    estimatedDelivery: { minDays: 2, maxDays: 5 },
    createdBy: new mongoose.Types.ObjectId(),
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    const adminId = new mongoose.Types.ObjectId();
    const productsWithAdmin = sampleProducts.map((product) => ({
      ...product,
      createdBy: adminId,
    }));

    const inserted = await Product.insertMany(productsWithAdmin);
    console.log(`✓ Inserted ${inserted.length} products`);

    // Print summary
    console.log("\n📊 PRODUCT SUMMARY:");
    const byCategory = {};
    inserted.forEach((p) => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    });
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} products`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
