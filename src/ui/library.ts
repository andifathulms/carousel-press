import { CATEGORIES, SAMPLES, type SampleCategory } from '../samples';
import type { DeckIndexEntry } from '../store/deckStore';
import {
  cleanUnusedPhotos, deleteDeck, duplicateDeck, loadSample, newBlankDeck, openDeck, openDeckFile, renameDeck, saveDeckFile,
} from './actions';
import type { Controller } from './controller';
import { h, svg, timeAgo } from './dom';
import {
  type CategoryFilter, type PostStatus, type SampleInfo, type StatusFilter, countStatuses, deckMarkKey, deckSamples, decksFromSample,
  filterDecks, filterSamples, keepStatus, postStatus, sampleInfo, sampleMarkKey, variantName,
} from './libraryData';
import { UI_ICONS } from './uiIcons';

type Tab = 'decks' | 'samples';
const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((x) => [x.id, x.label])) as Record<SampleCategory, string>;
const STATUS_LABEL: Record<PostStatus, string> = { todo: 'To post', posted: 'Posted', skip: 'Skipped' };
const STATUSES: readonly PostStatus[] = ['todo', 'posted', 'skip'];
const shortDate = (at: number): string => new Date(at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

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
  let category: CategoryFilter = 'all';
  let status: StatusFilter = 'all';
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
  const catTag = (x: SampleCategory | undefined): HTMLElement | null =>
    x ? h('span', { class: `cat-tag cat-${x}` }, CATEGORY_LABEL[x]) : null;
  const slidesText = (n: number | undefined): string | null => (n ? `${n} slides` : null);
  const meta = (...parts: (string | null)[]): string => parts.filter(Boolean).join(' · ');

  const body = h('div', { class: 'library-body' });
  const search = h('input', {
    type: 'search', class: 'input library-search', placeholder: 'Search decks and samples', 'aria-label': 'Search decks and samples',
  });
  const tabs = h('div', { class: 'lib-tabs', role: 'tablist' });
  const chips = h('div', { class: 'chips', role: 'group', 'aria-label': 'Category' });
  const statusChips = h('div', { class: 'chips status-chips', role: 'group', 'aria-label': 'Posting status' });
  const currentStatus = h('span', { class: 'current-status' });

  /** Posting status picker; the same key is shared by a sample and the decks made from it. */
  const statusPicker = (key: string, label: string): HTMLSelectElement => {
    const now = postStatus(c.store.get().marks, key);
    return h('select', {
      class: `status-select st-${now}`, 'aria-label': `Posting status: ${label}`,
      onchange: (e: Event) => {
        const v = (e.target as HTMLSelectElement).value as PostStatus;
        c.setMark(key, v === 'todo' ? null : v);
        renderBody();
      },
    }, ...STATUSES.map((x) => h('option', { value: x, selected: x === now }, STATUS_LABEL[x])));
  };
  const markNote = (key: string): string | null => {
    const m = c.store.get().marks[key];
    return m ? `${STATUS_LABEL[m.state]} ${shortDate(m.at)}` : null;
  };

  const deckRow = (d: DeckIndexEntry, current: boolean, cat: SampleCategory | undefined, key: string): HTMLElement => {
    const thumb = d.thumb ? h('img', { src: d.thumb, alt: '' }) : h('span', { class: 'deck-thumb-empty' });
    return h('li', { class: `deck-item st-${postStatus(c.store.get().marks, key)}` }, h('button', {
      type: 'button', class: `deck-row${current ? ' current' : ''}`, 'aria-current': current ? 'true' : 'false',
      onclick: act(() => openDeck(c, d.id)),
    }, h('span', { class: 'deck-thumb' }, thumb), h('span', { class: 'deck-meta' },
      h('strong', {}, d.title || 'Untitled'),
      h('small', {}, catTag(cat), meta(variantName(d.template), slidesText(d.slides), markNote(key) ?? timeAgo(d.updatedAt)))),
    current ? h('span', { class: 'pill' }, 'Editing') : null), statusPicker(key, d.title || 'Untitled'));
  };

  const sampleRow = (x: SampleInfo, decks: readonly DeckIndexEntry[]): HTMLElement => {
    const mine = decksFromSample(decks, x)[0];
    const key = sampleMarkKey(x.id);
    return h('li', { class: `sample-row st-${postStatus(c.store.get().marks, key)}` },
      h('button', { type: 'button', class: 'sample-open', onclick: act(() => loadSample(c, x.id)) },
        h('span', { class: 'deck-meta' }, h('strong', {}, x.name),
          h('small', {}, meta(x.variantName, `${x.slides} slides`, x.lang.toUpperCase(), markNote(key)))),
        h('span', { class: mine ? 'pill ok' : 'pill' }, mine ? 'Open' : 'Add')),
      mine ? h('button', {
        type: 'button', class: 'menu-item small', title: 'Start another copy from the original sample',
        onclick: act(() => loadSample(c, x.id, true)),
      }, 'New copy') : null, statusPicker(key, x.name));
  };

  const empty = (text: string): HTMLElement => h('p', { class: 'hint library-empty' }, text);

  const renderBody = (): void => {
    const s = c.store.get();
    const t: Tab = tab ?? (s.decks.length ? 'decks' : 'samples');
    const from = deckSamples(s.decks, allSamples());
    const cats = new Map([...from].map(([id, x]) => [id, x.category]));
    const dKey = (d: DeckIndexEntry): string => deckMarkKey(d.id, from);
    const sKey = (x: SampleInfo): string => sampleMarkKey(x.id);
    const decksAll = filterDecks(s.decks, query, category, cats);
    const smpAll = filterSamples(allSamples(), query, category);
    const decks = decksAll.filter((d) => keepStatus(dKey(d), s.marks, status));
    const smp = smpAll.filter((x) => keepStatus(sKey(x), s.marks, status));
    const counts = countStatuses(t === 'decks' ? decksAll.map(dKey) : smpAll.map(sKey), s.marks);
    statusChips.replaceChildren(...(['all', ...STATUSES] as const).map((f) => h('button', {
      type: 'button', class: `chip${f === 'all' ? '' : ` st-${f}`}`, 'aria-pressed': status === f ? 'true' : 'false',
      onclick: () => { status = f; renderBody(); },
    }, f === 'all' ? 'All' : STATUS_LABEL[f], f === 'all' ? null : h('span', { class: 'count' }, String(counts[f])))));
    const cur = s.decks.find((d) => d.id === s.deckId);
    currentStatus.replaceChildren(...(cur ? [statusPicker(dKey(cur), 'this deck')] : []));
    tabs.replaceChildren(...(['decks', 'samples'] as const).map((k) => h('button', {
      type: 'button', role: 'tab', class: 'lib-tab', 'aria-selected': t === k ? 'true' : 'false',
      onclick: () => { tab = k; renderBody(); },
    }, k === 'decks' ? 'Your decks' : 'Samples', h('span', { class: 'count' }, String(k === 'decks' ? decks.length : smp.length)))));
    chips.replaceChildren(...(['all', ...CATEGORIES.map((x) => x.id)] as const).map((f) => h('button', {
      type: 'button', class: `chip${f === 'all' ? '' : ` cat-${f}`}`, 'aria-pressed': category === f ? 'true' : 'false',
      onclick: () => { category = f; renderBody(); },
    }, f === 'all' ? 'All' : CATEGORY_LABEL[f])));

    if (t === 'decks') {
      if (!s.decks.length) body.replaceChildren(empty(s.storageAvailable ? 'No saved decks yet. Start from a sample.' : 'Autosave is off in this browser.'));
      else if (!decks.length) body.replaceChildren(empty(status === 'todo' ? 'Nothing left to post here.' : 'No decks match.'));
      else body.replaceChildren(h('ul', { class: 'deck-list' }, ...decks.map((d) => deckRow(d, d.id === s.deckId, cats.get(d.id), dKey(d)))));
      return;
    }
    const groups = CATEGORIES.map(({ id, label }) => {
      const rows = smp.filter((x) => x.category === id);
      return rows.length ? h('section', {}, h('h3', { class: `label cat-head cat-${id}` }, `${label} · ${rows.length}`),
        h('ul', { class: 'deck-list' }, ...rows.map((x) => sampleRow(x, s.decks)))) : null;
    });
    body.replaceChildren(...(smp.length ? [
      h('p', { class: 'hint' }, 'Opens your copy if you already added it. Use New copy to start over.'), ...groups.filter((g): g is HTMLElement => g !== null),
    ] : [empty(status === 'todo' ? 'Nothing left to post here.' : 'No samples match.')]));
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
          item('Rename', () => renameDeck(c)), item('Delete', () => deleteDeck(c), 'danger'), currentStatus),
        search, h('div', { class: 'library-filters' }, tabs, chips), statusChips),
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
