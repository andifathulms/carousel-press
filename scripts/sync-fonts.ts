// npm run fonts:sync: copy the bundled faces out of @fontsource into fonts/ and
// write fonts/manifest.json, so the renderer registers them with the FontFace
// API (no CSS imports, no bundler needed). `--check` only verifies that
// fonts/ matches what this script would write (used by tests and CI).
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The stylesheets the renderer used to import, verbatim. Order is kept in the manifest. */
export const FONT_SOURCES = [
  'playfair-display/latin-600.css', 'playfair-display/latin-700.css', 'playfair-display/latin-500.css',
  'lora/latin-500.css', 'lora/latin-600.css', 'lora/latin-700.css',
  'poppins/latin-400.css', 'poppins/latin-500.css', 'poppins/latin-600.css',
  'dm-sans/latin-400.css', 'dm-sans/latin-500.css', 'dm-sans/latin-600.css',
  'inter/latin-400.css', 'inter/latin-500.css', 'inter/latin-600.css', 'inter/latin-700.css', 'inter/latin-800.css',
  'jetbrains-mono/latin-400.css', 'jetbrains-mono/latin-500.css', 'jetbrains-mono/latin-600.css', 'jetbrains-mono/latin-700.css',
  // IPA face (SPEC-lexicon §3.1): every subset, selected by unicode-range.
  'gentium-book-plus/400.css',
  'fraunces/latin-500.css', 'fraunces/latin-600.css', 'fraunces/latin-700.css',
  'instrument-sans/latin-400.css', 'instrument-sans/latin-500.css', 'instrument-sans/latin-600.css',
  'barlow/latin-400.css', 'barlow/latin-500.css', 'barlow/latin-600.css', 'barlow/latin-700.css',
  'barlow-condensed/latin-700.css', 'barlow-condensed/latin-800.css',
  // Arabic (SPEC-ayah §2): Arabic subset only.
  'amiri-quran/arabic-400.css', 'amiri/arabic-400.css',
] as const;

export interface ManifestFace {
  family: string;
  style: string;
  weight: string;
  file: string;
  /** Omitted when the stylesheet had none (the whole range). */
  unicodeRange?: string;
}
export interface FontManifest {
  version: 1;
  faces: ManifestFace[];
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(root, process.env.FONTS_OUT ?? 'fonts');
const FONTSOURCE = join(root, 'node_modules/@fontsource');

/** Parse the @font-face blocks of one fontsource stylesheet. */
export function parseFontFaces(css: string): (ManifestFace & { source: string })[] {
  const out: (ManifestFace & { source: string })[] = [];
  for (const block of css.matchAll(/@font-face\s*{([^}]*)}/g)) {
    const body = block[1]!;
    const prop = (name: string): string | undefined => new RegExp(`${name}\\s*:\\s*([^;]+);`).exec(body)?.[1]?.trim();
    const src = /url\(\.\/files\/([^)]+\.woff2)\)\s*format\('woff2'\)/.exec(body)?.[1];
    const family = prop('font-family')?.replace(/^['"]|['"]$/g, '');
    if (!src || !family) throw new Error(`Unreadable @font-face: ${body.trim().slice(0, 80)}`);
    const unicodeRange = prop('unicode-range');
    out.push({
      family, style: prop('font-style') ?? 'normal', weight: prop('font-weight') ?? '400', file: src, source: src,
      ...(unicodeRange ? { unicodeRange } : {}),
    });
  }
  return out;
}

export function buildManifest(): { manifest: FontManifest; copies: [string, string][]; licences: [string, string][] } {
  const faces: ManifestFace[] = [];
  const copies: [string, string][] = [];
  const pkgs = new Set<string>();
  for (const css of FONT_SOURCES) {
    const pkg = css.split('/')[0]!;
    pkgs.add(pkg);
    for (const f of parseFontFaces(readFileSync(join(FONTSOURCE, css), 'utf8'))) {
      const { source, ...face } = f;
      if (faces.some((x) => x.file === face.file)) continue;
      faces.push(face);
      copies.push([join(FONTSOURCE, pkg, 'files', source), face.file]);
    }
  }
  const licences = [...pkgs].map((p) => [join(FONTSOURCE, p, 'LICENSE'), `LICENSES/${p}.txt`] as [string, string]);
  return { manifest: { version: 1, faces }, copies, licences };
}

function main(): void {
  const { manifest, copies, licences } = buildManifest();
  const json = `${JSON.stringify(manifest, null, 2)}\n`;
  if (process.argv.includes('--check')) {
    const problems: string[] = [];
    if (!existsSync(join(OUT, 'manifest.json')) || readFileSync(join(OUT, 'manifest.json'), 'utf8') !== json) problems.push('manifest.json is stale');
    for (const [from, to] of [...copies, ...licences]) {
      if (!existsSync(join(OUT, to)) || !readFileSync(join(OUT, to)).equals(readFileSync(from))) problems.push(`${to} differs`);
    }
    const expected = new Set(copies.map(([, to]) => to));
    for (const f of readdirSync(OUT).filter((x) => x.endsWith('.woff2'))) if (!expected.has(f)) problems.push(`${f} is not in the manifest`);
    if (problems.length) {
      console.error(`fonts/ is out of date (run npm run fonts:sync):\n- ${problems.join('\n- ')}`);
      process.exit(1);
    }
    console.log(`fonts/ ok: ${manifest.faces.length} faces`);
    return;
  }
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(join(OUT, 'LICENSES'), { recursive: true });
  for (const [from, to] of [...copies, ...licences]) copyFileSync(from, join(OUT, to));
  writeFileSync(join(OUT, 'manifest.json'), json);
  console.log(`fonts: ${manifest.faces.length} faces → ${OUT}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
