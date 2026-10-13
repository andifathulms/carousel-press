import type { Rich, RichLine } from './types';
/**
 * Inline rules (PRD §4.5):
 *  `|` = line break, `\|` = literal pipe, `*text*` = accent, `` `text` `` = code.
 * Unmatched markers render literally. `**` renders literally.
 */
export declare function parseInline(src: string): RichLine[];
/**
 * Multi-line text → Rich. Each source line is a hard break; a blank line
 * starts a new paragraph.
 */
export declare function parseRich(sourceLines: readonly string[]): Rich;
/** Plain text of a Rich value (lines joined by spaces, paragraphs by newlines). */
export declare function richToPlain(rich: Rich): string;
export declare function isEmptyRich(rich: Rich): boolean;
/** Capitals for display headlines (sport family). Inline code keeps its case. */
export declare function upperRich(rich: Rich): Rich;
