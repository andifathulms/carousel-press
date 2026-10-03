// The ONLY place these numbers live (DESIGN §2).

export const CANVAS = { w: 1080, h: 1920 };

/** Regions TikTok's photo-mode UI covers (estimates; verified by the owner with the test image). */
export const UI_ZONES = {
  tabs: { x: 0, y: 0, w: 1080, h: 170 },
  buttons: { x: 930, y: 760, w: 150, h: 920 },
  caption: { x: 0, y: 1520, w: 1080, h: 400 },
};

/** Everything that carries meaning must stay inside this box. Content width 816. */
export const SAFE = { left: 96, right: 912, top: 196, bottom: 1500 };
export const CONTENT_W = SAFE.right - SAFE.left;

/** Shared rows (DESIGN §2–3). */
export const ROWS = {
  headerBaseline: 236,
  stackTopCard: 344,
  stackTopCover: 300,
  stackLimit: 1400,
  footerBaseline: 1472,
};

export const GRID = 8;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: string;
}

export function insideSafe(b: Box): boolean {
  return b.x >= SAFE.left - 0.5 && b.y >= SAFE.top - 0.5 &&
    b.x + b.w <= SAFE.right + 0.5 && b.y + b.h <= SAFE.bottom + 0.5;
}
