/**
 * Standardized API response utilities
 */

/**
 * Send success response
 */
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send created response
 */
export const sendCreated = (res, data, message = 'Resource created successfully') => {
  res.status(201).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send no content response
 */
export const sendNoContent = (res) => {
  res.status(204).send();
};

/**
 * Send paginated response
 */
export const sendPaginated = (res, data, pagination, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

export default {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated,
};

