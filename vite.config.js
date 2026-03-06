import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'apexcharts/client': 'apexcharts',
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/lab', '@emotion/react', '@emotion/styled'],
          charts: ['apexcharts', 'react-apexcharts'],
          motion: ['framer-motion', 'pixi.js', '@pixi/particle-emitter'],
          sentry: ['@sentry/react'],
        },
      },
    },
  },
});
