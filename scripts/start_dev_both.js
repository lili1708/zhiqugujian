#!/usr/bin/env node
"use strict";
const { spawn } = require('child_process');

const APP_ROOT = 'D:\开发\zhiqugujian';
const ADMIN_ROOT = 'D:\开发\zhiqugujian\\admin-app';
const APP_PORT = process.env.APP_PORT || '5173';
const ADMIN_PORT = process.env.ADMIN_PORT || '5174';

function startProcess(cmd, args, opts) {
  const p = spawn(cmd, args, Object.assign({ stdio: 'inherit', shell: true }, opts));
  p.on('exit', (code) => {
    console.log(`Process ${cmd} exited with code ${code}`);
  });
  return p;
}

console.log(`Starting APP on port ${APP_PORT}...`);
const appCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const appProc = startProcess(appCmd, ['run', 'dev'], { cwd: APP_ROOT, env: Object.assign({}, process.env, { PORT: APP_PORT }) });

console.log(`Starting Admin Portal on port ${ADMIN_PORT}...`);
const adminCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const adminProc = startProcess(adminCmd, ['run', 'dev', '--', '--port', String(ADMIN_PORT), '--host'], { cwd: ADMIN_ROOT, env: Object.assign({}, process.env, { PORT: ADMIN_PORT }) });

process.on('SIGINT', () => {
  console.log('Shutting down...');
  try { appProc.kill(); } catch {}
  try { adminProc.kill(); } catch {}
  process.exit(0);
});
