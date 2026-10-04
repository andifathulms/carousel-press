import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from '../src/core/parser';
import { SAMPLE_PHOTO_IDS } from '../src/samples/photos';
import { fakeMeasurer } from '../src/layout/measure';
import { deckIcons, layoutSlide } from '../src/render/renderSlide';
import { SAFE, insideSafe } from '../src/render/safezone';
import { VARIANTS } from '../src/templates/registry';

const SAMPLES = readdirSync(new URL('../src/samples/', import.meta.url)).filter((f) => f.endsWith('.txt')).map((f) => f.slice(0, -4));
const text = (n: string) => readFileSync(new URL(`../src/samples/${n}.txt`, import.meta.url), 'utf8');

// An extra deck that exercises every slide type, attribute and flag.
const KITCHEN_SINK = `handle: @a-very-long-handle-name-for-testing-truncation
---
[cover kicker="ALL • TYPES"]
Every *type* | in one deck
With a subtitle that runs a little long to wrap.
---
[icon=star]
A card with \`inline code\` and an icon
Body text that goes on for a while to make sure it wraps onto several lines.
---
[code]
A code slide
With body
\`\`\`js
const x = await fetch(url) // comment
\`\`\`
And a note.
---
[quote icon=book]
Be curious, not judgmental.
— Someone wise
A short body line.
---
[cta="Follow for more"]
Last card doubles as CTA
---
[end]
Thanks!
See you next time.`;

describe('safe zone (every template × slide type × sample)', () => {
  for (const v of VARIANTS) {
    for (const name of [...SAMPLES, 'kitchen-sink']) {
      it(`${v.id} · ${name}`, () => {
        const src = name === 'kitchen-sink' ? KITCHEN_SINK : text(name);
        const { deck } = parse(src, { photoIds: ['sample-dusk', ...SAMPLE_PHOTO_IDS] });
        const icons = deckIcons(deck, v);
        const bad: string[] = [];
        deck.slides.forEach((s, i) => {
          for (const hasPhoto of [false, !!s.photoId]) {
            const L = layoutSlide(s, deck, v, fakeMeasurer, icons[i] ?? null, hasPhoto);
            for (const b of L.boxes) {
              if (!insideSafe(b)) bad.push(`slide ${i + 1} ${b.kind} ${JSON.stringify(b)}`);
            }
            expect(L.boxes.length).toBeGreaterThan(0);
          }
        });
        expect(bad).toEqual([]);
      });
    }
  }
  it('SAFE stays clear of the TikTok UI zones', () => {
    expect(SAFE.right).toBeLessThan(930);
    expect(SAFE.top).toBeGreaterThan(170);
    expect(SAFE.bottom).toBeLessThanOrEqual(1520);
  });
});
