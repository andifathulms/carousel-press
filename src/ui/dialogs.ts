import { type Warning, isHard } from '../core/types';
import { h, svg } from './dom';
import { UI_ICONS } from './uiIcons';

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export interface ModalHandle {
  close(): void;
  body: HTMLElement;
  footer: HTMLElement;
}

/** A modal with a focus trap; Escape and the × button close it. */
export function openModal(title: string, opts: { wide?: boolean; onClose?: () => void } = {}): ModalHandle {
  const prevFocus = document.activeElement as HTMLElement | null;
  const titleId = `dlg-${Math.random().toString(36).slice(2)}`;
  const body = h('div', { class: 'modal-body' });
  const footer = h('div', { class: 'modal-footer' });
  const closeBtn = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Close' }, svg(UI_ICONS.close));
  const dialog = h('div', { class: `modal${opts.wide ? ' wide' : ''}`, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId },
    h('div', { class: 'modal-head' }, h('h2', { id: titleId }, title), closeBtn), body, footer);
  const backdrop = h('div', { class: 'modal-backdrop' }, dialog);
  let closed = false;

  const close = (): void => {
    if (closed) return;
    closed = true;
    backdrop.remove();
    document.removeEventListener('keydown', onKey, true);
    opts.onClose?.();
    prevFocus?.focus?.();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const f = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0]!;
    const last = f[f.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  };
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('mousedown', (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener('keydown', onKey, true);
  document.body.append(backdrop);
  requestAnimationFrame(() => (dialog.querySelector<HTMLElement>('[data-autofocus]') ?? dialog.querySelector<HTMLElement>(FOCUSABLE))?.focus());
  return { close, body, footer };
}

export function confirmDialog(title: string, message: string, ok = 'OK', danger = false): Promise<boolean> {
  return new Promise((resolve) => {
    let result = false;
    const m = openModal(title, { onClose: () => resolve(result) });
    m.body.append(h('p', {}, message));
    const yes = h('button', { type: 'button', class: danger ? 'btn danger' : 'btn primary', 'data-autofocus': true }, ok);
    const no = h('button', { type: 'button', class: 'btn' }, 'Cancel');
    yes.addEventListener('click', () => { result = true; m.close(); });
    no.addEventListener('click', () => m.close());
    m.footer.append(no, yes);
  });
}

export function promptDialog(title: string, label: string, value: string): Promise<string | null> {
  return new Promise((resolve) => {
    let result: string | null = null;
    const m = openModal(title, { onClose: () => resolve(result) });
    const input = h('input', { class: 'input', type: 'text', value, 'data-autofocus': true, 'aria-label': label });
    const form = h('form', {}, h('label', { class: 'label' }, label), input);
    const ok = h('button', { type: 'submit', class: 'btn primary' }, 'Save');
    const cancel = h('button', { type: 'button', class: 'btn' }, 'Cancel');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      result = input.value.trim();
      m.close();
    });
    ok.addEventListener('click', () => form.requestSubmit());
    cancel.addEventListener('click', () => m.close());
    m.body.append(form);
    m.footer.append(cancel, ok);
    requestAnimationFrame(() => input.select());
  });
}

const REASON: Partial<Record<Warning['code'], string>> = {
  overflow: "text doesn't fit",
  'code-line-too-long': 'a code line is too long',
  'internal-error': 'the parser hit an error (please report it)',
  'arabic-too-long': 'the Arabic text is too long for one slide',
  'arabic-font-missing': "the Arabic font didn't load",
};

/** DESIGN §8.4: list blocking warnings; Fix jumps to the first one. */
export function exportWarningsDialog(warnings: Warning[], onJump: (w: Warning) => void): Promise<'fix' | 'anyway' | 'cancel'> {
  return new Promise((resolve) => {
    let result: 'fix' | 'anyway' | 'cancel' = 'cancel';
    const m = openModal('Some slides need attention', { onClose: () => resolve(result) });
    const list = h('ul', { class: 'attention-list' });
    for (const w of warnings) {
      const b = h('button', { type: 'button', class: 'link' }, `Slide ${(w.slideIndex ?? 0) + 1} — ${REASON[w.code] ?? w.message}`);
      b.addEventListener('click', () => { onJump(w); result = 'fix'; m.close(); });
      list.append(h('li', {}, b));
    }
    m.body.append(list);
    const fix = h('button', { type: 'button', class: 'btn primary', 'data-autofocus': true }, 'Fix');
    fix.addEventListener('click', () => {
      if (warnings[0]) onJump(warnings[0]);
      result = 'fix';
      m.close();
    });
    // Arabic text is never exported clipped, incomplete or in a fallback font (SPEC-ayah §5): no override.
    if (warnings.some(isHard)) {
      m.body.append(h('p', {}, 'Ayah and hadith slides must be complete and fully visible before they can be exported.'));
      m.footer.append(fix);
      return;
    }
    const anyway = h('button', { type: 'button', class: 'btn' }, 'Export anyway');
    anyway.addEventListener('click', () => { result = 'anyway'; m.close(); });
    m.footer.append(anyway, fix);
  });
}

/** Small non-blocking toast. */
export function toast(message: string, kind: 'info' | 'error' = 'info'): void {
  let host = document.querySelector<HTMLElement>('.toasts');
  if (!host) {
    host = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' });
    document.body.append(host);
  }
  const t = h('div', { class: `toast ${kind}` }, message);
  host.append(t);
  setTimeout(() => t.remove(), kind === 'error' ? 6000 : 3000);
}
