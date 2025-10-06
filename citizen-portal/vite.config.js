import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: true,
    open: true
  },
  plugins: [react()],
});