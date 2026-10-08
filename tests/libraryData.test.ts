import { describe, expect, it } from 'vitest';
import { SAMPLES } from '../src/samples';
import { SAMPLE_PHOTO_IDS, samplePhotosIn } from '../src/samples/photos';
import type { DeckIndexEntry } from '../src/store/deckStore';
import { countStatuses, deckCategories, deckMarkKey, deckSamples, decksFromSample, keepStatus, postStatus, sampleMarkKey, filterDecks, filterSamples, matches, sampleInfo } from '../src/ui/libraryData';

const git = sampleInfo(SAMPLES.find((s) => s.id === 'dev-git-id')!);
const deck = (over: Partial<DeckIndexEntry>): DeckIndexEntry => ({ id: 'x', title: 't', template: 'editorial/sage', updatedAt: 0, ...over });

describe('sampleInfo', () => {
  it('reads name, family, variant and slide count from the sample', () => {
    expect(git).toMatchObject({ name: '7 perintah git', family: 'dev', variantName: 'GitHub Dark', lang: 'id' });
    expect(git.slides).toBeGreaterThan(5);
  });
});

describe('decksFromSample', () => {
  it('finds tagged decks, newest first, even after a rename', () => {
    const decks = [
      deck({ id: 'old', sampleId: 'dev-git-id', title: 'renamed', updatedAt: 1 }),
      deck({ id: 'new', sampleId: 'dev-git-id', title: 'renamed too', updatedAt: 5 }),
      deck({ id: 'other', sampleId: 'dev-sql-id', title: git.title, template: git.template }),
    ];
    expect(decksFromSample(decks, git).map((d) => d.id)).toEqual(['new', 'old']);
  });
  it('matches untagged decks saved before tagging by title + template', () => {
    expect(decksFromSample([deck({ id: 'legacy', title: git.title, template: git.template })], git)).toHaveLength(1);
    expect(decksFromSample([deck({ id: 'mine', title: git.title, template: 'dev/terminal' })], git)).toHaveLength(0);
  });
});

describe('filtering', () => {
  it('matches every word, ignoring case and accents', () => {
    expect(matches('GIT undo', '6 cara undo di git')).toBe(true);
    expect(matches('cafe', 'Café pagi')).toBe(true);
    expect(matches('git sql', '6 cara undo di git')).toBe(false);
  });
  it('filters decks and samples by category and query', () => {
    const decks = [deck({ id: 'a', title: 'Sahabat' }), deck({ id: 'b', title: 'Git', template: 'dev/terminal', sampleId: 'dev-git-id' })];
    const cats = deckCategories(decks, SAMPLES.map(sampleInfo));
    expect(cats.get('b')).toBe('dev');
    expect(cats.has('a')).toBe(false);
    expect(filterDecks(decks, '', 'dev', cats).map((d) => d.id)).toEqual(['b']);
    expect(filterDecks(decks, 'git', 'all', cats).map((d) => d.id)).toEqual(['b']);
    expect(filterSamples(SAMPLES.map(sampleInfo), 'git', 'dev').map((s) => s.id).sort()).toEqual(['dev-git-id', 'dev-git-undo-id']);
    const all = SAMPLES.map(sampleInfo);
    expect(filterSamples(all, '', 'history').map((s) => s.id).every((id) => id.startsWith('sejarah-'))).toBe(true);
    expect(filterSamples(all, '', 'sports')).toHaveLength(SAMPLES.filter((s) => s.category === 'sports').length);
    expect(filterSamples(all, 'buat sahabat', 'all').map((s) => s.id)).toEqual(['editorial-sahabat-id']);
  });
});

describe('sample photos', () => {
  it('every photo a sample uses is bundled, and every bundled photo is used', () => {
    const used = new Set(SAMPLES.flatMap((s) => samplePhotosIn(s.text).map((p) => p.id)));
    const refs = new Set(SAMPLES.flatMap((s) => [...s.text.matchAll(/\bphoto="?([^\s\]"]+)/g)].map((m) => m[1]!)));
    for (const r of refs) if (!/^\d+$/.test(r) && r !== 'sample-dusk') expect(SAMPLE_PHOTO_IDS).toContain(r);
    expect([...used].sort()).toEqual([...SAMPLE_PHOTO_IDS].sort());
  });
});

describe('posting status', () => {
  const all = SAMPLES.map(sampleInfo);
  const decks = [deck({ id: 'a', sampleId: 'dev-git-id' }), deck({ id: 'b', title: 'Mine' })];
  const from = deckSamples(decks, all);
  it('a deck from a sample shares the sample key; own decks get their own', () => {
    expect(deckMarkKey('a', from)).toBe(sampleMarkKey('dev-git-id'));
    expect(deckMarkKey('b', from)).toBe('d:b');
  });
  it('defaults to todo, counts and filters', () => {
    const marks = { [sampleMarkKey('dev-git-id')]: { state: 'posted' as const, at: 1 }, 'd:b': { state: 'skip' as const, at: 2 } };
    expect(postStatus(marks, 's:other')).toBe('todo');
    expect(countStatuses(['s:dev-git-id', 'd:b', 's:other'], marks)).toEqual({ todo: 1, posted: 1, skip: 1 });
    expect(keepStatus('s:other', marks, 'todo')).toBe(true);
    expect(keepStatus('s:dev-git-id', marks, 'todo')).toBe(false);
    expect(keepStatus('s:dev-git-id', marks, 'all')).toBe(true);
  });
});
