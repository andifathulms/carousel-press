import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeckStore } from '../src/store/deckStore';

// Node 25 exposes a partial global localStorage; use a deterministic in-memory one.
class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
}

let mem: MemoryStorage;
beforeEach(() => {
  mem = new MemoryStorage();
  vi.stubGlobal('localStorage', mem);
});

describe('DeckStore', () => {
  it('stores, updates and clears posting marks', () => {
    const s = new DeckStore();
    expect(s.loadMarks()).toEqual({});
    s.setMark('s:dev-git-id', 'posted', 10);
    s.setMark('d:abc', 'skip', 20);
    expect(new DeckStore().loadMarks()).toEqual({ 's:dev-git-id': { state: 'posted', at: 10 }, 'd:abc': { state: 'skip', at: 20 } });
    expect(s.setMark('s:dev-git-id', null, 30)).toEqual({ 'd:abc': { state: 'skip', at: 20 } });
  });

  it('keeps the sample tag across saves', () => {
    const s = new DeckStore();
    s.saveDeck({ id: 'a', text: 'Hi', settings: { darkness: 50 }, updatedAt: 1 }, { title: 'Hi', template: 'dev/terminal', slides: 3 });
    s.setSample('a', 'dev-git-id');
    s.saveDeck({ id: 'a', text: 'Hi!', settings: { darkness: 50 }, updatedAt: 2 }, { title: 'Hi!', template: 'dev/terminal', slides: 4 });
    expect(s.listDecks()[0]).toMatchObject({ sampleId: 'dev-git-id', slides: 4, title: 'Hi!' });
    s.setSample('a', 'dev-git-id', 42);
    expect(s.listDecks()[0]!.sampleHash).toBe(42);
  });

  it('round-trips decks, index and settings', () => {
    const s = new DeckStore();
    s.saveSettings({ ...s.loadSettings(), handle: '@x' });
    expect(s.loadSettings().handle).toBe('@x');
    s.saveDeck({ id: 'a', text: 'Hi', settings: { darkness: 40 }, updatedAt: 1 }, { title: 'Hi', template: 'dev/terminal' });
    s.saveDeck({ id: 'b', text: 'Yo', settings: { darkness: 50 }, updatedAt: 2 }, { title: 'Yo', template: 'dev/terminal' });
    expect(s.listDecks().map((d) => d.id)).toEqual(['b', 'a']);
    expect(s.loadDeck('a')!.settings.darkness).toBe(40);
    s.deleteDeck('a');
    expect(s.loadDeck('a')).toBeNull();
    expect(s.listDecks()).toHaveLength(1);
  });
  it('degrades when storage throws', () => {
    vi.spyOn(mem, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const off = vi.fn();
    const s = new DeckStore(off);
    expect(s.available).toBe(false);
    expect(off).toHaveBeenCalledOnce();
    expect(s.saveSettings(s.loadSettings())).toBe(false);
  });

  describe('when the quota is full', () => {
    // Throws like a real quota error once the stored characters would pass `limit`.
    const capAt = (limit: number) => {
      const set = mem.setItem.bind(mem);
      vi.spyOn(mem, 'setItem').mockImplementation((k: string, v: string) => {
        const others = ['cp:v1:decks', 'cp:v1:status', 'cp:v1:deck:a', 'cp:v1:deck:b']
          .filter((x) => x !== k).reduce((n, x) => n + (mem.getItem(x)?.length ?? 0), 0);
        if (others + v.length > limit) throw new DOMException('full', 'QuotaExceededError');
        set(k, v);
      });
    };
    const deck = (id: string) => ({ id, text: 'x'.repeat(50), settings: { darkness: 50 }, updatedAt: 1 });

    it('keeps earlier posting marks when a later save fails (owner bug, Oct 2026)', () => {
      const s = new DeckStore(vi.fn());
      s.setMark('s:one', 'posted', 1);
      capAt(0);
      expect(s.saveDeck(deck('a'), { title: 'A', template: 'dev/terminal' })).toBe(false);
      s.setMark('s:two', 'posted', 2);
      expect(Object.keys(s.loadMarks()).sort()).toEqual(['s:one', 's:two']);
      expect(s.available).toBe(true);
    });

    it('drops library thumbnails to make room, then saves', () => {
      const s = new DeckStore(vi.fn());
      s.saveDeck(deck('a'), { title: 'A', template: 'dev/terminal', thumb: 't'.repeat(2000) });
      capAt(2200);
      expect(s.saveDeck(deck('b'), { title: 'B', template: 'dev/terminal' })).toBe(true);
      expect(s.listDecks().every((d) => !d.thumb)).toBe(true);
      expect(s.loadDeck('a')).not.toBeNull();
      s.setMark('s:a', 'posted', 3);
      expect(new DeckStore().loadMarks()).toEqual({ 's:a': { state: 'posted', at: 3 } });
    });

    it('warns once and keeps reading', () => {
      const off = vi.fn();
      const s = new DeckStore(off);
      s.saveSettings({ ...s.loadSettings(), handle: '@kept' });
      capAt(0);
      expect(s.saveDeck(deck('a'), { title: 'A', template: 'dev/terminal' })).toBe(false);
      s.setMark('s:x', 'skip', 4);
      expect(off).toHaveBeenCalledOnce();
      expect(s.loadSettings().handle).toBe('@kept');
    });
  });
});
