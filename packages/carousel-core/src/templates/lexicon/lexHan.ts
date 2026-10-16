// Word slide with a hanzi headword (SPEC-script §7.2). Pure given a measurer.
import { parseRich } from '../../core/inline';
import { hanziChars, normalizePinyin, pinyinSyllables } from '../../core/pinyin';
import { t } from '../../core/strings';
import type { FontSpec } from '../../layout/measure';
import { CONTENT_W, SAFE } from '../../render/safezone';
import { IPA_FACE, type LexEl, type LexLayout, SizeSet, plainRich, trackedW, wrapBlock } from './lexLayout';
import { HAN, HAN_SANS, HAN_SERIF, checkHanGlyphs, hanBlock, hanHighlight, pinyinSegs, tonesFor, toneColor } from './lexHanText';
import { checkGlyphs, mixedSegs, scriptOverflow } from './lexScript';
import { type LexCtx, WORD, fit, label, labelH, style, valueStyle } from './lexSlides';

export const HAN_WORD = {
  head: { max: 220, min: 140, step: 10, gap: 20, box: 1.15, boxGap: 12 },
  ruby: { scale: 0.28, lh: 1.3, gap: 8 },
  pinyin: { max: 46, min: 34, step: 2, lh: 1.3, gap: 10 },
  meta: { label: 22, value: { max: 36, min: 30, step: 2 }, gapX: 40, labelGap: 12, rowGap: 6, gap: 32 },
  example: { max: 52, min: 38, step: 2, maxLines: 3, bar: 6, indent: 28 },
  exPinyin: { max: 34, min: 28, step: 2, lh: 1.3, gap: 8 },
  priority: ['note', 'translation', 'say', 'origin', 'exPinyin', 'meta', 'example', 'meaning', 'pinyin', 'head'],
};

export function layoutWordHan(c: LexCtx, f: Record<string, string>): LexLayout {
  const H = HAN_WORD;
  const W = WORD;
  const sizes = new SizeSet({
    head: H.head, pinyin: H.pinyin, say: W.say, meta: H.meta.value, meaning: W.meaning, example: H.example,
    exPinyin: H.exPinyin, translation: W.translation, origin: W.origin, note: W.note,
  });
  const mono = c.v.fonts.mono;
  const x = SAFE.left;
  const word = f.word ?? '';
  const chars = Array.from(word);
  const nHan = hanziChars(word).length;
  const py = f.pinyin ? pinyinSyllables(f.pinyin) : null;
  const ruby = !!py && py.syllables.length === nHan && !py.invalid.length;
  if (py && py.syllables.length !== nHan) {
    c.warnings.push({ code: 'pinyin-mismatch', slideIndex: c.slideIndex, line: c.line, message: `Pinyin has ${py.syllables.length} syllables for ${nHan} hanzi; drawn as a line under the word` });
  }
  const invalid = [...(py?.invalid ?? []), ...(f['example-pinyin'] ? pinyinSyllables(f['example-pinyin']).invalid : [])];
  if (invalid.length) c.warnings.push({ code: 'pinyin-invalid', slideIndex: c.slideIndex, line: c.line, message: `Not valid pinyin: ${invalid.join(', ')}` });
  for (const k of ['pinyin', 'example-pinyin'] as const) if (f[k]) checkGlyphs(c, normalizePinyin(f[k]!), 'translit');
  checkHanGlyphs(c, word, HAN_SERIF);
  checkHanGlyphs(c, [f.example, f.measure].join(''), HAN_SANS);
  const toned = !!c.tones && !!c.tok.tones;
  const headTones = toned && ruby ? py!.syllables.map((s) => s.tone) : null;
  const ex = f.example ? hanHighlight(f.example) : null;
  const exTones = toned && ex ? tonesFor(ex.text, f['example-pinyin']) : null;
  let lastTooLong = false;

  const build = (): { els: LexEl[]; bottom: number; over: string | null } => {
    const els: LexEl[] = [];
    let y = W.top;
    let over: string | null = null;
    let tooLong = false;
    if (f.pos) {
      const p = W.pill;
      const font: FontSpec = { family: c.sans, weight: p.weight, size: p.size };
      const text = f.pos.toUpperCase();
      const w = Math.min(CONTENT_W, trackedW(text, font, p.tracking, c.m) + p.padX * 2);
      els.push({ k: 'pill', x, y, w, h: p.size + p.padY * 2, text, font, color: c.s.accent, tracking: p.tracking, padX: p.padX });
      y += p.size + p.padY * 2 + p.gap;
    }

    // Headword: each character in a practice box; ruby pinyin centred over its character.
    const hs = sizes.get('head');
    const box = Math.round(hs * H.head.box);
    const pitch = box + H.head.boxGap;
    const rowW = chars.length * box + (chars.length - 1) * H.head.boxGap;
    const tg = W.tag;
    const badgeFont: FontSpec = { family: c.sans, weight: tg.weight, size: tg.size };
    const badges = [f.tag, f.hsk ? `HSK ${f.hsk}` : ''].filter(Boolean) as string[];
    const badgeW = badges.map((b) => c.m.width(b, badgeFont) + tg.padX * 2);
    const besideW = badgeW.reduce((a, w) => a + w + tg.gap, 0);
    if (rowW > CONTENT_W) { over = 'head'; if (hs <= H.head.min) tooLong = true; }
    if (ruby) {
      const rs = Math.round(hs * H.ruby.scale);
      const font: FontSpec = { family: IPA_FACE, weight: 400, size: rs };
      let hi = 0;
      const segs = chars.map((ch, i) => {
        if (!/\p{Script=Han}/u.test(ch)) return null;
        const s = py!.syllables[hi++]!;
        const w = c.m.width(s.text, font);
        return { text: s.text, font, color: (headTones && toneColor(c.tok, s.tone)) || c.s.body, dx: i * pitch + (box - w) / 2, w, rtl: false };
      }).filter((s): s is NonNullable<typeof s> => !!s);
      els.push({ k: 'mixed', x, y, h: rs * H.ruby.lh, baseline: rs * 1.0, w: rowW, segs });
      y += rs * H.ruby.lh + H.ruby.gap;
    }
    const headTop = y;
    let hi = 0;
    chars.forEach((ch, i) => {
      els.push({ k: 'tianzige', x: x + i * pitch, y, size: box, color: c.tok.grid ?? c.tok.rule });
      const isHan = /\p{Script=Han}/u.test(ch);
      const tone = isHan && headTones ? headTones[hi] : undefined;
      if (isHan) hi++;
      els.push({
        k: 'han', x: x + i * pitch + (box - hs) / 2, y: y + (box - hs * HAN.lh) / 2, lines: [ch], widths: [hs], size: hs, lh: HAN.lh,
        baseline: HAN.baseline, family: HAN_SERIF, weight: 700, fallback: c.sans, color: (tone && toneColor(c.tok, tone)) || c.s.ink,
      });
    });
    // Tag and HSK badges right of the boxes, or below them when they don't fit.
    const beside = rowW + tg.gap + besideW <= CONTENT_W;
    let bx = beside ? x + rowW + tg.gap : x;
    const bh = tg.size + tg.padY * 2;
    const by = beside ? headTop + (box - bh) / 2 : headTop + box + 16;
    badges.forEach((b, i) => {
      els.push({ k: 'badge', x: bx, y: by, w: badgeW[i]!, h: bh, text: b, font: badgeFont, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: tg.radius });
      bx += badgeW[i]! + tg.gap;
    });
    y = headTop + box + (badges.length && !beside ? 16 + bh : 0);

    let gapNext: number = H.head.gap;
    if (f.pinyin && !ruby) {
      y += gapNext;
      const sz = sizes.get('pinyin');
      const st = style(IPA_FACE, 400, sz, mono);
      const b = wrapBlock(plainRich(normalizePinyin(f.pinyin)), CONTENT_W, st, H.pinyin.lh, c.m);
      els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: H.pinyin.lh, style: st, color: c.s.body, accent: c.s.accent });
      y += b.h;
      gapNext = H.pinyin.gap;
    }
    if (f.say) {
      y += gapNext;
      const sz = sizes.get('say');
      const lab = t('labelSay', c.lang).toUpperCase();
      const lw = trackedW(lab, { family: c.sans, weight: W.label.weight, size: W.label.size }, W.label.tracking, c.m);
      const st = valueStyle(f.say, c.sans, 400, sz, mono);
      els.push(label(c, lab, x, y + (sz * W.say.lh - labelH) / 2, c.s.muted));
      const b = wrapBlock(parseRich([f.say]), CONTENT_W - lw - 12, st, W.say.lh, c.m);
      els.push({ k: 'text', x: x + lw + 12, y, lines: b.lines, size: sz, lh: W.say.lh, style: st, color: c.s.muted, accent: c.s.accent });
      y += b.h;
    }

    // Measure word · strokes.
    const pairs = ([['labelMeasure', 'measure'], ['labelStrokes', 'strokes']] as const).filter(([, k]) => f[k]);
    if (pairs.length) {
      y += H.meta.gap;
      const vs = sizes.get('meta');
      const labFont: FontSpec = { family: c.sans, weight: W.label.weight, size: H.meta.label };
      const rowH = vs * HAN.lh;
      const items = pairs.map(([lk, k]) => {
        const lab = t(lk, c.lang).toUpperCase();
        const lw = trackedW(lab, labFont, W.label.tracking, c.m);
        const mix = mixedSegs(normalizePinyin(f[k]!), vs, { latin: c.sans, latinWeight: 500, arabWeight: 400, fallback: c.sans }, { latin: c.s.body, arab: c.s.ink }, c.m);
        return { lab, lw, mix, w: lw + H.meta.labelGap + mix.w };
      });
      const oneLine = items.reduce((a, it) => a + it.w, 0) + H.meta.gapX * (items.length - 1) <= CONTENT_W;
      let mx = x;
      items.forEach((it, i) => {
        if (!oneLine && i > 0) { y += rowH + H.meta.rowGap; mx = x; }
        els.push({ k: 'label', x: mx, y: y + vs * HAN.baseline - H.meta.label * 1.1, text: it.lab, font: labFont, color: c.s.muted, tracking: W.label.tracking });
        els.push({ k: 'mixed', x: mx + it.lw + H.meta.labelGap, y, h: rowH, baseline: vs * HAN.baseline, w: it.mix.w, segs: it.mix.segs });
        mx += it.w + H.meta.gapX;
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
      const sz = sizes.get('meaning');
      const st = valueStyle(f.meaning, c.sans, 500, sz, mono);
      const b = wrapBlock(parseRich([f.meaning]), CONTENT_W, st, W.meaning.lh, c.m);
      if (b.lines.length > W.meaning.maxLines) over ??= 'meaning';
      els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: W.meaning.lh, style: st, color: c.s.ink, accent: c.s.accent });
      y += b.h;
    }
    if (f.example && ex) {
      if (f.meaning) y += W.meaning.gap;
      els.push(label(c, t('labelExample', c.lang), x, y, c.s.muted));
      y += labelH + W.label.gap;
      const E = H.example;
      const es = sizes.get('example');
      const tx = x + E.indent;
      const blk = hanBlock(ex.text, { family: HAN_SANS, weight: 500, size: es, fallback: c.sans }, CONTENT_W - E.indent, c.m, {
        color: c.s.ink, marked: ex.marked, tones: exTones, tok: c.tok, highlight: c.tok.highlight,
      });
      if (blk.el.lines.length > E.maxLines || !blk.fits) { over ??= 'example'; if (es <= E.min) tooLong = true; }
      const barTop = y;
      els.push({ ...blk.el, x: tx, y });
      y += blk.h;
      if (f['example-pinyin']) {
        y += H.exPinyin.gap;
        const sz = sizes.get('exPinyin');
        const segs = exTones ? pinyinSegs(f['example-pinyin'], sz, c.tok, c.s.muted, c.m) : null;
        if (segs && segs.w <= CONTENT_W - E.indent) {
          els.push({ k: 'mixed', x: tx, y, h: sz * H.exPinyin.lh, baseline: sz * 1.0, w: segs.w, segs: segs.segs });
          y += sz * H.exPinyin.lh;
        } else {
          const st = style(IPA_FACE, 400, sz, mono);
          const b = wrapBlock(plainRich(normalizePinyin(f['example-pinyin'])), CONTENT_W - E.indent, st, H.exPinyin.lh, c.m);
          els.push({ k: 'text', x: tx, y, lines: b.lines, size: sz, lh: H.exPinyin.lh, style: st, color: c.s.muted, accent: c.s.accent });
          y += b.h;
        }
      }
      if (f.translation) {
        y += W.translation.gap;
        const tsz = sizes.get('translation');
        const tst = style(c.sans, 400, tsz, mono);
        const tb = wrapBlock(parseRich([f.translation]), CONTENT_W - E.indent, tst, W.translation.lh, c.m);
        if (tb.lines.length > W.translation.maxLines) over ??= 'translation';
        els.push({ k: 'text', x: tx, y, lines: tb.lines, size: tsz, lh: W.translation.lh, style: tst, color: c.s.muted, accent: c.s.accent });
        y += tb.h;
      }
      els.push({ k: 'rect', x, y: barTop, w: E.bar, h: y - barTop, fill: c.s.accent, radius: E.bar / 2 });
    }
    if (f.origin) {
      if (f.meaning || f.example) y += W.example.gap;
      els.push(label(c, t('labelOrigin', c.lang), x, y, c.s.muted));
      y += labelH + W.label.gap;
      const sz = sizes.get('origin');
      const st = style(c.sans, 500, sz, mono);
      const b = wrapBlock(parseRich([f.origin]), CONTENT_W, st, W.origin.lh, c.m);
      els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: W.origin.lh, style: st, color: c.s.body, accent: c.s.accent });
      y += b.h;
    }
    if (f.note) {
      if (f.meaning || f.example || f.origin) y += W.origin.gap;
      const sz = sizes.get('note');
      const st = style(c.sans, 400, sz, mono);
      const b = wrapBlock(parseRich([f.note]), CONTENT_W, st, W.note.lh, c.m);
      if (b.lines.length > W.note.maxLines) over ??= 'note';
      els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: W.note.lh, style: st, color: c.s.muted, accent: c.s.accent });
      y += b.h;
    }
    lastTooLong = tooLong;
    return { els, bottom: y, over };
  };
  const out = fit(build, sizes, H.priority);
  if (lastTooLong) scriptOverflow(c);
  return out;
}
