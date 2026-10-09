import { describe, expect, it, vi } from 'vitest';
import { canSharePngs, sharePngs, toPngFiles } from '../src/export/sharePhotos';

const files = toPngFiles([{ name: 'deck_01.png', blob: new Blob(['a']) }, { name: 'deck_02.png', blob: new Blob(['b']) }]);

describe('canSharePngs', () => {
  it('is false without the Web Share API', () => {
    expect(canSharePngs(undefined)).toBe(false);
    expect(canSharePngs({})).toBe(false);
    expect(canSharePngs({ share: async () => {} })).toBe(false);
  });
  it('asks canShare about a PNG file', () => {
    const canShare = vi.fn((_d: ShareData) => true);
    expect(canSharePngs({ share: async () => {}, canShare })).toBe(true);
    const data = canShare.mock.calls[0]![0] as ShareData;
    expect(data.files?.[0]?.type).toBe('image/png');
  });
  it('is false when canShare refuses or throws', () => {
    expect(canSharePngs({ share: async () => {}, canShare: () => false })).toBe(false);
    expect(canSharePngs({ share: async () => {}, canShare: () => { throw new TypeError('nope'); } })).toBe(false);
  });
});

describe('sharePngs', () => {
  it('keeps slide order, names and PNG type', async () => {
    const share = vi.fn(async () => {});
    expect(await sharePngs(files, { share, canShare: () => true })).toBe('shared');
    const sent = (share.mock.calls[0] as unknown as [ShareData])[0].files!;
    expect(sent.map((f) => f.name)).toEqual(['deck_01.png', 'deck_02.png']);
    expect(sent.every((f) => f.type === 'image/png')).toBe(true);
  });
  it('treats a dismissed sheet as cancelled, not an error', async () => {
    const abort = Object.assign(new Error('dismissed'), { name: 'AbortError' });
    expect(await sharePngs(files, { share: async () => { throw abort; } })).toBe('cancelled');
  });
  it('rethrows other failures', async () => {
    const denied = Object.assign(new Error('no gesture'), { name: 'NotAllowedError' });
    await expect(sharePngs(files, { share: async () => { throw denied; } })).rejects.toThrow('no gesture');
    await expect(sharePngs(files, {})).rejects.toThrow("can't share");
    await expect(sharePngs(files, { share: async () => {}, canShare: () => false })).rejects.toThrow('ZIP');
  });
});
