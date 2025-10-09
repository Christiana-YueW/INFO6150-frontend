import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.ITEM_SERVICE_PORT || 3002;

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
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'item-service' });
});

// Get all items for a user
app.get('/items', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    const result = await pool.query(
      `SELECT id, name, location_name as location, photo_url as photo, 
              description, tags, created_at, updated_at 
       FROM items 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get single item
app.get('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.query;

    const result = await pool.query(
      `SELECT id, name, location_name as location, photo_url as photo, 
              description, tags, created_at, updated_at 
       FROM items 
       WHERE id = $1 AND user_id = $2`,
      [itemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Item not found' },
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Create new item
app.post('/items', async (req, res) => {
  try {
    const { userId, name, location, photo, description, tags } = req.body;

    // Validation
    if (!userId || !name || !location) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId, name, and location are required' },
      });
    }

    // Get or create location
    let locationId = null;
    const locationResult = await pool.query(
      'SELECT id FROM locations WHERE name = $1 AND (user_id = $2 OR is_preset = TRUE) LIMIT 1',
      [location, userId]
    );

    if (locationResult.rows.length > 0) {
      locationId = locationResult.rows[0].id;
    } else {
      // Create custom location
      const newLocation = await pool.query(
        'INSERT INTO locations (user_id, name, is_preset) VALUES ($1, $2, FALSE) RETURNING id',
        [userId, location]
      );
      locationId = newLocation.rows[0].id;
    }

    // Create item
    const result = await pool.query(
      `INSERT INTO items (user_id, name, location_id, location_name, photo_url, description, tags) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, name, location_name as location, photo_url as photo, description, tags, created_at`,
      [userId, name, locationId, location, photo || null, description || null, tags || []]
    );

    const item = result.rows[0];

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (user_id, action_type, item_id, details) 
       VALUES ($1, $2, $3, $4)`,
      [userId, 'add_item', item.id, JSON.stringify({ item_name: name, location })]
    );

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item,
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Update item
app.put('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId, name, location, photo, description, tags } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (location !== undefined) {
      // Get or create location
      let locationId = null;
      const locationResult = await pool.query(
        'SELECT id FROM locations WHERE name = $1 AND (user_id = $2 OR is_preset = TRUE) LIMIT 1',
        [location, userId]
      );

      if (locationResult.rows.length > 0) {
        locationId = locationResult.rows[0].id;
      } else {
        const newLocation = await pool.query(
          'INSERT INTO locations (user_id, name, is_preset) VALUES ($1, $2, FALSE) RETURNING id',
          [userId, location]
        );
        locationId = newLocation.rows[0].id;
      }

      updates.push(`location_id = $${paramCount++}`);
      values.push(locationId);
      updates.push(`location_name = $${paramCount++}`);
      values.push(location);
    }

    if (photo !== undefined) {
      updates.push(`photo_url = $${paramCount++}`);
      values.push(photo);
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }

    if (tags !== undefined) {
      updates.push(`tags = $${paramCount++}`);
      values.push(tags);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No fields to update' },
      });
    }

    values.push(itemId, userId);

    const result = await pool.query(
      `UPDATE items SET ${updates.join(', ')} 
       WHERE id = $${paramCount++} AND user_id = $${paramCount} 
       RETURNING id, name, location_name as location, photo_url as photo, description, tags, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Item not found' },
      });
    }

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (user_id, action_type, item_id, details) 
       VALUES ($1, $2, $3, $4)`,
      [userId, 'update_item', itemId, JSON.stringify({ updates: Object.keys(req.body) })]
    );

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Delete item
app.delete('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    const result = await pool.query(
      'DELETE FROM items WHERE id = $1 AND user_id = $2 RETURNING name',
      [itemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Item not found' },
      });
    }

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (user_id, action_type, item_id, details) 
       VALUES ($1, $2, $3, $4)`,
      [userId, 'delete_item', null, JSON.stringify({ item_name: result.rows[0].name })]
    );

    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get locations for a user
app.get('/locations', async (req, res) => {
  try {
    const { userId } = req.query;

    const result = await pool.query(
      `SELECT DISTINCT name FROM locations 
       WHERE is_preset = TRUE OR user_id = $1 
       ORDER BY name`,
      [userId || null]
    );

    res.json({
      success: true,
      data: result.rows.map(row => row.name),
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Item Service running on port ${PORT}`);
});

