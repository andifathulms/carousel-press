import { describe, expect, it } from 'vitest';
import { parse } from 'carousel-core/src/core/parser';
import { bubblesItem, optionsItem, splitOptions } from 'carousel-core/src/templates/ljk';
import { getVariant } from 'carousel-core/src/templates/registry';
import { layoutSlide } from 'carousel-core/src/render/renderSlide';

const fake = { width: (t: string, f: { size: number }) => t.length * f.size * 0.52 };
const deck = (body: string) => parse(`template: lexicon/lembar\n---\n${body}`).deck;

describe('LJK options (lexicon/lembar)', () => {
  it('splits A–E body lines from the text around them', () => {
    const s = deck('[card number=off]\nSoal\nBaca dulu.\nA. Rp5.000\nB. Rp6.500\nC. Rp8.000\nJawab dulu, baru geser.').slides[0]!;
    const split = splitOptions(s.body)!;
    expect(split.options.map((o) => `${o.letter}:${o.text}`)).toEqual(['A:Rp5.000', 'B:Rp6.500', 'C:Rp8.000']);
    expect(split.pre.flat().map((l) => l.map((r) => r.text).join(''))).toEqual(['Baca dulu.']);
    expect(split.post.flat().map((l) => l.map((r) => r.text).join(''))).toEqual(['Jawab dulu, baru geser.']);
  });

  it('needs at least two options', () => {
    expect(splitOptions(deck('[card]\nX\nA. hanya satu').slides[0]!.body)).toBeNull();
  });

  it('falls back to plain body when an option cannot fit one line', () => {
    const v = getVariant('lexicon/lembar');
    expect(optionsItem([{ letter: 'A', text: 'x'.repeat(200) }, { letter: 'B', text: 'y' }], v, fake, 0)).toBeNull();
    expect(optionsItem([{ letter: 'A', text: 'Rp5.000' }, { letter: 'B', text: 'Rp6.500' }], v, fake, 0)?.kind).toBe('options');
  });

  it('fills the answer bubble from a "Jawaban X" verdict', () => {
    const s = deck('[card verdict="3 · Jawaban C" tone=ok]\nTrik\nKerja').slides[0]!;
    const b = bubblesItem(s, 0);
    expect(b && 'label' in b ? b.label : null).toBe('C');
    expect(bubblesItem(deck('[card verdict="Benar" tone=ok]\nX').slides[0]!, 0)).toBeNull();
  });

  it('only lexicon/lembar turns options into rows', () => {
    const text = '[card number=off]\nSoal\nA. satu\nB. dua\nC. tiga';
    for (const id of ['lexicon/lembar', 'lexicon/notebook', 'editorial/sage']) {
      const d = parse(`template: ${id}\n---\n${text}`).deck;
      const L = layoutSlide(d.slides[0]!, d, getVariant(id), fake, null, false);
      expect(L.stack.placed.some((p) => p.item.kind === 'options')).toBe(id === 'lexicon/lembar');
    }
  });
});
