import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'carousel-core/src/core/parser';
import { richToPlain } from 'carousel-core/src/core/inline';

// Sejarah Nusantara length ceilings (docs/channels.md §3, owner 12 Nov 2026): card bodies ≤ 45 words,
// the hook card ≤ 40, cover subtitle ≤ 28, the note under a quote ≤ 30. Longer text squeezes the
// arsip photos out (docs/SPEC-arsip.md §5). The 35-word floor is a writing target, not tested:
// a short true slide beats a padded one.
const dir = join(__dirname, '../src/samples');
const decks = readdirSync(dir).filter((f) => /^sejarah-.*\.txt$/.test(f));
const words = (s: string): number => s.split(/\s+/).filter(Boolean).length;

describe('sejarah deck lengths', () => {
  it('finds the decks', () => expect(decks.length).toBeGreaterThanOrEqual(43));
  for (const f of decks) {
    it(f, () => {
      const { deck } = parse(readFileSync(join(dir, f), 'utf8'));
      const over: string[] = [];
      let card = 0;
      deck.slides.forEach((s) => {
        const n = words(richToPlain(s.body));
        let max = Infinity;
        if (s.type === 'card') max = ++card === 1 ? 40 : 45;
        else if (s.type === 'cover') max = 28;
        else if (s.type === 'quote') max = 30;
        if (n > max) over.push(`slide ${s.index + 1} (${s.type}): ${n} > ${max}`);
      });
      expect(over).toEqual([]);
    });
  }
});
