import type { Rich } from '../core/types';
import type { TextMeasurer } from './measure';
import { type WrapResult, textHeight, wrapRich } from './wrap';
import { type CodeLineSrc, fitCodeWidth } from './codeFit';

export type TextRole = 'headline' | 'subtitle' | 'body' | 'note' | 'quote';

export interface TextSpec {
  family: string;
  weight: number;
  max: number;
  min: number;
  step: number;
  lh: number;
  maxLines: number;
  widowFix?: boolean;
  mono: { family: string; weight: number };
}

export interface CodeSpec {
  family: string;
  weight: number;
  max: number;
  min: number;
  step: number;
  lh: number;
  maxLines: number;
  /** Panel chrome: horizontal padding (each side), top/bottom padding, title bar height. */
  padX: number;
  padTop: number;
  padBottom: number;
  titleBar: number;
}

export type FixedKind = 'badge' | 'number' | 'icon' | 'cta' | 'kicker' | 'attribution';

export type StackItem =
  | { kind: 'text'; role: TextRole; rich: Rich; spec: TextSpec; gap: number }
  | { kind: 'code'; lines: CodeLineSrc[]; lang: string; spec: CodeSpec; gap: number }
  | { kind: FixedKind; h: number; w: number; gap: number };

export interface Placed {
  item: StackItem;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Chosen font size (text/code). */
  size: number;
  wrap?: WrapResult;
  /** Code: widest line fits the panel at `size`. */
  codeFits?: boolean;
}

export interface StackResult {
  placed: Placed[];
  bottom: number;
  overflow: boolean;
  codeTooLong: boolean;
  charBroken: boolean;
  droppedIcon: boolean;
}

export interface StackFrame {
  x: number;
  width: number;
  top: number;
  limit: number;
}

/** Step-down priority (DESIGN §3.3): body → note → code → subtitle → headline. */
const PRIORITY: readonly string[] = ['body', 'note', 'code', 'subtitle', 'headline'];

function priorityKey(item: StackItem): string | null {
  if (item.kind === 'code') return 'code';
  if (item.kind === 'text') return item.role === 'quote' ? 'headline' : item.role;
  return null;
}

interface Measured {
  h: number;
  w: number;
  wrap?: WrapResult;
  tooManyLines: boolean;
  codeFits?: boolean;
}

/** Stack-fit algorithm shared by both families. Pure given a measurer. */
export function fitStack(items: readonly StackItem[], frame: StackFrame, m: TextMeasurer): StackResult {
  let list = items.slice();
  // Code width fit caps the code's starting size.
  const codeCap = new Map<StackItem, { size: number; fits: boolean }>();
  for (const it of list) {
    if (it.kind !== 'code') continue;
    const inner = frame.width - it.spec.padX * 2;
    const fit = fitCodeWidth(it.lines, inner, it.spec.family, it.spec.weight, it.spec, m);
    codeCap.set(it, fit);
  }

  const sizes = new Map<StackItem, number>();
  for (const it of list) {
    if (it.kind === 'text') sizes.set(it, it.spec.max);
    else if (it.kind === 'code') sizes.set(it, codeCap.get(it)!.size);
  }

  const measure = (it: StackItem): Measured => {
    if (it.kind === 'text') {
      const size = sizes.get(it)!;
      const wrap = wrapRich(it.rich, frame.width, {
        font: { family: it.spec.family, weight: it.spec.weight, size }, mono: it.spec.mono,
      }, m, { widowFix: it.spec.widowFix });
      const w = wrap.lines.reduce((a, l) => Math.max(a, l.width), 0);
      return { h: textHeight(wrap.lines, size, it.spec.lh), w, wrap, tooManyLines: wrap.lines.length > it.spec.maxLines };
    }
    if (it.kind === 'code') {
      const size = sizes.get(it)!;
      const h = it.spec.titleBar + it.spec.padTop + it.spec.padBottom + it.lines.length * size * it.spec.lh;
      const fits = codeCap.get(it)!.fits && size <= codeCap.get(it)!.size;
      return { h, w: frame.width, tooManyLines: it.lines.length > it.spec.maxLines, codeFits: fits };
    }
    return { h: it.h, w: it.w, tooManyLines: false };
  };

  const layoutAll = (): { ms: Measured[]; bottom: number } => {
    const ms = list.map(measure);
    let y = frame.top;
    ms.forEach((mm, i) => {
      if (i > 0) y += list[i]!.gap;
      y += mm.h;
    });
    return { ms, bottom: y };
  };

  const canStep = (it: StackItem): boolean =>
    (it.kind === 'text' || it.kind === 'code') && sizes.get(it)! > it.spec.min;
  const step = (it: StackItem): void => {
    if (it.kind !== 'text' && it.kind !== 'code') return;
    sizes.set(it, Math.max(it.spec.min, sizes.get(it)! - it.spec.step));
  };

  let droppedIcon = false;
  let cursor = 0;
  let res = layoutAll();
  for (let guard = 0; guard < 500; guard++) {
    const tooMany = res.ms.some((mm) => mm.tooManyLines);
    if (res.bottom <= frame.limit && !tooMany) break;

    if (!droppedIcon && list.some((it) => it.kind === 'icon')) {
      list = list.filter((it) => it.kind !== 'icon');
      droppedIcon = true;
      res = layoutAll();
      continue;
    }

    // Blocks over their line cap step first (fitting height can't fix them).
    const capped = list.find((it, i) => res.ms[i]!.tooManyLines && canStep(it) && it.kind === 'text');
    if (capped) {
      step(capped);
      res = layoutAll();
      continue;
    }

    let stepped = false;
    for (let k = 0; k < PRIORITY.length && !stepped; k++) {
      const key = PRIORITY[(cursor + k) % PRIORITY.length]!;
      const group = list.filter((it) => priorityKey(it) === key && canStep(it));
      if (group.length) {
        group.forEach(step);
        cursor = (cursor + k + 1) % PRIORITY.length;
        stepped = true;
      }
    }
    if (!stepped) break;
    res = layoutAll();
  }

  const placed: Placed[] = [];
  let y = frame.top;
  res.ms.forEach((mm, i) => {
    const it = list[i]!;
    if (i > 0) y += it.gap;
    placed.push({
      item: it, x: frame.x, y, w: mm.w, h: mm.h,
      size: it.kind === 'text' || it.kind === 'code' ? sizes.get(it)! : 0,
      wrap: mm.wrap, codeFits: mm.codeFits,
    });
    y += mm.h;
  });

  const tooMany = res.ms.some((mm) => mm.tooManyLines);
  const codeTooLong = [...codeCap.values()].some((c) => !c.fits);
  return {
    placed,
    bottom: y,
    overflow: res.bottom > frame.limit || tooMany,
    codeTooLong,
    charBroken: res.ms.some((mm) => mm.wrap?.charBroken),
    droppedIcon,
  };
}
