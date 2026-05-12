// Run via Render Shell: node scripts/makeAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;

    // Create admin if not exists
    const existing = await db
      .collection("users")
      .findOne({ email: "sanjishwithkrish@ecommerce.com" });

    if (!existing) {
      console.log(
        "User not found. Please register first on the frontend with:",
      );
      console.log("Email: sanjishwithkrish@ecommerce.com");
      console.log("Password: Admin@1234");
      process.exit(1);
    }

    await db
      .collection("users")
      .updateOne(
        { email: "sanjishwithkrish@ecommerce.com" },
        { $set: { role: "admin" } },
      );

    console.log("✅ User promoted to ADMIN!");
    console.log("Email: sanjishwithkrish@ecommerce.com");
    console.log("Password: Admin@1234");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

makeAdmin();
