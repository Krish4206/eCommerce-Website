import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,
} from "../../controllers/wishlistController.js";
import { catchAsyncErrors } from "../../middleware/errorHandler.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get user's wishlist
router.get("/", catchAsyncErrors(getWishlist));

// Check if product in wishlist
router.get("/check/:productId", catchAsyncErrors(isInWishlist));

// Add to wishlist
router.post("/add", catchAsyncErrors(addToWishlist));

// Remove from wishlist
router.delete("/remove", catchAsyncErrors(removeFromWishlist));

// Clear entire wishlist
router.delete("/clear", catchAsyncErrors(clearWishlist));

export default router;
