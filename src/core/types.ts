// Core data types shared by parser, layout and renderer. Pure: no DOM.

export type SlideType = 'cover' | 'card' | 'code' | 'quote' | 'end' | 'word' | 'table' | 'compare' | 'ayah' | 'hadith';
export const SLIDE_TYPES: readonly SlideType[] = ['cover', 'card', 'code', 'quote', 'end', 'word', 'table', 'compare', 'ayah', 'hadith'];

/** Lexicon slide types (SPEC-lexicon §2): structured fields instead of headline + body. */
export type LexType = 'word' | 'table' | 'compare';
export function isLexType(t: SlideType): t is LexType {
  return t === 'word' || t === 'table' || t === 'compare';
}

/** Arabic-text slide types (SPEC-ayah §1): field lines, Arabic drawn verbatim. */
export type ArabicType = 'ayah' | 'hadith';
export function isArabicType(t: SlideType): t is ArabicType {
  return t === 'ayah' || t === 'hadith';
}

export type Lang = 'id' | 'en';
export const LANGS: readonly Lang[] = ['id', 'en'];

export type FamilyId = 'editorial' | 'dev' | 'lexicon' | 'serene';

export const TEMPLATE_IDS = [
  'editorial/rose-dusk',
  'editorial/sage',
  'editorial/midnight',
  'dev/github-dark',
  'dev/terminal',
  'dev/paper-light',
  'lexicon/kamus',
  'lexicon/notebook',
  'serene/fajr',
  'serene/isya',
] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];
export const DEFAULT_TEMPLATE: TemplateId = 'editorial/rose-dusk';

export function isTemplateId(v: string): v is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(v);
}

export function familyOf(id: TemplateId): FamilyId {
  if (id.startsWith('dev/')) return 'dev';
  if (id.startsWith('serene/')) return 'serene';
  return id.startsWith('lexicon/') ? 'lexicon' : 'editorial';
}

// ---- Rich text ----------------------------------------------------------
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

// ---- Warnings -----------------------------------------------------------
export type WarningCode =
  | 'overflow'
  | 'code-line-too-long'
  | 'unknown-header-key'
  | 'unknown-template'
  | 'unknown-slide-type'
  | 'unknown-attr'
  | 'unknown-photo'
  | 'missing-headline'
  | 'unclosed-fence'
  | 'code-missing-fence'
  | 'long-deck'
  | 'photo-low-res'
  | 'long-word'
  | 'unknown-field'
  | 'missing-word'
  | 'missing-field'
  | 'table-shape'
  | 'table-too-many-rows'
  | 'table-too-wide'
  | 'ipa-glyph-missing'
  | 'arabic-too-long'
  | 'arabic-font-missing'
  | 'unknown-lang'
  | 'unknown-counter'
  | 'internal-error';

export const BLOCKING_CODES: readonly WarningCode[] = [
  'overflow', 'code-line-too-long', 'table-too-many-rows', 'table-too-wide', 'ipa-glyph-missing', 'internal-error',
  'arabic-too-long', 'arabic-font-missing',
];

/** Blocking with no "Export anyway" (SPEC-ayah §5): Arabic is never exported clipped or in a fallback font. */
export const HARD_CODES: readonly WarningCode[] = ['arabic-too-long', 'arabic-font-missing'];

export interface Warning {
  code: WarningCode;
  slideIndex: number | null;
  /** 0-based line in the deck text (display adds 1). */
  line: number;
  message: string;
  /** Blocks export with no override (e.g. missing-field on ayah/hadith slides). */
  hard?: true;
}

export function isBlocking(w: Warning): boolean {
  return !!w.hard || BLOCKING_CODES.includes(w.code);
}

export function isHard(w: Warning): boolean {
  return !!w.hard || HARD_CODES.includes(w.code);
}

// ---- Deck ---------------------------------------------------------------
export interface SlideAttrs {
  photo?: string;
  icon?: string;
  surface?: string;
  cta?: true | string;
  number?: 'off' | number;
  kicker?: string;
}

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
  /** Resolved photo id (after tray lookup) or null. */
  photoId: string | null;
  /** [startLine, endLine] inclusive, 0-based, in the deck text. */
  lines: [number, number];
  // ---- filled by numbering ----
  badge: number | null;
  counter: { i: number; total: number };
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
