import type { Paragraph, Rich, RichLine, Run, RunStyle } from './types';

/**
 * Inline rules (PRD §4.5):
 *  `|` = line break, `\|` = literal pipe, `*text*` = accent, `` `text` `` = code.
 * Unmatched markers render literally. `**` renders literally.
 */
export function parseInline(src: string): RichLine[] {
  const lines: RichLine[] = [];
  let line: Run[] = [];
  let buf = '';

  const push = (text: string, style: RunStyle): void => {
    if (!text) return;
    const last = line[line.length - 1];
    if (last && last.style === style) last.text += text;
    else line.push({ text, style });
  };
  const flush = (): void => {
    push(buf, 'plain');
    buf = '';
  };

  let i = 0;
  while (i < src.length) {
    const ch = src[i]!;
    if (ch === '\\' && src[i + 1] === '|') {
      buf += '|';
      i += 2;
      continue;
    }
    if (ch === '|') {
      flush();
      lines.push(trimLine(line));
      line = [];
      i++;
      continue;
    }
    if (ch === '`') {
      const end = src.indexOf('`', i + 1);
      if (end > i + 1) {
        flush();
        push(src.slice(i + 1, end), 'code');
        i = end + 1;
        continue;
      }
    }
    if (ch === '*') {
      // A run of 2+ stars is literal (no bold in this format).
      if (src[i + 1] === '*') {
        let j = i;
        while (src[j] === '*') j++;
        buf += src.slice(i, j);
        i = j;
        continue;
      }
      const end = findAccentEnd(src, i);
      if (end > 0) {
        flush();
        push(src.slice(i + 1, end).replace(/\\\|/g, '|'), 'accent');
        i = end + 1;
        continue;
      }
    }
    buf += ch;
    i++;
  }
  flush();
  lines.push(trimLine(line));
  return lines;
}

function findAccentEnd(src: string, start: number): number {
  const first = src[start + 1];
  if (first === undefined || first === ' ' || first === '*') return -1;
  for (let j = start + 1; j < src.length; j++) {
    const c = src[j];
    if (c === '|' && src[j - 1] !== '\\') return -1;
    if (c === '`') return -1;
    if (c === '*') {
      if (j === start + 1 || src[j - 1] === ' ') return -1;
      if (src[j + 1] === '*') return -1;
      return j;
    }
  }
  return -1;
}

function trimLine(line: Run[]): Run[] {
  const out = line.map((r) => ({ ...r }));
  const first = out[0];
  if (first && first.style !== 'code') first.text = first.text.replace(/^\s+/, '');
  const last = out[out.length - 1];
  if (last && last.style !== 'code') last.text = last.text.replace(/\s+$/, '');
  return out.filter((r) => r.text.length > 0);
}

/**
 * Multi-line text → Rich. Each source line is a hard break; a blank line
 * starts a new paragraph.
 */
export function parseRich(sourceLines: readonly string[]): Rich {
  const paras: Paragraph[] = [];
  let cur: Paragraph = [];
  for (const raw of sourceLines) {
    if (raw.trim() === '') {
      if (cur.length) paras.push(cur);
      cur = [];
      continue;
    }
    cur.push(...parseInline(raw.trim()));
  }
  if (cur.length) paras.push(cur);
  return paras;
}

/** Plain text of a Rich value (lines joined by spaces, paragraphs by newlines). */
export function richToPlain(rich: Rich): string {
  return rich
    .map((p) => p.map((l) => l.map((r) => r.text).join('')).join(' '))
    .join('\n');
}

export function isEmptyRich(rich: Rich): boolean {
  return rich.every((p) => p.every((l) => l.every((r) => r.text.trim() === '')));
}
