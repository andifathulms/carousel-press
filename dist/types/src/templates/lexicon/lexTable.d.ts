import type { TableData } from '../../core/types';
import { type LexLayout } from './lexLayout';
import { type LexCtx } from './lexSlides';
export declare const TABLE_STYLE: {
    top: number;
    badge: {
        d: number;
        digit: number;
        weight: number;
        gap: number;
    };
    headline: {
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        gap: number;
    };
    header: {
        size: number;
        weight: number;
        tracking: number;
    };
    body: {
        max: number;
        min: number;
        step: number;
        weight: number;
    };
    rowH: number;
    padX: number;
    radius: number;
    border: number;
    headerFill: number;
    zebra: number;
    note: {
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        gap: number;
    };
    priority: string[];
};
export declare function layoutTable(c: LexCtx, table: TableData, headline: string, note: string, badge: number | null): LexLayout;
