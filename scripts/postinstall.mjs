import { execSync } from 'node:child_process';

try {
  execSync('npm run api:setup', { stdio: 'inherit' });
} catch (err) {
  console.warn('Skipping server setup:', err?.message);
}
