import { describe, expect, it } from 'vitest';
import { parse } from '../src/core/parser';

const deck = (body: string) => parse(`template: dev/github-dark\n---\n${body}`).deck;

describe('numbering', () => {
  it('numbers card and code slides in order', () => {
    const d = deck('Cover\n---\nA\n---\n[code]\nB\n```\nx\n```\n---\n[quote]\nQ\n---\nC\n---\n[end]\nE');
    expect(d.slides.map((s) => s.badge)).toEqual([null, 1, 2, null, 3, null]);
  });
  it('number=off skips without consuming', () => {
    const d = deck('Cover\n---\n[number=off]\nA\n---\nB\n---\nC');
    expect(d.slides.map((s) => s.badge)).toEqual([null, null, 1, 2]);
  });
  it('number=N displays N and the running count continues', () => {
    const d = deck('Cover\n---\nA\n---\n[number=7]\nB\n---\nC');
    expect(d.slides.map((s) => s.badge)).toEqual([null, 1, 7, 3]);
  });
  it('counter totals cover every rendered slide', () => {
    const d = deck('Cover\n---\n\n---\nA\n---\n[end]\nE');
    expect(d.slides.map((s) => `${s.counter.i}/${s.counter.total}`)).toEqual(['1/3', '2/3', '3/3']);
  });
  it('sets swipe and cta flags', () => {
    const d = deck('Cover\n---\nA\n---\n[cta]\nB\n---\n[end]\nE');
    expect(d.slides.map((s) => s.swipe)).toEqual(['coverSwipe', 'swipe', null, null]);
    expect(d.slides.map((s) => s.showCta)).toEqual([false, false, true, true]);
  });
  it('counts content slides for surface rotation', () => {
    const d = deck('Cover\n---\nA\n---\n[quote]\nB\n---\nC\n---\n[end]\nE');
    expect(d.slides.map((s) => s.contentIndex)).toEqual([-1, 0, 1, 2, -1]);
  });
});
