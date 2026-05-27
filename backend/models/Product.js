import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },

    // Pricing
    price: {
      type: Number,
      required: [true, "Please provide price"],
      min: 0,
    },
    mrp: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Categorization
    brand: {
      type: String,
      required: [true, "Please provide brand name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please provide category"],
      enum: [
        "Men",
        "Women",
        "Kids",
        "Home & Living",
        "Accessories",
        "Footwear",
        "Sports",
      ],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    tags: [String],

    // Variants
    sizes: {
      type: [String],
      default: [],
    },
    colors: [
      {
        name: String,
        code: String,
        images: [String],
      },
    ],

    // Images
    images: [
      {
        url: String,
        public_id: String,
        alt: String,
        isPrimary: { type: Boolean, default: false },
      },
    ],
    thumbnail: String,

    // Ratings & Reviews
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: function (val) {
        return Math.round(val * 2) / 2; // Round to nearest 0.5
      },
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    ratingDistribution: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 },
    },

    // Stock & Availability
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },

    // Shipping & Delivery
    weight: Number, // in grams
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    freeShippingAbove: Number,
    estimatedDelivery: {
      minDays: { type: Number, default: 2 },
      maxDays: { type: Number, default: 5 },
    },

    // Business Logic
    gst: {
      type: Number,
      default: 18,
      min: 0,
      max: 100,
    },
    isReturnable: {
      type: Boolean,
      default: true,
    },
    returnDays: {
      type: Number,
      default: 7,
    },
    isExchangeable: {
      type: Boolean,
      default: true,
    },

    // Additional Info
    material: String,
    careInstructions: String,
    countryOfOrigin: String,
    guaranteeInfo: String,
    warrantyInfo: String,

    // SEO
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],

    // Admin tracking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: mongoose.Schema.Types.ObjectId,

    viewCount: {
      type: Number,
      default: 0,
    },
    wishlistCount: {
      type: Number,
      default: 0,
    },
    cartCount: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

// Auto-generate slug from name before saving
productSchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();

  if (!this.slug || this.isModified("name")) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 80);

    // Check if slug already exists
    let slug = baseSlug;
    let counter = 1;
    const Product = mongoose.model("Product");
    while (await Product.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

// Indexes for better query performance
productSchema.index({ name: "text", description: "text", brand: "text" });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ ratings: -1 });
productSchema.index({ slug: 1 });

export const Product = mongoose.model("Product", productSchema);
