import type { FamilyId, Slide } from './types';
import { hash } from './hash';

/** Editorial auto pool, in DESIGN §7 order. */
export const EDITORIAL_ICONS = [
  'heart-spark', 'mountain', 'shield-heart', 'smile', 'leaf', 'home', 'chat', 'coffee', 'sun',
  'moon', 'star', 'book', 'plane', 'gift', 'map-pin', 'music', 'flower', 'umbrella', 'key', 'heart',
] as const;

/** Dev auto pool. */
export const DEV_ICONS = [
  'terminal', 'code', 'git-branch', 'bug', 'rocket', 'check-circle', 'alert', 'folder',
  'database', 'cpu', 'lightbulb', 'clock',
] as const;

/** UI-on-slide icons (not in pools, not selectable with icon=). */
export const UI_ICONS = ['arrow-right', 'circle-arrow', 'bookmark'] as const;

/**
 * Short aliases accepted by `icon=` (the PRD sample uses `icon=shield`).
 */
export const ICON_ALIASES: Record<string, PoolIcon> = {
  shield: 'shield-heart',
  spark: 'heart-spark',
  pin: 'map-pin',
  branch: 'git-branch',
  bulb: 'lightbulb',
  check: 'check-circle',
};

export type EditorialIcon = (typeof EDITORIAL_ICONS)[number];
export type DevIcon = (typeof DEV_ICONS)[number];
export type PoolIcon = EditorialIcon | DevIcon;
export type UiIcon = (typeof UI_ICONS)[number];
export type IconName = PoolIcon | UiIcon;

const POOL_SET = new Set<string>([...EDITORIAL_ICONS, ...DEV_ICONS]);

/** Normalise an `icon=` value. Returns null if unknown. */
export function canonicalIcon(name: string): PoolIcon | null {
  const n = name.toLowerCase();
  if (POOL_SET.has(n)) return n as PoolIcon;
  return ICON_ALIASES[n] ?? null;
}

export function poolFor(family: FamilyId): readonly PoolIcon[] {
  return family === 'dev' ? DEV_ICONS : EDITORIAL_ICONS;
}

/**
 * Resolve each slide's icon for a family. `auto` picks from the pool with
 * index = hash(slug + ':' + slideIndex) mod len, avoiding a repeat of the
 * previous slide's icon. Cover slides never carry an icon.
 */
export function resolveIcons(slides: readonly Slide[], slug: string, family: FamilyId): (PoolIcon | null)[] {
  const pool = poolFor(family);
  const out: (PoolIcon | null)[] = [];
  let prev: PoolIcon | null = null;
  for (const s of slides) {
    let icon: PoolIcon | null = null;
    if (s.type !== 'cover') {
      const raw = s.attrs.icon ?? (family === 'dev' ? 'none' : 'auto');
      if (raw === 'auto') {
        // End slides have a CTA as their closing element; auto icons stay off.
        if (s.type !== 'end') {
          let idx = hash(`${slug}:${s.index}`) % pool.length;
          if (pool[idx] === prev) idx = (idx + 1) % pool.length;
          icon = pool[idx] ?? null;
        }
      } else if (raw !== 'none') {
        icon = canonicalIcon(raw);
      }
    }
    out.push(icon);
    prev = icon;
  }
  return out;
}
