// Slide faces: the renderer loads them from fonts/ through the FontFace API.
// Vite hashes the files, so each one's URL comes from this glob. Import first.
import { configureFonts } from './fonts/fontSources';

const FILES = import.meta.glob<string>('../fonts/*.woff2', { query: '?url', import: 'default', eager: true });

configureFonts({
  resolveUrl(file) {
    const url = FILES[`../fonts/${file}`];
    if (!url) throw new Error(`Font file missing from the build: ${file}`);
    return url;
  },
});
