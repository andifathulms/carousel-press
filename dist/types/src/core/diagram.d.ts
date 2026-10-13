export declare const DIAGRAM_FIELDS: readonly ["football", "futsal", "badminton", "volleyball", "basketball", "tennis"];
export type DiagramField = (typeof DIAGRAM_FIELDS)[number];
export declare function isDiagramField(v: string): v is DiagramField;
/** Positions are percent of the half field: x left → right, y from the goal/net (0) to halfway/baseline (100). */
export interface Pt {
    x: number;
    y: number;
}
export type Mark = {
    kind: 'dot';
    team: 'att' | 'def' | 'player';
    at: Pt;
    label: string;
} | {
    kind: 'ball';
    at: Pt;
} | {
    kind: 'line';
    y: number;
    label: string;
} | {
    kind: 'arrow';
    style: 'pass' | 'move';
    from: Pt;
    to: Pt;
} | {
    kind: 'zone';
    from: Pt;
    to: Pt;
} | {
    kind: 'label';
    at: Pt;
    text: string;
};
export interface Diagram {
    field: DiagramField;
    marks: Mark[];
}
export interface DiagramIssue {
    /** 0-based line inside the fence. */
    offset: number;
    message: string;
}
/** Parse the fenced lines. Never throws; bad lines are skipped and reported. */
export declare function parseDiagram(lang: string, lines: readonly string[]): {
    diagram: Diagram;
    issues: DiagramIssue[];
};
