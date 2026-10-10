import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { DEV_ICONS, EDITORIAL_ICONS, ICON_ALIASES } from '../src/core/iconNames';

// docs/channels.md is what deck writers (people and agents) read: its icon list must match the app.
describe('channels.md', () => {
  it('lists exactly the icons `icon=` accepts', () => {
    const brief = readFileSync(new URL('../docs/channels.md', import.meta.url), 'utf8');
    const line = /^- Icons available for `icon=`: (.*?) \(aliases: (.*?)\)\./m.exec(brief);
    expect(line).not.toBeNull();
    const listed = line![1]!.split(', ').sort();
    expect(listed).toEqual([...new Set([...EDITORIAL_ICONS, ...DEV_ICONS])].sort());
    expect(line![2]!.split(', ').sort()).toEqual(Object.keys(ICON_ALIASES).sort());
  });
});
