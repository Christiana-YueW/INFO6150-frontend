import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.ANALYTICS_SERVICE_PORT || 3005;

// Database connection
const { Pool } = pg;
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'find_my_stuff',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'analytics-service' });
});

// Get dashboard statistics
app.get('/dashboard', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    // Total items count
    const totalItemsResult = await pool.query(
      'SELECT COUNT(*) as count FROM items WHERE user_id = $1',
      [userId]
    );
    const totalItems = parseInt(totalItemsResult.rows[0].count);

    // Items by location
    const locationStatsResult = await pool.query(
      `SELECT location_name as location, COUNT(*) as count 
       FROM items 
       WHERE user_id = $1 
       GROUP BY location_name 
       ORDER BY count DESC 
       LIMIT 5`,
      [userId]
    );
    const locationStats = locationStatsResult.rows;

    // Most recent item
    const recentItemResult = await pool.query(
      `SELECT name, location_name as location, created_at 
       FROM items 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );
    const mostRecentItem = recentItemResult.rows[0] || null;

    // Recent activity
    const activityResult = await pool.query(
      `SELECT al.action_type, al.details, al.created_at, i.name as item_name
       FROM activity_logs al
       LEFT JOIN items i ON al.item_id = i.id
       WHERE al.user_id = $1 
       ORDER BY al.created_at DESC 
       LIMIT 10`,
      [userId]
    );
    const recentActivity = activityResult.rows.map(row => ({
      action: row.action_type,
      itemName: row.item_name || (row.details?.item_name),
      timestamp: row.created_at,
      details: row.details,
    }));

    // Items added in last 7 days
    const recentItemsResult = await pool.query(
      `SELECT COUNT(*) as count 
       FROM items 
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'`,
      [userId]
    );
    const itemsAddedThisWeek = parseInt(recentItemsResult.rows[0].count);

    res.json({
      success: true,
      data: {
        totalItems,
        locationStats,
        mostRecentItem,
        recentActivity,
        itemsAddedThisWeek,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get activity logs
app.get('/activity', async (req, res) => {
  try {
    const { userId, limit, offset, actionType } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    let sql = `
      SELECT al.id, al.action_type, al.details, al.created_at, 
             i.name as item_name, i.location_name as item_location
      FROM activity_logs al
      LEFT JOIN items i ON al.item_id = i.id
      WHERE al.user_id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    // Filter by action type
    if (actionType) {
      sql += ` AND al.action_type = $${paramCount}`;
      params.push(actionType);
      paramCount++;
    }

    sql += ' ORDER BY al.created_at DESC';

    // Pagination
    const limitValue = parseInt(limit) || 20;
    const offsetValue = parseInt(offset) || 0;
    sql += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limitValue, offsetValue);

    const result = await pool.query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM activity_logs WHERE user_id = $1';
    const countParams = [userId];
    if (actionType) {
      countSql += ' AND action_type = $2';
      countParams.push(actionType);
    }
    const countResult = await pool.query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        limit: limitValue,
        offset: offsetValue,
        hasMore: offsetValue + result.rows.length < total,
      },
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get statistics by location
app.get('/stats/locations', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    const result = await pool.query(
      `SELECT location_name as location, 
              COUNT(*) as item_count,
              COUNT(DISTINCT tags) as unique_tags,
              MAX(created_at) as last_added
       FROM items 
       WHERE user_id = $1 
       GROUP BY location_name 
       ORDER BY item_count DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Location stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get statistics by time period
app.get('/stats/timeline', async (req, res) => {
  try {
    const { userId, period } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    // Default to last 30 days
    const days = parseInt(period) || 30;

    const result = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM items 
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at) 
       ORDER BY date DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Timeline stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get user engagement metrics
app.get('/stats/engagement', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    // Activity breakdown
    const activityBreakdown = await pool.query(
      `SELECT action_type, COUNT(*) as count 
       FROM activity_logs 
       WHERE user_id = $1 
       GROUP BY action_type 
       ORDER BY count DESC`,
      [userId]
    );

    // Total activities
    const totalActivities = await pool.query(
      'SELECT COUNT(*) as count FROM activity_logs WHERE user_id = $1',
      [userId]
    );

    // Activities in last 7 days
    const recentActivities = await pool.query(
      `SELECT COUNT(*) as count 
       FROM activity_logs 
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        activityBreakdown: activityBreakdown.rows,
        totalActivities: parseInt(totalActivities.rows[0].count),
        activitiesThisWeek: parseInt(recentActivities.rows[0].count),
      },
    });
  } catch (error) {
    console.error('Engagement stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Analytics Service running on port ${PORT}`);
});

