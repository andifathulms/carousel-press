import type { FamilyId, TemplateId } from '../core/types';
import type { Ctx } from '../render/ctx';
import type { LayoutInput, SlideLayout } from './common';
import type { Variant } from './types';
/** A family is layout code; a variant is data. */
export interface FamilyLayout {
    layout(input: LayoutInput): SlideLayout;
    draw(ctx: Ctx, layout: SlideLayout): void;
}
export declare const FAMILIES: Record<FamilyId, FamilyLayout>;
/** The variants that ship with the package (review page, tests). */
export declare const VARIANTS: readonly Variant[];
/** Thrown by registerVariant() with every problem found. */
export declare class VariantError extends Error {
    readonly id: string;
    readonly issues: string[];
    constructor(id: string, issues: string[]);
}
/** Every problem with a variant; [] when registerVariant() would accept it. */
export declare function checkVariant(v: Variant): string[];
/**
 * Add a host variant on an existing family. Throws VariantError when the id,
 * structure or DESIGN §4.4 contrast checks fail, when the id is a built-in,
 * or when it's already registered (unless `replace`).
 */
export declare function registerVariant(v: Variant, opts?: {
    replace?: boolean;
}): Variant;
export declare function hasVariant(id: string): boolean;
export declare function getVariant(id: TemplateId): Variant;
/** Built-in variants, then registered ones in registration order. */
export declare function listVariants(): readonly Variant[];
/** The parser's template lookup (ParseOptions.templateFamily) over every registered variant. */
export declare function templateFamily(id: string): FamilyId | undefined;
export declare function getFamily(family: FamilyId): FamilyLayout;
