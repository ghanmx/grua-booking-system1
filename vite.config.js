import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Enables importing from 'src' as '@'
    },
  },
  server: {
    host: '::',
    port: '8080',
    strictPort: true,
    clearScreen: false,
  },
  plugins: [react()],
});
