import type { Slide } from './types';
/** Editorial auto pool, in DESIGN §7 order. */
export declare const EDITORIAL_ICONS: readonly ["heart-spark", "mountain", "shield-heart", "smile", "leaf", "home", "chat", "coffee", "sun", "moon", "star", "book", "plane", "gift", "map-pin", "music", "flower", "umbrella", "key", "heart"];
/** Dev auto pool. */
export declare const DEV_ICONS: readonly ["terminal", "code", "git-branch", "bug", "rocket", "check-circle", "alert", "folder", "database", "cpu", "lightbulb", "clock"];
/** UI-on-slide icons (not in pools, not selectable with icon=). */
export declare const UI_ICONS: readonly ["arrow-right", "circle-arrow", "bookmark", "x-circle"];
/**
 * Short aliases accepted by `icon=` (the PRD sample uses `icon=shield`).
 */
export declare const ICON_ALIASES: Record<string, PoolIcon>;
export type EditorialIcon = (typeof EDITORIAL_ICONS)[number];
export type DevIcon = (typeof DEV_ICONS)[number];
export type PoolIcon = EditorialIcon | DevIcon;
export type UiIcon = (typeof UI_ICONS)[number];
export type IconName = PoolIcon | UiIcon;
/** Normalise an `icon=` value. Returns null if unknown. */
export declare function canonicalIcon(name: string): PoolIcon | null;
/** A family's icons: the auto pool and what a slide without `icon=` gets. */
export interface IconPolicy {
    pool: readonly PoolIcon[];
    fallback: 'auto' | 'none';
}
/**
 * Resolve each slide's icon under a family's policy. `auto` picks from the
 * pool with index = hash(slug + ':' + slideIndex) mod len, avoiding a repeat
 * of the previous slide's icon. Cover slides never carry an icon.
 */
export declare function resolveIcons(slides: readonly Slide[], slug: string, policy: IconPolicy): (PoolIcon | null)[];
