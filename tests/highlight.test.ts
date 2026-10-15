import { describe, expect, it } from 'vitest';
import { tokenizeBash } from 'carousel-core/src/render/highlight/bash';
import { tokenizeJs } from 'carousel-core/src/render/highlight/js';
import { tokenizePy } from 'carousel-core/src/render/highlight/py';
import { tokenizeSql } from 'carousel-core/src/render/highlight/sql';
import { tokenizeExcel } from 'carousel-core/src/render/highlight/excel';
import { highlightLine } from 'carousel-core/src/render/highlight';
import { prepareCode } from 'carousel-core/src/layout/codeFit';

const kinds = (ts: { text: string; kind: string }[]) => ts.filter((t) => t.text.trim()).map((t) => `${t.kind}:${t.text.trim()}`);

describe('bash', () => {
  it('command, subcommand, flags, strings', () => {
    expect(kinds(tokenizeBash('git commit -m "fix" --no-verify'))).toEqual([
      'command:git', 'subcommand:commit', 'flag:-m', 'string:"fix"', 'flag:--no-verify',
    ]);
  });
  it('subcommand only for known tools', () => {
    expect(kinds(tokenizeBash('ls src'))).toEqual(['command:ls', 'text:src']);
  });
  it('comments, variables and operators', () => {
    expect(kinds(tokenizeBash('echo $HOME && cat ${FILE} >> out # done'))).toEqual([
      'command:echo', 'flag:$HOME', 'punct:&&', 'command:cat', 'flag:${FILE}', 'punct:>>', 'text:out', 'comment:# done',
    ]);
  });
  it('continuation lines have no command', () => {
    expect(kinds(tokenizeBash('  --no-verify', true))).toEqual(['flag:--no-verify']);
  });
  it('highlights a prompt from prepared lines', () => {
    const [a, b] = prepareCode('git commit -m "fix" \\\n  --no-verify', 'bash');
    expect(kinds(highlightLine(a!, 'bash'))[0]).toBe('prompt:$');
    expect(kinds(highlightLine(a!, 'bash')).at(-1)).toBe('punct:\\');
    expect(kinds(highlightLine(b!, 'bash'))).toEqual(['flag:--no-verify']);
  });
});

describe('P1 languages', () => {
  it('js', () => {
    expect(kinds(tokenizeJs('const n = add(1, `x`) // hi'))).toEqual([
      'keyword:const', 'text:n', 'punct:=', 'fn:add', 'punct:(', 'number:1', 'punct:,', 'string:`x`', 'punct:)', 'comment:// hi',
    ]);
  });
  it('py', () => {
    expect(kinds(tokenizePy('def f(x): return """doc"""  # c'))).toEqual([
      'keyword:def', 'fn:f', 'punct:(', 'text:x', 'punct:):', 'keyword:return', 'string:"""doc"""', 'comment:# c',
    ]);
  });
  it('sql is case-insensitive', () => {
    expect(kinds(tokenizeSql("select * from users where name = 'a' -- x"))).toEqual([
      'keyword:select', 'punct:*', 'keyword:from', 'text:users', 'keyword:where', 'text:name', 'punct:=', "string:'a'", 'comment:-- x',
    ]);
  });
  it('unknown language is plain text', () => {
    expect(highlightLine({ prompt: false, text: 'x = 1', continuation: false }, 'rust')).toEqual([{ text: 'x = 1', kind: 'text' }]);
  });
});

describe('excel', () => {
  it('functions, ranges, strings with ; separators', () => {
    expect(kinds(tokenizeExcel('=XLOOKUP(F2;A2:A6;B2:B6;"Tidak ada")'))).toEqual([
      'punct:=', 'fn:XLOOKUP', 'punct:(', 'subcommand:F2', 'punct:;', 'subcommand:A2:A6', 'punct:;',
      'subcommand:B2:B6', 'punct:;', 'string:"Tidak ada"', 'punct:)',
    ]);
  });
  it('absolute and sheet references, whole columns, booleans', () => {
    expect(kinds(tokenizeExcel("=VLOOKUP($F$2,Data!A:D,2,FALSE)"))).toEqual([
      'punct:=', 'fn:VLOOKUP', 'punct:(', 'subcommand:$F$2', 'punct:,', 'subcommand:Data!A:D', 'punct:,',
      'number:2', 'punct:,', 'keyword:FALSE', 'punct:)',
    ]);
  });
  it('decimal comma only in ; formulas, percentages, doubled quotes, error values', () => {
    expect(kinds(tokenizeExcel('=ROUND(A1*1,5;0)'))).toContain('number:1,5');
    expect(kinds(tokenizeExcel('=ROUND(A1*1,5)'))).toEqual(['punct:=', 'fn:ROUND', 'punct:(', 'subcommand:A1', 'punct:*', 'number:1', 'punct:,', 'number:5', 'punct:)']);
    expect(kinds(tokenizeExcel('=A1*10%'))).toContain('number:10%');
    expect(kinds(tokenizeExcel('="a""b"'))).toEqual(['punct:=', 'string:"a""b"']);
    expect(kinds(tokenizeExcel('=IFERROR(A1;#N/A)'))).toContain('keyword:#N/A');
  });
  it('dotted function names and the language aliases', () => {
    expect(kinds(tokenizeExcel('=STDEV.S(B2:B9)'))[1]).toBe('fn:STDEV.S');
    for (const l of ['excel', 'xlsx', 'sheets', 'formula']) {
      expect(highlightLine({ prompt: false, text: '=SUM(A1:A3)', continuation: false }, l)[1]).toEqual({ text: 'SUM', kind: 'fn' });
    }
  });
  it('never throws on random input', () => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
    const chars = 'AZaz09$:;,."!#()%=*-+ /\\\'';
    for (let n = 0; n < 500; n++) {
      const t = Array.from({ length: Math.floor(rnd() * 40) }, () => chars[Math.floor(rnd() * chars.length)]).join('');
      expect(tokenizeExcel(t).map((x) => x.text).join('')).toBe(t);
    }
  });
});
