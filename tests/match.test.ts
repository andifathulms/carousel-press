import { describe, expect, it } from 'vitest';
import { parse } from 'carousel-core/src/core/parser';
import { crestIds, parseMatch, parseResultLine, statNumber } from 'carousel-core/src/core/match';
import { badgeInk } from 'carousel-core/src/templates/matchPanel';
import { getVariant } from 'carousel-core/src/templates/registry';
import { layoutSlide } from 'carousel-core/src/render/renderSlide';

const fake = { width: (t: string, f: { size: number }) => t.length * f.size * 0.52 };

describe('[results] / [stats] (PRD §4.11)', () => {
  it('reads a scoreline with codes, names, colours and a highlight', () => {
    expect(parseResultLine('ARS Arsenal #E20520 | 2-1 | LEE Leeds United #FFCD00 *')).toEqual({
      home: { code: 'ARS', name: 'Arsenal', color: '#E20520', crest: null }, away: { code: 'LEE', name: 'Leeds United', color: '#FFCD00', crest: null },
      homeGoals: 2, awayGoals: 1, highlight: true,
    });
    expect(parseResultLine('ARS Arsenal | 2-1 | LEE Leeds #FFCD00')).toMatch(/CODE Name/);
    expect(parseResultLine('ARS Arsenal #E20520 | dua-satu | LEE Leeds #FFCD00')).toMatch(/score/);
  });

  it('reads stats with Indonesian numbers', () => {
    expect(statNumber('58,2%')).toBe(58.2);
    expect(statNumber('1.234')).toBe(1234);
    const { data, issues } = parseMatch('stats', ['ARS Arsenal #E20520 | 2-1 | LEE Leeds #FFCD00', 'Penguasaan bola | 58,2% | 41,8%', 'Tembakan | 13 | 11', 'rusak']);
    expect(data?.match?.homeGoals).toBe(2);
    expect(data?.stats.map((s) => [s.homeValue, s.awayValue])).toEqual([[58.2, 41.8], [13, 11]]);
    expect(issues).toHaveLength(1);
  });

  it('falls back to a card without a fence, and never throws on junk', () => {
    const d = parse('template: sport/papan\n---\n[results]\nJudul\nbukan fence').deck;
    expect(d.slides[0]!.type).toBe('card');
    for (let i = 0; i < 300; i++) {
      const junk = Array.from({ length: 6 }, () => Math.random().toString(36).slice(2) + (Math.random() < 0.3 ? ' | 1-2 | ' : ' #FFF ')).join('\n');
      expect(() => parse(`[stats]\nX\n\`\`\`stats\n${junk}\n\`\`\``)).not.toThrow();
    }
  });

  it('lays out as one match panel in every family', () => {
    const src = '[results kicker="HASIL"]\nPremier League\n```results\nARS Arsenal #E20520 | 2-1 | LEE Leeds #FFFFFF\nCHE Chelsea #144992 | 5-1 | BOU Bournemouth #F42727 *\n```';
    for (const id of ['sport/papan', 'dev/terminal', 'editorial/sage', 'lexicon/kamus']) {
      const d = parse(`template: ${id}\n---\n${src}`).deck;
      const L = layoutSlide(d.slides[0]!, d, getVariant(id), fake, null, false);
      expect(L.stack.placed.filter((p) => p.item.kind === 'match')).toHaveLength(1);
      expect(L.warnings.filter((w) => w.code === 'overflow')).toEqual([]);
    }
  });

  it('picks readable badge text', () => {
    expect(badgeInk('#FFFFFF')).toBe('#111111');
    expect(badgeInk('#034694')).toBe('#FFFFFF');
  });

  it('reads crest refs and the scorers row', () => {
    const { data } = parseMatch('stats', [
      "ARS Arsenal #E20520 @crest-arsenal | 2-1 | LEE Leeds #FFFFFF @crest-leeds",
      "Gol | Calafiori 62', Saka 80' 88' | -",
      'Tembakan | 13 | 11',
    ]);
    expect(data?.match?.home.crest).toBe('crest-arsenal');
    expect(data?.goals).toEqual({ home: ["Calafiori 62'", "Saka 80' 88'"], away: [] });
    expect(data?.stats).toHaveLength(1);
    expect(crestIds(data!)).toEqual(['crest-arsenal', 'crest-leeds']);
  });

  it('has a template for every competition', () => {
    for (const id of ['sport/pl', 'sport/laliga', 'sport/seriea', 'sport/bundesliga', 'sport/ucl', 'sport/uel', 'sport/uecl']) {
      expect(getVariant(id).family).toBe('sport');
    }
  });
});
