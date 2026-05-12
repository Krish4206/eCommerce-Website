import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { APIError } from "../middleware/errorHandler.js";

// Create order from cart
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.zipCode
    ) {
      throw new APIError("Please provide complete shipping address", 400);
    }

    // Get user cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      throw new APIError("Cart is empty. Cannot create order", 400);
    }

    // Validate stock for all items
    for (const item of cart.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        throw new APIError(
          `${product.name} has only ${product.stock} items left`,
          400,
        );
      }
    }

    // Create order object
    const orderData = {
      orderNumber: `SJ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        productName: item.product.name,
        brand: item.product.brand,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        discount: item.product.discount || 0,
        total: item.price * item.quantity,
      })),
      subtotal: cart.totalPrice,
      totalAmount: cart.totalPrice,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod || "card",
        status: "pending",
      },
      orderStatus: "pending",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Create order in DB
    const order = await Order.create(orderData);

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Generate mock payment link
    const paymentResponse = await generatePaymentLink(
      order._id,
      cart.totalPrice,
      paymentMethod,
    );

    res.status(201).json({
      status: true,
      message: "Order created successfully",
      data: {
        order,
        payment: paymentResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Generate mock payment link
const generatePaymentLink = async (orderId, amount, method) => {
  // Mock Razorpay integration
  const mockOrderId = `razorpay_order_${Date.now()}`;
  const mockPaymentId = `razorpay_payment_${Date.now()}`;

  return {
    orderCreated: true,
    razorpayOrderId: mockOrderId,
    razorpayPublicKey: process.env.RAZORPAY_KEY_ID || "test_key",
    amount: amount * 100, // Convert to paise
    currency: "INR",
    paymentUrl: `/payment/${orderId}`,
    method,
    mockPaymentId,
  };
};

// Mock payment verification
export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId) {
      throw new APIError("Invalid payment details", 400);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new APIError("Order not found", 404);
    }

    // Mock payment verification - in production use Razorpay API
    const isVerified = true; // Simulated verification

    if (!isVerified) {
      order.paymentInfo.status = "failed";
      await order.save();
      throw new APIError("Payment verification failed", 400);
    }

    // Update order payment status
    order.paymentInfo.status = "completed";
    order.paymentInfo.transactionId = paymentId;
    order.orderStatus = "confirmed";
    await order.save();

    // Clear user cart after successful payment
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], totalPrice: 0 },
    );

    res.status(200).json({
      status: true,
      message: "Payment verified successfully",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

// Get user orders
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { user: userId };
    if (status) {
      filter.orderStatus = status;
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      status: true,
      message: "User orders retrieved successfully",
      data: {
        orders,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single order
export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId)
      .populate("items.product", "name price images brand category")
      .populate("user", "name email phone");

    if (!order) {
      throw new APIError("Order not found", 404);
    }

    // Users can only see their own orders
    if (order.user._id.toString() !== userId.toString()) {
      throw new APIError("Unauthorized to view this order", 403);
    }

    res.status(200).json({
      status: true,
      message: "Order retrieved successfully",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, sortBy = "newest" } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (status) {
      filter.orderStatus = status;
    }

    let sortOptions = {};
    switch (sortBy) {
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "highest-price":
        sortOptions = { totalPrice: -1 };
        break;
      case "lowest-price":
        sortOptions = { totalPrice: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .populate("items.product", "name price")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      status: true,
      message: "All orders retrieved successfully",
      data: {
        orders,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (
      !status ||
      !["pending", "confirmed", "shipped", "delivered", "cancelled"].includes(
        status,
      )
    ) {
      throw new APIError("Invalid order status", 400);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true },
    ).populate("items.product");

    if (!order) {
      throw new APIError("Order not found", 404);
    }

    // If cancelled, restore stock
    if (status === "cancelled" && order.orderStatus !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    res.status(200).json({
      status: true,
      message: "Order status updated successfully",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

// Get order tracking
export const trackOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).select(
      "orderStatus trackingNumber estimatedDelivery createdAt items totalPrice",
    );

    if (!order) {
      throw new APIError("Order not found", 404);
    }

    const tracking = {
      orderId: order._id,
      status: order.orderStatus,
      trackingNumber: order.trackingNumber || "Not yet shipped",
      estimatedDelivery: order.estimatedDelivery,
      orderDate: order.createdAt,
      totalItems: order.items.length,
      totalPrice: order.totalPrice,
    };

    res.status(200).json({
      status: true,
      message: "Order tracking retrieved successfully",
      data: { tracking },
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new APIError("Order not found", 404);
    }

    // Only users can cancel their own orders, and only before shipped
    if (order.user.toString() !== userId.toString()) {
      throw new APIError("Unauthorized", 403);
    }

    if (["shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
      throw new APIError(
        `Cannot cancel order that is ${order.orderStatus}`,
        400,
      );
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json({
      status: true,
      message: "Order cancelled successfully",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};
