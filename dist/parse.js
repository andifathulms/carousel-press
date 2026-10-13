import { m as builtinFamilyOf, D as DEFAULT_TEMPLATE, L as LANGS, n as richToPlain, b as slugify, o as SLIDE_TYPES, p as isArabicType, q as fillAyah, u as fillHadith, v as isLexType, x as fillWord, y as fillCompare, z as parseInline, E as fillTable, F as parseRich, G as canonicalIcon, I as templateFamily } from "./registry-CfRP1EtO.js";
import { B, a, V, g, h, i, l, r, s, d } from "./registry-CfRP1EtO.js";
function numberSlides(slides, opts = {}) {
  const autoBadge = opts.autoBadge ?? true;
  const total = slides.length;
  let running = 0;
  let content = 0;
  slides.forEach((s2, i2) => {
    s2.index = i2;
    s2.counter = { i: i2 + 1, total };
    s2.badge = null;
    if (s2.type === "card" || s2.type === "code" || s2.type === "diagram" || s2.type === "table" && typeof s2.attrs.number === "number") {
      const n = s2.attrs.number;
      if (n === "off" || n === void 0 && !autoBadge) ;
      else if (typeof n === "number") {
        running++;
        s2.badge = n;
      } else {
        running++;
        s2.badge = running;
      }
    }
    const isContent = s2.type === "card" || s2.type === "code" || s2.type === "diagram" || s2.type === "quote" || s2.type === "word" || s2.type === "table" || s2.type === "compare" || s2.type === "ayah" || s2.type === "hadith";
    s2.contentIndex = isContent ? content++ : -1;
    s2.showCta = s2.type === "end" || isContent && s2.attrs.cta !== void 0;
    if (s2.type === "cover") s2.swipe = "coverSwipe";
    else if (s2.type === "end" || s2.showCta) s2.swipe = null;
    else s2.swipe = "swipe";
  });
  return slides;
}
const DIAGRAM_FIELDS = ["football", "futsal", "badminton", "volleyball", "basketball", "tennis"];
function isDiagramField(v) {
  return DIAGRAM_FIELDS.includes(v);
}
const PT = /^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/;
const NUM = /^-?\d+(?:\.\d+)?$/;
const MAX_LABEL = 24;
const MAX_PLAYER_LABEL = 3;
function pt(tok) {
  const m = tok ? PT.exec(tok) : null;
  if (!m) return null;
  const x = Number(m[1]);
  const y = Number(m[2]);
  return x < 0 || x > 100 || y < 0 || y > 100 ? null : { x, y };
}
function parseDiagram(lang, lines) {
  const issues = [];
  const field = isDiagramField(lang) ? lang : "football";
  if (!isDiagramField(lang)) {
    issues.push({ offset: -1, message: `Unknown diagram field "${lang}" (use ${DIAGRAM_FIELDS.join(", ")}), using football` });
  }
  const marks = [];
  lines.forEach((raw, offset) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return;
    const [cmd = "", ...rest] = line.split(/\s+/);
    const bad = (why) => {
      issues.push({ offset, message: `Diagram line "${line}": ${why}` });
    };
    const text = (from) => rest.slice(from).join(" ").slice(0, MAX_LABEL);
    switch (cmd.toLowerCase()) {
      case "att":
      case "def":
      case "gk": {
        const at = pt(rest[0]);
        if (!at) return bad("needs a position x,y between 0 and 100");
        marks.push({ kind: "dot", team: cmd.toLowerCase() === "att" ? "att" : "def", at, label: text(1) });
        return;
      }
      case "player": {
        const at = pt(rest[0]);
        if (!at) return bad("needs a position x,y between 0 and 100");
        const label = rest.slice(1).join(" ");
        if (!label || label.length > MAX_PLAYER_LABEL) return bad(`needs a label of 1–${MAX_PLAYER_LABEL} characters`);
        marks.push({ kind: "dot", team: "player", at, label });
        return;
      }
      case "ball": {
        const at = pt(rest[0]);
        if (!at) return bad("needs a position x,y between 0 and 100");
        marks.push({ kind: "ball", at });
        return;
      }
      case "line": {
        const y = rest[0] !== void 0 && NUM.test(rest[0]) ? Number(rest[0]) : NaN;
        if (!(y >= 0 && y <= 100)) return bad("needs a y between 0 and 100");
        marks.push({ kind: "line", y, label: text(1) });
        return;
      }
      case "pass":
      case "move":
      case "zone": {
        const from = pt(rest[0]);
        const to = pt(rest[1] === "->" ? rest[2] : rest[1]);
        if (!from || !to) return bad("needs two positions, e.g. 40,50 70,30");
        if (cmd.toLowerCase() === "zone") marks.push({ kind: "zone", from, to });
        else marks.push({ kind: "arrow", style: cmd.toLowerCase() === "pass" ? "pass" : "move", from, to });
        return;
      }
      case "label": {
        const at = pt(rest[0]);
        const t = text(1);
        if (!at || !t) return bad("needs a position and some text");
        marks.push({ kind: "label", at, text: t });
        return;
      }
      default:
        bad("unknown mark (use att, def, gk, player, ball, line, pass, move, zone, label)");
    }
  });
  return { diagram: { field, marks }, issues };
}
const HEADER_KEYS = ["handle", "template", "lang", "title", "caption", "counter"];
const HEADER_LINE = /^\s*([a-z]+)\s*:\s*(.*)$/;
const TAG_LINE = /^\[[^\]]*\]$/;
const FENCE = /^\s*```/;
const FENCE_CLOSE = /^\s*```\s*$/;
const KNOWN_ATTRS = ["photo", "icon", "surface", "cta", "number", "kicker", "verdict", "tone"];
const TONES = ["ok", "warn", "bad"];
const LONG_DECK = 10;
function splitLines(text) {
  return text.split(/\r?\n/);
}
function findHeaderEnd(lines) {
  const sep = lines.findIndex((l2) => l2.trim() === "---");
  if (sep < 0) return -1;
  let known = 0;
  for (let i2 = 0; i2 < sep; i2++) {
    const l2 = lines[i2];
    if (l2.trim() === "") continue;
    const m = HEADER_LINE.exec(l2);
    if (!m) return -1;
    if (HEADER_KEYS.includes(m[1])) known++;
  }
  return known > 0 ? sep : -1;
}
function tagHead(line) {
  const t = line.trim();
  return TAG_LINE.test(t) ? tokenizeTag(t.slice(1, -1))[0] ?? null : null;
}
function startsTaggedSlide(lines, sep) {
  let j = sep + 1;
  while (j < lines.length && lines[j].trim() === "") j++;
  const head = tagHead(lines[j] ?? "");
  return !!head && (SLIDE_TYPES.includes(head.key) || KNOWN_ATTRS.includes(head.key));
}
function fenceCloses(lines, open) {
  for (let j = open + 1; j < lines.length; j++) {
    if (FENCE_CLOSE.test(lines[j])) return true;
    if (lines[j].trim() === "---" && startsTaggedSlide(lines, j)) return false;
  }
  return false;
}
function splitBlocks(lines, from) {
  const blocks = [];
  let cur = [];
  let start = from;
  let seen = false;
  let code = false;
  let fence = "before";
  for (let i2 = from; i2 < lines.length; i2++) {
    const raw = lines[i2];
    if (!seen && raw.trim() !== "") {
      seen = true;
      const head = tagHead(raw);
      code = (head?.key === "code" || head?.key === "diagram") && head.value === true;
    }
    if (code && fence === "before" && FENCE.test(raw)) fence = fenceCloses(lines, i2) ? "open" : "after";
    else if (fence === "open" && FENCE_CLOSE.test(raw)) fence = "after";
    if (fence !== "open" && raw.trim() === "---") {
      blocks.push({ start, end: i2 - 1, lines: cur });
      cur = [];
      start = i2 + 1;
      seen = false;
      code = false;
      fence = "before";
      continue;
    }
    cur.push(raw);
  }
  blocks.push({ start, end: lines.length - 1, lines: cur });
  return blocks;
}
function tokenizeTag(inner) {
  const out = [];
  let i2 = 0;
  const n = inner.length;
  while (i2 < n) {
    while (i2 < n && /\s/.test(inner[i2])) i2++;
    if (i2 >= n) break;
    let key = "";
    while (i2 < n && !/[\s=]/.test(inner[i2])) key += inner[i2++];
    if (inner[i2] !== "=") {
      if (key) out.push({ key, value: true });
      continue;
    }
    i2++;
    let value = "";
    if (inner[i2] === '"') {
      i2++;
      while (i2 < n && inner[i2] !== '"') {
        if (inner[i2] === "\\" && inner[i2 + 1] === '"') {
          value += '"';
          i2 += 2;
        } else value += inner[i2++];
      }
      if (i2 >= n) {
        out.push({ key, value, unclosed: true });
        break;
      }
      i2++;
    } else {
      while (i2 < n && !/\s/.test(inner[i2])) value += inner[i2++];
    }
    out.push({ key, value });
  }
  return out;
}
function expandTabs(s2) {
  return s2.replace(/\t/g, "  ");
}
function parse(text, opts = {}) {
  try {
    return parseUnsafe(typeof text === "string" ? text : String(text ?? ""), opts);
  } catch {
    return {
      deck: emptyDeck(opts),
      warnings: [{ code: "internal-error", slideIndex: null, line: 0, message: "Parser error — please report" }]
    };
  }
}
function emptyDeck(opts) {
  const read = (f) => {
    try {
      return f();
    } catch {
      return void 0;
    }
  };
  return {
    header: {},
    hasHeader: false,
    template: read(() => opts.defaultTemplate) ?? DEFAULT_TEMPLATE,
    lang: "id",
    handle: read(() => opts.defaultHandle) ?? "",
    title: "",
    caption: "",
    slug: "carousel",
    slides: []
  };
}
function parseUnsafe(text, opts) {
  const warnings = [];
  const lines = splitLines(text);
  const headerEnd = findHeaderEnd(lines);
  const header = {};
  if (headerEnd >= 0) {
    for (let i2 = 0; i2 < headerEnd; i2++) {
      const m = HEADER_LINE.exec(lines[i2]);
      if (!m) continue;
      const key = m[1];
      const value = m[2].trim();
      if (!HEADER_KEYS.includes(key)) {
        warnings.push({ code: "unknown-header-key", slideIndex: null, line: i2, message: `Unknown header key "${key}"` });
        continue;
      }
      header[key] = value;
    }
  }
  const familyOf = opts.templateFamily ?? builtinFamilyOf;
  let template = opts.defaultTemplate ?? DEFAULT_TEMPLATE;
  if (header.template !== void 0) {
    if (familyOf(header.template)) template = header.template;
    else {
      const line = lines.findIndex((l2, i2) => i2 < headerEnd && /^\s*template\s*:/.test(l2));
      warnings.push({
        code: "unknown-template",
        slideIndex: null,
        line: Math.max(0, line),
        message: `Unknown template "${header.template}", using ${template}`
      });
    }
  }
  let lang = "id";
  if (header.lang !== void 0) {
    if (LANGS.includes(header.lang)) lang = header.lang;
    else {
      const line = lines.findIndex((l2, i2) => i2 < headerEnd && /^\s*lang\s*:/.test(l2));
      warnings.push({
        code: "unknown-lang",
        slideIndex: null,
        line: Math.max(0, line),
        message: `Unknown lang "${header.lang}" (use ${LANGS.join(" or ")}), using id`
      });
    }
  }
  let counter = true;
  if (header.counter !== void 0) {
    if (header.counter === "off") counter = false;
    else if (header.counter !== "on") {
      const line = lines.findIndex((l2, i2) => i2 < headerEnd && /^\s*counter\s*:/.test(l2));
      warnings.push({
        code: "unknown-counter",
        slideIndex: null,
        line: Math.max(0, line),
        message: `Unknown counter "${header.counter}" (use on or off), using on`
      });
    }
  }
  const slides = [];
  for (const block of splitBlocks(lines, headerEnd + 1)) {
    if (block.lines.every((l2) => l2.trim() === "")) continue;
    const slide = parseBlock(block, slides.length, warnings);
    slides.push(slide);
  }
  if (slides.length > LONG_DECK) {
    warnings.push({
      code: "long-deck",
      slideIndex: null,
      line: 0,
      message: `${slides.length} slides. Carousels over ${LONG_DECK} slides tend to lose viewers`
    });
  }
  numberSlides(slides, { autoBadge: familyOf(template) !== "serene" });
  if (opts.photoIds) warnings.push(...resolvePhotos(slides, opts.photoIds));
  const cover = slides.find((s2) => s2.type === "cover") ?? slides[0];
  const coverTitle = cover ? richToPlain(cover.headline).replace(/\n/g, " ") : "";
  const title = header.title || coverTitle;
  const deck = {
    header,
    hasHeader: headerEnd >= 0,
    template,
    lang,
    handle: header.handle ?? opts.defaultHandle ?? "",
    title,
    caption: header.caption ?? "",
    ...counter ? {} : { counter: false },
    slug: slugify(title) || "carousel",
    slides
  };
  return { deck, warnings };
}
function parseBlock(block, index, warnings) {
  const L = block.lines;
  let i2 = 0;
  while (i2 < L.length && L[i2].trim() === "") i2++;
  let type = null;
  const attrs = {};
  const tagLine = block.start + i2;
  const warn = (code, message, line = tagLine, hard = false) => {
    warnings.push({ code, slideIndex: index, line, message, ...hard ? { hard: true } : {} });
  };
  const first = L[i2]?.trim() ?? "";
  if (TAG_LINE.test(first)) {
    const tokens = tokenizeTag(first.slice(1, -1));
    tokens.forEach((tok, k) => {
      if (tok.unclosed) warn("unknown-attr", `The quote in ${tok.key}="… never closes; the rest of the tag became its value`);
      if (k === 0 && tok.value === true) {
        if (SLIDE_TYPES.includes(tok.key)) {
          type = tok.key;
          return;
        }
        if (tok.key !== "cta") {
          warn("unknown-slide-type", `Unknown slide type "${tok.key}", rendered as card`);
          type = "card";
          return;
        }
      }
      applyAttr(tok, attrs, warn);
    });
    i2++;
  }
  const finalType = type ?? (index === 0 ? "cover" : "card");
  const content = [];
  for (; i2 < L.length; i2++) content.push({ text: L[i2], line: block.start + i2 });
  while (content.length && content[0].text.trim() === "") content.shift();
  const slide = makeSlide(index, finalType, attrs, block);
  if (isArabicType(finalType)) {
    if (finalType === "ayah") fillAyah(slide, content, warn);
    else fillHadith(slide, content, warn);
    checkAttrScope(slide, warn);
    setPhotoRef(slide);
    return slide;
  }
  if (isLexType(finalType)) {
    if (finalType === "word") fillWord(slide, content, warn);
    else if (finalType === "compare") fillCompare(slide, content, warn);
    else {
      const head2 = content[0] && !content[0].text.trim().startsWith("|") ? content.shift() : void 0;
      if (head2) {
        slide.headlineSrc = head2.text.trim();
        slide.headline = [parseInline(slide.headlineSrc)];
      } else warn("missing-headline", "This slide has no headline");
      fillTable(slide, content, warn);
    }
    checkAttrScope(slide, warn);
    setPhotoRef(slide);
    return slide;
  }
  const head = content.shift();
  if (!head || (finalType === "code" || finalType === "diagram") && FENCE.test(head.text)) {
    warn("missing-headline", "This slide has no headline");
    if (head) content.unshift(head);
  } else {
    slide.headlineSrc = head.text.trim();
    slide.headline = [parseInline(slide.headlineSrc)];
  }
  if (finalType === "code") fillCode(slide, content, warn);
  else if (finalType === "diagram") fillDiagram(slide, content, warn);
  else if (finalType === "quote") fillQuote(slide, content);
  else slide.body = parseRich(content.map((c) => c.text));
  checkAttrScope(slide, warn);
  setPhotoRef(slide);
  return slide;
}
function makeSlide(index, type, attrs, block) {
  return {
    index,
    type,
    attrs,
    headlineSrc: "",
    headline: [],
    body: [],
    note: [],
    attribution: null,
    code: null,
    fields: {},
    table: null,
    diagram: null,
    photoId: null,
    lines: [block.start, Math.max(block.start, block.end)],
    badge: null,
    counter: { i: index + 1, total: 0 },
    swipe: null,
    showCta: false,
    contentIndex: -1
  };
}
function applyAttr(tok, attrs, warn) {
  const { key, value } = tok;
  if (!KNOWN_ATTRS.includes(key)) {
    warn("unknown-attr", value === true ? `Unknown flag "${key}"` : `Unknown attribute "${key}"`);
    return;
  }
  if (key === "cta") {
    attrs.cta = value === true || value === "" ? true : value;
    return;
  }
  if (value === true) {
    warn("unknown-attr", `"${key}" needs a value, e.g. ${key}=…`);
    return;
  }
  switch (key) {
    case "number":
      if (value === "off") attrs.number = "off";
      else if (/^\d+$/.test(value)) attrs.number = parseInt(value, 10);
      else warn("unknown-attr", `number must be "off" or an integer, got "${value}"`);
      break;
    case "icon":
      if (value === "auto" || value === "none" || canonicalIcon(value)) attrs.icon = value.toLowerCase();
      else warn("unknown-attr", `Unknown icon "${value}"`);
      break;
    case "photo":
      attrs.photo = value;
      break;
    case "surface":
      attrs.surface = value;
      break;
    case "kicker":
      attrs.kicker = value;
      break;
    case "verdict":
      if (value.trim()) attrs.verdict = value.trim();
      else warn("unknown-attr", 'verdict needs a label, e.g. verdict="SAH"');
      break;
    case "tone":
      if (TONES.includes(value)) attrs.tone = value;
      else warn("unknown-attr", `tone must be ok, warn or bad, got "${value}"`);
      break;
  }
}
function checkAttrScope(slide, warn) {
  const a2 = slide.attrs;
  const drop = (k) => {
    delete a2[k];
    warn("unknown-attr", `"${k}" doesn't apply to ${slide.type} slides`);
  };
  if (a2.icon !== void 0 && slide.type === "cover") drop("icon");
  if (isLexType(slide.type) || isArabicType(slide.type)) delete a2.icon;
  if (a2.cta !== void 0 && slide.type === "cover") drop("cta");
  if (a2.number !== void 0 && slide.type !== "card" && slide.type !== "code" && slide.type !== "diagram" && slide.type !== "table") drop("number");
  if (a2.kicker !== void 0 && slide.type !== "cover" && slide.type !== "card" && slide.type !== "quote") drop("kicker");
  if (a2.verdict !== void 0 && slide.type !== "card" && slide.type !== "diagram") drop("verdict");
  if (a2.tone !== void 0 && slide.type !== "card" && slide.type !== "diagram") drop("tone");
}
const TRAY_INDEX = /^\d+$/;
function setPhotoRef(slide) {
  const ref = slide.attrs.photo;
  slide.photoId = ref === void 0 || TRAY_INDEX.test(ref) ? null : ref;
}
function resolvePhotos(slides, trayIds) {
  const warnings = [];
  for (const slide of slides) {
    const ref = slide.attrs.photo;
    if (ref === void 0) continue;
    const id = TRAY_INDEX.test(ref) ? trayIds[parseInt(ref, 10) - 1] : trayIds.includes(ref) ? ref : void 0;
    slide.photoId = id ?? null;
    if (id) continue;
    const message = TRAY_INDEX.test(ref) ? `No photo ${ref} in the tray (it has ${trayIds.length})` : `No photo "${ref}" in the tray`;
    warnings.push({ code: "unknown-photo", slideIndex: slide.index, line: slide.lines[0], message });
  }
  return warnings;
}
function fillCode(slide, content, warn) {
  const fenceAt = content.findIndex((c) => FENCE.test(c.text));
  if (fenceAt < 0) {
    warn("code-missing-fence", "Code slide without a ``` fence, rendered as a card");
    slide.type = "card";
    slide.body = parseRich(content.map((c) => c.text));
    return;
  }
  slide.body = parseRich(content.slice(0, fenceAt).map((c) => c.text));
  const open = content[fenceAt];
  const lang = open.text.trim().slice(3).trim().toLowerCase();
  const rest = content.slice(fenceAt + 1);
  const closeAt = rest.findIndex((c) => FENCE_CLOSE.test(c.text));
  let codeLines;
  let after = [];
  if (closeAt < 0) {
    warn("unclosed-fence", "Code fence is never closed", open.line);
    codeLines = rest.map((c) => c.text);
  } else {
    codeLines = rest.slice(0, closeAt).map((c) => c.text);
    after = rest.slice(closeAt + 1).map((c) => c.text);
  }
  while (codeLines.length && codeLines[codeLines.length - 1].trim() === "") codeLines.pop();
  const code = { text: codeLines.map(expandTabs).join("\n"), lang };
  slide.code = code;
  slide.note = parseRich(after);
}
function fillDiagram(slide, content, warn) {
  const fenceAt = content.findIndex((c) => FENCE.test(c.text));
  if (fenceAt < 0) {
    warn("diagram-missing", "Diagram slide without a ``` fence, rendered as a card");
    slide.type = "card";
    slide.body = parseRich(content.map((c) => c.text));
    return;
  }
  slide.body = parseRich(content.slice(0, fenceAt).map((c) => c.text));
  const open = content[fenceAt];
  const lang = open.text.trim().slice(3).trim().toLowerCase();
  const rest = content.slice(fenceAt + 1);
  const closeAt = rest.findIndex((c) => FENCE_CLOSE.test(c.text));
  const inner = closeAt < 0 ? rest : rest.slice(0, closeAt);
  if (closeAt < 0) warn("unclosed-fence", "Diagram fence is never closed", open.line);
  const { diagram, issues } = parseDiagram(lang, inner.map((c) => c.text));
  for (const i2 of issues) warn("diagram-line", i2.message, i2.offset < 0 ? open.line : inner[i2.offset].line);
  slide.diagram = diagram;
  slide.note = parseRich(closeAt < 0 ? [] : rest.slice(closeAt + 1).map((c) => c.text));
}
const ATTRIBUTION = /^(—|--|-)\s+(.*)$/;
function fillQuote(slide, content) {
  const at = content.findIndex((c) => c.text.trim() !== "");
  const m = at >= 0 ? ATTRIBUTION.exec(content[at].text.trim()) : null;
  if (m) slide.attribution = m[2].trim();
  slide.body = parseRich(content.filter((_, k) => !m || k !== at).map((c) => c.text));
}
function parseDeck(text, opts = {}) {
  return parse(text, { ...opts, templateFamily });
}
function setHeaderKey(text, key, value) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = splitLines(text);
  const end = findHeaderEnd(lines);
  const entry = `${key}: ${value}`;
  if (end < 0) {
    const body = text.length ? text : "";
    return `${entry}${eol}---${eol}${body}`;
  }
  const re = new RegExp(`^(\\s*)${key}\\s*:`);
  for (let i2 = 0; i2 < end; i2++) {
    const m = re.exec(lines[i2]);
    if (m) {
      lines[i2] = `${m[1]}${entry}`;
      return lines.join(eol);
    }
  }
  let at = end;
  while (at > 0 && lines[at - 1].trim() === "") at--;
  lines.splice(at, 0, entry);
  return lines.join(eol);
}
function getHeaderKey(text, key) {
  const lines = splitLines(text);
  const end = findHeaderEnd(lines);
  const re = new RegExp(`^\\s*${key}\\s*:\\s*(.*)$`);
  for (let i2 = 0; i2 < end; i2++) {
    const m = re.exec(lines[i2]);
    if (m) return m[1].trim();
  }
  return void 0;
}
const DECK_LINK_MAX_BYTES = 100 * 1024;
const DECK_LINK_KEY = "deck";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const VALUE = new Map([...ALPHABET].map((ch, i2) => [ch, i2]));
function base64urlEncode(bytes) {
  let out = "";
  for (let i2 = 0; i2 < bytes.length; i2 += 3) {
    const n = bytes[i2] << 16 | (bytes[i2 + 1] ?? 0) << 8 | (bytes[i2 + 2] ?? 0);
    const chars = Math.min(4, Math.ceil((bytes.length - i2) * 8 / 6));
    for (let k = 0; k < chars; k++) out += ALPHABET[n >> 18 - 6 * k & 63];
  }
  return out;
}
function base64urlDecode(s2) {
  if (s2.length % 4 === 1) return null;
  const out = new Uint8Array(Math.floor(s2.length * 6 / 8));
  let acc = 0;
  let bits = 0;
  let o = 0;
  for (const ch of s2) {
    const v = VALUE.get(ch);
    if (v === void 0) return null;
    acc = (acc << 6 | v) & 16777215;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[o++] = acc >> bits & 255;
    }
  }
  return out;
}
function encodeDeckLink(text, base) {
  const data = base64urlEncode(new TextEncoder().encode(text));
  return `${base.replace(/#.*$/s, "")}#${DECK_LINK_KEY}=${data}`;
}
function deckLinkParam(hash) {
  const body = hash.startsWith("#") ? hash.slice(1) : hash;
  for (const part of body.split("&")) {
    if (part.startsWith(`${DECK_LINK_KEY}=`)) return part.slice(DECK_LINK_KEY.length + 1);
  }
  return null;
}
function decodeDeckLink(hash) {
  try {
    const data = deckLinkParam(String(hash));
    if (data === null) return { ok: false, reason: "missing" };
    if (Math.floor(data.length * 3 / 4) > DECK_LINK_MAX_BYTES) return { ok: false, reason: "too-large" };
    const bytes = base64urlDecode(data);
    if (!bytes) return { ok: false, reason: "base64" };
    if (bytes.length > DECK_LINK_MAX_BYTES) return { ok: false, reason: "too-large" };
    const text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
    return { ok: true, text };
  } catch {
    return { ok: false, reason: "utf8" };
  }
}
export {
  B as BLOCKING_CODES,
  a as BUILTIN_TEMPLATE_IDS,
  DEFAULT_TEMPLATE,
  V as VariantError,
  decodeDeckLink,
  encodeDeckLink,
  getHeaderKey,
  g as getVariant,
  h as hasVariant,
  i as isBlocking,
  l as listVariants,
  parseDeck,
  r as registerVariant,
  resolvePhotos,
  setHeaderKey,
  s as slideFileName,
  slugify,
  d as validateVariant
};
//# sourceMappingURL=parse.js.map
