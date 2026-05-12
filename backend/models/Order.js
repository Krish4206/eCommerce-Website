import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Order Reference
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Items
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        brand: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: String,
        color: String,
        price: {
          type: Number,
          required: true,
        },
        discount: Number,
        total: Number,
      },
    ],

    // Pricing Breakdown
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountCode: String,
    shippingCost: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    savings: {
      type: Number,
      default: 0,
    },

    // Delivery Address
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      isDefault: Boolean,
    },
    billingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      isDefault: Boolean,
    },

    // Payment Information
    paymentInfo: {
      method: {
        type: String,
        enum: ["card", "upi", "wallet", "cod", "netbanking"],
        required: true,
      },
      transactionId: String,
      referenceNumber: String,
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      paidAt: Date,
      paymentDetails: {
        cardLast4: String,
        upiId: String,
        walletName: String,
      },
    },

    // Order Status
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        notes: String,
      },
    ],

    // Delivery Tracking
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    deliveryPartner: String,
    trackingUrl: String,

    // Return & Refund
    isReturnable: {
      type: Boolean,
      default: true,
    },
    returnDeadline: Date,
    returnRequest: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected", "completed"],
        default: undefined,
      },
      reason: String,
      requestedAt: Date,
      approvedAt: Date,
      refundAmount: Number,
      refundStatus: {
        type: String,
        enum: ["pending", "processed", "completed"],
        default: undefined,
      },
    },

    // Notes & Communication
    notes: String,
    specialInstructions: String,
    cancelReason: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `SJ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);
