import type {
  CodeBlock, Deck, DeckHeader, Lang, ParseResult, Rich, Slide, SlideAttrs, SlideType, TemplateId, Warning,
} from './types';
import { DEFAULT_TEMPLATE, LANGS, SLIDE_TYPES, isTemplateId } from './types';
import { parseInline, parseRich, richToPlain } from './inline';
import { canonicalIcon } from './iconNames';
import { numberSlides } from './numbering';
import { slugify } from './slug';

export interface ParseOptions {
  /** Template used when the header has none (last used). */
  defaultTemplate?: TemplateId;
  /** Handle used when the header has none (from Settings). */
  defaultHandle?: string;
  /** Photo IDs in tray order. When given, `photo=` is resolved and checked. */
  photoIds?: readonly string[];
}

export const HEADER_KEYS = ['handle', 'template', 'lang', 'title', 'caption'] as const;
type HeaderKey = (typeof HEADER_KEYS)[number];
const HEADER_LINE = /^\s*([a-z]+)\s*:\s*(.*)$/;
const TAG_LINE = /^\[[^\]]*\]$/;
const FENCE = /^\s*```/;
const KNOWN_ATTRS = ['photo', 'icon', 'surface', 'cta', 'number', 'kicker'] as const;
const LONG_DECK = 10;

/** Split text into lines: accepts \n and \r\n. */
export function splitLines(text: string): string[] {
  return text.split(/\r?\n/);
}

/** Line index of the separator that ends the header, or -1 when there's no header. */
export function findHeaderEnd(lines: readonly string[]): number {
  const sep = lines.findIndex((l) => l.trim() === '---');
  if (sep < 0) return -1;
  let known = 0;
  for (let i = 0; i < sep; i++) {
    const l = lines[i]!;
    if (l.trim() === '') continue;
    const m = HEADER_LINE.exec(l);
    if (!m) return -1;
    if ((HEADER_KEYS as readonly string[]).includes(m[1]!)) known++;
  }
  return known > 0 ? sep : -1;
}

interface RawBlock {
  start: number;
  end: number;
  lines: string[];
}

/** Split body lines into blocks at `---`, ignoring separators inside code fences. */
function splitBlocks(lines: readonly string[], from: number): RawBlock[] {
  const blocks: RawBlock[] = [];
  let cur: string[] = [];
  let start = from;
  let inFence = false;
  for (let i = from; i < lines.length; i++) {
    const raw = lines[i]!;
    if (FENCE.test(raw)) inFence = !inFence;
    if (!inFence && raw.trim() === '---') {
      blocks.push({ start, end: i - 1, lines: cur });
      cur = [];
      start = i + 1;
      continue;
    }
    cur.push(raw);
  }
  blocks.push({ start, end: lines.length - 1, lines: cur });
  return blocks;
}

interface TagToken {
  key: string;
  value: string | true;
}

/** Tokenise the inside of `[ ... ]`. Values may be bare or "quoted" with \" escapes. */
export function tokenizeTag(inner: string): TagToken[] {
  const out: TagToken[] = [];
  let i = 0;
  const n = inner.length;
  while (i < n) {
    while (i < n && /\s/.test(inner[i]!)) i++;
    if (i >= n) break;
    let key = '';
    while (i < n && !/[\s=]/.test(inner[i]!)) key += inner[i++];
    if (inner[i] !== '=') {
      if (key) out.push({ key, value: true });
      continue;
    }
    i++; // '='
    let value = '';
    if (inner[i] === '"') {
      i++;
      while (i < n && inner[i] !== '"') {
        if (inner[i] === '\\' && inner[i + 1] === '"') {
          value += '"';
          i += 2;
        } else value += inner[i++];
      }
      i++; // closing quote (or end)
    } else {
      while (i < n && !/\s/.test(inner[i]!)) value += inner[i++];
    }
    out.push({ key, value });
  }
  return out;
}

function expandTabs(s: string): string {
  return s.replace(/\t/g, '  ');
}

/** Parse deck text. Never throws. */
export function parse(text: unknown, opts: ParseOptions = {}): ParseResult {
  try {
    return parseUnsafe(typeof text === 'string' ? text : String(text ?? ''), opts);
  } catch (err) {
    const deck = emptyDeck(opts);
    return {
      deck,
      warnings: [{ code: 'overflow', slideIndex: null, line: 0, message: `Parser error: ${String(err)}` }],
    };
  }
}

function emptyDeck(opts: ParseOptions): Deck {
  return {
    header: {}, hasHeader: false, template: opts.defaultTemplate ?? DEFAULT_TEMPLATE, lang: 'id',
    handle: opts.defaultHandle ?? '', title: '', caption: '', slug: 'carousel', slides: [],
  };
}

function parseUnsafe(text: string, opts: ParseOptions): ParseResult {
  const warnings: Warning[] = [];
  const lines = splitLines(text);
  const headerEnd = findHeaderEnd(lines);
  const header: DeckHeader = {};

  if (headerEnd >= 0) {
    for (let i = 0; i < headerEnd; i++) {
      const m = HEADER_LINE.exec(lines[i]!);
      if (!m) continue;
      const key = m[1]!;
      const value = m[2]!.trim();
      if (!(HEADER_KEYS as readonly string[]).includes(key)) {
        warnings.push({ code: 'unknown-header-key', slideIndex: null, line: i, message: `Unknown header key "${key}"` });
        continue;
      }
      header[key as HeaderKey] = value;
    }
  }

  let template: TemplateId = opts.defaultTemplate ?? DEFAULT_TEMPLATE;
  if (header.template !== undefined) {
    if (isTemplateId(header.template)) template = header.template;
    else {
      const line = lines.findIndex((l, i) => i < headerEnd && /^\s*template\s*:/.test(l));
      warnings.push({
        code: 'unknown-template', slideIndex: null, line: Math.max(0, line),
        message: `Unknown template "${header.template}", using ${template}`,
      });
    }
  }
  const lang: Lang = (LANGS as readonly string[]).includes(header.lang ?? '') ? (header.lang as Lang) : 'id';

  const slides: Slide[] = [];
  for (const block of splitBlocks(lines, headerEnd + 1)) {
    if (block.lines.every((l) => l.trim() === '')) continue;
    const slide = parseBlock(block, slides.length, warnings, opts);
    slides.push(slide);
  }

  if (slides.length > LONG_DECK) {
    warnings.push({
      code: 'long-deck', slideIndex: null, line: 0,
      message: `${slides.length} slides. Carousels over ${LONG_DECK} slides tend to lose viewers`,
    });
  }

  numberSlides(slides);

  const cover = slides.find((s) => s.type === 'cover') ?? slides[0];
  const coverTitle = cover ? richToPlain(cover.headline).replace(/\n/g, ' ') : '';
  const title = header.title || coverTitle;
  const deck: Deck = {
    header, hasHeader: headerEnd >= 0, template, lang,
    handle: header.handle ?? opts.defaultHandle ?? '',
    title, caption: header.caption ?? '',
    slug: slugify(title) || 'carousel',
    slides,
  };
  return { deck, warnings };
}

function parseBlock(block: RawBlock, index: number, warnings: Warning[], opts: ParseOptions): Slide {
  const L = block.lines;
  let i = 0;
  while (i < L.length && L[i]!.trim() === '') i++;

  let type: SlideType | null = null;
  const attrs: SlideAttrs = {};
  const tagLine = block.start + i;
  const warn = (code: Warning['code'], message: string, line = tagLine): void => {
    warnings.push({ code, slideIndex: index, line, message });
  };

  const first = L[i]?.trim() ?? '';
  if (TAG_LINE.test(first)) {
    const tokens = tokenizeTag(first.slice(1, -1));
    tokens.forEach((tok, k) => {
      if (k === 0 && tok.value === true) {
        if ((SLIDE_TYPES as readonly string[]).includes(tok.key)) {
          type = tok.key as SlideType;
          return;
        }
        if (tok.key !== 'cta') {
          warn('unknown-slide-type', `Unknown slide type "${tok.key}", rendered as card`);
          type = 'card';
          return;
        }
      }
      applyAttr(tok, attrs, warn);
    });
    i++;
  }
  const finalType: SlideType = type ?? (index === 0 ? 'cover' : 'card');

  // Content lines (trailing whitespace trimmed outside fences).
  const content: { text: string; line: number }[] = [];
  for (; i < L.length; i++) content.push({ text: L[i]!, line: block.start + i });
  while (content.length && content[0]!.text.trim() === '') content.shift();

  const slide = makeSlide(index, finalType, attrs, block);
  const head = content.shift();
  if (!head || FENCE.test(head.text)) {
    warn('missing-headline', 'This slide has no headline');
    if (head) content.unshift(head);
  } else {
    slide.headlineSrc = head.text.trim();
    slide.headline = [parseInline(slide.headlineSrc)];
  }

  if (finalType === 'code') fillCode(slide, content, warn);
  else if (finalType === 'quote') fillQuote(slide, content);
  else slide.body = parseRich(content.map((c) => c.text));

  checkAttrScope(slide, warn);
  resolvePhoto(slide, opts, warn);
  return slide;
}

function makeSlide(index: number, type: SlideType, attrs: SlideAttrs, block: RawBlock): Slide {
  return {
    index, type, attrs, headlineSrc: '', headline: [], body: [], note: [], attribution: null, code: null,
    photoId: null, lines: [block.start, Math.max(block.start, block.end)],
    badge: null, counter: { i: index + 1, total: 0 }, swipe: null, showCta: false, contentIndex: -1,
  };
}

type Warn = (code: Warning['code'], message: string, line?: number) => void;

function applyAttr(tok: TagToken, attrs: SlideAttrs, warn: Warn): void {
  const { key, value } = tok;
  if (!(KNOWN_ATTRS as readonly string[]).includes(key)) {
    warn('unknown-attr', value === true ? `Unknown flag "${key}"` : `Unknown attribute "${key}"`);
    return;
  }
  if (key === 'cta') {
    attrs.cta = value === true || value === '' ? true : value;
    return;
  }
  if (value === true) {
    warn('unknown-attr', `"${key}" needs a value, e.g. ${key}=…`);
    return;
  }
  switch (key) {
    case 'number':
      if (value === 'off') attrs.number = 'off';
      else if (/^\d+$/.test(value)) attrs.number = parseInt(value, 10);
      else warn('unknown-attr', `number must be "off" or an integer, got "${value}"`);
      break;
    case 'icon':
      if (value === 'auto' || value === 'none' || canonicalIcon(value)) attrs.icon = value.toLowerCase();
      else warn('unknown-attr', `Unknown icon "${value}"`);
      break;
    case 'photo': attrs.photo = value; break;
    case 'surface': attrs.surface = value; break;
    case 'kicker': attrs.kicker = value; break;
  }
}

/** PRD §4.3 "Applies to" column. Out-of-scope attributes are ignored with a warning. */
function checkAttrScope(slide: Slide, warn: Warn): void {
  const a = slide.attrs;
  const drop = (k: keyof SlideAttrs): void => {
    delete a[k];
    warn('unknown-attr', `"${k}" doesn't apply to ${slide.type} slides`);
  };
  if (a.icon !== undefined && slide.type === 'cover') drop('icon');
  if (a.cta !== undefined && (slide.type === 'cover' || slide.type === 'end')) drop('cta');
  if (a.number !== undefined && slide.type !== 'card' && slide.type !== 'code') drop('number');
  if (a.kicker !== undefined && slide.type !== 'cover') drop('kicker');
}

function resolvePhoto(slide: Slide, opts: ParseOptions, warn: Warn): void {
  const ref = slide.attrs.photo;
  if (ref === undefined) return;
  if (!opts.photoIds) {
    slide.photoId = ref;
    return;
  }
  let id: string | undefined;
  if (/^\d+$/.test(ref)) id = opts.photoIds[parseInt(ref, 10) - 1];
  else if (opts.photoIds.includes(ref)) id = ref;
  if (id) slide.photoId = id;
  else warn('unknown-photo', `No photo "${ref}" in the tray`);
}

function fillCode(slide: Slide, content: { text: string; line: number }[], warn: Warn): void {
  const fenceAt = content.findIndex((c) => FENCE.test(c.text));
  if (fenceAt < 0) {
    warn('code-missing-fence', 'Code slide without a ``` fence, rendered as a card');
    slide.type = 'card';
    slide.body = parseRich(content.map((c) => c.text));
    return;
  }
  slide.body = parseRich(content.slice(0, fenceAt).map((c) => c.text));
  const open = content[fenceAt]!;
  const lang = open.text.trim().slice(3).trim().toLowerCase();
  const rest = content.slice(fenceAt + 1);
  const closeAt = rest.findIndex((c) => /^\s*```\s*$/.test(c.text));
  let codeLines: string[];
  let after: string[] = [];
  if (closeAt < 0) {
    warn('unclosed-fence', 'Code fence is never closed', open.line);
    codeLines = rest.map((c) => c.text);
  } else {
    codeLines = rest.slice(0, closeAt).map((c) => c.text);
    after = rest.slice(closeAt + 1).map((c) => c.text);
  }
  while (codeLines.length && codeLines[codeLines.length - 1]!.trim() === '') codeLines.pop();
  const code: CodeBlock = { text: codeLines.map(expandTabs).join('\n'), lang };
  slide.code = code;
  slide.note = parseRich(after);
}

const ATTRIBUTION = /^(—|--|-)\s+(.*)$/;

function fillQuote(slide: Slide, content: { text: string; line: number }[]): void {
  const body: string[] = [];
  for (const c of content) {
    const m = ATTRIBUTION.exec(c.text.trim());
    if (m && slide.attribution === null) slide.attribution = m[2]!.trim();
    else body.push(c.text);
  }
  slide.body = parseRich(body) as Rich;
}
