import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['**/*.int-spec.ts'],
        root: './',
    },
    plugins: [swc.vite()],
});
