import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
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
    strictPort: false,
  },
  build: {
    outDir: 'build',
    manifest: true,
    minify: 'terser',
    chunkSizeWarningLimit: 500,
    terserOptions: {
      compress: {
        passes: 3,
        drop_console: true,
        pure_getters: true,
        unsafe_arrows: true,
      },
      format: { comments: false, semicolons: false },
    },
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild
          ? undefined
          : {
              react: ['react', 'react-dom', 'react-router-dom'],
              mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
              charts: ['recharts'],
              sentry: ['@sentry/react'],
              forms: ['react-hook-form', '@hookform/resolvers', 'yup', 'zod'],
              utilities: ['change-case', 'date-fns', 'numeral'],
            },
      },
    },
  },
}));
