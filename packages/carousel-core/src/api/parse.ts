// parseDeck: the parser with every registered template. Safe in Node (no canvas use at import or call).
import { type ParseOptions, parse } from '../core/parser';
import type { ParseResult } from '../core/types';
import { templateFamily } from '../templates/registry';

/** Parse deck text. Templates registered with registerVariant() are accepted. Never throws. */
export function parseDeck(text: string, opts: Omit<ParseOptions, 'templateFamily'> = {}): ParseResult {
  return parse(text, { ...opts, templateFamily });
}
