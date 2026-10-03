import { uniqueId } from '../core/slug';
import { parse, splitLines, tokenizeTag } from '../core/parser';
import type { DeckSettings } from './deckStore';
import { DEFAULT_DECK_SETTINGS } from './deckStore';

export const DECK_FORMAT = 'carousel-press/1';

export interface DeckFilePhoto {
  id: string;
  name: string;
  focalX: number;
  focalY: number;
  mime: string;
  dataBase64: string;
}

export interface DeckFile {
  format: typeof DECK_FORMAT;
  text: string;
  settings: DeckSettings;
  photos: DeckFilePhoto[];
}

/** Photo ids a deck references (by id or tray index). */
export function referencedPhotoIds(text: string, trayIds: readonly string[]): string[] {
  const { deck } = parse(text, { photoIds: trayIds });
  return [...new Set(deck.slides.map((s) => s.photoId).filter((x): x is string => !!x))];
}

/** Validate untrusted JSON as a deck file. Throws a readable error. */
export function validateDeckFile(json: unknown): DeckFile {
  if (!json || typeof json !== 'object') throw new Error('Not a deck file.');
  const o = json as Record<string, unknown>;
  if (o.format !== DECK_FORMAT) throw new Error(`Unsupported deck file format "${String(o.format)}".`);
  if (typeof o.text !== 'string') throw new Error('Deck file has no text.');
  const photos = Array.isArray(o.photos) ? o.photos : [];
  const clean: DeckFilePhoto[] = [];
  for (const p of photos) {
    if (!p || typeof p !== 'object') continue;
    const q = p as Record<string, unknown>;
    if (typeof q.id !== 'string' || typeof q.dataBase64 !== 'string') continue;
    clean.push({
      id: q.id, name: typeof q.name === 'string' ? q.name : q.id,
      focalX: clamp01(q.focalX), focalY: clamp01(q.focalY),
      mime: typeof q.mime === 'string' && /^image\//.test(q.mime) ? q.mime : 'image/jpeg',
      dataBase64: q.dataBase64,
    });
  }
  const s = (o.settings ?? {}) as Partial<DeckSettings>;
  const darkness = typeof s.darkness === 'number' ? Math.min(100, Math.max(0, s.darkness)) : DEFAULT_DECK_SETTINGS.darkness;
  return { format: DECK_FORMAT, text: o.text, settings: { darkness }, photos: clean };
}

function clamp01(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.5;
}

/** Pick ids for imported photos, renaming on collision. */
export function planPhotoIds(incoming: readonly string[], existing: Iterable<string>): Map<string, string> {
  const taken = new Set(existing);
  const map = new Map<string, string>();
  for (const id of incoming) {
    const next = uniqueId(id, taken);
    taken.add(next);
    map.set(id, next);
  }
  return map;
}

/** Rewrite `photo=` references in tag lines according to a rename map. Other lines are untouched. */
export function rewritePhotoRefs(text: string, renames: ReadonlyMap<string, string>): string {
  if (![...renames].some(([a, b]) => a !== b)) return text;
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  return splitLines(text).map((line) => {
    const t = line.trim();
    if (!/^\[[^\]]*\]$/.test(t)) return line;
    const tokens = tokenizeTag(t.slice(1, -1));
    const photo = tokens.find((x) => x.key === 'photo' && typeof x.value === 'string');
    if (!photo || typeof photo.value !== 'string') return line;
    const to = renames.get(photo.value);
    if (!to || to === photo.value) return line;
    return line.replace(new RegExp(`photo=("?)${escapeRe(photo.value)}\\1(?=[\\s\\]])`), `photo=${to}`);
  }).join(eol);
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = '';
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(bin);
}

export function base64ToBlob(b64: string, mime: string): Blob {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
