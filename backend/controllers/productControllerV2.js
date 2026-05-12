import { Product } from "../models/Product.js";
import { APIError } from "../middleware/errorHandler.js";

// Utility: Add slug to product
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// ============= PUBLIC ROUTES =============

// Get all products with advanced filtering, searching, and pagination
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      sortBy,
      rating,
      discount,
      page = 1,
      limit = 12,
      onlySale,
      onlyNew,
      onlyBestseller,
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Brand filter
    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand];
      filter.brand = { $in: brands };
    }

    // Price range filter (using selling price)
    if (minPrice || maxPrice) {
      filter.sellingPrice = {};
      if (minPrice) filter.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) filter.sellingPrice.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) {
      filter.ratings = { $gte: Number(rating) };
    }

    // Discount filter
    if (discount) {
      filter.discount = { $gte: Number(discount) };
    }

    // Special filters
    if (onlySale === "true") {
      filter.discount = { $gt: 0 };
    }
    if (onlyNew === "true") {
      filter.isNewArrival = true;
    }
    if (onlyBestseller === "true") {
      filter.isBestseller = true;
    }

    // Sorting options
    let sortOptions = {};
    switch (sortBy) {
      case "price-low":
        sortOptions = { sellingPrice: 1 };
        break;
      case "price-high":
        sortOptions = { sellingPrice: -1 };
        break;
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "rating":
        sortOptions = { ratings: -1 };
        break;
      case "popularity":
        sortOptions = { viewCount: -1 };
        break;
      case "discount":
        sortOptions = { discount: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get total count
    const total = await Product.countDocuments(filter);

    // Fetch products
    const products = await Product.find(filter)
      .select(
        "name slug mrp sellingPrice discount brand category images ratings numReviews stock isFeatured isNewArrival isBestseller",
      )
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get available filters for this category
    const availableBrands = await Product.distinct("brand", {
      ...filter,
      brand: { $exists: true },
    });

    res.status(200).json({
      status: true,
      message: "Products retrieved successfully",
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
        filters: {
          availableBrands: availableBrands.sort(),
          categories: [
            "Men",
            "Women",
            "Kids",
            "Home & Living",
            "Accessories",
            "Footwear",
            "Sports",
          ],
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get featured/trending products
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      stock: { $gt: 0 },
      isFeatured: true,
    })
      .select(
        "name slug mrp sellingPrice discount brand category images ratings numReviews",
      )
      .sort({ ratings: -1, viewCount: -1 })
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      status: true,
      message: "Featured products retrieved successfully",
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// Get best sellers
export const getBestSellers = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      isBestseller: true,
    })
      .select(
        "name slug mrp sellingPrice discount brand category images ratings numReviews",
      )
      .sort({ viewCount: -1 })
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      status: true,
      message: "Best sellers retrieved successfully",
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// Get new arrivals
export const getNewArrivals = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      isNewArrival: true,
    })
      .select(
        "name slug mrp sellingPrice discount brand category images ratings numReviews",
      )
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      status: true,
      message: "New arrivals retrieved successfully",
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// Get on-sale products
export const getOnSaleProducts = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      discount: { $gt: 0 },
    })
      .select(
        "name slug mrp sellingPrice discount brand category images ratings numReviews",
      )
      .sort({ discount: -1 })
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      status: true,
      message: "Sale products retrieved successfully",
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true },
    ).lean();

    if (!product) {
      throw new APIError("Product not found", 404);
    }

    if (!product.isActive) {
      throw new APIError("Product is not available", 404);
    }

    res.status(200).json({
      status: true,
      message: "Product retrieved successfully",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// Get product by slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOneAndUpdate(
      { slug },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).lean();

    if (!product) {
      throw new APIError("Product not found", 404);
    }

    if (!product.isActive) {
      throw new APIError("Product is not available", 404);
    }

    res.status(200).json({
      status: true,
      message: "Product retrieved successfully",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12, sortBy = "newest" } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    let sortOptions = {};
    switch (sortBy) {
      case "price-low":
        sortOptions = { sellingPrice: 1 };
        break;
      case "price-high":
        sortOptions = { sellingPrice: -1 };
        break;
      case "rating":
        sortOptions = { ratings: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const total = await Product.countDocuments({
      category,
      isActive: true,
    });

    const products = await Product.find({
      category,
      isActive: true,
    })
      .select(
        "name slug mrp sellingPrice discount brand category images ratings numReviews",
      )
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      status: true,
      message: "Products by category retrieved successfully",
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = [
      "Men",
      "Women",
      "Kids",
      "Home & Living",
      "Accessories",
      "Footwear",
      "Sports",
    ];

    res.status(200).json({
      status: true,
      message: "Categories retrieved successfully",
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

// Get all brands
export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await Product.distinct("brand", { isActive: true });

    res.status(200).json({
      status: true,
      message: "Brands retrieved successfully",
      data: { brands: brands.sort() },
    });
  } catch (error) {
    next(error);
  }
};

// Search products
export const searchProducts = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      throw new APIError("Search query must be at least 2 characters", 400);
    }

    const products = await Product.find({
      isActive: true,
      $text: { $search: q },
    })
      .select("name slug mrp sellingPrice brand category images")
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      status: true,
      message: "Search results retrieved successfully",
      data: { products, count: products.length },
    });
  } catch (error) {
    next(error);
  }
};

// ============= ADMIN ROUTES =============

// Create product
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      shortDescription,
      mrp,
      sellingPrice,
      brand,
      category,
      sizes,
      colors,
      stock,
      sku,
      ...otherFields
    } = req.body;

    // Generate slug
    const slug = generateSlug(name);

    // Calculate discount
    const discount = Math.round(((mrp - sellingPrice) / mrp) * 100);

    const product = new Product({
      name,
      slug,
      description,
      shortDescription,
      mrp,
      sellingPrice,
      discount,
      brand,
      category,
      sizes: sizes || [],
      colors: colors || [],
      stock,
      sku,
      createdBy: req.user.id,
      ...otherFields,
    });

    await product.save();

    res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, mrp, sellingPrice, ...otherFields } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      throw new APIError("Product not found", 404);
    }

    // Update basic fields
    if (name) {
      product.name = name;
      product.slug = generateSlug(name);
    }

    if (mrp && sellingPrice) {
      product.mrp = mrp;
      product.sellingPrice = sellingPrice;
      product.discount = Math.round(((mrp - sellingPrice) / mrp) * 100);
    }

    // Update other fields
    Object.assign(product, otherFields);
    product.updatedBy = req.user.id;

    await product.save();

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new APIError("Product not found", 404);
    }

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
      data: { productId: id },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProducts,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getOnSaleProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  getAllCategories,
  getAllBrands,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
