/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

/**
 * Error handler middleware
 * Catches all errors and sends appropriate response
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = null;

  // Handle custom API errors
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  }
  // Handle validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.message;
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  // Handle database errors
  else if (err.code === '23505') { // Unique violation
    statusCode = 409;
    message = 'Resource already exists';
    details = err.detail;
  }
  else if (err.code === '23503') { // Foreign key violation
    statusCode = 400;
    message = 'Invalid reference';
    details = err.detail;
  }
  // Development mode - send full error
  else if (process.env.NODE_ENV === 'development') {
    message = err.message;
    details = err.stack;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * 404 handler middleware
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      path: req.originalUrl,
    },
  });
};

export default {
  ApiError,
  errorHandler,
  notFoundHandler,
};

