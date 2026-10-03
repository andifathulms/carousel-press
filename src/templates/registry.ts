import type { FamilyId, TemplateId } from '../core/types';
import { TEMPLATE_IDS } from '../core/types';
import type { Ctx } from '../render/ctx';
import type { LayoutInput, SlideLayout } from './common';
import type { Variant } from './types';
import { EDITORIAL_VARIANTS } from './editorial/variants';
import { DEV_VARIANTS } from './dev/variants';
import { layoutEditorial } from './editorial/layout';
import { drawEditorial } from './editorial/draw';
import { layoutDev } from './dev/layout';
import { drawDev } from './dev/draw';

/** A family is layout code; a variant is data. */
export interface FamilyLayout {
  layout(input: LayoutInput): SlideLayout;
  draw(ctx: Ctx, layout: SlideLayout): void;
}

export const FAMILIES: Record<FamilyId, FamilyLayout> = {
  editorial: { layout: layoutEditorial, draw: drawEditorial },
  dev: { layout: layoutDev, draw: drawDev },
};

export const VARIANTS: readonly Variant[] = [...EDITORIAL_VARIANTS, ...DEV_VARIANTS];

const BY_ID = new Map<string, Variant>(VARIANTS.map((v) => [v.id, v]));

export function getVariant(id: TemplateId): Variant {
  const v = BY_ID.get(id);
  if (!v) throw new Error(`Unknown template ${id}`);
  return v;
}

export function getFamily(family: FamilyId): FamilyLayout {
  return FAMILIES[family];
}

export function allTemplateIds(): readonly TemplateId[] {
  return TEMPLATE_IDS;
}
