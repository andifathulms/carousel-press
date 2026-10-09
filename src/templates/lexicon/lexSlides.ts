// word / compare layouts (SPEC-lexicon §4.1, §4.3). Pure given a measurer.
import { parseRich } from '../../core/inline';
import { uncoveredIpa } from '../../core/lexicon';
import { t } from '../../core/strings';
import type { Warning } from '../../core/types';
import type { FontSpec, TextMeasurer } from '../../layout/measure';
import type { TextStyle } from '../../layout/wrap';
import { CONTENT_W, ROWS, SAFE } from '../../render/safezone';
import type { LexTokens, Surface, Variant } from '../types';
import { IPA_FACE, type LexEl, type LexLayout, SizeSet, plainRich, trackedW, wrapBlock } from './lexLayout';

export interface LexCtx {
  v: Variant;
  s: Surface;
  tok: LexTokens;
  m: TextMeasurer;
  lang: 'id' | 'en';
  serif: string;
  sans: string;
  slideIndex: number;
  line: number;
  warnings: Warning[];
}

/** Word slide type scale and gaps (SPEC-lexicon §4.1). */
export const WORD = {
  top: ROWS.stackTopCard,
  pill: { size: 26, weight: 600, tracking: 2, padX: 22, padY: 12, border: 2, gap: 28 },
  head: { max: 168, min: 96, step: 8, lh: 1.0, maxLines: 2, gap: 20 },
  tag: { size: 24, weight: 600, padX: 16, padY: 8, radius: 10, gap: 20 },
  ipa: { max: 46, min: 34, step: 2, lh: 1.3, gap: 10 },
  say: { max: 32, min: 28, step: 2, lh: 1.3, gap: 40 },
  label: { size: 22, weight: 600, tracking: 2, gap: 12 },
  divider: { h: 2, gap: 40 },
  meaning: { max: 46, min: 34, step: 2, lh: 1.35, maxLines: 4, gap: 40 },
  example: { max: 42, min: 32, step: 2, lh: 1.35, maxLines: 4, bar: 6, indent: 28, gap: 40 },
  translation: { max: 32, min: 28, step: 2, lh: 1.35, maxLines: 2, gap: 12 },
  origin: { max: 36, min: 30, step: 2, lh: 1.35, gap: 32 },
  note: { max: 30, min: 30, step: 2, lh: 1.4, maxLines: 2 },
  priority: ['note', 'translation', 'say', 'example', 'meaning', 'ipa', 'head'],
};

/** Compare slide (SPEC-lexicon §4.3). */
export const COMPARE = {
  top: ROWS.stackTopCard,
  headline: { max: 72, min: 56, step: 4, lh: 1.12, maxLines: 2, gap: 40 },
  box: { pad: 32, radius: 24, icon: 44, iconGap: 16, gapBetween: 28, rowGap: 16 },
  label: { size: 26, weight: 600, tracking: 2 },
  text: { max: 52, min: 36, step: 4, lh: 1.25, maxLines: 3 },
  why: { max: 38, min: 30, step: 2, lh: 1.5, maxLines: 4, gap: 48 },
  strike: 3,
  priority: ['why', 'text', 'headline'],
};

const style = (family: string, weight: number, size: number, mono: string): TextStyle => ({
  font: { family, weight, size }, mono: { family: mono, weight: 400 },
});

function label(c: LexCtx, text: string, x: number, y: number, color: string): LexEl {
  const L = WORD.label;
  return { k: 'label', x, y, text: text.toUpperCase(), font: { family: c.sans, weight: L.weight, size: L.size }, color, tracking: L.tracking };
}

const labelH = WORD.label.size * 1.3;

/** Word slide: pos pill, headword (+tag), ipa, say, divider, meaning, example, origin, note. */
export function layoutWord(c: LexCtx, f: Record<string, string>): LexLayout {
  const W = WORD;
  const sizes = new SizeSet({ head: W.head, ipa: W.ipa, say: W.say, meaning: W.meaning, example: W.example, translation: W.translation, origin: W.origin, note: W.note });
  const mono = c.v.fonts.mono;
  const x = SAFE.left;
  const missing = f.ipa ? uncoveredIpa(f.ipa) : [];
  if (missing.length) {
    c.warnings.push({ code: 'ipa-glyph-missing', slideIndex: c.slideIndex, line: c.line, message: `IPA font can't draw: ${missing.join(' ')}` });
  }

  const build = (): { els: LexEl[]; bottom: number; over: string | null } => {
    const els: LexEl[] = [];
    let y = W.top;
    let over: string | null = null;
    let first = true;
    const gap = (g: number): void => {
      if (!first) y += g;
      first = false;
    };
    if (f.pos) {
      const p = W.pill;
      const font: FontSpec = { family: c.sans, weight: p.weight, size: p.size };
      const text = f.pos.toUpperCase();
      const w = Math.min(CONTENT_W, trackedW(text, font, p.tracking, c.m) + p.padX * 2);
      els.push({ k: 'pill', x, y, w, h: p.size + p.padY * 2, text, font, color: c.s.accent, tracking: p.tracking, padX: p.padX });
      y += p.size + p.padY * 2;
      first = false;
    }
    gap(W.pill.gap);
    const hs = sizes.get('head');
    const head = wrapBlock(parseRich([f.word ?? '']), CONTENT_W, style(c.serif, 700, hs, mono), W.head.lh, c.m);
    // A headword never breaks mid-word while it can still shrink.
    if (head.lines.length > W.head.maxLines || (head.charBroken && hs > W.head.min)) over = 'head';
    els.push({ k: 'text', x, y, lines: head.lines, size: hs, lh: W.head.lh, style: style(c.serif, 700, hs, mono), color: c.s.ink, accent: c.s.accent });
    let headBottom = y + head.h;
    if (f.tag) {
      const tg = W.tag;
      const font: FontSpec = { family: c.sans, weight: tg.weight, size: tg.size };
      const bw = c.m.width(f.tag, font) + tg.padX * 2;
      const bh = tg.size + tg.padY * 2;
      const firstW = head.lines[0]?.width ?? 0;
      const baseline = y + hs * 0.92;
      if (firstW + tg.gap + bw <= CONTENT_W) {
        els.push({ k: 'badge', x: x + firstW + tg.gap, y: baseline - hs * 0.7, w: bw, h: bh, text: f.tag, font, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: tg.radius });
      } else {
        els.push({ k: 'badge', x, y: headBottom + 16, w: bw, h: bh, text: f.tag, font, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: tg.radius });
        headBottom += 16 + bh;
      }
    }
    y = headBottom;
    if (f.ipa) {
      y += W.head.gap;
      const sz = sizes.get('ipa');
      const st = style(IPA_FACE, 400, sz, mono);
      const b = wrapBlock(plainRich(f.ipa), CONTENT_W, st, W.ipa.lh, c.m);
      els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: W.ipa.lh, style: st, color: c.s.body, accent: c.s.accent });
      y += b.h;
    }
    if (f.say) {
      y += f.ipa ? W.ipa.gap : W.head.gap;
      const sz = sizes.get('say');
      const st = style(c.sans, 400, sz, mono);
      const lab = t('labelSay', c.lang).toUpperCase();
      const lw = trackedW(lab, { family: c.sans, weight: W.label.weight, size: W.label.size }, W.label.tracking, c.m);
      const oneLine = wrapBlock(parseRich([f.say]), CONTENT_W - lw - 12, st, W.say.lh, c.m);
      if (oneLine.lines.length === 1) {
        els.push(label(c, lab, x, y + (sz * W.say.lh - labelH) / 2, c.s.muted));
        els.push({ k: 'text', x: x + lw + 12, y, lines: oneLine.lines, size: sz, lh: W.say.lh, style: st, color: c.s.muted, accent: c.s.accent });
        y += oneLine.h;
      } else {
        els.push(label(c, lab, x, y, c.s.muted));
        y += labelH + 8;
        const b = wrapBlock(parseRich([f.say]), CONTENT_W, st, W.say.lh, c.m);
        els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: W.say.lh, style: st, color: c.s.muted, accent: c.s.accent });
        y += b.h;
      }
    }
    const rest = f.meaning || f.example || f.origin || f.note;
    if (rest) {
      y += W.say.gap;
      els.push({ k: 'rect', x, y, w: CONTENT_W, h: W.divider.h, fill: c.tok.rule, radius: 0 });
      y += W.divider.h;
      first = true;
      y += W.divider.gap;
    }
    if (f.meaning) {
      gap(0);
      els.push(label(c, t('labelMeaning', c.lang), x, y, c.s.muted));
      y += labelH + W.label.gap;
      const sz = sizes.get('meaning');
      const st = style(c.sans, 500, sz, mono);
      const b = wrapBlock(parseRich([f.meaning]), CONTENT_W, st, W.meaning.lh, c.m);
      if (b.lines.length > W.meaning.maxLines) over ??= 'meaning';
      els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: W.meaning.lh, style: st, color: c.s.ink, accent: c.s.accent });
      y += b.h;
    }
    if (f.example) {
      if (f.meaning) y += W.meaning.gap;
      els.push(label(c, t('labelExample', c.lang), x, y, c.s.muted));
      y += labelH + W.label.gap;
      const E = W.example;
      const sz = sizes.get('example');
      const st = style(c.serif, 600, sz, mono);
      const tx = x + E.indent;
      const b = wrapBlock(parseRich([f.example]), CONTENT_W - E.indent, st, E.lh, c.m);
      if (b.lines.length > E.maxLines) over ??= 'example';
      const barTop = y;
      els.push({ k: 'text', x: tx, y, lines: b.lines, size: sz, lh: E.lh, style: st, color: c.s.ink, accent: c.s.accent, highlight: c.tok.highlight });
      y += b.h;
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
    return { els, bottom: y, over };
  };
  return fit(build, sizes, W.priority);
}

/** Compare slide: optional headline, wrong box, right box, why. */
export function layoutCompare(c: LexCtx, f: Record<string, string>): LexLayout {
  const C = COMPARE;
  const sizes = new SizeSet({ headline: C.headline, text: C.text, why: C.why });
  const mono = c.v.fonts.mono;
  const x = SAFE.left;
  const inner = CONTENT_W - C.box.pad * 2;

  const box = (els: LexEl[], y: number, kind: 'wrong' | 'right'): { y: number; over: boolean } => {
    const B = C.box;
    const bad = kind === 'wrong';
    const ink = bad ? c.tok.badInk : c.tok.okInk;
    const sz = sizes.get('text');
    const st = style(c.serif, 600, sz, mono);
    const b = wrapBlock(parseRich([f[kind] ?? '']), inner, st, C.text.lh, c.m);
    const h = B.pad * 2 + B.icon + B.rowGap + b.h;
    els.push({ k: 'rect', x, y, w: CONTENT_W, h, fill: bad ? c.tok.badBg : c.tok.okBg, radius: B.radius });
    els.push({ k: 'icon', name: bad ? 'x-circle' : 'check-circle', x: x + B.pad, y: y + B.pad, size: B.icon, color: ink });
    const lab = (f[`${kind}-label`] || t(bad ? 'compareWrong' : 'compareRight', c.lang)).toUpperCase();
    els.push({
      k: 'label', x: x + B.pad + B.icon + B.iconGap, y: y + B.pad + (B.icon - C.label.size * 1.3) / 2, text: lab,
      font: { family: c.sans, weight: C.label.weight, size: C.label.size }, color: ink, tracking: C.label.tracking,
    });
    els.push({
      k: 'text', x: x + B.pad, y: y + B.pad + B.icon + B.rowGap, lines: b.lines, size: sz, lh: C.text.lh, style: st,
      color: bad ? ink : ink, accent: bad ? ink : c.s.ink, highlight: bad ? undefined : c.tok.highlight, strike: bad,
    });
    return { y: y + h, over: b.lines.length > C.text.maxLines };
  };

  const build = (): { els: LexEl[]; bottom: number; over: string | null } => {
    const els: LexEl[] = [];
    let y = C.top;
    let over: string | null = null;
    if (f.headline) {
      const sz = sizes.get('headline');
      const st = style(c.serif, 700, sz, mono);
      const b = wrapBlock(parseRich([f.headline]), CONTENT_W, st, C.headline.lh, c.m);
      if (b.lines.length > C.headline.maxLines) over = 'headline';
      els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: C.headline.lh, style: st, color: c.s.ink, accent: c.s.accent });
      y += b.h + C.headline.gap;
    }
    const w = box(els, y, 'wrong');
    const r = box(els, w.y + C.box.gapBetween, 'right');
    if (w.over || r.over) over ??= 'text';
    y = r.y;
    if (f.why) {
      y += C.why.gap;
      const sz = sizes.get('why');
      const st = style(c.sans, 400, sz, mono);
      const b = wrapBlock(parseRich([f.why]), CONTENT_W, st, C.why.lh, c.m);
      if (b.lines.length > C.why.maxLines) over ??= 'why';
      els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: C.why.lh, style: st, color: c.s.body, accent: c.s.accent });
      y += b.h;
    }
    return { els, bottom: y, over };
  };
  return fit(build, sizes, C.priority);
}

/** Step sizes down (over-cap blocks first, then the priority order) until the stack fits. */
export function fit(
  build: () => { els: LexEl[]; bottom: number; over: string | null }, sizes: SizeSet, order: readonly string[],
): LexLayout {
  let r = build();
  for (let guard = 0; guard < 300 && (r.bottom > ROWS.stackLimit || r.over); guard++) {
    if (!sizes.stepDown(order, r.over ?? undefined)) break;
    r = build();
  }
  return { els: r.els, bottom: r.bottom, overflow: r.bottom > ROWS.stackLimit || !!r.over };
}

