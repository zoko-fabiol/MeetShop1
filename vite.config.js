import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    watch: {
      usePolling: true,
      interval: 800,
      ignored: ['**/.*', '**/*.~tmp', '**/*.tmp', '**/*.crdownload', '**/node_modules/**', '**/dist/**']
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-html2canvas': ['html2canvas']
        }
      }
    }
  }
});
