import { describe, expect, it } from 'vitest';
import { photoIdFromName, slideFileName, slugify, uniqueId } from '../src/core/slug';

describe('slugify', () => {
  it('handles Indonesian titles', () => {
    expect(slugify('5 Pertanyaan Kecil yang Bikin Kalian Makin Dekat')).toBe('5-pertanyaan-kecil-yang-bikin-kalian-mak');
    expect(slugify('7 perintah git')).toBe('7-perintah-git');
  });
  it('transliterates accents', () => {
    expect(slugify('Café Crème à São Paulo')).toBe('cafe-creme-a-sao-paulo');
  });
  it('drops emoji and symbols', () => {
    expect(slugify('Simpan ✨ dulu 🤍!!')).toBe('simpan-dulu');
    expect(slugify('🤍🤍')).toBe('');
  });
  it('caps length at 40 without a trailing dash', () => {
    const s = slugify('a'.repeat(39) + ' bbbb');
    expect(s.length).toBeLessThanOrEqual(40);
    expect(s.endsWith('-')).toBe(false);
    expect(slugify('x'.repeat(100))).toHaveLength(40);
  });
  it('only uses a-z0-9 and dashes', () => {
    expect(slugify('Hello_World / Ñandú (2024)')).toMatch(/^[a-z0-9-]+$/);
  });
});

describe('photo IDs', () => {
  it('slugifies the file name without extension', () => {
    expect(photoIdFromName('Senja Pantai.jpg', [])).toBe('senja-pantai');
    expect(photoIdFromName('IMG_0001.HEIC', [])).toBe('img-0001');
  });
  it('appends -2, -3 on collisions', () => {
    expect(photoIdFromName('senja.jpg', ['senja'])).toBe('senja-2');
    expect(photoIdFromName('senja.png', ['senja', 'senja-2'])).toBe('senja-3');
    expect(uniqueId('a', ['a', 'a-2', 'a-3'])).toBe('a-4');
  });
  it('falls back when the name has no usable characters', () => {
    expect(photoIdFromName('🌅.jpg', [])).toBe('photo');
  });
});

describe('file names', () => {
  it('pads the index to two digits', () => {
    expect(slideFileName('7-perintah-git', 0)).toBe('7-perintah-git_01.png');
    expect(slideFileName('x', 9)).toBe('x_10.png');
  });
});
