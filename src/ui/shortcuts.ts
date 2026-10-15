import type { Controller } from './controller';
import { h } from './dom';

export const SHORTCUTS: readonly [string, string][] = [
  ['⌘ K', 'Search decks in the Queue'],
  ['⌘ [   ⌘ ]', 'Previous / next slide'],
  ['⌘ .', 'Focus on the slides'],
  ['⌘ ⇧ P', 'Publish'],
  ['⌘ /', 'Syntax help'],
  ['Esc', 'Leave focus mode or close'],
];
const HOLD_MS = 700;

/** Magic Keyboard shortcuts. Holding ⌘ on its own shows the list. */
export function mountShortcuts(c: Controller, actions: { help(): void }): void {
  const overlay = h('div', { class: 'kbd-overlay', role: 'dialog', 'aria-label': 'Keyboard shortcuts', hidden: true },
    h('h2', {}, 'Keyboard shortcuts'),
    h('dl', {}, ...SHORTCUTS.flatMap(([k, v]) => [h('dt', {}, h('kbd', {}, k)), h('dd', {}, v)])));
  document.body.append(overlay);
  let holdTimer: ReturnType<typeof setTimeout> | null = null;
  const hide = (): void => {
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = null;
    overlay.hidden = true;
  };

  document.addEventListener('keydown', (e) => {
    const s = c.store.get();
    if (e.key === 'Meta' && !e.repeat) {
      holdTimer = setTimeout(() => { overlay.hidden = false; }, HOLD_MS);
      return;
    }
    hide();
    if (e.key === 'Escape' && s.focus && !s.publishOpen) {
      c.store.set({ focus: false });
      return;
    }
    if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
    const k = e.key.toLowerCase();
    let handled = true;
    if (k === 'k') {
      c.store.set({ view: 'queue', focus: false, publishOpen: false });
      requestAnimationFrame(() => document.getElementById('queue-search')?.focus());
    } else if (s.view !== 'studio') handled = false;
    else if (e.key === '[' || e.key === ']') {
      // Move the editor cursor too, or the editor would select the slide under the cursor again.
      const n = s.parsed.deck.slides.length;
      c.jumpToSlide(Math.max(0, Math.min(n - 1, s.selected + (e.key === ']' ? 1 : -1))));
    }
    else if (k === '.') c.store.set({ focus: !s.focus });
    else if (k === 'p' && e.shiftKey) c.store.set({ publishOpen: true });
    else if (k === '/') actions.help();
    else handled = false;
    if (handled) e.preventDefault();
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Meta') hide();
  });
  window.addEventListener('blur', hide);
}
