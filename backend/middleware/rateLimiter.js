import rateLimit from "express-rate-limit";
import { logger } from "../utils/logger.js";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === "/health";
  },
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: false,
      message: "Too many requests from this IP, please try again later.",
    });
  },
});

// Stricter rate limiter for login endpoint only
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 failed login requests per windowMs
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true, // Don't count successful login requests
});

// More generous rate limiter for register endpoint
export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 registration requests per windowMs
  message: "Too many registration attempts, please try again later.",
  skipSuccessfulRequests: true, // Don't count successful registrations
});

// Rate limiter for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: "Too many password reset attempts, please try again later.",
});
