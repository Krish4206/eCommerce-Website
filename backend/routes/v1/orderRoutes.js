import express from "express";
import {
  createOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  trackOrder,
  cancelOrder,
} from "../../controllers/orderController.js";
import { catchAsyncErrors } from "../../middleware/errorHandler.js";
import { verifyToken, isAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// User routes
router.post("/", catchAsyncErrors(createOrder));
router.post("/verify-payment", catchAsyncErrors(verifyPayment));
router.get("/", catchAsyncErrors(getUserOrders));
router.get("/track/:orderId", catchAsyncErrors(trackOrder));
router.get("/:orderId", catchAsyncErrors(getOrderById));
router.put("/:orderId/cancel", catchAsyncErrors(cancelOrder));

// Admin routes
router.get("/admin/all", isAdmin, catchAsyncErrors(getAllOrders));
router.put(
  "/admin/:orderId/status",
  isAdmin,
  catchAsyncErrors(updateOrderStatus),
);

export default router;
