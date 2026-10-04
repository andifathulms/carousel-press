// Dev-only page used by `npm run review`. Not linked from the app UI.
import { parse } from '../core/parser';
import type { TemplateId, Warning } from '../core/types';
import { loadAllFonts } from '../fonts/loadFonts';
import { makeCanvas } from '../render/ctx';
import type { PhotoInput } from '../render/photo';
import { deckIcons, renderSlide } from '../render/renderSlide';
import { CANVAS } from '../render/safezone';
import { SAMPLE_DUSK, generateSampleDusk } from '../render/samplePhoto';
import { VARIANTS } from '../templates/registry';
import { SAMPLES } from '../samples';

export interface ReviewItem {
  template: TemplateId;
  sample: string;
  index: number;
  dataUrl: string;
  warnings: Warning[];
}

/** Renders every sample, for one template (or all). Callers batch by template so results stay small. */
async function review(template?: TemplateId): Promise<ReviewItem[]> {
  await loadAllFonts(VARIANTS);
  const dusk = await generateSampleDusk();
  const bitmap = await createImageBitmap(dusk.blob);
  const photo: PhotoInput = { image: bitmap, width: dusk.width, height: dusk.height, focalX: 0.5, focalY: 0.5 };
  const out: ReviewItem[] = [];
  const { canvas, ctx } = makeCanvas(CANVAS.w, CANVAS.h);
  for (const variant of VARIANTS.filter((v) => !template || v.id === template)) {
    for (const sample of SAMPLES) {
      const { deck, warnings: parseWarnings } = parse(sample.text, { photoIds: [SAMPLE_DUSK.id] });
      const icons = deckIcons(deck, variant);
      for (const [i, slide] of deck.slides.entries()) {
        const r = renderSlide(ctx, slide, deck, variant, {
          photo: slide.photoId ? photo : null, darkness: 50, icon: icons[i] ?? null,
        });
        const blob = 'convertToBlob' in canvas ? await canvas.convertToBlob({ type: 'image/png' }) : null;
        const dataUrl = blob ? await blobToDataUrl(blob) : (canvas as HTMLCanvasElement).toDataURL('image/png');
        const warnings = [...parseWarnings.filter((w) => w.slideIndex === i), ...r.warnings];
        out.push({ template: variant.id, sample: sample.id, index: i, dataUrl, warnings });
      }
    }
  }
  return out;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = () => rej(fr.error);
    fr.readAsDataURL(blob);
  });
}

declare global {
  interface Window {
    __review?: (template?: TemplateId) => Promise<ReviewItem[]>;
    __reviewTemplates?: TemplateId[];
  }
}

window.__review = review;
window.__reviewTemplates = VARIANTS.map((v) => v.id);
document.getElementById('status')!.textContent = 'Ready: call window.__review()';
