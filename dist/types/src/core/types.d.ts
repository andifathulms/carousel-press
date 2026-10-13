import type { Diagram } from './diagram';
export type SlideType = 'cover' | 'card' | 'code' | 'quote' | 'end' | 'word' | 'table' | 'compare' | 'ayah' | 'hadith' | 'diagram';
export declare const SLIDE_TYPES: readonly SlideType[];
/** Lexicon slide types (SPEC-lexicon §2): structured fields instead of headline + body. */
export type LexType = 'word' | 'table' | 'compare';
export declare function isLexType(t: SlideType): t is LexType;
/** Arabic-text slide types (SPEC-ayah §1): field lines, Arabic drawn verbatim. */
export type ArabicType = 'ayah' | 'hadith';
export declare function isArabicType(t: SlideType): t is ArabicType;
export type Lang = 'id' | 'en';
export declare const LANGS: readonly Lang[];
export type FamilyId = 'editorial' | 'dev' | 'lexicon' | 'serene' | 'sport';
/** Templates shipped with the package. Hosts add more with registerVariant(). */
export declare const BUILTIN_TEMPLATE_IDS: readonly ["editorial/rose-dusk", "editorial/sage", "editorial/midnight", "editorial/stone", "editorial/ruang-kunyit", "editorial/ruang-bata", "editorial/ruang-daun", "editorial/ruang-malam", "dev/github-dark", "dev/terminal", "dev/paper-light", "sport/papan", "sport/lapangan", "sport/kapur", "lexicon/kamus", "lexicon/notebook", "serene/fajr", "serene/isya"];
export type BuiltinTemplateId = (typeof BUILTIN_TEMPLATE_IDS)[number];
/** `family/name`: a built-in id or one a host registered. */
export type TemplateId = string;
export declare const DEFAULT_TEMPLATE: BuiltinTemplateId;
export declare function isBuiltinTemplateId(v: string): v is BuiltinTemplateId;
/** Family of a built-in template id, or undefined for any other id. */
export declare function builtinFamilyOf(id: string): FamilyId | undefined;
export type RunStyle = 'plain' | 'accent' | 'code';
export interface Run {
    text: string;
    style: RunStyle;
}
/** One hard line (split by `|` or a newline). */
export type RichLine = Run[];
/** Lines separated by blank lines in the source. */
export type Paragraph = RichLine[];
export type Rich = Paragraph[];
export type WarningCode = 'overflow' | 'code-line-too-long' | 'unknown-header-key' | 'unknown-template' | 'unknown-slide-type' | 'unknown-attr' | 'unknown-photo' | 'missing-headline' | 'unclosed-fence' | 'code-missing-fence' | 'long-deck' | 'photo-low-res' | 'long-word' | 'unknown-field' | 'missing-word' | 'missing-field' | 'table-shape' | 'table-too-many-rows' | 'table-too-wide' | 'ipa-glyph-missing' | 'arabic-too-long' | 'arabic-font-missing' | 'unknown-lang' | 'unknown-counter' | 'diagram-line' | 'diagram-missing' | 'internal-error';
export declare const BLOCKING_CODES: readonly WarningCode[];
/** Blocking with no "Export anyway" (SPEC-ayah §5): Arabic is never exported clipped or in a fallback font. */
export declare const HARD_CODES: readonly WarningCode[];
export interface Warning {
    code: WarningCode;
    slideIndex: number | null;
    /** 0-based line in the deck text (display adds 1). */
    line: number;
    message: string;
    /** Blocks export with no override (e.g. missing-field on ayah/hadith slides). */
    hard?: true;
}
export declare function isBlocking(w: Warning): boolean;
export declare function isHard(w: Warning): boolean;
export interface SlideAttrs {
    photo?: string;
    icon?: string;
    surface?: string;
    cta?: true | string;
    number?: 'off' | number;
    kicker?: string;
    /** Card/diagram stamp label, e.g. "SAH" (PRD §4.3). */
    verdict?: string;
    tone?: VerdictTone;
}
export type VerdictTone = 'ok' | 'warn' | 'bad';
export interface CodeBlock {
    text: string;
    lang: string;
}
/** `[table]` cells as raw source (inline markers intact). First row = header. */
export interface TableData {
    header: string[];
    rows: string[][];
}
export interface Slide {
    index: number;
    type: SlideType;
    attrs: SlideAttrs;
    /** Raw source of the headline line (inline markers intact). */
    headlineSrc: string;
    headline: Rich;
    /** cover: subtitle; card/end/code/quote: body. */
    body: Rich;
    note: Rich;
    attribution: string | null;
    code: CodeBlock | null;
    /** `[word]` / `[compare]` field values (raw source), keyed by field name. */
    fields: Record<string, string>;
    table: TableData | null;
    /** `[diagram]` field and marks (PRD §4.9). */
    diagram: Diagram | null;
    /** Resolved photo id (after tray lookup) or null. */
    photoId: string | null;
    /** [startLine, endLine] inclusive, 0-based, in the deck text. */
    lines: [number, number];
    badge: number | null;
    counter: {
        i: number;
        total: number;
    };
    swipe: 'swipe' | 'coverSwipe' | null;
    showCta: boolean;
    /** 0-based position among content slides (card/code/quote), else -1. */
    contentIndex: number;
}
export interface DeckHeader {
    handle?: string;
    template?: string;
    lang?: string;
    title?: string;
    caption?: string;
    counter?: string;
}
export interface Deck {
    header: DeckHeader;
    hasHeader: boolean;
    /** Resolved template (header value if valid, else the provided default). */
    template: TemplateId;
    lang: Lang;
    handle: string;
    title: string;
    caption: string;
    /** false when the header sets `counter: off` (the i/total counter is hidden). Absent = on. */
    counter?: false;
    slug: string;
    slides: Slide[];
}
export interface ParseResult {
    deck: Deck;
    warnings: Warning[];
}
