import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',  
  server: {
    port: 5173,  
    strictPort: true,
    open: true,  
    cors: true
  },
build: {
    outDir: 'dist', 
    chunkSizeWarningLimit: 1000,
    emptyOutDir: true, 
  }
});