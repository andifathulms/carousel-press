import type { FamilyId, TemplateId } from '../core/types';
import { BUILTIN_TEMPLATE_IDS } from '../core/types';
import type { Ctx } from '../render/ctx';
import type { LayoutInput, SlideLayout } from './common';
import type { Variant } from './types';
import { validateVariant } from './validate';
import { EDITORIAL_VARIANTS } from './editorial/variants';
import { DEV_VARIANTS } from './dev/variants';
import { layoutEditorial } from './editorial/layout';
import { drawEditorial } from './editorial/draw';
import { layoutDev } from './dev/layout';
import { drawDev } from './dev/draw';
import { LEXICON_VARIANTS } from './lexicon/variants';
import { drawLexicon } from './lexicon/draw';
import { SERENE_VARIANTS } from './serene/variants';
import { SPORT_VARIANTS } from './sport/variants';
import { layoutSerene } from './serene/layout';
import { drawSerene } from './serene/draw';

/** A family is layout code; a variant is data. */
export interface FamilyLayout {
  layout(input: LayoutInput): SlideLayout;
  draw(ctx: Ctx, layout: SlideLayout): void;
}

export const FAMILIES: Record<FamilyId, FamilyLayout> = {
  editorial: { layout: (input) => layoutEditorial(input), draw: drawEditorial },
  dev: { layout: layoutDev, draw: drawDev },
  // Normal slides use the editorial layout with lexicon tokens and fonts.
  lexicon: { layout: (input) => layoutEditorial(input), draw: drawLexicon },
  serene: { layout: layoutSerene, draw: drawSerene },
  // Sport reuses the dev layout: display face + capitals for headlines, no terminal path.
  sport: { layout: layoutDev, draw: drawDev },
};

/** The variants that ship with the package (review page, tests). */
export const VARIANTS: readonly Variant[] = [...EDITORIAL_VARIANTS, ...DEV_VARIANTS, ...LEXICON_VARIANTS, ...SERENE_VARIANTS, ...SPORT_VARIANTS];

const BY_ID = new Map<string, Variant>(VARIANTS.map((v) => [v.id, v]));
const BUILTIN = new Set<string>(BUILTIN_TEMPLATE_IDS);

/** Thrown by registerVariant() with every problem found. */
export class VariantError extends Error {
  constructor(readonly id: string, readonly issues: string[]) {
    super(`registerVariant("${id}") failed:\n- ${issues.join('\n- ')}`);
    this.name = 'VariantError';
  }
}

/** Every problem with a variant; [] when registerVariant() would accept it. */
export function checkVariant(v: Variant): string[] {
  return validateVariant(v, Object.keys(FAMILIES) as FamilyId[]);
}

/**
 * Add a host variant on an existing family. Throws VariantError when the id,
 * structure or DESIGN §4.4 contrast checks fail, when the id is a built-in,
 * or when it's already registered (unless `replace`).
 */
export function registerVariant(v: Variant, opts: { replace?: boolean } = {}): Variant {
  const id = String(v?.id);
  const issues = checkVariant(v);
  if (BUILTIN.has(id)) issues.unshift('built-in templates can\'t be replaced');
  else if (BY_ID.has(id) && !opts.replace) issues.unshift('already registered (pass { replace: true } to update it)');
  if (issues.length) throw new VariantError(id, issues);
  const frozen = Object.freeze({ ...v });
  BY_ID.set(id, frozen);
  return frozen;
}

export function hasVariant(id: string): boolean {
  return BY_ID.has(id);
}

export function getVariant(id: TemplateId): Variant {
  const v = BY_ID.get(id);
  if (!v) throw new Error(`Unknown template ${id}`);
  return v;
}

/** Built-in variants, then registered ones in registration order. */
export function listVariants(): readonly Variant[] {
  return [...BY_ID.values()];
}

/** The parser's template lookup (ParseOptions.templateFamily) over every registered variant. */
export function templateFamily(id: string): FamilyId | undefined {
  return BY_ID.get(id)?.family;
}

export function getFamily(family: FamilyId): FamilyLayout {
  return FAMILIES[family];
}
