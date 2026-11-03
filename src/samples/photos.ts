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
  'bengkulu-stadler-1799': [0.3, 0.5],
  'bengkulu-raffles': [0.5, 0.3],
  'ende-penari': [0.7, 0.45],
  'ende-gedung-pancasila': [0.45, 0.5],
  'sultanah-taman-1880': [0.55, 0.5],
  'gorontalo-wartabone': [0.5, 0.35],
  'gorontalo-teluk': [0.35, 0.6],
  'gorontalo-monumen': [0.5, 0.45],
  'gorontalo-suwawa': [0.5, 0.65],
  'anoi-kampong': [0.56, 0.5],
  'penyengat-masjid': [0.5, 0.55],
  'penyengat-makam-hamidah': [0.45, 0.5],
  'penyengat-pendaratan': [0.45, 0.6],
  'penyengat-makam-raja-ali-haji': [0.52, 0.45],
  'penyengat-sultan-riouw': [0.52, 0.45],
  'pitung-tanah-abang-1890': [0.6, 0.5],
  'pitung-tanah-abang-1899': [0.4, 0.5],
  'pitung-kali-tanah-abang': [0.4, 0.55],
  'pitung-rumah-marunda': [0.43, 0.5],
  'pitung-rumah-papan': [0.65, 0.55],
  'muarojambi-gumpung': [0.5, 0.6],
  'muarojambi-kedaton': [0.45, 0.55],
  'muarojambi-kembar-batu': [0.5, 0.6],
  'muarojambi-reruntuhan': [0.5, 0.6],
  'muarojambi-atisha': [0.5, 0.4],
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
