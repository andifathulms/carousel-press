import { describe, expect, it } from 'vitest';
import { planPhotoIds, referencedPhotoIds, rewritePhotoRefs, validateDeckFile } from '../src/store/deckFile';

describe('deck file', () => {
  it('validates the format', () => {
    expect(() => validateDeckFile({ format: 'x', text: '' })).toThrow(/Unsupported/);
    expect(() => validateDeckFile(null)).toThrow();
    const f = validateDeckFile({ format: 'carousel-press/1', text: 'A', settings: { darkness: 300 }, photos: [{ id: 'a', dataBase64: 'AA', focalX: 9 }] });
    expect(f.settings.darkness).toBe(100);
    expect(f.photos[0]).toMatchObject({ id: 'a', focalX: 1, focalY: 0.5, mime: 'image/jpeg' });
  });
  it('renames colliding photo ids', () => {
    const m = planPhotoIds(['senja', 'pantai'], ['senja']);
    expect([...m]).toEqual([['senja', 'senja-2'], ['pantai', 'pantai']]);
  });
  it('rewrites photo= references only in tag lines', () => {
    const text = '[cover photo=senja kicker="x"]\nphoto=senja stays\n---\n[end photo="senja"]\nBye';
    expect(rewritePhotoRefs(text, new Map([['senja', 'senja-2']]))).toBe(
      '[cover photo=senja-2 kicker="x"]\nphoto=senja stays\n---\n[end photo=senja-2]\nBye',
    );
  });
  it('turns tray indexes into ids', () => {
    expect(rewritePhotoRefs('[cover photo=1]\nA', new Map([['1', 'sample-dusk']]))).toBe('[cover photo=sample-dusk]\nA');
  });
  it('lists referenced photos', () => {
    expect(referencedPhotoIds('[cover photo=1]\nA\n---\n[photo=b]\nB', ['a', 'b'])).toEqual(['a', 'b']);
  });
});
