import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    //use jsdom for react components to render in browser
    environment: 'jsdom',

    //runs setupTests.ts before every test file 
    setupFiles: ['./setupTests.ts'],

    //collect coverage 
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov'],
      include: ['@/components/**/*.tsx'],
      exclude: ['@/components/ui/**', '@/hooks/**', '**/node_modules/**', '**/*.config.*'],
    },

    globals: true,
    exclude: ['@/components/ui/**', '@/hooks/**', '**/node_modules/**'],  // exclude shadcn ui components
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './@'),
      'root': path.resolve('../'),
      'src': path.resolve(__dirname, './src')
    },
  },
});