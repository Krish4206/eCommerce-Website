import { Coupon } from "../models/Coupon.js";
import { APIError } from "../middleware/errorHandler.js";

// Get available coupons
export const getAvailableCoupons = async (req, res, next) => {
  try {
    const { cartValue } = req.query;

    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
      $expr: { $lt: ["$usageCount", "$maxUsageCount"] },
    })
      .select(
        "code description discountType discountValue minOrderValue maxDiscountAmount",
      )
      .lean();

    // Filter by minimum order value if provided
    const filteredCoupons = cartValue
      ? coupons.filter(
          (c) => !c.minOrderValue || Number(cartValue) >= c.minOrderValue,
        )
      : coupons;

    res.status(200).json({
      status: true,
      message: "Coupons retrieved successfully",
      data: { coupons: filteredCoupons },
    });
  } catch (error) {
    next(error);
  }
};

// Validate coupon code
export const validateCoupon = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { code, cartValue } = req.body;

    if (!code) {
      throw new APIError("Coupon code is required", 400);
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!coupon) {
      throw new APIError("Invalid or expired coupon code", 400);
    }

    // Check usage limit
    if (coupon.maxUsageCount && coupon.usageCount >= coupon.maxUsageCount) {
      throw new APIError("This coupon has reached its usage limit", 400);
    }

    // Check per user usage limit
    if (coupon.maxUsagePerUser && userId) {
      const userUsageCount = coupon.usedBy.filter(
        (u) => u.user.toString() === userId,
      ).length;

      if (userUsageCount >= coupon.maxUsagePerUser) {
        throw new APIError("You have already used this coupon", 400);
      }
    }

    // Check minimum order value
    if (coupon.minOrderValue && Number(cartValue) < coupon.minOrderValue) {
      throw new APIError(
        `Minimum order value of ₹${coupon.minOrderValue} required`,
        400,
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round(
        (Number(cartValue) * coupon.discountValue) / 100,
      );
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.status(200).json({
      status: true,
      message: "Coupon is valid",
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        freeShipping: coupon.freeShipping,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get coupon details
export const getCouponDetails = async (req, res, next) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    }).select("-usedBy");

    if (!coupon) {
      throw new APIError("Coupon not found", 404);
    }

    res.status(200).json({
      status: true,
      message: "Coupon details retrieved successfully",
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

// Apply coupon (record usage)
export const applyCoupon = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { code, discountAmount, orderId } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      throw new APIError("Coupon not found", 404);
    }

    // Add usage record
    coupon.usedBy.push({
      user: userId,
      usedAt: new Date(),
      order: orderId,
      discountAmount,
    });
    coupon.usageCount += 1;

    await coupon.save();

    res.status(200).json({
      status: true,
      message: "Coupon applied successfully",
      data: { coupon: coupon.code },
    });
  } catch (error) {
    next(error);
  }
};

// ============= ADMIN ROUTES =============

// Create coupon
export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountAmount,
      startDate,
      endDate,
      maxUsageCount,
      maxUsagePerUser,
      freeShipping,
    } = req.body;

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      throw new APIError("Start date must be before end date", 400);
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountAmount,
      startDate,
      endDate,
      maxUsageCount,
      maxUsagePerUser: maxUsagePerUser || 1,
      freeShipping: freeShipping || false,
      createdBy: req.user.id,
    });

    await coupon.save();

    res.status(201).json({
      status: true,
      message: "Coupon created successfully",
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

// Update coupon
export const updateCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params;
    const updates = req.body;

    // Validate dates if updating them
    if (updates.startDate && updates.endDate) {
      if (new Date(updates.startDate) >= new Date(updates.endDate)) {
        throw new APIError("Start date must be before end date", 400);
      }
    }

    const coupon = await Coupon.findByIdAndUpdate(couponId, updates, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      throw new APIError("Coupon not found", 404);
    }

    res.status(200).json({
      status: true,
      message: "Coupon updated successfully",
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

// Delete coupon
export const deleteCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      throw new APIError("Coupon not found", 404);
    }

    res.status(200).json({
      status: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all coupons (admin)
export const getAllCoupons = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const total = await Coupon.countDocuments(filter);

    const coupons = await Coupon.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      status: true,
      message: "Coupons retrieved successfully",
      data: {
        coupons,
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

export default {
  getAvailableCoupons,
  validateCoupon,
  getCouponDetails,
  applyCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
};
