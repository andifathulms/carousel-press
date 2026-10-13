import type { Slide } from './types';
/**
 * Fill badge numbers, counters, swipe hints and CTA flags (PRD §4.6).
 * `autoBadge: false` (serene, SPEC-ayah §3.3) implies number=off: only explicit `number=N` shows a badge.
 * Mutates and returns the slides.
 */
export declare function numberSlides(slides: Slide[], opts?: {
    autoBadge?: boolean;
}): Slide[];
