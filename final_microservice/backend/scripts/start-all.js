import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
  { name: 'API Gateway', path: '../api-gateway', port: 3000 },
  { name: 'User Service', path: '../services/user-service', port: 3001 },
  { name: 'Item Service', path: '../services/item-service', port: 3002 },
  { name: 'Search Service', path: '../services/search-service', port: 3003 },
  { name: 'AI Assistant', path: '../services/ai-assistant-service', port: 3004 },
  { name: 'Analytics Service', path: '../services/analytics-service', port: 3005 },
];

console.log('🚀 Starting all microservices...\n');

const processes = [];

services.forEach((service) => {
  const servicePath = path.join(__dirname, service.path);
  
  console.log(`📦 Starting ${service.name} on port ${service.port}...`);
  
  const proc = spawn('node', ['server.js'], {
    cwd: servicePath,
    stdio: 'inherit',
    shell: true,
  });

  proc.on('error', (error) => {
    console.error(`❌ Error starting ${service.name}:`, error);
  });

  proc.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ ${service.name} exited with code ${code}`);
    }
  });

  processes.push(proc);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down all services...');
  processes.forEach((proc) => {
    proc.kill('SIGINT');
  });
  process.exit(0);
});

console.log('\n✅ All services started!');
console.log('📝 Press Ctrl+C to stop all services\n');

