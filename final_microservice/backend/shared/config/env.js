import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'find_my_stuff',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
  jwtExpiresIn: '7d',
  
  // Service Ports
  ports: {
    apiGateway: parseInt(process.env.API_GATEWAY_PORT || '3000'),
    userService: parseInt(process.env.USER_SERVICE_PORT || '3001'),
    itemService: parseInt(process.env.ITEM_SERVICE_PORT || '3002'),
    searchService: parseInt(process.env.SEARCH_SERVICE_PORT || '3003'),
    aiAssistantService: parseInt(process.env.AI_ASSISTANT_SERVICE_PORT || '3004'),
    analyticsService: parseInt(process.env.ANALYTICS_SERVICE_PORT || '3005'),
  },
  
  // Service URLs
  services: {
    user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    item: process.env.ITEM_SERVICE_URL || 'http://localhost:3002',
    search: process.env.SEARCH_SERVICE_URL || 'http://localhost:3003',
    aiAssistant: process.env.AI_ASSISTANT_SERVICE_URL || 'http://localhost:3004',
    analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3005',
  },
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export default config;

