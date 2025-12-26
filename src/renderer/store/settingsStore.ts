import { create } from 'zustand';

interface SettingsStore {
  notificationIntervals: number[];
  alwaysOnTop: boolean;
  windowSize: 'compact' | 'standard' | 'expanded';
  
  setNotificationIntervals: (intervals: number[]) => void;
  toggleAlwaysOnTop: () => void;
  setWindowSize: (size: 'compact' | 'standard' | 'expanded') => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  notificationIntervals: [10080, 4320, 1440, 360, 60], // 1 week, 3 days, 1 day, 6 hours, 1 hour
  alwaysOnTop: true,
  windowSize: 'standard',

  setNotificationIntervals: (intervals) => set({ notificationIntervals: intervals }),
  
  toggleAlwaysOnTop: async () => {
    const newValue = await window.electronAPI.toggleAlwaysOnTop();
    set({ alwaysOnTop: newValue });
  },
  
  setWindowSize: (size) => {
    const sizes = {
      compact: { width: 300, height: 400 },
      standard: { width: 350, height: 550 },
      expanded: { width: 400, height: 700 },
    };
    
    // Electron will handle the actual resizing
    set({ windowSize: size });
  },
}));