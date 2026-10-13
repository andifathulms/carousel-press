import { describe, expect, it } from 'vitest';
import { VARIANTS, checkVariant } from 'carousel-core/src/templates/registry';
import { BUILTIN_TEMPLATE_IDS } from 'carousel-core/src/core/types';

describe('registry', () => {
  it('has a variant for every template id', () => {
    expect(VARIANTS.map((v) => v.id).sort()).toEqual([...BUILTIN_TEMPLATE_IDS].sort());
  });
});

// DESIGN §4.4, through the same validator registerVariant() applies to host variants.
describe('contrast and structure (DESIGN §4.4)', () => {
  for (const v of VARIANTS) {
    it(v.id, () => {
      expect(checkVariant(v)).toEqual([]);
    });
  }
});
