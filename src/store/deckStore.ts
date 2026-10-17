import type { TemplateId } from 'carousel-core/src/core/types';

/** Settings that aren't part of the deck text. */
export interface DeckSettings {
  darkness: number;
}

export interface StoredDeck {
  id: string;
  text: string;
  settings: DeckSettings;
  updatedAt: number;
}

export interface DeckIndexEntry {
  id: string;
  title: string;
  template: string;
  updatedAt: number;
  /** Small JPEG data URL of the cover (P1 library). */
  thumb?: string;
  /** Slide count at the last save. */
  slides?: number;
  /** Set when the deck was created from a sample, so loading it again opens this deck. */
  sampleId?: string;
  /** Hash of the sample text this deck was copied from; a different hash now means the sample was updated. */
  sampleHash?: number;
}

/** Posting status of a deck or sample. No entry means "to post". */
export type PostState = 'posted' | 'skip';
export interface PostMark {
  state: PostState;
  at: number;
}
export type PostMarks = Record<string, PostMark>;

export interface AppSettings {
  handle: string;
  lastTemplate: TemplateId | null;
  currentDeckId: string | null;
  tipDismissed: boolean;
  sampleSeeded: boolean;
  showSafe: boolean;
  showGrid: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  handle: '', lastTemplate: null, currentDeckId: null, tipDismissed: false, sampleSeeded: false,
  showSafe: false, showGrid: false,
};
export const DEFAULT_DECK_SETTINGS: DeckSettings = { darkness: 50 };

const K = {
  settings: 'cp:v1:settings',
  index: 'cp:v1:decks',
  deck: (id: string) => `cp:v1:deck:${id}`,
  marks: 'cp:v1:status',
};

/**
 * localStorage wrapper: every call is guarded. `available` goes off only when storage
 * can't be used at all; a failed write (usually a full quota) shows the banner but
 * reads keep working, so one failed save can't make the app forget what's stored.
 */
export class DeckStore {
  available = true;
  private onUnavailable: () => void;
  private warned = false;
  /** Marks set this session, applied over what's stored, so none is lost if a write fails. */
  private sessionMarks = new Map<string, PostMark | null>();

  constructor(onUnavailable: () => void = () => {}) {
    this.onUnavailable = onUnavailable;
    try {
      const probe = 'cp:v1:probe';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
    } catch {
      this.fail();
    }
  }

  private fail(): void {
    this.available = false;
    this.warn();
  }

  private warn(): void {
    if (!this.warned) {
      this.warned = true;
      this.onUnavailable();
    }
  }

  private read<T>(key: string): T | null {
    if (!this.available) return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  private write(key: string, value: unknown): boolean {
    if (!this.available) return false;
    const json = JSON.stringify(value);
    try {
      localStorage.setItem(key, json);
      return true;
    } catch {
      // Library thumbnails fill most of the quota and are redrawn when a deck opens.
      if (key !== K.index && this.dropThumbs()) {
        try {
          localStorage.setItem(key, json);
          return true;
        } catch { /* still full */ }
      }
      this.warn();
      return false;
    }
  }

  /** Remove every library thumbnail to free space; true if any were removed. */
  private dropThumbs(): boolean {
    const list = this.listDecks();
    if (!list.some((d) => d.thumb)) return false;
    try {
      localStorage.setItem(K.index, JSON.stringify(list.map(({ thumb: _, ...d }) => d)));
      return true;
    } catch {
      return false;
    }
  }

  loadSettings(): AppSettings {
    return { ...DEFAULT_SETTINGS, ...(this.read<Partial<AppSettings>>(K.settings) ?? {}) };
  }

  saveSettings(s: AppSettings): boolean {
    return this.write(K.settings, s);
  }

  listDecks(): DeckIndexEntry[] {
    const list = this.read<DeckIndexEntry[]>(K.index);
    return Array.isArray(list) ? list.slice().sort((a, b) => b.updatedAt - a.updatedAt) : [];
  }

  loadDeck(id: string): StoredDeck | null {
    const d = this.read<StoredDeck>(K.deck(id));
    if (!d || typeof d.text !== 'string') return null;
    return { ...d, settings: { ...DEFAULT_DECK_SETTINGS, ...(d.settings ?? {}) } };
  }

  saveDeck(deck: StoredDeck, entry: Omit<DeckIndexEntry, 'id' | 'updatedAt'>): boolean {
    const ok = this.write(K.deck(deck.id), deck);
    if (!ok) return false;
    const list = this.listDecks().filter((d) => d.id !== deck.id);
    const prev = this.listDecks().find((d) => d.id === deck.id);
    list.push({ id: deck.id, updatedAt: deck.updatedAt, ...entry, thumb: entry.thumb ?? prev?.thumb, sampleId: entry.sampleId ?? prev?.sampleId,
      sampleHash: entry.sampleHash ?? prev?.sampleHash });
    return this.write(K.index, list);
  }

  setThumb(id: string, thumb: string): void {
    const list = this.listDecks();
    const e = list.find((d) => d.id === id);
    if (!e || e.thumb === thumb) return;
    e.thumb = thumb;
    this.write(K.index, list);
  }

  /** Tag a deck with the sample it was copied from (and the hash of that sample's text). */
  setSample(id: string, sampleId: string, sampleHash?: number): void {
    const list = this.listDecks();
    const e = list.find((d) => d.id === id);
    if (!e || (e.sampleId === sampleId && (sampleHash === undefined || e.sampleHash === sampleHash))) return;
    e.sampleId = sampleId;
    if (sampleHash !== undefined) e.sampleHash = sampleHash;
    this.write(K.index, list);
  }

  rename(id: string, title: string): void {
    const list = this.listDecks();
    const e = list.find((d) => d.id === id);
    if (e) {
      e.title = title;
      this.write(K.index, list);
    }
  }

  loadMarks(): PostMarks {
    const m = this.read<PostMarks>(K.marks);
    const marks: PostMarks = m && typeof m === 'object' && !Array.isArray(m) ? { ...m } : {};
    for (const [key, mark] of this.sessionMarks) {
      if (mark) marks[key] = mark;
      else delete marks[key];
    }
    return marks;
  }

  /** Set or clear (state = null) one posting mark; returns the updated map. */
  setMark(key: string, state: PostState | null, at: number): PostMarks {
    this.sessionMarks.set(key, state ? { state, at } : null);
    const marks = this.loadMarks();
    this.write(K.marks, marks);
    return marks;
  }

  deleteDeck(id: string): void {
    if (!this.available) return;
    try {
      localStorage.removeItem(K.deck(id));
    } catch {
      this.fail();
    }
    this.write(K.index, this.listDecks().filter((d) => d.id !== id));
  }
}

/** Short random-enough id for decks (UI only, never used in rendering). */
export function newDeckId(): string {
  return `d${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}
