import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;

// Service URLs
const SERVICES = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  item: process.env.ITEM_SERVICE_URL || 'http://localhost:3002',
  search: process.env.SEARCH_SERVICE_URL || 'http://localhost:3003',
  aiAssistant: process.env.AI_ASSISTANT_SERVICE_URL || 'http://localhost:3004',
  analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3005',
};

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev')); // Request logging

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

// Check all services health
app.get('/health/services', async (req, res) => {
  const healthChecks = {};

  for (const [name, url] of Object.entries(SERVICES)) {
    try {
      const response = await fetch(`${url}/health`);
      const data = await response.json();
      healthChecks[name] = { status: 'healthy', ...data };
    } catch (error) {
      healthChecks[name] = { status: 'unhealthy', error: error.message };
    }
  }

  const allHealthy = Object.values(healthChecks).every(
    (check) => check.status === 'healthy'
  );

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    services: healthChecks,
  });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access token required' },
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production'
    );

    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token' },
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { message: 'Token expired' },
      });
    }
    next(error);
  }
};

// Proxy helper function
async function proxyRequest(serviceUrl, path, method, body, headers) {
  try {
    const url = `${serviceUrl}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error(`Proxy error to ${serviceUrl}${path}:`, error);
    throw error;
  }
}

// ============================================
// USER SERVICE ROUTES (Public)
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await proxyRequest(
      SERVICES.user,
      '/register',
      'POST',
      req.body
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await proxyRequest(
      SERVICES.user,
      '/login',
      'POST',
      req.body
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// ============================================
// USER SERVICE ROUTES (Protected)
// ============================================

// Get user profile
app.get('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest(
      SERVICES.user,
      `/profile/${req.params.userId}`,
      'GET'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Update user profile
app.put('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest(
      SERVICES.user,
      `/profile/${req.params.userId}`,
      'PUT',
      req.body
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Change password
app.put('/api/users/:userId/password', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest(
      SERVICES.user,
      `/profile/${req.params.userId}/password`,
      'PUT',
      req.body
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// ============================================
// ITEM SERVICE ROUTES (Protected)
// ============================================

// Get all items
app.get('/api/items', authenticateToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const result = await proxyRequest(
      SERVICES.item,
      `/items?${queryString}`,
      'GET'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Get single item
app.get('/api/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const result = await proxyRequest(
      SERVICES.item,
      `/items/${req.params.itemId}?${queryString}`,
      'GET'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Create item
app.post('/api/items', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest(
      SERVICES.item,
      '/items',
      'POST',
      req.body
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Update item
app.put('/api/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest(
      SERVICES.item,
      `/items/${req.params.itemId}`,
      'PUT',
      req.body
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Delete item
app.delete('/api/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const result = await proxyRequest(
      SERVICES.item,
      `/items/${req.params.itemId}?${queryString}`,
      'DELETE'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Get locations
app.get('/api/locations', authenticateToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const result = await proxyRequest(
      SERVICES.item,
      `/locations?${queryString}`,
      'GET'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// ============================================
// SEARCH SERVICE ROUTES (Protected)
// ============================================

// Search items
app.get('/api/search', authenticateToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const result = await proxyRequest(
      SERVICES.search,
      `/search?${queryString}`,
      'GET'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Full-text search
app.get('/api/search/fulltext', authenticateToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const result = await proxyRequest(
      SERVICES.search,
      `/search/fulltext?${queryString}`,
      'GET'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Get tags
app.get('/api/search/tags', authenticateToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const result = await proxyRequest(
      SERVICES.search,
      `/tags?${queryString}`,
      'GET'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// ============================================
// AI ASSISTANT SERVICE ROUTES (Protected)
// ============================================

// Process natural language query
app.post('/api/ai/query', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest(
      SERVICES.aiAssistant,
      '/query',
      'POST',
      req.body
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Get suggestions
app.get('/api/ai/suggestions', authenticateToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const result = await proxyRequest(
      SERVICES.aiAssistant,
      `/suggestions?${queryString}`,
      'GET'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// ============================================
// ANALYTICS SERVICE ROUTES (Protected)
// ============================================

// Get dashboard statistics
app.get('/api/analytics/dashboard', authenticateToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const result = await proxyRequest(
      SERVICES.analytics,
      `/dashboard?${queryString}`,
      'GET'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Get activity logs
app.get('/api/analytics/activity', authenticateToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const result = await proxyRequest(
      SERVICES.analytics,
      `/activity?${queryString}`,
      'GET'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// Get location statistics
app.get('/api/analytics/stats/locations', authenticateToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const result = await proxyRequest(
      SERVICES.analytics,
      `/stats/locations?${queryString}`,
      'GET'
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Service unavailable' },
    });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      path: req.originalUrl,
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Gateway error:', err);
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { details: err.message }),
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Proxying to services:`);
  Object.entries(SERVICES).forEach(([name, url]) => {
    console.log(`   - ${name}: ${url}`);
  });
});

