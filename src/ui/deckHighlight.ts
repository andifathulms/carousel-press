import { findHeaderEnd, splitLines } from 'carousel-core/src/core/parser';

// Colouring for the deck editor (pure: no DOM). The parser decides what the text means;
// this only marks the syntax so slides are easy to tell apart while typing.

export type SegKind = 'key' | 'sep' | 'tag' | 'attr' | 'pipe' | 'accent' | 'code' | 'fence' | 'block';
export interface Seg {
  t: string;
  k?: SegKind;
}

const HEADER_LINE = /^(\s*[a-z]+\s*:)(.*)$/;
const TAG_LINE = /^(\s*)(\[[^\]]*\])(\s*)$/;
const FENCE = /^\s*```/;
const TAG_TOKEN = /\s+|"(?:[^"\\]|\\.)*"?|=|[^\s="]+/g;

function tagSegs(tag: string): Seg[] {
  const out: Seg[] = [{ t: '[', k: 'tag' }];
  let afterEq = false;
  for (const m of tag.slice(1, -1).matchAll(TAG_TOKEN)) {
    const t = m[0];
    if (/^\s+$/.test(t)) {
      out.push({ t });
      afterEq = false;
    } else if (t === '=') {
      out.push({ t, k: 'tag' });
      afterEq = true;
    } else {
      out.push({ t, k: afterEq ? 'attr' : 'tag' });
      afterEq = false;
    }
  }
  out.push({ t: ']', k: 'tag' });
  return out;
}

/** `|` breaks, `*accent*` and `inline code`; unmatched markers stay plain, `\|` is a literal pipe. */
export function inlineSegs(line: string): Seg[] {
  const out: Seg[] = [];
  let plain = '';
  const flush = (): void => {
    if (plain) out.push({ t: plain });
    plain = '';
  };
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '\\' && line[i + 1] === '|') {
      plain += '\\|';
      i++;
    } else if (ch === '|') {
      flush();
      out.push({ t: '|', k: 'pipe' });
    } else if ((ch === '`' || ch === '*') && line.indexOf(ch, i + 1) > i + 1) {
      const end = line.indexOf(ch, i + 1);
      flush();
      out.push({ t: line.slice(i, end + 1), k: ch === '`' ? 'code' : 'accent' });
      i = end;
    } else plain += ch;
  }
  flush();
  return out;
}

/** One list of segments per line of `text`. */
export function highlightDeck(text: string): Seg[][] {
  const lines = splitLines(text);
  const headerEnd = findHeaderEnd(lines);
  let inFence = false;
  return lines.map((line, i): Seg[] => {
    if (i < headerEnd) {
      const m = HEADER_LINE.exec(line);
      return m ? [{ t: m[1]!, k: 'key' }, { t: m[2]! }] : [{ t: line }];
    }
    if (FENCE.test(line)) {
      inFence = !inFence;
      return [{ t: line, k: 'fence' }];
    }
    if (inFence) return [{ t: line, k: 'block' }];
    if (line.trim() === '---') return [{ t: line, k: 'sep' }];
    const tag = TAG_LINE.exec(line);
    if (tag) return [{ t: tag[1]! }, ...tagSegs(tag[2]!), { t: tag[3]! }].filter((s) => s.t);
    return inlineSegs(line);
  });
}
