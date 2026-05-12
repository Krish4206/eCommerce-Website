import { Order } from '../models/Order.js';
import { APIError } from '../middleware/errorHandler.js';

export const orderService = {
  // Get user orders
  getUserOrders: async (userId, filters) => {
    const { page = 1, limit = 10, status } = filters;
    
    const query = { user: userId };
    if (status) query.orderStatus = status;
    
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return { orders, total, page, limit, pages: Math.ceil(total / limit) };
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) throw new APIError('Order not found', 404);
    return order;
  },

  // Create order
  createOrder: async (userId, orderData) => {
    return await Order.create({ ...orderData, user: userId });
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      throw new APIError('Invalid status', 400);
    }
    const order = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
    if (!order) throw new APIError('Order not found', 404);
    return order;
  },

  // Get all orders (admin)
  getAllOrders: async (filters) => {
    const { page = 1, limit = 20, status } = filters;
    
    const query = {};
    if (status) query.orderStatus = status;
    
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return { orders, total, page, limit, pages: Math.ceil(total / limit) };
  }
};
