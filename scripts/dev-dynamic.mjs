import getPort from 'get-port';
import { spawn } from 'node:child_process';

const webPort = await getPort({ port: 5173 });
const apiPort = await getPort({ port: 4000 });

console.log(`[dev] webPort=${webPort} apiPort=${apiPort}`);

const api = spawn('npx', ['cross-env', `PORT=${apiPort}`, 'nodemon', 'server/server.js'], { stdio: 'inherit' });
const web = spawn('npx', ['cross-env', `API_PORT=${apiPort}`, 'vite', '--port', String(webPort)], { stdio: 'inherit' });

api.on('exit', (code)=> console.log(`[api] exited ${code}`));
web.on('exit', (code)=> console.log(`[web] exited ${code}`));
