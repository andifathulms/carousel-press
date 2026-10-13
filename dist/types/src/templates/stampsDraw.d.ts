import type { Ctx } from '../render/ctx';
import type { Placed } from '../layout/stack';
import type { SlideLayout } from './common';
/** Returns true when it drew the item. */
export declare function drawStampItem(ctx: Ctx, p: Placed, L: SlideLayout): boolean;
