import { deleteDeck, duplicateDeck, renameDeck, replaceWithSample, saveDeckFile } from './actions';
import type { Controller } from './controller';
import { h, svg } from './dom';
import { postStatus } from './libraryData';
import { type MenuItem, openMenu } from './menu';
import { deckOrigin } from './sampleIndex';
import { UI_ICONS } from './uiIcons';

/** The deck's name in the Studio top bar; tapping it opens the deck's actions. */
export function mountDeckMenu(root: HTMLElement, c: Controller): void {
  const title = h('span', { class: 'deck-title' });
  const sub = h('span', { class: 'deck-sub' });
  const button = h('button', { type: 'button', class: 'deck-button', 'aria-haspopup': 'menu', 'aria-label': 'Deck actions' },
    h('span', { class: 'deck-name' }, h('span', { class: 'deck-title-row' }, title, svg(UI_ICONS.down)), sub));
  root.append(button);

  button.addEventListener('click', () => {
    const s = c.store.get();
    const { key, sample } = deckOrigin(s.decks, s.deckId);
    const st = postStatus(s.marks, key);
    const items: MenuItem[] = [
      { label: 'Rename', icon: UI_ICONS.pen, onSelect: () => renameDeck(c) },
      { label: 'Duplicate', icon: UI_ICONS.copy, onSelect: () => duplicateDeck(c) },
      { label: 'Save deck file', icon: UI_ICONS.download, onSelect: () => saveDeckFile(c) },
      ...(sample ? [{ label: 'Replace with latest sample', icon: UI_ICONS.upload, onSelect: () => replaceWithSample(c, sample.id) }] : []),
      'sep',
      ...(st !== 'posted' ? [{ label: 'Mark as posted', icon: UI_ICONS.check, onSelect: () => c.setMark(key, 'posted') }] : []),
      ...(st !== 'skip' ? [{ label: 'Mark as skipped', icon: UI_ICONS.close, onSelect: () => c.setMark(key, 'skip') }] : []),
      ...(st !== 'todo' ? [{ label: 'Back to to-post', icon: UI_ICONS.back, onSelect: () => c.setMark(key, null) }] : []),
      'sep',
      { label: 'Delete deck', icon: UI_ICONS.trash, danger: true, onSelect: () => deleteDeck(c) },
    ];
    openMenu(button, items, 'Deck actions');
  });

  c.store.subscribe((s, p) => {
    if (s.parsed === p.parsed && s.variant === p.variant) return;
    const n = s.parsed.deck.slides.length;
    title.textContent = s.parsed.deck.title || 'Untitled';
    sub.textContent = `${s.variant.name} · ${n} slide${n === 1 ? '' : 's'}`;
  });
}
