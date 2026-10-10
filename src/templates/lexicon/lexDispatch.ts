// word/table/compare slides in any family (SPEC-lexicon §4): header, footer and the lexicon stack.
import type { Warning } from '../../core/types';
import type { Box } from '../../render/safezone';
import { type LayoutInput, type SlideLayout, centeredShift, layoutFooter, layoutHeader, resolveSurface } from '../common';
import { lexBoxes, shiftEls } from './lexLayout';
import { ROWS } from '../../render/safezone';
import { type LexCtx, layoutCompare, layoutWord } from './lexSlides';
import { layoutTable } from './lexTable';
import { lexTokens } from './tokens';

export function layoutLexSlide(input: LayoutInput): SlideLayout {
  const { slide, deck, variant: v, measurer: m } = input;
  const warnings: Warning[] = [];
  const boxes: Box[] = [];
  const { surface, name, onPhoto } = resolveSurface(v, slide, input.hasPhoto, warnings);
  const sans = v.fonts.sans;
  const mono = v.fonts.mono;
  const c: LexCtx = {
    v, s: surface, tok: lexTokens(v, surface, onPhoto), m, lang: deck.lang, serif: v.fonts.serif ?? sans, sans,
    slideIndex: slide.index, line: slide.lines[0], warnings,
  };
  const lex = slide.type === 'word' ? layoutWord(c, slide.fields)
    : slide.type === 'compare' ? layoutCompare(c, slide.fields)
      : layoutTable(c, slide.table ?? { header: [], rows: [] }, slide.headlineSrc, slide.fields.note ?? '', slide.badge);
  // Centre a fitting stack in the content band like normal slides (owner, Oct 2026); photo slides stay top-anchored.
  const first = lex.els.find((e) => 'y' in e) as { y: number } | undefined;
  if (!lex.overflow && !onPhoto && first) {
    const dy = centeredShift(first.y, lex.bottom, ROWS.stackTopCard);
    shiftEls(lex.els, dy);
    lex.bottom += dy;
  }
  if (lex.overflow) warnings.push({ code: 'overflow', slideIndex: slide.index, line: slide.lines[0], message: `Slide ${slide.index + 1}: text doesn't fit` });

  const header = layoutHeader(input, sans, mono, boxes);
  const footer = layoutFooter(input, sans, mono, boxes, v.family !== 'dev');
  boxes.push(...lexBoxes(lex.els));
  return {
    slide, deck, variant: v, surface, surfaceName: name, onPhoto,
    stack: { placed: [], bottom: lex.bottom, overflow: lex.overflow, codeTooLong: false, charBroken: false, droppedIcon: false },
    icon: null, ctaLabel: null, header, footer, boxes, warnings, lex,
  };
}
