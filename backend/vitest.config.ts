import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        exclude: ['**/node_modules/**', '**/tests/unit/api/**', '**/config/**'],

        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**'],
            exclude: ['src/tests/**', '**/config/**']
        },
        setupFiles: ['./tests/setup.ts']
    },
    resolve: {
        alias: {
            'root': path.resolve('../'),
            'src': path.resolve('./src')
        },
    },
})