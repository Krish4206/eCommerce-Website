import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { APIError } from "../middleware/errorHandler.js";

// Get user cart
export const getUserCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price discount images brand category stock",
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], totalPrice: 0 });
    }

    res.status(200).json({
      status: true,
      message: "Cart retrieved successfully",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

// Add item to cart
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, size, color } = req.body;

    // Validate input
    if (!productId || quantity < 1) {
      throw new APIError("Invalid product ID or quantity", 400);
    }

    // Check product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      throw new APIError("Product not found", 404);
    }

    if (product.stock < quantity) {
      throw new APIError(`Only ${product.stock} items available in stock`, 400);
    }

    // Get or create user cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], totalPrice: 0 });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color,
    );

    if (existingItem) {
      // Update quantity if item exists
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new APIError(
          `Only ${product.stock} items available in stock`,
          400,
        );
      }
      existingItem.quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        price: product.price - (product.price * product.discount) / 100,
      });
    }

    // Calculate total
    await cart.calculateTotal();

    await cart.populate({
      path: "items.product",
      select: "name price discount images brand category stock",
    });

    res.status(201).json({
      status: true,
      message: "Item added to cart successfully",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new APIError("Cart not found", 404);
    }

    // Find and remove item
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId,
    );
    if (itemIndex === -1) {
      throw new APIError("Item not found in cart", 404);
    }

    cart.items.splice(itemIndex, 1);

    // Calculate new total
    await cart.calculateTotal();

    await cart.populate({
      path: "items.product",
      select: "name price discount images brand category stock",
    });

    res.status(200).json({
      status: true,
      message: "Item removed from cart successfully",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
export const updateCartQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      throw new APIError("Quantity must be at least 1", 400);
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new APIError("Cart not found", 404);
    }

    // Find item in cart
    const cartItem = cart.items.find((item) => item._id.toString() === itemId);
    if (!cartItem) {
      throw new APIError("Item not found in cart", 404);
    }

    // Check stock availability
    const product = await Product.findById(cartItem.product);
    if (product.stock < quantity) {
      throw new APIError(`Only ${product.stock} items available in stock`, 400);
    }

    // Update quantity
    cartItem.quantity = quantity;

    // Calculate new total
    await cart.calculateTotal();

    await cart.populate({
      path: "items.product",
      select: "name price discount images brand category stock",
    });

    res.status(200).json({
      status: true,
      message: "Cart updated successfully",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

// Clear entire cart
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new APIError("Cart not found", 404);
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({
      status: true,
      message: "Cart cleared successfully",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

// Get cart summary
export const getCartSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price discount images brand category stock",
    });

    if (!cart) {
      return res.status(200).json({
        status: true,
        message: "Cart is empty",
        data: {
          summary: {
            itemCount: 0,
            totalPrice: 0,
            estimatedDiscount: 0,
            finalPrice: 0,
          },
        },
      });
    }

    // Calculate summary
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const estimatedDiscount = cart.items.reduce((sum, item) => {
      const product = item.product;
      if (product && product.discount) {
        return sum + ((product.price * product.discount) / 100) * item.quantity;
      }
      return sum;
    }, 0);

    res.status(200).json({
      status: true,
      message: "Cart summary retrieved successfully",
      data: {
        summary: {
          itemCount,
          totalPrice: cart.totalPrice,
          estimatedDiscount: Math.round(estimatedDiscount * 100) / 100,
          finalPrice: cart.totalPrice - estimatedDiscount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
