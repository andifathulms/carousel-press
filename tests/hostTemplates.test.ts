// Host templates: ids outside the built-in list (PORTING §2.3).
import { describe, expect, it } from 'vitest';
import { parse } from 'carousel-core/src/core/parser';
import type { FamilyId } from 'carousel-core/src/core/types';

const hostFamily = (id: string): FamilyId | undefined =>
  ({ 'nusastats/pitch': 'dev', 'nusastats/doa': 'serene' } as Record<string, FamilyId>)[id];

describe('parser: template ids', () => {
  it('rejects a host id unless the host says which family it is', () => {
    expect(parse('template: nusastats/pitch\n---\nA').warnings.map((w) => w.code)).toEqual(['unknown-template']);
    const r = parse('template: nusastats/pitch\n---\nA', { templateFamily: hostFamily });
    expect(r.warnings).toEqual([]);
    expect(r.deck.template).toBe('nusastats/pitch');
  });
  it('uses the host family for family rules (serene: no automatic badges)', () => {
    const deck = 'template: nusastats/doa\n---\nA\n---\nB';
    expect(parse(deck, { templateFamily: hostFamily }).deck.slides[1]!.badge).toBeNull();
    expect(parse('template: nusastats/pitch\n---\nA\n---\nB', { templateFamily: hostFamily }).deck.slides[1]!.badge).toBe(1);
  });
});

import { BUILTIN_TEMPLATE_IDS } from 'carousel-core/src/core/types';
import { VariantError, getVariant, hasVariant, listVariants, registerVariant, templateFamily } from 'carousel-core/src/templates/registry';
import type { Variant } from 'carousel-core/src/templates/types';

const host = (id: string, from: string, patch: Partial<Variant> = {}): Variant => ({ ...getVariant(from), id, name: id, ...patch });

describe('registerVariant', () => {
  it('accepts a host variant on every existing family', () => {
    const fams = new Map(listVariants().map((v) => [v.family, v.id]));
    expect([...fams.keys()].sort()).toEqual(['dev', 'editorial', 'lexicon', 'serene', 'sport']);
    for (const [family, from] of fams) {
      const id = `host/${family}-one`;
      registerVariant(host(id, from));
      expect(hasVariant(id)).toBe(true);
      expect(templateFamily(id)).toBe(family);
      const r = parse(`template: ${id}\n---\nA`, { templateFamily });
      expect(r.warnings).toEqual([]);
      expect(r.deck.template).toBe(id);
    }
    expect(listVariants().length).toBe(BUILTIN_TEMPLATE_IDS.length + 5);
  });

  it('throws a clear error when contrast fails', () => {
    const base = getVariant('editorial/rose-dusk');
    const bad = host('host/low-contrast', 'editorial/rose-dusk', {
      surfaces: { ...base.surfaces, cream: { ...base.surfaces.cream!, ink: '#EEE6DA' } },
    });
    expect(() => registerVariant(bad)).toThrow(VariantError);
    try {
      registerVariant(bad);
    } catch (e) {
      expect((e as VariantError).issues).toContain('surfaces.cream: ink/bg 1.06 < 4.5');
      expect((e as Error).message).toContain('registerVariant("host/low-contrast") failed');
    }
    expect(hasVariant('host/low-contrast')).toBe(false);
  });

  it('rejects unknown families, bad ids, bad colours and missing surfaces', () => {
    const base = getVariant('dev/github-dark');
    const issues = (v: Variant) => { try { registerVariant(v); return []; } catch (e) { return (e as VariantError).issues; } };
    expect(issues(host('host/x1', 'dev/github-dark', { family: 'poster' as never }))[0]).toContain('family "poster"');
    expect(issues(host('Host X', 'dev/github-dark'))[0]).toContain('id "Host X"');
    expect(issues(host('host/x2', 'dev/github-dark', { code: { ...base.code, text: 'white' } }))).toContain('code.text "white" is not #RGB, #RRGGBB or rgb(a)()');
    expect(issues(host('host/x3', 'dev/github-dark', { rotation: ['nope'] }))).toContain('rotation names unknown surface "nope"');
  });

  it('protects built-ins and needs replace for a second registration', () => {
    expect(() => registerVariant(getVariant('dev/terminal'))).toThrow(/built-in/);
    registerVariant(host('host/twice', 'dev/terminal'));
    expect(() => registerVariant(host('host/twice', 'dev/terminal'))).toThrow(/already registered/);
    registerVariant(host('host/twice', 'dev/terminal', { name: 'Second' }), { replace: true });
    expect(getVariant('host/twice').name).toBe('Second');
  });
});
