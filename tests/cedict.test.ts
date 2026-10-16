import { describe, expect, it } from 'vitest';
import { acceptedPinyin, checkItem, hanziRuns, markSyllable, normPinyin, parseCedict } from '../scripts/cedict';

// A few real CC-CEDICT lines (format: trad simp [pinyin] /defs/).
const SAMPLE = [
  '# CC-CEDICT sample',
  '謝謝 谢谢 [xie4 xie5] /to thank/thanks/thank you/',
  '不客氣 不客气 [bu4 ke4 qi5] /you\'re welcome/don\'t mention it/',
  '一 一 [yi1] /one/',
  '個 个 [ge4] /individual/measure word/',
  '個 个 [ge5] /variant reading/',
  '一個 一个 [yi1 ge5] /a; an; one/',
  '天 天 [tian1] /day/sky/',
  '女 女 [nu:3] /female/woman/',
  '綠 绿 [lu:4] /green/',
  '書 书 [shu1] /book/',
  '後 后 [hou4] /back/behind/',
].join('\n');
const dict = parseCedict(SAMPLE);
const trad = new Set(['謝謝', '不客氣', '個', '一個', '綠', '書', '後']);

describe('pinyin marks', () => {
  it('places tone marks by the standard rules', () => {
    expect(['xie4', 'xie5', 'nu:3', 'lu:4', 'hou4', 'gui4', 'liu2', 'ma1', 'er2'].map(markSyllable))
      .toEqual(['xiè', 'xie', 'nǚ', 'lǜ', 'hòu', 'guì', 'liú', 'mā', 'ér']);
  });
  it('normalises spacing, case and punctuation', () => {
    expect(normPinyin('Xiè xie!')).toBe('xièxie');
    expect(normPinyin('bú kèqi.')).toBe('búkèqi');
  });
  it('accepts the written tone change of 不 before a 4th tone, and the citation form', () => {
    expect(acceptedPinyin(dict.get('不客气')![0]!)).toEqual(['bùkèqi', 'búkèqi']);
  });
});

describe('checkItem', () => {
  const check = (hanzi: string, pinyin: string | null) => checkItem({ where: 't', hanzi, pinyin }, dict, trad).status;
  it('ok for a matching word, with or without pinyin', () => {
    expect(check('谢谢', 'xièxie')).toBe('ok');
    expect(check('谢谢', null)).toBe('ok');
    expect(check('不客气', 'bú kèqi')).toBe('ok');
  });
  it('catches a wrong tone mark', () => {
    expect(check('谢谢', 'xiěxie')).toBe('pinyin-mismatch');
    expect(check('绿', 'lù')).toBe('pinyin-mismatch');
  });
  it('falls back to per-character readings (一 tone changes, words not in the dictionary)', () => {
    expect(check('一个', 'yí gè')).toBe('ok-chars');
    expect(check('一天', 'yì tiān')).toBe('ok-chars');
    expect(check('一天', 'yìtiān')).toBe('not-found'); // per-character needs one syllable per character
    expect(check('一天', 'yì tiàn')).toBe('not-found');
  });
  it('flags traditional characters and unknown words', () => {
    expect(check('書', 'shū')).toBe('traditional');
    expect(check('电脑', 'diànnǎo')).toBe('not-found');
  });
  it('finds hanzi runs in mixed text', () => {
    expect(hanziRuns('Contoh: 谢谢你! xièxie nǐ, 不客气。')).toEqual(['谢谢你', '不客气']);
  });
});
