import express from "express";
import {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  markHelpful,
} from "../../controllers/reviewController.js";
import { catchAsyncErrors } from "../../middleware/errorHandler.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
// Get reviews for a product
router.get("/:productId", catchAsyncErrors(getProductReviews));

// Protected routes (require authentication)
// Add review
router.post("/:productId", verifyToken, catchAsyncErrors(addReview));

// Update review
router.put("/:reviewId", verifyToken, catchAsyncErrors(updateReview));

// Delete review
router.delete("/:reviewId", verifyToken, catchAsyncErrors(deleteReview));

// Mark review as helpful/unhelpful
router.post("/:reviewId/helpful", verifyToken, catchAsyncErrors(markHelpful));

export default router;
