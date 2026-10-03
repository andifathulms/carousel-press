import { setHeaderKey } from '../core/headerEdit';
import { parse } from '../core/parser';
import { DEFAULT_TEMPLATE, type Lang, type ParseResult, type TemplateId, type Warning } from '../core/types';
import { loadFonts } from '../fonts/loadFonts';
import { SAMPLE_DUSK, generateSampleDusk } from '../render/samplePhoto';
import { type AppSettings, DeckStore, newDeckId } from '../store/deckStore';
import { PHOTO, PhotoStore } from '../store/photoStore';
import { getVariant } from '../templates/registry';
import type { AppState } from './appState';
import { debounce } from './dom';
import { RenderEngine } from './renderEngine';
import { Store } from './state';

export const PARSE_DEBOUNCE_MS = 150;
export const SAVE_DEBOUNCE_MS = 500;

/** Owns the state store, storage, parsing, rendering and autosave. */
export class Controller {
  readonly store: Store<AppState>;
  readonly decks: DeckStore;
  readonly photos: PhotoStore;
  readonly engine: RenderEngine;
  settings: AppSettings;
  private parseSoon = debounce(() => this.reparse(), PARSE_DEBOUNCE_MS);
  private saveSoon = debounce(() => this.saveNow(), SAVE_DEBOUNCE_MS);
  private renderQueued = false;

  constructor() {
    const off = (): void => this.store?.set({ storageAvailable: false, saveStatus: 'off' });
    this.decks = new DeckStore(off);
    this.photos = new PhotoStore(off);
    this.settings = this.decks.loadSettings();
    this.engine = new RenderEngine(() => this.onRendered());
    const empty = parse('');
    this.store = new Store<AppState>({
      text: '', deckId: '', parsed: empty, variant: getVariant(DEFAULT_TEMPLATE), selected: 0, darkness: 50,
      showSafe: this.settings.showSafe, showGrid: this.settings.showGrid, fontsReady: false, fontError: null,
      storageAvailable: this.decks.available, photos: [], renderWarnings: [], renderVersion: 0,
      saveStatus: this.decks.available ? 'saved' : 'off', savedAt: Date.now(), leftTab: 'write', mobileTab: 'write',
      tip: !this.settings.tipDismissed, decks: this.decks.listDecks(), busy: null, jump: null,
    });
  }

  /** Load photos, seed sample-dusk on first run, ensure fonts. */
  async init(): Promise<void> {
    await this.photos.init();
    if (!this.photos.available) this.store.set({ storageAvailable: false, saveStatus: 'off' });
    if (!this.photos.get(SAMPLE_DUSK.id) && (!this.settings.sampleSeeded || !this.photos.list().length)) {
      try {
        const s = await generateSampleDusk();
        await this.photos.addBlob({
          id: SAMPLE_DUSK.id, name: 'sample-dusk.png', width: s.width, height: s.height, focalX: 0.5, focalY: 0.5,
          mime: 'image/png', addedAt: 1,
        }, s.blob);
      } catch {
        // A missing sample only means photo=1 warns; the app still works.
      }
      this.updateSettings({ sampleSeeded: true });
    }
    this.store.set({ photos: this.photos.list() });
  }

  updateSettings(patch: Partial<AppSettings>): void {
    this.settings = { ...this.settings, ...patch };
    this.decks.saveSettings(this.settings);
  }

  // ---- text & parsing ---------------------------------------------------
  setText(text: string): void {
    if (text === this.store.get().text) return;
    this.store.set({ text, saveStatus: this.store.get().storageAvailable ? 'unsaved' : 'off' });
    this.parseSoon();
    this.saveSoon();
  }

  /** Replace the text and parse immediately (header edits, deck switches). */
  replaceText(text: string): void {
    this.store.set({ text });
    this.parseSoon.cancel();
    this.reparse();
    this.saveSoon();
  }

  parseText(text: string): ParseResult {
    const r = parse(text, {
      defaultTemplate: this.settings.lastTemplate ?? DEFAULT_TEMPLATE,
      defaultHandle: this.settings.handle,
      photoIds: this.photos.ids(),
    });
    for (const s of r.deck.slides) {
      const p = s.photoId ? this.photos.get(s.photoId) : null;
      if (p && Math.min(p.width, p.height) < PHOTO.lowResShortSide) {
        r.warnings.push({
          code: 'photo-low-res', slideIndex: s.index, line: s.lines[0],
          message: `Photo "${p.id}" is ${p.width}×${p.height}; it may look soft (short side under ${PHOTO.lowResShortSide}px)`,
        });
      }
    }
    return r;
  }

  reparse(): void {
    const s = this.store.get();
    const parsed = this.parseText(s.text);
    const variant = getVariant(parsed.deck.template);
    const selected = Math.max(0, Math.min(s.selected, parsed.deck.slides.length - 1));
    const renderWarnings = s.renderWarnings.slice(0, parsed.deck.slides.length);
    this.store.set({ parsed, variant, selected, renderWarnings });
    if (variant.id !== s.variant.id || !s.fontsReady) void this.ensureFonts();
    else this.scheduleRender();
  }

  async ensureFonts(): Promise<void> {
    const v = this.store.get().variant;
    this.store.set({ fontsReady: false, fontError: null });
    try {
      await loadFonts(v);
      if (this.store.get().variant.id === v.id) {
        this.store.set({ fontsReady: true });
        this.scheduleRender();
      }
    } catch (err) {
      this.store.set({ fontError: err instanceof Error ? err.message : String(err) });
    }
  }

  scheduleRender(): void {
    if (this.renderQueued) return;
    this.renderQueued = true;
    requestAnimationFrame(() => {
      this.renderQueued = false;
      const s = this.store.get();
      if (!s.fontsReady) return;
      void this.engine.render({
        deck: s.parsed.deck, variant: s.variant, darkness: s.darkness, selected: s.selected,
        getPhoto: (id) => this.photos.photoInput(id),
      });
    });
  }

  private onRendered(): void {
    const s = this.store.get();
    this.store.set({ renderVersion: s.renderVersion + 1, renderWarnings: this.engine.warnings() });
  }

  // ---- header-backed controls -------------------------------------------
  setTemplate(id: TemplateId): void {
    this.updateSettings({ lastTemplate: id });
    this.replaceText(setHeaderKey(this.store.get().text, 'template', id));
  }

  setHandle(handle: string): void {
    this.updateSettings({ handle });
    this.replaceText(setHeaderKey(this.store.get().text, 'handle', handle));
  }

  setLang(lang: Lang): void {
    this.replaceText(setHeaderKey(this.store.get().text, 'lang', lang));
  }

  setDarkness(darkness: number): void {
    this.store.set({ darkness });
    this.scheduleRender();
    this.saveSoon();
  }

  select(i: number): void {
    const n = this.store.get().parsed.deck.slides.length;
    if (!n) return;
    this.store.set({ selected: Math.max(0, Math.min(n - 1, i)) });
  }

  /** Select a slide and move the editor cursor to its first line. */
  jumpToSlide(i: number): void {
    this.select(i);
    const s = this.store.get().parsed.deck.slides[i];
    if (s) this.jumpToLine(s.lines[0]);
  }

  jumpToLine(line: number): void {
    this.store.set({ jump: { line, seq: (this.store.get().jump?.seq ?? 0) + 1 } });
  }

  /** Cursor moved in the editor: select the slide containing that line. */
  cursorAtLine(line: number): void {
    let target = -1;
    for (const s of this.store.get().parsed.deck.slides) if (s.lines[0] <= line) target = s.index;
    if (target < 0) target = 0;
    if (target !== this.store.get().selected) this.select(target);
  }

  // ---- saving -------------------------------------------------------------
  saveNow(): void {
    const s = this.store.get();
    if (!s.deckId) return;
    if (!this.decks.available) {
      this.store.set({ saveStatus: 'off' });
      return;
    }
    const ok = this.decks.saveDeck(
      { id: s.deckId, text: s.text, settings: { darkness: s.darkness }, updatedAt: Date.now() },
      { title: s.parsed.deck.title || 'Untitled', template: s.parsed.deck.template, slides: s.parsed.deck.slides.length },
    );
    this.store.set({ saveStatus: ok ? 'saved' : 'off', savedAt: Date.now(), decks: this.decks.listDecks() });
  }

  cancelPendingSave(): void {
    this.saveSoon.cancel();
  }

  flushSave(): void {
    this.parseSoon.flush();
    this.saveSoon.flush();
  }

  /** Open a deck by id (or a fresh one with the given text). */
  openDeck(id: string, text: string, darkness = 50): void {
    this.flushSave();
    this.engine.clear();
    this.store.set({ deckId: id, darkness, selected: 0, renderWarnings: [] });
    this.updateSettings({ currentDeckId: id });
    this.replaceText(text);
    this.saveNow();
  }

  newDeck(text: string, sampleId?: string): string {
    const id = newDeckId();
    this.openDeck(id, text);
    if (sampleId) {
      this.decks.setSample(id, sampleId);
      this.store.set({ decks: this.decks.listDecks() });
    }
    return id;
  }

  refreshPhotos(): void {
    this.store.set({ photos: this.photos.list() });
    this.reparse();
  }

  blockingWarnings(): Warning[] {
    return this.engine.warnings().flat().filter((w) => w.code === 'overflow' || w.code === 'code-line-too-long');
  }
}
