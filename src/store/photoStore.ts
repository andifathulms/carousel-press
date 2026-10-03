import { createStore, del, entries, set } from 'idb-keyval';
import { photoIdFromName } from '../core/slug';
import { makeCanvas } from '../render/ctx';
import type { PhotoInput } from '../render/photo';

export interface PhotoMeta {
  id: string;
  name: string;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  mime: string;
  addedAt: number;
}

interface PhotoRecord extends PhotoMeta {
  blob: Blob;
}

export const PHOTO = { maxLongSide: 2400, jpegQuality: 0.92, lowResShortSide: 1280 };

export const HEIC_ERROR = "This browser can't read HEIC. Export it as JPG first.";

/** IndexedDB-backed photo tray with an in-memory fallback. */
export class PhotoStore {
  available = true;
  private records = new Map<string, PhotoRecord>();
  private bitmaps = new Map<string, Promise<ImageBitmap>>();
  private idb: ReturnType<typeof createStore> | null = null;
  private onUnavailable: () => void;

  constructor(onUnavailable: () => void = () => {}) {
    this.onUnavailable = onUnavailable;
  }

  private fail(): void {
    if (this.available) {
      this.available = false;
      this.idb = null;
      this.onUnavailable();
    }
  }

  async init(): Promise<void> {
    try {
      if (typeof indexedDB === 'undefined') throw new Error('no IndexedDB');
      this.idb = createStore('carousel-press', 'photos');
      const all = await entries<string, PhotoRecord>(this.idb);
      for (const [, rec] of all) if (rec && rec.id && rec.blob) this.records.set(rec.id, rec);
    } catch {
      this.fail();
    }
  }

  /** Photos in tray order (oldest first, so tray index 1 is stable). */
  list(): PhotoMeta[] {
    return [...this.records.values()]
      .sort((a, b) => a.addedAt - b.addedAt)
      .map(({ blob: _b, ...meta }) => meta);
  }

  ids(): string[] {
    return this.list().map((p) => p.id);
  }

  get(id: string): PhotoMeta | null {
    const r = this.records.get(id);
    if (!r) return null;
    const { blob: _b, ...meta } = r;
    return meta;
  }

  blob(id: string): Blob | null {
    return this.records.get(id)?.blob ?? null;
  }

  private async persist(rec: PhotoRecord): Promise<void> {
    this.records.set(rec.id, rec);
    if (!this.idb) return;
    try {
      await set(rec.id, rec, this.idb);
    } catch {
      this.fail();
    }
  }

  /** Store an already-encoded blob (sample photo, deck file import). */
  async addBlob(meta: Omit<PhotoMeta, 'addedAt'> & { addedAt?: number }, blob: Blob): Promise<PhotoMeta> {
    const rec: PhotoRecord = { ...meta, addedAt: meta.addedAt ?? nextStamp(this.records), blob };
    await this.persist(rec);
    return this.get(rec.id)!;
  }

  /** Decode, downscale (long side ≤ 2400) and store a user file. */
  async importFile(file: File): Promise<PhotoMeta> {
    let bmp: ImageBitmap;
    try {
      bmp = await createImageBitmap(file);
    } catch {
      if (/heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)) throw new Error(HEIC_ERROR);
      throw new Error(`Couldn't read ${file.name} as an image.`);
    }
    const scale = Math.min(1, PHOTO.maxLongSide / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const { canvas, ctx } = makeCanvas(w, h);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    const alpha = /png|webp|gif/i.test(file.type) && hasAlpha(ctx, w, h);
    const mime = alpha ? 'image/png' : 'image/jpeg';
    const blob = 'convertToBlob' in canvas
      ? await canvas.convertToBlob({ type: mime, quality: PHOTO.jpegQuality })
      : await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), mime, PHOTO.jpegQuality));
    const id = photoIdFromName(file.name, this.records.keys());
    return this.addBlob({ id, name: file.name, width: w, height: h, focalX: 0.5, focalY: 0.5, mime }, blob);
  }

  async setFocal(id: string, focalX: number, focalY: number): Promise<void> {
    const r = this.records.get(id);
    if (!r) return;
    await this.persist({ ...r, focalX, focalY });
  }

  async remove(id: string): Promise<void> {
    this.records.delete(id);
    this.bitmaps.delete(id);
    if (!this.idb) return;
    try {
      await del(id, this.idb);
    } catch {
      this.fail();
    }
  }

  /** Decoded photo for rendering (cached). */
  async photoInput(id: string): Promise<PhotoInput | null> {
    const r = this.records.get(id);
    if (!r) return null;
    let p = this.bitmaps.get(id);
    if (!p) {
      p = createImageBitmap(r.blob);
      this.bitmaps.set(id, p);
      p.catch(() => this.bitmaps.delete(id));
    }
    try {
      const image = await p;
      return { image, width: r.width, height: r.height, focalX: r.focalX, focalY: r.focalY };
    } catch {
      return null;
    }
  }
}

function nextStamp(records: Map<string, PhotoRecord>): number {
  let max = 0;
  for (const r of records.values()) max = Math.max(max, r.addedAt);
  return Math.max(Date.now(), max + 1);
}

function hasAlpha(ctx: { getImageData(x: number, y: number, w: number, h: number): ImageData }, w: number, h: number): boolean {
  try {
    const d = ctx.getImageData(0, 0, w, h).data;
    for (let i = 3; i < d.length; i += 4 * 7) if (d[i]! < 255) return true;
  } catch {
    return false;
  }
  return false;
}
