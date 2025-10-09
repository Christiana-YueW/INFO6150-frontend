import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.AI_ASSISTANT_SERVICE_PORT || 3004;

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
  res.json({ status: 'healthy', service: 'ai-assistant-service' });
});

// Process natural language query
app.post('/query', async (req, res) => {
  try {
    const { userId, query } = req.body;

    if (!userId || !query) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId and query are required' },
      });
    }

    // Get all user items for processing
    const itemsResult = await pool.query(
      `SELECT id, name, location_name as location, description, tags 
       FROM items 
       WHERE user_id = $1`,
      [userId]
    );

    const items = itemsResult.rows;
    const response = processQuery(query, items);

    // Log query
    await pool.query(
      `INSERT INTO activity_logs (user_id, action_type, details) 
       VALUES ($1, $2, $3)`,
      [userId, 'ai_query', JSON.stringify({ query, response_type: response.type })]
    );

    res.json({
      success: true,
      data: {
        query,
        response: response.text,
        items: response.items || [],
        type: response.type,
      },
    });
  } catch (error) {
    console.error('Query processing error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

/**
 * Process natural language query and return appropriate response
 * This is a simple rule-based system. In production, you might use NLP libraries or AI APIs
 */
function processQuery(query, items) {
  const q = query.toLowerCase().trim();

  // List all items
  if (
    q === 'list' ||
    q === 'show all' ||
    q === 'all items' ||
    q === 'list all items' ||
    q.includes('list all') ||
    q.includes('show all') ||
    q.includes('show me everything')
  ) {
    if (items.length === 0) {
      return {
        type: 'empty',
        text: "You don't have any saved items yet. Use the Add page to create one!",
        items: [],
      };
    }

    const lines = items.map((it) => `• ${it.name} — ${it.location}`);
    return {
      type: 'list',
      text: `Here are all your items:\n${lines.join('\n')}`,
      items: items,
    };
  }

  // Count items
  if (q.includes('how many') || q.includes('count')) {
    return {
      type: 'count',
      text: `You have ${items.length} item${items.length !== 1 ? 's' : ''} saved.`,
      items: [],
    };
  }

  // Location-based queries
  const locationMatch = q.match(/(?:in|at|from)\s+(?:the\s+)?(.+?)(?:\?|$)/);
  if (locationMatch) {
    const location = locationMatch[1].trim();
    const matchedItems = items.filter(
      (item) => item.location.toLowerCase().includes(location)
    );

    if (matchedItems.length > 0) {
      const lines = matchedItems.map((it) => `• ${it.name}`);
      return {
        type: 'location_search',
        text: `Found ${matchedItems.length} item${matchedItems.length !== 1 ? 's' : ''} in ${location}:\n${lines.join('\n')}`,
        items: matchedItems,
      };
    } else {
      return {
        type: 'not_found',
        text: `I couldn't find any items in "${location}". Try checking the spelling or browse all items.`,
        items: [],
      };
    }
  }

  // "Where is" queries
  if (q.startsWith('where is') || q.startsWith('where\'s') || q.includes('find')) {
    // Extract item name from query
    const words = q
      .replace(/where is|where's|find|the|a|an|my/gi, '')
      .trim()
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length > 0);

    const matches = items.filter((item) => {
      const itemName = item.name.toLowerCase();
      const itemLocation = item.location.toLowerCase();
      return words.some((word) => itemName.includes(word) || itemLocation.includes(word));
    });

    if (matches.length > 0) {
      if (matches.length === 1) {
        const item = matches[0];
        return {
          type: 'found',
          text: `Your ${item.name} is in the ${item.location}.`,
          items: [item],
        };
      } else {
        const lines = matches.map((it) => `• ${it.name} — ${it.location}`);
        return {
          type: 'multiple_found',
          text: `I found ${matches.length} items matching your query:\n${lines.join('\n')}`,
          items: matches,
        };
      }
    } else {
      return {
        type: 'not_found',
        text: `I couldn't find any items matching "${query}". Try different keywords or browse all items.`,
        items: [],
      };
    }
  }

  // General keyword search
  const words = q
    .split(' ')
    .filter((word) => word.length > 2)
    .filter((word) => !['the', 'and', 'for', 'with'].includes(word));

  if (words.length > 0) {
    const matches = items.filter((item) => {
      const itemName = item.name.toLowerCase();
      const itemLocation = item.location.toLowerCase();
      const itemDesc = (item.description || '').toLowerCase();
      return words.some(
        (word) =>
          itemName.includes(word) ||
          itemLocation.includes(word) ||
          itemDesc.includes(word)
      );
    });

    if (matches.length > 0) {
      const lines = matches.map((it) => `• ${it.name} — ${it.location}`);
      return {
        type: 'search_results',
        text: `Found ${matches.length} item${matches.length !== 1 ? 's' : ''} matching your query:\n${lines.join('\n')}`,
        items: matches,
      };
    }
  }

  // Default response
  return {
    type: 'help',
    text: `I'm not sure what you're looking for. Try asking:\n• "Where is my camera?"\n• "Find charger"\n• "List all items"\n• "What's in the kitchen?"`,
    items: [],
  };
}

// Get conversation suggestions
app.get('/suggestions', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    // Get recent items and locations for suggestions
    const itemsResult = await pool.query(
      `SELECT name, location_name as location 
       FROM items 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [userId]
    );

    const suggestions = [
      'List all items',
      'How many items do I have?',
    ];

    if (itemsResult.rows.length > 0) {
      const recentItem = itemsResult.rows[0];
      suggestions.push(`Where is my ${recentItem.name}?`);
      suggestions.push(`What's in the ${recentItem.location}?`);
    }

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Assistant Service running on port ${PORT}`);
});

