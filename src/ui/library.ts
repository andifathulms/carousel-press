import { SAMPLES } from '../samples';
import type { DeckIndexEntry } from '../store/deckStore';
import {
  cleanUnusedPhotos, deleteDeck, duplicateDeck, loadSample, newBlankDeck, openDeck, openDeckFile, renameDeck, saveDeckFile,
} from './actions';
import type { Controller } from './controller';
import { h, svg, timeAgo } from './dom';
import {
  type Family, type FamilyFilter, type SampleInfo, decksFromSample, familyOf, filterDecks, filterSamples, sampleInfo, variantName,
} from './libraryData';
import { UI_ICONS } from './uiIcons';

type Tab = 'decks' | 'samples';
const FAMILY_LABEL: Record<Family, string> = { editorial: 'Editorial', dev: 'Dev' };

/** Top-bar deck switcher: saved decks, deck actions, samples and deck files (PRD F10, F11, F15). */
export function mountLibrary(root: HTMLElement, c: Controller): void {
  const title = h('span', { class: 'deck-title' });
  const button = h('button', { type: 'button', class: 'deck-button', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
    h('span', { class: 'deck-label' }, 'Deck:'), title, svg(UI_ICONS.down));
  const panel = h('div', { class: 'library', hidden: true, role: 'dialog', 'aria-label': 'Deck library' });
  const fileInput = h('input', { type: 'file', accept: '.json,application/json', class: 'visually-hidden', 'aria-label': 'Open deck file' });
  root.append(button, panel, fileInput);

  // View state survives closing the popover (per page session).
  let tab: Tab | null = null;
  let family: FamilyFilter = 'all';
  let query = '';
  let samples: SampleInfo[] | null = null;
  const allSamples = (): SampleInfo[] => (samples ??= SAMPLES.map(sampleInfo));

  const close = (): void => {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', outside);
    document.removeEventListener('keydown', onKey);
  };
  const outside = (e: MouseEvent): void => {
    if (!root.contains(e.target as Node)) close();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      close();
      button.focus();
    }
  };
  const act = (fn: () => unknown) => () => {
    close();
    void fn();
  };
  const item = (label: string, fn: () => unknown, cls = ''): HTMLButtonElement =>
    h('button', { type: 'button', class: `menu-item ${cls}`, onclick: act(fn) }, label);
  const famTag = (f: Family): HTMLElement => h('span', { class: `fam-tag fam-${f}` }, FAMILY_LABEL[f]);
  const slidesText = (n: number | undefined): string | null => (n ? `${n} slides` : null);
  const meta = (...parts: (string | null)[]): string => parts.filter(Boolean).join(' · ');

  const body = h('div', { class: 'library-body' });
  const search = h('input', {
    type: 'search', class: 'input library-search', placeholder: 'Search decks and samples', 'aria-label': 'Search decks and samples',
  });
  const tabs = h('div', { class: 'lib-tabs', role: 'tablist' });
  const chips = h('div', { class: 'chips', role: 'group', 'aria-label': 'Template family' });

  const deckRow = (d: DeckIndexEntry, current: boolean): HTMLElement => {
    const thumb = d.thumb ? h('img', { src: d.thumb, alt: '' }) : h('span', { class: 'deck-thumb-empty' });
    return h('li', {}, h('button', {
      type: 'button', class: `deck-row${current ? ' current' : ''}`, 'aria-current': current ? 'true' : 'false',
      onclick: act(() => openDeck(c, d.id)),
    }, h('span', { class: 'deck-thumb' }, thumb), h('span', { class: 'deck-meta' },
      h('strong', {}, d.title || 'Untitled'),
      h('small', {}, famTag(familyOf(d.template)), meta(variantName(d.template), slidesText(d.slides), timeAgo(d.updatedAt)))),
    current ? h('span', { class: 'pill' }, 'Editing') : null));
  };

  const sampleRow = (x: SampleInfo, decks: readonly DeckIndexEntry[]): HTMLElement => {
    const mine = decksFromSample(decks, x)[0];
    return h('li', { class: 'sample-row' },
      h('button', { type: 'button', class: 'sample-open', onclick: act(() => loadSample(c, x.id)) },
        h('span', { class: 'deck-meta' }, h('strong', {}, x.name),
          h('small', {}, meta(x.variantName, `${x.slides} slides`, x.lang.toUpperCase()))),
        h('span', { class: mine ? 'pill ok' : 'pill' }, mine ? 'Open' : 'Add')),
      mine ? h('button', {
        type: 'button', class: 'menu-item small', title: 'Start another copy from the original sample',
        onclick: act(() => loadSample(c, x.id, true)),
      }, 'New copy') : null);
  };

  const empty = (text: string): HTMLElement => h('p', { class: 'hint library-empty' }, text);

  const renderBody = (): void => {
    const s = c.store.get();
    const t: Tab = tab ?? (s.decks.length ? 'decks' : 'samples');
    const decks = filterDecks(s.decks, query, family);
    const smp = filterSamples(allSamples(), query, family);
    tabs.replaceChildren(...(['decks', 'samples'] as const).map((k) => h('button', {
      type: 'button', role: 'tab', class: 'lib-tab', 'aria-selected': t === k ? 'true' : 'false',
      onclick: () => { tab = k; renderBody(); },
    }, k === 'decks' ? 'Your decks' : 'Samples', h('span', { class: 'count' }, String(k === 'decks' ? decks.length : smp.length)))));
    chips.replaceChildren(...(['all', 'editorial', 'dev'] as const).map((f) => h('button', {
      type: 'button', class: `chip${f === 'all' ? '' : ` fam-${f}`}`, 'aria-pressed': family === f ? 'true' : 'false',
      onclick: () => { family = f; renderBody(); },
    }, f === 'all' ? 'All' : FAMILY_LABEL[f])));

    if (t === 'decks') {
      if (!s.decks.length) body.replaceChildren(empty(s.storageAvailable ? 'No saved decks yet. Start from a sample.' : 'Autosave is off in this browser.'));
      else if (!decks.length) body.replaceChildren(empty('No decks match.'));
      else body.replaceChildren(h('ul', { class: 'deck-list' }, ...decks.map((d) => deckRow(d, d.id === s.deckId))));
      return;
    }
    const groups = (['editorial', 'dev'] as const).map((f) => {
      const rows = smp.filter((x) => x.family === f);
      return rows.length ? h('section', {}, h('h3', { class: 'label' }, `${FAMILY_LABEL[f]} · ${rows.length}`),
        h('ul', { class: 'deck-list' }, ...rows.map((x) => sampleRow(x, s.decks)))) : null;
    });
    body.replaceChildren(...(smp.length ? [
      h('p', { class: 'hint' }, 'Opens your copy if you already added it. Use New copy to start over.'), ...groups.filter((g): g is HTMLElement => g !== null),
    ] : [empty('No samples match.')]));
  };

  search.addEventListener('input', () => { query = search.value; renderBody(); });
  search.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    (body.querySelector('.deck-row, .sample-open') as HTMLButtonElement | null)?.click();
  });

  const render = (): void => {
    search.value = query;
    renderBody();
    panel.replaceChildren(
      h('div', { class: 'library-head' },
        h('div', { class: 'library-actions' },
          item('New deck', () => newBlankDeck(c)), item('Duplicate', () => duplicateDeck(c)),
          item('Rename', () => renameDeck(c)), item('Delete', () => deleteDeck(c), 'danger')),
        search, h('div', { class: 'library-filters' }, tabs, chips)),
      body,
      h('div', { class: 'library-foot' },
        item('Save deck file', () => saveDeckFile(c)), item('Open deck file…', () => fileInput.click()),
        item('Clean unused photos', () => cleanUnusedPhotos(c))),
    );
  };

  button.addEventListener('click', () => {
    if (!panel.hidden) return close();
    render();
    panel.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    search.focus();
    setTimeout(() => {
      document.addEventListener('mousedown', outside);
      document.addEventListener('keydown', onKey);
    }, 0);
  });
  fileInput.addEventListener('change', () => {
    const f = fileInput.files?.[0];
    if (f) void openDeckFile(c, f);
    fileInput.value = '';
  });
  c.store.watch((s) => s.parsed.deck.title, (t) => { title.textContent = t || 'Untitled'; });
}
