// Font gate without CSS: manifest, FontFace registration, host faces, errors.
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildManifest } from '../packages/carousel-core/scripts/sync-fonts';

interface FakeFace { family: string; source: string; descriptors: Record<string, string> }
let added: FakeFace[];
let loadImpl: (spec: string) => Promise<unknown[]>;

beforeEach(() => {
  vi.resetModules();
  added = [];
  loadImpl = async () => [{}];
  vi.stubGlobal('FontFace', class {
    constructor(public family: string, public source: string, public descriptors: Record<string, string>) {}
  });
  vi.stubGlobal('document', {
    fonts: {
      add: (f: FakeFace) => added.push(f),
      load: (spec: string) => loadImpl(spec),
      check: () => true,
      ready: Promise.resolve(),
    },
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const fresh = async () => {
  const fonts = await import('carousel-core/src/fonts/loadFonts');
  const { getVariant } = await import('carousel-core/src/templates/registry');
  return { ...fonts, getVariant };
};

describe('manifest', () => {
  it('matches what npm run fonts:sync would write from @fontsource', () => {
    const { manifest, copies, licences } = buildManifest();
    expect(JSON.parse(readFileSync(new URL('../packages/carousel-core/fonts/manifest.json', import.meta.url), 'utf8'))).toEqual(manifest);
    for (const [from, to] of [...copies, ...licences]) {
      expect(readFileSync(new URL(`../packages/carousel-core/fonts/${to}`, import.meta.url)).equals(readFileSync(from)), to).toBe(true);
    }
  });
});

describe('loadFonts', () => {
  it('registers exactly the files a variant needs, with their unicode ranges', async () => {
    const { loadFonts, configureFonts, getVariant } = await fresh();
    configureFonts({ baseUrl: 'https://cdn.example/app/fonts' });
    await loadFonts(getVariant('dev/github-dark'));
    const inter700 = added.find((f) => f.family === 'Inter' && f.descriptors.weight === '700')!;
    expect(inter700.source).toBe('url("https://cdn.example/app/fonts/inter-latin-700-normal.woff2") format("woff2")');
    expect(inter700.descriptors.unicodeRange).toBeUndefined();
    const gentium = added.filter((f) => f.family === 'Gentium Book Plus');
    expect(gentium.length).toBeGreaterThan(1);
    expect(gentium.every((f) => typeof f.descriptors.unicodeRange === 'string')).toBe(true);
    expect(added.some((f) => f.family === 'Playfair Display')).toBe(false);
    const before = added.length;
    await loadFonts(getVariant('dev/terminal'));
    expect(added.filter((f) => f.family === 'Inter' && f.descriptors.weight === '700')).toHaveLength(1);
    expect(added.length).toBeGreaterThanOrEqual(before);
  });

  it('uses host faces first, including one variable-weight file for a range', async () => {
    const { loadFace, configureFonts } = await fresh();
    configureFonts({
      baseUrl: '/fonts/',
      faces: [{ family: 'Host Sans', weight: [100, 900], url: '/static/host-sans-var.woff2' }, { family: 'Host Sans', weight: 400, style: 'italic', url: '/static/host-sans-italic.woff2' }],
    });
    await loadFace('Host Sans', 650);
    expect(added).toHaveLength(1);
    expect(added[0]!.descriptors.weight).toBe('100 900');
    expect(added[0]!.source).toContain('/static/host-sans-var.woff2');
    await loadFace('Host Sans', 300);
    expect(added).toHaveLength(1);
  });

  it('rejects with the face and its URL when a file fails', async () => {
    const { loadFonts, configureFonts, getVariant } = await fresh();
    configureFonts({ baseUrl: '/f/' });
    loadImpl = async (spec) => {
      if (spec.includes('"Inter"')) throw new Error('NetworkError');
      return [{}];
    };
    await expect(loadFonts(getVariant('dev/github-dark'))).rejects.toThrow(/carousel-core: font \d+ "Inter" failed to load from \/f\/inter-latin-\d+-normal\.woff2: NetworkError/);
  });

  it('rejects after the timeout, naming the faces still pending', async () => {
    vi.useFakeTimers();
    const { loadFonts, configureFonts, getVariant } = await fresh();
    configureFonts({ baseUrl: '/f/' });
    loadImpl = (spec) => (spec.includes('"Amiri Quran"') ? new Promise(() => {}) : Promise.resolve([{}]));
    const p = loadFonts(getVariant('serene/fajr'));
    const caught = p.catch((e: Error) => e);
    await vi.advanceTimersByTimeAsync(8000);
    const err = await caught;
    expect((err as Error).message).toBe('carousel-core: fonts for "Fajr" didn\'t load within 8 s; still waiting for 400 "Amiri Quran"');
  });

  it('names faces that have no file at all', async () => {
    const { loadFace, configureFonts } = await fresh();
    configureFonts({ baseUrl: '/f/' });
    loadImpl = async () => [];
    await expect(loadFace('Nope Sans', 400)).rejects.toThrow('carousel-core: font 400 "Nope Sans" failed to load (no font file: add it with configureFonts({ faces })): not available after loading');
  });

  it('explains how to serve fonts when the default base is a file: URL', async () => {
    vi.stubGlobal('location', { protocol: 'https:' });
    const { loadFace } = await fresh();
    await expect(loadFace('Inter', 400)).rejects.toThrow(/Copy the package's fonts\/ folder .* configureFonts\(\{ baseUrl/);
  });

  it('validates host faces', async () => {
    const { configureFonts } = await fresh();
    expect(() => configureFonts({ faces: [{ family: 'X', weight: [900, 100], url: '/x.woff2' }] })).toThrow(/\[min, max\]/);
  });
});
