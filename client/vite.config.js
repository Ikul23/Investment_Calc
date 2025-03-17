import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Конфигурация Vite с логированием
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, 
    open: true, 
    strictPort: true, 
    hmr: true, 
    watch: {
      usePolling: true, 
    },
  },
  define: {
    'process.env': {} 
  },
  logLevel: 'info', 
});
