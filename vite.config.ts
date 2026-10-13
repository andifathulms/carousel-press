import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

// REVIEW=1 adds the dev-only review page; production builds ship index.html only.
const withReview = process.env.REVIEW === '1';

// The app compiles carousel-core from source (packages/carousel-core/src): one copy of the code.
const core = resolve(__dirname, 'packages/carousel-core/src');

export default defineConfig({
  base: process.env.BASE_PATH ?? './',
  resolve: {
    alias: [
      { find: /^carousel-core$/, replacement: `${core}/index.ts` },
      { find: /^carousel-core\/src\//, replacement: `${core}/` },
    ],
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        ...(withReview ? { review: resolve(__dirname, 'review.html') } : {}),
      },
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
