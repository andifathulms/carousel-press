import type { TemplateId } from '../core/types';
import { TEMPLATE_IDS } from '../core/types';
import type { Variant } from './types';
import { EDITORIAL_VARIANTS } from './editorial/variants';
import { DEV_VARIANTS } from './dev/variants';

export const VARIANTS: readonly Variant[] = [...EDITORIAL_VARIANTS, ...DEV_VARIANTS];

const BY_ID = new Map<string, Variant>(VARIANTS.map((v) => [v.id, v]));

export function getVariant(id: TemplateId): Variant {
  const v = BY_ID.get(id);
  if (!v) throw new Error(`Unknown template ${id}`);
  return v;
}

export function allTemplateIds(): readonly TemplateId[] {
  return TEMPLATE_IDS;
}
