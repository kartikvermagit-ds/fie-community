import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🌟 Launching FIE COMMUNITY Full-Stack Platform');
console.log('   - Frontend: Next.js 16 (App Router) on http://localhost:3000');
console.log('   - Backend:  Express.js API Engine   on http://localhost:5000');
console.log('================================================================\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Spawn Backend Process
const backendProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'backend'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, PORT: '5000' },
});

backendProc.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  for (const line of lines) {
    if (line.trim()) {
      console.log(`\x1b[33m[BACKEND :5000]\x1b[0m ${line}`);
    }
  }
});

backendProc.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  for (const line of lines) {
    if (line.trim()) {
      console.error(`\x1b[31m[BACKEND-ERR]\x1b[0m ${line}`);
    }
  }
});

// 2. Spawn Frontend Process
const frontendProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'frontend'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, PORT: '3000', NEXT_PUBLIC_API_URL: 'http://localhost:5000/api' },
});

frontendProc.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  for (const line of lines) {
    if (line.trim()) {
      console.log(`\x1b[36m[FRONTEND :3000]\x1b[0m ${line}`);
    }
  }
});

frontendProc.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  for (const line of lines) {
    if (line.trim()) {
      console.error(`\x1b[31m[FRONTEND-ERR]\x1b[0m ${line}`);
    }
  }
});

// Graceful shutdown
function shutdown() {
  console.log('\nStopping FIE Community services...');
  backendProc.kill('SIGINT');
  frontendProc.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
