import { describe, expect, it } from 'vitest';
import { parse } from 'carousel-core/src/core/parser';
import { fakeMeasurer } from 'carousel-core/src/layout/measure';
import { layoutSlide } from 'carousel-core/src/render/renderSlide';
import { getVariant } from 'carousel-core/src/templates/registry';
import { parseCredits } from '../src/samples/photos';

// Arsip family (docs/SPEC-arsip.md): plates by slide role and photo orientation, credit= and layout=.
const PORTRAIT = { w: 1280, h: 1920 };
const LANDSCAPE = { w: 2160, h: 1440 };

const text = `template: arsip/bata
handle: @sejarah.nusantara.id
lang: id
---
[cover kicker="JAWA TIMUR · 1357" photo=a credit="Gapura · Foto: X, CC BY-SA 4.0"]
Judul | sampul
Subjudul pendek.
---
[number=off photo=b]
*1357*: kait
Badan teks pendek.
---
[number=off photo=c]
Potret di atas
Badan teks pendek.
---
[number=off photo=d]
Bentang di bawah
Badan teks pendek.
---
[number=off]
Tanpa foto
Badan teks pendek.
---
[number=off photo=e layout=teks]
Dipaksa teks
Badan teks pendek.
---
[quote photo=f]
Kutipan naskah.
— Pararaton
---
[end photo=a cta="Komen A atau B"]
Pertanyaan?
Komen.`;

describe('arsip', () => {
  const { deck, warnings } = parse(text);
  const v = getVariant('arsip/bata');
  const plate = (i: number, photo: false | { w: number; h: number }): string | undefined =>
    layoutSlide(deck.slides[i]!, deck, v, fakeMeasurer, null, photo).arsip?.plate;

  it('parses credit= and layout= without warnings', () => {
    expect(warnings).toEqual([]);
    expect(deck.slides[0]!.attrs.credit).toBe('Gapura · Foto: X, CC BY-SA 4.0');
    expect(deck.slides[5]!.attrs.layout).toBe('teks');
  });

  it('warns on an unknown layout and on attributes outside their slide types', () => {
    const r = parse('---\n[card layout=kolase]\nA\n---\n[code credit="x"]\nB\n```bash\nls\n```\n---\n[quote layout=teks]\nC');
    expect(r.warnings.map((w) => w.code)).toEqual(['unknown-attr', 'unknown-attr', 'unknown-attr']);
    expect(r.deck.slides[0]!.attrs.layout).toBeUndefined();
  });

  it('picks the plate by role and photo orientation', () => {
    expect(plate(0, PORTRAIT)).toBe('sampul');
    expect(plate(1, LANDSCAPE)).toBe('babak'); // the first card is the hook
    expect(plate(2, PORTRAIT)).toBe('potret-atas'); // odd content index → top bleed
    expect(plate(3, LANDSCAPE)).toBe('bentang'); // even → bottom bleed
    expect(plate(3, PORTRAIT)).toBe('potret-bawah');
    expect(plate(4, false)).toBe('teks');
    expect(plate(5, LANDSCAPE)).toBe('teks'); // layout= wins
    expect(plate(6, LANDSCAPE)).toBe('naskah');
    expect(plate(7, PORTRAIT)).toBe('akhir');
  });

  it('surface=bata makes a card the turn', () => {
    const d = parse('template: arsip/bata\n---\n[cover]\nA\n---\n[card]\nB\n---\n[card surface=bata photo=x]\nC').deck;
    expect(layoutSlide(d.slides[2]!, d, v, fakeMeasurer, null, PORTRAIT).arsip?.plate).toBe('babak');
  });

  it('draws the slide credit, else the photo credit, and nothing without a photo', () => {
    const credit = (i: number, photo: false | { w: number; h: number; credit?: string }): string[] =>
      layoutSlide(deck.slides[i]!, deck, v, fakeMeasurer, null, photo).arsip!.ops
        .flatMap((o) => (o.op === 'label' && o.font.family === 'Gentium Book Plus' ? [o.text] : []));
    expect(credit(0, { ...PORTRAIT, credit: 'Foto: Y · CC0' }).join(' ')).toContain('Gapura');
    expect(credit(2, { ...PORTRAIT, credit: 'Foto: Y · CC0' }).join(' ')).toBe('Foto: Y · CC0');
    expect(credit(4, false)).toEqual([]);
  });

  it('never tints or covers text with a photo: text ops come after every photo op', () => {
    for (let i = 0; i < deck.slides.length; i++) {
      const ops = layoutSlide(deck.slides[i]!, deck, v, fakeMeasurer, null, i === 4 ? false : PORTRAIT).arsip!.ops;
      const lastPhoto = ops.map((o) => o.op).lastIndexOf('photo');
      const firstText = ops.findIndex((o) => o.op === 'text');
      expect(firstText).toBeGreaterThan(lastPhoto);
    }
  });

  it('hands other slide types to the editorial layout', () => {
    const d = parse('template: arsip/bata\n---\n[code]\nPerintah\n```bash\nls\n```').deck;
    expect(layoutSlide(d.slides[0]!, d, v, fakeMeasurer, null, false).arsip).toBeUndefined();
  });

  it('reads sample credits from the photo-credits table', () => {
    const md = '| Photo ID | Used by | Commons file | Author | Licence |\n|---|---|---|---|---|\n| a | x | f.jpg | Glasreifen | CC BY-SA 4.0 |\n| b | x | g.tif | Unknown (KITLV) | Public domain |';
    const c = parseCredits(md);
    expect(c.get('a')).toBe('Foto: Glasreifen · CC BY-SA 4.0');
    expect(c.get('b')).toBe('Foto: Anonim (KITLV) · domain publik');
    expect(c.has('Photo ID')).toBe(false);
  });
});
