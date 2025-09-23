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

async function startBackend() {
  console.log('🚀 Finding available port for backend...');
  
  const backendPort = await findAvailablePort(4001);
  
  console.log(`✅ Backend will start on port: ${backendPort}`);
  
  // Set environment variable
  process.env.SERVER_PORT = backendPort.toString();
  
  console.log('\n🎯 Starting backend server...');
  
  // Start backend
  const backend = spawn('npm', ['--prefix', 'server', 'run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, SERVER_PORT: backendPort.toString() }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down backend...');
    backend.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    backend.kill('SIGTERM');
    process.exit(0);
  });
  
  // Handle process exit
  backend.on('exit', (code) => {
    console.log(`Backend exited with code ${code}`);
    process.exit(code);
  });
}

startBackend().catch(console.error);



