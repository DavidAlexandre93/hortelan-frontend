import { spawn } from 'node:child_process';

const npmExecPath = process.env.npm_execpath;
if (!npmExecPath) throw new Error('npm_execpath is required to start the E2E server.');

const child = spawn(process.execPath, [npmExecPath, 'run', 'dev', '--', '--host', '127.0.0.1', '--port', '4175'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_ENABLE_DEMO_AUTH: 'true',
    VITE_ENABLE_LIVE_DATA: 'false',
  },
});

const stop = (signal) => child.kill(signal);
process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));
child.on('exit', (code) => process.exit(code ?? 0));
