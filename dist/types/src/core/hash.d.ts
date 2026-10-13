/** FNV-1a 32-bit string hash. Stable across runs and browsers. */
export declare function hash(str: string): number;
/** mulberry32 PRNG: returns a function producing floats in [0, 1). */
export declare function mulberry32(seed: number): () => number;
/** Seeded PRNG for a slide: mulberry32(hash(slug) + slideIndex). */
export declare function slideRng(slug: string, slideIndex: number): () => number;
/** Uniform float in [min, max) from a PRNG. */
export declare function between(rng: () => number, min: number, max: number): number;
