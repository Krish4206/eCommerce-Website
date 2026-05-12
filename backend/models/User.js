import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../utils/password.js";

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default
    },

    // Role & Permissions
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Contact Info
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Please provide a valid phone number"],
      default: null,
    },

    // Profile Info
    avatar: {
      type: String,
      default: null,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", null],
      default: null,
    },
    preferredLanguage: {
      type: String,
      enum: ["English", "Hindi"],
      default: "English",
    },

    // Addresses
    addresses: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        isDefault: { type: Boolean, default: false },
        label: {
          type: String,
          enum: ["home", "work", "other"],
          default: "home",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Primary Address (denormalized for quick access)
    primaryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    // Account Status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    // Security
    passwordResetToken: String,
    passwordResetExpire: Date,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,

    // Login Security
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    lastLogin: Date,
    loginHistory: [
      {
        timestamp: Date,
        ip: String,
        device: String,
      },
    ],

    // Tokens
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 30 * 24 * 60 * 60, // 30 days
        },
      },
    ],

    // Preferences
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: true },
    },

    // Loyalty & Rewards
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    loyaltyTier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
    },

    // Wishlist (reference to wishlist items)
    wishlistCount: {
      type: Number,
      default: 0,
    },

    // Statistics
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    averageOrderValue: {
      type: Number,
      default: 0,
    },

    // Account Info
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await comparePassword(password, this.password);
};

// Method to check if account is locked
userSchema.methods.isAccountLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = async function () {
  // Reset attempts if lock expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  // Increment attempts and lock if exceeded
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  if (this.loginAttempts + 1 >= maxAttempts && !this.isAccountLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + lockTime) };
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function () {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

export const User = mongoose.model("User", userSchema);
