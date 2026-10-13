import { C as CANVAS, w as withAlpha, e as resolveIcons, t as traitsOf, f as getFamily, R as ROWS, S as SAFE, j as CONTENT_W, c as createCanvasMeasurer, A as ARABIC_SAMPLE, k as AYAH_FACE, H as HADITH_FACE } from "./registry-CfRP1EtO.js";
function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas2 = new OffscreenCanvas(w, h);
    const ctx2 = canvas2.getContext("2d");
    if (ctx2) return { canvas: canvas2, ctx: ctx2 };
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas not supported");
  return { canvas, ctx };
}
function faceAvailable(family, sample) {
  try {
    return document.fonts.check(`400 40px "${family}"`, sample);
  } catch {
    return false;
  }
}
function coverCrop(iw, ih, fx, fy, W = CANVAS.w, H = CANVAS.h) {
  const scale = Math.max(W / iw, H / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const dx = clamp(W / 2 - fx * dw, W - dw, 0);
  const dy = clamp(H / 2 - fy * dh, H - dh, 0);
  return { dx, dy, dw, dh };
}
function photoOverlay(d) {
  return {
    wash: 0.1 + 0.35 * d,
    stops: [[0, 0.3 + 0.35 * d], [0.38, 0.06], [0.62, 0.1], [1, 0.48 + 0.35 * d]]
  };
}
function drawPhoto(ctx, photo, darkness, tint) {
  const r = coverCrop(photo.width, photo.height, photo.focalX, photo.focalY);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(photo.image, r.dx, r.dy, r.dw, r.dh);
  const o = photoOverlay(Math.min(1, Math.max(0, darkness / 100)));
  ctx.fillStyle = withAlpha(tint, o.wash);
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);
  const g = ctx.createLinearGradient(0, 0, 0, CANVAS.h);
  for (const [at, a] of o.stops) g.addColorStop(at, withAlpha(tint, a));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);
}
const OVERFLOW_OUTLINE = { color: "#FF3B30", width: 6, dash: [18, 12] };
function layoutSlide(slide, deck, variant, measurer, icon, hasPhoto) {
  return getFamily(variant.family).layout({ slide, deck, variant, icon, hasPhoto, measurer });
}
function deckIcons(deck, variant) {
  return resolveIcons(deck.slides, deck.slug, traitsOf(variant).icons);
}
function renderSlide(ctx, slide, deck, variant, assets) {
  const measurer = createCanvasMeasurer(ctx, faceAvailable);
  const L = layoutSlide(slide, deck, variant, measurer, assets.icon, !!assets.photo);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = L.onPhoto ? variant.onPhoto.tint : L.surface.bg;
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);
  const darkness = Math.max(variant.deco.minDarkness ?? 0, assets.darkness);
  if (assets.photo) drawPhoto(ctx, assets.photo, darkness, variant.onPhoto.tint);
  getFamily(variant.family).draw(ctx, L);
  if (assets.preview && L.stack.overflow) {
    const top = L.stack.placed[0]?.y ?? ROWS.stackTopCard;
    ctx.setLineDash(OVERFLOW_OUTLINE.dash);
    ctx.strokeStyle = OVERFLOW_OUTLINE.color;
    ctx.lineWidth = OVERFLOW_OUTLINE.width;
    ctx.strokeRect(SAFE.left, top, CONTENT_W, ROWS.stackLimit - top);
    ctx.setLineDash([]);
  }
  ctx.restore();
  return { warnings: L.warnings, boxes: L.boxes, overflow: L.stack.overflow, layout: L };
}
const faces = [{ "family": "Playfair Display", "style": "normal", "weight": "600", "file": "playfair-display-latin-600-normal.woff2" }, { "family": "Playfair Display", "style": "normal", "weight": "700", "file": "playfair-display-latin-700-normal.woff2" }, { "family": "Playfair Display", "style": "normal", "weight": "500", "file": "playfair-display-latin-500-normal.woff2" }, { "family": "Lora", "style": "normal", "weight": "500", "file": "lora-latin-500-normal.woff2" }, { "family": "Lora", "style": "normal", "weight": "600", "file": "lora-latin-600-normal.woff2" }, { "family": "Lora", "style": "normal", "weight": "700", "file": "lora-latin-700-normal.woff2" }, { "family": "Poppins", "style": "normal", "weight": "400", "file": "poppins-latin-400-normal.woff2" }, { "family": "Poppins", "style": "normal", "weight": "500", "file": "poppins-latin-500-normal.woff2" }, { "family": "Poppins", "style": "normal", "weight": "600", "file": "poppins-latin-600-normal.woff2" }, { "family": "DM Sans", "style": "normal", "weight": "400", "file": "dm-sans-latin-400-normal.woff2" }, { "family": "DM Sans", "style": "normal", "weight": "500", "file": "dm-sans-latin-500-normal.woff2" }, { "family": "DM Sans", "style": "normal", "weight": "600", "file": "dm-sans-latin-600-normal.woff2" }, { "family": "Inter", "style": "normal", "weight": "400", "file": "inter-latin-400-normal.woff2" }, { "family": "Inter", "style": "normal", "weight": "500", "file": "inter-latin-500-normal.woff2" }, { "family": "Inter", "style": "normal", "weight": "600", "file": "inter-latin-600-normal.woff2" }, { "family": "Inter", "style": "normal", "weight": "700", "file": "inter-latin-700-normal.woff2" }, { "family": "Inter", "style": "normal", "weight": "800", "file": "inter-latin-800-normal.woff2" }, { "family": "JetBrains Mono", "style": "normal", "weight": "400", "file": "jetbrains-mono-latin-400-normal.woff2" }, { "family": "JetBrains Mono", "style": "normal", "weight": "500", "file": "jetbrains-mono-latin-500-normal.woff2" }, { "family": "JetBrains Mono", "style": "normal", "weight": "600", "file": "jetbrains-mono-latin-600-normal.woff2" }, { "family": "JetBrains Mono", "style": "normal", "weight": "700", "file": "jetbrains-mono-latin-700-normal.woff2" }, { "family": "Gentium Book Plus", "style": "normal", "weight": "400", "file": "gentium-book-plus-cyrillic-ext-400-normal.woff2", "unicodeRange": "U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F" }, { "family": "Gentium Book Plus", "style": "normal", "weight": "400", "file": "gentium-book-plus-cyrillic-400-normal.woff2", "unicodeRange": "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116" }, { "family": "Gentium Book Plus", "style": "normal", "weight": "400", "file": "gentium-book-plus-greek-ext-400-normal.woff2", "unicodeRange": "U+1F00-1FFF" }, { "family": "Gentium Book Plus", "style": "normal", "weight": "400", "file": "gentium-book-plus-greek-400-normal.woff2", "unicodeRange": "U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF" }, { "family": "Gentium Book Plus", "style": "normal", "weight": "400", "file": "gentium-book-plus-vietnamese-400-normal.woff2", "unicodeRange": "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB" }, { "family": "Gentium Book Plus", "style": "normal", "weight": "400", "file": "gentium-book-plus-latin-ext-400-normal.woff2", "unicodeRange": "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" }, { "family": "Gentium Book Plus", "style": "normal", "weight": "400", "file": "gentium-book-plus-latin-400-normal.woff2", "unicodeRange": "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }, { "family": "Fraunces", "style": "normal", "weight": "500", "file": "fraunces-latin-500-normal.woff2" }, { "family": "Fraunces", "style": "normal", "weight": "600", "file": "fraunces-latin-600-normal.woff2" }, { "family": "Fraunces", "style": "normal", "weight": "700", "file": "fraunces-latin-700-normal.woff2" }, { "family": "Instrument Sans", "style": "normal", "weight": "400", "file": "instrument-sans-latin-400-normal.woff2" }, { "family": "Instrument Sans", "style": "normal", "weight": "500", "file": "instrument-sans-latin-500-normal.woff2" }, { "family": "Instrument Sans", "style": "normal", "weight": "600", "file": "instrument-sans-latin-600-normal.woff2" }, { "family": "Barlow", "style": "normal", "weight": "400", "file": "barlow-latin-400-normal.woff2" }, { "family": "Barlow", "style": "normal", "weight": "500", "file": "barlow-latin-500-normal.woff2" }, { "family": "Barlow", "style": "normal", "weight": "600", "file": "barlow-latin-600-normal.woff2" }, { "family": "Barlow", "style": "normal", "weight": "700", "file": "barlow-latin-700-normal.woff2" }, { "family": "Barlow Condensed", "style": "normal", "weight": "700", "file": "barlow-condensed-latin-700-normal.woff2" }, { "family": "Barlow Condensed", "style": "normal", "weight": "800", "file": "barlow-condensed-latin-800-normal.woff2" }, { "family": "Amiri Quran", "style": "normal", "weight": "400", "file": "amiri-quran-arabic-400-normal.woff2" }, { "family": "Amiri", "style": "normal", "weight": "400", "file": "amiri-arabic-400-normal.woff2" }];
const MANIFEST = {
  faces
};
const BUNDLED_FACES = MANIFEST.faces;
let baseUrl = null;
let resolveUrl = null;
let hostFaces = [];
const registered = /* @__PURE__ */ new Map();
function configureFonts(config) {
  if (config.baseUrl !== void 0) {
    const s = String(config.baseUrl);
    baseUrl = s.endsWith("/") ? s : `${s}/`;
  }
  if (config.resolveUrl) resolveUrl = config.resolveUrl;
  if (config.faces) {
    for (const f of config.faces) {
      if (!f || typeof f.family !== "string" || typeof f.url !== "string") throw new Error("configureFonts: every face needs { family, weight, url }");
      const ok = typeof f.weight === "number" || Array.isArray(f.weight) && f.weight.length === 2 && f.weight[0] <= f.weight[1];
      if (!ok) throw new Error(`configureFonts: weight of "${f.family}" must be a number or [min, max]`);
    }
    hostFaces = [...config.faces, ...hostFaces];
  }
}
function defaultBase() {
  const dir = String(import.meta.url).replace(/[^/]*$/, "");
  return new URL(`${dir}../fonts/`).href;
}
function bundledUrl(file) {
  if (resolveUrl) return resolveUrl(file);
  const base = baseUrl ?? defaultBase();
  if (base.startsWith("file:") && typeof location !== "undefined" && location.protocol !== "file:") {
    throw new Error(`carousel-core: can't serve fonts from ${base}. Copy the package's fonts/ folder to your public files and call configureFonts({ baseUrl: '/your/path/fonts/' }) first`);
  }
  return /^[a-z][a-z0-9+.-]*:/i.test(base) ? new URL(file, base).href : `${base}${file}`;
}
const covers = (w, weight) => typeof w === "number" ? w === weight : weight >= w[0] && weight <= w[1];
function sourcesFor(family, weight, style = "normal") {
  const host = hostFaces.filter((f) => f.family === family && (f.style ?? "normal") === style && covers(f.weight, weight));
  if (host.length) return host;
  return BUNDLED_FACES.filter((f) => f.family === family && f.style === style && Number(f.weight) === weight).map((f) => ({
    family,
    weight,
    style: f.style,
    url: bundledUrl(f.file),
    ...f.unicodeRange ? { unicodeRange: f.unicodeRange } : {}
  }));
}
function registerFace(family, weight, style = "normal") {
  const sources = sourcesFor(family, weight, style);
  for (const s of sources) {
    const w = typeof s.weight === "number" ? String(s.weight) : `${s.weight[0]} ${s.weight[1]}`;
    const key = `${s.family}|${w}|${s.style ?? "normal"}|${s.unicodeRange ?? ""}|${s.url}`;
    if (registered.has(key)) continue;
    const face = new FontFace(s.family, `url("${s.url}") format("woff2")`, {
      weight: w,
      style: s.style ?? "normal",
      ...s.unicodeRange ? { unicodeRange: s.unicodeRange } : {}
    });
    document.fonts.add(face);
    registered.set(key, face);
  }
  return sources.map((s) => s.url);
}
const IPA_SAMPLE = "θɔːæʃʒŋəɜɪʊˈˌð";
const FONT_TIMEOUT_MS = 8e3;
function facesFor(v) {
  const faces2 = [];
  const add = (family, weights) => {
    if (!family) return;
    for (const weight of weights) {
      if (!faces2.some((f) => f.family === family && f.weight === weight)) faces2.push({ family, weight });
    }
  };
  const w = traitsOf(v).weights(v);
  if (w.serif) add(v.fonts.serif, w.serif);
  add(v.fonts.sans, w.sans);
  add(v.fonts.mono, w.mono);
  faces2.push({ family: "Gentium Book Plus", weight: 400, text: IPA_SAMPLE });
  faces2.push({ family: AYAH_FACE, weight: 400, text: ARABIC_SAMPLE }, { family: HADITH_FACE, weight: 400, text: ARABIC_SAMPLE });
  return faces2;
}
const loaded = /* @__PURE__ */ new Map();
function loadFonts(v, timeoutMs = FONT_TIMEOUT_MS) {
  const hit = loaded.get(v.id);
  if (hit) return hit;
  const p = loadFaces(facesFor(v), timeoutMs, `"${v.name}"`);
  loaded.set(v.id, p);
  p.catch(() => loaded.delete(v.id));
  return p;
}
const specOf = (f) => `${f.weight} 40px "${f.family}"`;
async function loadFaces(faces2, timeoutMs, label) {
  const pending = new Set(faces2.map(specOf));
  const all = Promise.all(faces2.map(async (f) => {
    const spec = specOf(f);
    let urls = [];
    try {
      urls = registerFace(f.family, f.weight);
      const res = await document.fonts.load(spec, f.text ?? "Aa09•—");
      if (!res.length || !document.fonts.check(spec, f.text ?? "Aa")) throw new Error("not available after loading");
    } catch (err) {
      const from = urls.length ? ` from ${urls.join(", ")}` : " (no font file: add it with configureFonts({ faces }))";
      throw new Error(`carousel-core: font ${f.weight} "${f.family}" failed to load${from}: ${err instanceof Error ? err.message : String(err)}`);
    }
    pending.delete(spec);
  })).then(() => document.fonts.ready).then(() => void 0);
  return withTimeout(all, timeoutMs, () => `carousel-core: fonts for ${label} didn't load within ${timeoutMs / 1e3} s; still waiting for ${[...pending].map((x) => x.replace(" 40px", "")).join(", ")}`);
}
function withTimeout(p, ms, msg) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(msg())), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }, (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}
async function canvasToPng(canvas) {
  if ("convertToBlob" in canvas) return canvas.convertToBlob({ type: "image/png" });
  return new Promise((res, rej) => canvas.toBlob((b) => b ? res(b) : rej(new Error("PNG encode failed")), "image/png"));
}
async function exportSlidePng(slide, deck, variant, assets) {
  await loadFonts(variant);
  const { canvas, ctx } = makeCanvas(CANVAS.w, CANVAS.h);
  const r = renderSlide(ctx, slide, deck, variant, { ...assets, preview: false });
  return { blob: await canvasToPng(canvas), warnings: r.warnings };
}
function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
export {
  loadFonts as a,
  downloadBlob as b,
  configureFonts as c,
  deckIcons as d,
  exportSlidePng as e,
  faceAvailable as f,
  layoutSlide as l,
  makeCanvas as m,
  renderSlide as r
};
//# sourceMappingURL=exportPng-JWI_EmEW.js.map
