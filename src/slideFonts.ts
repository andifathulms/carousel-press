// Slide faces: the renderer loads them from carousel-core's fonts/ through the FontFace API.
// Vite hashes the files, so each one's URL comes from this glob. Import first.
import { configureFonts } from 'carousel-core/src/fonts/fontSources';

const FILES = import.meta.glob<string>('../packages/carousel-core/fonts/*.woff2', { query: '?url', import: 'default', eager: true });

configureFonts({
  resolveUrl(file) {
    const url = FILES[`../packages/carousel-core/fonts/${file}`];
    if (!url) throw new Error(`Font file missing from the build: ${file}`);
    return url;
  },
});
