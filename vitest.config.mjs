import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ include: /\.[jt]sx?$/ })],
  esbuild: {
    loader: 'jsx',
    include: /.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: { loader: { '.js': 'jsx' } },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['src/utils/**/*.js', 'src/services/apiClient.js', 'src/app/**/*.js', 'src/components/auth/**/*.js'],
      thresholds: {
        lines: 60,
        functions: 60,
        statements: 60,
        branches: 55,
      },
    },
  },
});
