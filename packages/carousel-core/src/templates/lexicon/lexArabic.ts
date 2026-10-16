// Word slide with an Arabic headword (SPEC-script §7.1). Pure given a measurer.
// Arabic blocks are right-aligned at SAFE.right; Latin blocks stay left-aligned at SAFE.left.
import { parseRich } from '../../core/inline';
import { t } from '../../core/strings';
import type { FontSpec } from '../../layout/measure';
import { CONTENT_W, SAFE } from '../../render/safezone';
import { IPA_FACE, type LexEl, type LexLayout, SizeSet, plainRich, trackedW, wrapBlock } from './lexLayout';
import {
  ARABIC, ARABIC_FACE, arabicHighlight, arabicMarks, checkGlyphs, latinFace, mixedSegs, scriptOverflow, wrapArabicWords,
} from './lexScript';
import { type LexCtx, WORD, fit, label, labelH, style } from './lexSlides';

export const ARAB_WORD = {
  head: { max: 180, min: 104, step: 8, maxLines: 2, gap: 16 },
  translit: { max: 46, min: 34, step: 2, lh: 1.3, gap: 10 },
  meta: { label: 22, value: { max: 40, min: 32, step: 4 }, gapX: 40, labelGap: 12, rowGap: 4, gap: 40 },
  example: { max: 48, min: 36, step: 4, maxLines: 3, bar: 6, padRight: 28 },
  priority: ['note', 'translation', 'say', 'origin', 'meta', 'example', 'meaning', 'ipa', 'translit', 'head'],
};

export function layoutWordArabic(c: LexCtx, f: Record<string, string>): LexLayout {
  const A = ARAB_WORD;
  const W = WORD;
  const sizes = new SizeSet({
    head: A.head, translit: A.translit, ipa: W.ipa, say: W.say, meta: A.meta.value, meaning: W.meaning,
    example: A.example, translation: W.translation, origin: W.origin, note: W.note,
  });
  const mono = c.v.fonts.mono;
  const x = SAFE.left;
  const arabFont = (size: number, weight: number): FontSpec => ({ family: ARABIC_FACE, weight, size, fallback: c.sans });
  checkGlyphs(c, f.word ?? '', 'arab');
  if (f.example) checkGlyphs(c, f.example, 'arab');
  for (const k of ['root', 'pattern', 'plural'] as const) if (f[k]) checkGlyphs(c, f[k]!, 'arab');
  if (f.translit) checkGlyphs(c, f.translit, 'translit');
  const hl = f.example ? arabicHighlight(f.example) : null;
  if (hl?.split) c.warnings.push({ code: 'highlight-splits-word', slideIndex: c.slideIndex, line: c.line, message: 'A *…* marker in the Arabic example sits inside a word; drawn without the highlight' });

  /** A Latin block. Short values switch to the transliteration face when needed; paragraphs keep the template face. */
  const latin = (els: LexEl[], text: string, y: number, w: number, family: string, weight: number, key: string, lh: number, color: string, xx = x) => {
    const sz = sizes.get(key);
    const paragraph = key === 'translation' || key === 'origin' || key === 'note';
    const face = paragraph ? { family, weight, translit: false } : latinFace(text, family, weight);
    const st = style(face.family, face.weight, sz, mono);
    const b = wrapBlock(face.translit ? plainRich(text) : parseRich([text]), w, st, lh, c.m);
    els.push({ k: 'text', x: xx, y, lines: b.lines, size: sz, lh, style: st, color, accent: c.s.accent });
    return b;
  };

  const build = (): { els: LexEl[]; bottom: number; over: string | null } => {
    const els: LexEl[] = [];
    let y = W.top;
    let over: string | null = null;
    let tooLong = false;
    const atMin = (k: string, spec: { min: number }): boolean => sizes.get(k) <= spec.min;

    if (f.pos) {
      const p = W.pill;
      const font: FontSpec = { family: c.sans, weight: p.weight, size: p.size };
      const text = f.pos.toUpperCase();
      const w = Math.min(CONTENT_W, trackedW(text, font, p.tracking, c.m) + p.padX * 2);
      els.push({ k: 'pill', x, y, w, h: p.size + p.padY * 2, text, font, color: c.s.accent, tracking: p.tracking, padX: p.padX });
      y += p.size + p.padY * 2 + p.gap;
    }

    // Headword: Amiri 700, right-aligned; the tag badge sits left of it on the first line.
    const hs = sizes.get('head');
    const tg = W.tag;
    const tagFont: FontSpec = { family: c.sans, weight: tg.weight, size: tg.size };
    const tagW = f.tag ? c.m.width(f.tag, tagFont) + tg.padX * 2 : 0;
    const headW = CONTENT_W - (f.tag ? tagW + tg.gap : 0);
    const hf = arabFont(hs, 700);
    const head = wrapArabicWords(f.word ?? '', hf, headW, c.m);
    if (head.lines.length > A.head.maxLines || !head.fits) {
      over = 'head';
      if (atMin('head', A.head)) tooLong = true;
    }
    els.push({ k: 'arabic', x, y, w: CONTENT_W, lines: head.lines, widths: head.widths, size: hs, lh: ARABIC.lh, baseline: ARABIC.baseline, family: ARABIC_FACE, weight: 700, fallback: c.sans, color: c.s.ink, align: 'right', mark: null });
    if (f.tag) {
      const bh = tg.size + tg.padY * 2;
      const mid = y + hs * ARABIC.baseline - hs * 0.32;
      els.push({ k: 'badge', x, y: mid - bh / 2, w: tagW, h: bh, text: f.tag, font: tagFont, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: tg.radius });
    }
    y += head.lines.length * hs * ARABIC.lh;

    let gapNext: number = A.head.gap;
    if (f.translit) {
      y += gapNext;
      const sz = sizes.get('translit');
      const st = style(IPA_FACE, 400, sz, mono);
      const b = wrapBlock(plainRich(f.translit), CONTENT_W, st, A.translit.lh, c.m);
      els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: A.translit.lh, style: st, color: c.s.body, accent: c.s.accent });
      y += b.h;
      gapNext = A.translit.gap;
    }
    if (f.ipa) {
      y += gapNext;
      const sz = sizes.get('ipa');
      const st = style(IPA_FACE, 400, sz, mono);
      const b = wrapBlock(plainRich(f.ipa), CONTENT_W, st, W.ipa.lh, c.m);
      els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: W.ipa.lh, style: st, color: c.s.body, accent: c.s.accent });
      y += b.h;
      gapNext = W.ipa.gap;
    }
    if (f.say) {
      y += gapNext;
      const sz = sizes.get('say');
      const lab = t('labelSay', c.lang).toUpperCase();
      const lw = trackedW(lab, { family: c.sans, weight: W.label.weight, size: W.label.size }, W.label.tracking, c.m);
      els.push(label(c, lab, x, y + (sz * W.say.lh - labelH) / 2, c.s.muted));
      const b = latin(els, f.say, y, CONTENT_W - lw - 12, c.sans, 400, 'say', W.say.lh, c.s.muted, x + lw + 12);
      y += b.h;
    }

    // Root · pattern · plural: label + value pairs, one line when they fit.
    const pairs = ([['labelRoot', 'root'], ['labelPattern', 'pattern'], ['labelPlural', 'plural']] as const).filter(([, k]) => f[k]);
    if (pairs.length) {
      y += A.meta.gap - 8;
      const vs = sizes.get('meta');
      const labFont: FontSpec = { family: c.sans, weight: W.label.weight, size: A.meta.label };
      const rowH = vs * ARABIC.lh;
      const items = pairs.map(([lk, k]) => {
        const lab = t(lk, c.lang).toUpperCase();
        const lw = trackedW(lab, labFont, W.label.tracking, c.m);
        const raw = k === 'root' ? f.root!.split(/[\s\-–]+/).filter(Boolean).join(' - ') : f[k]!;
        const color = k === 'root' ? c.tok.root ?? c.s.accent : c.s.ink;
        const mix = mixedSegs(raw, vs, { latin: c.sans, latinWeight: 500, arabWeight: 400, fallback: c.sans }, { latin: c.s.body, arab: color }, c.m);
        return { lab, lw, mix, w: lw + A.meta.labelGap + mix.w };
      });
      const oneLine = items.reduce((a, it) => a + it.w, 0) + A.meta.gapX * (items.length - 1) <= CONTENT_W;
      let mx = x;
      items.forEach((it, i) => {
        if (!oneLine && i > 0) { y += rowH + A.meta.rowGap; mx = x; }
        els.push({ k: 'label', x: mx, y: y + vs * ARABIC.baseline - A.meta.label * 1.1, text: it.lab, font: labFont, color: c.s.muted, tracking: W.label.tracking });
        const vx = mx + it.lw + A.meta.labelGap;
        els.push({ k: 'mixed', x: vx, y, h: rowH, baseline: vs * ARABIC.baseline, w: it.mix.w, segs: it.mix.segs });
        if (it.w > CONTENT_W) { over ??= 'meta'; if (atMin('meta', A.meta.value)) tooLong = true; }
        mx += it.w + A.meta.gapX;
      });
      y += rowH;
    }

    const rest = f.meaning || f.example || f.origin || f.note;
    if (rest) {
      y += W.say.gap;
      els.push({ k: 'rect', x, y, w: CONTENT_W, h: W.divider.h, fill: c.tok.rule, radius: 0 });
      y += W.divider.h + W.divider.gap;
    }
    if (f.meaning) {
      els.push(label(c, t('labelMeaning', c.lang), x, y, c.s.muted));
      y += labelH + W.label.gap;
      const b = latin(els, f.meaning, y, CONTENT_W, c.sans, 500, 'meaning', W.meaning.lh, c.s.ink);
      if (b.lines.length > W.meaning.maxLines) over ??= 'meaning';
      y += b.h;
    }
    if (f.example && hl) {
      if (f.meaning) y += W.meaning.gap;
      els.push(label(c, t('labelExample', c.lang), x, y, c.s.muted));
      y += labelH + W.label.gap;
      const E = A.example;
      const es = sizes.get('example');
      const ef = arabFont(es, 400);
      const ew = CONTENT_W - E.bar - E.padRight;
      const wrap = wrapArabicWords(hl.text, ef, ew, c.m);
      if (wrap.lines.length > E.maxLines || !wrap.fits) {
        over ??= 'example';
        if (atMin('example', E)) tooLong = true;
      }
      const barTop = y;
      els.push({
        k: 'arabic', x, y, w: ew, lines: wrap.lines, widths: wrap.widths, size: es, lh: ARABIC.lh, baseline: ARABIC.baseline,
        family: ARABIC_FACE, weight: 400, fallback: c.sans, color: c.s.ink, align: 'right', mark: null,
        marks: arabicMarks(hl.text, hl.marked, wrap, ef, c.m), highlight: c.tok.highlight,
      });
      y += wrap.lines.length * es * ARABIC.lh;
      if (f.translation) {
        y += W.translation.gap;
        const tb = latin(els, f.translation, y, ew, c.sans, 400, 'translation', W.translation.lh, c.s.muted);
        if (tb.lines.length > W.translation.maxLines) over ??= 'translation';
        y += tb.h;
      }
      els.push({ k: 'rect', x: SAFE.right - E.bar, y: barTop, w: E.bar, h: y - barTop, fill: c.s.accent, radius: E.bar / 2 });
    }
    if (f.origin) {
      if (f.meaning || f.example) y += W.example.gap;
      els.push(label(c, t('labelOrigin', c.lang), x, y, c.s.muted));
      y += labelH + W.label.gap;
      y += latin(els, f.origin, y, CONTENT_W, c.sans, 500, 'origin', W.origin.lh, c.s.body).h;
    }
    if (f.note) {
      if (f.meaning || f.example || f.origin) y += W.origin.gap;
      const b = latin(els, f.note, y, CONTENT_W, c.sans, 400, 'note', W.note.lh, c.s.muted);
      if (b.lines.length > W.note.maxLines) over ??= 'note';
      y += b.h;
    }
    lastTooLong = tooLong;
    return { els, bottom: y, over };
  };
  let lastTooLong = false;
  const out = fit(build, sizes, A.priority);
  // Arabic that still doesn't fit at its minimum is never clipped: the export is blocked instead.
  if (lastTooLong) scriptOverflow(c);
  return out;
}
