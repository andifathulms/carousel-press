import { CATEGORIES, SAMPLES, type SampleCategory } from '../samples';
import type { DeckIndexEntry } from '../store/deckStore';
import { cleanUnusedPhotos, deleteDeckById, loadSample, newBlankDeck, openDeck, openDeckFile, replaceWithSample } from './actions';
import type { Controller } from './controller';
import { h, svg, timeAgo } from './dom';
import {
  type CategoryFilter, type PostStatus, type SampleInfo, type StatusFilter, countStatuses, deckMarkKey, deckSamples,
  decksFromSample, filterDecks, filterSamples, keepStatus, postStatus, sampleMarkKey, sampleUpdated, variantName,
} from './libraryData';
import { type MenuItem, onLongPress, openMenu } from './menu';
import { sampleCovers } from './sampleCovers';
import { allSampleInfos } from './sampleIndex';
import { REG_MARK, UI_ICONS } from './uiIcons';

const LABEL = Object.fromEntries(CATEGORIES.map((x) => [x.id, x.label])) as Record<SampleCategory, string>;
const STATUS_LABEL: Record<PostStatus, string> = { todo: 'To post', posted: 'Posted', skip: 'Skipped' };
const STATUSES: readonly PostStatus[] = ['todo', 'posted', 'skip'];
const SAMPLE_TEXT = new Map(SAMPLES.map((x) => [x.id, x.text]));

/** Status actions for a long-press menu (everything except the current state). */
function statusItems(c: Controller, key: string): MenuItem[] {
  const now = postStatus(c.store.get().marks, key);
  return STATUSES.filter((x) => x !== now).map((x) => ({
    label: x === 'todo' ? 'Back to to-post' : `Mark as ${STATUS_LABEL[x].toLowerCase()}`,
    icon: x === 'posted' ? UI_ICONS.check : x === 'skip' ? UI_ICONS.close : UI_ICONS.back,
    onSelect: () => c.setMark(key, x === 'todo' ? null : x),
  }));
}

/**
 * The Queue: every saved deck and sample as a grid of covers, by channel and posting status.
 * Tap a card to open it in the Studio; long-press for status and other actions.
 */
export function mountQueue(root: HTMLElement, c: Controller): void {
  let category: CategoryFilter = 'all';
  let status: StatusFilter = 'todo';
  let query = '';

  const fileInput = h('input', { type: 'file', accept: '.json,application/json', class: 'visually-hidden', 'aria-label': 'Open deck file' });
  const side = h('nav', { class: 'q-side', 'aria-label': 'Channels' });
  const search = h('input', { type: 'search', class: 'input q-search', placeholder: 'Search decks', 'aria-label': 'Search decks', id: 'queue-search' });
  const head = h('div', { class: 'q-titles' });
  const chips = h('div', { class: 'q-filters', role: 'group', 'aria-label': 'Posting status' });
  const body = h('div', { class: 'q-body' });
  const main = h('main', { class: 'q-main' }, h('header', { class: 'q-head' }, head, h('div', { class: 'q-search-wrap' }, svg(UI_ICONS.search), search)), chips, body);
  root.append(side, main, fileInput);
  const covers = sampleCovers(c, body);

  const open = (fn: () => unknown) => async (): Promise<void> => {
    await fn();
    c.store.set({ view: 'studio' });
  };

  const card = (o: {
    title: string; meta: string; cat?: SampleCategory; st: PostStatus; img?: string; sampleId?: string;
    badge?: string; onOpen: () => unknown; menu: () => MenuItem[];
  }): HTMLElement => {
    const cover = h('span', { class: 'q-cover' }, o.img ? h('img', { src: o.img, alt: '' }) : null,
      h('span', { class: `q-badge st-${o.st}` }, STATUS_LABEL[o.st]),
      o.badge ? h('span', { class: `q-badge mine${o.badge === 'Updated' ? ' updated' : ''}` }, o.badge) : null);
    if (o.sampleId && !o.img) covers.observe(cover, o.sampleId);
    const b = h('button', { type: 'button', class: `q-card st-${o.st}` }, cover,
      h('strong', {}, o.title || 'Untitled'),
      h('small', {}, o.cat ? h('i', { class: `dot cat-${o.cat}` }) : null, o.meta));
    b.addEventListener('click', open(o.onOpen));
    onLongPress(b, (at) => openMenu(at, o.menu(), o.title));
    return b;
  };

  const render = (): void => {
    covers.reset();
    const s = c.store.get();
    const samples = allSampleInfos();
    const from = deckSamples(s.decks, samples);
    const cats = new Map([...from].map(([id, x]) => [id, x.category]));
    const dKey = (d: DeckIndexEntry): string => deckMarkKey(d.id, from);
    const sKey = (x: SampleInfo): string => sampleMarkKey(x.id);

    // Sidebar: every channel with how many are still to post.
    const todo = (cat: CategoryFilter): number => samples.filter((x) => (cat === 'all' || x.category === cat) && postStatus(s.marks, sKey(x)) === 'todo').length;
    const navItem = (id: CategoryFilter, label: string, extra: Node | null): HTMLButtonElement => h('button', {
      type: 'button', class: 'q-nav', 'aria-current': category === id ? 'true' : 'false',
      onclick: () => { category = id; render(); },
    }, extra, h('span', { class: 'q-nav-name' }, label), h('b', {}, String(todo(id))));
    side.replaceChildren(
      h('div', { class: 'q-brand' }, svg(REG_MARK), h('span', {}, 'CAROUSEL PRESS')),
      navItem('all', 'All channels', svg(UI_ICONS.stack)),
      h('h3', { class: 'label q-side-label' }, 'Channels'),
      ...CATEGORIES.filter((x) => samples.some((y) => y.category === x.id)).map((x) => navItem(x.id, x.label, h('i', { class: `dot cat-${x.id}` }))),
      h('span', { class: 'q-grow' }),
      h('button', { type: 'button', class: 'q-nav q-foot', onclick: open(() => newBlankDeck(c)) }, svg(UI_ICONS.plus), h('span', {}, 'New deck')),
      h('button', { type: 'button', class: 'q-nav q-foot', onclick: () => fileInput.click() }, svg(UI_ICONS.file), h('span', {}, 'Open deck file')),
      h('button', { type: 'button', class: 'q-nav q-foot', onclick: () => void cleanUnusedPhotos(c) }, svg(UI_ICONS.trash), h('span', {}, 'Clean unused photos')),
    );

    const decksAll = filterDecks(s.decks, query, category, cats);
    const smpAll = filterSamples(samples, query, category);
    const counts = countStatuses([...new Set([...decksAll.map(dKey), ...smpAll.map(sKey)])], s.marks);
    const decks = decksAll.filter((d) => keepStatus(dKey(d), s.marks, status)).sort((a, b) => b.updatedAt - a.updatedAt);
    const smp = smpAll.filter((x) => keepStatus(sKey(x), s.marks, status));

    head.replaceChildren(h('h1', {}, category === 'all' ? 'Up next' : LABEL[category]),
      h('p', {}, `${counts.todo} to post · ${counts.posted} posted${counts.skip ? ` · ${counts.skip} skipped` : ''}`));
    chips.replaceChildren(...([...STATUSES, 'all'] as const).map((f) => h('button', {
      type: 'button', class: 'q-chip', 'aria-pressed': status === f ? 'true' : 'false',
      onclick: () => { status = f; render(); },
    }, f === 'all' ? 'All' : STATUS_LABEL[f], f === 'all' ? null : h('b', {}, String(counts[f])))));

    // The deck open in the Studio, unless a search or filter hides it.
    const cur = s.decks.find((d) => d.id === s.deckId);
    const showCur = cur && !query && (category === 'all' || cats.get(cur.id) === category) && keepStatus(dKey(cur), s.marks, status);
    const curCat = cur ? cats.get(cur.id) : undefined;
    const curCover = h('span', { class: 'q-cover' }, cur?.thumb ? h('img', { src: cur.thumb, alt: '' }) : null);
    const curSample = cur ? from.get(cur.id) : undefined;
    if (showCur && !cur.thumb && curSample) covers.observe(curCover, curSample.id);
    const cont = showCur ? h('button', { type: 'button', class: 'q-continue', onclick: () => c.store.set({ view: 'studio' }) },
      curCover,
      h('span', { class: 'q-continue-text' },
        h('span', { class: 'label' }, `Editing · ${timeAgo(cur.updatedAt)}`),
        h('strong', {}, cur.title || 'Untitled'),
        h('small', {}, curCat ? h('i', { class: `dot cat-${curCat}` }) : null,
          [curCat ? LABEL[curCat] : null, variantName(cur.template), cur.slides ? `${cur.slides} slides` : null].filter(Boolean).join(' · '))),
      h('span', { class: 'btn primary' }, 'Continue')) : null;

    // A deck made from a sample shows once, as the sample's card (it opens your copy).
    const ownDecks = decks.filter((d) => !from.has(d.id) && d.id !== (showCur ? cur.id : '')).map((d) => {
      const key = dKey(d);
      return card({
        title: d.title, img: d.thumb, st: postStatus(s.marks, key), badge: 'Yours',
        meta: [variantName(d.template), timeAgo(d.updatedAt)].join(' · '),
        onOpen: () => openDeck(c, d.id),
        menu: () => [{ label: 'Open', icon: UI_ICONS.pen, onSelect: open(() => openDeck(c, d.id)) }, 'sep', ...statusItems(c, key), 'sep',
          { label: 'Delete deck', icon: UI_ICONS.trash, danger: true, onSelect: () => deleteDeckById(c, d.id) }],
      });
    });
    const sampleCards = smp.map((x) => {
      const mine = decksFromSample(s.decks, x)[0];
      const updated = !!mine && sampleUpdated(mine, SAMPLE_TEXT.get(x.id) ?? '');
      return card({
        title: x.name, cat: x.category, st: postStatus(s.marks, sKey(x)), sampleId: x.id,
        // An updated sample shows its new cover, so the change is visible before replacing.
        img: updated ? undefined : mine?.thumb,
        badge: updated ? 'Updated' : mine ? 'Yours' : undefined, meta: `${LABEL[x.category]} · ${x.slides} slides`,
        onOpen: () => loadSample(c, x.id),
        menu: () => [
          { label: mine ? 'Open your copy' : 'Open', icon: UI_ICONS.pen, onSelect: open(() => loadSample(c, x.id)) },
          ...(mine ? [{ label: 'Replace with latest sample', icon: UI_ICONS.upload, onSelect: async () => {
            if (await replaceWithSample(c, x.id)) c.store.set({ view: 'studio' });
          } }] : []),
          'sep', ...statusItems(c, sKey(x)),
        ],
      });
    });
    const empty = !cont && !ownDecks.length && !sampleCards.length;
    body.replaceChildren(...[
      cont,
      ownDecks.length ? h('section', { class: 'q-sec' }, h('h2', { class: 'label' }, `Your decks · ${ownDecks.length}`), h('div', { class: 'q-grid' }, ...ownDecks)) : null,
      sampleCards.length ? h('section', { class: 'q-sec' }, h('h2', { class: 'label' }, `Samples · ${sampleCards.length}`), h('div', { class: 'q-grid' }, ...sampleCards)) : null,
      empty ? h('p', { class: 'q-empty' }, status === 'todo' ? 'Nothing left to post here. Nice.' : 'No decks match.') : null,
    ].filter((x): x is HTMLElement => x !== null));
  };

  search.addEventListener('input', () => { query = search.value; render(); });
  search.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    body.querySelector<HTMLButtonElement>('.q-continue, .q-card')?.click();
  });
  fileInput.addEventListener('change', () => {
    const f = fileInput.files?.[0];
    if (f) void open(() => openDeckFile(c, f))();
    fileInput.value = '';
  });
  c.store.subscribe((s, p) => {
    if (s.view !== 'queue') return;
    if (s.view !== p.view || s.decks !== p.decks || s.marks !== p.marks || s.deckId !== p.deckId) render();
  });
  if (c.store.get().view === 'queue') render();
}
