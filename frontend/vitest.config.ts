import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    //use jsdom for react components to render in browser
    environment: 'jsdom',

    //runs setupTests.ts before every test file 
    setupFiles: ['./setupTests.ts'],

    //collect coverage 
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['@/components/**/*.tsx'],
    },

    globals: true,
    exclude: ['@/components/ui/**', '@/hooks/**'],  // exclude shadcn ui components
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});