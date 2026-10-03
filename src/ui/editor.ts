import { isBlocking } from '../core/types';
import { allWarnings } from './appState';
import type { Controller } from './controller';
import { debounce, h, svg } from './dom';
import { UI_ICONS } from './uiIcons';

/** Line index of a character offset. */
export function lineAt(text: string, offset: number): number {
  let n = 0;
  for (let i = 0; i < offset && i < text.length; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

/** Character offset of the start of a line. */
export function offsetOfLine(text: string, line: number): number {
  let off = 0;
  for (let n = 0; n < line; n++) {
    const i = text.indexOf('\n', off);
    if (i < 0) return text.length;
    off = i + 1;
  }
  return off;
}

export function mountEditor(root: HTMLElement, c: Controller): void {
  const ta = h('textarea', {
    class: 'editor-text', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off',
    'aria-label': 'Deck text', wrap: 'soft',
  });
  const gutter = h('div', { class: 'gutter', 'aria-hidden': 'true' });
  const mirror = h('div', { class: 'editor-mirror', 'aria-hidden': 'true' });
  const wrap = h('div', { class: 'editor-wrap' }, gutter, ta, mirror);
  const list = h('ul', { class: 'warnings', 'aria-label': 'Warnings' });
  const summary = h('button', { class: 'warn-summary', type: 'button', 'aria-expanded': 'true' });
  root.append(wrap, summary, list);

  let lineTops: number[] = [];
  let lineHeight = 22;

  const measure = (): void => {
    const cs = getComputedStyle(ta);
    lineHeight = parseFloat(cs.lineHeight) || 22;
    mirror.style.width = `${ta.clientWidth}px`;
    mirror.replaceChildren(...ta.value.split('\n').map((l) => h('div', {}, l || '​')));
    const padTop = parseFloat(cs.paddingTop) || 0;
    lineTops = [...mirror.children].map((el) => (el as HTMLElement).offsetTop + padTop);
    paintGutter();
  };
  const measureSoon = debounce(measure, 80);

  const paintGutter = (): void => {
    const s = c.store.get();
    const scroll = ta.scrollTop;
    const marks: HTMLElement[] = [];
    const slide = s.parsed.deck.slides[s.selected];
    if (slide) {
      const top = (lineTops[slide.lines[0]] ?? 0) - scroll;
      const bottom = (lineTops[slide.lines[1]] ?? top + scroll) + lineHeight - scroll;
      marks.push(h('span', { class: 'active-range', style: `top:${top}px;height:${Math.max(lineHeight, bottom - top)}px` }));
    }
    const byLine = new Map<number, boolean>();
    for (const w of allWarnings(s)) byLine.set(w.line, (byLine.get(w.line) ?? false) || isBlocking(w));
    for (const [line, blocking] of byLine) {
      const y = (lineTops[line] ?? -100) - scroll + lineHeight / 2;
      marks.push(h('span', { class: `mark${blocking ? ' blocking' : ''}`, style: `top:${y}px` }));
    }
    gutter.replaceChildren(...marks);
  };

  const paintList = (): void => {
    const ws = allWarnings(c.store.get());
    summary.hidden = ws.length === 0;
    list.hidden = ws.length === 0 || summary.getAttribute('aria-expanded') === 'false';
    summary.replaceChildren(svg(UI_ICONS.warn), ` ${ws.length} warning${ws.length === 1 ? '' : 's'}`);
    summary.classList.toggle('blocking', ws.some(isBlocking));
    list.replaceChildren(...ws.map((w) => h('li', {},
      h('button', {
        type: 'button', class: `warn-item${isBlocking(w) ? ' blocking' : ''}`,
        onclick: () => c.jumpToLine(w.line),
      }, h('span', { class: 'warn-line' }, `L${w.line + 1}`), h('span', { class: 'warn-code' }, w.code), ` ${w.message}`),
    )));
  };
  summary.addEventListener('click', () => {
    const open = summary.getAttribute('aria-expanded') !== 'false';
    summary.setAttribute('aria-expanded', String(!open));
    paintList();
  });

  const syncCursor = (): void => c.cursorAtLine(lineAt(ta.value, ta.selectionStart));
  ta.addEventListener('input', () => {
    c.setText(ta.value);
    measureSoon();
    syncCursor();
  });
  for (const ev of ['click', 'keyup', 'select']) ta.addEventListener(ev, syncCursor);
  ta.addEventListener('scroll', paintGutter, { passive: true });
  new ResizeObserver(() => measureSoon()).observe(ta);

  c.store.watch((s) => s.text, (text) => {
    if (ta.value !== text) {
      const pos = ta.selectionStart;
      ta.value = text;
      ta.setSelectionRange(Math.min(pos, text.length), Math.min(pos, text.length));
      measureSoon();
    }
  });
  c.store.watch((s) => s.parsed, () => paintList());
  c.store.watch((s) => s.renderWarnings, () => {
    paintList();
    paintGutter();
  });
  c.store.watch((s) => s.selected, () => paintGutter());
  c.store.watch((s) => s.jump, (jump) => {
    if (!jump) return;
    const off = offsetOfLine(ta.value, jump.line);
    ta.focus({ preventScroll: true });
    ta.setSelectionRange(off, off);
    measure();
    const top = lineTops[jump.line] ?? 0;
    if (top < ta.scrollTop || top > ta.scrollTop + ta.clientHeight - lineHeight * 2) {
      ta.scrollTop = Math.max(0, top - ta.clientHeight / 3);
    }
    paintGutter();
  });
}
