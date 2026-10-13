import type { TextMeasurer } from './measure';

export interface CodeLineSrc {
  /** Draw a `$ ` prompt before the text (bash/sh only). */
  prompt: boolean;
  /** Line text without the prompt. */
  text: string;
  /** Previous line ended with `\` (bash continuation). */
  continuation: boolean;
}

export const PROMPT = '$ ';

export function isShell(lang: string): boolean {
  return lang === 'bash' || lang === 'sh' || lang === 'shell' || lang === 'zsh';
}

/**
 * Split code into lines and apply the bash prompt rule (DESIGN §6.4):
 * every non-empty, non-comment, non-continuation line gets `$ `; lines that
 * already start with `$ ` keep their single prompt.
 */
export function prepareCode(text: string, lang: string): CodeLineSrc[] {
  const raw = text.split('\n');
  const shell = isShell(lang);
  let prevContinues = false;
  return raw.map((line) => {
    const continuation = shell && prevContinues;
    prevContinues = /\\\s*$/.test(line);
    if (!shell) return { prompt: false, text: line, continuation: false };
    if (line.startsWith(PROMPT)) return { prompt: true, text: line.slice(PROMPT.length), continuation };
    const t = line.trimStart();
    const prompt = t !== '' && !t.startsWith('#') && !continuation;
    return { prompt, text: line, continuation };
  });
}

/** Visible text of a prepared line, prompt included (used for width measurement). */
export function lineText(l: CodeLineSrc): string {
  return (l.prompt ? PROMPT : '') + l.text;
}

export interface CodeSizes {
  max: number;
  min: number;
  step: number;
}

export interface CodeFit {
  /** Largest size whose widest line fits; `min` when nothing fits. */
  size: number;
  fits: boolean;
  /** Width of the widest line at `size`. */
  widest: number;
}

/** Width fit: largest size (max → min) at which the widest line ≤ innerWidth. Never wraps. */
export function fitCodeWidth(
  lines: readonly CodeLineSrc[], innerWidth: number, family: string, weight: number,
  sizes: CodeSizes, m: TextMeasurer,
): CodeFit {
  const widest = (size: number): number =>
    lines.reduce((w, l) => Math.max(w, m.width(lineText(l), { family, weight, size })), 0);
  for (let s = sizes.max; s >= sizes.min; s -= sizes.step) {
    const w = widest(s);
    if (w <= innerWidth) return { size: s, fits: true, widest: w };
  }
  return { size: sizes.min, fits: false, widest: widest(sizes.min) };
}
