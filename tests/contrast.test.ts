import { describe, expect, it } from 'vitest';
import { contrast } from '../src/core/color';
import { VARIANTS } from '../src/templates/registry';
import { TEMPLATE_IDS } from '../src/core/types';

const CODE_TOKENS = ['text', 'prompt', 'command', 'subcommand', 'flag', 'string', 'number', 'keyword', 'fn', 'punct'] as const;

describe('registry', () => {
  it('has a variant for every template id', () => {
    expect(VARIANTS.map((v) => v.id).sort()).toEqual([...TEMPLATE_IDS].sort());
  });
  it('every variant has a deep surface and valid rotation', () => {
    for (const v of VARIANTS) {
      expect(v.surfaces.deep).toBeDefined();
      for (const r of v.rotation) expect(v.surfaces[r], `${v.id}:${r}`).toBeDefined();
    }
  });
});

describe('contrast (DESIGN §4.4)', () => {
  for (const v of VARIANTS) {
    for (const [name, s] of Object.entries(v.surfaces)) {
      it(`${v.id} / ${name}`, () => {
        const fails: string[] = [];
        const need = (label: string, ratio: number, min: number) => {
          if (ratio < min) fails.push(`${label} ${ratio.toFixed(2)} < ${min}`);
        };
        need('ink/bg', contrast(s.ink, s.bg), 4.5);
        need('ink/blob', contrast(s.ink, s.blob), 4.5);
        need('body/bg', contrast(s.body, s.bg), 4.5);
        need('body/blob', contrast(s.body, s.blob), 4.5);
        need('badgeInk/badgeBg', contrast(s.badgeInk, s.badgeBg), 3);
        need('muted/bg', contrast(s.muted, s.bg), 3);
        expect(fails).toEqual([]);
      });
    }
    it(`${v.id} / code`, () => {
      const fails: string[] = [];
      for (const k of CODE_TOKENS) {
        const r = contrast(v.code[k], v.code.panel);
        if (r < 4.5) fails.push(`${k} ${r.toFixed(2)}`);
      }
      const rc = contrast(v.code.comment, v.code.panel);
      if (rc < 3) fails.push(`comment ${rc.toFixed(2)}`);
      expect(fails).toEqual([]);
    });
  }
});
