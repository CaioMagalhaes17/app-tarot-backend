import { resolve } from 'path';
import { loadEnv } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'db'],
    root: '.',
    env: loadEnv('', process.cwd(), ''),
    testTimeout: 100000,
    alias: {
      '@': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
      '@core': resolve(__dirname, './src/core'),
      '@infra': resolve(__dirname, './src/core/infra'),
      '@domain': resolve(__dirname, './src/domain'),
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
      '@core': resolve(__dirname, './src/core'),
      '@infra': resolve(__dirname, './src/core/infra'),
      '@domain': resolve(__dirname, './src/domain'),
    },
  },
  plugins: [tsConfigPaths()],
});
