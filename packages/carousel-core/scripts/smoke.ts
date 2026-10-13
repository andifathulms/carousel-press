// npm run core:smoke: dist/browser.js on a plain page, served like Django static files
// (/static/carousel-core/…) under a sub-path host page (/app/). Renders a 3-slide deck
// with a host variant, builds the ZIP, checks errors, and (with REVIEW_BASE=<hashes>)
// compares a sample deck's PNGs byte for byte with the app's review render.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';
import { chromium } from 'playwright';

const pkg = resolve(fileURLToPath(new URL('..', import.meta.url)));
const repo = resolve(pkg, '../..');
const TYPES: Record<string, string> = { '.js': 'text/javascript', '.html': 'text/html', '.woff2': 'font/woff2', '.json': 'application/json', '.map': 'application/json' };

const DECK = `template: nusastats/pitch
counter: off
---
[cover kicker="NUSASTATS • LIGA 1"]
Rata-rata gol | per laga musim ini
Data 2025/26, 306 laga.
---
2,71 gol per laga
Naik dari *2,48* musim lalu.
---
[end]
Ikuti untuk data berikutnya.`;

// The host page: plain JS, as a Django template would have it.
const PAGE = `<!doctype html><meta charset="utf-8"><title>host</title>
<script type="module">
  import * as cc from '/static/carousel-core/dist/browser.js';
  const b64 = (blob) => new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(',')[1]); fr.readAsDataURL(blob); });
  const sha1 = async (blob) => [...new Uint8Array(await crypto.subtle.digest('SHA-1', await blob.arrayBuffer()))]
    .map((x) => x.toString(16).padStart(2, '0')).join('');
  window.smoke = async (deck, sample) => {
    const base = cc.getVariant('dev/github-dark');
    cc.registerVariant({ ...base, id: 'nusastats/pitch', name: 'NusaStats Pitch',
      surfaces: { ...base.surfaces, pitch: { ...base.surfaces.deep, bg: '#0E3B2E', blob: '#0E3B2E' } }, rotation: ['pitch', 'deep'] });
    let contrastError = '';
    try {
      cc.registerVariant({ ...base, id: 'nusastats/bad', name: 'Bad', surfaces: { ...base.surfaces, deep: { ...base.surfaces.deep, ink: base.surfaces.deep.bg } } });
    } catch (e) { contrastError = e.message; }
    cc.registerVariant({ ...base, id: 'nusastats/nofont', name: 'No Font', fonts: { ...base.fonts, sans: 'Missing Sans' } });
    const fontError = await cc.loadFonts('nusastats/nofont').then(() => '', (e) => e.message);
    const t0 = performance.now();
    const blobs = await cc.renderDeck(deck);
    const ms = performance.now() - t0;
    const zip = await cc.exportZip(blobs, 'Rata-rata gol');
    const sampleHashes = await Promise.all((await cc.renderDeck(sample, { template: 'dev/github-dark' })).map(sha1));
    return { count: blobs.length, types: blobs.map((x) => x.type), zip: await b64(zip), contrastError, fontError, ms, sampleHashes };
  };
  window.ready = true;
</script>`;

function fail(msg: string): never {
  console.error(`smoke: FAIL ${msg}`);
  process.exit(1);
}

async function main(): Promise<void> {
  if (!existsSync(join(pkg, 'dist/browser.js'))) fail('dist/browser.js missing: run npm run core:build');
  const site = mkdtempSync(join(tmpdir(), 'cc-smoke-'));
  mkdirSync(join(site, 'static/carousel-core'), { recursive: true });
  cpSync(join(pkg, 'dist'), join(site, 'static/carousel-core/dist'), { recursive: true });
  cpSync(join(pkg, 'fonts'), join(site, 'static/carousel-core/fonts'), { recursive: true });
  mkdirSync(join(site, 'app'));
  writeFileSync(join(site, 'app/index.html'), PAGE);

  const server = createServer((req, res) => {
    const path = decodeURIComponent((req.url ?? '/').split('?')[0]!);
    const file = join(site, path.endsWith('/') ? `${path}index.html` : path);
    if (!file.startsWith(site) || !existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const port = (server.address() as { port: number }).port;

  const sample = readFileSync(join(repo, 'src/samples/dev-git-id.txt'), 'utf8');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`http://127.0.0.1:${port}/app/`);
    await page.waitForFunction(() => (window as unknown as { ready?: boolean }).ready === true);

    type Result = { count: number; types: string[]; zip: string; contrastError: string; fontError: string; ms: number; sampleHashes: string[] };
    const r = (await page.evaluate(`window.smoke(${JSON.stringify(DECK)}, ${JSON.stringify(sample)})`)) as Result;

    if (errors.length) fail(`page errors: ${errors.join(' | ')}`);
    if (r.count !== 3 || r.types.some((t) => t !== 'image/png')) fail(`expected 3 PNGs, got ${r.count} (${r.types.join(', ')})`);
    const zip = await JSZip.loadAsync(Buffer.from(r.zip, 'base64'));
    const names = Object.keys(zip.files);
    if (names.join() !== 'rata-rata-gol_01.png,rata-rata-gol_02.png,rata-rata-gol_03.png') fail(`zip entries ${names.join()}`);
    for (const n of names) {
      const png = await zip.file(n)!.async('nodebuffer');
      if (png.readUInt32BE(16) !== 1080 || png.readUInt32BE(20) !== 1920) fail(`${n} is ${png.readUInt32BE(16)}×${png.readUInt32BE(20)}`);
    }
    writeFileSync(join(pkg, 'dist-smoke-01.png'), await zip.file(names[0]!)!.async('nodebuffer'));
    if (!r.contrastError.includes('registerVariant("nusastats/bad") failed') || !r.contrastError.includes('ink/bg')) fail(`contrast error: ${r.contrastError}`);
    if (!r.fontError.includes('font 400 "Missing Sans" failed to load')) fail(`font error: ${r.fontError}`);
    console.log(`smoke: 3 slides + ZIP ok (${Math.round(r.ms)} ms), host variant ok, contrast error ok, font error ok`);

    const baseFile = process.env.REVIEW_BASE;
    if (baseFile) {
      const want = new Map(readFileSync(baseFile, 'utf8').trim().split('\n').map((l) => [l.slice(42), l.slice(0, 40)] as [string, string]));
      const bad = r.sampleHashes.filter((h, i) => want.get(`./dev/github-dark/dev-git-id_${String(i + 1).padStart(2, '0')}.png`) !== h);
      if (bad.length) fail(`${bad.length}/${r.sampleHashes.length} dev-git-id PNGs differ from the review render`);
      console.log(`smoke: dev-git-id × dev/github-dark: ${r.sampleHashes.length} PNGs byte-identical to the app's review render`);
    }
  } finally {
    await browser.close();
    server.close();
    rmSync(site, { recursive: true, force: true });
  }
}

main().catch((e) => fail(e instanceof Error ? e.stack ?? e.message : String(e)));
