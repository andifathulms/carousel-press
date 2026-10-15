import { isBlocking } from 'carousel-core/src/core/types';
import { CATEGORIES } from '../samples';
import { downloadAll, downloadCurrentSlide, downloadTestImage, loadSample, saveToPhotos } from './actions';
import { allWarnings } from './appState';
import type { Controller } from './controller';
import { copyText, h, svg } from './dom';
import { nextToPost, postStatus } from './libraryData';
import { paintBitmap } from './preview';
import { allSampleInfos, deckOrigin } from './sampleIndex';
import { canSharePngs } from './sharePhotos';
import { UI_ICONS } from './uiIcons';

type Step = 'save' | 'title' | 'caption';
const shortDate = (at: number): string => new Date(at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
const count = (t: string): string => `${Array.from(t).length} chars`;

/**
 * The Publish sheet: the real order of posting a carousel on iPad.
 * 1 save the slides, 2 copy the title, 3 copy the caption, 4 mark as posted (and open the next one).
 */
export function mountPublishSheet(c: Controller): void {
  const share = canSharePngs();
  const scrim = h('div', { class: 'sheet-scrim', hidden: true });
  const body = h('div', { class: 'sheet-body' });
  const closeBtn = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Close' }, svg(UI_ICONS.close));
  const title = h('h2', { id: 'publish-title' }, 'Ready to post');
  const meta = h('p', { class: 'sheet-meta' });
  const sheet = h('aside', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'publish-title', hidden: true },
    h('div', { class: 'sheet-head' }, h('div', {}, title, meta), closeBtn), body);
  document.body.append(scrim, sheet);

  const done = new Set<Step>();
  let prevFocus: HTMLElement | null = null;
  const close = (): void => c.store.set({ publishOpen: false });
  closeBtn.addEventListener('click', close);
  scrim.addEventListener('click', close);
  sheet.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.querySelector('.modal-backdrop')) {
      e.preventDefault();
      close();
    }
  });

  const step = (n: number, key: Step | 'mark', isDone: boolean, head: string, note: string | null, ...rest: (Node | null)[]): HTMLElement =>
    h('section', { class: `step${isDone ? ' done' : ''}`, 'data-step': key },
      h('span', { class: 'step-n', 'aria-hidden': 'true' }, isDone ? svg(UI_ICONS.check) : String(n)),
      h('div', { class: 'step-main' }, h('h3', {}, head, note ? h('small', {}, note) : null), ...rest));

  const btn = (label: string, icon: string, cls: string, fn: () => unknown, disabled = false): HTMLButtonElement => {
    const b = h('button', { type: 'button', class: `btn ${cls}`, disabled }, svg(icon), label);
    b.addEventListener('click', () => void fn());
    return b;
  };

  const copyStep = (n: number, key: 'title' | 'caption', label: string, value: string, empty: string): HTMLElement => {
    const b = btn(`Copy ${label.toLowerCase()}`, UI_ICONS.copy, done.has(key) ? '' : 'primary', async () => {
      if (await copyText(value)) {
        done.add(key);
        render();
      } else b.textContent = 'Copy failed';
    }, !value);
    return step(n, key, done.has(key), label, value ? count(value) : null,
      h('p', { class: `copy-box${value ? '' : ' empty'}` }, value || empty), h('div', { class: 'step-acts' }, b));
  };

  const render = (): void => {
    const s = c.store.get();
    const deck = s.parsed.deck;
    const n = deck.slides.length;
    const blocked = !s.fontsReady || !!s.busy || n === 0;
    const blocking = allWarnings(s).filter(isBlocking);
    title.textContent = blocking.length ? 'Needs a fix first' : 'Ready to post';
    meta.textContent = `${s.variant.name} · ${n} slide${n === 1 ? '' : 's'}${blocking.length ? '' : ' · all fit the safe zone'}`;

    const attention = blocking.length ? h('section', { class: 'attention' },
      h('p', {}, svg(UI_ICONS.warn), ` ${blocking.length} slide${blocking.length === 1 ? '' : 's'} need attention`),
      ...blocking.map((w) => h('button', {
        type: 'button', class: 'link',
        onclick: () => { close(); if (w.slideIndex !== null) c.jumpToSlide(w.slideIndex); c.store.set({ leftTab: 'write', mobileTab: 'write', focus: false }); },
      }, `Slide ${(w.slideIndex ?? 0) + 1}: ${w.message}`))) : null;

    const strip = h('div', { class: 'sheet-strip', 'aria-hidden': 'true' }, ...deck.slides.map((_, i) => {
      const cv = h('canvas', {});
      requestAnimationFrame(() => paintBitmap(cv, c.engine.get(i)?.bitmap));
      return cv;
    }));

    const saveDone = done.has('save');
    const markSave = (fn: (c: Controller) => Promise<void>) => async (): Promise<void> => {
      await fn(c);
      done.add('save');
      render();
    };
    const save = step(1, 'save', saveDone, share ? 'Save slides to Photos' : 'Download the slides', `${n} PNG`,
      h('p', {}, saveDone ? 'Done. Open TikTok and pick them in order.' : share ? 'Opens the share sheet. Choose Save Images.' : 'A ZIP with one PNG per slide.'),
      h('div', { class: 'step-acts' },
        share ? btn(saveDone ? 'Save again' : `Save ${n} to Photos`, UI_ICONS.image, saveDone ? '' : 'primary grow', markSave(saveToPhotos), blocked) : null,
        btn(share ? 'ZIP' : 'Download all (ZIP)', UI_ICONS.box, share ? 'quiet' : saveDone ? 'grow' : 'primary grow', markSave(downloadAll), blocked),
        btn('This slide', UI_ICONS.download, 'quiet', () => downloadCurrentSlide(c), blocked)));

    const { sample, key } = deckOrigin(s.decks, s.deckId);
    const mark = s.marks[key];
    const next = sample ? nextToPost(allSampleInfos(), s.marks, sample.category, sample.id) : undefined;
    const channel = sample ? CATEGORIES.find((x) => x.id === sample.category)?.label : undefined;
    const posted = postStatus(s.marks, key) !== 'todo';
    const markStep = step(4, 'mark', posted, posted ? (mark?.state === 'skip' ? 'Skipped' : 'Posted') : 'Mark as posted',
      mark ? shortDate(mark.at) : null,
      next ? h('p', {}, `Next in ${channel}: `, h('strong', {}, next.name)) : h('p', {}, 'Keeps your queue up to date.'),
      h('div', { class: 'step-acts' }, ...(posted ? [
        btn('Back to to-post', UI_ICONS.back, 'quiet', () => c.setMark(key, null)),
        next ? btn(`Open next`, UI_ICONS.next, 'primary grow', () => { close(); return loadSample(c, next.id); }) : null,
      ] : [
        next ? btn('Posted, open next', UI_ICONS.check, 'grow', () => { c.setMark(key, 'posted'); close(); return loadSample(c, next.id); }) : null,
        btn('Posted', UI_ICONS.check, next ? 'quiet' : 'grow', () => c.setMark(key, 'posted')),
        btn('Skip', UI_ICONS.close, 'quiet', () => c.setMark(key, 'skip')),
      ])));

    const hint = h('p', { class: `hint${s.fontError ? ' error' : ''}`, 'aria-live': 'polite' },
      s.busy ?? (s.fontError ? `${s.fontError}. Export is disabled.` : !s.fontsReady ? 'Loading fonts…' : ''));
    const test = h('button', { type: 'button', class: 'link sheet-foot' }, 'Safe-zone test image');
    test.addEventListener('click', () => void downloadTestImage(c));

    const focusedStep = (document.activeElement as HTMLElement | null)?.closest('.step')?.getAttribute('data-step');
    body.replaceChildren(...[attention, strip, save,
      copyStep(2, 'title', 'Title', deck.title, 'Add a title: line to the header, or a cover slide.'),
      copyStep(3, 'caption', 'Caption', deck.caption, 'Add a caption: line to the header.'),
      markStep, hint, test].filter((x): x is HTMLElement => x !== null));
    if (focusedStep) body.querySelector<HTMLElement>(`[data-step="${focusedStep}"] button`)?.focus();
  };

  c.store.watch((s) => s.publishOpen, (open) => {
    scrim.hidden = !open;
    sheet.hidden = !open;
    document.body.classList.toggle('sheet-open', open);
    if (open) {
      prevFocus = document.activeElement as HTMLElement | null;
      render();
      requestAnimationFrame(() => sheet.querySelector<HTMLElement>('.btn.primary, .btn')?.focus());
    } else prevFocus?.focus?.();
  });
  c.store.watch((s) => s.deckId, () => done.clear());
  c.store.subscribe((s, p) => {
    if (!s.publishOpen) return;
    if (s.parsed !== p.parsed || s.marks !== p.marks || s.decks !== p.decks || s.busy !== p.busy ||
      s.fontsReady !== p.fontsReady || s.renderVersion !== p.renderVersion || s.renderWarnings !== p.renderWarnings) render();
  });
}
