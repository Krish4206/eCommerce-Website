import { User } from '../models/User.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { comparePassword } from '../utils/password.js';
import { APIError, catchAsyncErrors } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

// Register a new user
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validate input
  if (!name || !email || !password || !confirmPassword) {
    throw new APIError('Please provide all required fields', 400);
  }

  if (password !== confirmPassword) {
    throw new APIError('Passwords do not match', 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new APIError('Email already registered', 400);
  }

  // Create new user
  const user = new User({
    name,
    email,
    password, // Will be hashed by schema middleware
  });

  await user.save();

  // Generate tokens
  const accessToken = generateToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to database
  user.refreshTokens.push({
    token: refreshToken,
    createdAt: new Date()
  });
  await user.save();

  // Return user data (without password)
  res.status(201).json({
    status: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    }
  });

  logger.info(`User registered: ${email}`);
});

// Login user
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new APIError('Please provide email and password', 400);
  }

  // Find user by email (include password field)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    logger.warn(`Login attempt with non-existent email: ${email}`);
    throw new APIError('Invalid email or password', 401);
  }

  // Check if account is locked
  if (user.isAccountLocked()) {
    throw new APIError('Account is locked. Try again later.', 403);
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    // Increment login attempts
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    
    // Lock account after 5 failed attempts
    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      logger.warn(`Account locked due to failed login attempts: ${email}`);
    }
    
    await user.save();
    logger.warn(`Failed login attempt for: ${email}`);
    throw new APIError('Invalid email or password', 401);
  }

  // Reset login attempts on successful login
  user.loginAttempts = 0;
  user.lockUntil = null;

  // Generate tokens
  const accessToken = generateToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshTokens.push({
    token: refreshToken,
    createdAt: new Date()
  });

  // Keep only last 5 refresh tokens
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }

  await user.save();

  res.status(200).json({
    status: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    }
  });

  logger.info(`User logged in: ${email}`);
});

// Get user profile
export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password -refreshTokens');
  
  if (!user) {
    throw new APIError('User not found', 404);
  }

  res.status(200).json({
    status: true,
    message: 'Profile retrieved successfully',
    data: user
  });
});

// Logout user
export const logout = catchAsyncErrors(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    const user = await User.findById(req.user.id);
    
    // Remove the refresh token from database
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    await user.save();
  }

  res.status(200).json({
    status: true,
    message: 'Logout successful'
  });

  logger.info(`User logged out: ${req.user.id}`);
});

// Refresh access token
export const refreshAccessToken = catchAsyncErrors(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new APIError('Refresh token is required', 400);
  }

  // Find user with this refresh token
  const user = await User.findOne({
    'refreshTokens.token': refreshToken
  });

  if (!user) {
    throw new APIError('Invalid refresh token', 401);
  }

  // Generate new access token
  const newAccessToken = generateToken(user._id, user.role);

  res.status(200).json({
    status: true,
    message: 'Access token refreshed',
    data: {
      accessToken: newAccessToken,
      refreshToken
    }
  });

  logger.info(`Access token refreshed for user: ${user._id}`);
});

// Update user profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, phone, address } = req.body;
  const userId = req.user.id;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(address && { address })
    },
    { new: true, runValidators: true }
  ).select('-password -refreshTokens');

  if (!user) {
    throw new APIError('User not found', 404);
  }

  res.status(200).json({
    status: true,
    message: 'Profile updated successfully',
    data: user
  });

  logger.info(`User profile updated: ${userId}`);
});

// Change password
export const changePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new APIError('Please provide all password fields', 400);
  }

  if (newPassword !== confirmPassword) {
    throw new APIError('New passwords do not match', 400);
  }

  // Get user with password field
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new APIError('User not found', 404);
  }

  // Verify old password
  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new APIError('Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: true,
    message: 'Password changed successfully'
  });

  logger.info(`Password changed for user: ${userId}`);
});

// Get all users (admin only)
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const { role, page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  
  const filter = role ? { role } : {};
  
  const users = await User.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-password -refreshTokens');

  const total = await User.countDocuments(filter);

  res.status(200).json({
    status: true,
    message: 'Users retrieved successfully',
    data: {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// Update user role (admin only)
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    throw new APIError('Invalid role. Must be "user" or "admin"', 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select('-password -refreshTokens');

  if (!user) {
    throw new APIError('User not found', 404);
  }

  res.status(200).json({
    status: true,
    message: 'User role updated successfully',
    data: user
  });

  logger.info(`User role updated: ${userId} -> ${role}`);
});

// Delete user (admin only)
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new APIError('User not found', 404);
  }

  res.status(200).json({
    status: true,
    message: 'User deleted successfully'
  });

  logger.info(`User deleted: ${userId}`);
});
