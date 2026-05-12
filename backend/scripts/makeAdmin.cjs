const mongoose = require("mongoose");
require("dotenv").config();

async function makeAdmin() {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error("MONGO_URI not set in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const result = await db
      .collection("users")
      .updateOne(
        { email: "sanjishwithkrish@ecommerce.com" },
        { $set: { role: "admin" } },
      );

    if (result.modifiedCount > 0) {
      console.log("✅ User promoted to admin successfully!");
      console.log("Email: sanjishwithkrish@ecommerce.com");
      console.log("Password: Admin@1234");
    } else {
      const user = await db
        .collection("users")
        .findOne({ email: "sanjishwithkrish@ecommerce.com" });
      if (user) {
        console.log("User found but already has role:", user.role);
      } else {
        console.log(
          "User not found with email: sanjishwithkrish@ecommerce.com",
        );
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

makeAdmin();
