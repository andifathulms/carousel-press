// npm run review: build with review.html, render every sample × template, write PNGs + contact sheet.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from 'playwright';

interface Item {
  template: string;
  sample: string;
  index: number;
  dataUrl: string;
  warnings: { code: string; message: string }[];
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'review');

async function main(): Promise<void> {
  const server = await preview({ root, base: './', build: { outDir: 'dist-review' }, preview: { port: 4179, strictPort: false } });
  const url = server.resolvedUrls?.local[0] ?? 'http://localhost:4179/';
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });
    await page.goto(`${url}review.html`);
    await page.waitForFunction(() => typeof window.__review === 'function');
    // One template × sample per call, written to disk straight away: holding every PNG at once
    // exceeds Playwright's message limit and Node's heap.
    const templates = (await page.evaluate(() => window.__reviewTemplates!)) as string[];
    const samples = (await page.evaluate(() => window.__reviewSamples!)) as string[];
    rmSync(out, { recursive: true, force: true });
    const rows: string[] = [];
    const warnings: Record<string, Item['warnings']> = {};
    let count = 0;
    for (const t of templates) {
      for (const smp of samples) {
        const batch = (await page.evaluate(([id, sid]) => window.__review!(id as never, sid), [t, smp] as const)) as Item[];
        for (const it of batch) {
          const dir = join(out, it.template);
          mkdirSync(dir, { recursive: true });
          const file = `${it.sample}_${String(it.index + 1).padStart(2, '0')}.png`;
          writeFileSync(join(dir, file), Buffer.from(it.dataUrl.split(',')[1]!, 'base64'));
          const rel = `${it.template}/${file}`;
          if (it.warnings.length) warnings[rel] = it.warnings;
          const badge = it.warnings.length ? `<b class="w">${it.warnings.map((w) => w.code).join(', ')}</b>` : '';
          rows.push(`<figure data-t="${it.template}"><div class="f"><img src="${rel}"><i></i></div><figcaption>${rel}${badge}</figcaption></figure>`);
          count++;
        }
      }
    }
    writeFileSync(join(out, 'warnings.json'), JSON.stringify(warnings, null, 2));
    writeFileSync(join(out, 'index.html'), sheet(rows));
    console.log(`review: ${count} slides → ${out}`);
    console.log(`review: ${Object.keys(warnings).length} slides with warnings`);
  } finally {
    await browser.close();
    server.httpServer.close();
  }
}

// SAFE = { left: 96, right: 912, top: 196, bottom: 1500 } on 1080×1920, drawn as a % overlay.
function sheet(rows: string[]): string {
  return `<!doctype html><meta charset="utf-8"><title>Review</title><style>
body{background:#12110F;color:#EEE9DF;font:12px system-ui;margin:16px}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.f{position:relative}img{width:100%;display:block}
i{position:absolute;left:${(96 / 1080) * 100}%;right:${(168 / 1080) * 100}%;top:${(196 / 1920) * 100}%;bottom:${(420 / 1920) * 100}%;outline:1px dashed #FF4040}
figure{margin:0}figcaption{padding:4px 0;word-break:break-all}.w{color:#F06A5A;display:block}
</style><main>${rows.join('\n')}</main>`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
