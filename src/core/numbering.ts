import type { Slide } from './types';

/**
 * Fill badge numbers, counters, swipe hints and CTA flags (PRD §4.6).
 * Mutates and returns the slides.
 */
export function numberSlides(slides: Slide[]): Slide[] {
  const total = slides.length;
  let running = 0;
  let content = 0;
  slides.forEach((s, i) => {
    s.index = i;
    s.counter = { i: i + 1, total };

    s.badge = null;
    if (s.type === 'card' || s.type === 'code' || (s.type === 'table' && typeof s.attrs.number === 'number')) {
      const n = s.attrs.number;
      if (n === 'off') {
        // skipped: doesn't consume a number
      } else if (typeof n === 'number') {
        running++;
        s.badge = n;
      } else {
        running++;
        s.badge = running;
      }
    }

    const isContent = s.type === 'card' || s.type === 'code' || s.type === 'quote' ||
      s.type === 'word' || s.type === 'table' || s.type === 'compare';
    s.contentIndex = isContent ? content++ : -1;

    s.showCta = s.type === 'end' || (isContent && s.attrs.cta !== undefined);
    if (s.type === 'cover') s.swipe = 'coverSwipe';
    else if (s.type === 'end' || s.showCta) s.swipe = null;
    else s.swipe = 'swipe';
  });
  return slides;
}
