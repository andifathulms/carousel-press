// Arsip drawing: replays the plate's display list. Photos are cover-cropped into their frames with
// no tint (SPEC-arsip §2.1). Slides handed to the editorial layout get the usual full-bleed photo.
import type { Ctx } from '../../render/ctx';
import { coverCrop, drawPhoto } from '../../render/photo';
import { drawTextBlock } from '../../render/parts';
import { drawTracked, setFont, setShadow } from '../../render/text';
import type { SlideLayout } from '../common';
import { drawEditorial } from '../editorial/draw';

/** Original split-gate mark (candi bentar), 24-unit box, two stepped halves. */
const GAPURA = 'M2 22V13h2V9h2V5h2V2h2.5v20zM22 22V13h-2V9h-2V5h-2V2h-2.5v20z';
/** Soft shadow under cards, sheets and prints. */
const PAPER_SHADOW = { color: 'rgba(0,0,0,0.28)', blur: 40, offsetY: 18 };
const ARROW = { head: 12, line: 3 };

export function drawArsip(ctx: Ctx, L: SlideLayout): void {
  if (!L.arsip) {
    if (L.photo) drawPhoto(ctx, L.photo, L.darkness ?? 50, L.variant.onPhoto.tint);
    drawEditorial(ctx, L);
    return;
  }
  for (const o of L.arsip.ops) {
    switch (o.op) {
      case 'fill':
        ctx.save();
        if (o.shadow) {
          ctx.shadowColor = PAPER_SHADOW.color;
          ctx.shadowBlur = PAPER_SHADOW.blur;
          ctx.shadowOffsetY = PAPER_SHADOW.offsetY;
        }
        ctx.fillStyle = o.color;
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.restore();
        break;
      case 'photo': {
        const p = L.photo;
        if (!p || o.w <= 0 || o.h <= 0) break;
        const r = coverCrop(p.width, p.height, p.focalX, p.focalY, o.w, o.h);
        ctx.save();
        ctx.beginPath();
        ctx.rect(o.x, o.y, o.w, o.h);
        ctx.clip();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(p.image, o.x + r.dx, o.y + r.dy, r.dw, r.dh);
        ctx.restore();
        break;
      }
      case 'text':
        drawTextBlock(ctx, o.p, o.surface, false);
        break;
      case 'label':
        setShadow(ctx, false);
        setFont(ctx, o.font);
        ctx.fillStyle = o.color;
        if (o.tracking) drawTracked(ctx, o.text, o.x, o.y, o.tracking);
        else ctx.fillText(o.text, o.x, o.y);
        break;
      case 'rule':
        ctx.fillStyle = o.color;
        ctx.fillRect(o.x, o.y, o.w, o.h);
        break;
      case 'mark': {
        ctx.save();
        ctx.translate(o.x, o.y);
        ctx.scale(o.size / 24, o.size / 24);
        ctx.fillStyle = o.color;
        ctx.fill(new Path2D(GAPURA));
        ctx.restore();
        break;
      }
      case 'arrow': {
        const h = ARROW.head;
        ctx.save();
        ctx.strokeStyle = o.color;
        ctx.lineWidth = ARROW.line;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(o.x, o.y);
        ctx.lineTo(o.x + o.w, o.y);
        ctx.moveTo(o.x + o.w - h, o.y - h * 0.85);
        ctx.lineTo(o.x + o.w, o.y);
        ctx.lineTo(o.x + o.w - h, o.y + h * 0.85);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case 'push':
        ctx.save();
        ctx.translate(o.cx, o.cy);
        ctx.rotate(o.rot);
        ctx.translate(-o.cx, -o.cy);
        break;
      case 'pop':
        ctx.restore();
        break;
    }
  }
}
