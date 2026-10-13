// Serene family (SPEC-ayah §3.3–4): ayah/hadith layouts; other slides use the editorial layouts, centred.
import { isArabicType, isLexType } from '../../core/types';
import type { LayoutInput, SlideLayout } from '../common';
import { layoutEditorial } from '../editorial/layout';
import { layoutLexSlide } from '../lexicon/lexDispatch';
import { layoutArabicSlide } from './arabicLayout';

export function layoutSerene(input: LayoutInput): SlideLayout {
  if (isArabicType(input.slide.type)) return layoutArabicSlide(input);
  if (isLexType(input.slide.type)) return layoutLexSlide(input);
  return layoutEditorial(input, { center: true });
}
