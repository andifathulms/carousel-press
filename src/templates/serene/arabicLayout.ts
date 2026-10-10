// ayah / hadith slides in any family (SPEC-ayah §2–3). Pure given a measurer. Arabic is never clipped or split inside a word.
import { ayahMark, pipeLines } from '../../core/ayah';
import { t } from '../../core/strings';
import type { Rich, Warning } from '../../core/types';
import { withAlpha } from '../../core/color';
import type { TextMeasurer } from '../../layout/measure';
import { type Box, CONTENT_W, ROWS, SAFE } from '../../render/safezone';
import { type LayoutInput, type SlideLayout, layoutFooter, layoutHeader, resolveSurface } from '../common';
import { type LexEl, lexBoxes, plainRich, trackedW, wrapBlock } from '../lexicon/lexLayout';
import type { Surface } from '../types';

export const AYAH_FACE = 'Amiri Quran';
export const HADITH_FACE = 'Amiri';
/** Text that pulls in the Arabic subset (letters, harakat, digits, ornate parentheses). */
export const ARABIC_SAMPLE = 'بِسْمِ ٱللَّهِ ﴿١٢﴾';

/** SPEC-ayah §2–3.2. `baseline` = first baseline below the line top, in em (room for marks above). */
export const AYAH = {
  top: ROWS.stackTopCard,
  bottom: ROWS.stackLimit,
  star: { size: 56, width: 2, alpha: 0.7, gap: 48 },
  arab: { max: 76, min: 48, step: 4, lh: 2.1, baseline: 1.3, gap: 56 },
  divider: { w: 120, h: 2, alpha: 0.6, gap: 48 },
  terjemah: { weight: 500, max: 42, min: 32, step: 2, lh: 1.5, maxLines: 7, gap: 32 },
  ref: { size: 30, weight: 600, lh: 1.3, gap: 10 },
  source: { size: 24, weight: 400, lh: 1.3 },
};

export const HADITH = {
  pill: { size: 24, weight: 600, tracking: 3, padX: 22, h: 48, gap: 40 },
  arab: { max: 56, min: 40, step: 4, lh: 2.0, baseline: 1.25, gap: 40 },
  text: { weight: 500, max: 44, min: 32, step: 2, lh: 1.5, maxLines: 8, gap: 32 },
  ref: { size: 30, weight: 600, lh: 1.3, gap: 16 },
  grade: { size: 24, weight: 600, padX: 18, h: 46, radius: 23, gapX: 20, gap: 10 },
  source: { size: 24, weight: 400, lh: 1.3 },
};

const MARK_GAP = 0.3;

interface ArabicWrap {
  lines: string[];
  widths: number[];
  fits: boolean;
}

/**
 * Greedy wrap at spaces only. Words are measured whole (with their marks). The
 * end-of-ayah mark is glued to the last word so it never sits alone.
 */
export function wrapArabic(text: string, family: string, size: number, width: number, m: TextMeasurer, mark: string | null): ArabicWrap {
  const font = { family, weight: 400, size };
  const words = text.split(' ').filter((w) => w !== '');
  const space = m.width(' ', font);
  const markW = mark ? size * MARK_GAP + m.width(mark, font) : 0;
  const lines: string[] = [];
  const widths: number[] = [];
  let cur: string[] = [];
  let curW = 0;
  let fits = true;
  words.forEach((word, i) => {
    const w = m.width(word, font);
    const extra = i === words.length - 1 ? markW : 0;
    if (w + extra > width) fits = false;
    if (cur.length && curW + space + w + extra > width) {
      lines.push(cur.join(' '));
      widths.push(curW);
      cur = [];
      curW = 0;
    }
    curW += (cur.length ? space : 0) + w;
    cur.push(word);
  });
  if (cur.length) {
    lines.push(cur.join(' '));
    widths.push(curW);
  }
  return { lines, widths, fits };
}

interface Ctx {
  s: Surface;
  m: TextMeasurer;
  serif: string;
  sans: string;
  mono: string;
  lang: 'id' | 'en';
}

const sansFont = (c: Ctx, size: number, weight: number) => ({ family: c.sans, weight, size });
const style = (c: Ctx, family: string, weight: number, size: number) => ({
  font: { family, weight, size }, mono: { family: c.mono, weight: 400 },
});

interface Built {
  els: LexEl[];
  h: number;
  textOver: boolean;
  arabFits: boolean;
}

/** Ayah stack laid out from y = 0 (shifted to centre later). */
function buildAyah(c: Ctx, f: Record<string, string>, arabSize: number, tSize: number, withSource: boolean, withText: boolean): Built {
  const A = AYAH;
  const els: LexEl[] = [];
  const x = SAFE.left;
  let y = 0;
  els.push({ k: 'star', cx: x + CONTENT_W / 2, cy: y + A.star.size / 2, size: A.star.size, color: withAlpha(c.s.accent, A.star.alpha), width: A.star.width });
  y += A.star.size + A.star.gap;

  const mark = ayahMark(f);
  const wrap = wrapArabic(f.arab ?? '', AYAH_FACE, arabSize, CONTENT_W, c.m, mark);
  els.push({
    k: 'arabic', x, y, w: CONTENT_W, lines: wrap.lines, widths: wrap.widths, size: arabSize, lh: A.arab.lh, baseline: A.arab.baseline,
    family: AYAH_FACE, color: c.s.ink, align: 'center',
    mark: mark ? { text: mark, w: c.m.width(mark, { family: AYAH_FACE, weight: 400, size: arabSize }), gap: arabSize * MARK_GAP, color: c.s.accent } : null,
  });
  y += wrap.lines.length * arabSize * A.arab.lh + A.arab.gap;

  els.push({ k: 'rect', x: x + (CONTENT_W - A.divider.w) / 2, y, w: A.divider.w, h: A.divider.h, fill: withAlpha(c.s.accent, A.divider.alpha), radius: 0 });
  y += A.divider.h + A.divider.gap;

  let textOver = false;
  if (withText) {
    const tStyle = style(c, c.serif, A.terjemah.weight, tSize);
    const tw = wrapBlock(withBody(f.terjemah), CONTENT_W, tStyle, A.terjemah.lh, c.m);
    textOver = tw.lines.length > A.terjemah.maxLines;
    els.push({ k: 'text', x, y, lines: tw.lines, size: tSize, lh: A.terjemah.lh, style: tStyle, color: c.s.body, accent: c.s.accent, centerW: CONTENT_W });
    y += tw.h + A.terjemah.gap;
  }

  const refText = f.portion === 'true' ? `${f.ref ?? ''} ${t('portion', c.lang)}` : (f.ref ?? '');
  const refStyle = style(c, c.sans, A.ref.weight, A.ref.size);
  const rw = wrapBlock(plainRich(refText), CONTENT_W, refStyle, A.ref.lh, c.m);
  els.push({ k: 'text', x, y, lines: rw.lines, size: A.ref.size, lh: A.ref.lh, style: refStyle, color: c.s.accent, accent: c.s.accent, centerW: CONTENT_W });
  y += rw.h;

  if (withSource && f.source) {
    y += A.ref.gap;
    const sStyle = style(c, c.sans, A.source.weight, A.source.size);
    const sw = wrapBlock(plainRich(f.source), CONTENT_W, sStyle, A.source.lh, c.m);
    els.push({ k: 'text', x, y, lines: sw.lines, size: A.source.size, lh: A.source.lh, style: sStyle, color: c.s.muted, accent: c.s.muted, centerW: CONTENT_W });
    y += sw.h;
  }
  return { els, h: y, textOver, arabFits: wrap.fits };
}

/** Hadith stack laid out from y = 0. */
function buildHadith(c: Ctx, f: Record<string, string>, arabSize: number, tSize: number, withSource: boolean, withText: boolean): Built {
  const H = HADITH;
  const els: LexEl[] = [];
  const x = SAFE.left;
  let y = 0;
  const label = t('hadithLabel', c.lang);
  const pf = sansFont(c, H.pill.size, H.pill.weight);
  els.push({ k: 'pill', x, y, w: trackedW(label, pf, H.pill.tracking, c.m) + H.pill.padX * 2, h: H.pill.h, text: label, font: pf, color: c.s.accent, tracking: H.pill.tracking, padX: H.pill.padX });
  y += H.pill.h + H.pill.gap;

  let arabFits = true;
  if (f.arab) {
    const wrap = wrapArabic(f.arab, HADITH_FACE, arabSize, CONTENT_W, c.m, null);
    arabFits = wrap.fits;
    els.push({ k: 'arabic', x, y, w: CONTENT_W, lines: wrap.lines, widths: wrap.widths, size: arabSize, lh: H.arab.lh, baseline: H.arab.baseline, family: HADITH_FACE, color: c.s.ink, align: 'right', mark: null });
    y += wrap.lines.length * arabSize * H.arab.lh + H.arab.gap;
  }

  let textOver = false;
  if (withText) {
    const tStyle = style(c, c.serif, H.text.weight, tSize);
    const tw = wrapBlock(withBody(f.text), CONTENT_W, tStyle, H.text.lh, c.m);
    textOver = tw.lines.length > H.text.maxLines;
    els.push({ k: 'text', x, y, lines: tw.lines, size: tSize, lh: H.text.lh, style: tStyle, color: c.s.ink, accent: c.s.accent });
    y += tw.h + H.text.gap;
  }

  const refStyle = style(c, c.sans, H.ref.weight, H.ref.size);
  const rw = wrapBlock(plainRich(f.ref ?? ''), CONTENT_W, refStyle, H.ref.lh, c.m);
  els.push({ k: 'text', x, y, lines: rw.lines, size: H.ref.size, lh: H.ref.lh, style: refStyle, color: c.s.accent, accent: c.s.accent });
  const lastW = rw.lines.at(-1)?.width ?? 0;
  const g = H.grade;
  const gradeText = `${t('gradeLabel', c.lang)}: ${f.grade ?? ''}`;
  const gf = sansFont(c, g.size, g.weight);
  const gw = c.m.width(gradeText, gf) + g.padX * 2;
  const refH = rw.h;
  if (lastW + g.gapX + gw <= CONTENT_W) {
    // Same row as the last ref line, vertically centred on it.
    const lineTop = y + refH - H.ref.size * H.ref.lh;
    els.push({ k: 'badge', x: x + lastW + g.gapX, y: lineTop + (H.ref.size * H.ref.lh - g.h) / 2, w: gw, h: g.h, text: gradeText, font: gf, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: g.radius });
    y += refH;
  } else {
    y += refH + H.ref.gap;
    els.push({ k: 'badge', x, y, w: Math.min(gw, CONTENT_W), h: g.h, text: gradeText, font: gf, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: g.radius });
    y += g.h;
  }

  if (withSource && f.source) {
    y += g.gap;
    const sStyle = style(c, c.sans, H.source.weight, H.source.size);
    const sw = wrapBlock(plainRich(f.source), CONTENT_W, sStyle, H.source.lh, c.m);
    els.push({ k: 'text', x, y, lines: sw.lines, size: H.source.size, lh: H.source.lh, style: sStyle, color: c.s.muted, accent: c.s.muted });
    y += sw.h;
  }
  return { els, h: y, textOver, arabFits };
}

function withBody(src: string | undefined): Rich {
  return src ? pipeLines(src) : [];
}

/** Shift every element down by `dy`. */
function shift(els: LexEl[], dy: number): void {
  for (const e of els) {
    if (e.k === 'star') e.cy += dy;
    else if ('y' in e) e.y += dy;
  }
}

export function layoutArabicSlide(input: LayoutInput): SlideLayout {
  const { slide, deck, variant: v, measurer: m } = input;
  const warnings: Warning[] = [];
  const boxes: Box[] = [];
  const { surface, name, onPhoto } = resolveSurface(v, slide, input.hasPhoto, warnings);
  const c: Ctx = { s: surface, m, serif: v.fonts.serif ?? v.fonts.sans, sans: v.fonts.sans, mono: v.fonts.mono, lang: deck.lang };
  const isAyah = slide.type === 'ayah';
  const f = slide.fields;
  const spec = isAyah ? { arab: AYAH.arab, text: AYAH.terjemah } : { arab: HADITH.arab, text: HADITH.text };
  const build = isAyah ? buildAyah : buildHadith;
  const avail = AYAH.bottom - AYAH.top;
  const warn = (code: Warning['code'], message: string): void => {
    warnings.push({ code, slideIndex: slide.index, line: slide.lines[0], message });
  };

  const face = isAyah ? AYAH_FACE : HADITH_FACE;
  if (f.arab && m.hasFace && !m.hasFace(face, ARABIC_SAMPLE)) warn('arabic-font-missing', `The ${face} font isn't loaded; export is blocked`);

  // Step-down order (SPEC-ayah §3.1): drop source → translation size → Arabic size (last, never below min).
  let withSource = true;
  let tSize = spec.text.max;
  let aSize = spec.arab.max;
  const ok = (b: Built): boolean => b.h <= avail && !b.textOver && b.arabFits;
  let b = build(c, f, aSize, tSize, withSource, true);
  while (!ok(b)) {
    if (withSource && f.source) withSource = false;
    else if (tSize > spec.text.min) tSize = Math.max(spec.text.min, tSize - spec.text.step);
    else if (aSize > spec.arab.min) aSize = Math.max(spec.arab.min, aSize - spec.arab.step);
    else break;
    b = build(c, f, aSize, tSize, withSource, true);
  }
  const overflow = !ok(b);
  if (overflow) {
    // Does the Arabic fit without the translation? If not, the Arabic itself is too long.
    const bare = build(c, f, spec.arab.min, spec.text.min, false, false);
    if (!bare.arabFits || bare.h > avail) warn('arabic-too-long', 'Ayat terlalu panjang untuk satu slide. Gunakan penggalan atau pecah di tanda waqaf.');
    else warn('overflow', `Slide ${slide.index + 1}: text doesn't fit`);
  }
  // Centre the stack vertically in the content area (calm, SPEC-ayah §4); top-anchored when it overflows.
  const top = overflow ? AYAH.top : AYAH.top + Math.max(0, Math.round((avail - b.h) / 2));
  shift(b.els, top);

  const header = layoutHeader(input, c.sans, c.mono, boxes);
  const footer = layoutFooter(input, c.sans, c.mono, boxes, v.family !== 'dev');
  boxes.push(...lexBoxes(b.els));
  return {
    slide, deck, variant: v, surface, surfaceName: name, onPhoto,
    stack: { placed: [], bottom: top + b.h, overflow, codeTooLong: false, charBroken: false, droppedIcon: false },
    icon: null, ctaLabel: null, header, footer, boxes, warnings,
    lex: { els: b.els, bottom: top + b.h, overflow },
  };
}
