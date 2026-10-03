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
});
