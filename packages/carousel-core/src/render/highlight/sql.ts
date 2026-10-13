import { tokenizeCLike } from './clike';
import type { Token } from './types';

const KEYWORDS = new Set(
  ('SELECT FROM WHERE JOIN LEFT RIGHT INNER ON GROUP BY ORDER HAVING LIMIT INSERT INTO VALUES UPDATE SET DELETE ' +
    'CREATE TABLE INDEX AS AND OR NOT NULL IS IN LIKE DISTINCT COUNT SUM AVG').split(' '),
);

export function tokenizeSql(line: string): Token[] {
  return tokenizeCLike(line, {
    keywords: KEYWORDS, caseInsensitive: true, lineComment: ['--'], quotes: ["'"], fnCalls: false,
  });
}
