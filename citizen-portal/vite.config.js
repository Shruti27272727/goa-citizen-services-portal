import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,        // 👈 set your desired port
    host: true,        // optional: allows access via LAN IP
    open: true         // optional: auto-open browser
  },


  plugins: [react()],
});
