import { setHeaderKey } from 'carousel-core/src/core/headerEdit';
import { slideFileName } from 'carousel-core/src/core/slug';
import { type Warning, isBlocking } from 'carousel-core/src/core/types';
import { layoutWarnings, renderDeck } from 'carousel-core/src/api/deck';
import { exportZip, slideFileNames } from 'carousel-core/src/api/zip';
import { exportSlidePng, exportTestImage, downloadBlob } from 'carousel-core/src/export/exportPng';
import { sharePngs, toPngFiles } from './sharePhotos';
import { loadFonts, loadTextFonts } from 'carousel-core/src/fonts/loadFonts';
import { deckIcons } from 'carousel-core/src/render/renderSlide';
import { SAMPLES } from '../samples';
import { samplePhotosIn } from '../samples/photos';
import {
  DECK_FORMAT, type DeckFile, base64ToBlob, blobToBase64, planPhotoIds, referencedPhotoIds, rewritePhotoRefs,
  validateDeckFile,
} from '../store/deckFile';
import type { Controller } from './controller';
import { decksFromSample, sampleHash, sampleInfo } from './libraryData';
import { allSampleInfos } from './sampleIndex';
import { confirmDialog, exportWarningsDialog, openModal, promptDialog, toast } from './dialogs';
import { h } from './dom';

/** Blocking warnings for the current deck: the parser's, plus a fresh layout pass with real fonts. */
async function blockingWarnings(c: Controller): Promise<Warning[]> {
  const s = c.store.get();
  await loadFonts(s.variant);
  await loadTextFonts(s.text);
  const { slides } = s.parsed.deck;
  const hasPhoto = (i: number): boolean => !!(slides[i]?.photoId && c.photos.get(slides[i]!.photoId!));
  return [...s.parsed.warnings, ...layoutWarnings(s.parsed.deck, s.variant, hasPhoto)].filter(isBlocking);
}

async function passGate(c: Controller, onlySlide?: number): Promise<boolean> {
  let ws = await blockingWarnings(c);
  // Deck-level blockers (slideIndex null, e.g. internal-error) apply to every export.
  if (onlySlide !== undefined) ws = ws.filter((w) => w.slideIndex === onlySlide || w.slideIndex === null);
  if (!ws.length) return true;
  const r = await exportWarningsDialog(ws, (w) => {
    c.store.set({ mobileTab: 'write', leftTab: 'write', focus: false, publishOpen: false });
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

/** Every slide as PNG through the package's renderDeck (the user already passed the export gate). */
function renderAllSlides(c: Controller): Promise<Blob[]> {
  const s = c.store.get();
  return renderDeck(s.parsed.deck, {
    template: s.variant.id, darkness: s.darkness, photos: (id) => c.photos.photoInput(id), onBlocking: 'render',
    onProgress: (done, total) => c.store.set({ busy: `Rendering ${done}/${total}…` }),
  });
}

export async function downloadAll(c: Controller): Promise<void> {
  const s = c.store.get();
  if (!s.parsed.deck.slides.length || !s.fontsReady) return;
  if (!(await passGate(c))) return;
  await busy(c, 'Building ZIP…', async () => {
    const blobs = await renderAllSlides(c);
    downloadBlob(await exportZip(blobs, s.parsed.deck.slug), `${s.parsed.deck.slug}.zip`);
  });
}

/**
 * Render every slide, then hand the PNGs to the share sheet ("Save N Images"
 * on iPad puts them in Photos). Rendering outlasts Safari's user-gesture
 * window, so the sheet opens from a second tap in a "ready" dialog.
 */
export async function saveToPhotos(c: Controller): Promise<void> {
  const s = c.store.get();
  if (!s.parsed.deck.slides.length || !s.fontsReady) return;
  if (!(await passGate(c))) return;
  const blobs = await busy(c, 'Rendering…', () => renderAllSlides(c));
  if (!blobs) return;
  const names = slideFileNames(blobs.length, s.parsed.deck.slug);
  const files = toPngFiles(blobs.map((blob, i) => ({ name: names[i]!, blob })));
  const m = openModal(`${files.length} images ready`);
  m.body.append(h('p', {}, 'Tap Save to Photos, then choose "Save Images" in the share sheet.'));
  const save = h('button', { type: 'button', class: 'btn primary', 'data-autofocus': true }, 'Save to Photos');
  const cancel = h('button', { type: 'button', class: 'btn' }, 'Cancel');
  cancel.addEventListener('click', () => m.close());
  save.addEventListener('click', () => {
    sharePngs(files).then((r) => {
      m.close();
      if (r === 'shared') toast(`Shared ${files.length} images`);
    }, (err: unknown) => toast(err instanceof Error ? err.message : String(err), 'error'));
  });
  m.footer.append(cancel, save);
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
  void ensureSamplePhotos(c, d.text);
}

/** Add the bundled photos a sample uses to the tray, if they aren't there yet. */
export async function ensureSamplePhotos(c: Controller, text: string): Promise<void> {
  const missing = samplePhotosIn(text).filter((p) => !c.photos.get(p.id));
  if (!missing.length) return;
  for (const p of missing) {
    try {
      const blob = await (await fetch(p.url)).blob();
      const bmp = await createImageBitmap(blob);
      await c.photos.addBlob({
        id: p.id, name: `${p.id}.jpg`, width: bmp.width, height: bmp.height, focalX: p.focalX, focalY: p.focalY, mime: blob.type || 'image/jpeg',
      }, blob);
      bmp.close();
    } catch {
      // The slide renders without its photo and the editor shows unknown-photo.
    }
  }
  c.refreshPhotos();
}

/** Open the deck made from this sample, or create it the first time. */
export async function loadSample(c: Controller, sampleId: string): Promise<void> {
  const sample = SAMPLES.find((x) => x.id === sampleId);
  if (!sample) return;
  await ensureSamplePhotos(c, sample.text);
  const existing = decksFromSample(c.decks.listDecks(), sampleInfo(sample))[0];
  if (existing) {
    openDeck(c, existing.id);
    return;
  }
  c.newDeck(sample.text, sampleId);
}

/**
 * Replace your copy of a sample with the sample's current text (after the sample was
 * redesigned). The copy keeps its id, posting status and photo darkness; any older
 * duplicate copies of the same sample are removed. Asks first, since edits are lost.
 */
export async function replaceWithSample(c: Controller, sampleId: string): Promise<boolean> {
  const sample = SAMPLES.find((x) => x.id === sampleId);
  if (!sample) return false;
  const [keep, ...older] = decksFromSample(c.decks.listDecks(), sampleInfo(sample));
  if (!keep) {
    await loadSample(c, sampleId);
    return true;
  }
  const extra = older.length ? ` ${older.length} older ${older.length === 1 ? 'copy' : 'copies'} of it will be removed too.` : '';
  if (!(await confirmDialog('Replace with the latest sample?',
    `"${keep.title || 'Untitled'}" gets the sample's current text. Changes you made to your copy are lost.${extra}`, 'Replace', true))) return false;
  await ensureSamplePhotos(c, sample.text);
  c.cancelPendingSave();
  for (const d of older) c.decks.deleteDeck(d.id);
  c.openDeck(keep.id, sample.text, c.decks.loadDeck(keep.id)?.settings.darkness ?? 50);
  c.decks.setSample(keep.id, sampleId, sampleHash(sample.text));
  c.store.set({ decks: c.decks.listDecks() });
  toast('Replaced with the latest sample.');
  return true;
}

/** Record the sample hash for decks copied before hashes were stored, when the copy is still identical. */
export function backfillSampleHashes(c: Controller): void {
  const decks = c.decks.listDecks();
  if (!decks.some((d) => d.sampleHash === undefined)) return;
  for (const [i, sample] of SAMPLES.entries()) {
    for (const d of decksFromSample(decks, allSampleInfos()[i]!)) {
      if (d.sampleHash !== undefined) continue;
      if (c.decks.loadDeck(d.id)?.text === sample.text) c.decks.setSample(d.id, sample.id, sampleHash(sample.text));
    }
  }
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
  await deleteDeckById(c, c.store.get().deckId);
}

/** Delete a saved deck; deleting the open one opens the next (or the first sample). */
export async function deleteDeckById(c: Controller, id: string): Promise<void> {
  const s = c.store.get();
  const title = id === s.deckId ? s.parsed.deck.title : s.decks.find((d) => d.id === id)?.title;
  if (!(await confirmDialog('Delete deck?', `"${title || 'Untitled'}" will be removed from this browser.`, 'Delete', true))) return;
  if (id !== s.deckId) {
    c.decks.deleteDeck(id);
    c.store.set({ decks: c.decks.listDecks() });
    return;
  }
  c.cancelPendingSave();
  c.decks.deleteDeck(s.deckId);
  c.store.set({ deckId: '' });
  const next = c.decks.listDecks()[0];
  if (next) openDeck(c, next.id);
  else await loadSample(c, SAMPLES[0]!.id);
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
