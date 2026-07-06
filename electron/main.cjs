const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

const isDev = !app.isPackaged;
const port = process.env.PORT || '3987';
let serverProcess;

function resolveAppRoot() {
  if (isDev) return process.cwd();
  const candidates = [
    path.join(process.resourcesPath, 'app'),
    path.join(process.resourcesPath, 'app.asar.unpacked'),
    process.resourcesPath,
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || process.resourcesPath;
}

function resolveServerPath(appRoot) {
  const candidates = [
    path.join(appRoot, '.next', 'standalone', 'server.js'),
    path.join(process.resourcesPath, 'app', '.next', 'standalone', 'server.js'),
    path.join(process.resourcesPath, '.next', 'standalone', 'server.js'),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function startNextServer() {
  if (isDev) return Promise.resolve(`http://localhost:${port}`);

  const appRoot = resolveAppRoot();
  const serverPath = resolveServerPath(appRoot);
  if (!serverPath) {
    dialog.showErrorBox('The Whale startup error', 'Could not find the bundled Next.js server. Rebuild the desktop package with npm run desktop:build:win.');
    return Promise.reject(new Error('Missing bundled Next.js server'));
  }

  serverProcess = spawn(process.execPath, [serverPath], {
    cwd: path.dirname(serverPath),
    env: {
      ...process.env,
      PORT: port,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: 'ignore',
    windowsHide: true,
  });

  serverProcess.unref();
  const url = `http://127.0.0.1:${port}`;
  return waitOn({ resources: [url], timeout: 45000 }).then(() => url);
}

async function createWindow() {
  const iconPath = path.join(resolveAppRoot(), 'public', 'icons', process.platform === 'win32' ? 'icon.ico' : 'icon-512.png');
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 980,
    minHeight: 700,
    title: 'The Whale',
    autoHideMenuBar: true,
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const url = await startNextServer();
  await win.loadURL(url);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.setName('The Whale');
app.whenReady().then(createWindow).catch((error) => {
  dialog.showErrorBox('The Whale failed to start', error?.message || String(error));
  app.quit();
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('before-quit', () => {
  if (serverProcess) serverProcess.kill();
});
