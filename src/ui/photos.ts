import type { PhotoMeta } from '../store/photoStore';
import type { Controller } from './controller';
import { confirmDialog, openModal, toast } from './dialogs';
import { copyText, flash, h, svg } from './dom';
import { UI_ICONS } from './uiIcons';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif';

export function mountPhotos(root: HTMLElement, c: Controller): void {
  const input = h('input', { type: 'file', accept: ACCEPT, multiple: true, class: 'visually-hidden', 'aria-label': 'Choose photos' });
  const pick = h('button', { type: 'button', class: 'btn small' }, svg(UI_ICONS.upload), 'Choose photos');
  const drop = h('div', { class: 'dropzone' }, h('p', {}, 'Drop photos here'), pick, input,
    h('p', { class: 'hint' }, 'Use the ID in a tag: [cover photo=senja] or photo=1'));
  const grid = h('ul', { class: 'photo-grid', 'aria-label': 'Photo tray' });
  root.append(drop, grid);

  const importFiles = async (files: FileList | File[]): Promise<void> => {
    const list = [...files].filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name));
    if (!list.length) return;
    c.store.set({ busy: `Importing ${list.length} photo(s)…` });
    for (const f of list) {
      try {
        await c.photos.importFile(f);
      } catch (err) {
        toast(err instanceof Error ? err.message : String(err), 'error');
      }
    }
    c.store.set({ busy: null });
    c.refreshPhotos();
  };

  pick.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    if (input.files) void importFiles(input.files);
    input.value = '';
  });
  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add('over');
  });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('over');
    if (e.dataTransfer?.files) void importFiles(e.dataTransfer.files);
  });

  const urls = new Map<string, string>();
  const urlFor = (id: string): string => {
    let u = urls.get(id);
    if (!u) {
      const b = c.photos.blob(id);
      u = b ? URL.createObjectURL(b) : '';
      urls.set(id, u);
    }
    return u;
  };

  const paint = (photos: PhotoMeta[]): void => {
    for (const [id, u] of urls) {
      if (!photos.some((p) => p.id === id)) {
        URL.revokeObjectURL(u);
        urls.delete(id);
      }
    }
    grid.replaceChildren(...photos.map((p, i) => {
      const img = h('img', { src: urlFor(p.id), alt: `${p.name} (${p.width}×${p.height})`, loading: 'lazy' });
      const open = h('button', { type: 'button', class: 'photo-thumb', 'aria-label': `Enlarge ${p.id} to set its focal point` }, img);
      open.addEventListener('click', () => openFocal(c, p, urlFor(p.id)));
      const copy = h('button', { type: 'button', class: 'copy-mini', 'aria-label': `Copy photo ID ${p.id}` }, svg(UI_ICONS.copy));
      copy.addEventListener('click', async () => flash(copy, (await copyText(p.id)) ? '✓' : '!'));
      return h('li', {}, open, h('div', { class: 'photo-id' }, h('span', { class: 'photo-index' }, String(i + 1)), h('code', {}, p.id), copy));
    }));
  };
  c.store.watch((s) => s.photos, paint);
}

/** Enlarged photo; click to set the focal point (a 24 px ring with a crosshair). */
function openFocal(c: Controller, p: PhotoMeta, url: string): void {
  const m = openModal(p.id, { wide: true });
  let fx = p.focalX;
  let fy = p.focalY;
  const ring = h('span', { class: 'focal-ring', 'aria-hidden': 'true' });
  const img = h('img', { src: url, alt: p.name });
  const stage = h('button', { type: 'button', class: 'focal-stage', 'aria-label': 'Click to set the focal point' }, img, ring);
  const place = (): void => {
    ring.style.left = `${fx * 100}%`;
    ring.style.top = `${fy * 100}%`;
  };
  stage.addEventListener('click', async (e) => {
    const r = img.getBoundingClientRect();
    fx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    fy = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    place();
    await c.photos.setFocal(p.id, +fx.toFixed(4), +fy.toFixed(4));
    c.refreshPhotos();
  });
  place();
  const remove = h('button', { type: 'button', class: 'btn danger' }, svg(UI_ICONS.trash), 'Remove photo');
  remove.addEventListener('click', async () => {
    if (!(await confirmDialog('Remove photo?', `Slides using "${p.id}" will render without it.`, 'Remove', true))) return;
    await c.photos.remove(p.id);
    c.refreshPhotos();
    m.close();
  });
  const lowRes = Math.min(p.width, p.height) < 1280 ? ` · low resolution` : '';
  m.body.append(stage, h('p', { class: 'hint' }, `${p.width}×${p.height}${lowRes} · focal ${(fx * 100).toFixed(0)}%, ${(fy * 100).toFixed(0)}% · click the photo to move it`));
  m.footer.append(remove);
}
