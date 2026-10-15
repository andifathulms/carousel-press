import { describe, expect, it } from 'vitest';
import { SAMPLES } from '../src/samples';
import { highlightDeck, inlineSegs } from '../src/ui/deckHighlight';

const kinds = (line: ReturnType<typeof highlightDeck>[number]): string => line.map((s) => `${s.k ?? '-'}:${s.t}`).join(' ');

describe('highlightDeck', () => {
  it('marks header keys, separators, tags and attribute values', () => {
    const [h1, , sep, tag, , tag2] = highlightDeck('template: dev/terminal\nlang: id\n---\n[cover photo=1]\nHi\n[card kicker="GIT • CHEAT"]');
    expect(kinds(h1!)).toBe('key:template: -: dev/terminal');
    expect(kinds(sep!)).toBe('sep:---');
    expect(kinds(tag!)).toBe('tag:[ tag:cover -:  tag:photo tag:= attr:1 tag:]');
    expect(kinds(tag2!)).toBe('tag:[ tag:card -:  tag:kicker tag:= attr:"GIT • CHEAT" tag:]');
  });
  it('treats a colon line as text when there is no header', () => {
    expect(kinds(highlightDeck('Note: this is a slide\n---\nmore')[0]!)).toBe('-:Note: this is a slide');
  });
  it('does not treat --- inside a code fence as a separator', () => {
    const out = highlightDeck('[code]\nTitle\n```bash\n---\n```\n---');
    expect(out.map((l) => l[0]?.k)).toEqual(['tag', undefined, 'fence', 'block', 'fence', 'sep']);
  });
  it('keeps every character, in order, for every sample', () => {
    for (const s of SAMPLES) {
      const lines = highlightDeck(s.text);
      expect(lines.map((l) => l.map((x) => x.t).join('')).join('\n')).toBe(s.text.replace(/\r\n/g, '\n'));
    }
  });
});

describe('inlineSegs', () => {
  it('marks pipes, accents and inline code; escaped pipes and unmatched markers stay plain', () => {
    expect(kinds(inlineSegs('A | *b* `c` \\| *d'))).toBe('-:A  pipe:| -:  accent:*b* -:  code:`c` -: \\| *d');
  });
});
