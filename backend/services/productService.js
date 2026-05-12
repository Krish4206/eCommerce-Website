import { Product } from '../models/Product.js';
import { APIError } from '../middleware/errorHandler.js';

export const productService = {
  // Get all products with filters
  getAllProducts: async (filters) => {
    const { search, category, brand, minPrice, maxPrice, page = 1, limit = 12, sortBy } = filters;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = { $regex: category, $options: 'i' };
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .lean();
    
    return { products, total, page, limit, pages: Math.ceil(total / limit) };
  },

  // Get product by ID
  getProductById: async (productId) => {
    const product = await Product.findById(productId).select('-createdBy');
    if (!product) throw new APIError('Product not found', 404);
    return product;
  },

  // Create product
  createProduct: async (productData) => {
    return await Product.create(productData);
  },

  // Update product
  updateProduct: async (productId, updateData) => {
    const product = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    if (!product) throw new APIError('Product not found', 404);
    return product;
  },

  // Delete product
  deleteProduct: async (productId) => {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) throw new APIError('Product not found', 404);
    return product;
  }
};
