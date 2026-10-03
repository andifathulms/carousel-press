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
  /** Dev/terminal: headline weight override and an accent prefix on cover/card headlines. */
  headlineWeight?: number;
  headlinePrefix?: string;
}
