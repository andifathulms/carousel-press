/** FNV-1a 32-bit string hash. Stable across runs and browsers. */
export function hash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 PRNG: returns a function producing floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seeded PRNG for a slide: mulberry32(hash(slug) + slideIndex). */
export function slideRng(slug: string, slideIndex: number): () => number {
  return mulberry32(hash(slug) + slideIndex);
}

/** Uniform float in [min, max) from a PRNG. */
export function between(rng: () => number, min: number, max: number): number {
  return min + (max - min) * rng();
}
