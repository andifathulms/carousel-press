/** Colour helpers (pure). Accepts #RGB, #RRGGBB and rgba(r,g,b,a). */
export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function parseColor(c: string): RGBA {
  const s = c.trim();
  if (s.startsWith('#')) {
    let h = s.slice(1);
    if (h.length === 3) h = h.split('').map((x) => x + x).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const m = /rgba?\(([^)]+)\)/.exec(s);
  if (m) {
    const [r = 0, g = 0, b = 0, a = 1] = m[1]!.split(',').map((x) => parseFloat(x));
    return { r, g, b, a };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

/** `rgba()` string of a colour at a given alpha. */
export function withAlpha(c: string, alpha: number): string {
  const { r, g, b, a } = parseColor(c);
  return `rgba(${r},${g},${b},${+(a * alpha).toFixed(4)})`;
}

/** Composite fg over an opaque bg. */
export function over(fg: RGBA, bg: RGBA): RGBA {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance. */
export function luminance(c: RGBA): number {
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
}

/** WCAG contrast ratio of fg (composited) on bg. */
export function contrast(fg: string, bg: string): number {
  const b = parseColor(bg);
  const f = over(parseColor(fg), b);
  const l1 = luminance(f);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
