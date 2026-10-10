// `counter: on | off` header key: parser behaviour and layout stability.
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { setHeaderKey } from '../src/core/headerEdit';
import { parse } from '../src/core/parser';
import { isBlocking } from '../src/core/types';
import { fakeMeasurer } from '../src/layout/measure';
import { deckIcons, layoutSlide } from '../src/render/renderSlide';
import { VARIANTS } from '../src/templates/registry';

const SAMPLES = readdirSync(new URL('../src/samples/', import.meta.url)).filter((f) => f.endsWith('.txt'));
const text = (f: string) => readFileSync(new URL(`../src/samples/${f}`, import.meta.url), 'utf8');

describe('parser', () => {
  it('counter: off hides the counter', () => {
    const r = parse('counter: off\n---\nA\n---\nB');
    expect(r.warnings).toEqual([]);
    expect(r.deck.counter).toBe(false);
    expect(r.deck.header.counter).toBe('off');
  });
  it('counter: on is the default behaviour, and leaves the deck shape unchanged', () => {
    const on = parse('handle: x\ncounter: on\n---\nA');
    expect(on.warnings).toEqual([]);
    expect(on.deck.counter).toBeUndefined();
    expect('counter' in parse('handle: x\n---\nA').deck).toBe(false);
  });
  it('a missing key keeps the counter on, without a header key', () => {
    const r = parse('A\n---\nB');
    expect(r.deck.counter).toBeUndefined();
    expect(r.deck.header).toEqual({});
  });
  it('an invalid value warns unknown-counter (non-blocking) and falls back to on', () => {
    const r = parse('handle: x\ncounter: hide\n---\nA');
    expect(r.deck.counter).toBeUndefined();
    expect(r.warnings).toMatchObject([{ code: 'unknown-counter', line: 1, slideIndex: null }]);
    expect(isBlocking(r.warnings[0]!)).toBe(false);
    expect(parse('counter: OFF\n---\nA').warnings.map((w) => w.code)).toEqual(['unknown-counter']);
  });
  it('reads CRLF text', () => {
    const r = parse('counter: off\r\nlang: en\r\n---\r\nA\r\n---\r\nB\r\n');
    expect(r.warnings).toEqual([]);
    expect(r.deck.counter).toBe(false);
    expect(r.deck.lang).toBe('en');
  });
  it('counter alone is enough to make a header', () => {
    const r = parse('counter: off\n---\nA');
    expect(r.deck.hasHeader).toBe(true);
    expect(r.deck.slides).toHaveLength(1);
  });
});

describe('layout', () => {
  it('counter: off removes only the counter box, on every slide in every template', () => {
    let slides = 0;
    for (const f of SAMPLES) {
      const on = parse(text(f)).deck;
      const off = parse(setHeaderKey(text(f), 'counter', 'off')).deck;
      expect(off.counter).toBe(false);
      for (const v of VARIANTS) {
        const iconsOn = deckIcons(on, v);
        const iconsOff = deckIcons(off, v);
        expect(iconsOff).toEqual(iconsOn);
        on.slides.forEach((s, i) => {
          const a = layoutSlide(s, on, v, fakeMeasurer, iconsOn[i] ?? null, false);
          const b = layoutSlide(off.slides[i]!, off, v, fakeMeasurer, iconsOff[i] ?? null, false);
          expect(b.boxes.some((x) => x.kind === 'counter')).toBe(false);
          expect(b.footer.counter).toBeNull();
          expect(b.boxes).toEqual(a.boxes.filter((x) => x.kind !== 'counter'));
          expect(b.footer.swipe).toEqual(a.footer.swipe);
          expect(b.header).toEqual(a.header);
          expect(b.ctaLabel).toBe(a.ctaLabel);
          slides++;
        });
      }
    }
    expect(slides).toBeGreaterThan(1000);
  }, 30_000);
});
