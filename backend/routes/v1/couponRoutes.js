import express from "express";
import {
  getAvailableCoupons,
  validateCoupon,
  getCouponDetails,
  applyCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
} from "../../controllers/couponController.js";
import { catchAsyncErrors } from "../../middleware/errorHandler.js";
import { verifyToken, isAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
// Get available coupons
router.get("/", catchAsyncErrors(getAvailableCoupons));

// Get coupon details
router.get("/:code", catchAsyncErrors(getCouponDetails));

// Protected routes
// Validate coupon
router.post("/validate", verifyToken, catchAsyncErrors(validateCoupon));

// Apply coupon
router.post("/apply", verifyToken, catchAsyncErrors(applyCoupon));

// Admin routes
// Create coupon
router.post(
  "/admin/create",
  verifyToken,
  isAdmin,
  catchAsyncErrors(createCoupon),
);

// Get all coupons (admin)
router.get("/admin/all", verifyToken, isAdmin, catchAsyncErrors(getAllCoupons));

// Update coupon
router.put(
  "/admin/:couponId",
  verifyToken,
  isAdmin,
  catchAsyncErrors(updateCoupon),
);

// Delete coupon
router.delete(
  "/admin/:couponId",
  verifyToken,
  isAdmin,
  catchAsyncErrors(deleteCoupon),
);

export default router;
