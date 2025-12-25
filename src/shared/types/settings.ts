export type ThemeType = 'light' | 'dark';

export type BackgroundType = 'solid' | 'gradient' | 'pattern' | 'image';

export interface BackgroundConfig {
  type: BackgroundType;
  value: string;
  opacity?: number;
}

export interface NotificationSettings {
  enabled: boolean;
  intervals: number[];
  sound: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface WindowSettings {
  width: number;
  height: number;
  x?: number;
  y?: number;
  alwaysOnTop: boolean;
}

export interface Settings {
  theme: ThemeType;
  background: BackgroundConfig;
  notifications: NotificationSettings;
  window: WindowSettings;
  lastInteraction: string;
}