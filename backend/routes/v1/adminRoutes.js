import express from 'express';
import {
  getProductsWithStats,
  updateProductStock,
  bulkUpdateProducts,
  getLowStockProducts,
  getOutOfStockProducts,
  getOrderStatistics,
  getSalesDashboard,
  getAllUsersWithStats,
  getUserActivity,
  toggleUserBan,
  getAnalytics,
  getCategoryAnalytics,
  performMaintenance,
  exportSystemData
} from '../../controllers/adminController.js';
import { catchAsyncErrors } from '../../middleware/errorHandler.js';
import { verifyToken, isAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(verifyToken, isAdmin);

// ==================== ANALYTICS ====================
router.get('/analytics', catchAsyncErrors(getAnalytics));
router.get('/analytics/categories', catchAsyncErrors(getCategoryAnalytics));
router.get('/analytics/sales-dashboard', catchAsyncErrors(getSalesDashboard));
router.get('/analytics/orders/stats', catchAsyncErrors(getOrderStatistics));

// ==================== PRODUCT MANAGEMENT ====================
router.get('/products/all', catchAsyncErrors(getProductsWithStats));
router.put('/products/:productId/stock', catchAsyncErrors(updateProductStock));
router.post('/products/bulk-update', catchAsyncErrors(bulkUpdateProducts));
router.get('/products/inventory/low-stock', catchAsyncErrors(getLowStockProducts));
router.get('/products/inventory/out-of-stock', catchAsyncErrors(getOutOfStockProducts));

// ==================== USER MANAGEMENT ====================
router.get('/users/all', catchAsyncErrors(getAllUsersWithStats));
router.get('/users/:userId/activity', catchAsyncErrors(getUserActivity));
router.put('/users/:userId/ban', catchAsyncErrors(toggleUserBan));

// ==================== MAINTENANCE ====================
router.post('/maintenance', catchAsyncErrors(performMaintenance));
router.get('/export', catchAsyncErrors(exportSystemData));

export default router;
