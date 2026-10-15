import { h, svg } from './dom';

export type MenuItem = { label: string; icon?: string; danger?: boolean; onSelect: () => unknown } | 'sep';

let closeOpen: (() => void) | null = null;

/** A popover menu at a point or under an element. Escape, an outside tap or a choice closes it. */
export function openMenu(at: HTMLElement | { x: number; y: number }, items: MenuItem[], label = 'Actions'): void {
  closeOpen?.();
  const prevFocus = document.activeElement as HTMLElement | null;
  const buttons: HTMLButtonElement[] = [];
  const menu = h('div', { class: 'menu', role: 'menu', 'aria-label': label });
  for (const it of items) {
    if (it === 'sep') {
      menu.append(h('hr', { class: 'menu-sep' }));
      continue;
    }
    const b = h('button', { type: 'button', role: 'menuitem', class: `menu-row${it.danger ? ' danger' : ''}` },
      it.icon ? svg(it.icon) : null, h('span', {}, it.label));
    b.addEventListener('click', () => {
      close();
      void it.onSelect();
    });
    buttons.push(b);
    menu.append(b);
  }
  document.body.append(menu);

  // Place it, then keep it inside the viewport.
  const r = at instanceof HTMLElement ? at.getBoundingClientRect() : { left: at.x, bottom: at.y, top: at.y };
  const m = menu.getBoundingClientRect();
  const pad = 8;
  let x = Math.min(r.left, window.innerWidth - m.width - pad);
  let y = r.bottom + 4;
  if (y + m.height > window.innerHeight - pad) y = Math.max(pad, r.top - m.height - 4);
  x = Math.max(pad, x);
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;

  const onDown = (e: PointerEvent): void => {
    if (!menu.contains(e.target as Node)) close();
  };
  const onKey = (e: KeyboardEvent): void => {
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'Escape') { close(); prevFocus?.focus?.(); }
    else if (e.key === 'ArrowDown') buttons[(i + 1) % buttons.length]?.focus();
    else if (e.key === 'ArrowUp') buttons[(i - 1 + buttons.length) % buttons.length]?.focus();
    else return;
    e.preventDefault();
  };
  function close(): void {
    menu.remove();
    document.removeEventListener('pointerdown', onDown, true);
    document.removeEventListener('keydown', onKey, true);
    closeOpen = null;
  }
  closeOpen = close;
  setTimeout(() => document.addEventListener('pointerdown', onDown, true), 0);
  document.addEventListener('keydown', onKey, true);
  buttons[0]?.focus({ preventScroll: true });
}

/**
 * Long-press (touch/pen, 450 ms) or right-click opens a menu; a plain tap still clicks.
 * The click that follows a long-press is swallowed.
 */
export function onLongPress(el: HTMLElement, open: (at: { x: number; y: number }) => void): void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let start = { x: 0, y: 0 };
  let fired = false;
  const cancel = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  el.addEventListener('pointerdown', (e) => {
    fired = false;
    if (e.pointerType === 'mouse') return;
    start = { x: e.clientX, y: e.clientY };
    timer = setTimeout(() => {
      fired = true;
      open(start);
    }, 450);
  });
  el.addEventListener('pointermove', (e) => {
    if (timer && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10) cancel();
  });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) el.addEventListener(ev, cancel);
  el.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    // After a touch long-press the menu is already open; a right-click opens it here.
    if (!fired) open({ x: e.clientX, y: e.clientY });
  });
  el.addEventListener('click', (e) => {
    if (!fired) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    fired = false;
  }, true);
}
