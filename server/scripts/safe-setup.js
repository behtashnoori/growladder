import { spawn } from 'node:child_process';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SERVER = path.join(ROOT, 'server');
const PRISMA_DIR = path.join(SERVER, 'prisma');
const ENV = path.join(SERVER, '.env');
const DB = path.join(PRISMA_DIR, 'dev.db');

const has = (p) => fs.existsSync(p);
const binPrisma = () => {
  const unix = path.join(SERVER, 'node_modules', '.bin', 'prisma');
  const win = path.join(SERVER, 'node_modules', '.bin', 'prisma.cmd');
  return has(unix) ? unix : (has(win) ? win : null);
};

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`))));
  });
}

async function maybeInstall() {
  const hasNM = has(path.join(SERVER, 'node_modules'));
  const hasClient = has(path.join(SERVER, 'node_modules', '@prisma', 'client'));
  const hasBin = !!binPrisma();

  if (hasClient && hasBin) {
    console.log('[safe-setup] Dependencies already present. Skipping install.');
    return;
  }

  console.log('[safe-setup] Installing server dependencies (prefer-offline)…');
  try {
    await run('npm', ['install', '--prefer-offline', '--no-audit', '--progress=false'], SERVER);
    return;
  } catch (e) {
    const msg = String(e?.message ?? '');
    const likelyNet = /ECONNRESET|network|fetch|ETIMEDOUT|ENOTFOUND/i.test(msg);
    if ((!hasNM || !hasClient) && likelyNet) {
      console.error('\n[safe-setup] ERROR: First-time install needs internet to fetch @prisma/client.');
      console.error('[safe-setup] Please connect once and run:  cd server && npm install');
      process.exit(1);
    }
    console.warn('[safe-setup] Install failed but node_modules exists. Continuing…');
  }
}

async function ensureEnv() {
  if (!has(ENV)) {
    fs.writeFileSync(ENV, 'DATABASE_URL="file:./prisma/dev.db"\nPORT=4000\n', 'utf8');
    console.log('[safe-setup] Created server/.env with defaults.');
    return;
  }
  const content = fs.readFileSync(ENV, 'utf8');
  let updated = content;
  if (!/DATABASE_URL\s*=/.test(updated)) updated += '\nDATABASE_URL="file:./prisma/dev.db"\n';
  if (!/PORT\s*=/.test(updated)) updated += '\nPORT=4000\n';
  if (updated !== content) {
    fs.writeFileSync(ENV, updated, 'utf8');
    console.log('[safe-setup] Updated server/.env');
  }
}

async function prismaCmd(...args) {
  const localBin = binPrisma();
  if (!localBin) {
    await run('npx', ['prisma', ...args], SERVER);
  } else {
    await run(localBin, args, SERVER);
  }
}

(async () => {
  if (!has(path.join(PRISMA_DIR, 'schema.prisma'))) {
    console.error('[safe-setup] prisma/schema.prisma not found at server/prisma.');
    process.exit(1);
  }

  await ensureEnv();
  await maybeInstall();

  const hasClient = has(path.join(SERVER, 'node_modules', '@prisma', 'client'));

  if (!has(DB)) {
    console.log('[safe-setup] No dev.db found. Running initial migrate…');
    await prismaCmd('migrate', 'dev', '--name', 'init');
  } else {
    console.log('[safe-setup] dev.db exists. Applying pending migrations…');
    await prismaCmd('migrate', 'deploy');
  }

  if (hasClient) {
    console.log('[safe-setup] Generating Prisma client…');
    await prismaCmd('generate');
  } else {
    console.error('[safe-setup] @prisma/client not installed. Cannot generate client.');
    console.error('[safe-setup] Connect to internet once and run:  cd server && npm install');
    process.exit(1);
  }

  console.log('[safe-setup] OK');
})().catch((err) => {
  console.error('[safe-setup] FAILED:', err?.message || err);
  process.exit(1);
});
