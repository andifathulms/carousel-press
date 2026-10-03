import { describe, expect, it } from 'vitest';
import { getHeaderKey, setHeaderKey } from '../src/core/headerEdit';

describe('setHeaderKey', () => {
  it('rewrites an existing key in place', () => {
    const src = 'handle: @a\ntemplate: editorial/sage\nlang: id\n---\nHello';
    expect(setHeaderKey(src, 'template', 'dev/terminal')).toBe('handle: @a\ntemplate: dev/terminal\nlang: id\n---\nHello');
  });
  it('inserts a missing key at the end of the header', () => {
    const src = 'handle: @a\n\n---\nHello';
    expect(setHeaderKey(src, 'lang', 'en')).toBe('handle: @a\nlang: en\n\n---\nHello');
  });
  it('inserts a header when absent', () => {
    expect(setHeaderKey('Hello\n---\nWorld', 'template', 'dev/github-dark')).toBe(
      'template: dev/github-dark\n---\nHello\n---\nWorld',
    );
  });
  it('keeps CRLF line endings', () => {
    expect(setHeaderKey('lang: id\r\n---\r\nHi', 'lang', 'en')).toBe('lang: en\r\n---\r\nHi');
  });
  it('reads keys back', () => {
    expect(getHeaderKey('handle: @x\n---\nA', 'handle')).toBe('@x');
    expect(getHeaderKey('A\n---\nB', 'handle')).toBeUndefined();
  });
});
