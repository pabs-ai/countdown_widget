import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  root: './src/renderer',
  publicDir: '../../public',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/renderer/components'),
      '@hooks': path.resolve(__dirname, './src/renderer/hooks'),
      '@store': path.resolve(__dirname, './src/renderer/store'),
      '@types': path.resolve(__dirname, './src/shared/types'),
    },
  },
  server: {
    port: 5173,
  },
});