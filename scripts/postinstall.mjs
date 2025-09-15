import { execSync } from 'node:child_process';

execSync('npm install', { cwd: 'server', stdio: 'inherit' });
execSync('npm --prefix server run prisma:generate', { stdio: 'inherit' });
