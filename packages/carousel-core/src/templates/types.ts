import type { FamilyId, TemplateId } from '../core/types';

/** DESIGN §4.1 */
export interface Surface {
  bg: string;
  ink: string;
  body: string;
  muted: string;
  accent: string;
  badgeBg: string;
  badgeInk: string;
  blob: string;
  icon: string;
  inlineCodeBg: string;
}

export interface CodeTheme {
  panel: string;
  border: string;
  text: string;
  prompt: string;
  command: string;
  subcommand: string;
  flag: string;
  string: string;
  comment: string;
  number: string;
  keyword: string;
  fn: string;
  punct: string;
  dots: [string, string, string] | null;
}

export interface Deco {
  blobs: boolean;
  dotGrid: boolean;
  scanlines: boolean;
  glow: boolean;
  bigGlyph: string | null;
  /** Dot grid fill (colour with alpha). */
  dotColor?: string;
  /** Peak alpha of the accent glow. */
  glowAlpha?: number;
  /** Lexicon: double rule under the header (kamus). */
  doubleRule?: boolean;
  /** Lexicon: ruled notebook lines + margin line (notebook). */
  notebook?: boolean;
  /** Lexicon: rules every 72 px and a margin line on the right, for RTL writing (lexicon/arab). */
  notebookRight?: boolean;
  /** Lexicon: a small rounded accent square top-right, with no characters in it (lexicon/hanzi). */
  seal?: boolean;
  /** Cover/end (deep surface) pattern: an 8-fold star lattice (lexicon/arab) or gold 回纹 fret bands (lexicon/hanzi). */
  coverPattern?: 'girih' | 'huiwen';
  /** Lexicon: large faint glyph off the bottom-right corner. */
  cornerGlyph?: string;
  /** Faint ruled grid: spreadsheet cells (dev/sheet) or square exam paper (lexicon/lembar). */
  grid?: 'cells' | 'squares';
  /** Grid line colour (colour with alpha). Lexicon falls back to its rule token. */
  gridColor?: string;
  /** Editorial: the large opening quote mark on quote slides (default on). */
  quoteMark?: boolean;
  /** Serene: thin inset frame + 8-point star ornament (SPEC-ayah §4). */
  frame?: boolean;
  /** Serene: photos are darkened at least this much (0–100, SPEC-ayah §3.3). */
  minDarkness?: number;
}

/** Extra tokens for word/table/compare slides (SPEC-lexicon §3.2). Derived for other families. */
export interface LexTokens {
  rule: string;
  highlight: string;
  okBg: string;
  okInk: string;
  badBg: string;
  badInk: string;
  /** Notebook margin line. */
  margin?: string;
  /** Arabic root letters (SPEC-script §10.1). Default: accent. */
  root?: string;
  /** Hanzi practice-box lines (SPEC-script §10.2). Decorative. Default: rule. */
  grid?: string;
  /** Tone colours 1–4 + neutral (SPEC-script §5.4). Absent = no tone colouring. */
  tones?: [string, string, string, string, string];
}

export interface Variant {
  id: TemplateId;
  name: string;
  family: FamilyId;
  fonts: { serif?: string; sans: string; mono: string };
  surfaces: Record<string, Surface> & { deep: Surface };
  rotation: string[];
  onPhoto: Surface & { tint: string };
  code: CodeTheme;
  deco: Deco;
  swatches: [string, string, string, string];
  /** Headline weight override (dev/terminal; editorial/ruang-* softens serif 700 headlines) and an accent prefix on cover/card headlines. */
  headlineWeight?: number;
  headlinePrefix?: string;
  /** Editorial: cover/card/end headlines in the sans face at `headlineWeight` (default 700) instead of
   * the serif; quotes keep the serif (editorial/tameng: today's problem in sans, the old answer in serif). */
  headlineFace?: 'serif' | 'sans';
  /** Editorial: quote text weight (default 600). Gentium Book Plus only ships 400 and 700. */
  quoteWeight?: number;
  /** Editorial: quote text size range (default 76 → 52), for variants whose quote slide is the hero. */
  quoteSize?: { max: number; min: number };
  /** Surface for quote slides that don't set `surface=` (editorial/tameng: the paper quote slide). */
  quoteSurface?: string;
  /** Overrides the family's header right side (dev/sheet: a rule instead of the terminal path). */
  headerRight?: 'path' | 'rule';
  /** Sport: headlines (cover, card, end) are drawn in capitals. */
  headlineUpper?: boolean;
  /** Verdict and diagram colours (ok / warn / bad). Families without them derive from the surface. */
  semantic?: { ok: string; warn: string; bad: string };
  /** Lexicon family only; other families derive these (templates/lexicon/tokens.ts). */
  lex?: LexTokens;
  /** Per-surface overrides of the lexicon tokens (e.g. `root` on deep). Applied on top of `lex` or the derived set. */
  lexSurfaces?: Record<string, Partial<LexTokens>>;
}
