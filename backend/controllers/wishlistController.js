import { Wishlist } from "../models/Wishlist.js";
import { Product } from "../models/Product.js";
import { APIError } from "../middleware/errorHandler.js";

// Get user's wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ user: userId })
      .populate({
        path: "items.product",
        select:
          "name slug mrp price sellingPrice discount brand category images ratings stock",
      })
      .lean();

    if (!wishlist) {
      wishlist = {
        user: userId,
        items: [],
        totalItems: 0,
      };
    }

    res.status(200).json({
      status: true,
      message: "Wishlist retrieved successfully",
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// Add item to wishlist
export const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new APIError("Product not found", 404);
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: [{ product: productId }],
        totalItems: 1,
      });
    } else {
      // Check if product already in wishlist
      const itemExists = wishlist.items.some(
        (item) => item.product.toString() === productId,
      );

      if (!itemExists) {
        wishlist.items.push({ product: productId });
        wishlist.totalItems = wishlist.items.length;
      }
    }

    await wishlist.save();

    // Update product wishlist count
    await Product.findByIdAndUpdate(productId, { $inc: { wishlistCount: 1 } });

    res.status(200).json({
      status: true,
      message: "Item added to wishlist successfully",
      data: { totalItems: wishlist.totalItems },
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      throw new APIError("Wishlist not found", 404);
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId,
    );
    wishlist.totalItems = wishlist.items.length;

    await wishlist.save();

    // Update product wishlist count
    await Product.findByIdAndUpdate(productId, { $inc: { wishlistCount: -1 } });

    res.status(200).json({
      status: true,
      message: "Item removed from wishlist successfully",
      data: { totalItems: wishlist.totalItems },
    });
  } catch (error) {
    next(error);
  }
};

// Check if product in wishlist
export const isInWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId || req.query.productId;

    const wishlist = await Wishlist.findOne({
      user: userId,
      "items.product": productId,
    });

    res.status(200).json({
      status: true,
      data: { isInWishlist: !!wishlist },
    });
  } catch (error) {
    next(error);
  }
};

// Clear wishlist
export const clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { items: [], totalItems: 0 },
      { new: true },
    );

    res.status(200).json({
      status: true,
      message: "Wishlist cleared successfully",
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,
};
