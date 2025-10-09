import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
  { name: 'API Gateway', path: '../api-gateway', port: 3000, color: '\x1b[36m' },
  { name: 'User Service', path: '../services/user-service', port: 3001, color: '\x1b[32m' },
  { name: 'Item Service', path: '../services/item-service', port: 3002, color: '\x1b[33m' },
  { name: 'Search Service', path: '../services/search-service', port: 3003, color: '\x1b[35m' },
  { name: 'AI Assistant', path: '../services/ai-assistant-service', port: 3004, color: '\x1b[34m' },
  { name: 'Analytics Service', path: '../services/analytics-service', port: 3005, color: '\x1b[31m' },
];

const reset = '\x1b[0m';

console.log('🚀 Starting all microservices in development mode...\n');

const processes = [];

services.forEach((service) => {
  const servicePath = path.join(__dirname, service.path);
  
  console.log(`${service.color}📦 Starting ${service.name} on port ${service.port}...${reset}`);
  
  const proc = spawn('node', ['--watch', 'server.js'], {
    cwd: servicePath,
    shell: true,
  });

  // Prefix output with service name
  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.log(`${service.color}[${service.name}]${reset} ${line}`);
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.error(`${service.color}[${service.name}]${reset} ${line}`);
    });
  });

  proc.on('error', (error) => {
    console.error(`❌ Error starting ${service.name}:`, error);
  });

  proc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
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
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

console.log('\n✅ All services started in watch mode!');
console.log('📝 Files will auto-reload on changes');
console.log('📝 Press Ctrl+C to stop all services\n');

