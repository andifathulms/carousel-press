import './ui/app.css';
import { SAMPLES } from './samples';
import { Controller } from './ui/controller';
import { ensureSamplePhotos, loadSample } from './ui/actions';
import { mountApp } from './ui/app';

async function boot(): Promise<void> {
  const root = document.getElementById('app');
  if (!root) return;
  const c = new Controller();
  mountApp(root, c);
  await c.init();

  // Restore the last open deck; on first run open the couples sample as a new deck.
  const last = c.settings.currentDeckId ? c.decks.loadDeck(c.settings.currentDeckId) : null;
  if (last) c.openDeck(last.id, last.text, last.settings.darkness);
  else {
    const fallback = c.decks.listDecks()[0];
    const stored = fallback ? c.decks.loadDeck(fallback.id) : null;
    if (stored) c.openDeck(stored.id, stored.text, stored.settings.darkness);
    else await loadSample(c, SAMPLES[0]!.id);
  }
  // Decks made from samples get their bundled photos back if the tray lost them.
  void ensureSamplePhotos(c, c.store.get().text);

  window.addEventListener('pagehide', () => c.flushSave());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') c.flushSave();
  });
}

void boot();
