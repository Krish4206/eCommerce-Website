import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please provide coupon code"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: String,
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, "Please provide discount value"],
      min: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: Number,

    // Validity
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Usage Limits
    maxUsageCount: Number,
    maxUsagePerUser: {
      type: Number,
      default: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
    },

    // Applicable Categories/Products
    applicableCategories: [String],
    applicableProducts: [mongoose.Schema.Types.ObjectId],
    excludedProducts: [mongoose.Schema.Types.ObjectId],

    // User Restrictions
    applicableUsers: [mongoose.Schema.Types.ObjectId],
    excludedUsers: [mongoose.Schema.Types.ObjectId],

    // Conditions
    requiresMinimumOrder: Boolean,
    freeShipping: Boolean,
    stackable: { type: Boolean, default: false },

    // Tracking
    usedBy: [
      {
        user: mongoose.Schema.Types.ObjectId,
        usedAt: Date,
        order: mongoose.Schema.Types.ObjectId,
        discountAmount: Number,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, endDate: 1 });

export const Coupon = mongoose.model("Coupon", couponSchema);
