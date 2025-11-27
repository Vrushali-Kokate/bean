import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use the PORT environment variable if available, otherwise default to 8080
const PORT = Number(process.env.PORT) || 8080;

export default defineConfig({
  plugins: [react()],
  server: {
    port: PORT,
    host: '0.0.0.0',
  },
  preview: {
    port: PORT,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  define: {
    // Safely replace specific environment variables without overwriting the whole process.env object
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});