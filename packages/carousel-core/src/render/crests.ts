// Crest images for `[results]` / `[stats]` slides: the deck names them by photo id (`@crest-…`),
// the host looks each one up the same way it looks up slide photos.
import { crestIds } from '../core/match';
import type { Deck } from '../core/types';
import type { PhotoInput } from './photo';

export function deckCrestIds(deck: Deck): string[] {
  return [...new Set(deck.slides.flatMap((s) => crestIds(s.match)))];
}

export async function loadCrests(deck: Deck, lookup: (id: string) => Promise<PhotoInput | null>): Promise<Map<string, PhotoInput>> {
  const out = new Map<string, PhotoInput>();
  for (const id of deckCrestIds(deck)) {
    const img = await lookup(id);
    if (img) out.set(id, img);
  }
  return out;
}
