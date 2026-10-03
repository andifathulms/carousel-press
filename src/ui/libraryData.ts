import { parse } from '../core/parser';
import { isTemplateId } from '../core/types';
import type { Sample } from '../samples';
import type { DeckIndexEntry } from '../store/deckStore';
import { getVariant } from '../templates/registry';

// Library helpers without DOM: sample metadata, sample ↔ deck matching, filtering.

export type Family = 'editorial' | 'dev';
export type FamilyFilter = 'all' | Family;

export interface SampleInfo {
  id: string;
  name: string;
  title: string;
  template: string;
  family: Family;
  variantName: string;
  lang: string;
  slides: number;
}

export function familyOf(template: string): Family {
  return template.startsWith('dev/') ? 'dev' : 'editorial';
}

export function variantName(template: string): string {
  return isTemplateId(template) ? getVariant(template).name : template;
}

/** "5 pertanyaan kecil (editorial, id)" → "5 pertanyaan kecil". */
function shortName(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, '');
}

export function sampleInfo(s: Sample): SampleInfo {
  const { deck } = parse(s.text);
  return {
    id: s.id, name: shortName(s.name), title: deck.title, template: deck.template, family: familyOf(deck.template),
    variantName: variantName(deck.template), lang: deck.lang, slides: deck.slides.length,
  };
}

/**
 * The saved deck that came from this sample, if any. Decks saved before samples were tagged
 * are matched by title + template, so old copies count too. Newest first.
 */
export function decksFromSample(decks: readonly DeckIndexEntry[], info: SampleInfo): DeckIndexEntry[] {
  return decks
    .filter((d) => d.sampleId === info.id || (!d.sampleId && d.title === info.title && d.template === info.template))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

const norm = (t: string): string => t.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();

/** Every query word must appear in one of the fields. Titles only: template names ("GitHub Dark") would add noise. */
export function matches(query: string, ...fields: string[]): boolean {
  const hay = norm(fields.join(' '));
  return norm(query).split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
}

export function filterDecks(decks: readonly DeckIndexEntry[], query: string, family: FamilyFilter): DeckIndexEntry[] {
  return decks.filter((d) =>
    (family === 'all' || familyOf(d.template) === family) && matches(query, d.title));
}

export function filterSamples(samples: readonly SampleInfo[], query: string, family: FamilyFilter): SampleInfo[] {
  return samples.filter((s) =>
    (family === 'all' || s.family === family) && matches(query, s.name, s.title));
}
