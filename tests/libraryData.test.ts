import { describe, expect, it } from 'vitest';
import { SAMPLES } from '../src/samples';
import type { DeckIndexEntry } from '../src/store/deckStore';
import { decksFromSample, filterDecks, filterSamples, matches, sampleInfo } from '../src/ui/libraryData';

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
  it('filters decks and samples by family and query', () => {
    const decks = [deck({ id: 'a', title: 'Sahabat' }), deck({ id: 'b', title: 'Git', template: 'dev/terminal' })];
    expect(filterDecks(decks, '', 'dev').map((d) => d.id)).toEqual(['b']);
    expect(filterDecks(decks, 'git', 'all').map((d) => d.id)).toEqual(['b']);
    expect(filterSamples(SAMPLES.map(sampleInfo), 'git', 'dev').map((s) => s.id).sort()).toEqual(['dev-git-id', 'dev-git-undo-id']);
    const all = SAMPLES.map(sampleInfo);
    expect(filterSamples(all, '', 'editorial').every((s) => s.family === 'editorial')).toBe(true);
    expect(filterSamples(all, 'sahabat', 'all').map((s) => s.id)).toEqual(['editorial-sahabat-id']);
  });
});
