// Host templates: ids outside the built-in list (PORTING §2.3).
import { describe, expect, it } from 'vitest';
import { parse } from '../src/core/parser';
import type { FamilyId } from '../src/core/types';

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
