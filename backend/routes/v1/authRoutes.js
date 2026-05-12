// import express from 'express';
// import { verifyToken, isAdmin } from '../../middleware/authMiddleware.js';
// import { authRateLimiter, passwordResetLimiter } from '../../middleware/rateLimiter.js';
// import {
//   register,
//   login,
//   logout,
//   getProfile,
//   refreshAccessToken,
//   updateProfile,
//   changePassword,
//   forgotPassword,
//   getAllUsers,
//   updateUserRole,
//   deleteUser
// } from '../../controllers/authController.js';
// import { validateRegister, validateLogin, handleValidationErrors } from '../../utils/validation.js';

// const router = express.Router();

// // Public routes with rate limiting
// router.post('/register', authRateLimiter, validateRegister, handleValidationErrors, register);
// router.post('/login', authRateLimiter, validateLogin, handleValidationErrors, login);
// router.post('/refresh-token', refreshAccessToken);
// router.post('/forgot-password', passwordResetLimiter, forgotPassword);

// // Protected routes (require authentication)
// router.get('/me', verifyToken, getProfile);
// router.post('/logout', verifyToken, logout);
// router.put('/update-profile', verifyToken, updateProfile);
// router.post('/change-password', verifyToken, changePassword);

// // Admin routes (require admin role)
// router.get('/users/all', verifyToken, isAdmin, getAllUsers);
// router.put('/users/:userId/role', verifyToken, isAdmin, updateUserRole);
// router.delete('/users/:userId', verifyToken, isAdmin, deleteUser);

// export default router;



import express from 'express';
import { verifyToken, isAdmin } from '../../middleware/authMiddleware.js';
import { loginRateLimiter, registerRateLimiter } from '../../middleware/rateLimiter.js';
import {
  register,
  login,
  logout,
  getProfile,
  refreshAccessToken,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  deleteUser
} from '../../controllers/authController.js';
import { validateRegister, validateLogin, handleValidationErrors } from '../../utils/validation.js';

const router = express.Router();

// Public routes
router.post('/register', registerRateLimiter, validateRegister, handleValidationErrors, register);
router.post('/login', loginRateLimiter, validateLogin, handleValidationErrors, login);
router.post('/refresh-token', refreshAccessToken);

// Protected routes
router.get('/me', verifyToken, getProfile);
router.post('/logout', verifyToken, logout);
router.put('/update-profile', verifyToken, updateProfile);
router.post('/change-password', verifyToken, changePassword);

// Admin routes
router.get('/users/all', verifyToken, isAdmin, getAllUsers);
router.put('/users/:userId/role', verifyToken, isAdmin, updateUserRole);
router.delete('/users/:userId', verifyToken, isAdmin, deleteUser);

export default router;


