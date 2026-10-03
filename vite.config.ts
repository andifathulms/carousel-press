import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

// REVIEW=1 adds the dev-only review page; production builds ship index.html only.
const withReview = process.env.REVIEW === '1';

export default defineConfig({
  base: process.env.BASE_PATH ?? './',
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
