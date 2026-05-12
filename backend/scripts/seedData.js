import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { hashPassword } from "../utils/password.js";

dotenv.config();

const sampleProducts = [
  {
    name: "Classic Fit Polo T-Shirt",
    description:
      "Premium cotton polo t-shirt. Soft, breathable, and perfect for casual or semi-formal wear.",
    mrp: 1999,
    price: 999,
    discount: 50,
    brand: "Sanjish Originals",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", code: "#1a1a2e" },
      { name: "White", code: "#f8f9fa" },
      { name: "Navy", code: "#1e3a5f" },
    ],
    images: [
      { url: "https://picsum.photos/seed/shirt/400/500", public_id: "seed1" },
    ],
    ratings: 4.5,
    numReviews: 234,
    stock: 150,
    isFeatured: true,
    isBestseller: true,
    createdBy: null,
  },
  {
    name: "Slim Fit Stretchable Jeans",
    description:
      "Modern slim fit jeans with 4-way stretch. Comfortable denim that moves with you.",
    mrp: 2999,
    price: 1499,
    discount: 50,
    brand: "DenimCo India",
    category: "Men",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Indigo Blue", code: "#3b3b6d" },
      { name: "Black", code: "#1a1a2e" },
    ],
    images: [
      { url: "https://picsum.photos/seed/jeans/400/500", public_id: "seed2" },
    ],
    ratings: 4.3,
    numReviews: 567,
    stock: 200,
    isFeatured: true,
    createdBy: null,
  },
  {
    name: "Floral Print Maxi Dress",
    description:
      "Elegant floral maxi dress made from lightweight fabric. Perfect for summer events.",
    mrp: 3499,
    price: 1799,
    discount: 48,
    brand: "Femme Style",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Rose Pink", code: "#ff6b8a" },
      { name: "Sky Blue", code: "#87ceeb" },
    ],
    images: [
      { url: "https://picsum.photos/seed/dress/400/500", public_id: "seed3" },
    ],
    ratings: 4.7,
    numReviews: 892,
    stock: 80,
    isFeatured: true,
    isBestseller: true,
    createdBy: null,
  },
  {
    name: "Kurta Set with Dupatta",
    description:
      "Traditional cotton kurta set with embroidered dupatta. Festive and comfortable.",
    mrp: 2499,
    price: 1299,
    discount: 48,
    brand: "Ethnic Vibes",
    category: "Women",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Maroon", code: "#800020" },
      { name: "Teal", code: "#008080" },
      { name: "Mustard", code: "#e1ad01" },
    ],
    images: [
      { url: "https://picsum.photos/seed/kurta/400/500", public_id: "seed4" },
    ],
    ratings: 4.6,
    numReviews: 445,
    stock: 120,
    isNewArrival: true,
    createdBy: null,
  },
  {
    name: "Printed Casual T-Shirt for Boys",
    description:
      "Fun printed cotton t-shirt for active kids. Soft, breathable, and machine washable.",
    mrp: 999,
    price: 499,
    discount: 50,
    brand: "Little Champs",
    category: "Kids",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y"],
    colors: [
      { name: "Red", code: "#dc2626" },
      { name: "Blue", code: "#2563eb" },
    ],
    images: [
      {
        url: "https://picsum.photos/seed/kidshirt/400/500",
        public_id: "seed5",
      },
    ],
    ratings: 4.4,
    numReviews: 178,
    stock: 300,
    isNewArrival: true,
    createdBy: null,
  },
  {
    name: "Handcrafted Leather Loafers",
    description:
      "Premium genuine leather loafers with cushioned insole. Style meets comfort.",
    mrp: 4999,
    price: 2499,
    discount: 50,
    brand: "WalkStyle",
    category: "Footwear",
    sizes: ["7", "8", "9", "10", "11"],
    colors: [
      { name: "Tan Brown", code: "#8b4513" },
      { name: "Black", code: "#1a1a2e" },
    ],
    images: [
      { url: "https://picsum.photos/seed/loafers/400/500", public_id: "seed6" },
    ],
    ratings: 4.5,
    numReviews: 324,
    stock: 60,
    isBestseller: true,
    createdBy: null,
  },
  {
    name: "Designer Silver Earrings Set",
    description:
      "Elegant silver earrings set with oxidized finish. Handcrafted by skilled artisans.",
    mrp: 1999,
    price: 899,
    discount: 55,
    brand: "SilverCraft",
    category: "Accessories",
    sizes: ["One Size"],
    colors: [
      { name: "Silver", code: "#c0c0c0" },
      { name: "Gold Plated", code: "#daa520" },
    ],
    images: [
      {
        url: "https://picsum.photos/seed/earrings/400/500",
        public_id: "seed7",
      },
    ],
    ratings: 4.8,
    numReviews: 678,
    stock: 500,
    isFeatured: true,
    createdBy: null,
  },
  {
    name: "Cotton Printed Bedsheet Set",
    description:
      "King size cotton bedsheet set with 2 pillow covers. Premium 180 thread count.",
    mrp: 2999,
    price: 1299,
    discount: 56,
    brand: "HomeCozz",
    category: "Home & Living",
    sizes: ["Queen", "King"],
    colors: [
      { name: "Teal Pattern", code: "#004d40" },
      { name: "Pink Floral", code: "#f8bbd0" },
    ],
    images: [
      {
        url: "https://picsum.photos/seed/bedsheet/400/500",
        public_id: "seed8",
      },
    ],
    ratings: 4.3,
    numReviews: 234,
    stock: 90,
    isNewArrival: true,
    createdBy: null,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Create admin user if not exists
    let adminUser = await User.findOne({ email: "admin@ecommerce.com" });
    if (!adminUser) {
      adminUser = await User.create({
        name: "Admin User",
        email: "admin@ecommerce.com",
        password: "Admin@123", // Don't hash - model middleware will do it
        role: "admin",
      });
      console.log("Admin user created");
    }

    // Add createdBy to products
    const productsWithCreator = sampleProducts.map((p) => ({
      ...p,
      createdBy: adminUser._id,
    }));

    // Insert products
    const products = await Product.insertMany(productsWithCreator);
    console.log(`Seeded ${products.length} products`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDatabase();
