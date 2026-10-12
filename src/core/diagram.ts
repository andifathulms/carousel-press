// `[diagram]` notation (PRD §4.9): one mark per line inside the fence. Pure: no DOM.

export const DIAGRAM_FIELDS = ['football', 'futsal', 'badminton', 'volleyball', 'basketball', 'tennis'] as const;
export type DiagramField = (typeof DIAGRAM_FIELDS)[number];

export function isDiagramField(v: string): v is DiagramField {
  return (DIAGRAM_FIELDS as readonly string[]).includes(v);
}

/** Positions are percent of the half field: x left → right, y from the goal/net (0) to halfway/baseline (100). */
export interface Pt {
  x: number;
  y: number;
}

export type Mark =
  | { kind: 'dot'; team: 'att' | 'def' | 'player'; at: Pt; label: string }
  | { kind: 'ball'; at: Pt }
  | { kind: 'line'; y: number; label: string }
  | { kind: 'arrow'; style: 'pass' | 'move'; from: Pt; to: Pt }
  | { kind: 'zone'; from: Pt; to: Pt }
  | { kind: 'label'; at: Pt; text: string };

export interface Diagram {
  field: DiagramField;
  marks: Mark[];
}

export interface DiagramIssue {
  /** 0-based line inside the fence. */
  offset: number;
  message: string;
}

const PT = /^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/;
const NUM = /^-?\d+(?:\.\d+)?$/;
const MAX_LABEL = 24;
const MAX_PLAYER_LABEL = 3;

function pt(tok: string | undefined): Pt | null {
  const m = tok ? PT.exec(tok) : null;
  if (!m) return null;
  const x = Number(m[1]);
  const y = Number(m[2]);
  return x < 0 || x > 100 || y < 0 || y > 100 ? null : { x, y };
}

/** Parse the fenced lines. Never throws; bad lines are skipped and reported. */
export function parseDiagram(lang: string, lines: readonly string[]): { diagram: Diagram; issues: DiagramIssue[] } {
  const issues: DiagramIssue[] = [];
  const field: DiagramField = isDiagramField(lang) ? lang : 'football';
  if (!isDiagramField(lang)) {
    issues.push({ offset: -1, message: `Unknown diagram field "${lang}" (use ${DIAGRAM_FIELDS.join(', ')}), using football` });
  }
  const marks: Mark[] = [];
  lines.forEach((raw, offset) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const [cmd = '', ...rest] = line.split(/\s+/);
    const bad = (why: string): void => {
      issues.push({ offset, message: `Diagram line "${line}": ${why}` });
    };
    const text = (from: number): string => rest.slice(from).join(' ').slice(0, MAX_LABEL);
    switch (cmd.toLowerCase()) {
      case 'att':
      case 'def':
      case 'gk': {
        const at = pt(rest[0]);
        if (!at) return bad('needs a position x,y between 0 and 100');
        marks.push({ kind: 'dot', team: cmd.toLowerCase() === 'att' ? 'att' : 'def', at, label: text(1) });
        return;
      }
      case 'player': {
        const at = pt(rest[0]);
        if (!at) return bad('needs a position x,y between 0 and 100');
        const label = rest.slice(1).join(' ');
        if (!label || label.length > MAX_PLAYER_LABEL) return bad(`needs a label of 1–${MAX_PLAYER_LABEL} characters`);
        marks.push({ kind: 'dot', team: 'player', at, label });
        return;
      }
      case 'ball': {
        const at = pt(rest[0]);
        if (!at) return bad('needs a position x,y between 0 and 100');
        marks.push({ kind: 'ball', at });
        return;
      }
      case 'line': {
        const y = rest[0] !== undefined && NUM.test(rest[0]) ? Number(rest[0]) : NaN;
        if (!(y >= 0 && y <= 100)) return bad('needs a y between 0 and 100');
        marks.push({ kind: 'line', y, label: text(1) });
        return;
      }
      case 'pass':
      case 'move':
      case 'zone': {
        const from = pt(rest[0]);
        const to = pt(rest[1] === '->' ? rest[2] : rest[1]);
        if (!from || !to) return bad('needs two positions, e.g. 40,50 70,30');
        if (cmd.toLowerCase() === 'zone') marks.push({ kind: 'zone', from, to });
        else marks.push({ kind: 'arrow', style: cmd.toLowerCase() === 'pass' ? 'pass' : 'move', from, to });
        return;
      }
      case 'label': {
        const at = pt(rest[0]);
        const t = text(1);
        if (!at || !t) return bad('needs a position and some text');
        marks.push({ kind: 'label', at, text: t });
        return;
      }
      default:
        bad('unknown mark (use att, def, gk, player, ball, line, pass, move, zone, label)');
    }
  });
  return { diagram: { field, marks }, issues };
}
