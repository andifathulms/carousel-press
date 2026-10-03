import { describe, expect, it } from 'vitest';
import { parseInline, parseRich, richToPlain } from '../src/core/inline';

describe('parseInline', () => {
  it('splits on pipes and trims around them', () => {
    expect(parseInline('5 Pertanyaan Kecil | yang Bikin Kalian')).toEqual([
      [{ text: '5 Pertanyaan Kecil', style: 'plain' }],
      [{ text: 'yang Bikin Kalian', style: 'plain' }],
    ]);
  });
  it('keeps backslash-escaped pipes literal', () => {
    expect(parseInline('a \\| b')).toEqual([[{ text: 'a | b', style: 'plain' }]]);
  });
  it('parses *accent*', () => {
    expect(parseInline('a *big* deal')).toEqual([[
      { text: 'a ', style: 'plain' }, { text: 'big', style: 'accent' }, { text: ' deal', style: 'plain' },
    ]]);
  });
  it('parses inline code spans, keeping pipes inside them', () => {
    expect(parseInline('run `ls | wc` now')).toEqual([[
      { text: 'run ', style: 'plain' }, { text: 'ls | wc', style: 'code' }, { text: ' now', style: 'plain' },
    ]]);
  });
  it('renders unmatched markers literally', () => {
    expect(parseInline('5 * 3 and `open')).toEqual([[{ text: '5 * 3 and `open', style: 'plain' }]]);
    expect(parseInline('*a | b*')).toEqual([
      [{ text: '*a', style: 'plain' }],
      [{ text: 'b*', style: 'plain' }],
    ]);
  });
  it('keeps ** _ and # literal', () => {
    expect(parseInline('**bold** _x_ #tag')).toEqual([[{ text: '**bold** _x_ #tag', style: 'plain' }]]);
  });
  it('rejects accents with inner edge spaces', () => {
    expect(parseInline('a * b * c')).toEqual([[{ text: 'a * b * c', style: 'plain' }]]);
  });
});

describe('parseRich', () => {
  it('turns blank lines into paragraphs and lines into hard breaks', () => {
    const r = parseRich(['one', 'two', '', 'three']);
    expect(r).toHaveLength(2);
    expect(r[0]).toHaveLength(2);
    expect(richToPlain(r)).toBe('one two\nthree');
  });
});
