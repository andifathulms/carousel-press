import { describe, expect, it } from 'vitest';
import { fakeMeasurer as m } from '../src/layout/measure';
import { type StackItem, type TextSpec, fitStack } from '../src/layout/stack';
import { parseInline, parseRich } from '../src/core/inline';

const mono = { family: 'JetBrains Mono', weight: 400 };
const headline: TextSpec = { family: 'Playfair Display', weight: 700, max: 92, min: 64, step: 4, lh: 1.12, maxLines: 6, widowFix: true, mono };
const body: TextSpec = { family: 'Poppins', weight: 400, max: 42, min: 32, step: 2, lh: 1.5, maxLines: 8, mono };
const frame = { x: 96, width: 816, top: 344, limit: 1400 };

const words = (n: number) => Array.from({ length: n }, () => 'kata').join(' ');
const head = (s: string): StackItem => ({ kind: 'text', role: 'headline', rich: [parseInline(s)], spec: headline, gap: 48 });
const bod = (s: string): StackItem => ({ kind: 'text', role: 'body', rich: parseRich([s]), spec: body, gap: 48 });
const icon: StackItem = { kind: 'icon', h: 120, w: 120, gap: 72 };
const badge: StackItem = { kind: 'badge', h: 120, w: 120, gap: 0 };

describe('fitStack', () => {
  it('fits at max sizes when there is room', () => {
    const r = fitStack([badge, head('Short title'), bod('Short body'), icon], frame, m);
    expect(r.overflow).toBe(false);
    expect(r.droppedIcon).toBe(false);
    expect(r.placed.map((p) => p.size)).toEqual([0, 92, 42, 0]);
    expect(r.placed[1]!.y).toBe(344 + 120 + 48);
  });
  it('drops the icon first', () => {
    const r = fitStack([badge, head(words(14)), bod(words(40)), icon], frame, m);
    expect(r.droppedIcon).toBe(true);
    expect(r.placed.some((p) => p.item.kind === 'icon')).toBe(false);
  });
  it('steps down body before headline (priority order, round robin)', () => {
    const r = fitStack([badge, head(words(14)), bod(words(60))], frame, m);
    const [, h, b] = r.placed;
    expect(r.overflow).toBe(false);
    expect(b!.size).toBeLessThan(42);
    expect(h!.size).toBeGreaterThanOrEqual(b!.size);
    expect(r.bottom).toBeLessThanOrEqual(1400);
  });
  it('flags overflow when everything is at min and still too tall', () => {
    const r = fitStack([badge, head(words(30)), bod(words(300))], frame, m);
    expect(r.overflow).toBe(true);
    expect(r.placed[1]!.size).toBe(64);
    expect(r.placed[2]!.size).toBe(32);
  });
  it('enforces the max-lines cap', () => {
    const r = fitStack([head(Array.from({ length: 9 }, (_, i) => `l${i}`).join(' | '))], frame, m);
    expect(r.overflow).toBe(true);
  });
  it('steps a capped block down before others', () => {
    const capped = { ...body, maxLines: 2 };
    const item: StackItem = { kind: 'text', role: 'body', rich: parseRich([words(18)]), spec: capped, gap: 0 };
    const r = fitStack([head('Hi'), item], frame, m);
    expect(r.placed[0]!.size).toBe(92);
    expect(r.placed[1]!.wrap!.lines.length).toBeLessThanOrEqual(2);
  });
  it('reports long words', () => {
    const r = fitStack([head('x'.repeat(40))], frame, m);
    expect(r.charBroken).toBe(true);
  });
});
