-- Find My Stuff Database Schema
-- PostgreSQL Database Design

-- Drop existing tables (for clean setup)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500) DEFAULT '/avatar-default.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Locations Table (predefined and custom locations)
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_preset BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

-- Create index on user_id for faster queries
CREATE INDEX idx_locations_user_id ON locations(user_id);

-- Items Table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    location_name VARCHAR(100) NOT NULL, -- Denormalized for faster queries
    photo_url TEXT,
    description TEXT,
    tags TEXT[], -- Array of tags for better searchability
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_location_id ON items(location_id);
CREATE INDEX idx_items_name ON items(name);
CREATE INDEX idx_items_location_name ON items(location_name);
CREATE INDEX idx_items_created_at ON items(created_at DESC);

-- Full-text search index for items
CREATE INDEX idx_items_search ON items USING gin(to_tsvector('english', name || ' ' || location_name || ' ' || COALESCE(description, '')));

-- Activity Logs Table (for analytics and tracking)
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- 'add_item', 'update_item', 'delete_item', 'search', 'view_item'
    item_id INTEGER REFERENCES items(id) ON DELETE SET NULL,
    details JSONB, -- Flexible field for storing additional data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for analytics queries
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_item_id ON activity_logs(item_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at for users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update updated_at for items
CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert preset locations (available to all users)
INSERT INTO locations (user_id, name, is_preset) VALUES
    (NULL, 'Living Room', TRUE),
    (NULL, 'Kitchen', TRUE),
    (NULL, 'Office', TRUE),
    (NULL, 'Black Cabinet', TRUE),
    (NULL, 'Bedroom', TRUE),
    (NULL, 'Garage', TRUE),
    (NULL, 'Bathroom', TRUE),
    (NULL, 'Basement', TRUE),
    (NULL, 'Attic', TRUE),
    (NULL, 'Storage Room', TRUE);

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts and profiles';
COMMENT ON TABLE locations IS 'Predefined and custom locations for items';
COMMENT ON TABLE items IS 'User items with photos and locations';
COMMENT ON TABLE activity_logs IS 'User activity tracking for analytics';

COMMENT ON COLUMN items.tags IS 'Array of tags for categorization and search';
COMMENT ON COLUMN activity_logs.details IS 'JSON field for flexible activity data storage';

