import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import Store from 'electron-store';

const store = new Store({
  name: 'window-state',
  defaults: {
    windowBounds: { width: 350, height: 550, x: undefined, y: undefined },
    alwaysOnTop: true,
    theme: 'light',
  },
});

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const VITE_DEV_SERVER_URL = 'http://localhost:5173';

function createWindow() {
  const windowBounds = store.get('windowBounds') as any;
  const alwaysOnTop = store.get('alwaysOnTop') as boolean;

  mainWindow = new BrowserWindow({
    width: windowBounds.width,
    height: windowBounds.height,
    x: windowBounds.x,
    y: windowBounds.y,
    minWidth: 300,
    minHeight: 400,
    frame: true,
    alwaysOnTop,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'Countdown Widget',
    show: false,
  });

  if (isDev) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  mainWindow.on('close', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      store.set('windowBounds', bounds);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.handle('get-store-value', (_event, key: string) => {
  return store.get(key);
});

ipcMain.handle('set-store-value', (_event, key: string, value: any) => {
  store.set(key, value);
});

ipcMain.handle('toggle-always-on-top', () => {
  const currentValue = mainWindow?.isAlwaysOnTop() ?? false;
  const newValue = !currentValue;
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(newValue);
  }
  store.set('alwaysOnTop', newValue);
  return newValue;
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});