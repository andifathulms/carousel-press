import { describe, expect, it } from 'vitest';
import { parse } from 'carousel-core/src/core/parser';
import { fakeMeasurer } from 'carousel-core/src/layout/measure';
import { layoutSlide } from 'carousel-core/src/render/renderSlide';
import { VARIANTS } from 'carousel-core/src/templates/registry';

const deck = (kicker: string) => parse(`template: editorial/midnight\n---\n[card kicker="${kicker}" icon=none]\nJudul\nIsi.`).deck;
const v = VARIANTS.find((x) => x.id === 'editorial/midnight')!;
const warn = (kicker: string) => {
  const d = deck(kicker);
  return layoutSlide(d.slides[0]!, d, v, fakeMeasurer, null, false).warnings.map((w) => w.code);
};

describe('kicker width', () => {
  it('a short kicker fits', () => expect(warn('Situasinya')).not.toContain('overflow'));
  it('a kicker wider than SAFE is an overflow warning', () => expect(warn('x'.repeat(70))).toContain('overflow'));
});
