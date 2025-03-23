import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envDir: './environment', // Ensure this points to your environment directory
  plugins: [react()],
  build: {
    outDir: 'dist' // Ensure this matches Render's expectation
  }
});