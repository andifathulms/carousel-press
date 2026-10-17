// Photos shipped with the sample decks. Loading a sample adds the ones it uses to the photo tray.
// Every file is free to reuse; CC BY / BY-SA credits are in the deck captions (docs/photo-credits.md).

const URLS = import.meta.glob<string>('./photos/*.jpg', { query: '?url', import: 'default', eager: true });

export interface SamplePhoto {
  id: string;
  url: string;
  focalX: number;
  focalY: number;
}

/** Focal points for the cover crop (0–1). Photos not listed here use the centre. */
const FOCAL: Record<string, [number, number]> = {
  'banten-surosowan': [0.38, 0.5],
  'banten-daendels': [0.5, 0.25],
  'banten-fort-diamant-gerbang': [0.47, 0.6],
  'bayu-peta-1728': [0.72, 0.6],
  'bayu-selat-bali': [0.62, 0.5],
  'trunajaya-peta-hurdt': [0.7, 0.45],
};

export const SAMPLE_PHOTOS: readonly SamplePhoto[] = Object.entries(URLS).map(([path, url]) => {
  const id = path.replace(/^.*\/|\.jpg$/g, '');
  const [focalX, focalY] = FOCAL[id] ?? [0.5, 0.5];
  return { id, url, focalX, focalY };
});

export const SAMPLE_PHOTO_IDS: readonly string[] = SAMPLE_PHOTOS.map((p) => p.id);

/** Bundled photo IDs a deck text refers to with `photo=`. */
export function samplePhotosIn(text: string): SamplePhoto[] {
  const refs = new Set([...text.matchAll(/\bphoto="?([^\s\]"]+)/g)].map((m) => m[1]));
  return SAMPLE_PHOTOS.filter((p) => refs.has(p.id));
}
