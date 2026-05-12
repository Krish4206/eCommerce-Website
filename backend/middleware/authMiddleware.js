import jwt from 'jsonwebtoken';
import { APIError } from './errorHandler.js';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return next(new APIError('No token provided', 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(new APIError('Invalid or expired token', 401));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    next(new APIError('Authentication error', 401));
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new APIError('Access denied. Admin only.', 403));
  }
  next();
};

// Check if user is owner or admin
export const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.id !== req.params.id)) {
    return next(new APIError('Access denied', 403));
  }
  next();
};
