// Ayah & hadith slides (SPEC-ayah §1): field lines; `arab` is kept byte-for-byte. Pure.
import type { Rich, Slide } from './types';
import { type Line, type Warn, readFields } from './lexicon';

export const AYAH_FIELDS = ['arab', 'terjemah', 'ref', 'source', 'mark', 'portion'] as const;
export const HADITH_FIELDS = ['arab', 'text', 'ref', 'grade', 'source'] as const;
const AYAH_REQUIRED = ['arab', 'terjemah', 'ref'] as const;
const HADITH_REQUIRED = ['text', 'ref', 'grade'] as const;

/** Translation text: only `|` line breaks apply (`\|` is a literal pipe). No accent or code markers. */
export function pipeLines(src: string): Rich {
  const lines: string[] = [];
  let cur = '';
  for (let i = 0; i < src.length; i++) {
    if (src[i] === '\\' && src[i + 1] === '|') {
      cur += '|';
      i++;
    } else if (src[i] === '|') {
      lines.push(cur.trim());
      cur = '';
    } else cur += src[i];
  }
  lines.push(cur.trim());
  const kept = lines.filter((l) => l !== '');
  return kept.length ? [kept.map((text) => [{ text, style: 'plain' as const }])] : [];
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** `28` → `٢٨`. */
export function toArabicDigits(n: string): string {
  return n.replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]!);
}

/** End-of-ayah ornament for `mark` (default: last number in `ref`), or null when off/absent (SPEC-ayah §2). */
export function ayahMark(f: Record<string, string>): string | null {
  const mark = f.mark?.trim();
  if (mark === 'off') return null;
  const n = mark && /^\d+$/.test(mark) ? mark : /(\d+)\D*$/.exec(f.ref ?? '')?.[1];
  return n ? `﴿${toArabicDigits(n)}﴾` : null;
}

function requireFields(f: Record<string, string>, keys: readonly string[], type: string, warn: Warn): void {
  const missing = keys.filter((k) => !f[k]);
  if (missing.length) {
    warn('missing-field', `${type} slide needs ${missing.map((k) => `"${k}:"`).join(', ')} (export is blocked)`, undefined, true);
  }
}

export function fillAyah(slide: Slide, content: readonly Line[], warn: Warn): void {
  const f = readFields(content, AYAH_FIELDS, warn);
  requireFields(f, AYAH_REQUIRED, 'Ayah', warn);
  if (f.portion !== undefined && f.portion !== 'true' && f.portion !== 'false') {
    warn('unknown-field', `portion must be "true" or "false", got "${f.portion}"`);
  }
  slide.fields = f;
  slide.headlineSrc = f.ref ?? '';
  slide.body = pipeLines(f.terjemah ?? '');
}

export function fillHadith(slide: Slide, content: readonly Line[], warn: Warn): void {
  const f = readFields(content, HADITH_FIELDS, warn);
  requireFields(f, HADITH_REQUIRED, 'Hadith', warn);
  slide.fields = f;
  slide.headlineSrc = f.ref ?? '';
  slide.body = pipeLines(f.text ?? '');
}
