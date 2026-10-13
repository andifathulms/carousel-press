import type { Diagram } from '../core/diagram';
import type { Ctx } from './ctx';
export interface DiagramColors {
    turf: string;
    line: string;
    att: string;
    def: string;
    ink: string;
    bg: string;
    accent: string;
}
export interface DiagramFonts {
    sans: string;
    display: string;
    displayWeight: number;
}
interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}
export declare function drawDiagram(ctx: Ctx, d: Diagram, box: Rect, c: DiagramColors, f: DiagramFonts): void;
export {};
