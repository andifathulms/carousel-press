// Library build: dist/{index,parse,zip}.js (ESM, JSZip external). All files sit in
// dist/ itself (no chunk folder) so the default font base, ../fonts/, is the package's fonts/.
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const here = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: here,
  publicDir: false,
  build: {
    outDir: resolve(here, 'dist'),
    emptyOutDir: true,
    target: 'es2022',
    minify: false,
    sourcemap: true,
    lib: {
      entry: { index: resolve(here, 'src/index.ts'), parse: resolve(here, 'src/parse.ts'), zip: resolve(here, 'src/zip.ts') },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['jszip'],
      output: { entryFileNames: '[name].js', chunkFileNames: '[name]-[hash].js' },
    },
  },
});
