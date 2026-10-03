import { describe, expect, it } from 'vitest';
import { tokenizeBash } from '../src/render/highlight/bash';
import { tokenizeJs } from '../src/render/highlight/js';
import { tokenizePy } from '../src/render/highlight/py';
import { tokenizeSql } from '../src/render/highlight/sql';
import { highlightLine } from '../src/render/highlight';
import { prepareCode } from '../src/layout/codeFit';

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
