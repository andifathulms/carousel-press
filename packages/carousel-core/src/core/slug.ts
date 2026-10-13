export const SLUG_MAX = 40;

/**
 * Lowercase a–z0–9 and `-` only. Accents are transliterated via NFKD and
 * stripping combining marks; everything else becomes a separator.
 */
export function slugify(input: string, max = SLUG_MAX): string {
  const base = input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (base.length <= max) return base;
  return base.slice(0, max).replace(/-+$/g, '');
}

/**
 * Photo ID from a file name: strip the extension, slugify, de-duplicate.
 * All-digit names get a `photo-` prefix, since `photo=<integer>` is always a tray index.
 */
export function photoIdFromName(fileName: string, existing: Iterable<string>): string {
  const stem = fileName.replace(/\.[^./\\]+$/, '');
  const slug = slugify(stem);
  const base = !slug ? 'photo' : /^\d+$/.test(slug) ? `photo-${slug}` : slug;
  return uniqueId(base, existing);
}

/** Append -2, -3… until the id is not taken. */
export function uniqueId(base: string, existing: Iterable<string>): string {
  const taken = new Set(existing);
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** `{slug}_{NN}.png` with a 1-based, 2-digit index. */
export function slideFileName(slug: string, index: number): string {
  return `${slug || 'carousel'}_${String(index + 1).padStart(2, '0')}.png`;
}
