// dist/browser.js: one self-contained ESM file (JSZip bundled) for pages without a bundler.
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const here = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: here,
  publicDir: false,
  build: {
    outDir: resolve(here, 'dist'),
    emptyOutDir: false,
    target: 'es2022',
    sourcemap: true,
    lib: { entry: resolve(here, 'src/browser.ts'), formats: ['es'], fileName: () => 'browser.js' },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
