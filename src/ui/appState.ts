import type { ParseResult, Warning } from 'carousel-core/src/core/types';
import type { DeckIndexEntry, PostMarks } from '../store/deckStore';
import type { PhotoMeta } from '../store/photoStore';
import type { Variant } from 'carousel-core/src/templates/types';

export type LeftTab = 'write' | 'photos' | 'style';
/** Phone (< 768 px) shows one panel at a time; the preview is its own tab. */
export type MobileTab = LeftTab | 'preview';

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
  leftTab: LeftTab;
  mobileTab: MobileTab;
  /** Queue (pick a deck) or Studio (write and check it). */
  view: 'queue' | 'studio';
  /** Focus mode: only the slides (editor and thumbnail rail hidden). */
  focus: boolean;
  /** The Publish sheet (save, copy title/caption, mark as posted). */
  publishOpen: boolean;
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
