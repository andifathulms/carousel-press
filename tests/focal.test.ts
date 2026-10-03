import { describe, expect, it } from 'vitest';
import { coverCrop, photoOverlay } from '../src/render/photo';

const W = 1080, H = 1920;
const covers = (r: { dx: number; dy: number; dw: number; dh: number }) =>
  r.dx <= 1e-9 && r.dy <= 1e-9 && r.dx + r.dw >= W - 1e-9 && r.dy + r.dh >= H - 1e-9;

describe('coverCrop', () => {
  it('keeps a left subject (focal 0.2, 0.5) of a 4000×3000 image in frame', () => {
    const r = coverCrop(4000, 3000, 0.2, 0.5);
    expect(r.dw / r.dh).toBeCloseTo(4000 / 3000);
    expect(r.dh).toBeCloseTo(H);
    const fx = r.dx + 0.2 * r.dw;
    const fy = r.dy + 0.5 * r.dh;
    expect(fx).toBeGreaterThanOrEqual(0);
    expect(fx).toBeLessThanOrEqual(W);
    expect(fy).toBeCloseTo(H / 2);
    // 0.2 × 2560 = 512 < 540, so the clamp leaves it slightly left of centre
    expect(fx).toBeCloseTo(512);
    expect(covers(r)).toBe(true);
  });
  it('centres the focal point when the image allows', () => {
    const r = coverCrop(4000, 3000, 0.45, 0.5);
    expect(r.dx + 0.45 * r.dw).toBeCloseTo(W / 2);
  });
  it('always covers the canvas', () => {
    for (const [iw, ih] of [[4000, 3000], [1000, 4000], [1080, 1920], [300, 300], [6000, 500]] as const) {
      for (const f of [0, 0.2, 0.5, 0.8, 1]) {
        expect(covers(coverCrop(iw, ih, f, 1 - f))).toBe(true);
      }
    }
  });
});

describe('photoOverlay', () => {
  it('matches DESIGN §3.6 at the default darkness', () => {
    const o = photoOverlay(0.5);
    expect(o.wash).toBeCloseTo(0.275);
    expect(o.stops.map((s) => s[1])).toEqual([0.475, 0.06, 0.10, 0.655].map((x) => expect.closeTo(x, 5)));
  });
});
