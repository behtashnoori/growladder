#!/usr/bin/env node

import { spawn } from 'child_process';
import { setupPorts } from './port-manager.js';

async function startDev() {
  console.log('🚀 Setting up ports...');
  
  try {
    const { frontendPort, backendPort } = await setupPorts();
    
    console.log('\n🎯 Starting development servers...');
    console.log(`   Frontend will be available at: http://127.0.0.1:${frontendPort}`);
    console.log(`   Backend will be available at: http://127.0.0.1:${backendPort}`);
    
    // Start backend
    const backend = spawn('npm', ['--prefix', 'server', 'run', 'dev'], {
      stdio: 'pipe',
      shell: true,
      env: { ...process.env, SERVER_PORT: backendPort }
    });
    
    backend.stdout.on('data', (data) => {
      process.stdout.write(`[api] ${data}`);
    });
    
    backend.stderr.on('data', (data) => {
      process.stderr.write(`[api] ${data}`);
    });
    
    // Start frontend
    const frontend = spawn('npm', ['run', 'dev:web'], {
      stdio: 'pipe',
      shell: true,
      env: { ...process.env, FRONTEND_PORT: frontendPort }
    });
    
    frontend.stdout.on('data', (data) => {
      process.stdout.write(`[web] ${data}`);
    });
    
    frontend.stderr.on('data', (data) => {
      process.stderr.write(`[web] ${data}`);
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
    
    // Handle process exits
    backend.on('exit', (code) => {
      console.log(`Backend exited with code ${code}`);
      if (code !== 0) process.exit(code);
    });
    
    frontend.on('exit', (code) => {
      console.log(`Frontend exited with code ${code}`);
      if (code !== 0) process.exit(code);
    });
    
  } catch (error) {
    console.error('❌ Error starting development servers:', error);
    process.exit(1);
  }
}

startDev();
