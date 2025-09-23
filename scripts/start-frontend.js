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

async function startFrontend() {
  console.log('🚀 Finding available port for frontend...');
  
  const frontendPort = await findAvailablePort(5173);
  
  console.log(`✅ Frontend will start on port: ${frontendPort}`);
  
  // Set environment variable
  process.env.FRONTEND_PORT = frontendPort.toString();
  
  console.log('\n🎯 Starting frontend server...');
  
  // Start frontend
  const frontend = spawn('vite', ['--port', frontendPort.toString()], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down frontend...');
    frontend.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    frontend.kill('SIGTERM');
    process.exit(0);
  });
  
  // Handle process exit
  frontend.on('exit', (code) => {
    console.log(`Frontend exited with code ${code}`);
    process.exit(code);
  });
}

startFrontend().catch(console.error);



