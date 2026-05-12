import express from "express";
import {
  getUserCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  getCartSummary,
} from "../../controllers/cartController.js";
import { catchAsyncErrors } from "../../middleware/errorHandler.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get user cart
router.get("/", catchAsyncErrors(getUserCart));

// Get cart summary
router.get("/summary", catchAsyncErrors(getCartSummary));

// Add to cart
router.post("/add", catchAsyncErrors(addToCart));

// Clear cart (must be before /:itemId)
router.delete("/clear", catchAsyncErrors(clearCart));

// Remove from cart
router.delete("/:itemId", catchAsyncErrors(removeFromCart));

// Update quantity
router.put("/:itemId", catchAsyncErrors(updateCartQuantity));

export default router;
