#!/usr/bin/env node

import { spawn } from 'child_process';
import net from 'net';

async function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', () => {
      findAvailablePort(startPort + 1).then(resolve);
    });
  });
}

async function startDev() {
  console.log('🚀 Finding available ports...');
  
  const backendPort = await findAvailablePort(4001);
  const frontendPort = await findAvailablePort(5173);
  
  console.log(`✅ Ports configured:`);
  console.log(`   Frontend: ${frontendPort}`);
  console.log(`   Backend: ${backendPort}`);
  console.log(`   API URL: http://localhost:${backendPort}`);
  
  // Set environment variables
  process.env.SERVER_PORT = backendPort.toString();
  process.env.FRONTEND_PORT = frontendPort.toString();
  process.env.VITE_API_URL = `http://localhost:${backendPort}`;
  
  console.log('\n🎯 Starting development servers...');
  
  // Start backend
  const backend = spawn('node', ['scripts/start-backend.js'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, SERVER_PORT: backendPort }
  });
  
  // Wait a bit for backend to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Start frontend
  const frontend = spawn('node', ['scripts/start-frontend.js'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FRONTEND_PORT: frontendPort }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    backend.kill('SIGTERM');
    frontend.kill('SIGTERM');
    process.exit(0);
  });
}

startDev().catch(console.error);
