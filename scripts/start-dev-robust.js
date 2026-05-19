#!/usr/bin/env node
"use strict";

const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

// Config
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5173;
const ROOT = path.resolve("D:\\开发\\zhiqugujian");
const URL = `http://localhost:${PORT}`;

function waitForPort(port, host = '127.0.0.1', timeout = 60000, interval = 500) {
  return new Promise((resolve, reject) => {
    const end = Date.now() + timeout;
    const timer = setInterval(() => {
      const socket = new net.Socket();
      const onError = () => {
        socket.destroy();
        if (Date.now() > end) {
          clearInterval(timer);
          reject(new Error('timeout'));
        }
      };
      socket.once('error', onError);
      socket.once('connect', () => {
        socket.destroy();
        clearInterval(timer);
        resolve(true);
      });
      socket.connect(port, host);
    }, interval);
  });
}

console.log(`Starting dev server on port ${PORT}...`);

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const dev = spawn(
  npmCmd,
  ['run', 'dev', '--', '--host', '0.0.0.0', '--port', String(PORT)],
  { cwd: ROOT, shell: true, stdio: 'inherit' }
);

waitForPort(PORT)
  .then(() => {
    // Open browser
    try {
      if (process.platform === 'win32') {
        const open = require('child_process').spawn('cmd', ['/c', 'start', '', URL], { detached: true, stdio: 'ignore' });
        open.unref();
      } else if (process.platform === 'darwin') {
        require('child_process').exec(`open ${URL}`);
      } else {
        require('child_process').exec(`xdg-open ${URL}`);
      }
    } catch (e) {
      // ignore
    }
    console.log(`Server ready. Open ${URL} in your browser.`);
  })
  .catch((err) => {
    console.error('Server did not become ready in time:', err.message);
    process.exit(1);
  });
