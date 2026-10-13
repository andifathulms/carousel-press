import type { FamilyId } from '../core/types';
import type { Surface, Variant } from './types';
export declare const CODE_TOKENS: readonly ["text", "prompt", "command", "subcommand", "flag", "string", "number", "keyword", "fn", "punct"];
/** Contrast failures for one surface, e.g. "ink/bg 3.20 < 4.5". */
export declare function surfaceIssues(s: Surface, semantic?: Variant['semantic']): string[];
/** Code token contrast on the panel: 4.5:1, comments 3:1. */
export declare function codeIssues(code: Variant['code']): string[];
/**
 * Every problem with a variant, as readable strings; [] when it's valid.
 * `families` lists the families a variant may use.
 */
export declare function validateVariant(v: Variant, families: readonly FamilyId[]): string[];
