import type { TemplateId } from '../core/types';
import { VARIANTS } from '../templates/registry';
import type { Variant } from '../templates/types';
import { h, svg } from './dom';
import { UI_ICONS } from './uiIcons';

const swatches = (v: Variant): HTMLElement =>
  h('span', { class: 'swatches', 'aria-hidden': 'true' }, ...v.swatches.map((c) => h('i', { style: `background:${c}` })));

const GROUPS: { label: string; family: Variant['family'] }[] = [
  { label: 'Editorial', family: 'editorial' },
  { label: 'Dev', family: 'dev' },
];

/** Dropdown grouped by family; each option shows 4 swatches + the variant name. */
export function createTemplatePicker(onPick: (id: TemplateId) => void): { el: HTMLElement; set(id: TemplateId): void } {
  let current: TemplateId = VARIANTS[0]!.id;
  const label = h('span', { class: 'picker-label' });
  const button = h('button', {
    type: 'button', class: 'picker-button', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', 'aria-label': 'Template',
  }, label, svg(UI_ICONS.down));
  const list = h('div', { class: 'picker-list', role: 'listbox', tabindex: '-1', hidden: true, 'aria-label': 'Templates' });
  const options: { id: TemplateId; el: HTMLElement }[] = [];
  for (const g of GROUPS) {
    const groupId = `grp-${g.family}`;
    const group = h('div', { role: 'group', 'aria-labelledby': groupId }, h('div', { class: 'picker-group', id: groupId }, g.label));
    for (const v of VARIANTS.filter((x) => x.family === g.family)) {
      const el = h('div', { role: 'option', class: 'picker-option', id: `opt-${v.id.replace('/', '-')}`, 'aria-selected': 'false' },
        swatches(v), h('span', {}, v.name), h('span', { class: 'picker-id' }, v.id));
      el.addEventListener('click', () => choose(v.id));
      options.push({ id: v.id, el });
      group.append(el);
    }
    list.append(group);
  }
  const el = h('div', { class: 'picker' }, button, list);

  let active = 0;
  const highlight = (i: number): void => {
    active = (i + options.length) % options.length;
    options.forEach((o, k) => o.el.classList.toggle('active', k === active));
    list.setAttribute('aria-activedescendant', options[active]!.el.id);
    options[active]!.el.scrollIntoView({ block: 'nearest' });
  };
  const open = (): void => {
    list.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    highlight(Math.max(0, options.findIndex((o) => o.id === current)));
    list.focus();
    setTimeout(() => document.addEventListener('mousedown', outside), 0);
  };
  const close = (focus = true): void => {
    list.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', outside);
    if (focus) button.focus();
  };
  const outside = (e: MouseEvent): void => {
    if (!el.contains(e.target as Node)) close(false);
  };
  const choose = (id: TemplateId): void => {
    close();
    if (id !== current) onPick(id);
  };

  button.addEventListener('click', () => (list.hidden ? open() : close()));
  button.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      open();
    }
  });
  list.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') highlight(active + 1);
    else if (e.key === 'ArrowUp') highlight(active - 1);
    else if (e.key === 'Home') highlight(0);
    else if (e.key === 'End') highlight(options.length - 1);
    else if (e.key === 'Enter' || e.key === ' ') choose(options[active]!.id);
    else if (e.key === 'Escape' || e.key === 'Tab') close(e.key === 'Escape');
    else return;
    e.preventDefault();
  });

  const set = (id: TemplateId): void => {
    current = id;
    const v = VARIANTS.find((x) => x.id === id)!;
    label.replaceChildren(swatches(v), h('span', {}, v.id));
    for (const o of options) o.el.setAttribute('aria-selected', String(o.id === id));
  };
  set(current);
  return { el, set };
}
