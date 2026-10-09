// Pre-extraction grammar contract: one regression test per row of the
// "Grammar contract" table in docs/decisions.md (G1–G25).
import { describe, expect, it } from 'vitest';
import { parse, resolvePhotos, tokenizeTag } from '../src/core/parser';
import { parseInline } from '../src/core/inline';
import { resolveIcons } from '../src/core/iconNames';
import { splitArrow } from '../src/core/strings';
import { isBlocking, type Warning } from '../src/core/types';
import { fakeMeasurer } from '../src/layout/measure';
import { layoutSlide } from '../src/render/renderSlide';
import { getVariant } from '../src/templates/registry';

const codes = (text: string, opts = {}) => parse(text, opts).warnings.map((w) => w.code);
const types = (text: string) => parse(text).deck.slides.map((s) => s.type);
const layout = (text: string, template: Parameters<typeof getVariant>[0], i = 0) => {
  const { deck } = parse(text);
  return layoutSlide(deck.slides[i]!, deck, getVariant(template), fakeMeasurer, null, false);
};

describe('decided fixes (G1–G5)', () => {
  it('G1: ``` on a non-code slide is literal and never swallows slides; an unclosed [code] fence ends at its block', () => {
    const card = parse('A\n---\nCard\n```\nx\n---\nThird\n---\nFourth');
    expect(card.deck.slides.map((s) => s.headlineSrc)).toEqual(['A', 'Card', 'Third', 'Fourth']);
    expect(card.warnings).toEqual([]);
    expect(JSON.stringify(card.deck.slides[1]!.body)).toContain('```');

    const code = parse('[code]\nH\n```bash\nls\n---\nNext\n---\n[end]\nBye');
    expect(code.deck.slides.map((s) => s.type)).toEqual(['code', 'card', 'end']);
    expect(code.deck.slides[0]!.code!.text).toBe('ls');
    expect(code.warnings.map((w) => w.code)).toEqual(['unclosed-fence']);

    // A later ``` doesn't close an earlier unclosed fence across a tagged slide.
    expect(types('[code]\nH\n```\nls\n---\n[card]\nX\n```\n---\n[end]\nE')).toEqual(['code', 'card', 'end']);
    // A closed fence still protects `---` inside the code.
    const yaml = parse('[code]\nH\n```yaml\na: 1\n---\nb: 2\n```\n---\nNext');
    expect(yaml.deck.slides).toHaveLength(2);
    expect(yaml.deck.slides[0]!.code!.text).toBe('a: 1\n---\nb: 2');
  });

  it('G2: [end cta="…"] replaces the button label; end always shows the button', () => {
    const r = parse('A\n---\n[end cta="Follow dulu"]\nBye');
    expect(r.warnings).toEqual([]);
    expect(r.deck.slides[1]!.showCta).toBe(true);
    for (const t of ['editorial/rose-dusk', 'dev/github-dark'] as const) {
      expect(layout('A\n---\n[end cta="Follow dulu"]\nBye', t, 1).ctaLabel).toBe('Follow dulu');
      expect(layout('A\n---\n[end]\nBye', t, 1).ctaLabel).toBe('Simpan • Bagikan');
    }
    expect(codes('[cover cta]\nA')).toEqual(['unknown-attr']);
  });

  it('G3: photo=<integer> is always a 1-based tray index, never an ID', () => {
    expect(parse('[cover photo=2]\nA').deck.slides[0]!.photoId).toBeNull();
    expect(parse('[cover photo=senja]\nA').deck.slides[0]!.photoId).toBe('senja');
    const tray = ['senja', '2'];
    expect(parse('[cover photo=2]\nA', { photoIds: tray }).deck.slides[0]!.photoId).toBe('2');
    expect(parse('[cover photo=1]\nA', { photoIds: tray }).deck.slides[0]!.photoId).toBe('senja');
    const miss = parse('[cover photo=3]\nA', { photoIds: tray });
    expect(miss.deck.slides[0]!.photoId).toBeNull();
    expect(miss.warnings.map((w) => w.code)).toEqual(['unknown-photo']);
    // Resolved against whatever tray the slides render with.
    const { deck } = parse('[cover photo=1]\nA');
    expect(resolvePhotos(deck.slides, ['dusk'])).toEqual([]);
    expect(deck.slides[0]!.photoId).toBe('dusk');
    expect(resolvePhotos(deck.slides, []).map((w) => w.code)).toEqual(['unknown-photo']);
    expect(deck.slides[0]!.photoId).toBeNull();
  });

  it('G4: an invalid lang: warns unknown-lang and falls back to id', () => {
    const r = parse('handle: x\nlang: jv\n---\nA');
    expect(r.deck.lang).toBe('id');
    expect(r.warnings).toMatchObject([{ code: 'unknown-lang', line: 1, slideIndex: null }]);
    expect(isBlocking(r.warnings[0]!)).toBe(false);
    expect(codes('lang: en\n---\nA')).toEqual([]);
  });

  it('G5: a parser exception is a blocking internal-error, never overflow', () => {
    const boom = new Proxy([], { get() { throw new Error('boom'); } }) as unknown as string[];
    const r = parse('[cover photo=x]\nA', { photoIds: boom });
    expect(r.deck.slides).toEqual([]);
    expect(r.warnings).toEqual([{ code: 'internal-error', slideIndex: null, line: 0, message: 'Parser error — please report' }]);
    expect(isBlocking(r.warnings[0]!)).toBe(true);
    // Options that throw on read can't make the fallback throw either.
    const hostile = Object.defineProperty({}, 'defaultTemplate', { get() { throw new Error('x'); } });
    expect(() => parse('A', hostile)).not.toThrow();
    expect(parse('A', hostile).warnings[0]!.code).toBe('internal-error');
  });
});

describe('PRD updated to match the code (G6–G25, except G9, G12, G17: code fixes)', () => {
  it('G6: a header needs one known key; unknown keys in it warn', () => {
    const r = parse('foo: 1\nhandle: x\n---\nA');
    expect(r.deck.hasHeader).toBe(true);
    expect(r.warnings.map((w) => w.code)).toEqual(['unknown-header-key']);
  });

  it('G7: the header ends at the first ---; keys are lowercase only', () => {
    expect(parse('Template: dev/terminal\n---\nA').deck.hasHeader).toBe(false);
    expect(types('Template: dev/terminal\n---\nA')).toEqual(['cover', 'card']);
  });

  it('G8: title falls back to the first cover headline, then slide 1; slug to "carousel"', () => {
    expect(parse('[card]\nA card\n---\n[cover]\nBig | title').deck.title).toBe('Big title');
    expect(parse('[card]\nFirst\n---\nSecond').deck.title).toBe('First');
    expect(parse('[cover]\n🌅').deck.slug).toBe('carousel');
  });

  it('G9 (fix): only the first fence of a [code] slide protects ---, and only a bare ``` closes it', () => {
    const r = parse('[code]\nH\n```md\n```js\nx\n```\n---\nCard');
    expect(r.deck.slides.map((s) => s.type)).toEqual(['code', 'card']);
    expect(r.deck.slides[0]!.code!.text).toBe('```js\nx');
    expect(r.deck.slides[0]!.note).toEqual([]);
  });

  it('G10: text lines are fully trimmed; code keeps indentation, tabs → 2 spaces, trailing blank lines dropped', () => {
    const s = parse('[code]\n   Head   \n```\n\tif x:\n    y\n\n\n```').deck.slides[0]!;
    expect(s.headlineSrc).toBe('Head');
    expect(s.code!.text).toBe('  if x:\n    y');
  });

  it('G11: an unknown first bare token warns, renders as card, and is discarded', () => {
    const r = parse('A\n---\n[cardd photo=x]\nB');
    expect(r.deck.slides[1]!.type).toBe('card');
    expect(r.deck.slides[1]!.attrs).toEqual({ photo: 'x' });
    expect(r.warnings.map((w) => w.code)).toEqual(['unknown-slide-type']);
  });

  it('G12 (fix): an unterminated quoted value warns instead of silently eating the rest of the tag', () => {
    expect(tokenizeTag('cover kicker="A B photo=x')).toEqual([
      { key: 'cover', value: true }, { key: 'kicker', value: 'A B photo=x', unclosed: true },
    ]);
    const r = parse('[cover kicker="A B photo=x]\nHi');
    expect(r.warnings.map((w) => w.code)).toEqual(['unknown-attr']);
    expect(r.warnings[0]!.message).toContain('never closes');
    expect(tokenizeTag('kicker="a \\\\ b"')).toEqual([{ key: 'kicker', value: 'a \\\\ b' }]);
  });

  it('G13: a valued attribute written as a flag warns; cta="" is the cta flag', () => {
    expect(codes('[cover photo]\nA')).toEqual(['unknown-attr']);
    expect(parse('A\n---\n[cta=""]\nB').deck.slides[1]!.attrs.cta).toBe(true);
  });

  it('G14: number= must be off or digits; icon= accepts pool names, aliases, auto, none (any case)', () => {
    expect(codes('A\n---\n[number=two]\nB')).toEqual(['unknown-attr']);
    expect(parse('A\n---\n[icon=Shield]\nB').deck.slides[1]!.attrs.icon).toBe('shield');
    expect(codes('A\n---\n[icon=unicorn]\nB')).toEqual(['unknown-attr']);
  });

  it('G15: surface= is checked against the variant at layout time, not by the parser', () => {
    const text = 'A\n---\n[surface=blush]\nB';
    expect(codes(text)).toEqual([]);
    expect(layout(text, 'editorial/rose-dusk', 1).warnings).toEqual([]);
    expect(layout(text, 'dev/github-dark', 1).warnings.map((w) => w.code)).toEqual(['unknown-attr']);
  });

  it('G16: missing-headline when a [code] slide starts with its fence; elsewhere the fence line is the headline', () => {
    const r = parse('A\n---\n[code]\n```\nls\n```');
    expect(r.warnings.map((w) => w.code)).toEqual(['missing-headline']);
    expect(r.deck.slides[1]!.code!.text).toBe('ls');
    expect(parse('A\n---\n```').deck.slides[1]!.headlineSrc).toBe('```');
  });

  it('G17 (fix): the attribution is only the first non-empty line after the quote text', () => {
    const list = parse('A\n---\n[quote]\nQ\nKata ibu:\n- jangan lupa makan\n').deck.slides[1]!;
    expect(list.attribution).toBeNull();
    expect(JSON.stringify(list.body)).toContain('- jangan lupa makan');
    const ok = parse('A\n---\n[quote]\nQ\n\n— Ibu\nBody\n- dua').deck.slides[1]!;
    expect(ok.attribution).toBe('Ibu');
    expect(JSON.stringify(ok.body)).toContain('- dua');
  });

  it('G18: code langs are lowercased; unknown langs render plain without a warning', () => {
    const r = parse('A\n---\n[code]\nH\n```Rust\nfn main() {}\n```');
    expect(r.deck.slides[1]!.code!.lang).toBe('rust');
    expect(r.warnings).toEqual([]);
  });

  it('G19: each body source line is a hard break; a blank line starts a paragraph', () => {
    const body = parse('A\n---\nH\none\ntwo\n\nthree').deck.slides[1]!.body;
    expect(body.map((p) => p.length)).toEqual([2, 1]);
  });

  it('G20: accent needs non-space inside both stars and cannot cross | or `; ** is literal', () => {
    expect(parseInline('a *b* c')[0]!.some((r) => r.style === 'accent')).toBe(true);
    expect(parseInline('a * b * c')[0]!.every((r) => r.style === 'plain')).toBe(true);
    expect(parseInline('**b**')[0]).toEqual([{ text: '**b**', style: 'plain' }]);
    expect(parseInline('*a|b*')).toHaveLength(2);
  });

  it('G21: inside `code`, | does not break and \\| stays as typed; `` is literal', () => {
    expect(parseInline('`a|b`')).toEqual([[{ text: 'a|b', style: 'code' }]]);
    expect(parseInline('`a\\|b`')).toEqual([[{ text: 'a\\|b', style: 'code' }]]);
    expect(parseInline('x `` y')[0]).toEqual([{ text: 'x `` y', style: 'plain' }]);
  });

  it('G22: auto icons skip covers and end slides and never repeat back to back', () => {
    const { deck } = parse('C\n---\nA\n---\nB\n---\nD\n---\n[end]\nE');
    const icons = resolveIcons(deck.slides, deck.slug, 'editorial');
    expect(icons[0]).toBeNull();
    expect(icons[4]).toBeNull();
    for (let i = 2; i < 4; i++) expect(icons[i]).not.toBe(icons[i - 1]);
    expect(resolveIcons(deck.slides, deck.slug, 'dev').every((x) => x === null)).toBe(true);
  });

  it('G23: a trailing → in built-in strings is split off and drawn as an icon', () => {
    expect(splitArrow('Geser →')).toEqual({ text: 'Geser', arrow: true });
  });

  it('G24: a word broken by characters gives the non-blocking long-word warning', () => {
    const ws: Warning[] = layout(`A\n---\nH\n${'x'.repeat(120)}`, 'editorial/rose-dusk', 1).warnings;
    const w = ws.find((x) => x.code === 'long-word');
    expect(w).toBeDefined();
    expect(isBlocking(w!)).toBe(false);
  });

  it('G25: photo-low-res never comes from the parser (the app photo store adds it)', () => {
    expect(codes('[cover photo=1]\nA', { photoIds: ['tiny'] })).toEqual([]);
  });
});
