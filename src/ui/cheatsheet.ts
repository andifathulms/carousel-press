import { copyText, flash, h } from './dom';

/** PRD §4 in ~15 lines, with copyable examples. */
const ROWS: [string, string][] = [
  ['handle: @you  ·  template: dev/github-dark  ·  lang: id|en  ·  title: …  ·  caption: …', 'Header (optional), ends at the first ---'],
  ['---', 'Separates slides (not inside a [code] slide\'s ``` fence)'],
  ['[cover kicker="GIT • CHEAT SHEET"]', 'Cover: line 1 = headline, then subtitle'],
  ['Headline | second line', '| = line break, \\| = a literal pipe'],
  ['[card icon=heart]', 'Card (default after slide 1): headline + body'],
  ['[code]\nTitle\nWhat it does\n```bash\ngit status\n```\nA small note', 'Code: body, fenced code, then a note'],
  ['[quote]\nBe kind.\n— Someone', 'Quote: text, then — attribution on the next line'],
  ['[end]\nSave dulu.\nSee you!', 'End: headline + body + CTA button'],
  ['[cta="Follow dulu"]', 'Add a CTA to a card, or relabel the end button'],
  ['[number=off]  [number=7]', 'Hide or force the badge number'],
  ['[photo=senja]  [photo=1]', 'Photo by ID or tray position'],
  ['[surface=forest]  [icon=auto|none]', 'Override surface / icon'],
  ['*accent*  `inline code`', 'Accent colour and inline code'],
];

export function mountCheatsheet(root: HTMLElement): HTMLDetailsElement {
  const details = h('details', { class: 'cheatsheet' }, h('summary', {}, 'Syntax cheat sheet'));
  const list = h('dl', {});
  for (const [code, label] of ROWS) {
    const btn = h('button', { type: 'button', class: 'copy-mini', 'aria-label': `Copy ${label}` }, 'Copy');
    btn.addEventListener('click', async () => {
      flash(btn, (await copyText(code.split('  ·  ').join('\n'))) ? 'Copied' : 'Failed');
    });
    list.append(h('dt', {}, h('code', {}, code), btn), h('dd', {}, label));
  }
  details.append(list);
  root.append(details);
  return details;
}
