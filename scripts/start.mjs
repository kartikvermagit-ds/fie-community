import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('Starting FIE Community production services...');

const backendProc = spawn(npmCmd, ['run', 'start'], {
  cwd: path.join(rootDir, 'backend'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '5000' },
});

const frontendProc = spawn(npmCmd, ['run', 'start'], {
  cwd: path.join(rootDir, 'frontend'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3000' },
});

function shutdown() {
  backendProc.kill('SIGINT');
  frontendProc.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
