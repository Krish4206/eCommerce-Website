import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductsByCategory,
  getAllCategories,
  getAllBrands,
  getFeaturedProducts
} from '../../controllers/productController.js';
import { catchAsyncErrors } from '../../middleware/errorHandler.js';
import { verifyToken, isAdmin } from '../../middleware/authMiddleware.js';
import { validateProduct, handleValidationErrors } from '../../utils/validation.js';

const router = express.Router();

// Public routes
router.get('/', catchAsyncErrors(getAllProducts));
router.get('/featured', catchAsyncErrors(getFeaturedProducts));
router.get('/categories', catchAsyncErrors(getAllCategories));
router.get('/brands', catchAsyncErrors(getAllBrands));
router.get('/category/:category', catchAsyncErrors(getProductsByCategory));
router.get('/:id([0-9a-fA-F]{24})', catchAsyncErrors(getProductById));

// Admin routes
router.post(
  '/',
  verifyToken,
  isAdmin,
  validateProduct,
  handleValidationErrors,
  catchAsyncErrors(createProduct)
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  catchAsyncErrors(updateProduct)
);

router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  catchAsyncErrors(deleteProduct)
);

export default router;
