import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'public'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['modern-normalize']
        }
      }
    },
    minify: 'terser',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
});