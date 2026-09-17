import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        exclude: ['**/node_modules/**', '**/config/**'],

        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**'],
            exclude: [
                'src/tests/**', 
                '**/config/**', 
                'src/**/*.dto.*', 
                'src/application/interfaces/**', 
                'src/entities/database/**',
                'src/entities/components.ts',
                'src/entities/ecs-entities.ts',
                'src/frameworks-drivers/config/**',
                'src/interface-adapters/auth/index.d.ts'
            ],
            thresholds: {   // initial boundaries to improve coverage - this will be increased
                branches: 60,
                functions: 70
            }
        },
        setupFiles: ['./tests/setup.ts'],
        fileParallelism: false,
    },
    resolve: {
        alias: {
            'root': path.resolve('../'),
            'src': path.resolve('./src')
        },
    },
})