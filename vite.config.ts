import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    port: 5173,
    strictPort: false,  // Allow falling back to another port if needed
    host: true          // Expose to all network interfaces
  }
});