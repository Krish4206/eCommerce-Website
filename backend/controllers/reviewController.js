import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { APIError } from "../middleware/errorHandler.js";

// Get reviews for a product
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = "recent" } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    let sortOptions = {};
    switch (sortBy) {
      case "helpful":
        sortOptions = { helpful: -1 };
        break;
      case "rating-high":
        sortOptions = { rating: -1 };
        break;
      case "rating-low":
        sortOptions = { rating: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const total = await Review.countDocuments({
      product: productId,
      isApproved: true,
    });

    const reviews = await Review.find({
      product: productId,
      isApproved: true,
    })
      .populate("user", "name avatar")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Calculate rating distribution
    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    const allReviews = await Review.find({
      product: productId,
      isApproved: true,
    })
      .select("rating")
      .lean();

    allReviews.forEach((review) => {
      ratingDistribution[review.rating]++;
    });

    res.status(200).json({
      status: true,
      message: "Reviews retrieved successfully",
      data: {
        reviews,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
        ratingDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Add review
export const addReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { title, comment, rating, detailedRatings, images, orderId } =
      req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new APIError("Product not found", 404);
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      throw new APIError("You have already reviewed this product", 400);
    }

    // Check if user purchased this product
    let isVerifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        user: userId,
        "items.product": productId,
      });
      isVerifiedPurchase = !!order;
    }

    const review = new Review({
      product: productId,
      user: userId,
      order: orderId,
      title,
      comment,
      rating: Math.round(rating),
      detailedRatings,
      images: images || [],
      isVerifiedPurchase,
      isApproved: true, // In production, this might need admin approval
    });

    await review.save();

    // Update product ratings
    const allReviews = await Review.find({
      product: productId,
      isApproved: true,
    })
      .select("rating")
      .lean();

    const avgRating = (
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    ).toFixed(1);

    await Product.findByIdAndUpdate(productId, {
      ratings: avgRating,
      numReviews: allReviews.length,
    });

    res.status(201).json({
      status: true,
      message: "Review added successfully",
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

// Update review
export const updateReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;
    const { title, comment, rating, detailedRatings } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      throw new APIError("Review not found", 404);
    }

    if (review.user.toString() !== userId && req.user.role !== "admin") {
      throw new APIError("You are not authorized to update this review", 403);
    }

    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.rating = rating || review.rating;
    review.detailedRatings = detailedRatings || review.detailedRatings;

    await review.save();

    // Update product ratings
    const allReviews = await Review.find({
      product: review.product,
      isApproved: true,
    })
      .select("rating")
      .lean();

    const avgRating = (
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    ).toFixed(1);

    await Product.findByIdAndUpdate(review.product, {
      ratings: avgRating,
      numReviews: allReviews.length,
    });

    res.status(200).json({
      status: true,
      message: "Review updated successfully",
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

// Delete review
export const deleteReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      throw new APIError("Review not found", 404);
    }

    if (review.user.toString() !== userId && req.user.role !== "admin") {
      throw new APIError("You are not authorized to delete this review", 403);
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);

    // Update product ratings
    const allReviews = await Review.find({
      product: productId,
      isApproved: true,
    })
      .select("rating")
      .lean();

    if (allReviews.length > 0) {
      const avgRating = (
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      ).toFixed(1);
      await Product.findByIdAndUpdate(productId, {
        ratings: avgRating,
        numReviews: allReviews.length,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        ratings: 0,
        numReviews: 0,
      });
    }

    res.status(200).json({
      status: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Mark review as helpful
export const markHelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { isHelpful } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      throw new APIError("Review not found", 404);
    }

    if (isHelpful) {
      review.helpful += 1;
    } else {
      review.unhelpful += 1;
    }

    await review.save();

    res.status(200).json({
      status: true,
      message: "Review marked successfully",
      data: { helpful: review.helpful, unhelpful: review.unhelpful },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  markHelpful,
};
