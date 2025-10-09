import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

async function runMigrations() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL server');

    // Check if database exists
    const dbName = process.env.DB_NAME || 'find_my_stuff';
    const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = $1`;
    const dbExists = await client.query(checkDbQuery, [dbName]);

    if (dbExists.rows.length === 0) {
      console.log(`📦 Creating database: ${dbName}`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log('✅ Database created successfully');
    } else {
      console.log(`✅ Database ${dbName} already exists`);
    }

    await client.end();

    // Connect to the specific database
    const dbClient = new Client({
      ...dbConfig,
      database: dbName,
    });

    await dbClient.connect();
    console.log(`✅ Connected to database: ${dbName}`);

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('🔄 Running database migrations...');
    await dbClient.query(schemaSql);
    console.log('✅ Database schema created successfully');

    await dbClient.end();
    console.log('✅ Migration completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();

