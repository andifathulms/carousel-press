import { findHeaderEnd, splitLines } from './parser';

/**
 * Set a header key in the deck text, keeping every other line and its order.
 * - Existing key → its line is rewritten in place.
 * - Header without the key → the key is appended as the last header line.
 * - No header → `key: value` + `---` is inserted at the top.
 */
export function setHeaderKey(text: string, key: string, value: string): string {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = splitLines(text);
  const end = findHeaderEnd(lines);
  const entry = `${key}: ${value}`;

  if (end < 0) {
    const body = text.length ? text : '';
    return `${entry}${eol}---${eol}${body}`;
  }

  const re = new RegExp(`^(\\s*)${key}\\s*:`);
  for (let i = 0; i < end; i++) {
    const m = re.exec(lines[i]!);
    if (m) {
      lines[i] = `${m[1]}${entry}`;
      return lines.join(eol);
    }
  }

  // Insert after the last non-empty header line.
  let at = end;
  while (at > 0 && lines[at - 1]!.trim() === '') at--;
  lines.splice(at, 0, entry);
  return lines.join(eol);
}

/** Read a header key's raw value from the text (or undefined). */
export function getHeaderKey(text: string, key: string): string | undefined {
  const lines = splitLines(text);
  const end = findHeaderEnd(lines);
  const re = new RegExp(`^\\s*${key}\\s*:\\s*(.*)$`);
  for (let i = 0; i < end; i++) {
    const m = re.exec(lines[i]!);
    if (m) return m[1]!.trim();
  }
  return undefined;
}
