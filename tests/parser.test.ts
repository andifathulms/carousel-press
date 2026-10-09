import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse, tokenizeTag } from '../src/core/parser';
import { SAMPLE_PHOTO_IDS } from '../src/samples/photos';
import { mulberry32 } from '../src/core/hash';
import type { WarningCode } from '../src/core/types';

const sample = (name: string) => readFileSync(new URL(`../src/samples/${name}.txt`, import.meta.url), 'utf8');
const codes = (text: string, opts = {}) => parse(text, opts).warnings.map((w) => w.code);

describe('header detection', () => {
  it('reads a valid header', () => {
    const { deck } = parse('handle: @x\ntemplate: dev/terminal\nlang: en\ntitle: T\ncaption: C\n---\nHello');
    expect(deck.hasHeader).toBe(true);
    expect(deck.handle).toBe('@x');
    expect(deck.template).toBe('dev/terminal');
    expect(deck.lang).toBe('en');
    expect(deck.title).toBe('T');
    expect(deck.caption).toBe('C');
    expect(deck.slides).toHaveLength(1);
  });
  it('treats a non-header first block as slide 1', () => {
    const { deck } = parse('Hello world\nsubtitle\n---\nCard');
    expect(deck.hasHeader).toBe(false);
    expect(deck.slides).toHaveLength(2);
    expect(deck.slides[0]!.type).toBe('cover');
  });
  it('a block of only unknown keys is not a header', () => {
    expect(parse('foo: bar\n---\nA').deck.hasHeader).toBe(false);
  });
  it('warns on unknown keys inside a valid header', () => {
    expect(codes('handle: @x\nfoo: bar\n---\nA')).toContain('unknown-header-key');
  });
  it('warns on unknown templates and falls back', () => {
    const r = parse('template: nope/x\n---\nA', { defaultTemplate: 'dev/terminal' });
    expect(r.deck.template).toBe('dev/terminal');
    expect(r.warnings[0]!.code).toBe('unknown-template');
  });
  it('uses settings defaults when the header omits them', () => {
    const { deck } = parse('A', { defaultHandle: '@me' });
    expect(deck.handle).toBe('@me');
    expect(deck.template).toBe('editorial/rose-dusk');
    expect(deck.lang).toBe('id');
  });
});

describe('blocks', () => {
  it('ignores separators inside code fences', () => {
    const { deck } = parse('Cover\n---\n[code]\nH\n```\na\n---\nb\n```\n---\nNext');
    expect(deck.slides).toHaveLength(3);
    expect(deck.slides[1]!.code!.text).toBe('a\n---\nb');
  });
  it('skips empty blocks', () => {
    expect(parse('A\n---\n   \n---\n\n---\nB').deck.slides).toHaveLength(2);
  });
  it('accepts CRLF', () => {
    const { deck } = parse('handle: @x\r\n---\r\n[cover]\r\nTitle\r\nSub\r\n---\r\nCard\r\nBody');
    expect(deck.handle).toBe('@x');
    expect(deck.slides[0]!.headlineSrc).toBe('Title');
    expect(deck.slides[1]!.body[0]![0]![0]!.text).toBe('Body');
  });
  it('maps slide line ranges', () => {
    const { deck } = parse('lang: id\n---\nA\nb\n---\nC');
    expect(deck.slides[0]!.lines).toEqual([2, 3]);
    expect(deck.slides[1]!.lines).toEqual([5, 5]);
  });
});

describe('tags and attributes', () => {
  it('tokenises quoted values with escapes', () => {
    expect(tokenizeTag('cover kicker="GIT \\"X\\" • A" photo=2 cta')).toEqual([
      { key: 'cover', value: true },
      { key: 'kicker', value: 'GIT "X" • A' },
      { key: 'photo', value: '2' },
      { key: 'cta', value: true },
    ]);
  });
  it('defaults the type: first block cover, others card', () => {
    const { deck } = parse('[icon=heart]\nA\n---\n[icon=heart]\nB');
    expect(deck.slides.map((s) => s.type)).toEqual(['cover', 'card']);
  });
  it('allows a leading cta flag', () => {
    const { deck, warnings } = parse('A\n---\n[cta icon=leaf]\nB');
    expect(deck.slides[1]!.type).toBe('card');
    expect(deck.slides[1]!.attrs.cta).toBe(true);
    expect(warnings).toHaveLength(0);
  });
  it('custom cta text', () => {
    expect(parse('A\n---\n[cta="Follow dulu"]\nB').deck.slides[1]!.attrs.cta).toBe('Follow dulu');
  });
  it('unknown slide type → card + warning', () => {
    const r = parse('A\n---\n[poll]\nB');
    expect(r.deck.slides[1]!.type).toBe('card');
    expect(r.warnings.map((w) => w.code)).toEqual(['unknown-slide-type']);
  });
  it('unknown attrs and icons warn', () => {
    expect(codes('A\n---\n[card foo=1]\nB')).toEqual(['unknown-attr']);
    expect(codes('A\n---\n[icon=unicorn]\nB')).toEqual(['unknown-attr']);
    expect(codes('A\n---\n[number=abc]\nB')).toEqual(['unknown-attr']);
    expect(codes('[cover number=2]\nA')).toEqual(['unknown-attr']);
  });
  it('tag-looking lines are only tags when the whole line is bracketed', () => {
    const { deck } = parse('A\n---\n[x] marks the spot');
    expect(deck.slides[1]!.headlineSrc).toBe('[x] marks the spot');
  });
});

describe('field mapping (PRD §4.4)', () => {
  it('cover: headline + subtitle, kicker', () => {
    const s = parse('[cover kicker="GIT • CHEAT"]\nBig | Title\nSub one\nSub two').deck.slides[0]!;
    expect(s.headline[0]).toHaveLength(2);
    expect(s.body[0]).toHaveLength(2);
    expect(s.attrs.kicker).toBe('GIT • CHEAT');
  });
  it('card: headline + body with paragraphs', () => {
    const s = parse('C\n---\nHead\nLine 1\n\nLine 2').deck.slides[1]!;
    expect(s.headlineSrc).toBe('Head');
    expect(s.body).toHaveLength(2);
  });
  it('code: body, verbatim code, note', () => {
    const s = parse('C\n---\n[code]\nHead\nBody\n```bash\n  git status\t--x  \n```\nNote').deck.slides[1]!;
    expect(s.type).toBe('code');
    expect(s.code).toEqual({ text: '  git status  --x  ', lang: 'bash' });
    expect(s.body[0]![0]![0]!.text).toBe('Body');
    expect(s.note[0]![0]![0]!.text).toBe('Note');
  });
  it('code without a fence → card + warning', () => {
    const r = parse('C\n---\n[code]\nHead\nBody');
    expect(r.deck.slides[1]!.type).toBe('card');
    expect(r.warnings.map((w) => w.code)).toEqual(['code-missing-fence']);
  });
  it('unclosed fence runs to the end of the block', () => {
    const r = parse('C\n---\n[code]\nHead\n```js\nconst a = 1;\nconst b = 2;');
    expect(r.deck.slides[1]!.code!.text).toBe('const a = 1;\nconst b = 2;');
    expect(r.warnings.map((w) => w.code)).toEqual(['unclosed-fence']);
  });
  it('quote: text, attribution markers, body', () => {
    for (const mark of ['— ', '-- ', '- ']) {
      const s = parse(`C\n---\n[quote]\nBe kind.\n${mark}Someone\nExtra`).deck.slides[1]!;
      expect(s.headlineSrc).toBe('Be kind.');
      expect(s.attribution).toBe('Someone');
      expect(s.body[0]![0]![0]!.text).toBe('Extra');
    }
  });
  it('end: headline + body, cta always on', () => {
    const s = parse('C\n---\n[end]\nBye\nSee you').deck.slides[1]!;
    expect(s.showCta).toBe(true);
    expect(s.headlineSrc).toBe('Bye');
  });
});

describe('warnings (PRD §4.8)', () => {
  it('missing headline', () => {
    expect(codes('C\n---\n[card icon=heart]')).toEqual(['missing-headline']);
  });
  it('long deck', () => {
    const text = Array.from({ length: 11 }, (_, i) => `S${i}`).join('\n---\n');
    expect(codes(text)).toEqual(['long-deck']);
  });
  it('unknown photo, by id or index', () => {
    const opts = { photoIds: ['sample-dusk'] };
    expect(codes('[cover photo=1]\nA', opts)).toEqual([]);
    expect(parse('[cover photo=1]\nA', opts).deck.slides[0]!.photoId).toBe('sample-dusk');
    expect(codes('[cover photo=2]\nA', opts)).toEqual(['unknown-photo']);
    expect(codes('[cover photo=senja]\nA', opts)).toEqual(['unknown-photo']);
  });
  it('every parser warning code is reachable', () => {
    const all = new Set<WarningCode>([
      ...codes('foo: 1\nhandle: x\ntemplate: x/y\nlang: zz\n---\n[cover photo=9]\nA', { photoIds: [] }),
      ...codes('A\n---\n[zzz bad=1]\nB\n---\n[code]\nX\n---\n[code]\nY\n```\nz'),
      ...codes('A\n---\n[card]'),
    ]);
    for (const c of ['unknown-header-key', 'unknown-template', 'unknown-photo', 'unknown-slide-type',
      'unknown-attr', 'code-missing-fence', 'unclosed-fence', 'missing-headline', 'unknown-lang'] as WarningCode[]) {
      expect(all.has(c)).toBe(true);
    }
  });
});

describe('robustness', () => {
  it('handles empty input', () => {
    const r = parse('');
    expect(r.deck.slides).toHaveLength(0);
    expect(r.warnings).toHaveLength(0);
  });
  it('never throws on random input (fuzz, 1,000 strings)', () => {
    const rng = mulberry32(1234);
    const alphabet = ['-', '-', '-', '\n', '\n', '[', ']', '=', '"', '\\', '|', '*', '`', '```', ' ', 'a', ':', '\r\n', '\u0000', '🤍', 'cover', 'code', 'template:'];
    for (let n = 0; n < 1000; n++) {
      let s = '';
      const len = Math.floor(rng() * 200);
      for (let i = 0; i < len; i++) {
        s += rng() < 0.15 ? String.fromCharCode(Math.floor(rng() * 0xffff)) : alphabet[Math.floor(rng() * alphabet.length)];
      }
      expect(() => parse(s)).not.toThrow();
      expect(parse(s).warnings.some((w) => w.code === 'internal-error')).toBe(false);
    }
  });
  it('tolerates non-string input', () => {
    expect(() => parse(undefined)).not.toThrow();
    expect(() => parse(42)).not.toThrow();
  });
});

describe('golden samples', () => {
  it('editorial-couples-id', () => {
    const r = parse(sample('editorial-couples-id'), { photoIds: ['sample-dusk'] });
    expect(r.warnings).toEqual([]);
    expect(r.deck.slides).toHaveLength(6);
    expect(r.deck.slug).toBe('5-pertanyaan-kecil');
    expect(r).toMatchSnapshot();
  });
  it('dev-git-id', () => {
    const r = parse(sample('dev-git-id'));
    expect(r.warnings).toEqual([]);
    expect(r.deck.slides).toHaveLength(9);
    expect(r.deck.slides.filter((s) => s.type === 'code')).toHaveLength(7);
    expect(r).toMatchSnapshot();
  });
  it('editorial-places-en', () => {
    const r = parse(sample('editorial-places-en'), { photoIds: ['sample-dusk'] });
    expect(r.warnings).toEqual([]);
    expect(r.deck.slides.map((s) => s.type)).toEqual(['cover', 'card', 'card', 'card', 'end']);
  });
});

describe('every shipped deck', () => {
  const files = readdirSync(new URL('../src/samples/', import.meta.url)).filter((f) => f.endsWith('.txt'));
  for (const f of files) {
    it(`${f} parses without warnings`, () => {
      const r = parse(sample(f.slice(0, -4)), { photoIds: ['sample-dusk', ...SAMPLE_PHOTO_IDS] });
      // History and sports decks may run past 10 slides (owner decision): only the long-deck hint is allowed.
      const long = f.startsWith('sejarah-') || f.startsWith('sports-');
      const ws = long ? r.warnings.filter((w) => w.code !== 'long-deck') : r.warnings;
      expect(ws).toEqual([]);
      if (long) expect(r.deck.slides.length).toBeLessThanOrEqual(14);
      expect(r.deck.slides.length).toBeGreaterThanOrEqual(5);
      expect(r.deck.slides[r.deck.slides.length - 1]!.showCta).toBe(true);
    });
  }
  it('dev decks by the owner end with the portfolio line', () => {
    for (const f of readdirSync(new URL('../src/samples/', import.meta.url)).filter((n) => n.startsWith('dev-') && n !== 'dev-git-id.txt').map((n) => n.slice(0, -4))) {
      const end = parse(sample(f)).deck.slides.at(-1)!;
      expect(end.type).toBe('end');
      expect(JSON.stringify(end.body)).toContain('andifathulms.github.io');
    }
  });
});
