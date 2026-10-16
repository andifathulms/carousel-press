// renderDeck / exportZip without a real canvas: drawing and fonts are stubbed,
// layout runs for real on a fake measuring context.
import JSZip from 'jszip';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const events: string[] = [];
let releaseFonts: () => void = () => {};
let charWidth = 10;
const drawn: { photo: unknown; icon: unknown; darkness: number }[] = [];

vi.mock('carousel-core/src/fonts/loadFonts', () => ({
  loadFonts: vi.fn(() => {
    events.push('fonts:requested');
    return new Promise<void>((res) => {
      releaseFonts = () => {
        events.push('fonts:resolved');
        res();
      };
    });
  }),
  // CJK slices for the deck's hanzi (SPEC-script §11); these decks have none.
  loadTextFonts: vi.fn(() => Promise.resolve()),
}));
vi.mock('carousel-core/src/export/exportPng', () => ({
  exportSlidePng: vi.fn(async (_s: unknown, _d: unknown, _v: unknown, a: { photo: unknown; icon: unknown; darkness: number }) => {
    events.push('draw');
    drawn.push(a);
    return { blob: new Blob(['png']), warnings: [] };
  }),
}));
vi.mock('carousel-core/src/render/ctx', () => ({
  makeCanvas: () => ({ canvas: {}, ctx: { font: '', measureText: (t: string) => ({ width: Array.from(t).length * charWidth }) } }),
}));
vi.mock('carousel-core/src/render/fontCheck', () => ({ faceAvailable: () => true }));

beforeEach(() => {
  events.length = 0;
  drawn.length = 0;
  charWidth = 10;
});

const auto = () => setTimeout(() => releaseFonts(), 5);

describe('renderDeck (PRD F7)', () => {
  it('resolves the font gate before drawing anything, then draws every slide in order', async () => {
    const { renderDeck } = await import('carousel-core/src/api/deck');
    const done = renderDeck('A\n---\nB\n---\n[end]\nC');
    await new Promise((r) => setTimeout(r, 20));
    expect(events).toEqual(['fonts:requested']);
    releaseFonts();
    const blobs = await done;
    expect(events.slice(0, 2)).toEqual(['fonts:requested', 'fonts:resolved']);
    expect(events.filter((e) => e === 'draw')).toHaveLength(3);
    expect(blobs).toHaveLength(3);
  });

  it('chooses icons itself (editorial auto icons on cards, none on cover/end)', async () => {
    const { renderDeck } = await import('carousel-core/src/api/deck');
    auto();
    await renderDeck('C\n---\nA\n---\nB\n---\n[end]\nE');
    expect(drawn.map((d) => d.icon === null)).toEqual([true, false, false, true]);
  });

  it('throws BlockingWarningsError before drawing when text overflows; render anyway on request', async () => {
    const { renderDeck, BlockingWarningsError } = await import('carousel-core/src/api/deck');
    charWidth = 400;
    const long = `Judul\n---\n${'kata '.repeat(60)}\n${'panjang '.repeat(80)}`;
    auto();
    const err = await renderDeck(long).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(BlockingWarningsError);
    expect((err as InstanceType<typeof BlockingWarningsError>).warnings.some((w) => w.code === 'overflow')).toBe(true);
    expect(events).not.toContain('draw');
    auto();
    expect(await renderDeck(long, { onBlocking: 'render' })).toHaveLength(2);
  });

  it('uses a photo record as the tray for photo=N and passes darkness through', async () => {
    const { renderDeck } = await import('carousel-core/src/api/deck');
    const dusk = { image: {} as ImageBitmap, width: 10, height: 10, focalX: 0.5, focalY: 0.5 };
    auto();
    let seen: string[] = [];
    await renderDeck('[cover photo=1]\nA\n---\n[photo=senja]\nB', {
      photos: { dusk }, darkness: 70, onWarnings: (ws) => { seen = ws.map((w) => w.code); },
    });
    expect(drawn[0]!.photo).toBe(dusk);
    expect(drawn[1]!.photo).toBeNull();
    expect(drawn.every((d) => d.darkness === 70)).toBe(true);
    expect(seen).toEqual(['unknown-photo']);
  });

  it('renders registered host templates', async () => {
    const { renderDeck } = await import('carousel-core/src/api/deck');
    const { registerVariant, getVariant } = await import('carousel-core/src/templates/registry');
    registerVariant({ ...getVariant('sport/papan'), id: 'nusastats/papan', name: 'NusaStats Papan' });
    auto();
    let template = '';
    await renderDeck('template: nusastats/papan\n---\nA', { onWarnings: (ws, d) => { template = d.template; expect(ws).toEqual([]); } });
    expect(template).toBe('nusastats/papan');
  });
});

describe('exportZip', () => {
  it('names files {slug}_NN.png in order, STORE-compressed', async () => {
    const { exportZip } = await import('carousel-core/src/api/zip');
    const zip = await JSZip.loadAsync(await exportZip([new Blob(['a']), new Blob(['b'])], 'Rata-rata Lama Sekolah'));
    expect(Object.keys(zip.files)).toEqual(['rata-rata-lama-sekolah_01.png', 'rata-rata-lama-sekolah_02.png']);
    expect(await zip.file('rata-rata-lama-sekolah_02.png')!.async('string')).toBe('b');
  });
});
