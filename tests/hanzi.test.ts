import { describe, expect, it } from 'vitest';
import { hanziChars, normalizePinyin, pinyinSyllables, PINYIN_SYLLABLES, placeMark } from 'carousel-core/src/core/pinyin';
import { parse } from 'carousel-core/src/core/parser';
import { type TextMeasurer, fakeMeasurer } from 'carousel-core/src/layout/measure';
import { NO_END, NO_START, wrapHan } from 'carousel-core/src/layout/wrapHan';
import { layoutSlide } from 'carousel-core/src/render/renderSlide';
import { SAFE } from 'carousel-core/src/render/safezone';
import { hanzi } from 'carousel-core/src/templates/lexicon/variants';
import { HAN_WORD } from 'carousel-core/src/templates/lexicon/lexHan';
import type { LexEl } from 'carousel-core/src/templates/lexicon/lexLayout';

const deck = (body: string, header = 'template: lexicon/hanzi\nscript: hanzi\ntones: color') => parse(`${header}\n---\n[cover]\nHook\n---\n${body}`);
const lay = (body: string, header?: string, m: TextMeasurer = fakeMeasurer) => {
  const { deck: d, warnings } = deck(body, header);
  const L = layoutSlide(d.slides[1]!, d, hanzi, m, null, false);
  return { d, warnings: [...warnings, ...L.warnings], els: L.lex?.els ?? [] };
};
const of = <K extends LexEl['k']>(els: LexEl[], k: K) => els.filter((e): e is Extract<LexEl, { k: K }> => e.k === k);

describe('pinyin', () => {
  it('places tone marks by the standard rule (SPEC-script §5.3)', () => {
    expect(normalizePinyin('lu:e4 guo3 hui4 xiu3 nu:3 er2')).toBe('lüè guǒ huì xiǔ nǚ ér');
    expect(normalizePinyin('lve4 nv3 lv4')).toBe('lüè nǚ lǜ');
    expect(normalizePinyin('Xie4xie5 ni3!')).toBe('Xièxie nǐ!');
    expect(normalizePinyin('xiè xie')).toBe('xiè xie');
    expect(normalizePinyin('ma1 ma2 ma3 ma4 ma5')).toBe('mā má mǎ mà ma');
    expect(placeMark('liu', 2)).toBe('liú');
    expect(placeMark('gui', 4)).toBe('guì');
    expect(placeMark('zhou', 1)).toBe('zhōu');
  });
  it('segments syllables and reports invalid ones', () => {
    expect(pinyinSyllables('Xièxie nǐ!').syllables.map((s) => [s.text, s.tone])).toEqual([['Xiè', 4], ['xie', 5], ['nǐ', 3]]);
    expect(pinyinSyllables('xie4 xie5').syllables).toHaveLength(2);
    expect(pinyinSyllables('bú kèqi').syllables.map((s) => s.tone)).toEqual([2, 4, 5]);
    expect(pinyinSyllables('zzz kè').invalid).toEqual(['zzz']);
    expect(pinyinSyllables('xiè xié').invalid).toEqual([]);
    // Two tone marks that can't be split into valid syllables (u alone isn't a syllable).
    expect(pinyinSyllables('xǐǔ').invalid).toEqual(['xǐǔ']);
  });
  it('counts hanzi without punctuation', () => {
    expect(hanziChars('你好！')).toHaveLength(2);
    expect(hanziChars('一本书 yì běn shū')).toHaveLength(3);
  });
  it('ships a ~410-syllable table', () => {
    expect(PINYIN_SYLLABLES.size).toBeGreaterThan(400);
    for (const s of ['zhuang', 'lüe', 'er', 'xiong', 'ng']) expect(PINYIN_SYLLABLES.has(s)).toBe(true);
    for (const s of ['b', 'xx', 'zhiang']) expect(PINYIN_SYLLABLES.has(s)).toBe(false);
  });
});

describe('parser', () => {
  it('keeps hanzi and pinyin as typed; derives pinyinNormalized', () => {
    const { deck: d } = deck('[word]\nword: 谢谢\npinyin: xie4 xie5\nexample: *谢谢*你！\nexample-pinyin: Xie4xie5 ni3!\nhsk: 1\nmeasure: 本 běn\nstrokes: 12');
    const s = d.slides[1]!;
    expect(s.fields.pinyin).toBe('xie4 xie5');
    expect(s.fields.example).toBe('*谢谢*你！');
    expect(s.pinyinNormalized).toEqual({ pinyin: 'xiè xie', 'example-pinyin': 'Xièxie nǐ!' });
    expect(d.tones).toBe('color');
    expect(d.script).toBe('hanzi');
  });
});

describe('kinsoku', () => {
  const font = { family: 'Noto Sans SC', weight: 500, size: 10 };
  const fixture = '「你好」，我们（今天）学习：HSK 一级。好吗？对！《书》、【字】…结束';
  it('never starts a line with closing punctuation or ends one with an opening bracket, and loses nothing', () => {
    for (let w = 11; w <= 120; w += 1) {
      const r = wrapHan(fixture, font, w, fakeMeasurer);
      r.lines.forEach((l, i) => {
        if (i > 0) expect(NO_START.has(Array.from(l)[0]!), `w=${w} line ${i} "${l}"`).toBe(false);
        if (i < r.lines.length - 1) expect(NO_END.has(Array.from(l).at(-1)!), `w=${w} line ${i} "${l}"`).toBe(false);
      });
      expect(r.lines.join('').replace(/ /g, '')).toBe(fixture.replace(/ /g, ''));
    }
  });
  it('keeps Latin words whole', () => {
    const r = wrapHan('学习HSK考试', font, 20, fakeMeasurer);
    expect(r.lines.some((l) => l.includes('HSK'))).toBe(true);
    expect(r.lines.every((l) => !/^SK|^K|H$|HS$/.test(l))).toBe(true);
  });
});

describe('hanzi word layout', () => {
  it('ruby: each syllable centred over its practice box, tone colours with tones: color', () => {
    const { els, warnings } = lay('[word]\nword: 谢谢\npinyin: xie4 xie5\nhsk: 1\nmeaning: terima kasih');
    expect(warnings).toEqual([]);
    const boxes = of(els, 'tianzige');
    expect(boxes).toHaveLength(2);
    const ruby = of(els, 'mixed')[0]!;
    ruby.segs.forEach((s, i) => expect(ruby.x + s.dx + s.w / 2).toBeCloseTo(boxes[i]!.x + boxes[i]!.size / 2, 5));
    expect(ruby.segs.map((s) => s.text)).toEqual(['xiè', 'xie']);
    expect(ruby.segs[0]!.color).toBe(hanzi.lex!.tones![3]);
    expect(ruby.segs[1]!.color).toBe(hanzi.lex!.tones![4]);
    const chars = of(els, 'han').slice(0, 2);
    expect(chars.map((c) => c.color)).toEqual([hanzi.lex!.tones![3], hanzi.lex!.tones![4]]);
    expect(boxes[0]!.x).toBe(SAFE.left);
    expect(of(els, 'badge').map((b) => b.text)).toEqual(['HSK 1']);
  });
  it('no tone colours without tones: color', () => {
    const { els } = lay('[word]\nword: 谢谢\npinyin: xie4 xie5', 'template: lexicon/hanzi');
    expect(of(els, 'mixed')[0]!.segs.every((s) => s.color === hanzi.surfaces.paper!.body || s.color === hanzi.surfaces['paper-alt']!.body)).toBe(true);
  });
  it('pinyin-mismatch draws pinyin as a line; pinyin-invalid is reported', () => {
    const { els, warnings } = lay('[word]\nword: 谢谢\npinyin: xiè');
    expect(warnings.map((w) => w.code)).toEqual(['pinyin-mismatch']);
    expect(of(els, 'mixed')).toHaveLength(0);
    expect(of(els, 'text').some((e) => e.style.font.family === 'Gentium Book Plus')).toBe(true);
    expect(lay('[word]\nword: 谢谢\npinyin: xiè zzz').warnings.map((w) => w.code)).toContain('pinyin-invalid');
  });
  it('blocks the export instead of clipping a headword that never fits', () => {
    const { warnings } = lay(`[word]\nword: ${'谢'.repeat(12)}`);
    expect(warnings.some((w) => w.code === 'script-overflow' && w.hard)).toBe(true);
    expect(HAN_WORD.head.min).toBe(140);
  });
  it('script-glyph-missing when the CJK face isn\'t loaded', () => {
    const notLoaded: TextMeasurer = { ...fakeMeasurer, hasFace: (family) => !family.startsWith('Noto') };
    expect(lay('[word]\nword: 谢谢', undefined, notLoaded).warnings.map((w) => w.code)).toContain('script-glyph-missing');
    // A hanzi outside every bundled slice: document.fonts.check() alone would pass it.
    expect(lay('[word]\nword: 𠀀').warnings.map((w) => w.code)).toContain('script-glyph-missing');
  });
  it('tables: hanzi cells never cut, tone colours on hanzi + pinyin', () => {
    const { els, warnings } = lay('[table]\nT\n| Hanzi | Pinyin | Arti |\n| 妈 | mā | ibu |\n| 马 | mǎ | kuda |');
    expect(warnings).toEqual([]);
    const cells = of(els, 'han');
    expect(cells.map((c) => c.lines[0])).toEqual(['妈', '马']);
    expect(cells[0]!.colors?.[0]?.[0]).toBe(hanzi.lex!.tones![0]);
    const py = of(els, 'mixed').map((m) => m.segs.map((s) => [s.text, s.color]));
    expect(py[1]).toEqual([['mǎ', hanzi.lex!.tones![2]]]);
    const long = lay(`[table]\nT\n| Hanzi | Arti |\n| ${'谢'.repeat(60)} | x |`);
    expect(long.warnings.some((w) => w.code === 'script-overflow')).toBe(true);
  });
  it('compare: hanzi with strike on the wrong side', () => {
    const { els, warnings } = lay('[compare]\nwrong: 一个书\nright: 一本书');
    expect(warnings).toEqual([]);
    const [wrong, right] = of(els, 'han');
    expect(wrong!.strike).toBeDefined();
    expect(right!.strike).toBeUndefined();
    expect(wrong!.family).toBe('Noto Sans SC');
  });
});
