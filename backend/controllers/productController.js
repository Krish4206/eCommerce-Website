import { Product } from '../models/Product.js';
import { APIError } from '../middleware/errorHandler.js';

// Get featured products (highest rated)
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } })
      .select('-createdBy')
      .sort({ ratings: -1 })
      .limit(8)
      .lean();

    res.status(200).json({
      status: true,
      message: 'Featured products retrieved successfully',
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};

// Get all products with filtering, searching, and pagination
export const getAllProducts = async (req, res, next) => {
  try {
    const { 
      search, 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      sortBy, 
      page = 1, 
      limit = 12 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Handle sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'rating':
        sortOptions = { ratings: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Calculate pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination info
    const total = await Product.countDocuments(filter);

    // Fetch products
    const products = await Product.find(filter)
      .select('-createdBy')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      status: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .select('-createdBy')
      .populate('createdBy', 'name email role');

    if (!product) {
      throw new APIError('Product not found', 404);
    }

    res.status(200).json({
      status: true,
      message: 'Product retrieved successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// Create product (admin only)
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discount, brand, category, sizes, colors, stock } = req.body;

    // Validate required fields
    if (!name || !description || !price || !brand || !category || stock === undefined) {
      throw new APIError('Please provide all required fields', 400);
    }

    // Check if product name already exists (optional)
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      throw new APIError('Product with this name already exists', 409);
    }

    // Create product object
    const productData = {
      name,
      description,
      price: Number(price),
      discount: discount ? Number(discount) : 0,
      brand,
      category,
      stock: Number(stock),
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      createdBy: req.user.id,
      images: req.files ? req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      })) : []
    };

    const product = await Product.create(productData);

    res.status(201).json({
      status: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// Update product (admin only)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, discount, brand, category, sizes, colors, stock } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      throw new APIError('Product not found', 404);
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (discount !== undefined) product.discount = Number(discount);
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (sizes) product.sizes = JSON.parse(sizes);
    if (colors) product.colors = JSON.parse(colors);

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      product.images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    await product.save();

    res.status(200).json({
      status: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// Delete product (admin only)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new APIError('Product not found', 404);
    }

    res.status(200).json({
      status: true,
      message: 'Product deleted successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments({ 
      category: { $regex: category, $options: 'i' } 
    });

    const products = await Product.find({ 
      category: { $regex: category, $options: 'i' } 
    })
      .select('-createdBy')
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      status: true,
      message: 'Category products retrieved successfully',
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');

    res.status(200).json({
      status: true,
      message: 'Categories retrieved successfully',
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

// Get all brands
export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await Product.distinct('brand');

    res.status(200).json({
      status: true,
      message: 'Brands retrieved successfully',
      data: { brands }
    });
  } catch (error) {
    next(error);
  }
};
