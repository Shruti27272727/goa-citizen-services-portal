import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: true,
    open: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'scintillating-beauty-production-1e08.up.railway.app' // ✅ your Railway domain
    ],
  },
  plugins: [react()],
});
