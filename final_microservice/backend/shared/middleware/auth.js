import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from './errorHandler.js';

/**
 * Middleware to verify JWT token
 * Extracts user information from token and attaches to req.user
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new ApiError(401, 'Access token required');
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token expired'));
    } else {
      next(error);
    }
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Used for routes that work with or without authentication
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
      };
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

export default {
  authenticateToken,
  optionalAuth,
  generateToken,
};

