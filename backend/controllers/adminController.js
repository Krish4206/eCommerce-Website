import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { Cart } from "../models/Cart.js";
import { APIError } from "../middleware/errorHandler.js";

// ==================== PRODUCT MANAGEMENT ====================

// Get all products with detailed stats (admin)
export const getProductsWithStats = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, status } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (category) filter.category = { $regex: category, $options: "i" };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNum)
      .populate("createdBy", "name email");

    res.status(200).json({
      status: true,
      message: "Products with stats retrieved",
      data: {
        products,
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

// Update product stock (admin)
export const updateProductStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      throw new APIError("Valid stock quantity required", 400);
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { stock },
      { new: true },
    );

    if (!product) throw new APIError("Product not found", 404);

    res.status(200).json({
      status: true,
      message: "Stock updated successfully",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// Bulk update products (admin)
export const bulkUpdateProducts = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      throw new APIError("Products array required", 400);
    }

    const results = [];
    for (const prod of products) {
      const updated = await Product.findByIdAndUpdate(
        prod.id,
        { ...prod.data },
        { new: true },
      );
      if (updated) results.push(updated);
    }

    res.status(200).json({
      status: true,
      message: `Updated ${results.length} products`,
      data: { products: results },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== INVENTORY MANAGEMENT ====================

// Get low stock products
export const getLowStockProducts = async (req, res, next) => {
  try {
    const { threshold = 10 } = req.query;

    const products = await Product.find({
      stock: { $lte: Number(threshold) },
    }).sort({ stock: 1 });

    res.status(200).json({
      status: true,
      message: "Low stock products retrieved",
      data: {
        threshold: Number(threshold),
        products,
        count: products.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get out of stock products
export const getOutOfStockProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ stock: 0 });

    res.status(200).json({
      status: true,
      message: "Out of stock products retrieved",
      data: { products, count: products.length },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ORDER MANAGEMENT ====================

// Get order statistics
export const getOrderStatistics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const totalOrders = await Order.countDocuments(filter);
    const totalRevenue = await Order.aggregate([
      { $match: filter },
      { $match: { "paymentInfo.status": "completed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const ordersByStatus = await Order.aggregate([
      { $match: filter },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const paymentMethods = await Order.aggregate([
      { $match: filter },
      { $group: { _id: "$paymentInfo.method", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      status: true,
      message: "Order statistics retrieved",
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus,
        paymentMethods,
        dateRange: { startDate, endDate },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get sales dashboard
export const getSalesDashboard = async (req, res, next) => {
  try {
    // Last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          "paymentInfo.status": "completed",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topProducts = await Order.aggregate([
      {
        $match: {
          "paymentInfo.status": "completed",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
    ]);

    const totalStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          "paymentInfo.status": "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json({
      status: true,
      message: "Sales dashboard retrieved",
      data: {
        period: "30 days",
        dailySales,
        topProducts,
        totalStats: totalStats[0] || {
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== USER MANAGEMENT ====================

// Get all users with stats (admin)
export const getAllUsersWithStats = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { role: { $ne: null } };
    if (role) filter.role = role;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password -refreshTokens")
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      status: true,
      message: "Users retrieved",
      data: {
        users,
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

// Get user activity
export const getUserActivity = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password -refreshTokens");
    if (!user) throw new APIError("User not found", 404);

    const userOrders = await Order.countDocuments({ user: userId });
    const userCart = await Cart.findOne({ user: userId });
    const cartItems = userCart?.items?.length || 0;

    res.status(200).json({
      status: true,
      message: "User activity retrieved",
      data: {
        user,
        activity: {
          totalOrders: userOrders,
          cartItems,
          createdAt: user.createdAt,
          lastLogin: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Ban/Unban user
export const toggleUserBan = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { banned } = req.body;

    if (typeof banned !== "boolean") {
      throw new APIError("Boolean banned value required", 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: !banned },
      { new: true },
    ).select("-password -refreshTokens");

    if (!user) throw new APIError("User not found", 404);

    res.status(200).json({
      status: true,
      message: `User ${banned ? "banned" : "unbanned"} successfully`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ANALYTICS ====================

// Get comprehensive analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // User metrics
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Product metrics
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: 10 },
    });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    // Order metrics
    const totalOrders = await Order.countDocuments(filter);
    const completedOrders = await Order.countDocuments({
      ...filter,
      "paymentInfo.status": "completed",
    });
    const pendingOrders = await Order.countDocuments({
      ...filter,
      orderStatus: "pending",
    });

    // Revenue metrics
    const revenue = await Order.aggregate([
      {
        $match: {
          ...filter,
          "paymentInfo.status": "completed",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const categoryDistribution = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      status: true,
      message: "Analytics retrieved",
      data: {
        userMetrics: { totalUsers, totalAdmins },
        productMetrics: { totalProducts, lowStockProducts, outOfStockProducts },
        orderMetrics: { totalOrders, completedOrders, pendingOrders },
        revenue: revenue[0]?.total || 0,
        categoryDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get category analytics
export const getCategoryAnalytics = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          totalStock: { $sum: "$stock" },
          avgRating: { $avg: "$ratings" },
        },
      },
      { $sort: { totalProducts: -1 } },
    ]);

    res.status(200).json({
      status: true,
      message: "Category analytics retrieved",
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== MAINTENANCE ====================

// Clear expired tokens (optional maintenance)
export const performMaintenance = async (req, res, next) => {
  try {
    const { action } = req.body;

    if (!action) throw new APIError("Action parameter required", 400);

    let result = {};

    switch (action) {
      case "cleanup-empty-carts":
        const emptyCartsDeleted = await Cart.deleteMany({
          items: { $size: 0 },
        });
        result = { deletedEmptyCarts: emptyCartsDeleted.deletedCount };
        break;

      case "reset-account-locks":
        const now = new Date();
        const unlocked = await User.updateMany(
          { lockUntil: { $lt: now } },
          { $set: { lockUntil: null, loginAttempts: 0 } },
        );
        result = { unlockedAccounts: unlocked.modifiedCount };
        break;

      default:
        throw new APIError("Invalid action", 400);
    }

    res.status(200).json({
      status: true,
      message: "Maintenance completed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Export system data (admin)
export const exportSystemData = async (req, res, next) => {
  try {
    const { format = "json" } = req.query;

    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const carts = await Cart.countDocuments();

    const data = {
      exportDate: new Date().toISOString(),
      statistics: {
        totalUsers: users,
        totalProducts: products,
        totalOrders: orders,
        totalCarts: carts,
      },
      version: "1.0.0",
    };

    if (format === "csv") {
      res.set("Content-Type", "text/csv");
      res.set("Content-Disposition", 'attachment; filename="export.csv"');
      const csv = Object.entries(data.statistics)
        .map(([k, v]) => `${k},${v}`)
        .join("\n");
      res.send(csv);
    } else {
      res.json({
        status: true,
        message: "System data exported",
        data,
      });
    }
  } catch (error) {
    next(error);
  }
};
