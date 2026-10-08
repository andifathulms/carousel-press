import { parse } from '../core/parser';
import { isTemplateId } from '../core/types';
import type { Sample, SampleCategory } from '../samples';
import type { DeckIndexEntry, PostMark, PostMarks } from '../store/deckStore';
import { getVariant } from '../templates/registry';

// Library helpers without DOM: sample metadata, sample ↔ deck matching, filtering.

export type Family = 'editorial' | 'dev';
export type CategoryFilter = 'all' | SampleCategory;
export type PostStatus = 'todo' | PostMark['state'];
export type StatusFilter = 'all' | PostStatus;

export interface SampleInfo {
  id: string;
  name: string;
  title: string;
  template: string;
  category: SampleCategory;
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
    id: s.id, name: shortName(s.name), title: deck.title, template: deck.template, category: s.category, family: familyOf(deck.template),
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

/** The sample each saved deck came from. Decks written from scratch have none. */
export function deckSamples(decks: readonly DeckIndexEntry[], samples: readonly SampleInfo[]): Map<string, SampleInfo> {
  const out = new Map<string, SampleInfo>();
  for (const s of samples) for (const d of decksFromSample(decks, s)) out.set(d.id, s);
  return out;
}

/** Category of each saved deck that came from a sample. */
export function deckCategories(decks: readonly DeckIndexEntry[], samples: readonly SampleInfo[]): Map<string, SampleCategory> {
  return new Map([...deckSamples(decks, samples)].map(([id, s]) => [id, s.category]));
}

// ---- posting status -----------------------------------------------------------
// A deck made from a sample shares the sample's mark, so marking either marks both.

export const sampleMarkKey = (sampleId: string): string => `s:${sampleId}`;

export function deckMarkKey(deckId: string, fromSample: ReadonlyMap<string, SampleInfo>): string {
  const s = fromSample.get(deckId);
  return s ? sampleMarkKey(s.id) : `d:${deckId}`;
}

export function postStatus(marks: PostMarks, key: string): PostStatus {
  return marks[key]?.state ?? 'todo';
}

export function countStatuses(keys: readonly string[], marks: PostMarks): Record<PostStatus, number> {
  const out: Record<PostStatus, number> = { todo: 0, posted: 0, skip: 0 };
  for (const k of keys) out[postStatus(marks, k)]++;
  return out;
}

export function keepStatus(key: string, marks: PostMarks, filter: StatusFilter): boolean {
  return filter === 'all' || postStatus(marks, key) === filter;
}

export function filterDecks(
  decks: readonly DeckIndexEntry[], query: string, category: CategoryFilter, cats: ReadonlyMap<string, SampleCategory>,
): DeckIndexEntry[] {
  return decks.filter((d) => (category === 'all' || cats.get(d.id) === category) && matches(query, d.title));
}

export function filterSamples(samples: readonly SampleInfo[], query: string, category: CategoryFilter): SampleInfo[] {
  return samples.filter((s) => (category === 'all' || s.category === category) && matches(query, s.name, s.title));
}
