const SLIDE_TYPES = ["cover", "card", "code", "quote", "end", "word", "table", "compare", "ayah", "hadith", "diagram"];
function isLexType(t2) {
  return t2 === "word" || t2 === "table" || t2 === "compare";
}
function isArabicType(t2) {
  return t2 === "ayah" || t2 === "hadith";
}
const LANGS = ["id", "en"];
const BUILTIN_TEMPLATE_IDS = [
  "editorial/rose-dusk",
  "editorial/sage",
  "editorial/midnight",
  "editorial/stone",
  "editorial/ruang-kunyit",
  "editorial/ruang-bata",
  "editorial/ruang-daun",
  "editorial/ruang-malam",
  "dev/github-dark",
  "dev/terminal",
  "dev/paper-light",
  "sport/papan",
  "sport/lapangan",
  "sport/kapur",
  "lexicon/kamus",
  "lexicon/notebook",
  "serene/fajr",
  "serene/isya"
];
const DEFAULT_TEMPLATE = "editorial/rose-dusk";
function isBuiltinTemplateId(v) {
  return BUILTIN_TEMPLATE_IDS.includes(v);
}
function builtinFamilyOf(id) {
  if (!isBuiltinTemplateId(id)) return void 0;
  if (id.startsWith("dev/")) return "dev";
  if (id.startsWith("sport/")) return "sport";
  if (id.startsWith("serene/")) return "serene";
  return id.startsWith("lexicon/") ? "lexicon" : "editorial";
}
const BLOCKING_CODES = [
  "overflow",
  "code-line-too-long",
  "table-too-many-rows",
  "table-too-wide",
  "ipa-glyph-missing",
  "internal-error",
  "arabic-too-long",
  "arabic-font-missing"
];
function isBlocking(w) {
  return !!w.hard || BLOCKING_CODES.includes(w.code);
}
function parseInline(src) {
  const lines = [];
  let line = [];
  let buf = "";
  const push = (text, style2) => {
    if (!text) return;
    const last = line[line.length - 1];
    if (last && last.style === style2) last.text += text;
    else line.push({ text, style: style2 });
  };
  const flush = () => {
    push(buf, "plain");
    buf = "";
  };
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\\" && src[i + 1] === "|") {
      buf += "|";
      i += 2;
      continue;
    }
    if (ch === "|") {
      flush();
      lines.push(trimLine(line));
      line = [];
      i++;
      continue;
    }
    if (ch === "`") {
      const end = src.indexOf("`", i + 1);
      if (end > i + 1) {
        flush();
        push(src.slice(i + 1, end), "code");
        i = end + 1;
        continue;
      }
    }
    if (ch === "*") {
      if (src[i + 1] === "*") {
        let j = i;
        while (src[j] === "*") j++;
        buf += src.slice(i, j);
        i = j;
        continue;
      }
      const end = findAccentEnd(src, i);
      if (end > 0) {
        flush();
        push(src.slice(i + 1, end).replace(/\\\|/g, "|"), "accent");
        i = end + 1;
        continue;
      }
    }
    buf += ch;
    i++;
  }
  flush();
  lines.push(trimLine(line));
  return lines;
}
function findAccentEnd(src, start) {
  const first = src[start + 1];
  if (first === void 0 || first === " " || first === "*") return -1;
  for (let j = start + 1; j < src.length; j++) {
    const c = src[j];
    if (c === "|" && src[j - 1] !== "\\") return -1;
    if (c === "`") return -1;
    if (c === "*") {
      if (j === start + 1 || src[j - 1] === " ") return -1;
      if (src[j + 1] === "*") return -1;
      return j;
    }
  }
  return -1;
}
function trimLine(line) {
  const out = line.map((r) => ({ ...r }));
  const first = out[0];
  if (first && first.style !== "code") first.text = first.text.replace(/^\s+/, "");
  const last = out[out.length - 1];
  if (last && last.style !== "code") last.text = last.text.replace(/\s+$/, "");
  return out.filter((r) => r.text.length > 0);
}
function parseRich(sourceLines) {
  const paras = [];
  let cur = [];
  for (const raw of sourceLines) {
    if (raw.trim() === "") {
      if (cur.length) paras.push(cur);
      cur = [];
      continue;
    }
    cur.push(...parseInline(raw.trim()));
  }
  if (cur.length) paras.push(cur);
  return paras;
}
function richToPlain(rich) {
  return rich.map((p) => p.map((l) => l.map((r) => r.text).join("")).join(" ")).join("\n");
}
function isEmptyRich(rich) {
  return rich.every((p) => p.every((l) => l.every((r) => r.text.trim() === "")));
}
function upperRich(rich) {
  return rich.map((p) => p.map((l) => l.map((r) => r.style === "code" ? r : { ...r, text: r.text.toUpperCase() })));
}
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = a + 1831565813 >>> 0;
    let t2 = a;
    t2 = Math.imul(t2 ^ t2 >>> 15, t2 | 1);
    t2 ^= t2 + Math.imul(t2 ^ t2 >>> 7, t2 | 61);
    return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296;
  };
}
function slideRng(slug, slideIndex) {
  return mulberry32(hash(slug) + slideIndex);
}
function between(rng, min, max) {
  return min + (max - min) * rng();
}
const EDITORIAL_ICONS = [
  "heart-spark",
  "mountain",
  "shield-heart",
  "smile",
  "leaf",
  "home",
  "chat",
  "coffee",
  "sun",
  "moon",
  "star",
  "book",
  "plane",
  "gift",
  "map-pin",
  "music",
  "flower",
  "umbrella",
  "key",
  "heart"
];
const DEV_ICONS = [
  "terminal",
  "code",
  "git-branch",
  "bug",
  "rocket",
  "check-circle",
  "alert",
  "folder",
  "database",
  "cpu",
  "lightbulb",
  "clock"
];
const ICON_ALIASES = {
  shield: "shield-heart",
  spark: "heart-spark",
  pin: "map-pin",
  branch: "git-branch",
  bulb: "lightbulb",
  check: "check-circle"
};
const POOL_SET = /* @__PURE__ */ new Set([...EDITORIAL_ICONS, ...DEV_ICONS]);
function canonicalIcon(name) {
  const n = name.toLowerCase();
  if (POOL_SET.has(n)) return n;
  return ICON_ALIASES[n] ?? null;
}
function resolveIcons(slides, slug, policy) {
  const { pool } = policy;
  const out = [];
  let prev = null;
  for (const s of slides) {
    let icon = null;
    if (s.type !== "cover") {
      const raw = s.attrs.icon ?? policy.fallback;
      if (raw === "auto") {
        if (s.type !== "end") {
          let idx = hash(`${slug}:${s.index}`) % pool.length;
          if (pool[idx] === prev) idx = (idx + 1) % pool.length;
          icon = pool[idx] ?? null;
        }
      } else if (raw !== "none") {
        icon = canonicalIcon(raw);
      }
    }
    out.push(icon);
    prev = icon;
  }
  return out;
}
const SLUG_MAX = 40;
function slugify(input, max = SLUG_MAX) {
  const base2 = input.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (base2.length <= max) return base2;
  return base2.slice(0, max).replace(/-+$/g, "");
}
function slideFileName(slug, index) {
  return `${slug || "carousel"}_${String(index + 1).padStart(2, "0")}.png`;
}
const WORD_FIELDS = ["word", "ipa", "say", "pos", "tag", "meaning", "example", "translation", "origin", "note"];
const COMPARE_FIELDS = ["wrong", "right", "why", "wrong-label", "right-label", "headline"];
const TABLE = { minCols: 2, maxCols: 4, maxRows: 8 };
const FIELD_LINE = /^\s*([a-z][a-z-]*)\s*:\s?(.*)$/;
function readFields(content, keys, warn) {
  const out = {};
  for (const c of content) {
    if (c.text.trim() === "") continue;
    const m = FIELD_LINE.exec(c.text);
    if (!m || !keys.includes(m[1])) {
      warn("unknown-field", m ? `Unknown field "${m[1]}"` : `Not a "key: value" line: ${c.text.trim().slice(0, 40)}`, c.line);
      continue;
    }
    out[m[1]] = m[2].trim();
  }
  return out;
}
function toCard(slide, values) {
  slide.type = "card";
  const [head, ...rest] = values.filter((v) => v.trim() !== "");
  slide.headlineSrc = head ?? "";
  slide.headline = head ? [parseInline(head)] : [];
  slide.body = parseRich(rest);
}
function fillWord(slide, content, warn) {
  const f = readFields(content, WORD_FIELDS, warn);
  if (!f.word) {
    warn("missing-word", 'Word slide without "word:", rendered as a card');
    toCard(slide, Object.values(f));
    return;
  }
  slide.fields = f;
  slide.headlineSrc = f.word;
  slide.headline = [parseInline(f.word)];
}
function fillCompare(slide, content, warn) {
  const f = readFields(content, COMPARE_FIELDS, warn);
  if (!f.wrong || !f.right) {
    warn("missing-field", `Compare slide needs both "wrong:" and "right:", rendered as a card`);
    toCard(slide, [f.headline ?? "", f.wrong ?? "", f.right ?? "", f.why ?? ""]);
    return;
  }
  slide.fields = f;
  slide.headlineSrc = f.headline ?? "";
  slide.headline = f.headline ? [parseInline(f.headline)] : [];
}
function splitRow(src) {
  let s = src.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|") && !s.endsWith("\\|")) s = s.slice(0, -1);
  const cells = [];
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "\\" && s[i + 1] === "|") {
      cur += "\\|";
      i++;
    } else if (s[i] === "|") {
      cells.push(cur.trim());
      cur = "";
    } else cur += s[i];
  }
  cells.push(cur.trim());
  return cells;
}
function fillTable(slide, content, warn) {
  const rows = [];
  const note = [];
  let rowLine = slide.lines[0];
  for (const c of content) {
    if (c.text.trim().startsWith("|")) {
      if (!rows.length) rowLine = c.line;
      rows.push(splitRow(c.text));
    } else note.push(c.text);
  }
  if (!rows.length) {
    warn("table-shape", 'Table slide without "| … |" rows, rendered as a card');
    slide.type = "card";
    slide.body = parseRich(note);
    return;
  }
  let header = rows[0];
  if (header.length < TABLE.minCols || header.length > TABLE.maxCols) {
    warn("table-shape", `Tables need ${TABLE.minCols}–${TABLE.maxCols} columns, this one has ${header.length}`, rowLine);
    header = header.slice(0, TABLE.maxCols);
    while (header.length < TABLE.minCols) header.push("");
  }
  const body = rows.slice(1).map((r, i) => {
    if (r.length > header.length) warn("table-shape", `Row ${i + 1} has more cells than the header`, rowLine + i + 1);
    const out = r.slice(0, header.length);
    while (out.length < header.length) out.push("");
    return out;
  });
  const table = { header, rows: body };
  slide.table = table;
  slide.note = parseRich(note);
  slide.fields = { note: note.map((l) => l.trim()).filter(Boolean).join(" | ") };
}
const IPA_RANGES = [
  [0, 255],
  [256, 698],
  [699, 700],
  [701, 709],
  [710, 710],
  [711, 716],
  [718, 727],
  [730, 730],
  [732, 732],
  [733, 767],
  [772, 772],
  [776, 776],
  [809, 809],
  [880, 887],
  [890, 895],
  [900, 906],
  [908, 908],
  [910, 929],
  [931, 1023],
  [7424, 7615],
  [7680, 7839],
  [8192, 8303]
];
function uncoveredIpa(text) {
  const missing = /* @__PURE__ */ new Set();
  for (const ch of Array.from(text)) {
    const cp = ch.codePointAt(0);
    if (!IPA_RANGES.some(([a, b]) => cp >= a && cp <= b)) missing.add(ch);
  }
  return [...missing];
}
const AYAH_FIELDS = ["arab", "terjemah", "ref", "source", "mark", "portion"];
const HADITH_FIELDS = ["arab", "text", "ref", "grade", "source"];
const AYAH_REQUIRED = ["arab", "terjemah", "ref"];
const HADITH_REQUIRED = ["text", "ref", "grade"];
function pipeLines(src) {
  const lines = [];
  let cur = "";
  for (let i = 0; i < src.length; i++) {
    if (src[i] === "\\" && src[i + 1] === "|") {
      cur += "|";
      i++;
    } else if (src[i] === "|") {
      lines.push(cur.trim());
      cur = "";
    } else cur += src[i];
  }
  lines.push(cur.trim());
  const kept = lines.filter((l) => l !== "");
  return kept.length ? [kept.map((text) => [{ text, style: "plain" }])] : [];
}
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
function toArabicDigits(n) {
  return n.replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}
function ayahMark(f) {
  const mark = f.mark?.trim();
  if (mark === "off") return null;
  const n = mark && /^\d+$/.test(mark) ? mark : /(\d+)\D*$/.exec(f.ref ?? "")?.[1];
  return n ? `﴿${toArabicDigits(n)}﴾` : null;
}
function requireFields(f, keys, type, warn) {
  const missing = keys.filter((k) => !f[k]);
  if (missing.length) {
    warn("missing-field", `${type} slide needs ${missing.map((k) => `"${k}:"`).join(", ")} (export is blocked)`, void 0, true);
  }
}
function fillAyah(slide, content, warn) {
  const f = readFields(content, AYAH_FIELDS, warn);
  requireFields(f, AYAH_REQUIRED, "Ayah", warn);
  if (f.portion !== void 0 && f.portion !== "true" && f.portion !== "false") {
    warn("unknown-field", `portion must be "true" or "false", got "${f.portion}"`);
  }
  slide.fields = f;
  slide.headlineSrc = f.ref ?? "";
  slide.body = pipeLines(f.terjemah ?? "");
}
function fillHadith(slide, content, warn) {
  const f = readFields(content, HADITH_FIELDS, warn);
  requireFields(f, HADITH_REQUIRED, "Hadith", warn);
  slide.fields = f;
  slide.headlineSrc = f.ref ?? "";
  slide.body = pipeLines(f.text ?? "");
}
function parseColor(c) {
  const s = c.trim();
  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    const n = parseInt(h.slice(0, 6), 16);
    return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255, a: 1 };
  }
  const m = /rgba?\(([^)]+)\)/.exec(s);
  if (m) {
    const [r = 0, g = 0, b = 0, a = 1] = m[1].split(",").map((x) => parseFloat(x));
    return { r, g, b, a };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}
function withAlpha(c, alpha) {
  const { r, g, b, a } = parseColor(c);
  return `rgba(${r},${g},${b},${+(a * alpha).toFixed(4)})`;
}
function over(fg, bg) {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1
  };
}
function channel(v) {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
function luminance(c) {
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
}
function contrast(fg, bg) {
  const b = parseColor(bg);
  const f = over(parseColor(fg), b);
  const l1 = luminance(f);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
const CODE_TOKENS = ["text", "prompt", "command", "subcommand", "flag", "string", "number", "keyword", "fn", "punct"];
const COLOUR = /^(#[0-9a-f]{3}|#[0-9a-f]{6}|#[0-9a-f]{8}|rgba?\([^)]*\))$/i;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
function surfaceIssues(s, semantic) {
  const out = [];
  const need = (label2, ratio, min) => {
    if (!(ratio >= min)) out.push(`${label2} ${ratio.toFixed(2)} < ${min}`);
  };
  need("ink/bg", contrast(s.ink, s.bg), 4.5);
  need("ink/blob", contrast(s.ink, s.blob), 4.5);
  need("body/bg", contrast(s.body, s.bg), 4.5);
  need("body/blob", contrast(s.body, s.blob), 4.5);
  need("badgeInk/badgeBg", contrast(s.badgeInk, s.badgeBg), 3);
  need("muted/bg", contrast(s.muted, s.bg), 3);
  if (semantic) for (const [k, c] of Object.entries(semantic)) need(`semantic.${k}/bg`, contrast(c, s.bg), 3);
  return out;
}
function codeIssues(code) {
  const out = [];
  for (const k of CODE_TOKENS) {
    const r = contrast(code[k], code.panel);
    if (!(r >= 4.5)) out.push(`code.${k} ${r.toFixed(2)} < 4.5`);
  }
  const rc = contrast(code.comment, code.panel);
  if (!(rc >= 3)) out.push(`code.comment ${rc.toFixed(2)} < 3`);
  return out;
}
function validateVariant(v, families) {
  const issues = [];
  if (typeof v?.id !== "string" || !ID.test(v.id)) issues.push(`id "${String(v?.id)}" must look like "family-or-host/name" (lowercase, digits, -)`);
  if (!families.includes(v?.family)) issues.push(`family "${String(v?.family)}" is not one of ${families.join(", ")}`);
  if (!v?.fonts?.sans || !v.fonts.mono) issues.push("fonts.sans and fonts.mono are required");
  if (!v?.surfaces?.deep) issues.push("surfaces.deep is required");
  if (!v?.onPhoto) issues.push("onPhoto is required");
  if (!v?.code) issues.push("code is required");
  if (!Array.isArray(v?.rotation) || !v.rotation.length) issues.push("rotation needs at least one surface name");
  else for (const r of v.rotation) if (!v.surfaces?.[r]) issues.push(`rotation names unknown surface "${r}"`);
  if (issues.length) return issues;
  const colours = [
    ...Object.entries(v.surfaces).flatMap(([n, s]) => Object.entries(s).map(([k, c]) => [`surfaces.${n}.${k}`, c])),
    ...Object.entries(v.onPhoto).map(([k, c]) => [`onPhoto.${k}`, c]),
    ...Object.entries(v.code).filter(([k]) => k !== "dots").map(([k, c]) => [`code.${k}`, c])
  ];
  for (const [label2, c] of colours) if (typeof c !== "string" || !COLOUR.test(c.trim())) issues.push(`${label2} "${String(c)}" is not #RGB, #RRGGBB or rgb(a)()`);
  if (issues.length) return issues;
  for (const [name, s] of Object.entries(v.surfaces)) {
    try {
      issues.push(...surfaceIssues(s, v.semantic).map((x) => `surfaces.${name}: ${x}`));
    } catch (err) {
      issues.push(`surfaces.${name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  try {
    issues.push(...codeIssues(v.code));
  } catch (err) {
    issues.push(`code: ${err instanceof Error ? err.message : String(err)}`);
  }
  return issues;
}
const S$4 = (bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg) => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });
const roseCode = {
  panel: "#1F2A2E",
  border: "#1F2A2E",
  text: "#F4ECE1",
  prompt: "#E9A497",
  command: "#FFFFFF",
  subcommand: "#F0C2B5",
  flag: "#E9C98F",
  string: "#C9E2BE",
  comment: "#9AA3A0",
  number: "#E9C98F",
  keyword: "#F0A595",
  fn: "#D9C3F0",
  punct: "#D5CEC4",
  dots: null
};
const onPhotoBase$2 = {
  bg: "#000000",
  ink: "#FFFFFF",
  body: "rgba(255,255,255,0.90)",
  muted: "rgba(255,255,255,0.75)",
  icon: "#FFFFFF",
  blob: "rgba(0,0,0,0)",
  inlineCodeBg: "rgba(255,255,255,0.18)"
};
const roseDusk = {
  id: "editorial/rose-dusk",
  name: "Rose Dusk",
  family: "editorial",
  fonts: { serif: "Playfair Display", sans: "Poppins", mono: "JetBrains Mono" },
  surfaces: {
    cream: S$4("#F4ECE1", "#1F2A2E", "#3B4246", "#6B6F70", "#A8564C", "#C9786B", "#FFFFFF", "#EBCFC4", "#C0695C", "#E9DFD1"),
    blush: S$4("#E9C4BA", "#1F2A2E", "#33393C", "#5E5555", "#7E3E35", "#2F4036", "#F4ECE1", "#E0B3A6", "#2F4036", "#DDB3A8"),
    forest: S$4("#2F4036", "#F4ECE1", "#DCD5CA", "#AEB3A9", "#F0C2B5", "#E9C4BA", "#1F2A2E", "#3A4E42", "#E9C4BA", "#3D5145"),
    deep: S$4("#262C3D", "#F7EFE6", "#D9D2CB", "#A9A6AE", "#F0CFC4", "#F0CFC4", "#1F2A2E", "#323A50", "#F0CFC4", "#343B50")
  },
  rotation: ["cream", "blush", "forest"],
  onPhoto: { ...onPhotoBase$2, accent: "#F6D3C8", badgeBg: "#F0CFC4", badgeInk: "#1F2A2E", tint: "#140E16" },
  code: roseCode,
  deco: { blobs: true, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  swatches: ["#C9786B", "#F4ECE1", "#2F4036", "#262C3D"]
};
const sage = {
  id: "editorial/sage",
  name: "Sage",
  family: "editorial",
  fonts: { serif: "Lora", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    linen: S$4("#F1EEE4", "#22291F", "#3E463A", "#6A7064", "#4F6447", "#5F7457", "#FFFFFF", "#E1E5D5", "#5F7457", "#E4E1D4"),
    moss: S$4("#CFD8C3", "#1E241B", "#32392E", "#545C4E", "#3B4C34", "#3E4A3A", "#F1EEE4", "#C0CCB2", "#3E4A3A", "#C0CAB3"),
    olive: S$4("#3E4A3A", "#F1EEE4", "#DADCCF", "#AEB2A3", "#E6C59F", "#D9B48F", "#22291F", "#4A5845", "#D9B48F", "#4C5947"),
    deep: S$4("#2A3127", "#F1EEE4", "#D3D6C8", "#A3A897", "#D9B48F", "#D9B48F", "#22291F", "#353E31", "#D9B48F", "#384134")
  },
  rotation: ["linen", "moss", "olive"],
  onPhoto: { ...onPhotoBase$2, accent: "#E8D2B0", badgeBg: "#D9B48F", badgeInk: "#1F2A2E", tint: "#12160F" },
  code: {
    ...roseCode,
    panel: "#2A3127",
    border: "#2A3127",
    text: "#F1EEE4",
    prompt: "#D9B48F",
    subcommand: "#C7D6B5",
    flag: "#E6C59F",
    string: "#BFD9AE"
  },
  deco: { blobs: true, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  swatches: ["#6F8466", "#F1EEE4", "#3E4A3A", "#D9B48F"]
};
const midnight = {
  id: "editorial/midnight",
  name: "Midnight",
  family: "editorial",
  fonts: { serif: "Playfair Display", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    navy: S$4("#1B2333", "#F3E9D7", "#D2C9B8", "#9C9787", "#E8B378", "#E0A060", "#1B2333", "#232D42", "#E0A060", "#283248"),
    plum: S$4("#2B2236", "#F3E9D7", "#D6CACB", "#A2969E", "#EBB884", "#E0A060", "#1B2333", "#352A43", "#E0A060", "#3A2F48"),
    slate: S$4("#22303A", "#F3E9D7", "#CBD1D0", "#96A0A2", "#E8B378", "#F3E9D7", "#1B2333", "#2B3C48", "#F3E9D7", "#2F404C"),
    deep: S$4("#141A26", "#F3E9D7", "#CFC6B5", "#948F80", "#E8B378", "#E0A060", "#141A26", "#1E2636", "#E0A060", "#222B3C")
  },
  rotation: ["navy", "plum", "slate"],
  onPhoto: { ...onPhotoBase$2, accent: "#F2C58F", badgeBg: "#E0A060", badgeInk: "#141A26", tint: "#0B0F18" },
  code: {
    ...roseCode,
    panel: "#0F1520",
    border: "#2A3448",
    text: "#F3E9D7",
    prompt: "#E0A060",
    subcommand: "#9CC3E6",
    flag: "#E8B378",
    string: "#B8D8A8",
    comment: "#7F8A99",
    dots: null
  },
  deco: { blobs: true, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  swatches: ["#E0A060", "#1B2333", "#2B2236", "#F3E9D7"]
};
const stone = {
  id: "editorial/stone",
  name: "Stone",
  family: "editorial",
  fonts: { serif: "Playfair Display", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    stone: S$4("#EDEAE4", "#1E1E1C", "#3C3B37", "#6C6A64", "#9A4B2F", "#2B2A27", "#EDEAE4", "#E2DED6", "#9A4B2F", "#E2DED6"),
    slate: S$4("#2B2A27", "#EDEAE4", "#D2CEC6", "#A19D94", "#E39A7A", "#E39A7A", "#2B2A27", "#35332F", "#E39A7A", "#3A3834"),
    deep: S$4("#1B1A18", "#EDEAE4", "#CFCBC3", "#9C988F", "#E39A7A", "#E39A7A", "#1B1A18", "#262522", "#E39A7A", "#2A2926")
  },
  rotation: ["stone", "stone", "slate"],
  // Not in the brief: photo and code tokens follow midnight/sage, in the stone palette.
  onPhoto: { ...onPhotoBase$2, accent: "#F0B597", badgeBg: "#E39A7A", badgeInk: "#1B1A18", tint: "#100F0E" },
  code: {
    ...roseCode,
    panel: "#2B2A27",
    border: "#2B2A27",
    text: "#EDEAE4",
    prompt: "#E39A7A",
    subcommand: "#D9C7B0",
    flag: "#F0B597",
    string: "#C9D3B0",
    comment: "#A19D94",
    dots: null
  },
  deco: { blobs: true, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  swatches: ["#EDEAE4", "#9A4B2F", "#2B2A27", "#E39A7A"]
};
const ruang = (key, name, s, photoAccent, tint, panel, swatches) => ({
  id: `editorial/ruang-${key}`,
  name: `Ruang ${name}`,
  family: "editorial",
  fonts: { serif: "Fraunces", sans: "Instrument Sans", mono: "JetBrains Mono" },
  surfaces: { [key]: s, deep: s },
  rotation: [key],
  onPhoto: { ...onPhotoBase$2, accent: photoAccent, badgeBg: photoAccent, badgeInk: "#1B1A19", tint },
  code: { ...roseCode, panel, border: panel },
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  swatches,
  headlineWeight: 500
});
const ruangKunyit = ruang(
  "kunyit",
  "Kunyit",
  S$4("#F2C14E", "#241A0C", "#3B2C14", "#6E5524", "#8A2F14", "#241A0C", "#F2C14E", "#F2C14E", "#8A2F14", "#E5B23F"),
  "#FFD877",
  "#1A1206",
  "#241A0C",
  ["#F2C14E", "#241A0C", "#8A2F14", "#FFF1C9"]
);
const ruangBata = ruang(
  "bata",
  "Bata",
  S$4("#5E1F1C", "#FBE9DF", "#F0D4C8", "#D4A597", "#FFB08F", "#FFB08F", "#3A1210", "#5E1F1C", "#FFB08F", "#73302C"),
  "#FFB08F",
  "#1A0807",
  "#3A1210",
  ["#5E1F1C", "#FBE9DF", "#FFB08F", "#3A1210"]
);
const ruangDaun = ruang(
  "daun",
  "Daun",
  S$4("#2D4632", "#F1EBDD", "#D9DECB", "#A9B79E", "#EBC872", "#EBC872", "#1E2B20", "#2D4632", "#EBC872", "#3A563F"),
  "#EBC872",
  "#0E160F",
  "#1E2B20",
  ["#2D4632", "#F1EBDD", "#EBC872", "#1E2B20"]
);
const ruangMalam = ruang(
  "malam",
  "Malam",
  S$4("#131621", "#EDE6DA", "#CFC8BC", "#8F8A84", "#F4B860", "#F4B860", "#131621", "#131621", "#F4B860", "#22263A"),
  "#F4B860",
  "#07080D",
  "#0B0D14",
  ["#131621", "#EDE6DA", "#F4B860", "#22263A"]
);
const EDITORIAL_VARIANTS = [roseDusk, sage, midnight, stone, ruangKunyit, ruangBata, ruangDaun, ruangMalam];
const S$3 = (bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg) => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });
const darkOnPhoto = {
  bg: "#000000",
  ink: "#FFFFFF",
  body: "rgba(255,255,255,0.88)",
  muted: "rgba(255,255,255,0.75)",
  accent: "#56D364",
  badgeBg: "#3FB950",
  badgeInk: "#0D1117",
  blob: "rgba(0,0,0,0)",
  icon: "#FFFFFF",
  inlineCodeBg: "rgba(255,255,255,0.18)",
  tint: "#05070A"
};
const githubDark = {
  id: "dev/github-dark",
  name: "GitHub Dark",
  family: "dev",
  fonts: { sans: "Inter", mono: "JetBrains Mono" },
  surfaces: {
    main: S$3("#0D1117", "#F0F6FC", "#C9D1D9", "#8B949E", "#3FB950", "#3FB950", "#0D1117", "#0D1117", "#3FB950", "#1F2630"),
    deep: S$3("#0A0D12", "#F0F6FC", "#C9D1D9", "#8B949E", "#3FB950", "#3FB950", "#0A0D12", "#0A0D12", "#3FB950", "#1F2630")
  },
  rotation: ["main"],
  onPhoto: darkOnPhoto,
  code: {
    panel: "#161B22",
    border: "#30363D",
    text: "#C9D1D9",
    prompt: "#3FB950",
    command: "#F0F6FC",
    subcommand: "#79C0FF",
    flag: "#FFA657",
    string: "#A5D6FF",
    comment: "#8B949E",
    number: "#79C0FF",
    keyword: "#FF7B72",
    fn: "#D2A8FF",
    punct: "#C9D1D9",
    dots: ["#FF7B72", "#E3B341", "#3FB950"]
  },
  deco: {
    blobs: false,
    dotGrid: true,
    scanlines: false,
    glow: true,
    bigGlyph: "$_",
    dotColor: "rgba(255,255,255,0.05)",
    glowAlpha: 0.08
  },
  swatches: ["#0D1117", "#161B22", "#3FB950", "#F0F6FC"]
};
const terminal = {
  id: "dev/terminal",
  name: "Terminal",
  family: "dev",
  fonts: { sans: "JetBrains Mono", mono: "JetBrains Mono" },
  surfaces: {
    main: S$3("#0B0F0C", "#D7FBD9", "#A9C9AB", "#6B8A6E", "#39D353", "#39D353", "#0B0F0C", "#0B0F0C", "#39D353", "#16201A"),
    deep: S$3("#070A08", "#D7FBD9", "#A9C9AB", "#6B8A6E", "#39D353", "#39D353", "#070A08", "#070A08", "#39D353", "#16201A")
  },
  rotation: ["main"],
  onPhoto: { ...darkOnPhoto, accent: "#39D353", badgeBg: "#39D353", badgeInk: "#0B0F0C" },
  code: {
    panel: "#101712",
    border: "#1E2C21",
    text: "#B9E5BC",
    prompt: "#39D353",
    command: "#D7FBD9",
    subcommand: "#7EE787",
    flag: "#E3B341",
    string: "#9BE9A8",
    comment: "#6B8A6E",
    number: "#E3B341",
    keyword: "#39D353",
    fn: "#A5F3B0",
    punct: "#A9C9AB",
    dots: null
  },
  deco: { blobs: false, dotGrid: false, scanlines: true, glow: true, bigGlyph: ">_", glowAlpha: 0.06 },
  swatches: ["#0B0F0C", "#101712", "#39D353", "#D7FBD9"],
  headlineWeight: 700,
  headlinePrefix: "> "
};
const paperLight = {
  id: "dev/paper-light",
  name: "Paper Light",
  family: "dev",
  fonts: { sans: "Inter", mono: "JetBrains Mono" },
  surfaces: {
    main: S$3("#F7F5F0", "#16181D", "#3A3F47", "#6B7079", "#1D4ED8", "#2563EB", "#FFFFFF", "#F7F5F0", "#2563EB", "#ECE8DE"),
    deep: S$3("#EFECE4", "#16181D", "#3A3F47", "#6B7079", "#1D4ED8", "#2563EB", "#FFFFFF", "#EFECE4", "#2563EB", "#E4DFD3")
  },
  rotation: ["main"],
  onPhoto: darkOnPhoto,
  code: {
    panel: "#FFFFFF",
    border: "#E3DFD5",
    text: "#24292F",
    prompt: "#1D4ED8",
    command: "#16181D",
    subcommand: "#0550AE",
    flag: "#B35900",
    string: "#0A7A3D",
    comment: "#6E7781",
    number: "#0550AE",
    keyword: "#C0283B",
    fn: "#6F42C1",
    punct: "#3A3F47",
    dots: ["#E5E1D8", "#E5E1D8", "#E5E1D8"]
  },
  deco: { blobs: false, dotGrid: true, scanlines: false, glow: false, bigGlyph: "{ }", dotColor: "rgba(0,0,0,0.06)" },
  swatches: ["#F7F5F0", "#FFFFFF", "#2563EB", "#16181D"]
};
const DEV_VARIANTS = [githubDark, terminal, paperLight];
const editorialWeights = () => ({ serif: [500, 600, 700], sans: [400, 500, 600], mono: [400, 500, 600] });
const EDITORIAL_LIKE = {
  headerRight: "rule",
  coverSwipeIcon: true,
  displayFace: "serif",
  weights: editorialWeights
};
const FAMILY_TRAITS = {
  editorial: { ...EDITORIAL_LIKE, icons: { pool: EDITORIAL_ICONS, fallback: "auto" } },
  // Lexicon and serene decks are icon-free unless a slide asks for one.
  lexicon: { ...EDITORIAL_LIKE, icons: { pool: EDITORIAL_ICONS, fallback: "none" } },
  serene: { ...EDITORIAL_LIKE, icons: { pool: EDITORIAL_ICONS, fallback: "none" } },
  dev: {
    headerRight: "path",
    coverSwipeIcon: false,
    displayFace: "sans",
    icons: { pool: DEV_ICONS, fallback: "none" },
    weights: (v) => ({ sans: [400, 500, 600, 700, v.headlineWeight ?? 800], mono: [400, 500, 600, 700] })
  },
  sport: {
    headerRight: "rule",
    coverSwipeIcon: false,
    displayFace: "serif",
    icons: { pool: DEV_ICONS, fallback: "none" },
    weights: (v) => ({ serif: [700, v.headlineWeight ?? 800], sans: [400, 500, 600, 700], mono: [400, 500, 600, 700] })
  }
};
function traitsOf(v) {
  return FAMILY_TRAITS[v.family];
}
function displayFamily(v) {
  return traitsOf(v).displayFace === "sans" ? v.fonts.sans : v.fonts.serif ?? v.fonts.sans;
}
const CANVAS = { w: 1080, h: 1920 };
const SAFE = { left: 96, right: 912, top: 196, bottom: 1500 };
const CONTENT_W = SAFE.right - SAFE.left;
const ROWS = {
  headerBaseline: 236,
  stackTopCard: 344,
  // Footer and stack limit moved up 32 px from DESIGN §2 (1472/1400) for more room above TikTok's caption (owner, Oct 2026).
  stackLimit: 1376,
  footerBaseline: 1440
};
const VERDICT = { size: 88, border: 8, padX: 28, padY: 14, radius: 14, capHeight: 0.7 };
const DIAGRAM = {
  h: 520,
  radius: 24,
  pad: 24,
  line: { width: 3, alpha: 0.55, goal: 8 },
  dot: { r: 26, label: 30, stroke: 4 },
  ball: { r: 12, ring: 4 },
  offside: { width: 4, dash: [14, 10] },
  arrow: { width: 4, dash: [12, 10], head: 18 },
  zoneAlpha: 0.22,
  label: { size: 28, weight: 600, gap: 10 }
};
function verdictFont(v) {
  return { family: displayFamily(v), weight: v.headlineWeight ?? 700, size: VERDICT.size };
}
function verdictItem(slide, v, m, gap) {
  const raw = slide.attrs.verdict;
  if (!raw) return null;
  const label2 = raw.toUpperCase();
  const w = Math.min(CONTENT_W, m.width(label2, verdictFont(v)) + VERDICT.padX * 2 + VERDICT.border * 2);
  const h = Math.round(VERDICT.size * VERDICT.capHeight + VERDICT.padY * 2 + VERDICT.border * 2);
  return { kind: "verdict", h, w, gap, label: label2 };
}
function diagramItem(slide, gap) {
  return slide.diagram ? { kind: "diagram", h: DIAGRAM.h, w: CONTENT_W, gap } : null;
}
function toneColor(v, s, tone) {
  const t2 = tone ?? "ok";
  if (v.semantic) return v.semantic[t2];
  return t2 === "bad" ? s.ink : s.accent;
}
const PROMPT = "$ ";
function isShell(lang) {
  return lang === "bash" || lang === "sh" || lang === "shell" || lang === "zsh";
}
function prepareCode(text, lang) {
  const raw = text.split("\n");
  const shell = isShell(lang);
  let prevContinues = false;
  return raw.map((line) => {
    const continuation = shell && prevContinues;
    prevContinues = /\\\s*$/.test(line);
    if (!shell) return { prompt: false, text: line, continuation: false };
    if (line.startsWith(PROMPT)) return { prompt: true, text: line.slice(PROMPT.length), continuation };
    const t2 = line.trimStart();
    const prompt = t2 !== "" && !t2.startsWith("#") && !continuation;
    return { prompt, text: line, continuation };
  });
}
function lineText(l) {
  return (l.prompt ? PROMPT : "") + l.text;
}
function fitCodeWidth(lines, innerWidth, family, weight, sizes, m) {
  const widest = (size) => lines.reduce((w, l) => Math.max(w, m.width(lineText(l), { family, weight, size })), 0);
  for (let s = sizes.max; s >= sizes.min; s -= sizes.step) {
    const w = widest(s);
    if (w <= innerWidth) return { size: s, fits: true, widest: w };
  }
  return { size: sizes.min, fits: false, widest: widest(sizes.min) };
}
const PILL = { scale: 0.9, padX: 10, padY: 6, radius: 8 };
const PARA_GAP = 0.6;
function monoFont(style2) {
  return { family: style2.mono.family, weight: style2.mono.weight, size: Math.round(style2.font.size * PILL.scale) };
}
function pieceWidth(p, style2, m) {
  if (p.style === "code") return m.width(p.text, monoFont(style2)) + PILL.padX * 2;
  return m.width(p.text, style2.font);
}
function wordWidth(w, style2, m) {
  let sum = 0;
  for (const p of w) sum += pieceWidth(p, style2, m);
  return sum;
}
function toWords(line) {
  const words = [];
  let cur = [];
  const add = (text, style2) => {
    if (!text) return;
    const last = cur[cur.length - 1];
    if (last && last.style === style2) last.text += text;
    else cur.push({ text, style: style2 });
  };
  for (const run of line) {
    if (run.style === "code") {
      add(run.text, "code");
      continue;
    }
    const parts = run.text.split(/( +)/);
    for (const part of parts) {
      if (/^ +$/.test(part)) {
        if (cur.length) words.push(cur);
        cur = [];
      } else add(part, run.style);
    }
  }
  if (cur.length) words.push(cur);
  return words;
}
function charBreak(word, maxWidth, style2, m) {
  const chunks = [];
  let chunk = [];
  for (const piece of word) {
    for (const ch of Array.from(piece.text)) {
      const last = chunk[chunk.length - 1];
      const trial = last && last.style === piece.style ? [...chunk.slice(0, -1), { text: last.text + ch, style: piece.style }] : [...chunk, { text: ch, style: piece.style }];
      if (chunk.length && wordWidth(trial, style2, m) > maxWidth) {
        chunks.push(chunk);
        chunk = [{ text: ch, style: piece.style }];
      } else chunk = trial;
    }
  }
  if (chunk.length || !chunks.length) chunks.push(chunk);
  return chunks;
}
function wrapRich(rich, maxWidth, style2, m, opts = {}) {
  const space = m.width(" ", style2.font);
  const lineW = (ws) => ws.reduce((s, w, i) => s + wordWidth(w, style2, m) + (i ? space : 0), 0);
  let charBroken = false;
  const out = [];
  rich.forEach((para, pi) => {
    para.forEach((hard, hi) => {
      const group = [];
      let cur = [];
      for (const word of toWords(hard)) {
        const ww = wordWidth(word, style2, m);
        if (ww > maxWidth) {
          charBroken = true;
          if (cur.length) group.push({ words: cur, paraStart: false });
          const chunks = charBreak(word, maxWidth, style2, m);
          chunks.slice(0, -1).forEach((c) => group.push({ words: [c], paraStart: false }));
          cur = [chunks[chunks.length - 1]];
          continue;
        }
        if (cur.length && lineW([...cur, word]) > maxWidth) {
          group.push({ words: cur, paraStart: false });
          cur = [word];
        } else cur.push(word);
      }
      group.push({ words: cur, paraStart: false });
      if (opts.widowFix && group.length >= 2) {
        const last = group[group.length - 1];
        const prev = group[group.length - 2];
        if (last.words.length === 1 && prev.words.length >= 3) {
          const moved = [prev.words[prev.words.length - 1], ...last.words];
          if (lineW(moved) <= maxWidth) {
            prev.words = prev.words.slice(0, -1);
            last.words = moved;
          }
        }
      }
      if (pi > 0 && hi === 0 && group[0]) group[0].paraStart = true;
      out.push(...group);
    });
  });
  const lines = out.map((lw) => {
    const runs = [];
    let x = 0;
    lw.words.forEach((word, wi) => {
      if (wi) x += space;
      for (const p of word) {
        const w = pieceWidth(p, style2, m);
        runs.push({ text: p.text, style: p.style, x, w });
        x += w;
      }
    });
    return { runs, width: x, paraStart: lw.paraStart };
  });
  return { lines, charBroken };
}
function textHeight(lines, size, lh) {
  if (!lines.length) return 0;
  const paras = lines.filter((l) => l.paraStart).length;
  return lines.length * size * lh + paras * PARA_GAP * size;
}
function baselines(lines, top, size, lh) {
  const ys = [];
  let y = top + size * 0.92;
  lines.forEach((l, i) => {
    if (i > 0) y += size * lh;
    if (l.paraStart) y += PARA_GAP * size;
    ys.push(y);
  });
  return ys;
}
const PRIORITY = ["body", "note", "code", "subtitle", "headline"];
function priorityKey(item) {
  if (item.kind === "code") return "code";
  if (item.kind === "text") return item.role === "quote" ? "headline" : item.role;
  return null;
}
function fitStack(items, frame, m) {
  let list = items.slice();
  const codeCap = /* @__PURE__ */ new Map();
  for (const it of list) {
    if (it.kind !== "code") continue;
    const inner = frame.width - it.spec.padX * 2;
    const fit2 = fitCodeWidth(it.lines, inner, it.spec.family, it.spec.weight, it.spec, m);
    codeCap.set(it, fit2);
  }
  const sizes = /* @__PURE__ */ new Map();
  for (const it of list) {
    if (it.kind === "text") sizes.set(it, it.spec.max);
    else if (it.kind === "code") sizes.set(it, codeCap.get(it).size);
  }
  const measure = (it) => {
    if (it.kind === "text") {
      const size = sizes.get(it);
      const wrap = wrapRich(it.rich, frame.width, {
        font: { family: it.spec.family, weight: it.spec.weight, size },
        mono: it.spec.mono
      }, m, { widowFix: it.spec.widowFix });
      const w = wrap.lines.reduce((a, l) => Math.max(a, l.width), 0);
      return { h: textHeight(wrap.lines, size, it.spec.lh), w, wrap, tooManyLines: wrap.lines.length > it.spec.maxLines };
    }
    if (it.kind === "code") {
      const size = sizes.get(it);
      const h = it.spec.titleBar + it.spec.padTop + it.spec.padBottom + it.lines.length * size * it.spec.lh;
      const fits = codeCap.get(it).fits && size <= codeCap.get(it).size;
      return { h, w: frame.width, tooManyLines: it.lines.length > it.spec.maxLines, codeFits: fits };
    }
    return { h: it.h, w: it.w, tooManyLines: false };
  };
  const layoutAll = () => {
    const ms = list.map(measure);
    let y2 = frame.top;
    ms.forEach((mm, i) => {
      if (i > 0) y2 += list[i].gap;
      y2 += mm.h;
    });
    return { ms, bottom: y2 };
  };
  const canStep = (it) => (it.kind === "text" || it.kind === "code") && sizes.get(it) > it.spec.min;
  const step = (it) => {
    if (it.kind !== "text" && it.kind !== "code") return;
    sizes.set(it, Math.max(it.spec.min, sizes.get(it) - it.spec.step));
  };
  let droppedIcon = false;
  let cursor = 0;
  let res = layoutAll();
  for (let guard = 0; guard < 500; guard++) {
    const tooMany2 = res.ms.some((mm) => mm.tooManyLines);
    if (res.bottom <= frame.limit && !tooMany2) break;
    if (!droppedIcon && list.some((it) => it.kind === "icon")) {
      list = list.filter((it) => it.kind !== "icon");
      droppedIcon = true;
      res = layoutAll();
      continue;
    }
    const capped = list.find((it, i) => res.ms[i].tooManyLines && canStep(it) && it.kind === "text");
    if (capped) {
      step(capped);
      res = layoutAll();
      continue;
    }
    let stepped = false;
    for (let k = 0; k < PRIORITY.length && !stepped; k++) {
      const key = PRIORITY[(cursor + k) % PRIORITY.length];
      const group = list.filter((it) => priorityKey(it) === key && canStep(it));
      if (group.length) {
        group.forEach(step);
        cursor = (cursor + k + 1) % PRIORITY.length;
        stepped = true;
      }
    }
    if (!stepped) break;
    res = layoutAll();
  }
  const placed = [];
  let y = frame.top;
  res.ms.forEach((mm, i) => {
    const it = list[i];
    if (i > 0) y += it.gap;
    placed.push({
      item: it,
      x: frame.x,
      y,
      w: mm.w,
      h: mm.h,
      size: it.kind === "text" || it.kind === "code" ? sizes.get(it) : 0,
      wrap: mm.wrap,
      codeFits: mm.codeFits
    });
    y += mm.h;
  });
  const tooMany = res.ms.some((mm) => mm.tooManyLines);
  const codeTooLong = [...codeCap.values()].some((c) => !c.fits);
  return {
    placed,
    bottom: y,
    overflow: res.bottom > frame.limit || tooMany,
    codeTooLong,
    charBroken: res.ms.some((mm) => mm.wrap?.charBroken),
    droppedIcon
  };
}
const STRINGS = {
  swipe: { id: "Geser →", en: "Swipe →" },
  coverSwipe: { id: "Geser untuk lihat", en: "Swipe to see" },
  cta: { id: "Simpan • Bagikan", en: "Save • Share" },
  // Lexicon slides (SPEC-lexicon §2.4)
  compareWrong: { id: "Salah", en: "Wrong" },
  compareRight: { id: "Benar", en: "Right" },
  labelMeaning: { id: "Arti", en: "Meaning" },
  labelExample: { id: "Contoh", en: "Example" },
  labelOrigin: { id: "Asal kata", en: "Origin" },
  labelSay: { id: "Cara baca", en: "Say it" },
  // Ayah & hadith slides (SPEC-ayah §1.3)
  portion: { id: "(penggalan)", en: "(portion)" },
  gradeLabel: { id: "Derajat", en: "Grade" },
  hadithLabel: { id: "HADIS", en: "HADITH" }
};
function t(key, lang) {
  return STRINGS[key][lang];
}
function splitArrow(text) {
  const m = /\s*→\s*$/.exec(text);
  if (!m) return { text, arrow: false };
  return { text: text.slice(0, m.index), arrow: true };
}
const CHROME = {
  handleSize: 30,
  handleWeight: 500,
  handleMax: 480,
  pathSize: 26,
  pathMax: 300,
  pathTopicMax: 16,
  rule: { x1: 832, x2: 912, y: 226, h: 2 },
  footerSize: 30,
  counterSize: 28,
  arrowSize: 28,
  arrowGap: 12,
  circleArrowSize: 32,
  circleArrowGap: 14,
  cta: { h: 96, radius: 48, padX: 40, icon: 36, gap: 16, size: 34, weight: 600, gapBefore: 64 }
};
function resolveSurface(v, slide, hasPhoto, warnings) {
  if (hasPhoto) return { surface: v.onPhoto, name: "onPhoto", onPhoto: true };
  const isContent = slide.contentIndex >= 0;
  let name = isContent ? v.rotation[slide.contentIndex % v.rotation.length] : "deep";
  const req = slide.attrs.surface;
  if (req && req !== "auto") {
    if (v.surfaces[req]) name = req;
    else {
      warnings.push({
        code: "unknown-attr",
        slideIndex: slide.index,
        line: slide.lines[0],
        message: `Unknown surface "${req}" for ${v.id} (has: ${Object.keys(v.surfaces).join(", ")})`
      });
    }
  }
  return { surface: v.surfaces[name], name, onPhoto: false };
}
function truncate(text, maxWidth, font, m) {
  if (m.width(text, font) <= maxWidth) return text;
  const chars = Array.from(text);
  while (chars.length && m.width(chars.join("") + "…", font) > maxWidth) chars.pop();
  return chars.join("") + "…";
}
function headerTopic(deck) {
  const kicker = deck.slides.find((s) => s.type === "cover")?.attrs.kicker;
  const topic = kicker ? slugify(kicker.split(/[•·|]/)[0] ?? "", CHROME.pathTopicMax) : "";
  return topic || deck.slug;
}
function layoutHeader(input, sans, mono, boxes) {
  const m = input.measurer;
  const handleFont = { family: sans, weight: CHROME.handleWeight, size: CHROME.handleSize };
  const handle = truncate(input.deck.handle, CHROME.handleMax, handleFont, m);
  const top = ROWS.headerBaseline - CHROME.handleSize;
  if (handle) boxes.push({ x: SAFE.left, y: top, w: m.width(handle, handleFont), h: CHROME.handleSize * 1.25, kind: "handle" });
  if (traitsOf(input.variant).headerRight === "path") {
    const font = { family: mono, weight: 500, size: CHROME.pathSize };
    const text = truncate(`~/${headerTopic(input.deck)}`, CHROME.pathMax, font, m);
    const w = m.width(text, font);
    boxes.push({ x: SAFE.right - w, y: ROWS.headerBaseline - CHROME.pathSize, w, h: CHROME.pathSize * 1.25, kind: "path" });
    return { handle, handleFont, right: { kind: "path", text, font } };
  }
  const r = CHROME.rule;
  boxes.push({ x: r.x1, y: r.y, w: r.x2 - r.x1, h: r.h, kind: "rule" });
  return { handle, handleFont, right: { kind: "rule", ...r } };
}
function layoutFooter(input, sans, mono, boxes, circleOnCover) {
  const m = input.measurer;
  const { slide, deck } = input;
  const top = ROWS.footerBaseline - CHROME.footerSize;
  const h = CHROME.footerSize * 1.25;
  let swipe = null;
  if (slide.swipe) {
    const font2 = { family: sans, weight: 500, size: CHROME.footerSize };
    const s = splitArrow(t(slide.swipe, deck.lang));
    const leadIcon = slide.swipe === "coverSwipe" && circleOnCover ? "circle-arrow" : null;
    let w2 = m.width(s.text, font2);
    if (s.arrow) w2 += CHROME.arrowGap + CHROME.arrowSize;
    if (leadIcon) w2 += CHROME.circleArrowSize + CHROME.circleArrowGap;
    swipe = { text: s.text, arrow: s.arrow, leadIcon, font: font2, w: w2 };
    boxes.push({ x: SAFE.left, y: top, w: w2, h, kind: "swipe" });
  }
  if (deck.counter === false) return { swipe, counter: null };
  const font = { family: mono, weight: 500, size: CHROME.counterSize };
  const text = `${slide.counter.i}/${slide.counter.total}`;
  const w = m.width(text, font);
  boxes.push({ x: SAFE.right - w, y: top, w, h, kind: "counter" });
  return { swipe, counter: { text, font, w } };
}
function ctaLabel(slide, deck) {
  if (!slide.showCta) return null;
  return typeof slide.attrs.cta === "string" && slide.attrs.cta ? slide.attrs.cta : t("cta", deck.lang);
}
function ctaWidth(label2, sans, m) {
  const c = CHROME.cta;
  const w = c.padX * 2 + c.icon + c.gap + m.width(label2, { family: sans, weight: c.weight, size: c.size });
  return Math.min(w, CONTENT_W);
}
function withPrefix(rich, prefix) {
  if (!prefix || !rich.length) return rich;
  const [first, ...rest] = rich;
  const [line, ...lines] = first;
  return [[[{ text: prefix.trimEnd(), style: "accent" }, { text: " ", style: "plain" }, ...line ?? []], ...lines], ...rest];
}
const GRID_STEP = 8;
function centerStack(stack, bandTop, onPhoto2) {
  const first = stack.placed[0];
  if (onPhoto2 || stack.overflow || !first) return 0;
  const dy = centeredShift(first.y, stack.bottom, bandTop);
  for (const p of stack.placed) p.y += dy;
  stack.bottom += dy;
  return dy;
}
function centeredShift(top, bottom, bandTop) {
  const centred = bandTop + Math.floor((ROWS.stackLimit - bandTop - (bottom - top)) / 2 / GRID_STEP) * GRID_STEP;
  return Math.max(bandTop, centred) - top;
}
function frameFrom(top) {
  return { x: SAFE.left, width: CONTENT_W, top, limit: ROWS.stackLimit };
}
function stackWarnings(slide, stack) {
  const out = [];
  const line = slide.lines[0];
  if (stack.codeTooLong) {
    out.push({ code: "code-line-too-long", slideIndex: slide.index, line, message: `Slide ${slide.index + 1}: a code line is too long and gets clipped` });
  }
  if (stack.overflow) {
    out.push({ code: "overflow", slideIndex: slide.index, line, message: `Slide ${slide.index + 1}: text doesn't fit` });
  }
  if (stack.charBroken) {
    out.push({ code: "long-word", slideIndex: slide.index, line, message: `Slide ${slide.index + 1}: a word is too long and was broken` });
  }
  return out;
}
function stackBoxes(stack) {
  return stack.placed.map((p) => ({ x: p.x, y: p.y, w: p.item.kind === "code" ? CONTENT_W : p.w, h: p.h, kind: p.item.kind === "text" ? p.item.role : p.item.kind }));
}
const IPA_FACE = "Gentium Book Plus";
class SizeSet {
  sizes = /* @__PURE__ */ new Map();
  specs = /* @__PURE__ */ new Map();
  cursor = 0;
  constructor(specs) {
    for (const [k, s] of Object.entries(specs)) {
      this.specs.set(k, s);
      this.sizes.set(k, s.max);
    }
  }
  get(k) {
    return this.sizes.get(k);
  }
  /** Step the next block in `order` (round-robin) that can still shrink. False when none can. */
  stepDown(order, first) {
    if (first && this.canStep(first)) {
      this.step(first);
      return true;
    }
    for (let k = 0; k < order.length; k++) {
      const key = order[(this.cursor + k) % order.length];
      if (this.canStep(key)) {
        this.step(key);
        this.cursor = (this.cursor + k + 1) % order.length;
        return true;
      }
    }
    return false;
  }
  canStep(k) {
    const s = this.specs.get(k);
    return !!s && this.sizes.get(k) > s.min;
  }
  step(k) {
    const s = this.specs.get(k);
    this.sizes.set(k, Math.max(s.min, this.sizes.get(k) - s.step));
  }
}
function wrapBlock(rich, width, style2, lh, m) {
  const wrap = wrapRich(rich, width, style2, m);
  const w = wrap.lines.reduce((a, l) => Math.max(a, l.width), 0);
  return { lines: wrap.lines, h: textHeight(wrap.lines, style2.font.size, lh), w, charBroken: wrap.charBroken };
}
function trackedW(text, font, tracking, m) {
  return m.width(text, font) + tracking * Math.max(0, Array.from(text).length - 1);
}
function lexBoxes(els) {
  const out = [];
  for (const e of els) {
    switch (e.k) {
      case "text": {
        const w = e.lines.reduce((a, l) => Math.max(a, l.width), 0);
        const x = e.centerW === void 0 ? e.x : e.x + (e.centerW - w) / 2;
        out.push({ x, y: e.y, w, h: textHeight(e.lines, e.size, e.lh), kind: "lex-text" });
        break;
      }
      case "arabic": {
        const full = e.widths.map((w2, i) => w2 + (e.mark && i === e.widths.length - 1 ? e.mark.gap + e.mark.w : 0));
        const w = Math.max(0, ...full);
        const x = e.align === "center" ? e.x + (e.w - w) / 2 : e.x + e.w - w;
        out.push({ x, y: e.y, w, h: e.lines.length * e.size * e.lh, kind: "arabic" });
        break;
      }
      case "pill":
      case "badge":
      case "rect":
      case "frame":
        out.push({ x: e.x, y: e.y, w: e.w, h: e.h, kind: `lex-${e.k}` });
        break;
      case "icon":
        out.push({ x: e.x, y: e.y, w: e.size, h: e.size, kind: "lex-icon" });
        break;
    }
  }
  return out;
}
function shiftEls(els, dy) {
  for (const e of els) {
    if (e.k === "star") e.cy += dy;
    else if ("y" in e) e.y += dy;
  }
}
function plainRich(text) {
  return [[[{ text, style: "plain" }]]];
}
const WORD = {
  top: ROWS.stackTopCard,
  pill: { size: 26, weight: 600, tracking: 2, padX: 22, padY: 12, gap: 28 },
  // descent: room for descenders (p, j, g) below the lh 1.0 headword box, so the next line never touches them.
  head: { max: 168, min: 96, step: 8, lh: 1, maxLines: 2, gap: 20, descent: 0.12 },
  tag: { size: 24, weight: 600, padX: 16, padY: 8, radius: 10, gap: 20 },
  ipa: { max: 46, min: 34, step: 2, lh: 1.3, gap: 10 },
  say: { max: 32, min: 28, step: 2, lh: 1.3, gap: 40 },
  // label 22 → 24 and translation min 28 → 30 for phone legibility (owner, Oct 2026).
  label: { size: 24, weight: 600, tracking: 2, gap: 12 },
  divider: { h: 2, gap: 40 },
  meaning: { max: 46, min: 34, step: 2, lh: 1.35, maxLines: 4, gap: 40 },
  example: { max: 42, min: 32, step: 2, lh: 1.35, maxLines: 4, bar: 6, indent: 28, gap: 40 },
  translation: { max: 32, min: 30, step: 2, lh: 1.35, maxLines: 2, gap: 12 },
  origin: { max: 36, min: 30, step: 2, lh: 1.35, gap: 32 },
  note: { max: 30, min: 30, step: 2, lh: 1.4, maxLines: 2 },
  priority: ["note", "translation", "say", "example", "meaning", "ipa", "head"]
};
const COMPARE = {
  top: ROWS.stackTopCard,
  headline: { max: 72, min: 56, step: 4, lh: 1.12, maxLines: 2, gap: 40 },
  box: { pad: 32, radius: 24, icon: 44, iconGap: 16, gapBetween: 28, rowGap: 16 },
  label: { size: 26, weight: 600, tracking: 2 },
  // The sentence is the payoff, so it runs large (Oct 2026 review: 52 → 64).
  text: { max: 64, min: 40, step: 4, lh: 1.22, maxLines: 3 },
  why: { max: 38, min: 30, step: 2, lh: 1.5, maxLines: 4, gap: 48 },
  priority: ["why", "text", "headline"]
};
const style$1 = (family, weight, size, mono) => ({
  font: { family, weight, size },
  mono: { family: mono, weight: 400 }
});
function label(c, text, x, y, color) {
  const L = WORD.label;
  return { k: "label", x, y, text: text.toUpperCase(), font: { family: c.sans, weight: L.weight, size: L.size }, color, tracking: L.tracking };
}
const labelH = WORD.label.size * 1.3;
function layoutWord(c, f) {
  const W = WORD;
  const sizes = new SizeSet({ head: W.head, ipa: W.ipa, say: W.say, meaning: W.meaning, example: W.example, translation: W.translation, origin: W.origin, note: W.note });
  const mono = c.v.fonts.mono;
  const x = SAFE.left;
  const missing = f.ipa ? uncoveredIpa(f.ipa) : [];
  if (missing.length) {
    c.warnings.push({ code: "ipa-glyph-missing", slideIndex: c.slideIndex, line: c.line, message: `IPA font can't draw: ${missing.join(" ")}` });
  }
  const build = () => {
    const els = [];
    let y = W.top;
    let over2 = null;
    let first = true;
    const gap = (g) => {
      if (!first) y += g;
      first = false;
    };
    if (f.pos) {
      const p = W.pill;
      const font = { family: c.sans, weight: p.weight, size: p.size };
      const text = f.pos.toUpperCase();
      const w = Math.min(CONTENT_W, trackedW(text, font, p.tracking, c.m) + p.padX * 2);
      els.push({ k: "pill", x, y, w, h: p.size + p.padY * 2, text, font, color: c.s.accent, tracking: p.tracking, padX: p.padX });
      y += p.size + p.padY * 2;
      first = false;
    }
    gap(W.pill.gap);
    const hs = sizes.get("head");
    const head = wrapBlock(parseRich([f.word ?? ""]), CONTENT_W, style$1(c.serif, 700, hs, mono), W.head.lh, c.m);
    if (head.lines.length > W.head.maxLines || head.charBroken && hs > W.head.min) over2 = "head";
    els.push({ k: "text", x, y, lines: head.lines, size: hs, lh: W.head.lh, style: style$1(c.serif, 700, hs, mono), color: c.s.ink, accent: c.s.accent });
    let headBottom = y + head.h + Math.round(hs * W.head.descent);
    if (f.tag) {
      const tg = W.tag;
      const font = { family: c.sans, weight: tg.weight, size: tg.size };
      const bw = c.m.width(f.tag, font) + tg.padX * 2;
      const bh = tg.size + tg.padY * 2;
      const firstW = head.lines[0]?.width ?? 0;
      const baseline = y + hs * 0.92;
      if (firstW + tg.gap + bw <= CONTENT_W) {
        els.push({ k: "badge", x: x + firstW + tg.gap, y: baseline - hs * 0.7, w: bw, h: bh, text: f.tag, font, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: tg.radius });
      } else {
        els.push({ k: "badge", x, y: headBottom + 16, w: bw, h: bh, text: f.tag, font, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: tg.radius });
        headBottom += 16 + bh;
      }
    }
    y = headBottom;
    if (f.ipa) {
      y += W.head.gap;
      const sz = sizes.get("ipa");
      const st = style$1(IPA_FACE, 400, sz, mono);
      const b = wrapBlock(plainRich(f.ipa), CONTENT_W, st, W.ipa.lh, c.m);
      els.push({ k: "text", x, y, lines: b.lines, size: sz, lh: W.ipa.lh, style: st, color: c.s.body, accent: c.s.accent });
      y += b.h;
    }
    if (f.say) {
      y += f.ipa ? W.ipa.gap : W.head.gap;
      const sz = sizes.get("say");
      const st = style$1(c.sans, 400, sz, mono);
      const lab = t("labelSay", c.lang).toUpperCase();
      const lw = trackedW(lab, { family: c.sans, weight: W.label.weight, size: W.label.size }, W.label.tracking, c.m);
      const oneLine = wrapBlock(parseRich([f.say]), CONTENT_W - lw - 12, st, W.say.lh, c.m);
      if (oneLine.lines.length === 1) {
        els.push(label(c, lab, x, y + (sz * W.say.lh - labelH) / 2, c.s.muted));
        els.push({ k: "text", x: x + lw + 12, y, lines: oneLine.lines, size: sz, lh: W.say.lh, style: st, color: c.s.muted, accent: c.s.accent });
        y += oneLine.h;
      } else {
        els.push(label(c, lab, x, y, c.s.muted));
        y += labelH + 8;
        const b = wrapBlock(parseRich([f.say]), CONTENT_W, st, W.say.lh, c.m);
        els.push({ k: "text", x, y, lines: b.lines, size: sz, lh: W.say.lh, style: st, color: c.s.muted, accent: c.s.accent });
        y += b.h;
      }
    }
    const rest = f.meaning || f.example || f.origin || f.note;
    if (rest) {
      y += W.say.gap;
      els.push({ k: "rect", x, y, w: CONTENT_W, h: W.divider.h, fill: c.tok.rule, radius: 0 });
      y += W.divider.h;
      first = true;
      y += W.divider.gap;
    }
    if (f.meaning) {
      gap(0);
      els.push(label(c, t("labelMeaning", c.lang), x, y, c.s.muted));
      y += labelH + W.label.gap;
      const sz = sizes.get("meaning");
      const st = style$1(c.sans, 500, sz, mono);
      const b = wrapBlock(parseRich([f.meaning]), CONTENT_W, st, W.meaning.lh, c.m);
      if (b.lines.length > W.meaning.maxLines) over2 ??= "meaning";
      els.push({ k: "text", x, y, lines: b.lines, size: sz, lh: W.meaning.lh, style: st, color: c.s.ink, accent: c.s.accent });
      y += b.h;
    }
    if (f.example) {
      if (f.meaning) y += W.meaning.gap;
      els.push(label(c, t("labelExample", c.lang), x, y, c.s.muted));
      y += labelH + W.label.gap;
      const E = W.example;
      const sz = sizes.get("example");
      const st = style$1(c.serif, 600, sz, mono);
      const tx = x + E.indent;
      const b = wrapBlock(parseRich([f.example]), CONTENT_W - E.indent, st, E.lh, c.m);
      if (b.lines.length > E.maxLines) over2 ??= "example";
      const barTop = y;
      els.push({ k: "text", x: tx, y, lines: b.lines, size: sz, lh: E.lh, style: st, color: c.s.ink, accent: c.s.accent, highlight: c.tok.highlight });
      y += b.h;
      if (f.translation) {
        y += W.translation.gap;
        const tsz = sizes.get("translation");
        const tst = style$1(c.sans, 400, tsz, mono);
        const tb = wrapBlock(parseRich([f.translation]), CONTENT_W - E.indent, tst, W.translation.lh, c.m);
        if (tb.lines.length > W.translation.maxLines) over2 ??= "translation";
        els.push({ k: "text", x: tx, y, lines: tb.lines, size: tsz, lh: W.translation.lh, style: tst, color: c.s.muted, accent: c.s.accent });
        y += tb.h;
      }
      els.push({ k: "rect", x, y: barTop, w: E.bar, h: y - barTop, fill: c.s.accent, radius: E.bar / 2 });
    }
    if (f.origin) {
      if (f.meaning || f.example) y += W.example.gap;
      els.push(label(c, t("labelOrigin", c.lang), x, y, c.s.muted));
      y += labelH + W.label.gap;
      const sz = sizes.get("origin");
      const st = style$1(c.sans, 500, sz, mono);
      const b = wrapBlock(parseRich([f.origin]), CONTENT_W, st, W.origin.lh, c.m);
      els.push({ k: "text", x, y, lines: b.lines, size: sz, lh: W.origin.lh, style: st, color: c.s.body, accent: c.s.accent });
      y += b.h;
    }
    if (f.note) {
      if (f.meaning || f.example || f.origin) y += W.origin.gap;
      const sz = sizes.get("note");
      const st = style$1(c.sans, 400, sz, mono);
      const b = wrapBlock(parseRich([f.note]), CONTENT_W, st, W.note.lh, c.m);
      if (b.lines.length > W.note.maxLines) over2 ??= "note";
      els.push({ k: "text", x, y, lines: b.lines, size: sz, lh: W.note.lh, style: st, color: c.s.muted, accent: c.s.accent });
      y += b.h;
    }
    return { els, bottom: y, over: over2 };
  };
  return fit(build, sizes, W.priority);
}
function layoutCompare(c, f) {
  const C = COMPARE;
  const sizes = new SizeSet({ headline: C.headline, text: C.text, why: C.why });
  const mono = c.v.fonts.mono;
  const x = SAFE.left;
  const inner = CONTENT_W - C.box.pad * 2;
  const box = (els, y, kind) => {
    const B = C.box;
    const bad = kind === "wrong";
    const ink = bad ? c.tok.badInk : c.tok.okInk;
    const sz = sizes.get("text");
    const st = style$1(c.serif, 600, sz, mono);
    const b = wrapBlock(parseRich([f[kind] ?? ""]), inner, st, C.text.lh, c.m);
    const h = B.pad * 2 + B.icon + B.rowGap + b.h;
    els.push({ k: "rect", x, y, w: CONTENT_W, h, fill: bad ? c.tok.badBg : c.tok.okBg, radius: B.radius });
    els.push({ k: "icon", name: bad ? "x-circle" : "check-circle", x: x + B.pad, y: y + B.pad, size: B.icon, color: ink });
    const lab = (f[`${kind}-label`] || t(bad ? "compareWrong" : "compareRight", c.lang)).toUpperCase();
    els.push({
      k: "label",
      x: x + B.pad + B.icon + B.iconGap,
      y: y + B.pad + (B.icon - C.label.size * 1.3) / 2,
      text: lab,
      font: { family: c.sans, weight: C.label.weight, size: C.label.size },
      color: ink,
      tracking: C.label.tracking
    });
    els.push({
      k: "text",
      x: x + B.pad,
      y: y + B.pad + B.icon + B.rowGap,
      lines: b.lines,
      size: sz,
      lh: C.text.lh,
      style: st,
      color: bad ? ink : ink,
      accent: bad ? ink : c.s.ink,
      highlight: bad ? void 0 : c.tok.highlight,
      strike: bad
    });
    return { y: y + h, over: b.lines.length > C.text.maxLines };
  };
  const build = () => {
    const els = [];
    let y = C.top;
    let over2 = null;
    if (f.headline) {
      const sz = sizes.get("headline");
      const st = style$1(c.serif, 700, sz, mono);
      const b = wrapBlock(parseRich([f.headline]), CONTENT_W, st, C.headline.lh, c.m);
      if (b.lines.length > C.headline.maxLines) over2 = "headline";
      els.push({ k: "text", x, y, lines: b.lines, size: sz, lh: C.headline.lh, style: st, color: c.s.ink, accent: c.s.accent });
      y += b.h + C.headline.gap;
    }
    const w = box(els, y, "wrong");
    const r = box(els, w.y + C.box.gapBetween, "right");
    if (w.over || r.over) over2 ??= "text";
    y = r.y;
    if (f.why) {
      y += C.why.gap;
      const sz = sizes.get("why");
      const st = style$1(c.sans, 400, sz, mono);
      const b = wrapBlock(parseRich([f.why]), CONTENT_W, st, C.why.lh, c.m);
      if (b.lines.length > C.why.maxLines) over2 ??= "why";
      els.push({ k: "text", x, y, lines: b.lines, size: sz, lh: C.why.lh, style: st, color: c.s.body, accent: c.s.accent });
      y += b.h;
    }
    return { els, bottom: y, over: over2 };
  };
  return fit(build, sizes, C.priority);
}
function fit(build, sizes, order) {
  let r = build();
  for (let guard = 0; guard < 300 && (r.bottom > ROWS.stackLimit || r.over); guard++) {
    if (!sizes.stepDown(order, r.over ?? void 0)) break;
    r = build();
  }
  return { els: r.els, bottom: r.bottom, overflow: r.bottom > ROWS.stackLimit || !!r.over };
}
const TABLE_STYLE = {
  top: WORD.top,
  badge: { d: 104, digit: 46, weight: 600, gap: 32 },
  headline: { max: 76, min: 56, step: 4, lh: 1.1, maxLines: 3, gap: 40 },
  header: { size: 30, weight: 600, tracking: 1 },
  body: { max: 40, min: 28, step: 2, weight: 500 },
  rowH: 1.9,
  padX: 24,
  radius: 20,
  border: 2,
  headerFill: 0.12,
  zebra: 0.35,
  note: { max: 30, min: 30, step: 2, lh: 1.4, maxLines: 2, gap: 32 },
  priority: ["body", "headline"]
};
function cellLine(src, style2, maxW, m) {
  const rich = [[parseInline(src)[0] ?? []]];
  const wrapped = wrapRich(rich, 1e9, style2, m).lines[0] ?? { runs: [], width: 0, paraStart: false };
  if (wrapped.width <= maxW) return { line: wrapped, clipped: false };
  const runs = wrapped.runs.map((r) => ({ ...r }));
  const ell = m.width("…", style2.font);
  let width = wrapped.width;
  while (runs.length && width + ell > maxW) {
    const last = runs[runs.length - 1];
    const chars = Array.from(last.text);
    chars.pop();
    last.text = chars.join("");
    last.w = m.width(last.text, style2.font);
    if (!last.text) runs.pop();
    width = runs.length ? runs[runs.length - 1].x + runs[runs.length - 1].w : 0;
  }
  const tail = runs[runs.length - 1];
  if (tail && tail.style !== "code") tail.text += "…";
  else runs.push({ text: "…", style: "plain", x: width, w: ell });
  return { line: { runs, width: width + ell, paraStart: false }, clipped: true };
}
const cellText = (src) => (parseInline(src)[0] ?? []).map((r) => r.text).join("");
function layoutTable(c, table, headline, note, badge) {
  const T = TABLE_STYLE;
  const sizes = new SizeSet({ body: T.body, headline: T.headline, note: T.note });
  const mono = c.v.fonts.mono;
  const x = SAFE.left;
  const rows = table.rows.slice(0, TABLE.maxRows);
  if (table.rows.length > TABLE.maxRows) {
    c.warnings.push({ code: "table-too-many-rows", slideIndex: c.slideIndex, line: c.line, message: `Tables show at most ${TABLE.maxRows} rows; ${table.rows.length - TABLE.maxRows} hidden` });
  }
  const headFont = { family: c.sans, weight: T.header.weight, size: T.header.size };
  const headers = table.header.map((h) => cellText(h).toUpperCase());
  let tooWide = false;
  const build = () => {
    const els = [];
    let y = T.top;
    let over2 = null;
    if (badge !== null) {
      const B = T.badge;
      els.push({ k: "badge", x, y, w: B.d, h: B.d, text: String(badge), font: { family: c.sans, weight: B.weight, size: B.digit }, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: B.d / 2 });
      y += B.d + B.gap;
    }
    if (headline) {
      const sz2 = sizes.get("headline");
      const st2 = { font: { family: c.serif, weight: 700, size: sz2 }, mono: { family: mono, weight: 400 } };
      const b = wrapBlock(parseRich([headline]), CONTENT_W, st2, T.headline.lh, c.m);
      if (b.lines.length > T.headline.maxLines) over2 = "headline";
      els.push({ k: "text", x, y, lines: b.lines, size: sz2, lh: T.headline.lh, style: st2, color: c.s.ink, accent: c.s.accent });
      y += b.h + T.headline.gap;
    }
    const sz = sizes.get("body");
    const st = { font: { family: c.sans, weight: T.body.weight, size: sz }, mono: { family: mono, weight: 400 } };
    const n = table.header.length;
    const natural = Array.from({ length: n }, (_, col) => {
      const hw = trackedW(headers[col] ?? "", headFont, T.header.tracking, c.m);
      const cw = rows.reduce((a, r) => Math.max(a, cellLine(r[col] ?? "", st, 1e9, c.m).line.width), 0);
      return Math.max(hw, cw) + T.padX * 2;
    });
    const total = natural.reduce((a, b) => a + b, 0);
    const fits = total <= CONTENT_W;
    const widths = natural.map((w) => fits ? w + (CONTENT_W - total) * (w / total) : w * CONTENT_W / total);
    const colX = [];
    widths.reduce((acc, w, i) => {
      colX[i] = acc;
      return acc + w;
    }, x);
    const headH = T.header.size * T.rowH;
    const rowH = sz * T.rowH;
    const tableH = headH + rowH * rows.length;
    els.push({ k: "rect", x, y, w: CONTENT_W, h: tableH, fill: c.s.bg, radius: T.radius });
    els.push({ k: "clip", x, y, w: CONTENT_W, h: tableH, radius: T.radius });
    els.push({ k: "rect", x, y, w: CONTENT_W, h: headH, fill: withAlpha(c.s.accent, T.headerFill), radius: 0 });
    headers.forEach((h, col) => {
      els.push({ k: "label", x: colX[col] + T.padX, y: y + (headH - T.header.size * 1.3) / 2, text: h, font: headFont, color: c.s.accent, tracking: T.header.tracking });
    });
    let clipped = false;
    rows.forEach((r, ri) => {
      const ry = y + headH + ri * rowH;
      if (ri % 2 === 1) els.push({ k: "rect", x, y: ry, w: CONTENT_W, h: rowH, fill: withAlpha(c.tok.rule, T.zebra), radius: 0 });
      els.push({ k: "rect", x, y: ry, w: CONTENT_W, h: 1, fill: c.tok.rule, radius: 0 });
      r.forEach((cell, col) => {
        const res = cellLine(cell, st, widths[col] - T.padX * 2, c.m);
        if (res.clipped) clipped = true;
        els.push({ k: "text", x: colX[col] + T.padX, y: ry + (rowH - sz * 1.2) / 2, lines: [res.line], size: sz, lh: 1.2, style: st, color: c.s.ink, accent: c.s.accent });
      });
    });
    els.push({ k: "unclip" });
    els.push({ k: "frame", x, y, w: CONTENT_W, h: tableH, stroke: c.tok.rule, width: T.border, radius: T.radius });
    tooWide = clipped;
    if (clipped && sz > T.body.min) over2 ??= "body";
    y += tableH;
    if (note) {
      y += T.note.gap;
      const nsz = sizes.get("note");
      const nst = { font: { family: c.sans, weight: 400, size: nsz }, mono: { family: mono, weight: 400 } };
      const b = wrapBlock(parseRich([note]), CONTENT_W, nst, T.note.lh, c.m);
      if (b.lines.length > T.note.maxLines) over2 ??= "note";
      els.push({ k: "text", x, y, lines: b.lines, size: nsz, lh: T.note.lh, style: nst, color: c.s.muted, accent: c.s.accent });
      y += b.h;
    }
    return { els, bottom: y, over: over2 };
  };
  const out = fit(build, sizes, T.priority);
  if (tooWide) {
    c.warnings.push({ code: "table-too-wide", slideIndex: c.slideIndex, line: c.line, message: 'Table cells are too wide and were cut with "…"' });
  }
  return out;
}
const LIGHT = { okBg: "#E3EEDB", okInk: "#2E5A2A", badBg: "#F6DCD8", badInk: "#8E1F17" };
const DARK = { okBg: "#1E3A24", okInk: "#9BE3A6", badBg: "#3E1E1C", badInk: "#F5A39A" };
function isDarkSurface(s, onPhoto2) {
  if (onPhoto2) return true;
  return contrast("#FFFFFF", s.bg) > contrast("#111111", s.bg);
}
function lexTokens(v, s, onPhoto2) {
  const dark = isDarkSurface(s, onPhoto2);
  if (v.lex && !dark) return v.lex;
  const pair = dark ? DARK : LIGHT;
  return { rule: withAlpha(s.muted, 0.3), highlight: withAlpha(s.accent, 0.22), ...pair };
}
function layoutLexSlide(input) {
  const { slide, deck, variant: v, measurer: m } = input;
  const warnings = [];
  const boxes = [];
  const { surface, name, onPhoto: onPhoto2 } = resolveSurface(v, slide, input.hasPhoto, warnings);
  const sans = v.fonts.sans;
  const mono = v.fonts.mono;
  const c = {
    v,
    s: surface,
    tok: lexTokens(v, surface, onPhoto2),
    m,
    lang: deck.lang,
    serif: v.fonts.serif ?? sans,
    sans,
    slideIndex: slide.index,
    line: slide.lines[0],
    warnings
  };
  const lex = slide.type === "word" ? layoutWord(c, slide.fields) : slide.type === "compare" ? layoutCompare(c, slide.fields) : layoutTable(c, slide.table ?? { header: [], rows: [] }, slide.headlineSrc, slide.fields.note ?? "", slide.badge);
  const first = lex.els.find((e) => "y" in e);
  if (!lex.overflow && !onPhoto2 && first) {
    const dy = centeredShift(first.y, lex.bottom, ROWS.stackTopCard);
    shiftEls(lex.els, dy);
    lex.bottom += dy;
  }
  if (lex.overflow) warnings.push({ code: "overflow", slideIndex: slide.index, line: slide.lines[0], message: `Slide ${slide.index + 1}: text doesn't fit` });
  const header = layoutHeader(input, sans, mono, boxes);
  const footer = layoutFooter(input, sans, mono, boxes, traitsOf(v).coverSwipeIcon);
  boxes.push(...lexBoxes(lex.els));
  return {
    slide,
    deck,
    variant: v,
    surface,
    surfaceName: name,
    onPhoto: onPhoto2,
    stack: { placed: [], bottom: lex.bottom, overflow: lex.overflow, codeTooLong: false, charBroken: false, droppedIcon: false },
    icon: null,
    ctaLabel: null,
    header,
    footer,
    boxes,
    warnings,
    lex
  };
}
const SERIF = /* @__PURE__ */ new Set(["Playfair Display", "Lora", "Fraunces", "Gentium Book Plus", "Amiri Quran", "Amiri"]);
function isMonoFamily(family) {
  return /mono/i.test(family);
}
function legibleMin(min, family) {
  return isMonoFamily(family) ? min - 2 : min;
}
function fallbackStack(family) {
  if (isMonoFamily(family)) return "ui-monospace, Menlo, Consolas, monospace";
  if (SERIF.has(family)) return 'Georgia, "Times New Roman", serif';
  return 'system-ui, -apple-system, "Segoe UI", sans-serif';
}
const ARABIC_FALLBACK = "Amiri";
function fontString(f) {
  const arabic = f.family === ARABIC_FALLBACK || f.family === "Amiri Quran" ? "" : `"${ARABIC_FALLBACK}", `;
  return `${f.weight} ${f.size}px "${f.family}", ${arabic}${fallbackStack(f.family)}`;
}
function createCanvasMeasurer(ctx, hasFace) {
  const cache2 = /* @__PURE__ */ new Map();
  return {
    ...hasFace ? { hasFace } : {},
    width(text, font) {
      const fs = fontString(font);
      const key = `${fs}\0${text}`;
      const hit = cache2.get(key);
      if (hit !== void 0) return hit;
      if (ctx.font !== fs) ctx.font = fs;
      const w = ctx.measureText(text).width;
      if (cache2.size > 2e4) cache2.clear();
      cache2.set(key, w);
      return w;
    }
  };
}
const AYAH_FACE = "Amiri Quran";
const HADITH_FACE = "Amiri";
const ARABIC_SAMPLE = "بِسْمِ ٱللَّهِ ﴿١٢﴾";
const AYAH = {
  top: ROWS.stackTopCard,
  bottom: ROWS.stackLimit,
  star: { size: 56, width: 2, alpha: 0.7, gap: 48 },
  arab: { max: 76, min: 48, step: 4, lh: 2.1, baseline: 1.3, gap: 56 },
  divider: { w: 120, h: 2, alpha: 0.6, gap: 48 },
  // Minimums raised for phone legibility (owner, Oct 2026): terjemah/text 32 → 34, source 24 → 28, grade 24 → 26.
  terjemah: { weight: 500, max: 42, min: 34, step: 2, lh: 1.5, maxLines: 7, gap: 32 },
  ref: { size: 30, weight: 600, lh: 1.3, gap: 10 },
  source: { size: 28, weight: 400, lh: 1.3 }
};
const HADITH = {
  pill: { size: 24, weight: 600, tracking: 3, padX: 22, h: 48, gap: 40 },
  arab: { max: 56, min: 40, step: 4, lh: 2, baseline: 1.25, gap: 40 },
  text: { weight: 500, max: 44, min: 34, step: 2, lh: 1.5, maxLines: 8, gap: 32 },
  ref: { size: 30, weight: 600, lh: 1.3, gap: 16 },
  grade: { size: 26, weight: 600, padX: 18, h: 46, radius: 23, gapX: 20, gap: 10 },
  source: { size: 28, weight: 400, lh: 1.3 }
};
const MARK_GAP = 0.3;
function wrapArabic(text, family, size, width, m, mark) {
  const font = { family, weight: 400, size };
  const words = text.split(" ").filter((w) => w !== "");
  const space = m.width(" ", font);
  const markW = mark ? size * MARK_GAP + m.width(mark, font) : 0;
  const lines = [];
  const widths = [];
  let cur = [];
  let curW = 0;
  let fits = true;
  words.forEach((word, i) => {
    const w = m.width(word, font);
    const extra = i === words.length - 1 ? markW : 0;
    if (w + extra > width) fits = false;
    if (cur.length && curW + space + w + extra > width) {
      lines.push(cur.join(" "));
      widths.push(curW);
      cur = [];
      curW = 0;
    }
    curW += (cur.length ? space : 0) + w;
    cur.push(word);
  });
  if (cur.length) {
    lines.push(cur.join(" "));
    widths.push(curW);
  }
  return { lines, widths, fits };
}
const sansFont = (c, size, weight) => ({ family: c.sans, weight, size });
const style = (c, family, weight, size) => ({
  font: { family, weight, size },
  mono: { family: c.mono, weight: 400 }
});
function buildAyah(c, f, arabSize, tSize, withSource, withText) {
  const A = AYAH;
  const els = [];
  const x = SAFE.left;
  let y = 0;
  els.push({ k: "star", cx: x + CONTENT_W / 2, cy: y + A.star.size / 2, size: A.star.size, color: withAlpha(c.s.accent, A.star.alpha), width: A.star.width });
  y += A.star.size + A.star.gap;
  const mark = ayahMark(f);
  const wrap = wrapArabic(f.arab ?? "", AYAH_FACE, arabSize, CONTENT_W, c.m, mark);
  els.push({
    k: "arabic",
    x,
    y,
    w: CONTENT_W,
    lines: wrap.lines,
    widths: wrap.widths,
    size: arabSize,
    lh: A.arab.lh,
    baseline: A.arab.baseline,
    family: AYAH_FACE,
    color: c.s.ink,
    align: "center",
    mark: mark ? { text: mark, w: c.m.width(mark, { family: AYAH_FACE, weight: 400, size: arabSize }), gap: arabSize * MARK_GAP, color: c.s.accent } : null
  });
  y += wrap.lines.length * arabSize * A.arab.lh + A.arab.gap;
  els.push({ k: "rect", x: x + (CONTENT_W - A.divider.w) / 2, y, w: A.divider.w, h: A.divider.h, fill: withAlpha(c.s.accent, A.divider.alpha), radius: 0 });
  y += A.divider.h + A.divider.gap;
  let textOver = false;
  if (withText) {
    const tStyle = style(c, c.serif, A.terjemah.weight, tSize);
    const tw = wrapBlock(withBody(f.terjemah), CONTENT_W, tStyle, A.terjemah.lh, c.m);
    textOver = tw.lines.length > A.terjemah.maxLines;
    els.push({ k: "text", x, y, lines: tw.lines, size: tSize, lh: A.terjemah.lh, style: tStyle, color: c.s.body, accent: c.s.accent, centerW: CONTENT_W });
    y += tw.h + A.terjemah.gap;
  }
  const refText = f.portion === "true" ? `${f.ref ?? ""} ${t("portion", c.lang)}` : f.ref ?? "";
  const refStyle = style(c, c.sans, A.ref.weight, A.ref.size);
  const rw = wrapBlock(plainRich(refText), CONTENT_W, refStyle, A.ref.lh, c.m);
  els.push({ k: "text", x, y, lines: rw.lines, size: A.ref.size, lh: A.ref.lh, style: refStyle, color: c.s.accent, accent: c.s.accent, centerW: CONTENT_W });
  y += rw.h;
  if (withSource && f.source) {
    y += A.ref.gap;
    const sStyle = style(c, c.sans, A.source.weight, A.source.size);
    const sw = wrapBlock(plainRich(f.source), CONTENT_W, sStyle, A.source.lh, c.m);
    els.push({ k: "text", x, y, lines: sw.lines, size: A.source.size, lh: A.source.lh, style: sStyle, color: c.s.muted, accent: c.s.muted, centerW: CONTENT_W });
    y += sw.h;
  }
  return { els, h: y, textOver, arabFits: wrap.fits };
}
function buildHadith(c, f, arabSize, tSize, withSource, withText) {
  const H = HADITH;
  const els = [];
  const x = SAFE.left;
  let y = 0;
  const label2 = t("hadithLabel", c.lang);
  const pf = sansFont(c, H.pill.size, H.pill.weight);
  els.push({ k: "pill", x, y, w: trackedW(label2, pf, H.pill.tracking, c.m) + H.pill.padX * 2, h: H.pill.h, text: label2, font: pf, color: c.s.accent, tracking: H.pill.tracking, padX: H.pill.padX });
  y += H.pill.h + H.pill.gap;
  let arabFits = true;
  if (f.arab) {
    const wrap = wrapArabic(f.arab, HADITH_FACE, arabSize, CONTENT_W, c.m, null);
    arabFits = wrap.fits;
    els.push({ k: "arabic", x, y, w: CONTENT_W, lines: wrap.lines, widths: wrap.widths, size: arabSize, lh: H.arab.lh, baseline: H.arab.baseline, family: HADITH_FACE, color: c.s.ink, align: "right", mark: null });
    y += wrap.lines.length * arabSize * H.arab.lh + H.arab.gap;
  }
  let textOver = false;
  if (withText) {
    const tStyle = style(c, c.serif, H.text.weight, tSize);
    const tw = wrapBlock(withBody(f.text), CONTENT_W, tStyle, H.text.lh, c.m);
    textOver = tw.lines.length > H.text.maxLines;
    els.push({ k: "text", x, y, lines: tw.lines, size: tSize, lh: H.text.lh, style: tStyle, color: c.s.ink, accent: c.s.accent });
    y += tw.h + H.text.gap;
  }
  const refStyle = style(c, c.sans, H.ref.weight, H.ref.size);
  const rw = wrapBlock(plainRich(f.ref ?? ""), CONTENT_W, refStyle, H.ref.lh, c.m);
  els.push({ k: "text", x, y, lines: rw.lines, size: H.ref.size, lh: H.ref.lh, style: refStyle, color: c.s.accent, accent: c.s.accent });
  const lastW = rw.lines.at(-1)?.width ?? 0;
  const g = H.grade;
  const gradeText = `${t("gradeLabel", c.lang)}: ${f.grade ?? ""}`;
  const gf = sansFont(c, g.size, g.weight);
  const gw = c.m.width(gradeText, gf) + g.padX * 2;
  const refH = rw.h;
  if (lastW + g.gapX + gw <= CONTENT_W) {
    const lineTop = y + refH - H.ref.size * H.ref.lh;
    els.push({ k: "badge", x: x + lastW + g.gapX, y: lineTop + (H.ref.size * H.ref.lh - g.h) / 2, w: gw, h: g.h, text: gradeText, font: gf, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: g.radius });
    y += refH;
  } else {
    y += refH + H.ref.gap;
    els.push({ k: "badge", x, y, w: Math.min(gw, CONTENT_W), h: g.h, text: gradeText, font: gf, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: g.radius });
    y += g.h;
  }
  if (withSource && f.source) {
    y += g.gap;
    const sStyle = style(c, c.sans, H.source.weight, H.source.size);
    const sw = wrapBlock(plainRich(f.source), CONTENT_W, sStyle, H.source.lh, c.m);
    els.push({ k: "text", x, y, lines: sw.lines, size: H.source.size, lh: H.source.lh, style: sStyle, color: c.s.muted, accent: c.s.muted });
    y += sw.h;
  }
  return { els, h: y, textOver, arabFits };
}
function withBody(src) {
  return src ? pipeLines(src) : [];
}
function layoutArabicSlide(input) {
  const { slide, deck, variant: v, measurer: m } = input;
  const warnings = [];
  const boxes = [];
  const { surface, name, onPhoto: onPhoto2 } = resolveSurface(v, slide, input.hasPhoto, warnings);
  const c = { s: surface, m, serif: v.fonts.serif ?? v.fonts.sans, sans: v.fonts.sans, mono: v.fonts.mono, lang: deck.lang };
  const isAyah = slide.type === "ayah";
  const f = slide.fields;
  const base2 = isAyah ? { arab: AYAH.arab, text: AYAH.terjemah } : { arab: HADITH.arab, text: HADITH.text };
  const spec = { arab: base2.arab, text: { ...base2.text, min: legibleMin(base2.text.min, c.serif) } };
  const build = isAyah ? buildAyah : buildHadith;
  const avail = AYAH.bottom - AYAH.top;
  const warn = (code, message) => {
    warnings.push({ code, slideIndex: slide.index, line: slide.lines[0], message });
  };
  const face = isAyah ? AYAH_FACE : HADITH_FACE;
  if (f.arab && m.hasFace && !m.hasFace(face, ARABIC_SAMPLE)) warn("arabic-font-missing", `The ${face} font isn't loaded; export is blocked`);
  let withSource = true;
  let tSize = spec.text.max;
  let aSize = spec.arab.max;
  const ok = (b2) => b2.h <= avail && !b2.textOver && b2.arabFits;
  let b = build(c, f, aSize, tSize, withSource, true);
  while (!ok(b)) {
    if (withSource && f.source) withSource = false;
    else if (tSize > spec.text.min) tSize = Math.max(spec.text.min, tSize - spec.text.step);
    else if (aSize > spec.arab.min) aSize = Math.max(spec.arab.min, aSize - spec.arab.step);
    else break;
    b = build(c, f, aSize, tSize, withSource, true);
  }
  const overflow = !ok(b);
  if (overflow) {
    const bare = build(c, f, spec.arab.min, spec.text.min, false, false);
    if (!bare.arabFits || bare.h > avail) warn("arabic-too-long", "Ayat terlalu panjang untuk satu slide. Gunakan penggalan atau pecah di tanda waqaf.");
    else warn("overflow", `Slide ${slide.index + 1}: text doesn't fit`);
  }
  const top = overflow ? AYAH.top : AYAH.top + Math.max(0, Math.round((avail - b.h) / 2));
  shiftEls(b.els, top);
  const header = layoutHeader(input, c.sans, c.mono, boxes);
  const footer = layoutFooter(input, c.sans, c.mono, boxes, traitsOf(v).coverSwipeIcon);
  boxes.push(...lexBoxes(b.els));
  return {
    slide,
    deck,
    variant: v,
    surface,
    surfaceName: name,
    onPhoto: onPhoto2,
    stack: { placed: [], bottom: top + b.h, overflow, codeTooLong: false, charBroken: false, droppedIcon: false },
    icon: null,
    ctaLabel: null,
    header,
    footer,
    boxes,
    warnings,
    lex: { els: b.els, bottom: top + b.h, overflow }
  };
}
const TYPE$1 = {
  coverHeadline: { face: "serif", weight: 700, max: 120, min: 84, step: 4, lh: 1.06, maxLines: 5, widowFix: true },
  coverSubtitle: { face: "sans", weight: 400, max: 40, min: 32, step: 2, lh: 1.45, maxLines: 3 },
  cardHeadline: { face: "serif", weight: 700, max: 92, min: 64, step: 4, lh: 1.12, maxLines: 6, widowFix: true },
  // body min 32 → 34 for phone legibility (owner, Oct 2026).
  body: { face: "sans", weight: 400, max: 42, min: 34, step: 2, lh: 1.5, maxLines: 8 },
  note: { face: "sans", weight: 400, max: 32, min: 30, step: 2, lh: 1.45, maxLines: 3 },
  quote: { face: "serif", weight: 600, max: 76, min: 52, step: 4, lh: 1.18, maxLines: 7, widowFix: true },
  endHeadline: { face: "serif", weight: 700, max: 108, min: 76, step: 4, lh: 1.08, maxLines: 4, widowFix: true }
};
const FIXED$1 = {
  kicker: { size: 26, weight: 600, tracking: 3, h: 32 },
  attribution: { size: 32, weight: 500, lh: 1.3 },
  badge: { d: 120, digit: 54, weight: 600, opticalY: -2 },
  icon: 120,
  code: { max: 40, min: 28, step: 2, lh: 1.55, maxLines: 12, pad: 36, radius: 28 },
  quoteMark: { size: 240, weight: 700, alpha: 0.45, x: 84, top: 300 }
};
const STACK$1 = {
  coverTop: 300,
  cardTop: 344,
  cardTopNoBadge: 380,
  quoteTop: 520,
  endTop: 560,
  kickerGap: 32,
  headlineGap: 40,
  cardGap: 48,
  iconGap: 72,
  noteGap: 32,
  attributionGap: 40,
  quoteBodyGap: 32
};
function layoutEditorial(input, opts = {}) {
  if (isLexType(input.slide.type)) return layoutLexSlide(input);
  if (isArabicType(input.slide.type)) return layoutArabicSlide(input);
  const { slide, deck, variant: v, measurer: m } = input;
  const serif = v.fonts.serif ?? v.fonts.sans;
  const sans = v.fonts.sans;
  const mono = v.fonts.mono;
  const warnings = [];
  const boxes = [];
  const { surface, name, onPhoto: onPhoto2 } = resolveSurface(v, slide, input.hasPhoto, warnings);
  const spec = (s) => {
    const weight = s.face === "serif" && s.weight === 700 && v.headlineWeight ? v.headlineWeight : s.weight;
    return { ...s, weight, family: s.face === "serif" ? serif : sans, mono: { family: mono, weight: weight >= 600 ? 600 : 400 } };
  };
  const items = [];
  const push = (it) => {
    items.push({ ...it, gap: items.length ? it.gap : 0 });
  };
  const cta = ctaLabel(slide, deck);
  const pushIconAndCta = (iconGap) => {
    if (input.icon) push({ kind: "icon", h: FIXED$1.icon, w: FIXED$1.icon, gap: iconGap });
    if (cta) push({ kind: "cta", h: CHROME.cta.h, w: ctaWidth(cta, sans, m), gap: CHROME.cta.gapBefore, label: cta });
  };
  let top = STACK$1.cardTop;
  switch (slide.type) {
    case "cover": {
      top = STACK$1.coverTop;
      if (slide.attrs.kicker) push({ kind: "kicker", h: FIXED$1.kicker.h, w: 0, gap: 0, label: slide.attrs.kicker.toUpperCase() });
      push({ kind: "text", role: "headline", rich: slide.headline, spec: spec(TYPE$1.coverHeadline), gap: STACK$1.kickerGap, tone: "ink" });
      if (!isEmptyRich(slide.body)) push({ kind: "text", role: "subtitle", rich: slide.body, spec: spec(TYPE$1.coverSubtitle), gap: STACK$1.headlineGap, tone: "body" });
      break;
    }
    case "card":
    case "code":
    case "diagram": {
      const kicker = slide.attrs.kicker;
      if (kicker) push({ kind: "kicker", h: FIXED$1.kicker.h, w: 0, gap: 0, label: kicker.toUpperCase() });
      const verdict = verdictItem(slide, v, m, kicker ? STACK$1.kickerGap : 0);
      if (verdict) push(verdict);
      else if (kicker) top = STACK$1.cardTopNoBadge;
      else if (slide.badge !== null) push({ kind: "badge", h: FIXED$1.badge.d, w: FIXED$1.badge.d, gap: 0, label: String(slide.badge) });
      else top = STACK$1.cardTopNoBadge;
      const d = diagramItem(slide, STACK$1.cardGap);
      if (d) push(d);
      push({ kind: "text", role: "headline", rich: slide.headline, spec: spec(TYPE$1.cardHeadline), gap: kicker && !verdict ? STACK$1.kickerGap : STACK$1.cardGap, tone: "ink" });
      if (!isEmptyRich(slide.body)) push({ kind: "text", role: "body", rich: slide.body, spec: spec(TYPE$1.body), gap: STACK$1.cardGap, tone: "body" });
      if (slide.type === "code" && slide.code) {
        const c = FIXED$1.code;
        const codeSpec = {
          family: mono,
          weight: 400,
          max: c.max,
          min: c.min,
          step: c.step,
          lh: c.lh,
          maxLines: c.maxLines,
          padX: c.pad,
          padTop: c.pad,
          padBottom: c.pad,
          titleBar: 0
        };
        push({ kind: "code", lines: prepareCode(slide.code.text, slide.code.lang), lang: slide.code.lang, spec: codeSpec, gap: STACK$1.iconGap });
        if (!isEmptyRich(slide.note)) push({ kind: "text", role: "note", rich: slide.note, spec: spec(TYPE$1.note), gap: STACK$1.noteGap, tone: "muted" });
        if (cta) push({ kind: "cta", h: CHROME.cta.h, w: ctaWidth(cta, sans, m), gap: CHROME.cta.gapBefore, label: cta });
      } else if (slide.type === "diagram") {
        if (!isEmptyRich(slide.note)) push({ kind: "text", role: "note", rich: slide.note, spec: spec(TYPE$1.note), gap: STACK$1.noteGap, tone: "muted" });
        if (cta) push({ kind: "cta", h: CHROME.cta.h, w: ctaWidth(cta, sans, m), gap: CHROME.cta.gapBefore, label: cta });
      } else pushIconAndCta(STACK$1.iconGap);
      break;
    }
    case "quote": {
      top = STACK$1.quoteTop;
      if (slide.attrs.kicker) push({ kind: "kicker", h: FIXED$1.kicker.h, w: 0, gap: 0, label: slide.attrs.kicker.toUpperCase() });
      push({ kind: "text", role: "quote", rich: slide.headline, spec: spec(TYPE$1.quote), gap: STACK$1.kickerGap, tone: "ink" });
      if (slide.attribution) {
        const a = FIXED$1.attribution;
        push({ kind: "attribution", h: a.size * a.lh, w: 0, gap: STACK$1.attributionGap, label: `— ${slide.attribution}` });
      }
      if (!isEmptyRich(slide.body)) push({ kind: "text", role: "body", rich: slide.body, spec: spec(TYPE$1.body), gap: STACK$1.quoteBodyGap, tone: "body" });
      pushIconAndCta(STACK$1.iconGap);
      break;
    }
    case "end": {
      top = STACK$1.endTop;
      push({ kind: "text", role: "headline", rich: slide.headline, spec: spec(TYPE$1.endHeadline), gap: 0, tone: "ink" });
      if (!isEmptyRich(slide.body)) push({ kind: "text", role: "body", rich: slide.body, spec: spec(TYPE$1.body), gap: STACK$1.headlineGap, tone: "body" });
      pushIconAndCta(STACK$1.iconGap);
      const last = items[items.length - 1];
      if (last?.kind === "cta" && items.length > 1) last.gap = STACK$1.iconGap;
      break;
    }
  }
  for (const it of items) {
    if (it.kind === "kicker" && it.label) {
      it.w = m.width(it.label, { family: sans, weight: FIXED$1.kicker.weight, size: FIXED$1.kicker.size }) + FIXED$1.kicker.tracking * Math.max(0, Array.from(it.label).length - 1);
    }
    if (it.kind === "attribution" && it.label) {
      it.w = Math.min(CONTENT_W, m.width(it.label, { family: sans, weight: FIXED$1.attribution.weight, size: FIXED$1.attribution.size }));
    }
  }
  const stack = fitStack(items, frameFrom(top), m);
  centerStack(stack, slide.type === "cover" ? top : ROWS.stackTopCard, onPhoto2);
  if (opts.center) {
    for (const p of stack.placed) if (p.item.kind !== "code") p.x = SAFE.left + (CONTENT_W - p.w) / 2;
  }
  const header = layoutHeader(input, sans, mono, boxes);
  const footer = layoutFooter(input, sans, mono, boxes, true);
  boxes.push(...stackBoxes(stack));
  warnings.push(...stackWarnings(slide, stack));
  const icon = stack.placed.some((p) => p.item.kind === "icon") ? input.icon : null;
  return {
    slide,
    deck,
    variant: v,
    surface,
    surfaceName: name,
    onPhoto: onPhoto2,
    stack,
    icon,
    ctaLabel: cta,
    header,
    footer,
    boxes,
    warnings,
    ...opts.center ? { center: true } : {}
  };
}
const BLOB = {
  points: 7,
  angleJitterDeg: 10,
  radiusJitter: 0.18,
  tension: 0.5,
  a: { cx: 1040, cy: 1840, spread: 30, rMin: 300, rMax: 380, rMinBig: 420, rMaxBig: 480 },
  b: { cx: 1070, cyMin: 260, cyMax: 420, rMin: 200, rMax: 260, chance: 0.5 }
};
function blobPoints(rng, cx, cy, r) {
  const pts = [];
  const n = BLOB.points;
  const start = rng() * Math.PI * 2;
  for (let i = 0; i < n; i++) {
    const jitter = between(rng, -1, 1) * BLOB.angleJitterDeg * Math.PI / 180;
    const a = start + i / n * Math.PI * 2 + jitter;
    const rr = r * (1 + between(rng, -1, 1) * BLOB.radiusJitter);
    pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
  }
  return pts;
}
function traceBlob(ctx, pts, tension = BLOB.tension) {
  const n = pts.length;
  const p = (i) => pts[(i % n + n) % n];
  const k = tension * 2 / 3;
  ctx.beginPath();
  ctx.moveTo(p(0).x, p(0).y);
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    const c1 = { x: p1.x + (p2.x - p0.x) * k / 2, y: p1.y + (p2.y - p0.y) * k / 2 };
    const c2 = { x: p2.x - (p3.x - p1.x) * k / 2, y: p2.y - (p3.y - p1.y) * k / 2 };
    ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
  }
  ctx.closePath();
}
function drawBlobs(ctx, rng, color, big) {
  const A = BLOB.a;
  const ax = A.cx + between(rng, -30, A.spread);
  const ay = A.cy + between(rng, -30, A.spread);
  const ar = big ? between(rng, A.rMinBig, A.rMaxBig) : between(rng, A.rMin, A.rMax);
  const showB = big || rng() < BLOB.b.chance;
  const B = BLOB.b;
  const by = between(rng, B.cyMin, B.cyMax);
  const br = between(rng, B.rMin, B.rMax);
  ctx.fillStyle = color;
  traceBlob(ctx, blobPoints(rng, ax, ay, ar));
  ctx.fill();
  if (showB) {
    traceBlob(ctx, blobPoints(rng, B.cx, by, br));
    ctx.fill();
  }
}
function merge(tokens) {
  const out = [];
  for (const t2 of tokens) {
    if (!t2.text) continue;
    const last = out[out.length - 1];
    if (last && last.kind === t2.kind) last.text += t2.text;
    else out.push({ ...t2 });
  }
  return out;
}
function readString(s, i, quote) {
  let j = i + quote.length;
  while (j < s.length) {
    if (s[j] === "\\" && quote !== "'") {
      j += 2;
      continue;
    }
    if (s.startsWith(quote, j)) return j + quote.length;
    j++;
  }
  return s.length;
}
const SUBCOMMAND_TOOLS = /* @__PURE__ */ new Set(["git", "docker", "npm", "pnpm", "yarn", "kubectl", "apt", "brew", "pip"]);
const OPERATORS = ["&&", "||", ">>", "|", ";", ">"];
function tokenizeBash(line, continuation = false) {
  const out = [];
  let i = 0;
  let wordIndex = continuation ? 2 : 0;
  let command = "";
  while (i < line.length) {
    const c = line[i];
    if (c === " " || c === "	") {
      let j2 = i;
      while (j2 < line.length && (line[j2] === " " || line[j2] === "	")) j2++;
      out.push({ text: line.slice(i, j2), kind: "text" });
      i = j2;
      continue;
    }
    if (c === "#" && (i === 0 || /\s/.test(line[i - 1]))) {
      out.push({ text: line.slice(i), kind: "comment" });
      break;
    }
    if (c === '"' || c === "'") {
      const end = readString(line, i, c);
      out.push({ text: line.slice(i, end), kind: "string" });
      i = end;
      wordIndex++;
      continue;
    }
    if (c === "$") {
      const m = /^\$(\{[^}]*\}?|[A-Za-z_][A-Za-z0-9_]*|[0-9@#?*!$-])/.exec(line.slice(i));
      if (m) {
        out.push({ text: m[0], kind: "flag" });
        i += m[0].length;
        continue;
      }
    }
    const op = OPERATORS.find((o) => line.startsWith(o, i));
    if (op) {
      out.push({ text: op, kind: "punct" });
      i += op.length;
      if (op !== ">" && op !== ">>") {
        wordIndex = 0;
        command = "";
      }
      continue;
    }
    if (c === "\\" && i === line.trimEnd().length - 1) {
      out.push({ text: line.slice(i), kind: "punct" });
      break;
    }
    let j = i;
    while (j < line.length && !/[\s"'|;&>$]/.test(line[j])) j++;
    if (j === i) j = i + 1;
    const word = line.slice(i, j);
    let kind = "text";
    if (word.startsWith("-")) kind = "flag";
    else if (wordIndex === 0) {
      kind = "command";
      command = word;
    } else if (wordIndex === 1 && SUBCOMMAND_TOOLS.has(command)) kind = "subcommand";
    else if (/^\d+(\.\d+)?$/.test(word)) kind = "number";
    out.push({ text: word, kind });
    wordIndex++;
    i = j;
  }
  return merge(out);
}
function tokenizeCLike(line, rules) {
  const out = [];
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);
    const lc = rules.lineComment.find((p) => rest.startsWith(p));
    if (lc) {
      out.push({ text: rest, kind: "comment" });
      break;
    }
    if (rules.blockComment && rest.startsWith(rules.blockComment[0])) {
      const close = line.indexOf(rules.blockComment[1], i + 2);
      const end = close < 0 ? line.length : close + rules.blockComment[1].length;
      out.push({ text: line.slice(i, end), kind: "comment" });
      i = end;
      continue;
    }
    const q = rules.quotes.find((p) => rest.startsWith(p));
    if (q) {
      const end = readString(line, i, q);
      out.push({ text: line.slice(i, end), kind: "string" });
      i = end;
      continue;
    }
    const num = /^(0x[0-9a-fA-F]+|\d+(\.\d+)?)/.exec(rest);
    if (num && (i === 0 || !/[A-Za-z_]/.test(line[i - 1]))) {
      out.push({ text: num[0], kind: "number" });
      i += num[0].length;
      continue;
    }
    const id = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(rest);
    if (id) {
      const w = id[0];
      const key = rules.caseInsensitive ? w.toUpperCase() : w;
      let kind = "text";
      if (rules.keywords.has(key)) kind = "keyword";
      else if (rules.fnCalls && /^\s*\(/.test(line.slice(i + w.length))) kind = "fn";
      out.push({ text: w, kind });
      i += w.length;
      continue;
    }
    const c = line[i];
    out.push({ text: c, kind: /\s/.test(c) ? "text" : "punct" });
    i++;
  }
  return merge(out);
}
const KEYWORDS$2 = new Set(
  "const let var function return if else for while import from export class new await async try catch throw".split(" ")
);
function tokenizeJs(line) {
  return tokenizeCLike(line, {
    keywords: KEYWORDS$2,
    lineComment: ["//"],
    blockComment: ["/*", "*/"],
    quotes: ["`", '"', "'"],
    fnCalls: true
  });
}
const KEYWORDS$1 = new Set(
  "def class return if elif else for while import from as with try except raise lambda None True False and or not in is pass".split(" ")
);
function tokenizePy(line) {
  return tokenizeCLike(line, {
    keywords: KEYWORDS$1,
    lineComment: ["#"],
    quotes: ['"""', "'''", '"', "'"],
    fnCalls: true
  });
}
const KEYWORDS = new Set(
  "SELECT FROM WHERE JOIN LEFT RIGHT INNER ON GROUP BY ORDER HAVING LIMIT INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE INDEX AS AND OR NOT NULL IS IN LIKE DISTINCT COUNT SUM AVG".split(" ")
);
function tokenizeSql(line) {
  return tokenizeCLike(line, {
    keywords: KEYWORDS,
    caseInsensitive: true,
    lineComment: ["--"],
    quotes: ["'"],
    fnCalls: false
  });
}
function highlightLine(line, lang) {
  const prompt = line.prompt ? [{ text: PROMPT, kind: "prompt" }] : [];
  const l = lang.toLowerCase();
  let body;
  if (isShell(l)) body = tokenizeBash(line.text, line.continuation);
  else if (["js", "ts", "javascript", "typescript", "jsx", "tsx"].includes(l)) body = tokenizeJs(line.text);
  else if (l === "py" || l === "python") body = tokenizePy(line.text);
  else if (l === "sql") body = tokenizeSql(line.text);
  else body = [{ text: line.text, kind: "text" }];
  return [...prompt, ...body];
}
const PHOTO_SHADOW = { color: "rgba(0,0,0,0.35)", blur: 24, offsetX: 0, offsetY: 2 };
function setShadow(ctx, on) {
  ctx.shadowColor = on ? PHOTO_SHADOW.color : "transparent";
  ctx.shadowBlur = on ? PHOTO_SHADOW.blur : 0;
  ctx.shadowOffsetX = on ? PHOTO_SHADOW.offsetX : 0;
  ctx.shadowOffsetY = on ? PHOTO_SHADOW.offsetY : 0;
}
function setFont(ctx, f) {
  ctx.font = fontString(f);
  ctx.textBaseline = "alphabetic";
}
function drawTracked(ctx, text, x, y, trackingPx) {
  let cx = x;
  const chars = Array.from(text);
  chars.forEach((ch, i) => {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + (i < chars.length - 1 ? trackingPx : 0);
  });
  return cx - x;
}
const JOINABLE = /[=!<>\-|&+*:./\\~^%#?@$_]{2}/;
function fillUnjoined(ctx, text, x, y) {
  if (!JOINABLE.test(text)) {
    ctx.fillText(text, x, y);
    return;
  }
  let cx = x;
  for (const ch of Array.from(text)) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width;
  }
}
function drawWrapped(ctx, lines, x0, top, size, lh, style2, colors, centerW) {
  const ys = baselines(lines, top, size, lh);
  const mono = monoFont(style2);
  lines.forEach((line, i) => {
    const y = ys[i];
    const x = centerW === void 0 ? x0 : x0 + (centerW - line.width) / 2;
    for (const run of line.runs) {
      if (run.style === "code") {
        const shadow = ctx.shadowColor;
        ctx.save();
        ctx.shadowColor = "transparent";
        ctx.fillStyle = colors.codeBg;
        ctx.beginPath();
        const h = mono.size + PILL.padY * 2;
        ctx.roundRect(x + run.x, y - mono.size * 0.78 - PILL.padY, run.w, h, PILL.radius);
        ctx.fill();
        ctx.restore();
        ctx.shadowColor = shadow;
        setFont(ctx, mono);
        ctx.fillStyle = colors.codeText;
        fillUnjoined(ctx, run.text, x + run.x + PILL.padX, y);
        continue;
      }
      setFont(ctx, style2.font);
      ctx.fillStyle = run.style === "accent" ? colors.accent : colors.text;
      if (isMonoFamily(style2.font.family)) fillUnjoined(ctx, run.text, x + run.x, y);
      else ctx.fillText(run.text, x + run.x, y);
    }
  });
}
function truncateToWidth(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  const chars = Array.from(text);
  while (chars.length && ctx.measureText(chars.join("") + "…").width > maxWidth) chars.pop();
  return chars.join("") + "…";
}
const CODE_CHROME = {
  border: 2,
  dotR: 9,
  dotX: [36, 64, 92],
  labelSize: 24,
  labelRight: 28,
  fade: 48
};
const TOKEN_COLOR = {
  text: "text",
  prompt: "prompt",
  command: "command",
  subcommand: "subcommand",
  flag: "flag",
  string: "string",
  comment: "comment",
  number: "number",
  keyword: "keyword",
  fn: "fn",
  punct: "punct"
};
function drawCodeBlock(ctx, p, theme, mono, radius, width) {
  if (p.item.kind !== "code") return;
  const { spec, lines, lang } = p.item;
  const { x, y, h, size } = p;
  ctx.save();
  ctx.shadowColor = "transparent";
  ctx.beginPath();
  ctx.roundRect(x, y, width, h, radius);
  ctx.fillStyle = theme.panel;
  ctx.fill();
  ctx.lineWidth = CODE_CHROME.border;
  ctx.strokeStyle = theme.border;
  ctx.beginPath();
  const b = CODE_CHROME.border / 2;
  ctx.roundRect(x + b, y + b, width - 2 * b, h - 2 * b, radius - b);
  ctx.stroke();
  if (theme.dots && spec.titleBar > 0) {
    const cy = y + spec.titleBar / 2;
    theme.dots.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x + CODE_CHROME.dotX[i], cy, CODE_CHROME.dotR, 0, Math.PI * 2);
      ctx.fill();
    });
    if (lang) {
      setFont(ctx, { family: mono, weight: 500, size: CODE_CHROME.labelSize });
      ctx.fillStyle = theme.comment;
      ctx.textAlign = "right";
      ctx.fillText(lang, x + width - CODE_CHROME.labelRight, cy + CODE_CHROME.labelSize * 0.35);
      ctx.textAlign = "left";
    }
    ctx.fillStyle = theme.border;
    ctx.fillRect(x, y + spec.titleBar - CODE_CHROME.border, width, CODE_CHROME.border);
  }
  const left = x + spec.padX;
  const right = x + width - spec.padX;
  const top = y + spec.titleBar + spec.padTop;
  ctx.beginPath();
  ctx.rect(left, y, right - left, h);
  ctx.clip();
  const lineBox = size * spec.lh;
  lines.forEach((line, k) => {
    const baseline = top + k * lineBox + lineBox / 2 + size * 0.35;
    let cx = left;
    for (const tok of highlightLine(line, lang)) {
      const weight = tok.kind === "command" ? 600 : spec.weight;
      setFont(ctx, { family: mono, weight, size });
      ctx.fillStyle = theme[TOKEN_COLOR[tok.kind]];
      fillUnjoined(ctx, tok.text, cx, baseline);
      cx += ctx.measureText(tok.text).width;
    }
  });
  if (p.codeFits === false) {
    const g = ctx.createLinearGradient(right - CODE_CHROME.fade, 0, right, 0);
    g.addColorStop(0, withAlpha(theme.panel, 0));
    g.addColorStop(1, theme.panel);
    ctx.fillStyle = g;
    ctx.fillRect(right - CODE_CHROME.fade, y, CODE_CHROME.fade, h);
  }
  ctx.restore();
}
const ICON_PATHS = {
  // ---- editorial pool ----
  "heart-spark": "M11 20.2C7.8 17.8 4.4 15.1 4.4 11.6c0-2 1.5-3.6 3.5-3.6 1.3 0 2.4.7 3.1 1.8.7-1.1 1.8-1.8 3.1-1.8 1.9 0 3.4 1.6 3.4 3.6 0 3.5-3.3 6.2-6.5 8.6zM18.6 3.2l-.9 2.4M21.4 6.1l-2.3.9M15.2 2.6l.4 2.4",
  mountain: "M2.5 19.5l6.3-10.4 3.7 5.5 2.5-3.5 6.5 8.4z M6.6 12.6l1.6 1.2 1.8-1.4",
  "shield-heart": "M12 3.2l7 2.6v5.3c0 4.7-3 8-7 9.7-4-1.7-7-5-7-9.7V5.8zM12 15.4c-1.9-1.4-3.3-2.7-3.3-4.2 0-1 .8-1.8 1.8-1.8.6 0 1.2.3 1.5.9.3-.6.9-.9 1.5-.9 1 0 1.8.8 1.8 1.8 0 1.5-1.4 2.8-3.3 4.2z",
  smile: "M12 3.4a8.6 8.6 0 1 0 .1 0z M8.2 13.7c1 1.6 2.4 2.4 3.9 2.4s2.8-.9 3.7-2.5 M9 9.4v1M15 9.4v1",
  leaf: "M5.2 19.2C4.4 11.4 8.7 5 19.6 4.4c.3 9.6-5.2 15.2-13 14.8z M5.2 19.2c3.3-4.7 6.5-7.8 10.4-10.4",
  home: "M3.8 10.8L12 4l8.2 6.8 M6 9.2v10.3h12V9.2 M10 19.5v-5.3h4v5.3",
  chat: "M6.4 4.2h11.2c1.4 0 2.5 1.1 2.5 2.5v6.9c0 1.4-1.1 2.5-2.5 2.5h-6.4l-4.7 3.7v-3.7h-.1c-1.4 0-2.5-1.1-2.5-2.5V6.7c0-1.4 1.1-2.5 2.5-2.5zM8.6 10.2h.1M12 10.2h.1M15.4 10.2h.1",
  coffee: "M4.8 9.2h11.4v5.2c0 2.8-2.3 5.1-5.1 5.1h-1.2c-2.8 0-5.1-2.3-5.1-5.1z M16.2 10.6h1.4a2.4 2.4 0 0 1 0 4.8h-1.5 M8.6 3.6c-.7 1 .7 1.7 0 2.9M12.2 3.6c-.7 1 .7 1.7 0 2.9",
  sun: "M12 7.9a4.1 4.1 0 1 0 .1 0z M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M5.4 18.6l1.5-1.5M17.1 6.9l1.5-1.5",
  moon: "M19.4 14.6A7.9 7.9 0 0 1 9.4 4.6a8.1 8.1 0 1 0 10 10z M17.2 3.8v2.6M15.9 5.1h2.6",
  star: "M12 3.4l2.6 5.4 5.8.8-4.3 4 1.1 5.8L12 16.6l-5.2 2.8 1.1-5.8-4.3-4 5.8-.8z",
  book: "M12 6.4C10.2 4.9 7.6 4.4 4 4.7v13.5c3.6-.3 6.2.2 8 1.7 1.8-1.5 4.4-2 8-1.7V4.7c-3.6-.3-6.2.2-8 1.7z M12 6.4v13.5",
  plane: "M3.4 11.3L20.6 4l-6.3 16.3-3.2-6.7z M11.1 13.6L20.6 4",
  gift: "M4.4 9.4h15.2v3.1H4.4z M5.9 12.5v7.1h12.2v-7.1 M12 9.4v10.2M12 9.4c-1.5-3.5-4.6-3.9-4.7-1.9-.1 1.6 2.5 1.9 4.7 1.9s4.8-.3 4.7-1.9c-.1-2-3.2-1.6-4.7 1.9",
  "map-pin": "M12 21.1c-3.9-4.5-6.6-8-6.6-11.3a6.6 6.6 0 0 1 13.2 0c0 3.3-2.7 6.8-6.6 11.3z M12 7.3a2.5 2.5 0 1 0 .1 0z",
  music: "M9 17.6V5.7l10-2.2v12 M9 17.6a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z M19 15.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z",
  flower: "M12 13.4c-3.1-.1-4.7-2.4-4-4.4 1.6-.4 3.6 1 4 4.4z M12 13.4c3.1-.1 4.7-2.4 4-4.4-1.6-.4-3.6 1-4 4.4zM12 13.4c-1.7-2.6-1.4-5.7 0-7.1 1.4 1.4 1.7 4.5 0 7.1z M12 13.4v7.2c.2-1.5 2.4-2.6 4.4-2.5",
  umbrella: "M3.4 12.2a8.6 8.6 0 0 1 17.2 0z M12 12.2v6.4a2 2 0 0 1-4 .2 M12 3.6v-1",
  key: "M7.6 12.2a3.7 3.7 0 1 0 .1 0z M10.4 13.2l9.1-9.1 M16.4 7.2l2.3 2.3M14.2 9.4l1.7 1.7",
  heart: "M12 19.6C8.2 16.7 4 13.5 4 9.3 4 6.9 5.9 5 8.1 5c1.6 0 3 .9 3.9 2.3C12.9 5.9 14.3 5 15.9 5 18.1 5 20 6.9 20 9.3c0 4.2-4.2 7.4-8 10.3z",
  // ---- dev pool ----
  terminal: "M5 4.6h14c.8 0 1.5.7 1.5 1.5v11.8c0 .8-.7 1.5-1.5 1.5H5c-.8 0-1.5-.7-1.5-1.5V6.1c0-.8.7-1.5 1.5-1.5z M7.2 9.4l3 2.6-3 2.6 M12.4 15h4.6",
  code: "M8.4 7L3.4 12l5 5 M15.6 7l5 5-5 5 M13.6 4.4l-3.2 15.2",
  "git-branch": "M7 15.4a2.2 2.2 0 1 0 .1 0z M17 4.4a2.2 2.2 0 1 0 .1 0z M7 3.4v12 M17 8.8c0 4.7-10 3.3-10 6.6",
  bug: "M12 7.6c2.8 0 4.5 2.4 4.5 5.8S14.8 19.6 12 19.6s-4.5-2.8-4.5-6.2S9.2 7.6 12 7.6z M9.4 8.4c.1-1.9 1.2-3.4 2.6-3.4s2.5 1.5 2.6 3.4M3.9 13h3.6M16.5 13h3.6M4.9 8.4l2.9 2M19.1 8.4l-2.9 2M4.9 18.1l2.9-1.8M19.1 18.1l-2.9-1.8 M12 10.6v9",
  rocket: "M12 2.9c3.3 2.4 4.6 6.1 3.9 10.6H8.1C7.4 9 8.7 5.3 12 2.9z M8.1 13.5l-2.7 3.1 3.3.4 M15.9 13.5l2.7 3.1-3.3.4M10.4 17c.3 2 .9 3.1 1.6 4 .7-.9 1.3-2 1.6-4 M12 8.3v.1",
  "check-circle": "M12 3.4a8.6 8.6 0 1 0 .1 0z M8 12.4l2.7 2.7 5.4-5.7",
  alert: "M10.7 5.1a1.5 1.5 0 0 1 2.6 0l7.3 12.7a1.5 1.5 0 0 1-1.3 2.2H4.7a1.5 1.5 0 0 1-1.3-2.2z M12 9.4v4.6 M12 17h.1",
  folder: "M3.4 7c0-1.1.9-2 2-2h4.1l2 2.5h7.1c1.1 0 2 .9 2 2v8.1c0 1.1-.9 2-2 2H5.4c-1.1 0-2-.9-2-2z",
  database: "M5 6c0-1.4 3.1-2.6 7-2.6s7 1.2 7 2.6-3.1 2.5-7 2.5S5 7.4 5 6z M5 6v12.1c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6 M5 12.1c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5",
  cpu: "M7 6h10c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1z M10 10h4v4h-4zM9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3",
  lightbulb: "M9 17.6h6 M10.1 20.6h3.8 M9 17.6c0-2.3-3-3.7-3-7.6a6 6 0 0 1 12 0c0 3.9-3 5.3-3 7.6",
  clock: "M12 3.4a8.6 8.6 0 1 0 .1 0z M12 7.4V12l3.1 2.1",
  // ---- UI-on-slide ----
  "arrow-right": "M3.8 12h15.4 M13.6 6.4l5.6 5.6-5.6 5.6",
  "circle-arrow": "M12 3.4a8.6 8.6 0 1 0 .1 0z M7.8 12h7.8 M12.6 8.9l3.1 3.1-3.1 3.1",
  bookmark: "M6.4 3.4h11.2v17.2L12 16.4l-5.6 4.2z",
  // Lexicon compare slides: the "wrong" box.
  "x-circle": "M12 3.4a8.6 8.6 0 1 0 .1 0z M8.9 8.9l6.2 6.2 M15.1 8.9l-6.2 6.2"
};
const cache = /* @__PURE__ */ new Map();
function pathFor(name) {
  let p = cache.get(name);
  if (!p) {
    p = new Path2D(ICON_PATHS[name]);
    cache.set(name, p);
  }
  return p;
}
function drawIcon(ctx, name, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(pathFor(name));
  ctx.restore();
}
function drawHeader(ctx, L, handleColor, rightColor) {
  const { header } = L;
  setShadow(ctx, L.onPhoto);
  if (header.handle) {
    setFont(ctx, header.handleFont);
    ctx.fillStyle = handleColor;
    ctx.fillText(header.handle, SAFE.left, ROWS.headerBaseline);
  }
  const r = header.right;
  ctx.fillStyle = rightColor;
  if (r.kind === "rule") {
    ctx.fillRect(r.x1, r.y, r.x2 - r.x1, r.h);
  } else {
    setFont(ctx, r.font);
    ctx.textAlign = "right";
    ctx.fillText(r.text, SAFE.right, ROWS.headerBaseline);
    ctx.textAlign = "left";
  }
}
function drawFooter(ctx, L, swipeColor, counterColor) {
  const y = ROWS.footerBaseline;
  setShadow(ctx, L.onPhoto);
  const sw = L.footer.swipe;
  if (sw) {
    let x = SAFE.left;
    const iconTop = (size) => y - sw.font.size * 0.36 - size / 2;
    if (sw.leadIcon) {
      drawIcon(ctx, sw.leadIcon, x, iconTop(CHROME.circleArrowSize), CHROME.circleArrowSize, swipeColor);
      x += CHROME.circleArrowSize + CHROME.circleArrowGap;
    }
    setFont(ctx, sw.font);
    ctx.fillStyle = swipeColor;
    ctx.fillText(sw.text, x, y);
    x += ctx.measureText(sw.text).width;
    if (sw.arrow) drawIcon(ctx, "arrow-right", x + CHROME.arrowGap, iconTop(CHROME.arrowSize), CHROME.arrowSize, swipeColor);
  }
  const c = L.footer.counter;
  if (!c) return;
  setFont(ctx, c.font);
  ctx.fillStyle = counterColor;
  ctx.textAlign = "right";
  ctx.fillText(c.text, SAFE.right, y);
  ctx.textAlign = "left";
}
function drawCta(ctx, p, label2, s, sans) {
  const c = CHROME.cta;
  ctx.save();
  setShadow(ctx, false);
  ctx.fillStyle = s.badgeBg;
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.w, c.h, c.radius);
  ctx.fill();
  const cy = p.y + c.h / 2;
  drawIcon(ctx, "bookmark", p.x + c.padX, cy - c.icon / 2, c.icon, s.badgeInk);
  setFont(ctx, { family: sans, weight: c.weight, size: c.size });
  ctx.fillStyle = s.badgeInk;
  ctx.fillText(label2, p.x + c.padX + c.icon + c.gap, cy + c.size * 0.35);
  ctx.restore();
}
function drawTextBlock(ctx, p, s, onPhoto2, center = false) {
  if (p.item.kind !== "text" || !p.wrap) return;
  const it = p.item;
  setShadow(ctx, onPhoto2);
  drawWrapped(
    ctx,
    p.wrap.lines,
    p.x,
    p.y,
    p.size,
    it.spec.lh,
    { font: { family: it.spec.family, weight: it.spec.weight, size: p.size }, mono: it.spec.mono },
    { text: s[it.tone], accent: s.accent, codeBg: s.inlineCodeBg, codeText: s.ink },
    center ? p.w : void 0
  );
}
function clipToStack(ctx) {
  ctx.beginPath();
  ctx.rect(0, 0, CANVAS.w, ROWS.stackLimit);
  ctx.clip();
}
const FIELD = {
  football: { w: 68, d: 52.5 },
  futsal: { w: 20, d: 20 },
  badminton: { w: 6.1, d: 6.7 },
  volleyball: { w: 9, d: 9 },
  basketball: { w: 15, d: 14 },
  tennis: { w: 10.97, d: 11.885 }
};
function drawDiagram(ctx, d, box, c, f) {
  const D = DIAGRAM;
  setShadow(ctx, false);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(box.x, box.y, box.w, box.h, D.radius);
  ctx.fillStyle = c.turf;
  ctx.fill();
  ctx.clip();
  const dims = FIELD[d.field];
  const innerW = box.w - D.pad * 2;
  const innerH = box.h - D.pad * 2;
  const k = Math.min(innerW / dims.w, innerH / dims.d);
  const field = { w: dims.w * k, h: dims.d * k, x: 0, y: 0 };
  field.x = box.x + (box.w - field.w) / 2;
  field.y = box.y + D.pad;
  const mx = (m) => field.x + m * k;
  const my = (m) => field.y + m * k;
  ctx.strokeStyle = withAlpha(c.line, D.line.alpha);
  ctx.lineWidth = D.line.width;
  const rect = (x, y, w, h) => ctx.strokeRect(mx(x), my(y), w * k, h * k);
  const seg = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(mx(x1), my(y1));
    ctx.lineTo(mx(x2), my(y2));
    ctx.stroke();
  };
  const arc = (cx2, cy, r, a0, a1) => {
    ctx.beginPath();
    ctx.arc(mx(cx2), my(cy), r * k, a0, a1);
    ctx.stroke();
  };
  const top = (x1, x2) => {
    ctx.save();
    ctx.strokeStyle = c.line;
    ctx.lineWidth = D.line.goal;
    seg(x1, 0, x2, 0);
    ctx.restore();
  };
  const W = dims.w;
  const cx = W / 2;
  rect(0, 0, W, dims.d);
  switch (d.field) {
    case "football":
      rect(cx - 20.16, 0, 40.32, 16.5);
      rect(cx - 9.16, 0, 18.32, 5.5);
      arc(cx, 11, 9.15, Math.asin(5.5 / 9.15), Math.PI - Math.asin(5.5 / 9.15));
      arc(cx, dims.d, 9.15, Math.PI, Math.PI * 2);
      top(cx - 3.66, cx + 3.66);
      break;
    case "futsal":
      arc(cx - 1.58, 0, 6, Math.PI / 2, Math.PI);
      arc(cx + 1.58, 0, 6, 0, Math.PI / 2);
      seg(cx - 1.58, 6, cx + 1.58, 6);
      arc(cx, dims.d, 3, Math.PI, Math.PI * 2);
      top(cx - 1.5, cx + 1.5);
      break;
    case "badminton":
      seg(0.46, 0, 0.46, dims.d);
      seg(W - 0.46, 0, W - 0.46, dims.d);
      seg(0, 1.98, W, 1.98);
      seg(cx, 1.98, cx, dims.d);
      seg(0, dims.d - 0.76, W, dims.d - 0.76);
      top(0, W);
      break;
    case "volleyball":
      seg(0, 3, W, 3);
      top(0, W);
      break;
    case "basketball": {
      const bx = 1.575;
      rect(cx - 2.45, 0, 4.9, 5.8);
      arc(cx, 5.8, 1.8, 0, Math.PI);
      arc(cx, bx, 1.25, 0, Math.PI);
      const side = 0.9;
      const dy = Math.sqrt(6.75 * 6.75 - (cx - side) * (cx - side));
      seg(side, 0, side, bx + dy);
      seg(W - side, 0, W - side, bx + dy);
      arc(cx, bx, 6.75, Math.atan2(dy, cx - side), Math.PI - Math.atan2(dy, cx - side));
      arc(cx, dims.d, 1.8, Math.PI, Math.PI * 2);
      top(cx - 0.9, cx + 0.9);
      break;
    }
    case "tennis":
      seg(1.37, 0, 1.37, dims.d);
      seg(W - 1.37, 0, W - 1.37, dims.d);
      seg(1.37, 6.4, W - 1.37, 6.4);
      seg(cx, 0, cx, 6.4);
      seg(cx, dims.d - 0.2, cx, dims.d);
      top(0, W);
      break;
  }
  const px = (p) => [field.x + p.x / 100 * field.w, field.y + p.y / 100 * field.h];
  const order = (m) => ({ zone: 0, line: 1, arrow: 2, dot: 3, ball: 4, label: 5 })[m.kind];
  for (const m of [...d.marks].sort((a, b) => order(a) - order(b))) drawMark(ctx, m, px, field, c, f);
  ctx.restore();
}
function drawMark(ctx, m, px, field, c, f) {
  const D = DIAGRAM;
  const label2 = (text, x, y, color) => {
    if (!text) return;
    setFont(ctx, { family: f.sans, weight: D.label.weight, size: D.label.size });
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  };
  switch (m.kind) {
    case "zone": {
      const [x1, y1] = px(m.from);
      const [x2, y2] = px(m.to);
      ctx.fillStyle = withAlpha(c.accent, D.zoneAlpha);
      ctx.fillRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
      break;
    }
    case "line": {
      const y = field.y + m.y / 100 * field.h;
      ctx.save();
      ctx.setLineDash(D.offside.dash);
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = D.offside.width;
      ctx.beginPath();
      ctx.moveTo(field.x, y);
      ctx.lineTo(field.x + field.w, y);
      ctx.stroke();
      ctx.restore();
      label2(m.label, field.x + D.label.gap, y + D.label.size + D.label.gap / 2, c.accent);
      break;
    }
    case "arrow": {
      const [x1, y1] = px(m.from);
      const [x2, y2] = px(m.to);
      const len = Math.hypot(x2 - x1, y2 - y1);
      if (len < 1) break;
      const ux = (x2 - x1) / len;
      const uy = (y2 - y1) / len;
      const trim = D.dot.r + D.arrow.width;
      const sx = x1 + ux * trim;
      const sy = y1 + uy * trim;
      const ex = x2 - ux * trim;
      const ey = y2 - uy * trim;
      ctx.save();
      if (m.style === "pass") ctx.setLineDash(D.arrow.dash);
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = D.arrow.width;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex - ux * D.arrow.head * 0.6, ey - uy * D.arrow.head * 0.6);
      ctx.stroke();
      ctx.restore();
      const h = D.arrow.head;
      ctx.fillStyle = c.ink;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - ux * h - uy * h * 0.55, ey - uy * h + ux * h * 0.55);
      ctx.lineTo(ex - ux * h + uy * h * 0.55, ey - uy * h - ux * h * 0.55);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "dot": {
      const [x, y] = px(m.at);
      const fill = m.team === "att" ? c.att : m.team === "def" ? c.def : c.ink;
      ctx.beginPath();
      ctx.arc(x, y, D.dot.r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = D.dot.stroke;
      ctx.strokeStyle = c.turf;
      ctx.stroke();
      if (m.team === "player") {
        setFont(ctx, { family: f.display, weight: f.displayWeight, size: D.dot.label });
        ctx.fillStyle = c.bg;
        ctx.textAlign = "center";
        ctx.fillText(m.label, x, y + D.dot.label * 0.36);
        ctx.textAlign = "left";
      } else {
        const right = x + D.dot.r + D.label.gap;
        setFont(ctx, { family: f.sans, weight: D.label.weight, size: D.label.size });
        const w = ctx.measureText(m.label).width;
        const lx = right + w > field.x + field.w ? x - D.dot.r - D.label.gap - w : right;
        label2(m.label, lx, y + D.label.size * 0.36, c.ink);
      }
      break;
    }
    case "ball": {
      const [x, y] = px(m.at);
      ctx.beginPath();
      ctx.arc(x, y, D.ball.r, 0, Math.PI * 2);
      ctx.fillStyle = c.ink;
      ctx.fill();
      ctx.lineWidth = D.ball.ring;
      ctx.strokeStyle = c.bg;
      ctx.stroke();
      break;
    }
    case "label": {
      const [x, y] = px(m.at);
      label2(m.text, x, y, c.ink);
      break;
    }
  }
}
function drawStampItem(ctx, p, L) {
  const { slide, variant: v, surface: s } = L;
  if (p.item.kind === "verdict") {
    const color = toneColor(v, s, slide.attrs.tone);
    const b = VERDICT.border;
    setShadow(ctx, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = b;
    ctx.beginPath();
    ctx.roundRect(p.x + b / 2, p.y + b / 2, p.w - b, p.h - b, VERDICT.radius);
    ctx.stroke();
    setShadow(ctx, L.onPhoto);
    setFont(ctx, verdictFont(v));
    ctx.fillStyle = color;
    ctx.fillText(p.item.label ?? "", p.x + b + VERDICT.padX, p.y + p.h / 2 + VERDICT.size * VERDICT.capHeight / 2);
    return true;
  }
  if (p.item.kind === "diagram" && slide.diagram) {
    drawDiagram(ctx, slide.diagram, p, {
      turf: s.inlineCodeBg,
      line: s.ink,
      att: s.accent,
      def: toneColor(v, s, "bad"),
      ink: s.ink,
      bg: s.bg,
      accent: s.accent
    }, {
      sans: v.fonts.sans,
      display: displayFamily(v),
      displayWeight: v.headlineWeight ?? 700
    });
    return true;
  }
  return false;
}
const MARKER = { padX: 6, h: 0.62, rise: 0.5, radius: 6 };
const STRIKE = { w: 3, rise: 0.32 };
function drawText(ctx, e, onPhoto2) {
  if (e.highlight) {
    setShadow(ctx, false);
    ctx.fillStyle = e.highlight;
    const ys = baselines(e.lines, e.y, e.size, e.lh);
    e.lines.forEach((line, i) => {
      for (const r of line.runs) {
        if (r.style !== "accent") continue;
        ctx.beginPath();
        ctx.roundRect(e.x + r.x - MARKER.padX, ys[i] - e.size * MARKER.rise, r.w + MARKER.padX * 2, e.size * MARKER.h, MARKER.radius);
        ctx.fill();
      }
    });
  }
  setShadow(ctx, onPhoto2 && !e.highlight);
  drawWrapped(
    ctx,
    e.lines,
    e.x,
    e.y,
    e.size,
    e.lh,
    e.style,
    { text: e.color, accent: e.highlight ? e.color : e.accent, codeBg: "rgba(127,127,127,0.18)", codeText: e.color },
    e.centerW
  );
  if (e.strike) {
    setShadow(ctx, false);
    ctx.fillStyle = e.color;
    const ys = baselines(e.lines, e.y, e.size, e.lh);
    e.lines.forEach((line, i) => ctx.fillRect(e.x, ys[i] - e.size * STRIKE.rise - STRIKE.w / 2, line.width, STRIKE.w));
  }
}
function drawArabic(ctx, e, onPhoto2) {
  setShadow(ctx, onPhoto2);
  setFont(ctx, { family: e.family, weight: 400, size: e.size });
  ctx.direction = "rtl";
  e.lines.forEach((line, i) => {
    const last = i === e.lines.length - 1;
    const markW = e.mark && last ? e.mark.gap + e.mark.w : 0;
    const full = e.widths[i] + markW;
    const right = e.align === "center" ? e.x + (e.w + full) / 2 : e.x + e.w;
    const y = e.y + i * e.size * e.lh + e.size * e.baseline;
    ctx.textAlign = "right";
    ctx.fillStyle = e.color;
    ctx.fillText(line, right, y);
    if (e.mark && last) {
      ctx.textAlign = "left";
      ctx.fillStyle = e.mark.color;
      ctx.fillText(e.mark.text, right - full, y);
    }
  });
  ctx.direction = "ltr";
  ctx.textAlign = "left";
}
function drawStar(ctx, cx, cy, size, color, width) {
  setShadow(ctx, false);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = "miter";
  const r = size / 2;
  for (const turn of [0, Math.PI / 4]) {
    ctx.beginPath();
    for (let k = 0; k < 4; k++) {
      const a = turn + k * Math.PI / 2;
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }
}
function drawLex(ctx, L) {
  if (!L.lex) return;
  ctx.save();
  for (const e of L.lex.els) {
    switch (e.k) {
      case "text":
        drawText(ctx, e, L.onPhoto);
        break;
      case "label":
        setShadow(ctx, L.onPhoto);
        setFont(ctx, e.font);
        ctx.fillStyle = e.color;
        drawTracked(ctx, e.text, e.x, e.y + e.font.size * 1.3 * 0.78, e.tracking);
        break;
      case "pill":
        setShadow(ctx, false);
        ctx.strokeStyle = e.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(e.x + 1, e.y + 1, e.w - 2, e.h - 2, e.h / 2);
        ctx.stroke();
        setFont(ctx, e.font);
        ctx.fillStyle = e.color;
        drawTracked(ctx, e.text, e.x + e.padX, e.y + e.h / 2 + e.font.size * 0.36, e.tracking);
        break;
      case "badge":
        setShadow(ctx, false);
        ctx.fillStyle = e.bg;
        ctx.beginPath();
        ctx.roundRect(e.x, e.y, e.w, e.h, e.radius);
        ctx.fill();
        setFont(ctx, e.font);
        ctx.fillStyle = e.ink;
        ctx.textAlign = "center";
        ctx.fillText(e.text, e.x + e.w / 2, e.y + e.h / 2 + e.font.size * 0.36);
        ctx.textAlign = "left";
        break;
      case "rect":
        setShadow(ctx, false);
        ctx.fillStyle = e.fill;
        ctx.beginPath();
        if (e.radius) ctx.roundRect(e.x, e.y, e.w, e.h, e.radius);
        else ctx.rect(e.x, e.y, e.w, e.h);
        ctx.fill();
        break;
      case "frame":
        setShadow(ctx, false);
        ctx.strokeStyle = e.stroke;
        ctx.lineWidth = e.width;
        ctx.beginPath();
        ctx.roundRect(e.x + e.width / 2, e.y + e.width / 2, e.w - e.width, e.h - e.width, e.radius);
        ctx.stroke();
        break;
      case "clip":
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(e.x, e.y, e.w, e.h, e.radius);
        ctx.clip();
        break;
      case "unclip":
        ctx.restore();
        break;
      case "icon":
        setShadow(ctx, false);
        drawIcon(ctx, e.name, e.x, e.y, e.size, e.color);
        break;
      case "arabic":
        drawArabic(ctx, e, L.onPhoto);
        break;
      case "star":
        drawStar(ctx, e.cx, e.cy, e.size, e.color, e.width);
        break;
    }
  }
  ctx.restore();
}
function drawEditorial(ctx, L) {
  const { slide, deck, variant: v, surface: s, onPhoto: onPhoto2 } = L;
  const sans = v.fonts.sans;
  const serif = v.fonts.serif ?? sans;
  if (!onPhoto2 && v.deco.blobs) {
    const big = slide.type === "cover" || slide.type === "end";
    drawBlobs(ctx, slideRng(deck.slug, slide.index), s.blob, big);
  }
  if (L.lex) {
    drawHeader(ctx, L, s.body, s.muted);
    drawFooter(ctx, L, s.muted, s.muted);
    drawLex(ctx, L);
    return;
  }
  if (slide.type === "quote" && !L.center) {
    const q = FIXED$1.quoteMark;
    setShadow(ctx, false);
    setFont(ctx, { family: serif, weight: q.weight, size: q.size });
    ctx.fillStyle = withAlpha(s.accent, q.alpha);
    ctx.fillText("“", q.x, quoteMarkTop$1(L, q.top) + q.size * 0.72);
  }
  drawHeader(ctx, L, s.body, s.muted);
  drawFooter(ctx, L, s.muted, s.muted);
  ctx.save();
  if (L.stack.overflow) clipToStack(ctx);
  for (const p of L.stack.placed) {
    const it = p.item;
    switch (it.kind) {
      case "text":
        drawTextBlock(ctx, p, s, onPhoto2, L.center);
        break;
      case "badge": {
        const b = FIXED$1.badge;
        setShadow(ctx, false);
        ctx.fillStyle = s.badgeBg;
        ctx.beginPath();
        ctx.arc(p.x + b.d / 2, p.y + b.d / 2, b.d / 2, 0, Math.PI * 2);
        ctx.fill();
        setFont(ctx, { family: sans, weight: b.weight, size: b.digit });
        ctx.fillStyle = s.badgeInk;
        ctx.textAlign = "center";
        ctx.fillText(it.label ?? "", p.x + b.d / 2, p.y + b.d / 2 + b.digit * 0.36 + b.opticalY);
        ctx.textAlign = "left";
        break;
      }
      case "kicker": {
        const k = FIXED$1.kicker;
        setShadow(ctx, onPhoto2);
        setFont(ctx, { family: sans, weight: k.weight, size: k.size });
        ctx.fillStyle = s.accent;
        drawTracked(ctx, it.label ?? "", p.x, p.y + k.size * 0.92, k.tracking);
        break;
      }
      case "attribution": {
        const a = FIXED$1.attribution;
        setShadow(ctx, onPhoto2);
        setFont(ctx, { family: sans, weight: a.weight, size: a.size });
        ctx.fillStyle = s.muted;
        ctx.fillText(truncateToWidth(ctx, it.label ?? "", CONTENT_W), p.x, p.y + a.size * 0.92);
        break;
      }
      case "icon":
        if (L.icon) {
          setShadow(ctx, false);
          drawIcon(ctx, L.icon, p.x, p.y, FIXED$1.icon, s.icon);
        }
        break;
      case "code":
        drawCodeBlock(ctx, p, v.code, v.fonts.mono, FIXED$1.code.radius, CONTENT_W);
        break;
      case "cta":
        drawCta(ctx, p, it.label ?? "", s, sans);
        break;
      case "number":
        break;
      case "verdict":
      case "diagram":
        drawStampItem(ctx, p, L);
        break;
    }
  }
  ctx.restore();
}
function quoteMarkTop$1(L, designTop) {
  return (L.stack.placed[0]?.y ?? STACK$1.quoteTop) - (STACK$1.quoteTop - designTop);
}
const TYPE = {
  coverHeadline: { weight: 800, max: 116, min: 80, step: 4, lh: 1.05, maxLines: 5, widowFix: true },
  coverSubtitle: { weight: 400, max: 40, min: 32, step: 2, lh: 1.45, maxLines: 3 },
  cardHeadline: { weight: 700, max: 84, min: 60, step: 4, lh: 1.12, maxLines: 5, widowFix: true },
  codeHeadline: { weight: 700, max: 72, min: 56, step: 4, lh: 1.12, maxLines: 3, widowFix: true },
  // body min 30 → 32 for phone legibility (owner, Oct 2026).
  body: { weight: 400, max: 40, min: 32, step: 2, lh: 1.5, maxLines: 6 },
  note: { weight: 400, max: 32, min: 30, step: 2, lh: 1.45, maxLines: 3 },
  quote: { weight: 600, max: 68, min: 48, step: 4, lh: 1.2, maxLines: 7, widowFix: true },
  endHeadline: { weight: 800, max: 108, min: 76, step: 4, lh: 1.06, maxLines: 4, widowFix: true }
};
const SPORT_TYPE = {
  coverHeadline: { ...TYPE.coverHeadline, max: 136, min: 92 },
  cardHeadline: { ...TYPE.cardHeadline, max: 104, min: 72, lh: 1.02, maxLines: 6 },
  codeHeadline: { ...TYPE.codeHeadline, max: 88, min: 64, lh: 1.02 },
  endHeadline: { ...TYPE.endHeadline, max: 128, min: 88, lh: 1 }
};
const FIXED = {
  number: { size: 44, weight: 600, h: 44, bar: { w: 48, h: 4, gap: 20 } },
  kicker: { size: 26, weight: 600, tracking: 2, padY: 14, padX: 22, border: 2, radius: 12 },
  attribution: { size: 30, weight: 500, lh: 1.3 },
  icon: 112,
  // Short blocks are the payoff: up to 56 px when the block has ≤ shortLines lines (Oct 2026 review).
  code: { max: 44, maxShort: 56, shortLines: 4, min: 28, step: 2, lh: 1.55, maxLines: 14, padX: 36, padY: 32, titleBar: 64, radius: 24 },
  quoteMark: { size: 200, weight: 700, x: 90, top: 330 }
};
const STACK = {
  coverTop: 360,
  cardTop: 344,
  quoteTop: 520,
  endTop: 580,
  gap: 40,
  codeNumberGap: 32,
  codeBodyGap: 28,
  codeGap: 48,
  noteGap: 32,
  iconGap: 64,
  quoteBodyGap: 32,
  endCtaGap: 72
};
function layoutDev(input) {
  if (isLexType(input.slide.type)) return layoutLexSlide(input);
  if (isArabicType(input.slide.type)) return layoutArabicSlide(input);
  const { slide, deck, variant: v, measurer: m } = input;
  const sans = v.fonts.sans;
  const mono = v.fonts.mono;
  const warnings = [];
  const boxes = [];
  const { surface, name, onPhoto: onPhoto2 } = resolveSurface(v, slide, input.hasPhoto, warnings);
  const hw = v.headlineWeight;
  const display = v.family === "sport" ? v.fonts.serif ?? sans : sans;
  const spec = (s, headline = false) => {
    const weight = headline && hw ? hw : s.weight;
    const family = headline ? display : sans;
    return { ...s, min: legibleMin(s.min, family), weight, family, mono: { family: mono, weight: weight >= 600 ? 600 : 400 } };
  };
  const items = [];
  const push = (it) => {
    items.push({ ...it, gap: items.length ? it.gap : 0 });
  };
  const cta = ctaLabel(slide, deck);
  const pushCta = (gap) => {
    if (cta) push({ kind: "cta", h: CHROME.cta.h, w: ctaWidth(cta, sans, m), gap, label: cta });
  };
  const pushIcon = () => {
    if (input.icon) push({ kind: "icon", h: FIXED.icon, w: FIXED.icon, gap: STACK.iconGap });
  };
  const numberItem = (gap) => {
    if (slide.badge === null) return;
    const n = FIXED.number;
    const label2 = String(slide.badge).padStart(2, "0");
    const w = m.width(label2, { family: mono, weight: n.weight, size: n.size }) + n.bar.gap + n.bar.w;
    push({ kind: "number", h: n.h, w, gap, label: label2 });
  };
  const T = v.family === "sport" ? { ...TYPE, ...SPORT_TYPE } : TYPE;
  const kickerItem = () => {
    if (!slide.attrs.kicker) return false;
    const k = FIXED.kicker;
    const label2 = slide.attrs.kicker.toUpperCase();
    const w = m.width(label2, { family: mono, weight: k.weight, size: k.size }) + k.tracking * Math.max(0, Array.from(label2).length - 1) + k.padX * 2;
    push({ kind: "kicker", h: k.size + k.padY * 2, w: Math.min(w, CONTENT_W), gap: 0, label: label2 });
    return true;
  };
  const prefixed = (rich) => withPrefix(v.headlineUpper ? upperRich(rich) : rich, v.headlinePrefix);
  let top = STACK.cardTop;
  switch (slide.type) {
    case "cover": {
      top = STACK.coverTop;
      kickerItem();
      push({ kind: "text", role: "headline", rich: prefixed(slide.headline), spec: spec(T.coverHeadline, true), gap: STACK.gap, tone: "ink" });
      if (!isEmptyRich(slide.body)) push({ kind: "text", role: "subtitle", rich: slide.body, spec: spec(TYPE.coverSubtitle), gap: STACK.gap, tone: "muted" });
      break;
    }
    case "card": {
      const kicked = kickerItem();
      const verdict = verdictItem(slide, v, m, STACK.gap);
      if (verdict) push(verdict);
      else if (!kicked) numberItem(0);
      push({ kind: "text", role: "headline", rich: prefixed(slide.headline), spec: spec(T.cardHeadline, true), gap: STACK.gap, tone: "ink" });
      if (!isEmptyRich(slide.body)) push({ kind: "text", role: "body", rich: slide.body, spec: spec(TYPE.body), gap: STACK.gap, tone: "body" });
      pushIcon();
      pushCta(CHROME.cta.gapBefore);
      break;
    }
    case "code": {
      numberItem(0);
      push({ kind: "text", role: "headline", rich: prefixed(slide.headline), spec: spec(T.codeHeadline, true), gap: STACK.codeNumberGap, tone: "ink" });
      if (!isEmptyRich(slide.body)) push({ kind: "text", role: "body", rich: slide.body, spec: spec(TYPE.body), gap: STACK.codeBodyGap, tone: "muted" });
      if (slide.code) {
        const c = FIXED.code;
        const lines = prepareCode(slide.code.text, slide.code.lang);
        const codeSpec = {
          family: mono,
          weight: 400,
          max: lines.length <= c.shortLines ? c.maxShort : c.max,
          min: c.min,
          step: c.step,
          lh: c.lh,
          maxLines: c.maxLines,
          padX: c.padX,
          padTop: c.padY,
          padBottom: c.padY,
          titleBar: v.code.dots ? c.titleBar : 0
        };
        push({ kind: "code", lines, lang: slide.code.lang, spec: codeSpec, gap: STACK.codeGap });
      }
      if (!isEmptyRich(slide.note)) push({ kind: "text", role: "note", rich: slide.note, spec: spec(TYPE.note), gap: STACK.noteGap, tone: "muted" });
      pushCta(CHROME.cta.gapBefore);
      break;
    }
    case "diagram": {
      const verdict = verdictItem(slide, v, m, 0);
      if (verdict) push(verdict);
      else numberItem(0);
      const d = diagramItem(slide, STACK.codeNumberGap);
      if (d) push(d);
      push({ kind: "text", role: "headline", rich: prefixed(slide.headline), spec: spec(T.codeHeadline, true), gap: STACK.codeGap, tone: "ink" });
      if (!isEmptyRich(slide.body)) push({ kind: "text", role: "body", rich: slide.body, spec: spec(TYPE.body), gap: STACK.codeBodyGap, tone: "body" });
      if (!isEmptyRich(slide.note)) push({ kind: "text", role: "note", rich: slide.note, spec: spec(TYPE.note), gap: STACK.noteGap, tone: "muted" });
      pushCta(CHROME.cta.gapBefore);
      break;
    }
    case "quote": {
      top = STACK.quoteTop;
      kickerItem();
      push({ kind: "text", role: "quote", rich: slide.headline, spec: spec(TYPE.quote), gap: STACK.gap, tone: "ink" });
      if (slide.attribution) {
        const a = FIXED.attribution;
        const label2 = `— ${slide.attribution}`;
        const w = Math.min(CONTENT_W, m.width(label2, { family: mono, weight: a.weight, size: a.size }));
        push({ kind: "attribution", h: a.size * a.lh, w, gap: STACK.gap, label: label2 });
      }
      if (!isEmptyRich(slide.body)) push({ kind: "text", role: "body", rich: slide.body, spec: spec(TYPE.body), gap: STACK.quoteBodyGap, tone: "body" });
      pushIcon();
      pushCta(CHROME.cta.gapBefore);
      break;
    }
    case "end": {
      top = STACK.endTop;
      push({ kind: "text", role: "headline", rich: v.headlineUpper ? upperRich(slide.headline) : slide.headline, spec: spec(T.endHeadline, true), gap: 0, tone: "ink" });
      if (!isEmptyRich(slide.body)) push({ kind: "text", role: "body", rich: slide.body, spec: spec(TYPE.body), gap: STACK.gap, tone: "muted" });
      pushIcon();
      pushCta(STACK.endCtaGap);
      break;
    }
  }
  const stack = fitStack(items, frameFrom(top), m);
  centerStack(stack, slide.type === "cover" ? top : ROWS.stackTopCard, onPhoto2);
  const header = layoutHeader(input, sans, mono, boxes);
  const footer = layoutFooter(input, sans, mono, boxes, false);
  boxes.push(...stackBoxes(stack));
  warnings.push(...stackWarnings(slide, stack));
  const icon = stack.placed.some((p) => p.item.kind === "icon") ? input.icon : null;
  return {
    slide,
    deck,
    variant: v,
    surface,
    surfaceName: name,
    onPhoto: onPhoto2,
    stack,
    icon,
    ctaLabel: cta,
    header,
    footer,
    boxes,
    warnings
  };
}
const DECO = {
  dotGrid: { spacing: 48, r: 2 },
  glow: { x: 980, y: 260, r: 520 },
  scanlines: { every: 6, h: 2, color: "rgba(0,0,0,0.18)" },
  bigGlyph: { size: 560, weight: 700, alpha: 0.05, right: 1140, baseline: 1980 }
};
function drawDotGrid(ctx, color) {
  const { spacing, r } = DECO.dotGrid;
  ctx.fillStyle = color;
  for (let y = spacing / 2; y < CANVAS.h; y += spacing) {
    for (let x = spacing / 2; x < CANVAS.w; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
function drawGlow(ctx, accent, alpha) {
  const { x, y, r } = DECO.glow;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, withAlpha(accent, alpha));
  g.addColorStop(1, withAlpha(accent, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);
}
function drawScanlines(ctx) {
  const { every, h, color } = DECO.scanlines;
  ctx.fillStyle = color;
  for (let y = 0; y < CANVAS.h; y += every) ctx.fillRect(0, y, CANVAS.w, h);
}
function drawBigGlyph(ctx, glyph, mono, ink) {
  const g = DECO.bigGlyph;
  setFont(ctx, { family: mono, weight: g.weight, size: g.size });
  ctx.fillStyle = withAlpha(ink, g.alpha);
  ctx.textAlign = "right";
  ctx.fillText(glyph, g.right, g.baseline);
  ctx.textAlign = "left";
}
function drawDev(ctx, L) {
  const { slide, variant: v, surface: s, onPhoto: onPhoto2 } = L;
  const sans = v.fonts.sans;
  const mono = v.fonts.mono;
  if (!onPhoto2) {
    if (v.deco.dotGrid && v.deco.dotColor) drawDotGrid(ctx, v.deco.dotColor);
    if (v.deco.glow) drawGlow(ctx, s.accent, v.deco.glowAlpha ?? 0.08);
    if (v.deco.bigGlyph && (slide.type === "cover" || slide.type === "end")) drawBigGlyph(ctx, v.deco.bigGlyph, mono, s.ink);
  }
  if (L.lex) {
    drawHeader(ctx, L, s.body, s.muted);
    drawFooter(ctx, L, s.muted, s.muted);
    drawLex(ctx, L);
    if (!onPhoto2 && v.deco.scanlines) drawScanlines(ctx);
    return;
  }
  if (slide.type === "quote") {
    const q = FIXED.quoteMark;
    setShadow(ctx, onPhoto2);
    setFont(ctx, { family: mono, weight: q.weight, size: q.size });
    ctx.fillStyle = s.accent;
    ctx.fillText('"', q.x, quoteMarkTop(L, q.top) + q.size * 0.72);
  }
  drawHeader(ctx, L, s.body, s.muted);
  drawFooter(ctx, L, s.muted, s.muted);
  ctx.save();
  if (L.stack.overflow) clipToStack(ctx);
  for (const p of L.stack.placed) {
    const it = p.item;
    switch (it.kind) {
      case "text":
        drawTextBlock(ctx, p, s, onPhoto2);
        break;
      case "number": {
        const n = FIXED.number;
        setShadow(ctx, onPhoto2);
        setFont(ctx, { family: mono, weight: n.weight, size: n.size });
        ctx.fillStyle = s.accent;
        const baseline = p.y + n.size * 0.86;
        ctx.fillText(it.label ?? "", p.x, baseline);
        const tw = ctx.measureText(it.label ?? "").width;
        const midY = baseline - n.size * 0.36;
        ctx.fillRect(p.x + tw + n.bar.gap, midY - n.bar.h / 2, n.bar.w, n.bar.h);
        break;
      }
      case "kicker": {
        const k = FIXED.kicker;
        setShadow(ctx, false);
        ctx.strokeStyle = s.accent;
        ctx.lineWidth = k.border;
        ctx.beginPath();
        ctx.roundRect(p.x + k.border / 2, p.y + k.border / 2, p.w - k.border, p.h - k.border, k.radius);
        ctx.stroke();
        setShadow(ctx, onPhoto2);
        setFont(ctx, { family: mono, weight: k.weight, size: k.size });
        ctx.fillStyle = s.accent;
        drawTracked(ctx, it.label ?? "", p.x + k.padX, p.y + p.h / 2 + k.size * 0.36, k.tracking);
        break;
      }
      case "attribution": {
        const a = FIXED.attribution;
        setShadow(ctx, onPhoto2);
        setFont(ctx, { family: mono, weight: a.weight, size: a.size });
        ctx.fillStyle = s.muted;
        ctx.fillText(truncateToWidth(ctx, it.label ?? "", CONTENT_W), p.x, p.y + a.size * 0.92);
        break;
      }
      case "icon":
        if (L.icon) {
          setShadow(ctx, false);
          drawIcon(ctx, L.icon, p.x, p.y, FIXED.icon, s.icon);
        }
        break;
      case "code":
        drawCodeBlock(ctx, p, v.code, mono, FIXED.code.radius, CONTENT_W);
        break;
      case "cta":
        drawCta(ctx, p, it.label ?? "", s, sans);
        break;
      case "badge":
        break;
      case "verdict":
      case "diagram":
        drawStampItem(ctx, p, L);
        break;
    }
  }
  ctx.restore();
  if (!onPhoto2 && v.deco.scanlines) drawScanlines(ctx);
}
function quoteMarkTop(L, designTop) {
  return (L.stack.placed[0]?.y ?? STACK.quoteTop) - (STACK.quoteTop - designTop);
}
const S$2 = (bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg) => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });
const onPhotoBase$1 = {
  bg: "#000000",
  ink: "#FFFFFF",
  body: "rgba(255,255,255,0.90)",
  muted: "rgba(255,255,255,0.75)",
  icon: "#FFFFFF",
  blob: "rgba(0,0,0,0)",
  inlineCodeBg: "rgba(255,255,255,0.18)"
};
const paperCode = {
  panel: "#FFFFFF",
  border: "#DCCFB8",
  text: "#24292F",
  prompt: "#1D4ED8",
  command: "#16181D",
  subcommand: "#7C2D12",
  flag: "#8A3B00",
  string: "#0F6B3A",
  comment: "#6B7280",
  number: "#8A3B00",
  keyword: "#9B2C2C",
  fn: "#5B21B6",
  punct: "#3F3F46",
  dots: null
};
const kamus = {
  id: "lexicon/kamus",
  name: "Kamus",
  family: "lexicon",
  fonts: { serif: "Lora", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    paper: S$2("#F6F1E7", "#1E1B18", "#3A342D", "#6E665C", "#A3221B", "#B3261E", "#FFFFFF", "#F6F1E7", "#B3261E", "#EAE1CF"),
    "paper-alt": S$2("#EFE7D6", "#1E1B18", "#37312A", "#675F55", "#9E211A", "#B3261E", "#FFFFFF", "#EFE7D6", "#B3261E", "#E3D8C2"),
    deep: S$2("#2A211C", "#F6F1E7", "#E1D8C8", "#B3A894", "#F08A7E", "#F08A7E", "#2A211C", "#2A211C", "#F08A7E", "#3A2F28")
  },
  rotation: ["paper", "paper-alt"],
  onPhoto: { ...onPhotoBase$1, accent: "#F5B3AA", badgeBg: "#F08A7E", badgeInk: "#2A211C", tint: "#1A1410" },
  code: paperCode,
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null, doubleRule: true },
  swatches: ["#F6F1E7", "#B3261E", "#1E1B18", "#E8DFCC"],
  lex: { rule: "#DCCFB8", highlight: "#F3D9A4", okBg: "#E3EEDB", okInk: "#2E5A2A", badBg: "#F6DCD8", badInk: "#8E1F17" }
};
const notebook = {
  id: "lexicon/notebook",
  name: "Notebook",
  family: "lexicon",
  fonts: { serif: "Lora", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    page: S$2("#FBFBF7", "#1B2430", "#364152", "#677184", "#2448B8", "#2F5BD3", "#FFFFFF", "#FBFBF7", "#2F5BD3", "#EEF1F8"),
    deep: S$2("#1D2A44", "#F4F6FB", "#D5DBE8", "#A3AEC4", "#9DB6FF", "#FFE58A", "#1D2A44", "#1D2A44", "#FFE58A", "#2A3A5C")
  },
  rotation: ["page"],
  onPhoto: { ...onPhotoBase$1, accent: "#FFE58A", badgeBg: "#FFE58A", badgeInk: "#1D2A44", tint: "#0E1424" },
  code: paperCode,
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null, notebook: true },
  swatches: ["#FBFBF7", "#2F5BD3", "#1B2430", "#FFE58A"],
  lex: {
    rule: "#DCE4F2",
    highlight: "#FFE58A",
    okBg: "#DFF1E2",
    okInk: "#1F6B33",
    badBg: "#FBE0DD",
    badInk: "#A3261C",
    margin: "#E7877D"
  }
};
const LEXICON_VARIANTS = [kamus, notebook];
const LEX_DECO = {
  doubleRule: { y: 268, thick: 2, thin: 1, gap: 6 },
  notebook: { from: SAFE.top, to: SAFE.bottom, every: 64, h: 2, marginX: 72, marginW: 3, alpha: 0.55 },
  cornerGlyph: { size: 900, alpha: 0.04, x: 640, baseline: 2240 }
};
function drawDeco(ctx, L) {
  const { variant: v, surface: s, onPhoto: onPhoto2 } = L;
  if (onPhoto2) return;
  setShadow(ctx, false);
  const rule = v.lex?.rule ?? withAlpha(s.muted, 0.3);
  const paper = L.surfaceName !== "deep";
  if (v.deco.notebook && paper) {
    const n = LEX_DECO.notebook;
    ctx.fillStyle = withAlpha(rule, n.alpha);
    for (let y = n.from; y <= n.to; y += n.every) ctx.fillRect(0, y, CANVAS.w, n.h);
    if (v.lex?.margin) {
      ctx.fillStyle = v.lex.margin;
      ctx.fillRect(n.marginX, 0, n.marginW, CANVAS.h);
    }
  }
  if (v.deco.doubleRule) {
    const d = LEX_DECO.doubleRule;
    ctx.fillStyle = paper ? rule : withAlpha(s.muted, 0.35);
    ctx.fillRect(SAFE.left, d.y, SAFE.right - SAFE.left, d.thick);
    ctx.fillRect(SAFE.left, d.y + d.thick + d.gap, SAFE.right - SAFE.left, d.thin);
  }
  if (v.deco.cornerGlyph) {
    const g = LEX_DECO.cornerGlyph;
    setFont(ctx, { family: v.fonts.serif ?? v.fonts.sans, weight: 700, size: g.size });
    ctx.fillStyle = withAlpha(s.ink, g.alpha);
    ctx.fillText(v.deco.cornerGlyph, g.x, g.baseline);
  }
}
function drawLexicon(ctx, L) {
  drawDeco(ctx, L);
  drawEditorial(ctx, L);
}
const S$1 = (bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg) => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });
const onPhotoBase = {
  bg: "#000000",
  ink: "#FFFFFF",
  body: "rgba(255,255,255,0.90)",
  muted: "rgba(255,255,255,0.75)",
  icon: "#FFFFFF",
  blob: "rgba(0,0,0,0)",
  inlineCodeBg: "rgba(255,255,255,0.18)"
};
const quietCode = {
  panel: "#16242F",
  border: "#2A3B48",
  text: "#F3EEE2",
  prompt: "#D9B76E",
  command: "#F3EEE2",
  subcommand: "#E7CF9A",
  flag: "#C9D4C5",
  string: "#B9D8A8",
  comment: "#9AA3A8",
  number: "#E7CF9A",
  keyword: "#E8A98F",
  fn: "#A9C7E8",
  punct: "#C8C2B4",
  dots: null
};
const deco = { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null, frame: true, minDarkness: 70 };
const fajr = {
  id: "serene/fajr",
  name: "Fajr",
  family: "serene",
  fonts: { serif: "Lora", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    paper: S$1("#F5F1E8", "#1F2B24", "#34423A", "#66706A", "#2F5D4A", "#2F5D4A", "#F5F1E8", "#F5F1E8", "#2F5D4A", "#EAE4D6"),
    deep: S$1("#1F3A30", "#F5F1E8", "#DCD8CC", "#A9B0A8", "#D8BC86", "#D8BC86", "#1F3A30", "#1F3A30", "#D8BC86", "#2A4A3E")
  },
  rotation: ["paper"],
  onPhoto: { ...onPhotoBase, accent: "#E9D3A6", badgeBg: "#D8BC86", badgeInk: "#1F3A30", tint: "#101A15" },
  code: quietCode,
  deco,
  swatches: ["#F5F1E8", "#2F5D4A", "#B08D57", "#1F2B24"]
};
const isya = {
  id: "serene/isya",
  name: "Isya",
  family: "serene",
  fonts: { serif: "Lora", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    night: S$1("#12202B", "#F3EEE2", "#D2CBBB", "#9AA3A8", "#D9B76E", "#D9B76E", "#12202B", "#12202B", "#D9B76E", "#1C2E3C"),
    deep: S$1("#0C161E", "#F3EEE2", "#D2CBBB", "#9AA3A8", "#D9B76E", "#D9B76E", "#0C161E", "#0C161E", "#D9B76E", "#16242F")
  },
  rotation: ["night"],
  onPhoto: { ...onPhotoBase, accent: "#E9D3A6", badgeBg: "#D9B76E", badgeInk: "#12202B", tint: "#081016" },
  code: quietCode,
  deco,
  swatches: ["#12202B", "#D9B76E", "#F3EEE2", "#1C2E3C"]
};
const SERENE_VARIANTS = [fajr, isya];
const S = (bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg) => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });
const onPhoto = {
  bg: "#000000",
  ink: "#FFFFFF",
  body: "rgba(255,255,255,0.90)",
  muted: "rgba(255,255,255,0.75)",
  accent: "#F5C518",
  badgeBg: "#F5C518",
  badgeInk: "#0F1A14",
  blob: "rgba(0,0,0,0)",
  icon: "#FFFFFF",
  inlineCodeBg: "rgba(255,255,255,0.18)"
};
const base = {
  family: "sport",
  fonts: { serif: "Barlow Condensed", sans: "Barlow", mono: "JetBrains Mono" },
  code: githubDark.code,
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  headlineWeight: 800,
  headlineUpper: true
};
const DARK_SEMANTIC = { ok: "#3DDC84", warn: "#F5C518", bad: "#FF6B63" };
const papan = {
  ...base,
  id: "sport/papan",
  name: "Papan",
  surfaces: {
    papan: S("#0F3324", "#F4F1E8", "#CFE0D3", "#8FB09A", "#F5C518", "#F5C518", "#0F3324", "#0F3324", "#F5C518", "#15452F"),
    deep: S("#0B2A1D", "#F4F1E8", "#CFE0D3", "#8FB09A", "#F5C518", "#F5C518", "#0B2A1D", "#0B2A1D", "#F5C518", "#123C29")
  },
  rotation: ["papan"],
  onPhoto: { ...onPhoto, tint: "#06140D" },
  semantic: DARK_SEMANTIC,
  swatches: ["#0F3324", "#15452F", "#F5C518", "#F4F1E8"]
};
const lapangan = {
  ...base,
  id: "sport/lapangan",
  name: "Lapangan",
  surfaces: {
    lapangan: S("#14284A", "#F4F1E8", "#D2DBEA", "#93A3C2", "#F5C518", "#F5C518", "#14284A", "#14284A", "#F5C518", "#1C3766"),
    deep: S("#0F1F3A", "#F4F1E8", "#D2DBEA", "#93A3C2", "#F5C518", "#F5C518", "#0F1F3A", "#0F1F3A", "#F5C518", "#18305A")
  },
  rotation: ["lapangan"],
  onPhoto: { ...onPhoto, tint: "#070E1C" },
  semantic: DARK_SEMANTIC,
  swatches: ["#14284A", "#1C3766", "#F5C518", "#F4F1E8"]
};
const kapur = {
  ...base,
  id: "sport/kapur",
  name: "Kapur",
  surfaces: {
    kapur: S("#EFECE3", "#141714", "#3A3F3B", "#6F726C", "#8A5A00", "#141714", "#EFECE3", "#EFECE3", "#8A5A00", "#E2DED2"),
    deep: S("#E6E2D7", "#141714", "#3A3F3B", "#6A6D67", "#8A5A00", "#141714", "#E6E2D7", "#E6E2D7", "#8A5A00", "#D8D3C5")
  },
  rotation: ["kapur"],
  onPhoto: { ...onPhoto, tint: "#0B0C0B" },
  semantic: { ok: "#1E7A43", warn: "#8A5A00", bad: "#B3261E" },
  swatches: ["#EFECE3", "#141714", "#B3261E", "#1E7A43"]
};
const SPORT_VARIANTS = [papan, lapangan, kapur];
function layoutSerene(input) {
  if (isArabicType(input.slide.type)) return layoutArabicSlide(input);
  if (isLexType(input.slide.type)) return layoutLexSlide(input);
  return layoutEditorial(input, { center: true });
}
const SERENE_DECO = {
  frame: { inset: 40, width: 2, alpha: 0.35, radius: 24 }
};
function drawFrame(ctx, L) {
  const f = SERENE_DECO.frame;
  setShadow(ctx, false);
  ctx.strokeStyle = withAlpha(L.surface.accent, f.alpha);
  ctx.lineWidth = f.width;
  ctx.beginPath();
  ctx.roundRect(f.inset, f.inset, CANVAS.w - f.inset * 2, CANVAS.h - f.inset * 2, f.radius);
  ctx.stroke();
}
function drawEndStar(ctx, L) {
  const first = L.stack.placed[0];
  if (L.slide.type !== "end" || !first) return;
  const s = AYAH.star;
  drawStar(ctx, CANVAS.w / 2, first.y - s.gap - s.size / 2, s.size, withAlpha(L.surface.accent, s.alpha), s.width);
}
function drawSerene(ctx, L) {
  if (L.variant.deco.frame) drawFrame(ctx, L);
  drawEndStar(ctx, L);
  drawEditorial(ctx, L);
}
const FAMILIES = {
  editorial: { layout: (input) => layoutEditorial(input), draw: drawEditorial },
  dev: { layout: layoutDev, draw: drawDev },
  // Normal slides use the editorial layout with lexicon tokens and fonts.
  lexicon: { layout: (input) => layoutEditorial(input), draw: drawLexicon },
  serene: { layout: layoutSerene, draw: drawSerene },
  // Sport reuses the dev layout: display face + capitals for headlines, no terminal path.
  sport: { layout: layoutDev, draw: drawDev }
};
const VARIANTS = [...EDITORIAL_VARIANTS, ...DEV_VARIANTS, ...LEXICON_VARIANTS, ...SERENE_VARIANTS, ...SPORT_VARIANTS];
const BY_ID = new Map(VARIANTS.map((v) => [v.id, v]));
const BUILTIN = new Set(BUILTIN_TEMPLATE_IDS);
class VariantError extends Error {
  constructor(id, issues) {
    super(`registerVariant("${id}") failed:
- ${issues.join("\n- ")}`);
    this.id = id;
    this.issues = issues;
    this.name = "VariantError";
  }
  id;
  issues;
}
function checkVariant(v) {
  return validateVariant(v, Object.keys(FAMILIES));
}
function registerVariant(v, opts = {}) {
  const id = String(v?.id);
  const issues = checkVariant(v);
  if (BUILTIN.has(id)) issues.unshift("built-in templates can't be replaced");
  else if (BY_ID.has(id) && !opts.replace) issues.unshift("already registered (pass { replace: true } to update it)");
  if (issues.length) throw new VariantError(id, issues);
  const frozen = Object.freeze({ ...v });
  BY_ID.set(id, frozen);
  return frozen;
}
function hasVariant(id) {
  return BY_ID.has(id);
}
function getVariant(id) {
  const v = BY_ID.get(id);
  if (!v) throw new Error(`Unknown template ${id}`);
  return v;
}
function listVariants() {
  return [...BY_ID.values()];
}
function templateFamily(id) {
  return BY_ID.get(id)?.family;
}
function getFamily(family) {
  return FAMILIES[family];
}
export {
  ARABIC_SAMPLE as A,
  BLOCKING_CODES as B,
  CANVAS as C,
  DEFAULT_TEMPLATE as D,
  fillTable as E,
  parseRich as F,
  canonicalIcon as G,
  HADITH_FACE as H,
  templateFamily as I,
  LANGS as L,
  ROWS as R,
  SAFE as S,
  VariantError as V,
  BUILTIN_TEMPLATE_IDS as a,
  slugify as b,
  createCanvasMeasurer as c,
  checkVariant as d,
  resolveIcons as e,
  getFamily as f,
  getVariant as g,
  hasVariant as h,
  isBlocking as i,
  CONTENT_W as j,
  AYAH_FACE as k,
  listVariants as l,
  builtinFamilyOf as m,
  richToPlain as n,
  SLIDE_TYPES as o,
  isArabicType as p,
  fillAyah as q,
  registerVariant as r,
  slideFileName as s,
  traitsOf as t,
  fillHadith as u,
  isLexType as v,
  withAlpha as w,
  fillWord as x,
  fillCompare as y,
  parseInline as z
};
//# sourceMappingURL=registry-CfRP1EtO.js.map
