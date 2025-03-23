import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    host: true,
    // Explicitly allow the Render-generated hostname
    allowedHosts: [
      'candidate-search-mkzy.onrender.com',
      // Add any other hostnames you expect
      'localhost',
      '127.0.0.1'
    ]
  }
});