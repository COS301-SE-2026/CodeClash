<<<<<<< HEAD
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
            exclude: [
                'src/tests/**', 
                '**/config/**', 
                'src/**/*.dto.*', 
                'src/application/interfaces/**', 
                'src/entities/db-entities/**',
                'src/entities/components.ts',
                'src/entities/ecs-entities.ts',
                'src/frameworks-drivers/config/**',
                'src/interface-adapters/auth/index.d.ts'
            ]
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
=======
import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        exclude: ['**/node_modules/**', '**/tests/unit/api/**', '**/config/**', 'tests/integration/**'],

        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**'],
            exclude: ['src/tests/**', '**/config/**']
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
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
})