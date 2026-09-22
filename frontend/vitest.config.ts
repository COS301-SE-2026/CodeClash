import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS ?? ''} --no-experimental-webstorage`.trim();

export default defineConfig({
  plugins: [react()],
  test: {
    server: {
      deps: {
        inline: ['aws-amplify', '@aws-amplify/core', '@aws-amplify/auth'],
      }
    },

    //use jsdom for react components to render in browser
    environment: 'jsdom',

    //runs setupTests.ts before every test file 
    setupFiles: ['./test/setupTests.ts'],

    //collect coverage 
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'lcov'],
      include: ['**/*.tsx'],
      exclude: ['**/@/components/ui/**', '**/@/hooks/**', '**/node_modules/**', '**/*.config.*', 'tests/**'],
      thresholds: {   // initial boundaries to improve coverage - this will be increased
        branches: 60,
        functions: 70
      }
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