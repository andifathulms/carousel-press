import type { FamilyId, ParseResult, Slide, TemplateId, Warning } from './types';
export interface ParseOptions {
    /** Template used when the header has none (last used). */
    defaultTemplate?: TemplateId;
    /** Handle used when the header has none (from Settings). */
    defaultHandle?: string;
    /** Photo IDs in tray order. When given, `photo=` is resolved and checked (see resolvePhotos). */
    photoIds?: readonly string[];
    /**
     * Family of every template the host accepts, undefined for unknown ids.
     * Default: the built-in templates only. The package's parseDeck passes the registry.
     */
    templateFamily?: (id: string) => FamilyId | undefined;
}
export declare const HEADER_KEYS: readonly ["handle", "template", "lang", "title", "caption", "counter"];
/** Split text into lines: accepts \n and \r\n. */
export declare function splitLines(text: string): string[];
/** Line index of the separator that ends the header, or -1 when there's no header. */
export declare function findHeaderEnd(lines: readonly string[]): number;
interface TagToken {
    key: string;
    value: string | true;
    /** A quoted value that never closed: it runs to the end of the tag. */
    unclosed?: true;
}
/** Tokenise the inside of `[ ... ]`. Values may be bare or "quoted" with \" escapes. */
export declare function tokenizeTag(inner: string): TagToken[];
/** Parse deck text. Never throws. */
export declare function parse(text: unknown, opts?: ParseOptions): ParseResult;
/**
 * Resolve every `photo=` against the tray the slides render with. An integer
 * is always a 1-based tray index, never an ID. Sets `photoId` (null when
 * unresolved) and returns `unknown-photo` warnings.
 */
export declare function resolvePhotos(slides: readonly Slide[], trayIds: readonly string[]): Warning[];
export {};
