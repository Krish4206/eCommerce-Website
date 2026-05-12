import express from "express";
import { verifyToken, isAdmin } from "../../middleware/authMiddleware.js";
import {
  loginRateLimiter,
  registerRateLimiter,
} from "../../middleware/rateLimiter.js";
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
  deleteUser,
} from "../../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from "../../utils/validation.js";
import { User } from "../../models/User.js";
import { APIError, catchAsyncErrors } from "../../middleware/errorHandler.js";

const router = express.Router();

// Public routes
router.post(
  "/register",
  registerRateLimiter,
  validateRegister,
  handleValidationErrors,
  register,
);
router.post(
  "/login",
  loginRateLimiter,
  validateLogin,
  handleValidationErrors,
  login,
);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.get("/me", verifyToken, getProfile);
router.post("/logout", verifyToken, logout);
router.put("/update-profile", verifyToken, updateProfile);
router.post("/change-password", verifyToken, changePassword);

// Admin routes
router.get("/users/all", verifyToken, isAdmin, getAllUsers);
router.put("/users/:userId/role", verifyToken, isAdmin, updateUserRole);
router.delete("/users/:userId", verifyToken, isAdmin, deleteUser);

// Temporary: Promote user to admin (protected by secret key)
import { logger } from "../../utils/logger.js";

router.post("/promote-admin", async (req, res) => {
  try {
    const { email, secretKey } = req.body;

    if (secretKey !== process.env.ADMIN_SECRET_KEY || !email) {
      return res.status(403).json({ status: false, message: "Unauthorized" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    logger.info(`User ${email} promoted to admin via secret key`);
    res.json({
      status: true,
      message: `User ${email} promoted to admin successfully`,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

export default router;
