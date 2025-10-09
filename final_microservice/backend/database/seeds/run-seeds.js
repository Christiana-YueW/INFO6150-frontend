import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'find_my_stuff',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

async function seedDatabase() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check if data already exists
    const userCheck = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count) > 0) {
      console.log('⚠️  Database already has data. Skipping seed.');
      await client.end();
      return;
    }

    console.log('🌱 Seeding database...');

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, name, avatar_url) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      ['demo@example.com', hashedPassword, 'Demo User', '/avatar1-white.jpg']
    );
    const userId = userResult.rows[0].id;
    console.log('✅ Created demo user (email: demo@example.com, password: demo123)');

    // Get location IDs
    const locationsResult = await client.query(
      `SELECT id, name FROM locations WHERE is_preset = TRUE`
    );
    const locationMap = {};
    locationsResult.rows.forEach(row => {
      locationMap[row.name] = row.id;
    });

    // Create sample items
    const items = [
      {
        name: 'Camera',
        location: 'Living Room',
        photo: '/camera.jpg',
        description: 'Canon DSLR camera with 50mm lens',
        tags: ['electronics', 'photography'],
      },
      {
        name: 'Bag',
        location: 'Bedroom',
        photo: '/bag.jpg',
        description: 'Black leather messenger bag',
        tags: ['accessories', 'daily-use'],
      },
      {
        name: 'Phone Charger',
        location: 'Black Cabinet',
        photo: '/phonecharger.jpg',
        description: 'USB-C fast charger',
        tags: ['electronics', 'accessories'],
      },
      {
        name: 'Dyson Vacuum',
        location: 'Kitchen',
        photo: '/dyson.jpg',
        description: 'Dyson V11 cordless vacuum cleaner',
        tags: ['appliances', 'cleaning'],
      },
      {
        name: 'Laptop',
        location: 'Office',
        photo: null,
        description: 'MacBook Pro 16-inch',
        tags: ['electronics', 'work'],
      },
      {
        name: 'Headphones',
        location: 'Office',
        photo: null,
        description: 'Sony WH-1000XM4 noise-cancelling headphones',
        tags: ['electronics', 'audio'],
      },
      {
        name: 'Winter Jacket',
        location: 'Bedroom',
        photo: null,
        description: 'North Face winter jacket',
        tags: ['clothing', 'seasonal'],
      },
      {
        name: 'Toolbox',
        location: 'Garage',
        photo: null,
        description: 'Red metal toolbox with basic tools',
        tags: ['tools', 'maintenance'],
      },
    ];

    for (const item of items) {
      await client.query(
        `INSERT INTO items (user_id, name, location_id, location_name, photo_url, description, tags) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          userId,
          item.name,
          locationMap[item.location],
          item.location,
          item.photo,
          item.description,
          item.tags,
        ]
      );
    }
    console.log(`✅ Created ${items.length} sample items`);

    // Create sample activity logs
    const itemsResult = await client.query(
      `SELECT id, name FROM items WHERE user_id = $1 ORDER BY created_at DESC LIMIT 4`,
      [userId]
    );

    for (const item of itemsResult.rows) {
      await client.query(
        `INSERT INTO activity_logs (user_id, action_type, item_id, details) 
         VALUES ($1, $2, $3, $4)`,
        [
          userId,
          'add_item',
          item.id,
          JSON.stringify({ item_name: item.name }),
        ]
      );
    }
    console.log('✅ Created sample activity logs');

    await client.end();
    console.log('✅ Database seeding completed successfully');
    console.log('\n📝 Demo credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Password: demo123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();

