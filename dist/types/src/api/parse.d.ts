import { type ParseOptions } from '../core/parser';
import type { ParseResult } from '../core/types';
/** Parse deck text. Templates registered with registerVariant() are accepted. Never throws. */
export declare function parseDeck(text: string, opts?: Omit<ParseOptions, 'templateFamily'>): ParseResult;
