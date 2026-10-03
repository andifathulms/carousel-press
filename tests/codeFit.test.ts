import { describe, expect, it } from 'vitest';
import { fakeMeasurer as m } from '../src/layout/measure';
import { fitCodeWidth, lineText, prepareCode } from '../src/layout/codeFit';

const sizes = { max: 44, min: 28, step: 2 };

describe('bash prompt', () => {
  it('prefixes commands, skips comments, blanks and continuations', () => {
    const lines = prepareCode('# setup\ngit commit -m "fix" \\\n  --no-verify\n\n$ npm test', 'bash');
    expect(lines.map(lineText)).toEqual(['# setup', '$ git commit -m "fix" \\', '  --no-verify', '', '$ npm test']);
    expect(lines[2]!.continuation).toBe(true);
    expect(lines[4]!.text).toBe('npm test');
  });
  it('never adds a second prompt', () => {
    expect(prepareCode('$ ls', 'sh').map(lineText)).toEqual(['$ ls']);
  });
  it('does not touch other languages', () => {
    expect(prepareCode('const a = 1', 'js').map(lineText)).toEqual(['const a = 1']);
  });
});

describe('fitCodeWidth', () => {
  it('picks the largest size whose widest line fits (prompt included)', () => {
    // "$ git status" = 12 chars; at 44 → 316.8px
    const fit = fitCodeWidth(prepareCode('git status', 'bash'), 744, 'JetBrains Mono', 400, sizes, m);
    expect(fit).toMatchObject({ size: 44, fits: true });
  });
  it('steps down for wider lines', () => {
    // 30 chars + prompt = 32 chars: 32 × 0.6 × s ≤ 744 → s ≤ 38.75 → 38
    const fit = fitCodeWidth(prepareCode('x'.repeat(30), 'bash'), 744, 'JetBrains Mono', 400, sizes, m);
    expect(fit).toMatchObject({ size: 38, fits: true });
  });
  it('reports code-line-too-long at min size', () => {
    const fit = fitCodeWidth(prepareCode('y'.repeat(60), 'js'), 744, 'JetBrains Mono', 400, sizes, m);
    expect(fit).toMatchObject({ size: 28, fits: false });
  });
});
