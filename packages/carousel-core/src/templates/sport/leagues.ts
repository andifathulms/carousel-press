import type { Surface, Variant } from '../types';
import { papan } from './variants';

// League templates for Sports Codex match recaps (owner, Oct 2026): one colour world per
// competition so a feed of recaps is recognisable at a glance. Colours only, inspired by each
// competition's broadcast palette; no logos, wordmarks or patterns from their identities.
// Same family, fonts and layout as sport/papan; all pairs pass contrast.test.ts.

const S = (
  bg: string, ink: string, body: string, muted: string, accent: string,
  badgeBg: string, badgeInk: string, blob: string, icon: string, inlineCodeBg: string,
): Surface => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });

function league(id: string, name: string, main: Surface, deep: Surface, tint: string): Variant {
  const key = id.split('/')[1]!;
  return {
    ...papan,
    id,
    name,
    surfaces: { [key]: main, deep },
    rotation: [key],
    onPhoto: { ...papan.onPhoto, accent: main.accent, badgeBg: main.accent, tint },
    semantic: { ok: '#3DDC84', warn: '#F5C518', bad: '#FF6B63' },
    swatches: [main.bg, deep.bg, main.accent, main.ink],
  };
}

/** Premier League: deep purple, electric green. */
export const pl = league('sport/pl', 'Premier League',
  S('#38003C', '#FFFFFF', '#EBDDEE', '#C2A7C7', '#00FF85', '#00FF85', '#38003C', '#38003C', '#00FF85', '#4A0F4F'),
  S('#2A002D', '#FFFFFF', '#EBDDEE', '#BFA3C4', '#00FF85', '#00FF85', '#2A002D', '#2A002D', '#00FF85', '#3B0A40'), '#14001A');

/** LaLiga: charcoal, coral red. */
export const laliga = league('sport/laliga', 'LaLiga',
  S('#17171B', '#FFFFFF', '#E4E4E8', '#A9A9B2', '#FF5A4E', '#FF5A4E', '#17171B', '#17171B', '#FF5A4E', '#24242A'),
  S('#0F0F12', '#FFFFFF', '#E4E4E8', '#A3A3AC', '#FF5A4E', '#FF5A4E', '#0F0F12', '#0F0F12', '#FF5A4E', '#1C1C21'), '#08080A');

/** Serie A: midnight navy, aqua. */
export const seriea = league('sport/seriea', 'Serie A',
  S('#0B1F3F', '#FFFFFF', '#DCE6F5', '#9CB0CF', '#3EE6D2', '#3EE6D2', '#0B1F3F', '#0B1F3F', '#3EE6D2', '#13305C'),
  S('#081831', '#FFFFFF', '#DCE6F5', '#97ABCB', '#3EE6D2', '#3EE6D2', '#081831', '#081831', '#3EE6D2', '#0F284D'), '#040C1A');

/** Bundesliga: deep red, warm yellow. */
export const bundesliga = league('sport/bundesliga', 'Bundesliga',
  S('#8E0A16', '#FFFFFF', '#FFE3E3', '#FFB9B9', '#FFD54A', '#FFD54A', '#8E0A16', '#8E0A16', '#FFD54A', '#A51A26'),
  S('#740811', '#FFFFFF', '#FFE3E3', '#FFB5B5', '#FFD54A', '#FFD54A', '#740811', '#740811', '#FFD54A', '#8A121D'), '#2A0306');

/** Champions League: night blue, silver-cyan. */
export const ucl = league('sport/ucl', 'Liga Champions',
  S('#0A1A4F', '#FFFFFF', '#DCE4FA', '#9DADDB', '#8FE3FF', '#8FE3FF', '#0A1A4F', '#0A1A4F', '#8FE3FF', '#132A6E'),
  S('#06123A', '#FFFFFF', '#DCE4FA', '#98A8D6', '#8FE3FF', '#8FE3FF', '#06123A', '#06123A', '#8FE3FF', '#0E2259'), '#030A22');

/** Europa League: dark brown, orange. */
export const uel = league('sport/uel', 'Liga Europa',
  S('#2E1C12', '#FFFFFF', '#F3E3D6', '#C9AE98', '#FF8A1F', '#FF8A1F', '#2E1C12', '#2E1C12', '#FF8A1F', '#3F2819'),
  S('#22140C', '#FFFFFF', '#F3E3D6', '#C5A992', '#FF8A1F', '#FF8A1F', '#22140C', '#22140C', '#FF8A1F', '#33200F'), '#120A05');

/** Conference League: black-green, lime. */
export const uecl = league('sport/uecl', 'Liga Konferensi',
  S('#0D1F14', '#FFFFFF', '#DDF0E2', '#9CC0A6', '#3DF06E', '#3DF06E', '#0D1F14', '#0D1F14', '#3DF06E', '#16301F'),
  S('#08160D', '#FFFFFF', '#DDF0E2', '#97BBA1', '#3DF06E', '#3DF06E', '#08160D', '#08160D', '#3DF06E', '#112818'), '#040B06');

export const LEAGUE_VARIANTS: readonly Variant[] = [pl, laliga, seriea, bundesliga, ucl, uel, uecl];
