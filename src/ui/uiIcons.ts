// Original UI glyphs for the app chrome (24×24, stroke 1.75).
const wrap = (d: string, cls = ''): string =>
  `<svg class="ui-icon ${cls}" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

export const UI_ICONS = {
  prev: wrap('M14.5 6l-6 6 6 6'),
  next: wrap('M9.5 6l6 6-6 6'),
  down: wrap('M6.5 9.5l5.5 5.5 5.5-5.5'),
  copy: wrap('M8.5 8.5h10v11h-10z M15.5 8.5V4.5h-10v11h3'),
  download: wrap('M12 4v11 M7.5 10.5L12 15l4.5-4.5 M5 19.5h14'),
  upload: wrap('M12 15.5v-11 M7.5 9L12 4.5 16.5 9 M5 19.5h14'),
  plus: wrap('M12 5v14 M5 12h14'),
  close: wrap('M6.5 6.5l11 11 M17.5 6.5l-11 11'),
  help: wrap('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.6 9.4a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2-2.4 3.6 M12 17.2v.1'),
  warn: wrap('M12 4.5l8.5 15h-17z M12 10v4.2 M12 17v.1'),
  image: wrap('M4.5 5.5h15v13h-15z M4.5 15.5l4-4 3.5 3.5 2.5-2.5 5 4.5 M15.5 9.2v.1'),
  pen: wrap('M5 19l1-4L16 5l3 3L9 18z M14 7l3 3'),
  eye: wrap('M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'),
  box: wrap('M4.5 8l7.5-3.5L19.5 8v8.5L12 20l-7.5-3.5z M4.5 8L12 11.5 19.5 8 M12 11.5V20'),
  trash: wrap('M5 7h14 M9.5 7V4.5h5V7 M7 7l1 12.5h8L17 7'),
  grid: wrap('M4.5 4.5h15v15h-15z M4.5 12h15 M12 4.5v15'),
  back: wrap('M14.5 5.5L8 12l6.5 6.5'),
  check: wrap('M5 12.5l5 4.5 9-10'),
  expand: wrap('M4 9V4h5 M20 9V4h-5 M4 15v5h5 M20 15v5h-5'),
  send: wrap('M12 15V4 M7.5 8.5L12 4l4.5 4.5 M5 13v5.5c0 .8.7 1.5 1.5 1.5h11c.8 0 1.5-.7 1.5-1.5V13'),
  style: wrap('M4 3.5h7v11H4z M13 9.5h7v11h-7z'),
  safe: wrap('M5 3h14v18H5z M8.5 7h7v10h-7z'),
  stack: wrap('M4 8.5L12 4l8 4.5-8 4.5z M4 13l8 4.5 8-4.5'),
  search: wrap('M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M16 16l4 4'),
  file: wrap('M6.5 3.5h7l4 4v13h-11z M13.5 3.5v4h4'),
  more: wrap('M6 12h.01 M12 12h.01 M18 12h.01'),
};

/** Registration mark: circle + crosshair (top-bar logo). */
export const REG_MARK = `<svg class="reg-mark" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="4.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 0.8v14.4M0.8 8h14.4" stroke="currentColor" stroke-width="1.2"/></svg>`;
