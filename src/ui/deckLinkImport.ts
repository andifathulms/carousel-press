import { decodeDeckLink, deckLinkParam } from '../core/deckLink';
import type { Controller } from './controller';
import { toast } from './dialogs';

/** Shown when a `#deck=` link can't be decoded; Indonesian when the browser is. */
export function deckLinkError(language: string | undefined): string {
  return language?.toLowerCase().startsWith('id') ? 'Tautan deck tidak bisa dibaca' : "Couldn't read the deck link";
}

/**
 * Import a `#deck=` fragment as a new deck in the library (never over the open
 * deck), then drop the fragment so a reload doesn't import it twice.
 * Returns true when a deck was opened.
 */
export function importDeckFromHash(c: Controller): boolean {
  if (deckLinkParam(location.hash) === null) return false;
  const r = decodeDeckLink(location.hash);
  try {
    history.replaceState(history.state, '', location.pathname + location.search);
  } catch {
    // Sandboxed frames can refuse replaceState; the import itself still works.
  }
  if (!r.ok) {
    toast(deckLinkError(navigator.language), 'error');
    return false;
  }
  c.newDeck(r.text);
  return true;
}
