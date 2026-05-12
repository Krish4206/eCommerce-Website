import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    title: {
      type: String,
      required: [true, "Please provide review title"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Please provide review comment"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
      minlength: [10, "Comment must be at least 10 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Please provide rating"],
      min: 1,
      max: 5,
    },
    // Detailed ratings for different aspects
    detailedRatings: {
      quality: { type: Number, min: 1, max: 5 },
      fitAndSize: { type: Number, min: 1, max: 5 },
      delivery: { type: Number, min: 1, max: 5 },
      valueForMoney: { type: Number, min: 1, max: 5 },
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    helpful: {
      type: Number,
      default: 0,
    },
    unhelpful: {
      type: Number,
      default: 0,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Prevent duplicate reviews from same user for same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, isApproved: 1 });
reviewSchema.index({ createdAt: -1 });

export const Review = mongoose.model("Review", reviewSchema);
