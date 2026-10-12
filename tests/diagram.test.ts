import { describe, expect, it } from 'vitest';
import { parseDiagram } from '../src/core/diagram';
import { parse } from '../src/core/parser';
import { mulberry32 } from '../src/core/hash';

describe('diagram notation', () => {
  it('parses every mark', () => {
    const { diagram, issues } = parseDiagram('football', [
      '# comment', '', 'att 70,30 striker', 'def 36,30', 'gk 50,5', 'player 76,48 1', 'ball 45,54',
      'line 30 garis offside', 'pass 42,56 -> 70,30', 'move 10,10 20,20', 'zone 0,0 50,30', 'label 5,90 halfway',
    ]);
    expect(issues).toEqual([]);
    expect(diagram.field).toBe('football');
    expect(diagram.marks.map((m) => m.kind)).toEqual(['dot', 'dot', 'dot', 'dot', 'ball', 'line', 'arrow', 'arrow', 'zone', 'label']);
    expect(diagram.marks[0]).toEqual({ kind: 'dot', team: 'att', at: { x: 70, y: 30 }, label: 'striker' });
    expect(diagram.marks[2]).toMatchObject({ team: 'def' });
    expect(diagram.marks[6]).toEqual({ kind: 'arrow', style: 'pass', from: { x: 42, y: 56 }, to: { x: 70, y: 30 } });
  });
  it('reports bad lines and keeps the rest', () => {
    const { diagram, issues } = parseDiagram('volleyball', ['att 120,30', 'player 10,10', 'player 10,10 ABCD', 'kick 1,1', 'line x', 'ball 5,5']);
    expect(issues.map((i) => i.offset)).toEqual([0, 1, 2, 3, 4]);
    expect(diagram.marks).toEqual([{ kind: 'ball', at: { x: 5, y: 5 } }]);
  });
  it('falls back to football for an unknown field', () => {
    const { diagram, issues } = parseDiagram('rugby', []);
    expect(diagram.field).toBe('football');
    expect(issues[0]!.offset).toBe(-1);
  });
  it('never throws on random input', () => {
    const rnd = mulberry32(7);
    const chars = 'attdefgkplayerballinepassmovezone 0123456789,.-># \t';
    for (let n = 0; n < 500; n++) {
      const lines = Array.from({ length: 5 }, () => Array.from({ length: Math.floor(rnd() * 30) }, () => chars[Math.floor(rnd() * chars.length)]).join(''));
      expect(() => parseDiagram('tennis', lines)).not.toThrow();
    }
  });
});

describe('diagram slides and verdicts', () => {
  const deck = (body: string) => parse(`template: sport/papan\n---\n[cover]\nHook\n---\n${body}`);
  it('maps headline, body, fence and note', () => {
    const { deck: d, warnings } = deck('[diagram]\nSejajar saat dioper.\nSah atau offside?\n```football\natt 70,30\n---\ndef 36,30\n```\nLaw 11.1');
    // `---` inside the fence doesn't split the slide; it's just an unknown mark.
    expect(warnings.map((w) => w.code)).toEqual(['diagram-line']);
    const s = d.slides[1]!;
    expect(s.type).toBe('diagram');
    expect(s.diagram!.marks).toHaveLength(2);
    expect(s.body.flat().length).toBe(1);
    expect(s.note.flat().length).toBe(1);
    expect(d.slides).toHaveLength(2);
  });
  it('renders a diagram without a fence as a card', () => {
    const { deck: d, warnings } = deck('[diagram]\nHeadline\nbody');
    expect(d.slides[1]!.type).toBe('card');
    expect(warnings.map((w) => w.code)).toEqual(['diagram-missing']);
  });
  it('reports bad diagram lines on their own line number', () => {
    const { warnings } = deck('[diagram]\nHeadline\n```badminton\natt 1,1\nnope\n```');
    expect(warnings).toEqual([expect.objectContaining({ code: 'diagram-line', line: 9 })]);
  });
  it('parses verdict and tone on cards', () => {
    const { deck: d, warnings } = deck('[verdict="Sah" tone=ok number=off]\nSejajar itu onside.');
    expect(warnings).toEqual([]);
    expect(d.slides[1]!.attrs).toMatchObject({ verdict: 'Sah', tone: 'ok' });
  });
  it('rejects a bad tone and verdict outside card/diagram', () => {
    const { warnings } = parse('[cover verdict=SAH]\nHook\n---\n[tone=red]\nX');
    expect(warnings.map((w) => w.code)).toEqual(['unknown-attr', 'unknown-attr']);
  });
});
