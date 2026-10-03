import { describe, expect, it, vi } from 'vitest';
import { parse } from '../src/core/parser';
import { getVariant } from '../src/templates/registry';

const events: string[] = [];
let releaseFonts: () => void = () => {};

vi.mock('../src/fonts/loadFonts', () => ({
  loadFonts: vi.fn(() => {
    events.push('fonts:requested');
    return new Promise<void>((res) => {
      releaseFonts = () => {
        events.push('fonts:resolved');
        res();
      };
    });
  }),
}));

vi.mock('../src/export/exportPng', () => ({
  exportSlidePng: vi.fn(async () => {
    events.push('draw');
    return { blob: new Blob(['png']), warnings: [] };
  }),
}));

describe('exportAll font gate (PRD F7)', () => {
  it('resolves the font promise before drawing anything', async () => {
    const { exportAll } = await import('../src/export/exportZip');
    const { deck } = parse('A\n---\nB\n---\n[end]\nC');
    const done = exportAll({ deck, variant: getVariant('editorial/rose-dusk'), icons: [], darkness: 50, getPhoto: async () => null });
    await new Promise((r) => setTimeout(r, 20));
    expect(events).toEqual(['fonts:requested']);
    releaseFonts();
    const { blob } = await done;
    expect(events.slice(0, 2)).toEqual(['fonts:requested', 'fonts:resolved']);
    expect(events.filter((e) => e === 'draw')).toHaveLength(3);
    expect(blob.size).toBeGreaterThan(0);
  });
});
