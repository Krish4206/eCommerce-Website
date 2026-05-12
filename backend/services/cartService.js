import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { APIError } from '../middleware/errorHandler.js';

export const cartService = {
  // Get user cart
  getUserCart: async (userId) => {
    let cart = await Cart.findOne({ user: userId })
      .populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], totalPrice: 0 });
    }
    return cart;
  },

  // Add item to cart
  addToCart: async (userId, itemData) => {
    const { productId, quantity = 1, size, color } = itemData;
    
    const product = await Product.findById(productId);
    if (!product) throw new APIError('Product not found', 404);
    if (product.stock < quantity) throw new APIError('Insufficient stock', 400);
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });
    
    const existingItem = cart.items.find(
      i => i.product.toString() === productId && i.size === size && i.color === color
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        price: product.price - (product.price * product.discount / 100)
      });
    }
    
    await cart.calculateTotal();
    return cart;
  },

  // Remove item from cart
  removeFromCart: async (userId, itemId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new APIError('Cart not found', 404);
    
    cart.items = cart.items.filter(i => i._id.toString() !== itemId);
    await cart.calculateTotal();
    return cart;
  },

  // Update item quantity
  updateQuantity: async (userId, itemId, quantity) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new APIError('Cart not found', 404);
    
    const item = cart.items.find(i => i._id.toString() === itemId);
    if (!item) throw new APIError('Item not found', 404);
    
    item.quantity = quantity;
    await cart.calculateTotal();
    return cart;
  },

  // Clear cart
  clearCart: async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new APIError('Cart not found', 404);
    
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    return cart;
  }
};
