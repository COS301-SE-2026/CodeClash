import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
     globals: true,
     exclude: ['**/node_modules/**', '**/tests/unit/api/**' ],

     coverage: {
        provider: 'v8',
        reporter: ['text','lcov'],
        include: ['src/**'],
        exclude: ['src/tests/**']
     }
    }
})