import type { TemplateId } from '../core/types';

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

/** localStorage wrapper: every call is guarded; failures flip `available` off. */
export class DeckStore {
  available = true;
  private onUnavailable: () => void;

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
    if (this.available) {
      this.available = false;
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
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      this.fail();
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
    list.push({ id: deck.id, updatedAt: deck.updatedAt, ...entry, thumb: entry.thumb ?? prev?.thumb, sampleId: entry.sampleId ?? prev?.sampleId });
    return this.write(K.index, list);
  }

  setThumb(id: string, thumb: string): void {
    const list = this.listDecks();
    const e = list.find((d) => d.id === id);
    if (!e || e.thumb === thumb) return;
    e.thumb = thumb;
    this.write(K.index, list);
  }

  setSample(id: string, sampleId: string): void {
    const list = this.listDecks();
    const e = list.find((d) => d.id === id);
    if (!e || e.sampleId === sampleId) return;
    e.sampleId = sampleId;
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
    return m && typeof m === 'object' && !Array.isArray(m) ? m : {};
  }

  /** Set or clear (state = null) one posting mark; returns the updated map. */
  setMark(key: string, state: PostState | null, at: number): PostMarks {
    const marks = { ...this.loadMarks() };
    if (state) marks[key] = { state, at };
    else delete marks[key];
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
