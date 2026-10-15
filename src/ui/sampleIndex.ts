import { SAMPLES } from '../samples';
import type { DeckIndexEntry } from '../store/deckStore';
import { type SampleInfo, deckMarkKey, deckSamples, sampleInfo } from './libraryData';

// Parsing 130+ samples takes a moment, so it happens once, on first use.
let infos: SampleInfo[] | null = null;
export const allSampleInfos = (): SampleInfo[] => (infos ??= SAMPLES.map(sampleInfo));

/** The sample a saved deck came from, and the key its posting status is stored under. */
export function deckOrigin(decks: readonly DeckIndexEntry[], deckId: string): { sample: SampleInfo | undefined; key: string } {
  const from = deckSamples(decks, allSampleInfos());
  return { sample: from.get(deckId), key: deckMarkKey(deckId, from) };
}
