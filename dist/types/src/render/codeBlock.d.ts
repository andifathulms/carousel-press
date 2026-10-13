import type { Ctx } from './ctx';
import type { CodeTheme } from '../templates/types';
import type { Placed } from '../layout/stack';
/** DESIGN §6.4 panel details shared by both families. */
export declare const CODE_CHROME: {
    border: number;
    dotR: number;
    dotX: readonly [36, 64, 92];
    labelSize: number;
    labelRight: number;
    fade: number;
};
/** Draw a code panel for a placed `code` stack item. */
export declare function drawCodeBlock(ctx: Ctx, p: Placed, theme: CodeTheme, mono: string, radius: number, width: number): void;
