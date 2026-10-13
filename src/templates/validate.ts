// Variant checks (DESIGN §4.4 contrast rules + structure). Used by registerVariant()
// for host variants and by contrast.test.ts for the built-ins. Pure.
import { contrast } from '../core/color';
import type { FamilyId } from '../core/types';
import type { Surface, Variant } from './types';

export const CODE_TOKENS = ['text', 'prompt', 'command', 'subcommand', 'flag', 'string', 'number', 'keyword', 'fn', 'punct'] as const;
const COLOUR = /^(#[0-9a-f]{3}|#[0-9a-f]{6}|#[0-9a-f]{8}|rgba?\([^)]*\))$/i;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Contrast failures for one surface, e.g. "ink/bg 3.20 < 4.5". */
export function surfaceIssues(s: Surface, semantic?: Variant['semantic']): string[] {
  const out: string[] = [];
  const need = (label: string, ratio: number, min: number): void => {
    if (!(ratio >= min)) out.push(`${label} ${ratio.toFixed(2)} < ${min}`);
  };
  need('ink/bg', contrast(s.ink, s.bg), 4.5);
  need('ink/blob', contrast(s.ink, s.blob), 4.5);
  need('body/bg', contrast(s.body, s.bg), 4.5);
  need('body/blob', contrast(s.body, s.blob), 4.5);
  need('badgeInk/badgeBg', contrast(s.badgeInk, s.badgeBg), 3);
  need('muted/bg', contrast(s.muted, s.bg), 3);
  // Verdict stamps and diagram marks are large and bold: 3:1 like badges.
  if (semantic) for (const [k, c] of Object.entries(semantic)) need(`semantic.${k}/bg`, contrast(c, s.bg), 3);
  return out;
}

/** Code token contrast on the panel: 4.5:1, comments 3:1. */
export function codeIssues(code: Variant['code']): string[] {
  const out: string[] = [];
  for (const k of CODE_TOKENS) {
    const r = contrast(code[k], code.panel);
    if (!(r >= 4.5)) out.push(`code.${k} ${r.toFixed(2)} < 4.5`);
  }
  const rc = contrast(code.comment, code.panel);
  if (!(rc >= 3)) out.push(`code.comment ${rc.toFixed(2)} < 3`);
  return out;
}

/**
 * Every problem with a variant, as readable strings; [] when it's valid.
 * `families` lists the families a variant may use.
 */
export function validateVariant(v: Variant, families: readonly FamilyId[]): string[] {
  const issues: string[] = [];
  if (typeof v?.id !== 'string' || !ID.test(v.id)) issues.push(`id "${String(v?.id)}" must look like "family-or-host/name" (lowercase, digits, -)`);
  if (!families.includes(v?.family)) issues.push(`family "${String(v?.family)}" is not one of ${families.join(', ')}`);
  if (!v?.fonts?.sans || !v.fonts.mono) issues.push('fonts.sans and fonts.mono are required');
  if (!v?.surfaces?.deep) issues.push('surfaces.deep is required');
  if (!v?.onPhoto) issues.push('onPhoto is required');
  if (!v?.code) issues.push('code is required');
  if (!Array.isArray(v?.rotation) || !v.rotation.length) issues.push('rotation needs at least one surface name');
  else for (const r of v.rotation) if (!v.surfaces?.[r]) issues.push(`rotation names unknown surface "${r}"`);
  if (issues.length) return issues;
  const colours: [string, unknown][] = [
    ...Object.entries(v.surfaces).flatMap(([n, s]) => Object.entries(s).map(([k, c]) => [`surfaces.${n}.${k}`, c] as [string, unknown])),
    ...Object.entries(v.onPhoto).map(([k, c]) => [`onPhoto.${k}`, c] as [string, unknown]),
    ...Object.entries(v.code).filter(([k]) => k !== 'dots').map(([k, c]) => [`code.${k}`, c] as [string, unknown]),
  ];
  for (const [label, c] of colours) if (typeof c !== 'string' || !COLOUR.test(c.trim())) issues.push(`${label} "${String(c)}" is not #RGB, #RRGGBB or rgb(a)()`);
  if (issues.length) return issues;
  for (const [name, s] of Object.entries(v.surfaces)) {
    try {
      issues.push(...surfaceIssues(s, v.semantic).map((x) => `surfaces.${name}: ${x}`));
    } catch (err) {
      issues.push(`surfaces.${name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  try {
    issues.push(...codeIssues(v.code));
  } catch (err) {
    issues.push(`code: ${err instanceof Error ? err.message : String(err)}`);
  }
  return issues;
}
