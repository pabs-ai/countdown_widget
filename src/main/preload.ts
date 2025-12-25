import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getStoreValue: (key: string) => ipcRenderer.invoke('get-store-value', key),
  setStoreValue: (key: string, value: any) =>
    ipcRenderer.invoke('set-store-value', key, value),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
  showNotification: (title: string, body: string) => {
    new Notification(title, { body });
  },
});

export interface ElectronAPI {
  getStoreValue: (key: string) => Promise<any>;
  setStoreValue: (key: string, value: any) => Promise<void>;
  toggleAlwaysOnTop: () => Promise<boolean>;
  showNotification: (title: string, body: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}