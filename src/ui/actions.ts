import { setHeaderKey } from '../core/headerEdit';
import { slideFileName } from '../core/slug';
import { type Warning, isBlocking } from '../core/types';
import { exportSlidePng, exportTestImage, downloadBlob } from '../export/exportPng';
import { exportAll } from '../export/exportZip';
import { loadFonts } from '../fonts/loadFonts';
import { createCanvasMeasurer } from '../layout/measure';
import { makeCanvas } from '../render/ctx';
import { deckIcons, layoutSlide } from '../render/renderSlide';
import { SAMPLES } from '../samples';
import {
  DECK_FORMAT, type DeckFile, base64ToBlob, blobToBase64, planPhotoIds, referencedPhotoIds, rewritePhotoRefs,
  validateDeckFile,
} from '../store/deckFile';
import type { Controller } from './controller';
import { decksFromSample, sampleInfo } from './libraryData';
import { confirmDialog, exportWarningsDialog, promptDialog, toast } from './dialogs';

/** Blocking warnings for the current deck, from a fresh layout pass with real fonts. */
async function blockingWarnings(c: Controller): Promise<Warning[]> {
  const s = c.store.get();
  await loadFonts(s.variant);
  const { ctx } = makeCanvas(8, 8);
  const m = createCanvasMeasurer(ctx);
  const icons = deckIcons(s.parsed.deck, s.variant);
  return s.parsed.deck.slides.flatMap((slide, i) =>
    layoutSlide(slide, s.parsed.deck, s.variant, m, icons[i] ?? null, !!(slide.photoId && c.photos.get(slide.photoId))).warnings,
  ).filter(isBlocking);
}

async function passGate(c: Controller, onlySlide?: number): Promise<boolean> {
  let ws = await blockingWarnings(c);
  if (onlySlide !== undefined) ws = ws.filter((w) => w.slideIndex === onlySlide);
  if (!ws.length) return true;
  const r = await exportWarningsDialog(ws, (w) => {
    c.store.set({ mobileTab: 'write', leftTab: 'write' });
    if (w.slideIndex !== null) c.jumpToSlide(w.slideIndex);
  });
  return r === 'anyway';
}

async function busy<T>(c: Controller, label: string, fn: () => Promise<T>): Promise<T | undefined> {
  if (c.store.get().busy) return undefined;
  c.store.set({ busy: label });
  try {
    return await fn();
  } catch (err) {
    toast(err instanceof Error ? err.message : String(err), 'error');
    return undefined;
  } finally {
    c.store.set({ busy: null });
  }
}

export async function downloadCurrentSlide(c: Controller): Promise<void> {
  const s = c.store.get();
  const slide = s.parsed.deck.slides[s.selected];
  if (!slide || !s.fontsReady) return;
  if (!(await passGate(c, s.selected))) return;
  await busy(c, 'Exporting slide…', async () => {
    const photo = slide.photoId ? await c.photos.photoInput(slide.photoId) : null;
    const icon = deckIcons(s.parsed.deck, s.variant)[s.selected] ?? null;
    const { blob } = await exportSlidePng(slide, s.parsed.deck, s.variant, { photo, darkness: s.darkness, icon });
    downloadBlob(blob, slideFileName(s.parsed.deck.slug, s.selected));
  });
}

export async function downloadAll(c: Controller): Promise<void> {
  const s = c.store.get();
  if (!s.parsed.deck.slides.length || !s.fontsReady) return;
  if (!(await passGate(c))) return;
  await busy(c, 'Building ZIP…', async () => {
    const { blob } = await exportAll({
      deck: s.parsed.deck, variant: s.variant, icons: deckIcons(s.parsed.deck, s.variant), darkness: s.darkness,
      getPhoto: (id) => c.photos.photoInput(id),
    }, (done, total) => c.store.set({ busy: `Rendering ${done}/${total}…` }));
    downloadBlob(blob, `${s.parsed.deck.slug}.zip`);
  });
}

export async function downloadTestImage(c: Controller): Promise<void> {
  await busy(c, 'Exporting test image…', async () => {
    downloadBlob(await exportTestImage(c.store.get().variant), 'carousel-press_safe-zone-test.png');
  });
}

// ---- deck files ------------------------------------------------------------
export async function saveDeckFile(c: Controller): Promise<void> {
  await busy(c, 'Saving deck file…', async () => {
    const s = c.store.get();
    const tray = c.photos.ids();
    // Tray indexes differ between browsers: store photo=N as photo=<id>.
    const idx = new Map(tray.map((id, i) => [String(i + 1), id] as [string, string]));
    const text = rewritePhotoRefs(s.text, idx);
    const photos = await Promise.all(referencedPhotoIds(s.text, tray).map(async (id) => {
      const meta = c.photos.get(id)!;
      return { id, name: meta.name, focalX: meta.focalX, focalY: meta.focalY, mime: meta.mime, dataBase64: await blobToBase64(c.photos.blob(id)!) };
    }));
    const file: DeckFile = { format: DECK_FORMAT, text, settings: { darkness: s.darkness }, photos };
    downloadBlob(new Blob([JSON.stringify(file)], { type: 'application/json' }), `${s.parsed.deck.slug}.carousel.json`);
  });
}

export async function openDeckFile(c: Controller, file: File): Promise<void> {
  await busy(c, 'Opening deck file…', async () => {
    let json: unknown;
    try {
      json = JSON.parse(await file.text());
    } catch {
      throw new Error(`${file.name} isn't valid JSON.`);
    }
    const df = validateDeckFile(json);
    const plan = planPhotoIds(df.photos.map((p) => p.id), c.photos.ids());
    for (const p of df.photos) {
      const blob = base64ToBlob(p.dataBase64, p.mime);
      const bmp = await createImageBitmap(blob);
      await c.photos.addBlob({ id: plan.get(p.id)!, name: p.name, width: bmp.width, height: bmp.height, focalX: p.focalX, focalY: p.focalY, mime: p.mime }, blob);
      bmp.close();
    }
    c.store.set({ photos: c.photos.list() });
    c.newDeck(rewritePhotoRefs(df.text, plan));
    c.setDarkness(df.settings.darkness);
    toast(`Opened ${file.name}`);
  });
}

// ---- library ------------------------------------------------------------------
export function openDeck(c: Controller, id: string): void {
  const d = c.decks.loadDeck(id);
  if (!d) {
    toast("That deck couldn't be loaded.", 'error');
    return;
  }
  c.openDeck(d.id, d.text, d.settings.darkness);
}

/** Open the deck made from this sample, or create it the first time. `fresh` always makes a new copy. */
export function loadSample(c: Controller, sampleId: string, fresh = false): void {
  const sample = SAMPLES.find((x) => x.id === sampleId);
  if (!sample) return;
  const existing = fresh ? undefined : decksFromSample(c.decks.listDecks(), sampleInfo(sample))[0];
  if (existing) {
    openDeck(c, existing.id);
    return;
  }
  c.newDeck(sample.text, sampleId);
  if (fresh) toast('New copy of the sample. You are editing the copy.');
}

export function newBlankDeck(c: Controller): void {
  const lang = c.store.get().parsed.deck.lang;
  c.newDeck(`template: ${c.settings.lastTemplate ?? 'editorial/rose-dusk'}\nlang: ${lang}\n---\n[cover]\nYour headline | goes here\nA short subtitle.\n---\nFirst idea\nOne or two lines that explain it.\n---\n[end]\nSave this.\nSee you next time.`);
}

export function duplicateDeck(c: Controller): void {
  const text = c.store.get().text;
  c.newDeck(text);
  toast('Duplicated. You are editing the copy.');
}

export async function renameDeck(c: Controller): Promise<void> {
  const s = c.store.get();
  const title = await promptDialog('Rename deck', 'Title (sets the title: header line)', s.parsed.deck.title);
  if (title === null || !title) return;
  c.replaceText(setHeaderKey(s.text, 'title', title));
}

export async function deleteDeck(c: Controller): Promise<void> {
  const s = c.store.get();
  if (!(await confirmDialog('Delete deck?', `"${s.parsed.deck.title || 'Untitled'}" will be removed from this browser.`, 'Delete', true))) return;
  c.cancelPendingSave();
  c.decks.deleteDeck(s.deckId);
  c.store.set({ deckId: '' });
  const next = c.decks.listDecks()[0];
  if (next) openDeck(c, next.id);
  else loadSample(c, SAMPLES[0]!.id);
  c.store.set({ decks: c.decks.listDecks() });
}

export async function cleanUnusedPhotos(c: Controller): Promise<void> {
  const tray = c.photos.ids();
  const used = new Set<string>();
  for (const d of c.decks.listDecks()) {
    const stored = c.decks.loadDeck(d.id);
    if (stored) for (const id of referencedPhotoIds(stored.text, tray)) used.add(id);
  }
  for (const id of referencedPhotoIds(c.store.get().text, tray)) used.add(id);
  const unused = tray.filter((id) => !used.has(id));
  if (!unused.length) {
    toast('Every photo is used by a deck.');
    return;
  }
  if (!(await confirmDialog('Clean unused photos?', `Remove ${unused.length} photo(s) no deck uses: ${unused.join(', ')}`, 'Remove', true))) return;
  for (const id of unused) await c.photos.remove(id);
  c.refreshPhotos();
}
