import type { Rich } from '../core/types';
import type { TextMeasurer } from './measure';
import { type WrapResult } from './wrap';
import { type CodeLineSrc } from './codeFit';
export type TextRole = 'headline' | 'subtitle' | 'body' | 'note' | 'quote';
export interface TextSpec {
    family: string;
    weight: number;
    max: number;
    min: number;
    step: number;
    lh: number;
    maxLines: number;
    widowFix?: boolean;
    mono: {
        family: string;
        weight: number;
    };
}
export interface CodeSpec {
    family: string;
    weight: number;
    max: number;
    min: number;
    step: number;
    lh: number;
    maxLines: number;
    /** Panel chrome: horizontal padding (each side), top/bottom padding, title bar height. */
    padX: number;
    padTop: number;
    padBottom: number;
    titleBar: number;
}
export type FixedKind = 'badge' | 'number' | 'icon' | 'cta' | 'kicker' | 'attribution' | 'verdict' | 'diagram';
/** Colour role a renderer uses for a text block. */
export type Tone = 'ink' | 'body' | 'muted';
export type StackItem = {
    kind: 'text';
    role: TextRole;
    rich: Rich;
    spec: TextSpec;
    gap: number;
    tone: Tone;
} | {
    kind: 'code';
    lines: CodeLineSrc[];
    lang: string;
    spec: CodeSpec;
    gap: number;
} | {
    kind: FixedKind;
    h: number;
    w: number;
    gap: number;
    label?: string;
};
export interface Placed {
    item: StackItem;
    x: number;
    y: number;
    w: number;
    h: number;
    /** Chosen font size (text/code). */
    size: number;
    wrap?: WrapResult;
    /** Code: widest line fits the panel at `size`. */
    codeFits?: boolean;
}
export interface StackResult {
    placed: Placed[];
    bottom: number;
    overflow: boolean;
    codeTooLong: boolean;
    charBroken: boolean;
    droppedIcon: boolean;
}
export interface StackFrame {
    x: number;
    width: number;
    top: number;
    limit: number;
}
/** Stack-fit algorithm shared by both families. Pure given a measurer. */
export declare function fitStack(items: readonly StackItem[], frame: StackFrame, m: TextMeasurer): StackResult;
