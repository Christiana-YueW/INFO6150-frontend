import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.SEARCH_SERVICE_PORT || 3003;

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
  res.json({ status: 'healthy', service: 'search-service' });
});

// Advanced search with filters
app.get('/search', async (req, res) => {
  try {
    const { userId, query, location, sortBy, sortOrder, limit, offset } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    // Build dynamic query
    let sql = `
      SELECT id, name, location_name as location, photo_url as photo, 
             description, tags, created_at, updated_at 
      FROM items 
      WHERE user_id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    // Text search
    if (query) {
      sql += ` AND (
        name ILIKE $${paramCount} OR 
        location_name ILIKE $${paramCount} OR 
        description ILIKE $${paramCount}
      )`;
      params.push(`%${query}%`);
      paramCount++;
    }

    // Location filter
    if (location && location !== 'All') {
      sql += ` AND location_name = $${paramCount}`;
      params.push(location);
      paramCount++;
    }

    // Sorting
    const validSortFields = ['name', 'location_name', 'created_at', 'updated_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
    sql += ` ORDER BY ${sortField} ${order}`;

    // Pagination
    const limitValue = parseInt(limit) || 50;
    const offsetValue = parseInt(offset) || 0;
    sql += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limitValue, offsetValue);

    // Execute query
    const result = await pool.query(sql, params);

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) FROM items WHERE user_id = $1';
    const countParams = [userId];
    let countParamCount = 2;

    if (query) {
      countSql += ` AND (
        name ILIKE $${countParamCount} OR 
        location_name ILIKE $${countParamCount} OR 
        description ILIKE $${countParamCount}
      )`;
      countParams.push(`%${query}%`);
      countParamCount++;
    }

    if (location && location !== 'All') {
      countSql += ` AND location_name = $${countParamCount}`;
      countParams.push(location);
    }

    const countResult = await pool.query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count);

    // Log search activity
    await pool.query(
      `INSERT INTO activity_logs (user_id, action_type, details) 
       VALUES ($1, $2, $3)`,
      [userId, 'search', JSON.stringify({ query, location, results: result.rows.length })]
    );

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
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Full-text search using PostgreSQL's text search
app.get('/search/fulltext', async (req, res) => {
  try {
    const { userId, query } = req.query;

    if (!userId || !query) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId and query are required' },
      });
    }

    const result = await pool.query(
      `SELECT id, name, location_name as location, photo_url as photo, 
              description, tags, created_at, updated_at,
              ts_rank(to_tsvector('english', name || ' ' || location_name || ' ' || COALESCE(description, '')), 
                      plainto_tsquery('english', $2)) as rank
       FROM items 
       WHERE user_id = $1 
         AND to_tsvector('english', name || ' ' || location_name || ' ' || COALESCE(description, '')) 
             @@ plainto_tsquery('english', $2)
       ORDER BY rank DESC, created_at DESC
       LIMIT 20`,
      [userId, query]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Full-text search error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get items by location
app.get('/by-location', async (req, res) => {
  try {
    const { userId, location } = req.query;

    if (!userId || !location) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId and location are required' },
      });
    }

    const result = await pool.query(
      `SELECT id, name, location_name as location, photo_url as photo, 
              description, tags, created_at, updated_at 
       FROM items 
       WHERE user_id = $1 AND location_name = $2 
       ORDER BY name ASC`,
      [userId, location]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get by location error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get items by tag
app.get('/by-tag', async (req, res) => {
  try {
    const { userId, tag } = req.query;

    if (!userId || !tag) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId and tag are required' },
      });
    }

    const result = await pool.query(
      `SELECT id, name, location_name as location, photo_url as photo, 
              description, tags, created_at, updated_at 
       FROM items 
       WHERE user_id = $1 AND $2 = ANY(tags) 
       ORDER BY created_at DESC`,
      [userId, tag]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get by tag error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get all unique tags for a user
app.get('/tags', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    const result = await pool.query(
      `SELECT DISTINCT unnest(tags) as tag 
       FROM items 
       WHERE user_id = $1 AND tags IS NOT NULL 
       ORDER BY tag`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows.map(row => row.tag),
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Search Service running on port ${PORT}`);
});

