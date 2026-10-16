import { describe, expect, it } from 'vitest';
import { detectScript, hasHarakat, needsTranslitFace, scriptRuns } from 'carousel-core/src/core/script';
import { parse } from 'carousel-core/src/core/parser';
import { fakeMeasurer } from 'carousel-core/src/layout/measure';
import { layoutSlide } from 'carousel-core/src/render/renderSlide';
import { SAFE } from 'carousel-core/src/render/safezone';
import { arab } from 'carousel-core/src/templates/lexicon/variants';
import { ARAB_WORD } from 'carousel-core/src/templates/lexicon/lexArabic';
import { ARABIC_FACE, arabicHighlight, mixedSegs, uncoveredArabic, wrapArabicWords } from 'carousel-core/src/templates/lexicon/lexScript';
import type { LexEl } from 'carousel-core/src/templates/lexicon/lexLayout';

const deck = (body: string, header = 'template: lexicon/arab\nscript: arab') => parse(`${header}\n---\n[cover]\nHook\n---\n${body}`);
const lay = (body: string) => {
  const { deck: d, warnings } = deck(body);
  const L = layoutSlide(d.slides[1]!, d, arab, fakeMeasurer, null, false);
  return { L, warnings: [...warnings, ...L.warnings], els: L.lex?.els ?? [] };
};
const arabicEls = (els: LexEl[]) => els.filter((e): e is Extract<LexEl, { k: 'arabic' }> => e.k === 'arabic');

describe('script detection', () => {
  it('uses the first strong character', () => {
    expect(detectScript('buku')).toBe('latin');
    expect(detectScript('كِتَاب')).toBe('arab');
    expect(detectScript('谢谢')).toBe('han');
    expect(detectScript('  (كِتَاب) kitāb')).toBe('arab');
    expect(detectScript('kitāb (كِتَاب)')).toBe('latin');
    expect(detectScript('123 …')).toBe('latin');
  });
  it('splits runs, attaching neutrals to the previous run', () => {
    expect(scriptRuns('kitāb (كِتَاب)')).toEqual([{ text: 'kitāb (', script: 'latin' }, { text: 'كِتَاب)', script: 'arab' }]);
    expect(scriptRuns('كُتُب · kutub')).toEqual([{ text: 'كُتُب · ', script: 'arab' }, { text: 'kutub', script: 'latin' }]);
    expect(scriptRuns('一本书 yì běn shū')).toEqual([{ text: '一本书 ', script: 'han' }, { text: 'yì běn shū', script: 'latin' }]);
    expect(scriptRuns('  buku')).toEqual([{ text: '  buku', script: 'latin' }]);
    expect(scriptRuns('')).toEqual([]);
  });
  it('transliteration face only for letters the latin subset lacks', () => {
    expect(needsTranslitFace('kitāb')).toBe(true);
    expect(needsTranslitFace('nǚ')).toBe(true);
    expect(needsTranslitFace('/ˈkʌm/')).toBe(true);
    expect(needsTranslitFace('café, naïve — “ok” …')).toBe(false);
    expect(needsTranslitFace('buku 📚')).toBe(false);
  });
});

describe('parser', () => {
  it('keeps Arabic bytes as typed (harakat, shadda, tatweel, U+0670, ZWNJ/ZWJ)', () => {
    const word = 'كِتَّـــاب‌‍هٰذَا';
    const { deck: d } = deck(`[word]\nword: ${word}\nplural: كُتُب · kutub\nroot: ك ت ب`);
    expect(d.slides[1]!.fields.word).toBe(word);
    expect(d.slides[1]!.fields.plural).toBe('كُتُب · kutub');
    expect(d.slides[1]!.fields.root).toBe('ك ت ب');
  });
  it('reads script/tones headers and warns on bad values', () => {
    expect(deck('[card]\nX').deck.script).toBe('arab');
    const bad = parse('script: latin\ntones: rainbow\n---\n[cover]\nX');
    expect(bad.deck.script).toBeUndefined();
    expect(bad.deck.tones).toBeUndefined();
    expect(bad.warnings.map((w) => w.code)).toEqual(['unknown-script', 'unknown-script']);
    expect(parse('tones: color\n---\n[cover]\nX').deck.tones).toBe('color');
  });
  it('harakat-missing only for script: arab decks', () => {
    expect(deck('[word]\nword: كتاب').warnings.map((w) => w.code)).toEqual(['harakat-missing']);
    expect(deck('[word]\nword: كِتَاب').warnings).toEqual([]);
    expect(deck('[word]\nword: كتاب', 'template: lexicon/arab').warnings).toEqual([]);
    expect(hasHarakat('هٰذا')).toBe(true);
  });
  it('dir=rtl applies to tables only', () => {
    expect(deck('[table dir=rtl]\nT\n| a | b |\n| 1 | 2 |').deck.slides[1]!.attrs.dir).toBe('rtl');
    const card = deck('[card dir=rtl]\nX');
    expect(card.deck.slides[1]!.attrs.dir).toBeUndefined();
    expect(card.warnings.map((w) => w.code)).toEqual(['unknown-attr']);
    expect(deck('[table dir=up]\nT\n| a | b |').warnings.map((w) => w.code)).toEqual(['unknown-attr']);
  });
});

describe('Arabic helpers', () => {
  it('highlights whole words only', () => {
    expect(arabicHighlight('هٰذَا *كِتَابٌ*')).toEqual({ text: 'هٰذَا كِتَابٌ', marked: [false, true], split: false });
    expect(arabicHighlight('*هٰذَا كِتَابٌ* جَدِيدٌ').marked).toEqual([true, true, false]);
    const split = arabicHighlight('هٰذَا كِ*تَابٌ*');
    expect(split.split).toBe(true);
    expect(split.marked).toEqual([false, false]);
    expect(split.text).toBe('هٰذَا كِتَابٌ');
  });
  it('wraps at spaces only, never inside a word', () => {
    const font = { family: ARABIC_FACE, weight: 400, size: 40 };
    const w = wrapArabicWords('كِتَابٌ جَدِيدٌ جِدًّا', font, 300, fakeMeasurer);
    expect(w.lines.join(' ')).toBe('كِتَابٌ جَدِيدٌ جِدًّا');
    for (const line of w.lines) expect('كِتَابٌ جَدِيدٌ جِدًّا'.split(' ')).toEqual(expect.arrayContaining(line.split(' ')));
    expect(wrapArabicWords('مَكْتَبَةٌ', font, 10, fakeMeasurer).fits).toBe(false);
  });
  it('orders mixed runs: RTL base reverses the runs, LTR keeps a closing bracket outside the Arabic run', () => {
    const faces = { latin: 'DM Sans', latinWeight: 500, arabWeight: 400, fallback: 'DM Sans' };
    const rtl = mixedSegs('كُتُب · kutub', 40, faces, { latin: 'a', arab: 'b' }, fakeMeasurer);
    expect(rtl.segs.map((s) => [s.text, s.rtl])).toEqual([['kutub', false], ['كُتُب ·', true]]);
    const ltr = mixedSegs('kitāb (كِتَاب)', 40, faces, { latin: 'a', arab: 'b' }, fakeMeasurer);
    expect(ltr.segs.map((s) => s.text)).toEqual(['kitāb (', 'كِتَاب', ')']);
    expect(ltr.segs[0]!.font.family).toBe('Gentium Book Plus');
  });
  it('knows which Arabic code points Amiri lacks', () => {
    expect(uncoveredArabic('كِتَاب ١٢')).toEqual([]);
    expect(uncoveredArabic('࣢')).toEqual(['࣢']);
  });
});

describe('Arabic layout', () => {
  const WORD = '[word]\nword: كِتَاب\ntranslit: kitāb\npos: isim\ntag: A1\nroot: ك ت ب\nplural: كُتُب · kutub\nmeaning: buku\nexample: هٰذَا *كِتَابٌ*\ntranslation: Ini buku.';
  it('right-aligns Arabic blocks at SAFE.right, Latin blocks at SAFE.left', () => {
    const { els, warnings } = lay(WORD);
    expect(warnings).toEqual([]);
    const [head, example] = arabicEls(els);
    expect(head!.align).toBe('right');
    expect(head!.x + head!.w).toBe(SAFE.right);
    expect(head!.weight).toBe(700);
    expect(example!.x + example!.w).toBe(SAFE.right - ARAB_WORD.example.bar - ARAB_WORD.example.padRight);
    expect(example!.marks).toHaveLength(1);
    const texts = els.filter((e) => e.k === 'text');
    expect(texts.every((e) => e.x === SAFE.left)).toBe(true);
    const translit = texts.find((e) => e.k === 'text' && e.lines[0]?.runs[0]?.text === 'kitāb');
    expect(translit && translit.k === 'text' && translit.style.font.family).toBe('Gentium Book Plus');
  });
  it('warns when a highlight splits a word, and draws none', () => {
    const { els, warnings } = lay('[word]\nword: كِتَاب\nexample: هٰذَا كِ*تَابٌ*');
    expect(warnings.map((w) => w.code)).toEqual(['highlight-splits-word']);
    expect(arabicEls(els)[1]!.marks).toEqual([]);
  });
  it('blocks the export instead of clipping Arabic that never fits', () => {
    const long = Array.from({ length: 40 }, () => 'مَكْتَبَةٌ').join('');
    const { warnings } = lay(`[word]\nword: ${long}`);
    expect(warnings.some((w) => w.code === 'script-overflow' && w.hard)).toBe(true);
    const table = lay(`[table]\nT\n| Arab | Arti |\n| ${long} | x |`);
    expect(table.warnings.some((w) => w.code === 'script-overflow')).toBe(true);
    // The Latin column may still get "…" (it was squeezed); the Arabic cell never does.
    expect(arabicEls(table.els)[0]!.lines[0]).toBe(long);
  });
  it('tables: Arabic cells right-aligned, taller rows, dir=rtl mirrors the columns', () => {
    const t = '| Arab | Baca |\n| كَتَبَ | kataba |';
    const ltr = lay(`[table]\nT\n${t}`).els;
    const rtl = lay(`[table dir=rtl]\nT\n${t}`).els;
    const cellX = (els: LexEl[]) => arabicEls(els)[0]!.x;
    expect(cellX(rtl)).toBeGreaterThan(cellX(ltr));
    expect(arabicEls(ltr)[0]!.align).toBe('right');
    const latinCell = ltr.find((e) => e.k === 'text' && e.lines[0]?.runs[0]?.text === 'kataba');
    expect(latinCell).toBeDefined();
  });
  it('compare: Arabic boxes right-aligned, wrong side struck through', () => {
    const { els, warnings } = lay('[compare]\nwrong: سَيَّارَةٌ جَمِيلٌ\nright: سَيَّارَةٌ جَمِيلَةٌ');
    expect(warnings).toEqual([]);
    const [wrong, right] = arabicEls(els);
    expect(wrong!.strike).toBeDefined();
    expect(right!.strike).toBeUndefined();
    expect(wrong!.align).toBe('right');
  });
  it('flags glyphs Amiri lacks', () => {
    expect(lay('[word]\nword: كِتَاب࣢').warnings.map((w) => w.code)).toContain('script-glyph-missing');
  });
});
