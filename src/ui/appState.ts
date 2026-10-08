import type { ParseResult, Warning } from '../core/types';
import type { DeckIndexEntry, PostMarks } from '../store/deckStore';
import type { PhotoMeta } from '../store/photoStore';
import type { Variant } from '../templates/types';

export type MobileTab = 'write' | 'photos' | 'preview' | 'export';

export interface AppState {
  text: string;
  deckId: string;
  parsed: ParseResult;
  variant: Variant;
  selected: number;
  darkness: number;
  showSafe: boolean;
  showGrid: boolean;
  fontsReady: boolean;
  fontError: string | null;
  storageAvailable: boolean;
  photos: PhotoMeta[];
  /** Renderer warnings per slide index. */
  renderWarnings: Warning[][];
  /** Bumps whenever a slide bitmap changes. */
  renderVersion: number;
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'off';
  savedAt: number;
  leftTab: 'write' | 'photos';
  mobileTab: MobileTab;
  tip: boolean;
  decks: DeckIndexEntry[];
  /** Posting status per sample/deck key (see libraryData.markKey…). */
  marks: PostMarks;
  busy: string | null;
  /** Slide index whose start the editor should jump to (consumed by the editor). */
  jump: { line: number; seq: number } | null;
}

/** All warnings (parser + renderer) for the current deck. */
export function allWarnings(s: AppState): Warning[] {
  return [...s.parsed.warnings, ...s.renderWarnings.flat()];
}

export function slideWarnings(s: AppState, i: number): Warning[] {
  return [...s.parsed.warnings.filter((w) => w.slideIndex === i), ...(s.renderWarnings[i] ?? [])];
}
