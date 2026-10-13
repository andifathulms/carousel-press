import type { Ctx } from './ctx';
import type { Placed } from '../layout/stack';
import { type SlideLayout } from '../templates/common';
import type { Surface } from '../templates/types';
/** Handle (left) and rule / path tag (right). */
export declare function drawHeader(ctx: Ctx, L: SlideLayout, handleColor: string, rightColor: string): void;
/** Swipe hint (left, arrow drawn as an icon) and tabular counter (right). */
export declare function drawFooter(ctx: Ctx, L: SlideLayout, swipeColor: string, counterColor: string): void;
/** CTA pill: bookmark icon + label (DESIGN §3.8). */
export declare function drawCta(ctx: Ctx, p: Placed, label: string, s: Surface, sans: string): void;
/** A placed text block in its tone colour. */
export declare function drawTextBlock(ctx: Ctx, p: Placed, s: Surface, onPhoto: boolean, center?: boolean): void;
/** Clip everything below the stack limit when the slide overflows. */
export declare function clipToStack(ctx: Ctx): void;
