const Xn = ["cover", "card", "code", "quote", "end", "word", "table", "compare", "ayah", "hadith", "diagram"];
function ot(e) {
  return e === "word" || e === "table" || e === "compare";
}
function st(e) {
  return e === "ayah" || e === "hadith";
}
const Fn = ["id", "en"], qn = [
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
], Yn = "editorial/rose-dusk";
function or(e) {
  return qn.includes(e);
}
function sr(e) {
  if (or(e))
    return e.startsWith("dev/") ? "dev" : e.startsWith("sport/") ? "sport" : e.startsWith("serene/") ? "serene" : e.startsWith("lexicon/") ? "lexicon" : "editorial";
}
const lr = [
  "overflow",
  "code-line-too-long",
  "table-too-many-rows",
  "table-too-wide",
  "ipa-glyph-missing",
  "internal-error",
  "arabic-too-long",
  "arabic-font-missing"
];
function cr(e) {
  return !!e.hard || lr.includes(e.code);
}
function $e(e) {
  const n = [];
  let t = [], o = "";
  const i = (s, l) => {
    if (!s) return;
    const c = t[t.length - 1];
    c && c.style === l ? c.text += s : t.push({ text: s, style: l });
  }, r = () => {
    i(o, "plain"), o = "";
  };
  let a = 0;
  for (; a < e.length; ) {
    const s = e[a];
    if (s === "\\" && e[a + 1] === "|") {
      o += "|", a += 2;
      continue;
    }
    if (s === "|") {
      r(), n.push(An(t)), t = [], a++;
      continue;
    }
    if (s === "`") {
      const l = e.indexOf("`", a + 1);
      if (l > a + 1) {
        r(), i(e.slice(a + 1, l), "code"), a = l + 1;
        continue;
      }
    }
    if (s === "*") {
      if (e[a + 1] === "*") {
        let c = a;
        for (; e[c] === "*"; ) c++;
        o += e.slice(a, c), a = c;
        continue;
      }
      const l = hr(e, a);
      if (l > 0) {
        r(), i(e.slice(a + 1, l).replace(/\\\|/g, "|"), "accent"), a = l + 1;
        continue;
      }
    }
    o += s, a++;
  }
  return r(), n.push(An(t)), n;
}
function hr(e, n) {
  const t = e[n + 1];
  if (t === void 0 || t === " " || t === "*") return -1;
  for (let o = n + 1; o < e.length; o++) {
    const i = e[o];
    if (i === "|" && e[o - 1] !== "\\" || i === "`") return -1;
    if (i === "*")
      return o === n + 1 || e[o - 1] === " " || e[o + 1] === "*" ? -1 : o;
  }
  return -1;
}
function An(e) {
  const n = e.map((i) => ({ ...i })), t = n[0];
  t && t.style !== "code" && (t.text = t.text.replace(/^\s+/, ""));
  const o = n[n.length - 1];
  return o && o.style !== "code" && (o.text = o.text.replace(/\s+$/, "")), n.filter((i) => i.text.length > 0);
}
function fe(e) {
  const n = [];
  let t = [];
  for (const o of e) {
    if (o.trim() === "") {
      t.length && n.push(t), t = [];
      continue;
    }
    t.push(...$e(o.trim()));
  }
  return t.length && n.push(t), n;
}
function dr(e) {
  return e.map((n) => n.map((t) => t.map((o) => o.text).join("")).join(" ")).join(`
`);
}
function Ae(e) {
  return e.every((n) => n.every((t) => t.every((o) => o.text.trim() === "")));
}
function xn(e) {
  return e.map((n) => n.map((t) => t.map((o) => o.style === "code" ? o : { ...o, text: o.text.toUpperCase() })));
}
function Kn(e) {
  let n = 2166136261;
  for (let t = 0; t < e.length; t++)
    n ^= e.charCodeAt(t), n = Math.imul(n, 16777619);
  return n >>> 0;
}
function fr(e) {
  let n = e >>> 0;
  return () => {
    n = n + 1831565813 >>> 0;
    let t = n;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function ur(e, n) {
  return fr(Kn(e) + n);
}
function Ue(e, n, t) {
  return n + (t - n) * e();
}
const gt = [
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
], Gt = [
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
], pr = {
  shield: "shield-heart",
  spark: "heart-spark",
  pin: "map-pin",
  branch: "git-branch",
  bulb: "lightbulb",
  check: "check-circle"
}, mr = /* @__PURE__ */ new Set([...gt, ...Gt]);
function Vn(e) {
  const n = e.toLowerCase();
  return mr.has(n) ? n : pr[n] ?? null;
}
function gr(e, n, t) {
  const { pool: o } = t, i = [];
  let r = null;
  for (const a of e) {
    let s = null;
    if (a.type !== "cover") {
      const l = a.attrs.icon ?? t.fallback;
      if (l === "auto") {
        if (a.type !== "end") {
          let c = Kn(`${n}:${a.index}`) % o.length;
          o[c] === r && (c = (c + 1) % o.length), s = o[c] ?? null;
        }
      } else l !== "none" && (s = Vn(l));
    }
    i.push(s), r = s;
  }
  return i;
}
function br(e, n = {}) {
  const t = n.autoBadge ?? !0, o = e.length;
  let i = 0, r = 0;
  return e.forEach((a, s) => {
    if (a.index = s, a.counter = { i: s + 1, total: o }, a.badge = null, a.type === "card" || a.type === "code" || a.type === "diagram" || a.type === "table" && typeof a.attrs.number == "number") {
      const c = a.attrs.number;
      c === "off" || c === void 0 && !t || (typeof c == "number" ? (i++, a.badge = c) : (i++, a.badge = i));
    }
    const l = a.type === "card" || a.type === "code" || a.type === "diagram" || a.type === "quote" || a.type === "word" || a.type === "table" || a.type === "compare" || a.type === "ayah" || a.type === "hadith";
    a.contentIndex = l ? r++ : -1, a.showCta = a.type === "end" || l && a.attrs.cta !== void 0, a.type === "cover" ? a.swipe = "coverSwipe" : a.type === "end" || a.showCta ? a.swipe = null : a.swipe = "swipe";
  }), e;
}
const wr = 40;
function rn(e, n = wr) {
  const t = e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return t.length <= n ? t : t.slice(0, n).replace(/-+$/g, "");
}
function yr(e, n) {
  return `${e || "carousel"}_${String(n + 1).padStart(2, "0")}.png`;
}
const kr = ["word", "ipa", "say", "pos", "tag", "meaning", "example", "translation", "origin", "note"], _r = ["wrong", "right", "why", "wrong-label", "right-label", "headline"], Oe = { minCols: 2, maxCols: 4, maxRows: 8 }, vr = /^\s*([a-z][a-z-]*)\s*:\s?(.*)$/;
function At(e, n, t) {
  const o = {};
  for (const i of e) {
    if (i.text.trim() === "") continue;
    const r = vr.exec(i.text);
    if (!r || !n.includes(r[1])) {
      t("unknown-field", r ? `Unknown field "${r[1]}"` : `Not a "key: value" line: ${i.text.trim().slice(0, 40)}`, i.line);
      continue;
    }
    o[r[1]] = r[2].trim();
  }
  return o;
}
function Jn(e, n) {
  e.type = "card";
  const [t, ...o] = n.filter((i) => i.trim() !== "");
  e.headlineSrc = t ?? "", e.headline = t ? [$e(t)] : [], e.body = fe(o);
}
function Er(e, n, t) {
  const o = At(n, kr, t);
  if (!o.word) {
    t("missing-word", 'Word slide without "word:", rendered as a card'), Jn(e, Object.values(o));
    return;
  }
  e.fields = o, e.headlineSrc = o.word, e.headline = [$e(o.word)];
}
function Fr(e, n, t) {
  const o = At(n, _r, t);
  if (!o.wrong || !o.right) {
    t("missing-field", 'Compare slide needs both "wrong:" and "right:", rendered as a card'), Jn(e, [o.headline ?? "", o.wrong ?? "", o.right ?? "", o.why ?? ""]);
    return;
  }
  e.fields = o, e.headlineSrc = o.headline ?? "", e.headline = o.headline ? [$e(o.headline)] : [];
}
function Ar(e) {
  let n = e.trim();
  n.startsWith("|") && (n = n.slice(1)), n.endsWith("|") && !n.endsWith("\\|") && (n = n.slice(0, -1));
  const t = [];
  let o = "";
  for (let i = 0; i < n.length; i++)
    n[i] === "\\" && n[i + 1] === "|" ? (o += "\\|", i++) : n[i] === "|" ? (t.push(o.trim()), o = "") : o += n[i];
  return t.push(o.trim()), t;
}
function xr(e, n, t) {
  const o = [], i = [];
  let r = e.lines[0];
  for (const c of n)
    c.text.trim().startsWith("|") ? (o.length || (r = c.line), o.push(Ar(c.text))) : i.push(c.text);
  if (!o.length) {
    t("table-shape", 'Table slide without "| … |" rows, rendered as a card'), e.type = "card", e.body = fe(i);
    return;
  }
  let a = o[0];
  if (a.length < Oe.minCols || a.length > Oe.maxCols)
    for (t("table-shape", `Tables need ${Oe.minCols}–${Oe.maxCols} columns, this one has ${a.length}`, r), a = a.slice(0, Oe.maxCols); a.length < Oe.minCols; ) a.push("");
  const s = o.slice(1).map((c, p) => {
    c.length > a.length && t("table-shape", `Row ${p + 1} has more cells than the header`, r + p + 1);
    const m = c.slice(0, a.length);
    for (; m.length < a.length; ) m.push("");
    return m;
  }), l = { header: a, rows: s };
  e.table = l, e.note = fe(i), e.fields = { note: i.map((c) => c.trim()).filter(Boolean).join(" | ") };
}
const Cr = [
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
function Br(e) {
  const n = /* @__PURE__ */ new Set();
  for (const t of Array.from(e)) {
    const o = t.codePointAt(0);
    Cr.some(([i, r]) => o >= i && o <= r) || n.add(t);
  }
  return [...n];
}
const Sr = ["arab", "terjemah", "ref", "source", "mark", "portion"], zr = ["arab", "text", "ref", "grade", "source"], Dr = ["arab", "terjemah", "ref"], Ir = ["text", "ref", "grade"];
function an(e) {
  const n = [];
  let t = "";
  for (let i = 0; i < e.length; i++)
    e[i] === "\\" && e[i + 1] === "|" ? (t += "|", i++) : e[i] === "|" ? (n.push(t.trim()), t = "") : t += e[i];
  n.push(t.trim());
  const o = n.filter((i) => i !== "");
  return o.length ? [o.map((i) => [{ text: i, style: "plain" }])] : [];
}
const Tr = "٠١٢٣٤٥٦٧٨٩";
function Mr(e) {
  return e.replace(/[0-9]/g, (n) => Tr[Number(n)]);
}
function Rr(e) {
  const n = e.mark?.trim();
  if (n === "off") return null;
  const t = n && /^\d+$/.test(n) ? n : /(\d+)\D*$/.exec(e.ref ?? "")?.[1];
  return t ? `﴿${Mr(t)}﴾` : null;
}
function Qn(e, n, t, o) {
  const i = n.filter((r) => !e[r]);
  i.length && o("missing-field", `${t} slide needs ${i.map((r) => `"${r}:"`).join(", ")} (export is blocked)`, void 0, !0);
}
function Or(e, n, t) {
  const o = At(n, Sr, t);
  Qn(o, Dr, "Ayah", t), o.portion !== void 0 && o.portion !== "true" && o.portion !== "false" && t("unknown-field", `portion must be "true" or "false", got "${o.portion}"`), e.fields = o, e.headlineSrc = o.ref ?? "", e.body = an(o.terjemah ?? "");
}
function Pr(e, n, t) {
  const o = At(n, zr, t);
  Qn(o, Ir, "Hadith", t), e.fields = o, e.headlineSrc = o.ref ?? "", e.body = an(o.text ?? "");
}
const ei = ["football", "futsal", "badminton", "volleyball", "basketball", "tennis"];
function Cn(e) {
  return ei.includes(e);
}
const Lr = /^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/, Ur = /^-?\d+(?:\.\d+)?$/, Nr = 24, Bn = 3;
function We(e) {
  const n = e ? Lr.exec(e) : null;
  if (!n) return null;
  const t = Number(n[1]), o = Number(n[2]);
  return t < 0 || t > 100 || o < 0 || o > 100 ? null : { x: t, y: o };
}
function $r(e, n) {
  const t = [], o = Cn(e) ? e : "football";
  Cn(e) || t.push({ offset: -1, message: `Unknown diagram field "${e}" (use ${ei.join(", ")}), using football` });
  const i = [];
  return n.forEach((r, a) => {
    const s = r.trim();
    if (!s || s.startsWith("#")) return;
    const [l = "", ...c] = s.split(/\s+/), p = (y) => {
      t.push({ offset: a, message: `Diagram line "${s}": ${y}` });
    }, m = (y) => c.slice(y).join(" ").slice(0, Nr);
    switch (l.toLowerCase()) {
      case "att":
      case "def":
      case "gk": {
        const y = We(c[0]);
        if (!y) return p("needs a position x,y between 0 and 100");
        i.push({ kind: "dot", team: l.toLowerCase() === "att" ? "att" : "def", at: y, label: m(1) });
        return;
      }
      case "player": {
        const y = We(c[0]);
        if (!y) return p("needs a position x,y between 0 and 100");
        const g = c.slice(1).join(" ");
        if (!g || g.length > Bn) return p(`needs a label of 1–${Bn} characters`);
        i.push({ kind: "dot", team: "player", at: y, label: g });
        return;
      }
      case "ball": {
        const y = We(c[0]);
        if (!y) return p("needs a position x,y between 0 and 100");
        i.push({ kind: "ball", at: y });
        return;
      }
      case "line": {
        const y = c[0] !== void 0 && Ur.test(c[0]) ? Number(c[0]) : NaN;
        if (!(y >= 0 && y <= 100)) return p("needs a y between 0 and 100");
        i.push({ kind: "line", y, label: m(1) });
        return;
      }
      case "pass":
      case "move":
      case "zone": {
        const y = We(c[0]), g = We(c[1] === "->" ? c[2] : c[1]);
        if (!y || !g) return p("needs two positions, e.g. 40,50 70,30");
        l.toLowerCase() === "zone" ? i.push({ kind: "zone", from: y, to: g }) : i.push({ kind: "arrow", style: l.toLowerCase() === "pass" ? "pass" : "move", from: y, to: g });
        return;
      }
      case "label": {
        const y = We(c[0]), g = m(1);
        if (!y || !g) return p("needs a position and some text");
        i.push({ kind: "label", at: y, text: g });
        return;
      }
      default:
        p("unknown mark (use att, def, gk, player, ball, line, pass, move, zone, label)");
    }
  }), { diagram: { field: o, marks: i }, issues: t };
}
const ti = ["handle", "template", "lang", "title", "caption", "counter"], ni = /^\s*([a-z]+)\s*:\s*(.*)$/, ii = /^\[[^\]]*\]$/, xt = /^\s*```/, Ct = /^\s*```\s*$/, ri = ["photo", "icon", "surface", "cta", "number", "kicker", "verdict", "tone"], jr = ["ok", "warn", "bad"], Sn = 10;
function on(e) {
  return e.split(/\r?\n/);
}
function sn(e) {
  const n = e.findIndex((o) => o.trim() === "---");
  if (n < 0) return -1;
  let t = 0;
  for (let o = 0; o < n; o++) {
    const i = e[o];
    if (i.trim() === "") continue;
    const r = ni.exec(i);
    if (!r) return -1;
    ti.includes(r[1]) && t++;
  }
  return t > 0 ? n : -1;
}
function ai(e) {
  const n = e.trim();
  return ii.test(n) ? oi(n.slice(1, -1))[0] ?? null : null;
}
function Wr(e, n) {
  let t = n + 1;
  for (; t < e.length && e[t].trim() === ""; ) t++;
  const o = ai(e[t] ?? "");
  return !!o && (Xn.includes(o.key) || ri.includes(o.key));
}
function Gr(e, n) {
  for (let t = n + 1; t < e.length; t++) {
    if (Ct.test(e[t])) return !0;
    if (e[t].trim() === "---" && Wr(e, t)) return !1;
  }
  return !1;
}
function Hr(e, n) {
  const t = [];
  let o = [], i = n, r = !1, a = !1, s = "before";
  for (let l = n; l < e.length; l++) {
    const c = e[l];
    if (!r && c.trim() !== "") {
      r = !0;
      const p = ai(c);
      a = (p?.key === "code" || p?.key === "diagram") && p.value === !0;
    }
    if (a && s === "before" && xt.test(c) ? s = Gr(e, l) ? "open" : "after" : s === "open" && Ct.test(c) && (s = "after"), s !== "open" && c.trim() === "---") {
      t.push({ start: i, end: l - 1, lines: o }), o = [], i = l + 1, r = !1, a = !1, s = "before";
      continue;
    }
    o.push(c);
  }
  return t.push({ start: i, end: e.length - 1, lines: o }), t;
}
function oi(e) {
  const n = [];
  let t = 0;
  const o = e.length;
  for (; t < o; ) {
    for (; t < o && /\s/.test(e[t]); ) t++;
    if (t >= o) break;
    let i = "";
    for (; t < o && !/[\s=]/.test(e[t]); ) i += e[t++];
    if (e[t] !== "=") {
      i && n.push({ key: i, value: !0 });
      continue;
    }
    t++;
    let r = "";
    if (e[t] === '"') {
      for (t++; t < o && e[t] !== '"'; )
        e[t] === "\\" && e[t + 1] === '"' ? (r += '"', t += 2) : r += e[t++];
      if (t >= o) {
        n.push({ key: i, value: r, unclosed: !0 });
        break;
      }
      t++;
    } else
      for (; t < o && !/\s/.test(e[t]); ) r += e[t++];
    n.push({ key: i, value: r });
  }
  return n;
}
function Zr(e) {
  return e.replace(/\t/g, "  ");
}
function Xr(e, n = {}) {
  try {
    return Yr(typeof e == "string" ? e : String(e ?? ""), n);
  } catch {
    return {
      deck: qr(n),
      warnings: [{ code: "internal-error", slideIndex: null, line: 0, message: "Parser error — please report" }]
    };
  }
}
function qr(e) {
  const n = (t) => {
    try {
      return t();
    } catch {
      return;
    }
  };
  return {
    header: {},
    hasHeader: !1,
    template: n(() => e.defaultTemplate) ?? Yn,
    lang: "id",
    handle: n(() => e.defaultHandle) ?? "",
    title: "",
    caption: "",
    slug: "carousel",
    slides: []
  };
}
function Yr(e, n) {
  const t = [], o = on(e), i = sn(o), r = {};
  if (i >= 0)
    for (let d = 0; d < i; d++) {
      const b = ni.exec(o[d]);
      if (!b) continue;
      const h = b[1], k = b[2].trim();
      if (!ti.includes(h)) {
        t.push({ code: "unknown-header-key", slideIndex: null, line: d, message: `Unknown header key "${h}"` });
        continue;
      }
      r[h] = k;
    }
  const a = n.templateFamily ?? sr;
  let s = n.defaultTemplate ?? Yn;
  if (r.template !== void 0)
    if (a(r.template)) s = r.template;
    else {
      const d = o.findIndex((b, h) => h < i && /^\s*template\s*:/.test(b));
      t.push({
        code: "unknown-template",
        slideIndex: null,
        line: Math.max(0, d),
        message: `Unknown template "${r.template}", using ${s}`
      });
    }
  let l = "id";
  if (r.lang !== void 0)
    if (Fn.includes(r.lang)) l = r.lang;
    else {
      const d = o.findIndex((b, h) => h < i && /^\s*lang\s*:/.test(b));
      t.push({
        code: "unknown-lang",
        slideIndex: null,
        line: Math.max(0, d),
        message: `Unknown lang "${r.lang}" (use ${Fn.join(" or ")}), using id`
      });
    }
  let c = !0;
  if (r.counter !== void 0) {
    if (r.counter === "off") c = !1;
    else if (r.counter !== "on") {
      const d = o.findIndex((b, h) => h < i && /^\s*counter\s*:/.test(b));
      t.push({
        code: "unknown-counter",
        slideIndex: null,
        line: Math.max(0, d),
        message: `Unknown counter "${r.counter}" (use on or off), using on`
      });
    }
  }
  const p = [];
  for (const d of Hr(o, i + 1)) {
    if (d.lines.every((h) => h.trim() === "")) continue;
    const b = Kr(d, p.length, t);
    p.push(b);
  }
  p.length > Sn && t.push({
    code: "long-deck",
    slideIndex: null,
    line: 0,
    message: `${p.length} slides. Carousels over ${Sn} slides tend to lose viewers`
  }), br(p, { autoBadge: a(s) !== "serene" }), n.photoIds && t.push(...Qr(p, n.photoIds));
  const m = p.find((d) => d.type === "cover") ?? p[0], y = m ? dr(m.headline).replace(/\n/g, " ") : "", g = r.title || y;
  return { deck: {
    header: r,
    hasHeader: i >= 0,
    template: s,
    lang: l,
    handle: r.handle ?? n.defaultHandle ?? "",
    title: g,
    caption: r.caption ?? "",
    ...c ? {} : { counter: !1 },
    slug: rn(g) || "carousel",
    slides: p
  }, warnings: t };
}
function Kr(e, n, t) {
  const o = e.lines;
  let i = 0;
  for (; i < o.length && o[i].trim() === ""; ) i++;
  let r = null;
  const a = {}, s = e.start + i, l = (w, d, b = s, h = !1) => {
    t.push({ code: w, slideIndex: n, line: b, message: d, ...h ? { hard: !0 } : {} });
  }, c = o[i]?.trim() ?? "";
  ii.test(c) && (oi(c.slice(1, -1)).forEach((d, b) => {
    if (d.unclosed && l("unknown-attr", `The quote in ${d.key}="… never closes; the rest of the tag became its value`), b === 0 && d.value === !0) {
      if (Xn.includes(d.key)) {
        r = d.key;
        return;
      }
      if (d.key !== "cta") {
        l("unknown-slide-type", `Unknown slide type "${d.key}", rendered as card`), r = "card";
        return;
      }
    }
    Jr(d, a, l);
  }), i++);
  const p = r ?? (n === 0 ? "cover" : "card"), m = [];
  for (; i < o.length; i++) m.push({ text: o[i], line: e.start + i });
  for (; m.length && m[0].text.trim() === ""; ) m.shift();
  const y = Vr(n, p, a, e);
  if (st(p))
    return p === "ayah" ? Or(y, m, l) : Pr(y, m, l), Rt(y, l), Ot(y), y;
  if (ot(p)) {
    if (p === "word") Er(y, m, l);
    else if (p === "compare") Fr(y, m, l);
    else {
      const w = m[0] && !m[0].text.trim().startsWith("|") ? m.shift() : void 0;
      w ? (y.headlineSrc = w.text.trim(), y.headline = [$e(y.headlineSrc)]) : l("missing-headline", "This slide has no headline"), xr(y, m, l);
    }
    return Rt(y, l), Ot(y), y;
  }
  const g = m.shift();
  return !g || (p === "code" || p === "diagram") && xt.test(g.text) ? (l("missing-headline", "This slide has no headline"), g && m.unshift(g)) : (y.headlineSrc = g.text.trim(), y.headline = [$e(y.headlineSrc)]), p === "code" ? ea(y, m, l) : p === "diagram" ? ta(y, m, l) : p === "quote" ? ia(y, m) : y.body = fe(m.map((w) => w.text)), Rt(y, l), Ot(y), y;
}
function Vr(e, n, t, o) {
  return {
    index: e,
    type: n,
    attrs: t,
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
    lines: [o.start, Math.max(o.start, o.end)],
    badge: null,
    counter: { i: e + 1, total: 0 },
    swipe: null,
    showCta: !1,
    contentIndex: -1
  };
}
function Jr(e, n, t) {
  const { key: o, value: i } = e;
  if (!ri.includes(o)) {
    t("unknown-attr", i === !0 ? `Unknown flag "${o}"` : `Unknown attribute "${o}"`);
    return;
  }
  if (o === "cta") {
    n.cta = i === !0 || i === "" ? !0 : i;
    return;
  }
  if (i === !0) {
    t("unknown-attr", `"${o}" needs a value, e.g. ${o}=…`);
    return;
  }
  switch (o) {
    case "number":
      i === "off" ? n.number = "off" : /^\d+$/.test(i) ? n.number = parseInt(i, 10) : t("unknown-attr", `number must be "off" or an integer, got "${i}"`);
      break;
    case "icon":
      i === "auto" || i === "none" || Vn(i) ? n.icon = i.toLowerCase() : t("unknown-attr", `Unknown icon "${i}"`);
      break;
    case "photo":
      n.photo = i;
      break;
    case "surface":
      n.surface = i;
      break;
    case "kicker":
      n.kicker = i;
      break;
    case "verdict":
      i.trim() ? n.verdict = i.trim() : t("unknown-attr", 'verdict needs a label, e.g. verdict="SAH"');
      break;
    case "tone":
      jr.includes(i) ? n.tone = i : t("unknown-attr", `tone must be ok, warn or bad, got "${i}"`);
      break;
  }
}
function Rt(e, n) {
  const t = e.attrs, o = (i) => {
    delete t[i], n("unknown-attr", `"${i}" doesn't apply to ${e.type} slides`);
  };
  t.icon !== void 0 && e.type === "cover" && o("icon"), (ot(e.type) || st(e.type)) && delete t.icon, t.cta !== void 0 && e.type === "cover" && o("cta"), t.number !== void 0 && e.type !== "card" && e.type !== "code" && e.type !== "diagram" && e.type !== "table" && o("number"), t.kicker !== void 0 && e.type !== "cover" && e.type !== "card" && e.type !== "quote" && o("kicker"), t.verdict !== void 0 && e.type !== "card" && e.type !== "diagram" && o("verdict"), t.tone !== void 0 && e.type !== "card" && e.type !== "diagram" && o("tone");
}
const Ht = /^\d+$/;
function Ot(e) {
  const n = e.attrs.photo;
  e.photoId = n === void 0 || Ht.test(n) ? null : n;
}
function Qr(e, n) {
  const t = [];
  for (const o of e) {
    const i = o.attrs.photo;
    if (i === void 0) continue;
    const r = Ht.test(i) ? n[parseInt(i, 10) - 1] : n.includes(i) ? i : void 0;
    if (o.photoId = r ?? null, r) continue;
    const a = Ht.test(i) ? `No photo ${i} in the tray (it has ${n.length})` : `No photo "${i}" in the tray`;
    t.push({ code: "unknown-photo", slideIndex: o.index, line: o.lines[0], message: a });
  }
  return t;
}
function ea(e, n, t) {
  const o = n.findIndex((m) => xt.test(m.text));
  if (o < 0) {
    t("code-missing-fence", "Code slide without a ``` fence, rendered as a card"), e.type = "card", e.body = fe(n.map((m) => m.text));
    return;
  }
  e.body = fe(n.slice(0, o).map((m) => m.text));
  const i = n[o], r = i.text.trim().slice(3).trim().toLowerCase(), a = n.slice(o + 1), s = a.findIndex((m) => Ct.test(m.text));
  let l, c = [];
  for (s < 0 ? (t("unclosed-fence", "Code fence is never closed", i.line), l = a.map((m) => m.text)) : (l = a.slice(0, s).map((m) => m.text), c = a.slice(s + 1).map((m) => m.text)); l.length && l[l.length - 1].trim() === ""; ) l.pop();
  const p = { text: l.map(Zr).join(`
`), lang: r };
  e.code = p, e.note = fe(c);
}
function ta(e, n, t) {
  const o = n.findIndex((m) => xt.test(m.text));
  if (o < 0) {
    t("diagram-missing", "Diagram slide without a ``` fence, rendered as a card"), e.type = "card", e.body = fe(n.map((m) => m.text));
    return;
  }
  e.body = fe(n.slice(0, o).map((m) => m.text));
  const i = n[o], r = i.text.trim().slice(3).trim().toLowerCase(), a = n.slice(o + 1), s = a.findIndex((m) => Ct.test(m.text)), l = s < 0 ? a : a.slice(0, s);
  s < 0 && t("unclosed-fence", "Diagram fence is never closed", i.line);
  const { diagram: c, issues: p } = $r(r, l.map((m) => m.text));
  for (const m of p) t("diagram-line", m.message, m.offset < 0 ? i.line : l[m.offset].line);
  e.diagram = c, e.note = fe(s < 0 ? [] : a.slice(s + 1).map((m) => m.text));
}
const na = /^(—|--|-)\s+(.*)$/;
function ia(e, n) {
  const t = n.findIndex((i) => i.text.trim() !== ""), o = t >= 0 ? na.exec(n[t].text.trim()) : null;
  o && (e.attribution = o[2].trim()), e.body = fe(n.filter((i, r) => !o || r !== t).map((i) => i.text));
}
function Zt(e) {
  const n = e.trim();
  if (n.startsWith("#")) {
    let o = n.slice(1);
    o.length === 3 && (o = o.split("").map((r) => r + r).join(""));
    const i = parseInt(o.slice(0, 6), 16);
    return { r: i >> 16 & 255, g: i >> 8 & 255, b: i & 255, a: 1 };
  }
  const t = /rgba?\(([^)]+)\)/.exec(n);
  if (t) {
    const [o = 0, i = 0, r = 0, a = 1] = t[1].split(",").map((s) => parseFloat(s));
    return { r: o, g: i, b: r, a };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}
function be(e, n) {
  const { r: t, g: o, b: i, a: r } = Zt(e);
  return `rgba(${t},${o},${i},${+(r * n).toFixed(4)})`;
}
function ra(e, n) {
  return {
    r: e.r * e.a + n.r * (1 - e.a),
    g: e.g * e.a + n.g * (1 - e.a),
    b: e.b * e.a + n.b * (1 - e.a),
    a: 1
  };
}
function Pt(e) {
  const n = e / 255;
  return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}
function zn(e) {
  return 0.2126 * Pt(e.r) + 0.7152 * Pt(e.g) + 0.0722 * Pt(e.b);
}
function Ie(e, n) {
  const t = Zt(n), o = ra(Zt(e), t), i = zn(o), r = zn(t);
  return (Math.max(i, r) + 0.05) / (Math.min(i, r) + 0.05);
}
const aa = ["text", "prompt", "command", "subcommand", "flag", "string", "number", "keyword", "fn", "punct"], oa = /^(#[0-9a-f]{3}|#[0-9a-f]{6}|#[0-9a-f]{8}|rgba?\([^)]*\))$/i, sa = /^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
function la(e, n) {
  const t = [], o = (i, r, a) => {
    r >= a || t.push(`${i} ${r.toFixed(2)} < ${a}`);
  };
  if (o("ink/bg", Ie(e.ink, e.bg), 4.5), o("ink/blob", Ie(e.ink, e.blob), 4.5), o("body/bg", Ie(e.body, e.bg), 4.5), o("body/blob", Ie(e.body, e.blob), 4.5), o("badgeInk/badgeBg", Ie(e.badgeInk, e.badgeBg), 3), o("muted/bg", Ie(e.muted, e.bg), 3), n) for (const [i, r] of Object.entries(n)) o(`semantic.${i}/bg`, Ie(r, e.bg), 3);
  return t;
}
function ca(e) {
  const n = [];
  for (const o of aa) {
    const i = Ie(e[o], e.panel);
    i >= 4.5 || n.push(`code.${o} ${i.toFixed(2)} < 4.5`);
  }
  const t = Ie(e.comment, e.panel);
  return t >= 3 || n.push(`code.comment ${t.toFixed(2)} < 3`), n;
}
function ha(e, n) {
  const t = [];
  if ((typeof e?.id != "string" || !sa.test(e.id)) && t.push(`id "${String(e?.id)}" must look like "family-or-host/name" (lowercase, digits, -)`), n.includes(e?.family) || t.push(`family "${String(e?.family)}" is not one of ${n.join(", ")}`), (!e?.fonts?.sans || !e.fonts.mono) && t.push("fonts.sans and fonts.mono are required"), e?.surfaces?.deep || t.push("surfaces.deep is required"), e?.onPhoto || t.push("onPhoto is required"), e?.code || t.push("code is required"), !Array.isArray(e?.rotation) || !e.rotation.length) t.push("rotation needs at least one surface name");
  else for (const i of e.rotation) e.surfaces?.[i] || t.push(`rotation names unknown surface "${i}"`);
  if (t.length) return t;
  const o = [
    ...Object.entries(e.surfaces).flatMap(([i, r]) => Object.entries(r).map(([a, s]) => [`surfaces.${i}.${a}`, s])),
    ...Object.entries(e.onPhoto).map(([i, r]) => [`onPhoto.${i}`, r]),
    ...Object.entries(e.code).filter(([i]) => i !== "dots").map(([i, r]) => [`code.${i}`, r])
  ];
  for (const [i, r] of o) (typeof r != "string" || !oa.test(r.trim())) && t.push(`${i} "${String(r)}" is not #RGB, #RRGGBB or rgb(a)()`);
  if (t.length) return t;
  for (const [i, r] of Object.entries(e.surfaces))
    try {
      t.push(...la(r, e.semantic).map((a) => `surfaces.${i}: ${a}`));
    } catch (a) {
      t.push(`surfaces.${i}: ${a instanceof Error ? a.message : String(a)}`);
    }
  try {
    t.push(...ca(e.code));
  } catch (i) {
    t.push(`code: ${i instanceof Error ? i.message : String(i)}`);
  }
  return t;
}
const _e = (e, n, t, o, i, r, a, s, l, c) => ({ bg: e, ink: n, body: t, muted: o, accent: i, badgeBg: r, badgeInk: a, blob: s, icon: l, inlineCodeBg: c }), lt = {
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
}, ct = {
  bg: "#000000",
  ink: "#FFFFFF",
  body: "rgba(255,255,255,0.90)",
  muted: "rgba(255,255,255,0.75)",
  icon: "#FFFFFF",
  blob: "rgba(0,0,0,0)",
  inlineCodeBg: "rgba(255,255,255,0.18)"
}, da = {
  id: "editorial/rose-dusk",
  name: "Rose Dusk",
  family: "editorial",
  fonts: { serif: "Playfair Display", sans: "Poppins", mono: "JetBrains Mono" },
  surfaces: {
    cream: _e("#F4ECE1", "#1F2A2E", "#3B4246", "#6B6F70", "#A8564C", "#C9786B", "#FFFFFF", "#EBCFC4", "#C0695C", "#E9DFD1"),
    blush: _e("#E9C4BA", "#1F2A2E", "#33393C", "#5E5555", "#7E3E35", "#2F4036", "#F4ECE1", "#E0B3A6", "#2F4036", "#DDB3A8"),
    forest: _e("#2F4036", "#F4ECE1", "#DCD5CA", "#AEB3A9", "#F0C2B5", "#E9C4BA", "#1F2A2E", "#3A4E42", "#E9C4BA", "#3D5145"),
    deep: _e("#262C3D", "#F7EFE6", "#D9D2CB", "#A9A6AE", "#F0CFC4", "#F0CFC4", "#1F2A2E", "#323A50", "#F0CFC4", "#343B50")
  },
  rotation: ["cream", "blush", "forest"],
  onPhoto: { ...ct, accent: "#F6D3C8", badgeBg: "#F0CFC4", badgeInk: "#1F2A2E", tint: "#140E16" },
  code: lt,
  deco: { blobs: !0, dotGrid: !1, scanlines: !1, glow: !1, bigGlyph: null },
  swatches: ["#C9786B", "#F4ECE1", "#2F4036", "#262C3D"]
}, fa = {
  id: "editorial/sage",
  name: "Sage",
  family: "editorial",
  fonts: { serif: "Lora", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    linen: _e("#F1EEE4", "#22291F", "#3E463A", "#6A7064", "#4F6447", "#5F7457", "#FFFFFF", "#E1E5D5", "#5F7457", "#E4E1D4"),
    moss: _e("#CFD8C3", "#1E241B", "#32392E", "#545C4E", "#3B4C34", "#3E4A3A", "#F1EEE4", "#C0CCB2", "#3E4A3A", "#C0CAB3"),
    olive: _e("#3E4A3A", "#F1EEE4", "#DADCCF", "#AEB2A3", "#E6C59F", "#D9B48F", "#22291F", "#4A5845", "#D9B48F", "#4C5947"),
    deep: _e("#2A3127", "#F1EEE4", "#D3D6C8", "#A3A897", "#D9B48F", "#D9B48F", "#22291F", "#353E31", "#D9B48F", "#384134")
  },
  rotation: ["linen", "moss", "olive"],
  onPhoto: { ...ct, accent: "#E8D2B0", badgeBg: "#D9B48F", badgeInk: "#1F2A2E", tint: "#12160F" },
  code: {
    ...lt,
    panel: "#2A3127",
    border: "#2A3127",
    text: "#F1EEE4",
    prompt: "#D9B48F",
    subcommand: "#C7D6B5",
    flag: "#E6C59F",
    string: "#BFD9AE"
  },
  deco: { blobs: !0, dotGrid: !1, scanlines: !1, glow: !1, bigGlyph: null },
  swatches: ["#6F8466", "#F1EEE4", "#3E4A3A", "#D9B48F"]
}, ua = {
  id: "editorial/midnight",
  name: "Midnight",
  family: "editorial",
  fonts: { serif: "Playfair Display", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    navy: _e("#1B2333", "#F3E9D7", "#D2C9B8", "#9C9787", "#E8B378", "#E0A060", "#1B2333", "#232D42", "#E0A060", "#283248"),
    plum: _e("#2B2236", "#F3E9D7", "#D6CACB", "#A2969E", "#EBB884", "#E0A060", "#1B2333", "#352A43", "#E0A060", "#3A2F48"),
    slate: _e("#22303A", "#F3E9D7", "#CBD1D0", "#96A0A2", "#E8B378", "#F3E9D7", "#1B2333", "#2B3C48", "#F3E9D7", "#2F404C"),
    deep: _e("#141A26", "#F3E9D7", "#CFC6B5", "#948F80", "#E8B378", "#E0A060", "#141A26", "#1E2636", "#E0A060", "#222B3C")
  },
  rotation: ["navy", "plum", "slate"],
  onPhoto: { ...ct, accent: "#F2C58F", badgeBg: "#E0A060", badgeInk: "#141A26", tint: "#0B0F18" },
  code: {
    ...lt,
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
  deco: { blobs: !0, dotGrid: !1, scanlines: !1, glow: !1, bigGlyph: null },
  swatches: ["#E0A060", "#1B2333", "#2B2236", "#F3E9D7"]
}, pa = {
  id: "editorial/stone",
  name: "Stone",
  family: "editorial",
  fonts: { serif: "Playfair Display", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    stone: _e("#EDEAE4", "#1E1E1C", "#3C3B37", "#6C6A64", "#9A4B2F", "#2B2A27", "#EDEAE4", "#E2DED6", "#9A4B2F", "#E2DED6"),
    slate: _e("#2B2A27", "#EDEAE4", "#D2CEC6", "#A19D94", "#E39A7A", "#E39A7A", "#2B2A27", "#35332F", "#E39A7A", "#3A3834"),
    deep: _e("#1B1A18", "#EDEAE4", "#CFCBC3", "#9C988F", "#E39A7A", "#E39A7A", "#1B1A18", "#262522", "#E39A7A", "#2A2926")
  },
  rotation: ["stone", "stone", "slate"],
  // Not in the brief: photo and code tokens follow midnight/sage, in the stone palette.
  onPhoto: { ...ct, accent: "#F0B597", badgeBg: "#E39A7A", badgeInk: "#1B1A18", tint: "#100F0E" },
  code: {
    ...lt,
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
  deco: { blobs: !0, dotGrid: !1, scanlines: !1, glow: !1, bigGlyph: null },
  swatches: ["#EDEAE4", "#9A4B2F", "#2B2A27", "#E39A7A"]
}, Bt = (e, n, t, o, i, r, a) => ({
  id: `editorial/ruang-${e}`,
  name: `Ruang ${n}`,
  family: "editorial",
  fonts: { serif: "Fraunces", sans: "Instrument Sans", mono: "JetBrains Mono" },
  surfaces: { [e]: t, deep: t },
  rotation: [e],
  onPhoto: { ...ct, accent: o, badgeBg: o, badgeInk: "#1B1A19", tint: i },
  code: { ...lt, panel: r, border: r },
  deco: { blobs: !1, dotGrid: !1, scanlines: !1, glow: !1, bigGlyph: null },
  swatches: a,
  headlineWeight: 500
}), ma = Bt(
  "kunyit",
  "Kunyit",
  _e("#F2C14E", "#241A0C", "#3B2C14", "#6E5524", "#8A2F14", "#241A0C", "#F2C14E", "#F2C14E", "#8A2F14", "#E5B23F"),
  "#FFD877",
  "#1A1206",
  "#241A0C",
  ["#F2C14E", "#241A0C", "#8A2F14", "#FFF1C9"]
), ga = Bt(
  "bata",
  "Bata",
  _e("#5E1F1C", "#FBE9DF", "#F0D4C8", "#D4A597", "#FFB08F", "#FFB08F", "#3A1210", "#5E1F1C", "#FFB08F", "#73302C"),
  "#FFB08F",
  "#1A0807",
  "#3A1210",
  ["#5E1F1C", "#FBE9DF", "#FFB08F", "#3A1210"]
), ba = Bt(
  "daun",
  "Daun",
  _e("#2D4632", "#F1EBDD", "#D9DECB", "#A9B79E", "#EBC872", "#EBC872", "#1E2B20", "#2D4632", "#EBC872", "#3A563F"),
  "#EBC872",
  "#0E160F",
  "#1E2B20",
  ["#2D4632", "#F1EBDD", "#EBC872", "#1E2B20"]
), wa = Bt(
  "malam",
  "Malam",
  _e("#131621", "#EDE6DA", "#CFC8BC", "#8F8A84", "#F4B860", "#F4B860", "#131621", "#131621", "#F4B860", "#22263A"),
  "#F4B860",
  "#07080D",
  "#0B0D14",
  ["#131621", "#EDE6DA", "#F4B860", "#22263A"]
), ya = [da, fa, ua, pa, ma, ga, ba, wa], Ze = (e, n, t, o, i, r, a, s, l, c) => ({ bg: e, ink: n, body: t, muted: o, accent: i, badgeBg: r, badgeInk: a, blob: s, icon: l, inlineCodeBg: c }), ln = {
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
}, si = {
  id: "dev/github-dark",
  name: "GitHub Dark",
  family: "dev",
  fonts: { sans: "Inter", mono: "JetBrains Mono" },
  surfaces: {
    main: Ze("#0D1117", "#F0F6FC", "#C9D1D9", "#8B949E", "#3FB950", "#3FB950", "#0D1117", "#0D1117", "#3FB950", "#1F2630"),
    deep: Ze("#0A0D12", "#F0F6FC", "#C9D1D9", "#8B949E", "#3FB950", "#3FB950", "#0A0D12", "#0A0D12", "#3FB950", "#1F2630")
  },
  rotation: ["main"],
  onPhoto: ln,
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
    blobs: !1,
    dotGrid: !0,
    scanlines: !1,
    glow: !0,
    bigGlyph: "$_",
    dotColor: "rgba(255,255,255,0.05)",
    glowAlpha: 0.08
  },
  swatches: ["#0D1117", "#161B22", "#3FB950", "#F0F6FC"]
}, ka = {
  id: "dev/terminal",
  name: "Terminal",
  family: "dev",
  fonts: { sans: "JetBrains Mono", mono: "JetBrains Mono" },
  surfaces: {
    main: Ze("#0B0F0C", "#D7FBD9", "#A9C9AB", "#6B8A6E", "#39D353", "#39D353", "#0B0F0C", "#0B0F0C", "#39D353", "#16201A"),
    deep: Ze("#070A08", "#D7FBD9", "#A9C9AB", "#6B8A6E", "#39D353", "#39D353", "#070A08", "#070A08", "#39D353", "#16201A")
  },
  rotation: ["main"],
  onPhoto: { ...ln, accent: "#39D353", badgeBg: "#39D353", badgeInk: "#0B0F0C" },
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
  deco: { blobs: !1, dotGrid: !1, scanlines: !0, glow: !0, bigGlyph: ">_", glowAlpha: 0.06 },
  swatches: ["#0B0F0C", "#101712", "#39D353", "#D7FBD9"],
  headlineWeight: 700,
  headlinePrefix: "> "
}, _a = {
  id: "dev/paper-light",
  name: "Paper Light",
  family: "dev",
  fonts: { sans: "Inter", mono: "JetBrains Mono" },
  surfaces: {
    main: Ze("#F7F5F0", "#16181D", "#3A3F47", "#6B7079", "#1D4ED8", "#2563EB", "#FFFFFF", "#F7F5F0", "#2563EB", "#ECE8DE"),
    deep: Ze("#EFECE4", "#16181D", "#3A3F47", "#6B7079", "#1D4ED8", "#2563EB", "#FFFFFF", "#EFECE4", "#2563EB", "#E4DFD3")
  },
  rotation: ["main"],
  onPhoto: ln,
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
  deco: { blobs: !1, dotGrid: !0, scanlines: !1, glow: !1, bigGlyph: "{ }", dotColor: "rgba(0,0,0,0.06)" },
  swatches: ["#F7F5F0", "#FFFFFF", "#2563EB", "#16181D"]
}, va = [si, ka, _a], Ea = () => ({ serif: [500, 600, 700], sans: [400, 500, 600], mono: [400, 500, 600] }), Lt = {
  headerRight: "rule",
  coverSwipeIcon: !0,
  displayFace: "serif",
  weights: Ea
}, Fa = {
  editorial: { ...Lt, icons: { pool: gt, fallback: "auto" } },
  // Lexicon and serene decks are icon-free unless a slide asks for one.
  lexicon: { ...Lt, icons: { pool: gt, fallback: "none" } },
  serene: { ...Lt, icons: { pool: gt, fallback: "none" } },
  dev: {
    headerRight: "path",
    coverSwipeIcon: !1,
    displayFace: "sans",
    icons: { pool: Gt, fallback: "none" },
    weights: (e) => ({ sans: [400, 500, 600, 700, e.headlineWeight ?? 800], mono: [400, 500, 600, 700] })
  },
  sport: {
    headerRight: "rule",
    coverSwipeIcon: !1,
    displayFace: "serif",
    icons: { pool: Gt, fallback: "none" },
    weights: (e) => ({ serif: [700, e.headlineWeight ?? 800], sans: [400, 500, 600, 700], mono: [400, 500, 600, 700] })
  }
};
function Ke(e) {
  return Fa[e.family];
}
function li(e) {
  return Ke(e).displayFace === "sans" ? e.fonts.sans : e.fonts.serif ?? e.fonts.sans;
}
const ue = { w: 1080, h: 1920 }, he = { left: 96, right: 912, top: 196, bottom: 1500 }, V = he.right - he.left, ke = {
  headerBaseline: 236,
  stackTopCard: 344,
  // Footer and stack limit moved up 32 px from DESIGN §2 (1472/1400) for more room above TikTok's caption (owner, Oct 2026).
  stackLimit: 1376,
  footerBaseline: 1440
}, Se = { size: 88, border: 8, padX: 28, padY: 14, radius: 14, capHeight: 0.7 }, cn = {
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
function ci(e) {
  return { family: li(e), weight: e.headlineWeight ?? 700, size: Se.size };
}
function Xt(e, n, t, o) {
  const i = e.attrs.verdict;
  if (!i) return null;
  const r = i.toUpperCase(), a = Math.min(V, t.width(r, ci(n)) + Se.padX * 2 + Se.border * 2);
  return { kind: "verdict", h: Math.round(Se.size * Se.capHeight + Se.padY * 2 + Se.border * 2), w: a, gap: o, label: r };
}
function hi(e, n) {
  return e.diagram ? { kind: "diagram", h: cn.h, w: V, gap: n } : null;
}
function Dn(e, n, t) {
  const o = t ?? "ok";
  return e.semantic ? e.semantic[o] : o === "bad" ? n.ink : n.accent;
}
const wt = "$ ";
function di(e) {
  return e === "bash" || e === "sh" || e === "shell" || e === "zsh";
}
function fi(e, n) {
  const t = e.split(`
`), o = di(n);
  let i = !1;
  return t.map((r) => {
    const a = o && i;
    if (i = /\\\s*$/.test(r), !o) return { prompt: !1, text: r, continuation: !1 };
    if (r.startsWith(wt)) return { prompt: !0, text: r.slice(wt.length), continuation: a };
    const s = r.trimStart();
    return { prompt: s !== "" && !s.startsWith("#") && !a, text: r, continuation: a };
  });
}
function Aa(e) {
  return (e.prompt ? wt : "") + e.text;
}
function xa(e, n, t, o, i, r) {
  const a = (s) => e.reduce((l, c) => Math.max(l, r.width(Aa(c), { family: t, weight: o, size: s })), 0);
  for (let s = i.max; s >= i.min; s -= i.step) {
    const l = a(s);
    if (l <= n) return { size: s, fits: !0, widest: l };
  }
  return { size: i.min, fits: !1, widest: a(i.min) };
}
const Ge = { scale: 0.9, padX: 10, padY: 6, radius: 8 }, ui = 0.6;
function pi(e) {
  return { family: e.mono.family, weight: e.mono.weight, size: Math.round(e.font.size * Ge.scale) };
}
function mi(e, n, t) {
  return e.style === "code" ? t.width(e.text, pi(n)) + Ge.padX * 2 : t.width(e.text, n.font);
}
function qt(e, n, t) {
  let o = 0;
  for (const i of e) o += mi(i, n, t);
  return o;
}
function Ca(e) {
  const n = [];
  let t = [];
  const o = (i, r) => {
    if (!i) return;
    const a = t[t.length - 1];
    a && a.style === r ? a.text += i : t.push({ text: i, style: r });
  };
  for (const i of e) {
    if (i.style === "code") {
      o(i.text, "code");
      continue;
    }
    const r = i.text.split(/( +)/);
    for (const a of r)
      /^ +$/.test(a) ? (t.length && n.push(t), t = []) : o(a, i.style);
  }
  return t.length && n.push(t), n;
}
function Ba(e, n, t, o) {
  const i = [];
  let r = [];
  for (const a of e)
    for (const s of Array.from(a.text)) {
      const l = r[r.length - 1], c = l && l.style === a.style ? [...r.slice(0, -1), { text: l.text + s, style: a.style }] : [...r, { text: s, style: a.style }];
      r.length && qt(c, t, o) > n ? (i.push(r), r = [{ text: s, style: a.style }]) : r = c;
    }
  return (r.length || !i.length) && i.push(r), i;
}
function hn(e, n, t, o, i = {}) {
  const r = o.width(" ", t.font), a = (p) => p.reduce((m, y, g) => m + qt(y, t, o) + (g ? r : 0), 0);
  let s = !1;
  const l = [];
  return e.forEach((p, m) => {
    p.forEach((y, g) => {
      const w = [];
      let d = [];
      for (const b of Ca(y)) {
        if (qt(b, t, o) > n) {
          s = !0, d.length && w.push({ words: d, paraStart: !1 });
          const k = Ba(b, n, t, o);
          k.slice(0, -1).forEach((_) => w.push({ words: [_], paraStart: !1 })), d = [k[k.length - 1]];
          continue;
        }
        d.length && a([...d, b]) > n ? (w.push({ words: d, paraStart: !1 }), d = [b]) : d.push(b);
      }
      if (w.push({ words: d, paraStart: !1 }), i.widowFix && w.length >= 2) {
        const b = w[w.length - 1], h = w[w.length - 2];
        if (b.words.length === 1 && h.words.length >= 3) {
          const k = [h.words[h.words.length - 1], ...b.words];
          a(k) <= n && (h.words = h.words.slice(0, -1), b.words = k);
        }
      }
      m > 0 && g === 0 && w[0] && (w[0].paraStart = !0), l.push(...w);
    });
  }), { lines: l.map((p) => {
    const m = [];
    let y = 0;
    return p.words.forEach((g, w) => {
      w && (y += r);
      for (const d of g) {
        const b = mi(d, t, o);
        m.push({ text: d.text, style: d.style, x: y, w: b }), y += b;
      }
    }), { runs: m, width: y, paraStart: p.paraStart };
  }), charBroken: s };
}
function dn(e, n, t) {
  if (!e.length) return 0;
  const o = e.filter((i) => i.paraStart).length;
  return e.length * n * t + o * ui * n;
}
function Yt(e, n, t, o) {
  const i = [];
  let r = n + t * 0.92;
  return e.forEach((a, s) => {
    s > 0 && (r += t * o), a.paraStart && (r += ui * t), i.push(r);
  }), i;
}
const ft = ["body", "note", "code", "subtitle", "headline"];
function Sa(e) {
  return e.kind === "code" ? "code" : e.kind === "text" ? e.role === "quote" ? "headline" : e.role : null;
}
function gi(e, n, t) {
  let o = e.slice();
  const i = /* @__PURE__ */ new Map();
  for (const h of o) {
    if (h.kind !== "code") continue;
    const k = n.width - h.spec.padX * 2, _ = xa(h.lines, k, h.spec.family, h.spec.weight, h.spec, t);
    i.set(h, _);
  }
  const r = /* @__PURE__ */ new Map();
  for (const h of o)
    h.kind === "text" ? r.set(h, h.spec.max) : h.kind === "code" && r.set(h, i.get(h).size);
  const a = (h) => {
    if (h.kind === "text") {
      const k = r.get(h), _ = hn(h.rich, n.width, {
        font: { family: h.spec.family, weight: h.spec.weight, size: k },
        mono: h.spec.mono
      }, t, { widowFix: h.spec.widowFix }), x = _.lines.reduce((F, B) => Math.max(F, B.width), 0);
      return { h: dn(_.lines, k, h.spec.lh), w: x, wrap: _, tooManyLines: _.lines.length > h.spec.maxLines };
    }
    if (h.kind === "code") {
      const k = r.get(h), _ = h.spec.titleBar + h.spec.padTop + h.spec.padBottom + h.lines.length * k * h.spec.lh, x = i.get(h).fits && k <= i.get(h).size;
      return { h: _, w: n.width, tooManyLines: h.lines.length > h.spec.maxLines, codeFits: x };
    }
    return { h: h.h, w: h.w, tooManyLines: !1 };
  }, s = () => {
    const h = o.map(a);
    let k = n.top;
    return h.forEach((_, x) => {
      x > 0 && (k += o[x].gap), k += _.h;
    }), { ms: h, bottom: k };
  }, l = (h) => (h.kind === "text" || h.kind === "code") && r.get(h) > h.spec.min, c = (h) => {
    h.kind !== "text" && h.kind !== "code" || r.set(h, Math.max(h.spec.min, r.get(h) - h.spec.step));
  };
  let p = !1, m = 0, y = s();
  for (let h = 0; h < 500; h++) {
    const k = y.ms.some((F) => F.tooManyLines);
    if (y.bottom <= n.limit && !k) break;
    if (!p && o.some((F) => F.kind === "icon")) {
      o = o.filter((F) => F.kind !== "icon"), p = !0, y = s();
      continue;
    }
    const _ = o.find((F, B) => y.ms[B].tooManyLines && l(F) && F.kind === "text");
    if (_) {
      c(_), y = s();
      continue;
    }
    let x = !1;
    for (let F = 0; F < ft.length && !x; F++) {
      const B = ft[(m + F) % ft.length], z = o.filter((D) => Sa(D) === B && l(D));
      z.length && (z.forEach(c), m = (m + F + 1) % ft.length, x = !0);
    }
    if (!x) break;
    y = s();
  }
  const g = [];
  let w = n.top;
  y.ms.forEach((h, k) => {
    const _ = o[k];
    k > 0 && (w += _.gap), g.push({
      item: _,
      x: n.x,
      y: w,
      w: h.w,
      h: h.h,
      size: _.kind === "text" || _.kind === "code" ? r.get(_) : 0,
      wrap: h.wrap,
      codeFits: h.codeFits
    }), w += h.h;
  });
  const d = y.ms.some((h) => h.tooManyLines), b = [...i.values()].some((h) => !h.fits);
  return {
    placed: g,
    bottom: w,
    overflow: y.bottom > n.limit || d,
    codeTooLong: b,
    charBroken: y.ms.some((h) => h.wrap?.charBroken),
    droppedIcon: p
  };
}
const za = {
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
function Pe(e, n) {
  return za[e][n];
}
function Da(e) {
  const n = /\s*→\s*$/.exec(e);
  return n ? { text: e.slice(0, n.index), arrow: !0 } : { text: e, arrow: !1 };
}
const ne = {
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
function St(e, n, t, o) {
  if (t) return { surface: e.onPhoto, name: "onPhoto", onPhoto: !0 };
  let r = n.contentIndex >= 0 ? e.rotation[n.contentIndex % e.rotation.length] : "deep";
  const a = n.attrs.surface;
  return a && a !== "auto" && (e.surfaces[a] ? r = a : o.push({
    code: "unknown-attr",
    slideIndex: n.index,
    line: n.lines[0],
    message: `Unknown surface "${a}" for ${e.id} (has: ${Object.keys(e.surfaces).join(", ")})`
  })), { surface: e.surfaces[r], name: r, onPhoto: !1 };
}
function In(e, n, t, o) {
  if (o.width(e, t) <= n) return e;
  const i = Array.from(e);
  for (; i.length && o.width(i.join("") + "…", t) > n; ) i.pop();
  return i.join("") + "…";
}
function Ia(e) {
  const n = e.slides.find((o) => o.type === "cover")?.attrs.kicker;
  return (n ? rn(n.split(/[•·|]/)[0] ?? "", ne.pathTopicMax) : "") || e.slug;
}
function zt(e, n, t, o) {
  const i = e.measurer, r = { family: n, weight: ne.handleWeight, size: ne.handleSize }, a = In(e.deck.handle, ne.handleMax, r, i), s = ke.headerBaseline - ne.handleSize;
  if (a && o.push({ x: he.left, y: s, w: i.width(a, r), h: ne.handleSize * 1.25, kind: "handle" }), Ke(e.variant).headerRight === "path") {
    const c = { family: t, weight: 500, size: ne.pathSize }, p = In(`~/${Ia(e.deck)}`, ne.pathMax, c, i), m = i.width(p, c);
    return o.push({ x: he.right - m, y: ke.headerBaseline - ne.pathSize, w: m, h: ne.pathSize * 1.25, kind: "path" }), { handle: a, handleFont: r, right: { kind: "path", text: p, font: c } };
  }
  const l = ne.rule;
  return o.push({ x: l.x1, y: l.y, w: l.x2 - l.x1, h: l.h, kind: "rule" }), { handle: a, handleFont: r, right: { kind: "rule", ...l } };
}
function Dt(e, n, t, o, i) {
  const r = e.measurer, { slide: a, deck: s } = e, l = ke.footerBaseline - ne.footerSize, c = ne.footerSize * 1.25;
  let p = null;
  if (a.swipe) {
    const w = { family: n, weight: 500, size: ne.footerSize }, d = Da(Pe(a.swipe, s.lang)), b = a.swipe === "coverSwipe" && i ? "circle-arrow" : null;
    let h = r.width(d.text, w);
    d.arrow && (h += ne.arrowGap + ne.arrowSize), b && (h += ne.circleArrowSize + ne.circleArrowGap), p = { text: d.text, arrow: d.arrow, leadIcon: b, font: w, w: h }, o.push({ x: he.left, y: l, w: h, h: c, kind: "swipe" });
  }
  if (s.counter === !1) return { swipe: p, counter: null };
  const m = { family: t, weight: 500, size: ne.counterSize }, y = `${a.counter.i}/${a.counter.total}`, g = r.width(y, m);
  return o.push({ x: he.right - g, y: l, w: g, h: c, kind: "counter" }), { swipe: p, counter: { text: y, font: m, w: g } };
}
function bi(e, n) {
  return e.showCta ? typeof e.attrs.cta == "string" && e.attrs.cta ? e.attrs.cta : Pe("cta", n.lang) : null;
}
function bt(e, n, t) {
  const o = ne.cta, i = o.padX * 2 + o.icon + o.gap + t.width(e, { family: n, weight: o.weight, size: o.size });
  return Math.min(i, V);
}
function Ta(e, n) {
  if (!n || !e.length) return e;
  const [t, ...o] = e, [i, ...r] = t;
  return [[[{ text: n.trimEnd(), style: "accent" }, { text: " ", style: "plain" }, ...i ?? []], ...r], ...o];
}
const Tn = 8;
function wi(e, n, t) {
  const o = e.placed[0];
  if (t || e.overflow || !o) return 0;
  const i = yi(o.y, e.bottom, n);
  for (const r of e.placed) r.y += i;
  return e.bottom += i, i;
}
function yi(e, n, t) {
  const o = t + Math.floor((ke.stackLimit - t - (n - e)) / 2 / Tn) * Tn;
  return Math.max(t, o) - e;
}
function ki(e) {
  return { x: he.left, width: V, top: e, limit: ke.stackLimit };
}
function _i(e, n) {
  const t = [], o = e.lines[0];
  return n.codeTooLong && t.push({ code: "code-line-too-long", slideIndex: e.index, line: o, message: `Slide ${e.index + 1}: a code line is too long and gets clipped` }), n.overflow && t.push({ code: "overflow", slideIndex: e.index, line: o, message: `Slide ${e.index + 1}: text doesn't fit` }), n.charBroken && t.push({ code: "long-word", slideIndex: e.index, line: o, message: `Slide ${e.index + 1}: a word is too long and was broken` }), t;
}
function vi(e) {
  return e.placed.map((n) => ({ x: n.x, y: n.y, w: n.item.kind === "code" ? V : n.w, h: n.h, kind: n.item.kind === "text" ? n.item.role : n.item.kind }));
}
const Ma = "Gentium Book Plus";
class fn {
  sizes = /* @__PURE__ */ new Map();
  specs = /* @__PURE__ */ new Map();
  cursor = 0;
  constructor(n) {
    for (const [t, o] of Object.entries(n))
      this.specs.set(t, o), this.sizes.set(t, o.max);
  }
  get(n) {
    return this.sizes.get(n);
  }
  /** Step the next block in `order` (round-robin) that can still shrink. False when none can. */
  stepDown(n, t) {
    if (t && this.canStep(t))
      return this.step(t), !0;
    for (let o = 0; o < n.length; o++) {
      const i = n[(this.cursor + o) % n.length];
      if (this.canStep(i))
        return this.step(i), this.cursor = (this.cursor + o + 1) % n.length, !0;
    }
    return !1;
  }
  canStep(n) {
    const t = this.specs.get(n);
    return !!t && this.sizes.get(n) > t.min;
  }
  step(n) {
    const t = this.specs.get(n);
    this.sizes.set(n, Math.max(t.min, this.sizes.get(n) - t.step));
  }
}
function ye(e, n, t, o, i) {
  const r = hn(e, n, t, i), a = r.lines.reduce((s, l) => Math.max(s, l.width), 0);
  return { lines: r.lines, h: dn(r.lines, t.font.size, o), w: a, charBroken: r.charBroken };
}
function yt(e, n, t, o) {
  return o.width(e, n) + t * Math.max(0, Array.from(e).length - 1);
}
function Ei(e) {
  const n = [];
  for (const t of e)
    switch (t.k) {
      case "text": {
        const o = t.lines.reduce((r, a) => Math.max(r, a.width), 0), i = t.centerW === void 0 ? t.x : t.x + (t.centerW - o) / 2;
        n.push({ x: i, y: t.y, w: o, h: dn(t.lines, t.size, t.lh), kind: "lex-text" });
        break;
      }
      case "arabic": {
        const o = t.widths.map((a, s) => a + (t.mark && s === t.widths.length - 1 ? t.mark.gap + t.mark.w : 0)), i = Math.max(0, ...o), r = t.align === "center" ? t.x + (t.w - i) / 2 : t.x + t.w - i;
        n.push({ x: r, y: t.y, w: i, h: t.lines.length * t.size * t.lh, kind: "arabic" });
        break;
      }
      case "pill":
      case "badge":
      case "rect":
      case "frame":
        n.push({ x: t.x, y: t.y, w: t.w, h: t.h, kind: `lex-${t.k}` });
        break;
      case "icon":
        n.push({ x: t.x, y: t.y, w: t.size, h: t.size, kind: "lex-icon" });
        break;
    }
  return n;
}
function Fi(e, n) {
  for (const t of e)
    t.k === "star" ? t.cy += n : "y" in t && (t.y += n);
}
function at(e) {
  return [[[{ text: e, style: "plain" }]]];
}
const It = {
  top: ke.stackTopCard,
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
}, Ra = {
  top: ke.stackTopCard,
  headline: { max: 72, min: 56, step: 4, lh: 1.12, maxLines: 2, gap: 40 },
  box: { pad: 32, radius: 24, icon: 44, iconGap: 16, gapBetween: 28, rowGap: 16 },
  label: { size: 26, weight: 600, tracking: 2 },
  // The sentence is the payoff, so it runs large (Oct 2026 review: 52 → 64).
  text: { max: 64, min: 40, step: 4, lh: 1.22, maxLines: 3 },
  why: { max: 38, min: 30, step: 2, lh: 1.5, maxLines: 4, gap: 48 },
  priority: ["why", "text", "headline"]
}, Be = (e, n, t, o) => ({
  font: { family: e, weight: n, size: t },
  mono: { family: o, weight: 400 }
});
function et(e, n, t, o, i) {
  const r = It.label;
  return { k: "label", x: t, y: o, text: n.toUpperCase(), font: { family: e.sans, weight: r.weight, size: r.size }, color: i, tracking: r.tracking };
}
const tt = It.label.size * 1.3;
function Oa(e, n) {
  const t = It, o = new fn({ head: t.head, ipa: t.ipa, say: t.say, meaning: t.meaning, example: t.example, translation: t.translation, origin: t.origin, note: t.note }), i = e.v.fonts.mono, r = he.left, a = n.ipa ? Br(n.ipa) : [];
  return a.length && e.warnings.push({ code: "ipa-glyph-missing", slideIndex: e.slideIndex, line: e.line, message: `IPA font can't draw: ${a.join(" ")}` }), un(() => {
    const l = [];
    let c = t.top, p = null, m = !0;
    const y = (h) => {
      m || (c += h), m = !1;
    };
    if (n.pos) {
      const h = t.pill, k = { family: e.sans, weight: h.weight, size: h.size }, _ = n.pos.toUpperCase(), x = Math.min(V, yt(_, k, h.tracking, e.m) + h.padX * 2);
      l.push({ k: "pill", x: r, y: c, w: x, h: h.size + h.padY * 2, text: _, font: k, color: e.s.accent, tracking: h.tracking, padX: h.padX }), c += h.size + h.padY * 2, m = !1;
    }
    y(t.pill.gap);
    const g = o.get("head"), w = ye(fe([n.word ?? ""]), V, Be(e.serif, 700, g, i), t.head.lh, e.m);
    (w.lines.length > t.head.maxLines || w.charBroken && g > t.head.min) && (p = "head"), l.push({ k: "text", x: r, y: c, lines: w.lines, size: g, lh: t.head.lh, style: Be(e.serif, 700, g, i), color: e.s.ink, accent: e.s.accent });
    let d = c + w.h + Math.round(g * t.head.descent);
    if (n.tag) {
      const h = t.tag, k = { family: e.sans, weight: h.weight, size: h.size }, _ = e.m.width(n.tag, k) + h.padX * 2, x = h.size + h.padY * 2, F = w.lines[0]?.width ?? 0, B = c + g * 0.92;
      F + h.gap + _ <= V ? l.push({ k: "badge", x: r + F + h.gap, y: B - g * 0.7, w: _, h: x, text: n.tag, font: k, bg: e.s.badgeBg, ink: e.s.badgeInk, radius: h.radius }) : (l.push({ k: "badge", x: r, y: d + 16, w: _, h: x, text: n.tag, font: k, bg: e.s.badgeBg, ink: e.s.badgeInk, radius: h.radius }), d += 16 + x);
    }
    if (c = d, n.ipa) {
      c += t.head.gap;
      const h = o.get("ipa"), k = Be(Ma, 400, h, i), _ = ye(at(n.ipa), V, k, t.ipa.lh, e.m);
      l.push({ k: "text", x: r, y: c, lines: _.lines, size: h, lh: t.ipa.lh, style: k, color: e.s.body, accent: e.s.accent }), c += _.h;
    }
    if (n.say) {
      c += n.ipa ? t.ipa.gap : t.head.gap;
      const h = o.get("say"), k = Be(e.sans, 400, h, i), _ = Pe("labelSay", e.lang).toUpperCase(), x = yt(_, { family: e.sans, weight: t.label.weight, size: t.label.size }, t.label.tracking, e.m), F = ye(fe([n.say]), V - x - 12, k, t.say.lh, e.m);
      if (F.lines.length === 1)
        l.push(et(e, _, r, c + (h * t.say.lh - tt) / 2, e.s.muted)), l.push({ k: "text", x: r + x + 12, y: c, lines: F.lines, size: h, lh: t.say.lh, style: k, color: e.s.muted, accent: e.s.accent }), c += F.h;
      else {
        l.push(et(e, _, r, c, e.s.muted)), c += tt + 8;
        const B = ye(fe([n.say]), V, k, t.say.lh, e.m);
        l.push({ k: "text", x: r, y: c, lines: B.lines, size: h, lh: t.say.lh, style: k, color: e.s.muted, accent: e.s.accent }), c += B.h;
      }
    }
    if ((n.meaning || n.example || n.origin || n.note) && (c += t.say.gap, l.push({ k: "rect", x: r, y: c, w: V, h: t.divider.h, fill: e.tok.rule, radius: 0 }), c += t.divider.h, m = !0, c += t.divider.gap), n.meaning) {
      y(0), l.push(et(e, Pe("labelMeaning", e.lang), r, c, e.s.muted)), c += tt + t.label.gap;
      const h = o.get("meaning"), k = Be(e.sans, 500, h, i), _ = ye(fe([n.meaning]), V, k, t.meaning.lh, e.m);
      _.lines.length > t.meaning.maxLines && (p ??= "meaning"), l.push({ k: "text", x: r, y: c, lines: _.lines, size: h, lh: t.meaning.lh, style: k, color: e.s.ink, accent: e.s.accent }), c += _.h;
    }
    if (n.example) {
      n.meaning && (c += t.meaning.gap), l.push(et(e, Pe("labelExample", e.lang), r, c, e.s.muted)), c += tt + t.label.gap;
      const h = t.example, k = o.get("example"), _ = Be(e.serif, 600, k, i), x = r + h.indent, F = ye(fe([n.example]), V - h.indent, _, h.lh, e.m);
      F.lines.length > h.maxLines && (p ??= "example");
      const B = c;
      if (l.push({ k: "text", x, y: c, lines: F.lines, size: k, lh: h.lh, style: _, color: e.s.ink, accent: e.s.accent, highlight: e.tok.highlight }), c += F.h, n.translation) {
        c += t.translation.gap;
        const z = o.get("translation"), D = Be(e.sans, 400, z, i), T = ye(fe([n.translation]), V - h.indent, D, t.translation.lh, e.m);
        T.lines.length > t.translation.maxLines && (p ??= "translation"), l.push({ k: "text", x, y: c, lines: T.lines, size: z, lh: t.translation.lh, style: D, color: e.s.muted, accent: e.s.accent }), c += T.h;
      }
      l.push({ k: "rect", x: r, y: B, w: h.bar, h: c - B, fill: e.s.accent, radius: h.bar / 2 });
    }
    if (n.origin) {
      (n.meaning || n.example) && (c += t.example.gap), l.push(et(e, Pe("labelOrigin", e.lang), r, c, e.s.muted)), c += tt + t.label.gap;
      const h = o.get("origin"), k = Be(e.sans, 500, h, i), _ = ye(fe([n.origin]), V, k, t.origin.lh, e.m);
      l.push({ k: "text", x: r, y: c, lines: _.lines, size: h, lh: t.origin.lh, style: k, color: e.s.body, accent: e.s.accent }), c += _.h;
    }
    if (n.note) {
      (n.meaning || n.example || n.origin) && (c += t.origin.gap);
      const h = o.get("note"), k = Be(e.sans, 400, h, i), _ = ye(fe([n.note]), V, k, t.note.lh, e.m);
      _.lines.length > t.note.maxLines && (p ??= "note"), l.push({ k: "text", x: r, y: c, lines: _.lines, size: h, lh: t.note.lh, style: k, color: e.s.muted, accent: e.s.accent }), c += _.h;
    }
    return { els: l, bottom: c, over: p };
  }, o, t.priority);
}
function Pa(e, n) {
  const t = Ra, o = new fn({ headline: t.headline, text: t.text, why: t.why }), i = e.v.fonts.mono, r = he.left, a = V - t.box.pad * 2, s = (c, p, m) => {
    const y = t.box, g = m === "wrong", w = g ? e.tok.badInk : e.tok.okInk, d = o.get("text"), b = Be(e.serif, 600, d, i), h = ye(fe([n[m] ?? ""]), a, b, t.text.lh, e.m), k = y.pad * 2 + y.icon + y.rowGap + h.h;
    c.push({ k: "rect", x: r, y: p, w: V, h: k, fill: g ? e.tok.badBg : e.tok.okBg, radius: y.radius }), c.push({ k: "icon", name: g ? "x-circle" : "check-circle", x: r + y.pad, y: p + y.pad, size: y.icon, color: w });
    const _ = (n[`${m}-label`] || Pe(g ? "compareWrong" : "compareRight", e.lang)).toUpperCase();
    return c.push({
      k: "label",
      x: r + y.pad + y.icon + y.iconGap,
      y: p + y.pad + (y.icon - t.label.size * 1.3) / 2,
      text: _,
      font: { family: e.sans, weight: t.label.weight, size: t.label.size },
      color: w,
      tracking: t.label.tracking
    }), c.push({
      k: "text",
      x: r + y.pad,
      y: p + y.pad + y.icon + y.rowGap,
      lines: h.lines,
      size: d,
      lh: t.text.lh,
      style: b,
      color: w,
      accent: g ? w : e.s.ink,
      highlight: g ? void 0 : e.tok.highlight,
      strike: g
    }), { y: p + k, over: h.lines.length > t.text.maxLines };
  };
  return un(() => {
    const c = [];
    let p = t.top, m = null;
    if (n.headline) {
      const w = o.get("headline"), d = Be(e.serif, 700, w, i), b = ye(fe([n.headline]), V, d, t.headline.lh, e.m);
      b.lines.length > t.headline.maxLines && (m = "headline"), c.push({ k: "text", x: r, y: p, lines: b.lines, size: w, lh: t.headline.lh, style: d, color: e.s.ink, accent: e.s.accent }), p += b.h + t.headline.gap;
    }
    const y = s(c, p, "wrong"), g = s(c, y.y + t.box.gapBetween, "right");
    if ((y.over || g.over) && (m ??= "text"), p = g.y, n.why) {
      p += t.why.gap;
      const w = o.get("why"), d = Be(e.sans, 400, w, i), b = ye(fe([n.why]), V, d, t.why.lh, e.m);
      b.lines.length > t.why.maxLines && (m ??= "why"), c.push({ k: "text", x: r, y: p, lines: b.lines, size: w, lh: t.why.lh, style: d, color: e.s.body, accent: e.s.accent }), p += b.h;
    }
    return { els: c, bottom: p, over: m };
  }, o, t.priority);
}
function un(e, n, t) {
  let o = e();
  for (let i = 0; i < 300 && (o.bottom > ke.stackLimit || o.over) && n.stepDown(t, o.over ?? void 0); i++)
    o = e();
  return { els: o.els, bottom: o.bottom, overflow: o.bottom > ke.stackLimit || !!o.over };
}
const La = {
  top: It.top,
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
function Mn(e, n, t, o) {
  const i = [[$e(e)[0] ?? []]], r = hn(i, 1e9, n, o).lines[0] ?? { runs: [], width: 0, paraStart: !1 };
  if (r.width <= t) return { line: r, clipped: !1 };
  const a = r.runs.map((p) => ({ ...p })), s = o.width("…", n.font);
  let l = r.width;
  for (; a.length && l + s > t; ) {
    const p = a[a.length - 1], m = Array.from(p.text);
    m.pop(), p.text = m.join(""), p.w = o.width(p.text, n.font), p.text || a.pop(), l = a.length ? a[a.length - 1].x + a[a.length - 1].w : 0;
  }
  const c = a[a.length - 1];
  return c && c.style !== "code" ? c.text += "…" : a.push({ text: "…", style: "plain", x: l, w: s }), { line: { runs: a, width: l + s, paraStart: !1 }, clipped: !0 };
}
const Ua = (e) => ($e(e)[0] ?? []).map((n) => n.text).join("");
function Na(e, n, t, o, i) {
  const r = La, a = new fn({ body: r.body, headline: r.headline, note: r.note }), s = e.v.fonts.mono, l = he.left, c = n.rows.slice(0, Oe.maxRows);
  n.rows.length > Oe.maxRows && e.warnings.push({ code: "table-too-many-rows", slideIndex: e.slideIndex, line: e.line, message: `Tables show at most ${Oe.maxRows} rows; ${n.rows.length - Oe.maxRows} hidden` });
  const p = { family: e.sans, weight: r.header.weight, size: r.header.size }, m = n.header.map((d) => Ua(d).toUpperCase());
  let y = !1;
  const w = un(() => {
    const d = [];
    let b = r.top, h = null;
    if (i !== null) {
      const u = r.badge;
      d.push({ k: "badge", x: l, y: b, w: u.d, h: u.d, text: String(i), font: { family: e.sans, weight: u.weight, size: u.digit }, bg: e.s.badgeBg, ink: e.s.badgeInk, radius: u.d / 2 }), b += u.d + u.gap;
    }
    if (t) {
      const u = a.get("headline"), R = { font: { family: e.serif, weight: 700, size: u }, mono: { family: s, weight: 400 } }, K = ye(fe([t]), V, R, r.headline.lh, e.m);
      K.lines.length > r.headline.maxLines && (h = "headline"), d.push({ k: "text", x: l, y: b, lines: K.lines, size: u, lh: r.headline.lh, style: R, color: e.s.ink, accent: e.s.accent }), b += K.h + r.headline.gap;
    }
    const k = a.get("body"), _ = { font: { family: e.sans, weight: r.body.weight, size: k }, mono: { family: s, weight: 400 } }, x = n.header.length, F = Array.from({ length: x }, (u, R) => {
      const K = yt(m[R] ?? "", p, r.header.tracking, e.m), $ = c.reduce((te, W) => Math.max(te, Mn(W[R] ?? "", _, 1e9, e.m).line.width), 0);
      return Math.max(K, $) + r.padX * 2;
    }), B = F.reduce((u, R) => u + R, 0), z = B <= V, D = F.map((u) => z ? u + (V - B) * (u / B) : u * V / B), T = [];
    D.reduce((u, R, K) => (T[K] = u, u + R), l);
    const j = r.header.size * r.rowH, X = k * r.rowH, A = j + X * c.length;
    d.push({ k: "rect", x: l, y: b, w: V, h: A, fill: e.s.bg, radius: r.radius }), d.push({ k: "clip", x: l, y: b, w: V, h: A, radius: r.radius }), d.push({ k: "rect", x: l, y: b, w: V, h: j, fill: be(e.s.accent, r.headerFill), radius: 0 }), m.forEach((u, R) => {
      d.push({ k: "label", x: T[R] + r.padX, y: b + (j - r.header.size * 1.3) / 2, text: u, font: p, color: e.s.accent, tracking: r.header.tracking });
    });
    let S = !1;
    if (c.forEach((u, R) => {
      const K = b + j + R * X;
      R % 2 === 1 && d.push({ k: "rect", x: l, y: K, w: V, h: X, fill: be(e.tok.rule, r.zebra), radius: 0 }), d.push({ k: "rect", x: l, y: K, w: V, h: 1, fill: e.tok.rule, radius: 0 }), u.forEach(($, te) => {
        const W = Mn($, _, D[te] - r.padX * 2, e.m);
        W.clipped && (S = !0), d.push({ k: "text", x: T[te] + r.padX, y: K + (X - k * 1.2) / 2, lines: [W.line], size: k, lh: 1.2, style: _, color: e.s.ink, accent: e.s.accent });
      });
    }), d.push({ k: "unclip" }), d.push({ k: "frame", x: l, y: b, w: V, h: A, stroke: e.tok.rule, width: r.border, radius: r.radius }), y = S, S && k > r.body.min && (h ??= "body"), b += A, o) {
      b += r.note.gap;
      const u = a.get("note"), R = { font: { family: e.sans, weight: 400, size: u }, mono: { family: s, weight: 400 } }, K = ye(fe([o]), V, R, r.note.lh, e.m);
      K.lines.length > r.note.maxLines && (h ??= "note"), d.push({ k: "text", x: l, y: b, lines: K.lines, size: u, lh: r.note.lh, style: R, color: e.s.muted, accent: e.s.accent }), b += K.h;
    }
    return { els: d, bottom: b, over: h };
  }, a, r.priority);
  return y && e.warnings.push({ code: "table-too-wide", slideIndex: e.slideIndex, line: e.line, message: 'Table cells are too wide and were cut with "…"' }), w;
}
const $a = { okBg: "#E3EEDB", okInk: "#2E5A2A", badBg: "#F6DCD8", badInk: "#8E1F17" }, ja = { okBg: "#1E3A24", okInk: "#9BE3A6", badBg: "#3E1E1C", badInk: "#F5A39A" };
function Wa(e, n) {
  return n ? !0 : Ie("#FFFFFF", e.bg) > Ie("#111111", e.bg);
}
function Ga(e, n, t) {
  const o = Wa(n, t);
  if (e.lex && !o) return e.lex;
  const i = o ? ja : $a;
  return { rule: be(n.muted, 0.3), highlight: be(n.accent, 0.22), ...i };
}
function pn(e) {
  const { slide: n, deck: t, variant: o, measurer: i } = e, r = [], a = [], { surface: s, name: l, onPhoto: c } = St(o, n, e.hasPhoto, r), p = o.fonts.sans, m = o.fonts.mono, y = {
    v: o,
    s,
    tok: Ga(o, s, c),
    m: i,
    lang: t.lang,
    serif: o.fonts.serif ?? p,
    sans: p,
    slideIndex: n.index,
    line: n.lines[0],
    warnings: r
  }, g = n.type === "word" ? Oa(y, n.fields) : n.type === "compare" ? Pa(y, n.fields) : Na(y, n.table ?? { header: [], rows: [] }, n.headlineSrc, n.fields.note ?? "", n.badge), w = g.els.find((h) => "y" in h);
  if (!g.overflow && !c && w) {
    const h = yi(w.y, g.bottom, ke.stackTopCard);
    Fi(g.els, h), g.bottom += h;
  }
  g.overflow && r.push({ code: "overflow", slideIndex: n.index, line: n.lines[0], message: `Slide ${n.index + 1}: text doesn't fit` });
  const d = zt(e, p, m, a), b = Dt(e, p, m, a, Ke(o).coverSwipeIcon);
  return a.push(...Ei(g.els)), {
    slide: n,
    deck: t,
    variant: o,
    surface: s,
    surfaceName: l,
    onPhoto: c,
    stack: { placed: [], bottom: g.bottom, overflow: g.overflow, codeTooLong: !1, charBroken: !1, droppedIcon: !1 },
    icon: null,
    ctaLabel: null,
    header: d,
    footer: b,
    boxes: a,
    warnings: r,
    lex: g
  };
}
const Ha = /* @__PURE__ */ new Set(["Playfair Display", "Lora", "Fraunces", "Gentium Book Plus", "Amiri Quran", "Amiri"]);
function mn(e) {
  return /mono/i.test(e);
}
function Ai(e, n) {
  return mn(n) ? e - 2 : e;
}
function Za(e) {
  return mn(e) ? "ui-monospace, Menlo, Consolas, monospace" : Ha.has(e) ? 'Georgia, "Times New Roman", serif' : 'system-ui, -apple-system, "Segoe UI", sans-serif';
}
const Rn = "Amiri";
function xi(e) {
  const n = e.family === Rn || e.family === "Amiri Quran" ? "" : `"${Rn}", `;
  return `${e.weight} ${e.size}px "${e.family}", ${n}${Za(e.family)}`;
}
function Ci(e, n) {
  const t = /* @__PURE__ */ new Map();
  return {
    ...n ? { hasFace: n } : {},
    width(o, i) {
      const r = xi(i), a = `${r}\0${o}`, s = t.get(a);
      if (s !== void 0) return s;
      e.font !== r && (e.font = r);
      const l = e.measureText(o).width;
      return t.size > 2e4 && t.clear(), t.set(a, l), l;
    }
  };
}
const it = "Amiri Quran", kt = "Amiri", Kt = "بِسْمِ ٱللَّهِ ﴿١٢﴾", Ne = {
  top: ke.stackTopCard,
  bottom: ke.stackLimit,
  star: { size: 56, width: 2, alpha: 0.7, gap: 48 },
  arab: { max: 76, min: 48, step: 4, lh: 2.1, baseline: 1.3, gap: 56 },
  divider: { w: 120, h: 2, alpha: 0.6, gap: 48 },
  // Minimums raised for phone legibility (owner, Oct 2026): terjemah/text 32 → 34, source 24 → 28, grade 24 → 26.
  terjemah: { weight: 500, max: 42, min: 34, step: 2, lh: 1.5, maxLines: 7, gap: 32 },
  ref: { size: 30, weight: 600, lh: 1.3, gap: 10 },
  source: { size: 28, weight: 400, lh: 1.3 }
}, Vt = {
  pill: { size: 24, weight: 600, tracking: 3, padX: 22, h: 48, gap: 40 },
  arab: { max: 56, min: 40, step: 4, lh: 2, baseline: 1.25, gap: 40 },
  text: { weight: 500, max: 44, min: 34, step: 2, lh: 1.5, maxLines: 8, gap: 32 },
  ref: { size: 30, weight: 600, lh: 1.3, gap: 16 },
  grade: { size: 26, weight: 600, padX: 18, h: 46, radius: 23, gapX: 20, gap: 10 },
  source: { size: 28, weight: 400, lh: 1.3 }
}, Bi = 0.3;
function Si(e, n, t, o, i, r) {
  const a = { family: n, weight: 400, size: t }, s = e.split(" ").filter((d) => d !== ""), l = i.width(" ", a), c = r ? t * Bi + i.width(r, a) : 0, p = [], m = [];
  let y = [], g = 0, w = !0;
  return s.forEach((d, b) => {
    const h = i.width(d, a), k = b === s.length - 1 ? c : 0;
    h + k > o && (w = !1), y.length && g + l + h + k > o && (p.push(y.join(" ")), m.push(g), y = [], g = 0), g += (y.length ? l : 0) + h, y.push(d);
  }), y.length && (p.push(y.join(" ")), m.push(g)), { lines: p, widths: m, fits: w };
}
const On = (e, n, t) => ({ family: e.sans, weight: t, size: n }), He = (e, n, t, o) => ({
  font: { family: n, weight: t, size: o },
  mono: { family: e.mono, weight: 400 }
});
function Xa(e, n, t, o, i, r) {
  const a = Ne, s = [], l = he.left;
  let c = 0;
  s.push({ k: "star", cx: l + V / 2, cy: c + a.star.size / 2, size: a.star.size, color: be(e.s.accent, a.star.alpha), width: a.star.width }), c += a.star.size + a.star.gap;
  const p = Rr(n), m = Si(n.arab ?? "", it, t, V, e.m, p);
  s.push({
    k: "arabic",
    x: l,
    y: c,
    w: V,
    lines: m.lines,
    widths: m.widths,
    size: t,
    lh: a.arab.lh,
    baseline: a.arab.baseline,
    family: it,
    color: e.s.ink,
    align: "center",
    mark: p ? { text: p, w: e.m.width(p, { family: it, weight: 400, size: t }), gap: t * Bi, color: e.s.accent } : null
  }), c += m.lines.length * t * a.arab.lh + a.arab.gap, s.push({ k: "rect", x: l + (V - a.divider.w) / 2, y: c, w: a.divider.w, h: a.divider.h, fill: be(e.s.accent, a.divider.alpha), radius: 0 }), c += a.divider.h + a.divider.gap;
  let y = !1;
  if (r) {
    const b = He(e, e.serif, a.terjemah.weight, o), h = ye(zi(n.terjemah), V, b, a.terjemah.lh, e.m);
    y = h.lines.length > a.terjemah.maxLines, s.push({ k: "text", x: l, y: c, lines: h.lines, size: o, lh: a.terjemah.lh, style: b, color: e.s.body, accent: e.s.accent, centerW: V }), c += h.h + a.terjemah.gap;
  }
  const g = n.portion === "true" ? `${n.ref ?? ""} ${Pe("portion", e.lang)}` : n.ref ?? "", w = He(e, e.sans, a.ref.weight, a.ref.size), d = ye(at(g), V, w, a.ref.lh, e.m);
  if (s.push({ k: "text", x: l, y: c, lines: d.lines, size: a.ref.size, lh: a.ref.lh, style: w, color: e.s.accent, accent: e.s.accent, centerW: V }), c += d.h, i && n.source) {
    c += a.ref.gap;
    const b = He(e, e.sans, a.source.weight, a.source.size), h = ye(at(n.source), V, b, a.source.lh, e.m);
    s.push({ k: "text", x: l, y: c, lines: h.lines, size: a.source.size, lh: a.source.lh, style: b, color: e.s.muted, accent: e.s.muted, centerW: V }), c += h.h;
  }
  return { els: s, h: c, textOver: y, arabFits: m.fits };
}
function qa(e, n, t, o, i, r) {
  const a = Vt, s = [], l = he.left;
  let c = 0;
  const p = Pe("hadithLabel", e.lang), m = On(e, a.pill.size, a.pill.weight);
  s.push({ k: "pill", x: l, y: c, w: yt(p, m, a.pill.tracking, e.m) + a.pill.padX * 2, h: a.pill.h, text: p, font: m, color: e.s.accent, tracking: a.pill.tracking, padX: a.pill.padX }), c += a.pill.h + a.pill.gap;
  let y = !0;
  if (n.arab) {
    const B = Si(n.arab, kt, t, V, e.m, null);
    y = B.fits, s.push({ k: "arabic", x: l, y: c, w: V, lines: B.lines, widths: B.widths, size: t, lh: a.arab.lh, baseline: a.arab.baseline, family: kt, color: e.s.ink, align: "right", mark: null }), c += B.lines.length * t * a.arab.lh + a.arab.gap;
  }
  let g = !1;
  if (r) {
    const B = He(e, e.serif, a.text.weight, o), z = ye(zi(n.text), V, B, a.text.lh, e.m);
    g = z.lines.length > a.text.maxLines, s.push({ k: "text", x: l, y: c, lines: z.lines, size: o, lh: a.text.lh, style: B, color: e.s.ink, accent: e.s.accent }), c += z.h + a.text.gap;
  }
  const w = He(e, e.sans, a.ref.weight, a.ref.size), d = ye(at(n.ref ?? ""), V, w, a.ref.lh, e.m);
  s.push({ k: "text", x: l, y: c, lines: d.lines, size: a.ref.size, lh: a.ref.lh, style: w, color: e.s.accent, accent: e.s.accent });
  const b = d.lines.at(-1)?.width ?? 0, h = a.grade, k = `${Pe("gradeLabel", e.lang)}: ${n.grade ?? ""}`, _ = On(e, h.size, h.weight), x = e.m.width(k, _) + h.padX * 2, F = d.h;
  if (b + h.gapX + x <= V) {
    const B = c + F - a.ref.size * a.ref.lh;
    s.push({ k: "badge", x: l + b + h.gapX, y: B + (a.ref.size * a.ref.lh - h.h) / 2, w: x, h: h.h, text: k, font: _, bg: e.s.badgeBg, ink: e.s.badgeInk, radius: h.radius }), c += F;
  } else
    c += F + a.ref.gap, s.push({ k: "badge", x: l, y: c, w: Math.min(x, V), h: h.h, text: k, font: _, bg: e.s.badgeBg, ink: e.s.badgeInk, radius: h.radius }), c += h.h;
  if (i && n.source) {
    c += h.gap;
    const B = He(e, e.sans, a.source.weight, a.source.size), z = ye(at(n.source), V, B, a.source.lh, e.m);
    s.push({ k: "text", x: l, y: c, lines: z.lines, size: a.source.size, lh: a.source.lh, style: B, color: e.s.muted, accent: e.s.muted }), c += z.h;
  }
  return { els: s, h: c, textOver: g, arabFits: y };
}
function zi(e) {
  return e ? an(e) : [];
}
function gn(e) {
  const { slide: n, deck: t, variant: o, measurer: i } = e, r = [], a = [], { surface: s, name: l, onPhoto: c } = St(o, n, e.hasPhoto, r), p = { s, m: i, serif: o.fonts.serif ?? o.fonts.sans, sans: o.fonts.sans, mono: o.fonts.mono, lang: t.lang }, m = n.type === "ayah", y = n.fields, g = m ? { arab: Ne.arab, text: Ne.terjemah } : { arab: Vt.arab, text: Vt.text }, w = { arab: g.arab, text: { ...g.text, min: Ai(g.text.min, p.serif) } }, d = m ? Xa : qa, b = Ne.bottom - Ne.top, h = (A, S) => {
    r.push({ code: A, slideIndex: n.index, line: n.lines[0], message: S });
  }, k = m ? it : kt;
  y.arab && i.hasFace && !i.hasFace(k, Kt) && h("arabic-font-missing", `The ${k} font isn't loaded; export is blocked`);
  let _ = !0, x = w.text.max, F = w.arab.max;
  const B = (A) => A.h <= b && !A.textOver && A.arabFits;
  let z = d(p, y, F, x, _, !0);
  for (; !B(z); ) {
    if (_ && y.source) _ = !1;
    else if (x > w.text.min) x = Math.max(w.text.min, x - w.text.step);
    else if (F > w.arab.min) F = Math.max(w.arab.min, F - w.arab.step);
    else break;
    z = d(p, y, F, x, _, !0);
  }
  const D = !B(z);
  if (D) {
    const A = d(p, y, w.arab.min, w.text.min, !1, !1);
    !A.arabFits || A.h > b ? h("arabic-too-long", "Ayat terlalu panjang untuk satu slide. Gunakan penggalan atau pecah di tanda waqaf.") : h("overflow", `Slide ${n.index + 1}: text doesn't fit`);
  }
  const T = D ? Ne.top : Ne.top + Math.max(0, Math.round((b - z.h) / 2));
  Fi(z.els, T);
  const j = zt(e, p.sans, p.mono, a), X = Dt(e, p.sans, p.mono, a, Ke(o).coverSwipeIcon);
  return a.push(...Ei(z.els)), {
    slide: n,
    deck: t,
    variant: o,
    surface: s,
    surfaceName: l,
    onPhoto: c,
    stack: { placed: [], bottom: T + z.h, overflow: D, codeTooLong: !1, charBroken: !1, droppedIcon: !1 },
    icon: null,
    ctaLabel: null,
    header: j,
    footer: X,
    boxes: a,
    warnings: r,
    lex: { els: z.els, bottom: T + z.h, overflow: D }
  };
}
const Re = {
  coverHeadline: { face: "serif", weight: 700, max: 120, min: 84, step: 4, lh: 1.06, maxLines: 5, widowFix: !0 },
  coverSubtitle: { face: "sans", weight: 400, max: 40, min: 32, step: 2, lh: 1.45, maxLines: 3 },
  cardHeadline: { face: "serif", weight: 700, max: 92, min: 64, step: 4, lh: 1.12, maxLines: 6, widowFix: !0 },
  // body min 32 → 34 for phone legibility (owner, Oct 2026).
  body: { face: "sans", weight: 400, max: 42, min: 34, step: 2, lh: 1.5, maxLines: 8 },
  note: { face: "sans", weight: 400, max: 32, min: 30, step: 2, lh: 1.45, maxLines: 3 },
  quote: { face: "serif", weight: 600, max: 76, min: 52, step: 4, lh: 1.18, maxLines: 7, widowFix: !0 },
  endHeadline: { face: "serif", weight: 700, max: 108, min: 76, step: 4, lh: 1.08, maxLines: 4, widowFix: !0 }
}, we = {
  kicker: { size: 26, weight: 600, tracking: 3, h: 32 },
  attribution: { size: 32, weight: 500, lh: 1.3 },
  badge: { d: 120, digit: 54, weight: 600, opticalY: -2 },
  icon: 120,
  code: { max: 40, min: 28, step: 2, lh: 1.55, maxLines: 12, pad: 36, radius: 28 },
  quoteMark: { size: 240, weight: 700, alpha: 0.45, x: 84, top: 300 }
}, ce = {
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
function Jt(e, n = {}) {
  if (ot(e.slide.type)) return pn(e);
  if (st(e.slide.type)) return gn(e);
  const { slide: t, deck: o, variant: i, measurer: r } = e, a = i.fonts.serif ?? i.fonts.sans, s = i.fonts.sans, l = i.fonts.mono, c = [], p = [], { surface: m, name: y, onPhoto: g } = St(i, t, e.hasPhoto, c), w = (D) => {
    const T = D.face === "serif" && D.weight === 700 && i.headlineWeight ? i.headlineWeight : D.weight;
    return { ...D, weight: T, family: D.face === "serif" ? a : s, mono: { family: l, weight: T >= 600 ? 600 : 400 } };
  }, d = [], b = (D) => {
    d.push({ ...D, gap: d.length ? D.gap : 0 });
  }, h = bi(t, o), k = (D) => {
    e.icon && b({ kind: "icon", h: we.icon, w: we.icon, gap: D }), h && b({ kind: "cta", h: ne.cta.h, w: bt(h, s, r), gap: ne.cta.gapBefore, label: h });
  };
  let _ = ce.cardTop;
  switch (t.type) {
    case "cover": {
      _ = ce.coverTop, t.attrs.kicker && b({ kind: "kicker", h: we.kicker.h, w: 0, gap: 0, label: t.attrs.kicker.toUpperCase() }), b({ kind: "text", role: "headline", rich: t.headline, spec: w(Re.coverHeadline), gap: ce.kickerGap, tone: "ink" }), Ae(t.body) || b({ kind: "text", role: "subtitle", rich: t.body, spec: w(Re.coverSubtitle), gap: ce.headlineGap, tone: "body" });
      break;
    }
    case "card":
    case "code":
    case "diagram": {
      const D = t.attrs.kicker;
      D && b({ kind: "kicker", h: we.kicker.h, w: 0, gap: 0, label: D.toUpperCase() });
      const T = Xt(t, i, r, D ? ce.kickerGap : 0);
      T ? b(T) : D ? _ = ce.cardTopNoBadge : t.badge !== null ? b({ kind: "badge", h: we.badge.d, w: we.badge.d, gap: 0, label: String(t.badge) }) : _ = ce.cardTopNoBadge;
      const j = hi(t, ce.cardGap);
      if (j && b(j), b({ kind: "text", role: "headline", rich: t.headline, spec: w(Re.cardHeadline), gap: D && !T ? ce.kickerGap : ce.cardGap, tone: "ink" }), Ae(t.body) || b({ kind: "text", role: "body", rich: t.body, spec: w(Re.body), gap: ce.cardGap, tone: "body" }), t.type === "code" && t.code) {
        const X = we.code, A = {
          family: l,
          weight: 400,
          max: X.max,
          min: X.min,
          step: X.step,
          lh: X.lh,
          maxLines: X.maxLines,
          padX: X.pad,
          padTop: X.pad,
          padBottom: X.pad,
          titleBar: 0
        };
        b({ kind: "code", lines: fi(t.code.text, t.code.lang), lang: t.code.lang, spec: A, gap: ce.iconGap }), Ae(t.note) || b({ kind: "text", role: "note", rich: t.note, spec: w(Re.note), gap: ce.noteGap, tone: "muted" }), h && b({ kind: "cta", h: ne.cta.h, w: bt(h, s, r), gap: ne.cta.gapBefore, label: h });
      } else t.type === "diagram" ? (Ae(t.note) || b({ kind: "text", role: "note", rich: t.note, spec: w(Re.note), gap: ce.noteGap, tone: "muted" }), h && b({ kind: "cta", h: ne.cta.h, w: bt(h, s, r), gap: ne.cta.gapBefore, label: h })) : k(ce.iconGap);
      break;
    }
    case "quote": {
      if (_ = ce.quoteTop, t.attrs.kicker && b({ kind: "kicker", h: we.kicker.h, w: 0, gap: 0, label: t.attrs.kicker.toUpperCase() }), b({ kind: "text", role: "quote", rich: t.headline, spec: w(Re.quote), gap: ce.kickerGap, tone: "ink" }), t.attribution) {
        const D = we.attribution;
        b({ kind: "attribution", h: D.size * D.lh, w: 0, gap: ce.attributionGap, label: `— ${t.attribution}` });
      }
      Ae(t.body) || b({ kind: "text", role: "body", rich: t.body, spec: w(Re.body), gap: ce.quoteBodyGap, tone: "body" }), k(ce.iconGap);
      break;
    }
    case "end": {
      _ = ce.endTop, b({ kind: "text", role: "headline", rich: t.headline, spec: w(Re.endHeadline), gap: 0, tone: "ink" }), Ae(t.body) || b({ kind: "text", role: "body", rich: t.body, spec: w(Re.body), gap: ce.headlineGap, tone: "body" }), k(ce.iconGap);
      const D = d[d.length - 1];
      D?.kind === "cta" && d.length > 1 && (D.gap = ce.iconGap);
      break;
    }
  }
  for (const D of d)
    D.kind === "kicker" && D.label && (D.w = r.width(D.label, { family: s, weight: we.kicker.weight, size: we.kicker.size }) + we.kicker.tracking * Math.max(0, Array.from(D.label).length - 1)), D.kind === "attribution" && D.label && (D.w = Math.min(V, r.width(D.label, { family: s, weight: we.attribution.weight, size: we.attribution.size })));
  const x = gi(d, ki(_), r);
  if (wi(x, t.type === "cover" ? _ : ke.stackTopCard, g), n.center)
    for (const D of x.placed) D.item.kind !== "code" && (D.x = he.left + (V - D.w) / 2);
  const F = zt(e, s, l, p), B = Dt(e, s, l, p, !0);
  p.push(...vi(x)), c.push(..._i(t, x));
  const z = x.placed.some((D) => D.item.kind === "icon") ? e.icon : null;
  return {
    slide: t,
    deck: o,
    variant: i,
    surface: m,
    surfaceName: y,
    onPhoto: g,
    stack: x,
    icon: z,
    ctaLabel: h,
    header: F,
    footer: B,
    boxes: p,
    warnings: c,
    ...n.center ? { center: !0 } : {}
  };
}
const je = {
  points: 7,
  angleJitterDeg: 10,
  radiusJitter: 0.18,
  tension: 0.5,
  a: { cx: 1040, cy: 1840, spread: 30, rMin: 300, rMax: 380, rMinBig: 420, rMaxBig: 480 },
  b: { cx: 1070, cyMin: 260, cyMax: 420, rMin: 200, rMax: 260, chance: 0.5 }
};
function Pn(e, n, t, o) {
  const i = [], r = je.points, a = e() * Math.PI * 2;
  for (let s = 0; s < r; s++) {
    const l = Ue(e, -1, 1) * je.angleJitterDeg * Math.PI / 180, c = a + s / r * Math.PI * 2 + l, p = o * (1 + Ue(e, -1, 1) * je.radiusJitter);
    i.push({ x: n + Math.cos(c) * p, y: t + Math.sin(c) * p });
  }
  return i;
}
function Ln(e, n, t = je.tension) {
  const o = n.length, i = (a) => n[(a % o + o) % o], r = t * 2 / 3;
  e.beginPath(), e.moveTo(i(0).x, i(0).y);
  for (let a = 0; a < o; a++) {
    const s = i(a - 1), l = i(a), c = i(a + 1), p = i(a + 2), m = { x: l.x + (c.x - s.x) * r / 2, y: l.y + (c.y - s.y) * r / 2 }, y = { x: c.x - (p.x - l.x) * r / 2, y: c.y - (p.y - l.y) * r / 2 };
    e.bezierCurveTo(m.x, m.y, y.x, y.y, c.x, c.y);
  }
  e.closePath();
}
function Ya(e, n, t, o) {
  const i = je.a, r = i.cx + Ue(n, -30, i.spread), a = i.cy + Ue(n, -30, i.spread), s = o ? Ue(n, i.rMinBig, i.rMaxBig) : Ue(n, i.rMin, i.rMax), l = o || n() < je.b.chance, c = je.b, p = Ue(n, c.cyMin, c.cyMax), m = Ue(n, c.rMin, c.rMax);
  e.fillStyle = t, Ln(e, Pn(n, r, a, s)), e.fill(), l && (Ln(e, Pn(n, c.cx, p, m)), e.fill());
}
function Di(e) {
  const n = [];
  for (const t of e) {
    if (!t.text) continue;
    const o = n[n.length - 1];
    o && o.kind === t.kind ? o.text += t.text : n.push({ ...t });
  }
  return n;
}
function Ii(e, n, t) {
  let o = n + t.length;
  for (; o < e.length; ) {
    if (e[o] === "\\" && t !== "'") {
      o += 2;
      continue;
    }
    if (e.startsWith(t, o)) return o + t.length;
    o++;
  }
  return e.length;
}
const Ka = /* @__PURE__ */ new Set(["git", "docker", "npm", "pnpm", "yarn", "kubectl", "apt", "brew", "pip"]), Va = ["&&", "||", ">>", "|", ";", ">"];
function Ja(e, n = !1) {
  const t = [];
  let o = 0, i = n ? 2 : 0, r = "";
  for (; o < e.length; ) {
    const a = e[o];
    if (a === " " || a === "	") {
      let m = o;
      for (; m < e.length && (e[m] === " " || e[m] === "	"); ) m++;
      t.push({ text: e.slice(o, m), kind: "text" }), o = m;
      continue;
    }
    if (a === "#" && (o === 0 || /\s/.test(e[o - 1]))) {
      t.push({ text: e.slice(o), kind: "comment" });
      break;
    }
    if (a === '"' || a === "'") {
      const m = Ii(e, o, a);
      t.push({ text: e.slice(o, m), kind: "string" }), o = m, i++;
      continue;
    }
    if (a === "$") {
      const m = /^\$(\{[^}]*\}?|[A-Za-z_][A-Za-z0-9_]*|[0-9@#?*!$-])/.exec(e.slice(o));
      if (m) {
        t.push({ text: m[0], kind: "flag" }), o += m[0].length;
        continue;
      }
    }
    const s = Va.find((m) => e.startsWith(m, o));
    if (s) {
      t.push({ text: s, kind: "punct" }), o += s.length, s !== ">" && s !== ">>" && (i = 0, r = "");
      continue;
    }
    if (a === "\\" && o === e.trimEnd().length - 1) {
      t.push({ text: e.slice(o), kind: "punct" });
      break;
    }
    let l = o;
    for (; l < e.length && !/[\s"'|;&>$]/.test(e[l]); ) l++;
    l === o && (l = o + 1);
    const c = e.slice(o, l);
    let p = "text";
    c.startsWith("-") ? p = "flag" : i === 0 ? (p = "command", r = c) : i === 1 && Ka.has(r) ? p = "subcommand" : /^\d+(\.\d+)?$/.test(c) && (p = "number"), t.push({ text: c, kind: p }), i++, o = l;
  }
  return Di(t);
}
function bn(e, n) {
  const t = [];
  let o = 0;
  for (; o < e.length; ) {
    const i = e.slice(o);
    if (n.lineComment.find((p) => i.startsWith(p))) {
      t.push({ text: i, kind: "comment" });
      break;
    }
    if (n.blockComment && i.startsWith(n.blockComment[0])) {
      const p = e.indexOf(n.blockComment[1], o + 2), m = p < 0 ? e.length : p + n.blockComment[1].length;
      t.push({ text: e.slice(o, m), kind: "comment" }), o = m;
      continue;
    }
    const a = n.quotes.find((p) => i.startsWith(p));
    if (a) {
      const p = Ii(e, o, a);
      t.push({ text: e.slice(o, p), kind: "string" }), o = p;
      continue;
    }
    const s = /^(0x[0-9a-fA-F]+|\d+(\.\d+)?)/.exec(i);
    if (s && (o === 0 || !/[A-Za-z_]/.test(e[o - 1]))) {
      t.push({ text: s[0], kind: "number" }), o += s[0].length;
      continue;
    }
    const l = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(i);
    if (l) {
      const p = l[0], m = n.caseInsensitive ? p.toUpperCase() : p;
      let y = "text";
      n.keywords.has(m) ? y = "keyword" : n.fnCalls && /^\s*\(/.test(e.slice(o + p.length)) && (y = "fn"), t.push({ text: p, kind: y }), o += p.length;
      continue;
    }
    const c = e[o];
    t.push({ text: c, kind: /\s/.test(c) ? "text" : "punct" }), o++;
  }
  return Di(t);
}
const Qa = new Set(
  "const let var function return if else for while import from export class new await async try catch throw".split(" ")
);
function eo(e) {
  return bn(e, {
    keywords: Qa,
    lineComment: ["//"],
    blockComment: ["/*", "*/"],
    quotes: ["`", '"', "'"],
    fnCalls: !0
  });
}
const to = new Set(
  "def class return if elif else for while import from as with try except raise lambda None True False and or not in is pass".split(" ")
);
function no(e) {
  return bn(e, {
    keywords: to,
    lineComment: ["#"],
    quotes: ['"""', "'''", '"', "'"],
    fnCalls: !0
  });
}
const io = new Set(
  "SELECT FROM WHERE JOIN LEFT RIGHT INNER ON GROUP BY ORDER HAVING LIMIT INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE INDEX AS AND OR NOT NULL IS IN LIKE DISTINCT COUNT SUM AVG".split(" ")
);
function ro(e) {
  return bn(e, {
    keywords: io,
    caseInsensitive: !0,
    lineComment: ["--"],
    quotes: ["'"],
    fnCalls: !1
  });
}
function ao(e, n) {
  const t = e.prompt ? [{ text: wt, kind: "prompt" }] : [], o = n.toLowerCase();
  let i;
  return di(o) ? i = Ja(e.text, e.continuation) : ["js", "ts", "javascript", "typescript", "jsx", "tsx"].includes(o) ? i = eo(e.text) : o === "py" || o === "python" ? i = no(e.text) : o === "sql" ? i = ro(e.text) : i = [{ text: e.text, kind: "text" }], [...t, ...i];
}
const ut = { color: "rgba(0,0,0,0.35)", blur: 24, offsetX: 0, offsetY: 2 };
function ae(e, n) {
  e.shadowColor = n ? ut.color : "transparent", e.shadowBlur = n ? ut.blur : 0, e.shadowOffsetX = n ? ut.offsetX : 0, e.shadowOffsetY = n ? ut.offsetY : 0;
}
function se(e, n) {
  e.font = xi(n), e.textBaseline = "alphabetic";
}
function _t(e, n, t, o, i) {
  let r = t;
  const a = Array.from(n);
  return a.forEach((s, l) => {
    e.fillText(s, r, o), r += e.measureText(s).width + (l < a.length - 1 ? i : 0);
  }), r - t;
}
const oo = /[=!<>\-|&+*:./\\~^%#?@$_]{2}/;
function Qt(e, n, t, o) {
  if (!oo.test(n)) {
    e.fillText(n, t, o);
    return;
  }
  let i = t;
  for (const r of Array.from(n))
    e.fillText(r, i, o), i += e.measureText(r).width;
}
function Ti(e, n, t, o, i, r, a, s, l) {
  const c = Yt(n, o, i, r), p = pi(a);
  n.forEach((m, y) => {
    const g = c[y], w = l === void 0 ? t : t + (l - m.width) / 2;
    for (const d of m.runs) {
      if (d.style === "code") {
        const b = e.shadowColor;
        e.save(), e.shadowColor = "transparent", e.fillStyle = s.codeBg, e.beginPath();
        const h = p.size + Ge.padY * 2;
        e.roundRect(w + d.x, g - p.size * 0.78 - Ge.padY, d.w, h, Ge.radius), e.fill(), e.restore(), e.shadowColor = b, se(e, p), e.fillStyle = s.codeText, Qt(e, d.text, w + d.x + Ge.padX, g);
        continue;
      }
      se(e, a.font), e.fillStyle = d.style === "accent" ? s.accent : s.text, mn(a.font.family) ? Qt(e, d.text, w + d.x, g) : e.fillText(d.text, w + d.x, g);
    }
  });
}
function Mi(e, n, t) {
  if (e.measureText(n).width <= t) return n;
  const o = Array.from(n);
  for (; o.length && e.measureText(o.join("") + "…").width > t; ) o.pop();
  return o.join("") + "…";
}
const Ce = {
  border: 2,
  dotR: 9,
  dotX: [36, 64, 92],
  labelSize: 24,
  labelRight: 28,
  fade: 48
}, so = {
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
function Ri(e, n, t, o, i, r) {
  if (n.item.kind !== "code") return;
  const { spec: a, lines: s, lang: l } = n.item, { x: c, y: p, h: m, size: y } = n;
  e.save(), e.shadowColor = "transparent", e.beginPath(), e.roundRect(c, p, r, m, i), e.fillStyle = t.panel, e.fill(), e.lineWidth = Ce.border, e.strokeStyle = t.border, e.beginPath();
  const g = Ce.border / 2;
  if (e.roundRect(c + g, p + g, r - 2 * g, m - 2 * g, i - g), e.stroke(), t.dots && a.titleBar > 0) {
    const k = p + a.titleBar / 2;
    t.dots.forEach((_, x) => {
      e.fillStyle = _, e.beginPath(), e.arc(c + Ce.dotX[x], k, Ce.dotR, 0, Math.PI * 2), e.fill();
    }), l && (se(e, { family: o, weight: 500, size: Ce.labelSize }), e.fillStyle = t.comment, e.textAlign = "right", e.fillText(l, c + r - Ce.labelRight, k + Ce.labelSize * 0.35), e.textAlign = "left"), e.fillStyle = t.border, e.fillRect(c, p + a.titleBar - Ce.border, r, Ce.border);
  }
  const w = c + a.padX, d = c + r - a.padX, b = p + a.titleBar + a.padTop;
  e.beginPath(), e.rect(w, p, d - w, m), e.clip();
  const h = y * a.lh;
  if (s.forEach((k, _) => {
    const x = b + _ * h + h / 2 + y * 0.35;
    let F = w;
    for (const B of ao(k, l)) {
      const z = B.kind === "command" ? 600 : a.weight;
      se(e, { family: o, weight: z, size: y }), e.fillStyle = t[so[B.kind]], Qt(e, B.text, F, x), F += e.measureText(B.text).width;
    }
  }), n.codeFits === !1) {
    const k = e.createLinearGradient(d - Ce.fade, 0, d, 0);
    k.addColorStop(0, be(t.panel, 0)), k.addColorStop(1, t.panel), e.fillStyle = k, e.fillRect(d - Ce.fade, p, Ce.fade, m);
  }
  e.restore();
}
const lo = {
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
}, Un = /* @__PURE__ */ new Map();
function co(e) {
  let n = Un.get(e);
  return n || (n = new Path2D(lo[e]), Un.set(e, n)), n;
}
function Xe(e, n, t, o, i, r) {
  e.save(), e.translate(t, o), e.scale(i / 24, i / 24), e.strokeStyle = r, e.lineWidth = 1.5, e.lineCap = "round", e.lineJoin = "round", e.stroke(co(n)), e.restore();
}
function vt(e, n, t, o) {
  const { header: i } = n;
  ae(e, n.onPhoto), i.handle && (se(e, i.handleFont), e.fillStyle = t, e.fillText(i.handle, he.left, ke.headerBaseline));
  const r = i.right;
  e.fillStyle = o, r.kind === "rule" ? e.fillRect(r.x1, r.y, r.x2 - r.x1, r.h) : (se(e, r.font), e.textAlign = "right", e.fillText(r.text, he.right, ke.headerBaseline), e.textAlign = "left");
}
function Et(e, n, t, o) {
  const i = ke.footerBaseline;
  ae(e, n.onPhoto);
  const r = n.footer.swipe;
  if (r) {
    let s = he.left;
    const l = (c) => i - r.font.size * 0.36 - c / 2;
    r.leadIcon && (Xe(e, r.leadIcon, s, l(ne.circleArrowSize), ne.circleArrowSize, t), s += ne.circleArrowSize + ne.circleArrowGap), se(e, r.font), e.fillStyle = t, e.fillText(r.text, s, i), s += e.measureText(r.text).width, r.arrow && Xe(e, "arrow-right", s + ne.arrowGap, l(ne.arrowSize), ne.arrowSize, t);
  }
  const a = n.footer.counter;
  a && (se(e, a.font), e.fillStyle = o, e.textAlign = "right", e.fillText(a.text, he.right, i), e.textAlign = "left");
}
function Oi(e, n, t, o, i) {
  const r = ne.cta;
  e.save(), ae(e, !1), e.fillStyle = o.badgeBg, e.beginPath(), e.roundRect(n.x, n.y, n.w, r.h, r.radius), e.fill();
  const a = n.y + r.h / 2;
  Xe(e, "bookmark", n.x + r.padX, a - r.icon / 2, r.icon, o.badgeInk), se(e, { family: i, weight: r.weight, size: r.size }), e.fillStyle = o.badgeInk, e.fillText(t, n.x + r.padX + r.icon + r.gap, a + r.size * 0.35), e.restore();
}
function Pi(e, n, t, o, i = !1) {
  if (n.item.kind !== "text" || !n.wrap) return;
  const r = n.item;
  ae(e, o), Ti(
    e,
    n.wrap.lines,
    n.x,
    n.y,
    n.size,
    r.spec.lh,
    { font: { family: r.spec.family, weight: r.spec.weight, size: n.size }, mono: r.spec.mono },
    { text: t[r.tone], accent: t.accent, codeBg: t.inlineCodeBg, codeText: t.ink },
    i ? n.w : void 0
  );
}
function Li(e) {
  e.beginPath(), e.rect(0, 0, ue.w, ke.stackLimit), e.clip();
}
const ho = {
  football: { w: 68, d: 52.5 },
  futsal: { w: 20, d: 20 },
  badminton: { w: 6.1, d: 6.7 },
  volleyball: { w: 9, d: 9 },
  basketball: { w: 15, d: 14 },
  tennis: { w: 10.97, d: 11.885 }
};
function fo(e, n, t, o, i) {
  const r = cn;
  ae(e, !1), e.save(), e.beginPath(), e.roundRect(t.x, t.y, t.w, t.h, r.radius), e.fillStyle = o.turf, e.fill(), e.clip();
  const a = ho[n.field], s = t.w - r.pad * 2, l = t.h - r.pad * 2, c = Math.min(s / a.w, l / a.d), p = { w: a.w * c, h: a.d * c, x: 0, y: 0 };
  p.x = t.x + (t.w - p.w) / 2, p.y = t.y + r.pad;
  const m = (F) => p.x + F * c, y = (F) => p.y + F * c;
  e.strokeStyle = be(o.line, r.line.alpha), e.lineWidth = r.line.width;
  const g = (F, B, z, D) => e.strokeRect(m(F), y(B), z * c, D * c), w = (F, B, z, D) => {
    e.beginPath(), e.moveTo(m(F), y(B)), e.lineTo(m(z), y(D)), e.stroke();
  }, d = (F, B, z, D, T) => {
    e.beginPath(), e.arc(m(F), y(B), z * c, D, T), e.stroke();
  }, b = (F, B) => {
    e.save(), e.strokeStyle = o.line, e.lineWidth = r.line.goal, w(F, 0, B, 0), e.restore();
  }, h = a.w, k = h / 2;
  switch (g(0, 0, h, a.d), n.field) {
    case "football":
      g(k - 20.16, 0, 40.32, 16.5), g(k - 9.16, 0, 18.32, 5.5), d(k, 11, 9.15, Math.asin(5.5 / 9.15), Math.PI - Math.asin(5.5 / 9.15)), d(k, a.d, 9.15, Math.PI, Math.PI * 2), b(k - 3.66, k + 3.66);
      break;
    case "futsal":
      d(k - 1.58, 0, 6, Math.PI / 2, Math.PI), d(k + 1.58, 0, 6, 0, Math.PI / 2), w(k - 1.58, 6, k + 1.58, 6), d(k, a.d, 3, Math.PI, Math.PI * 2), b(k - 1.5, k + 1.5);
      break;
    case "badminton":
      w(0.46, 0, 0.46, a.d), w(h - 0.46, 0, h - 0.46, a.d), w(0, 1.98, h, 1.98), w(k, 1.98, k, a.d), w(0, a.d - 0.76, h, a.d - 0.76), b(0, h);
      break;
    case "volleyball":
      w(0, 3, h, 3), b(0, h);
      break;
    case "basketball": {
      g(k - 2.45, 0, 4.9, 5.8), d(k, 5.8, 1.8, 0, Math.PI), d(k, 1.575, 1.25, 0, Math.PI);
      const B = 0.9, z = Math.sqrt(6.75 * 6.75 - (k - B) * (k - B));
      w(B, 0, B, 1.575 + z), w(h - B, 0, h - B, 1.575 + z), d(k, 1.575, 6.75, Math.atan2(z, k - B), Math.PI - Math.atan2(z, k - B)), d(k, a.d, 1.8, Math.PI, Math.PI * 2), b(k - 0.9, k + 0.9);
      break;
    }
    case "tennis":
      w(1.37, 0, 1.37, a.d), w(h - 1.37, 0, h - 1.37, a.d), w(1.37, 6.4, h - 1.37, 6.4), w(k, 0, k, 6.4), w(k, a.d - 0.2, k, a.d), b(0, h);
      break;
  }
  const _ = (F) => [p.x + F.x / 100 * p.w, p.y + F.y / 100 * p.h], x = (F) => ({ zone: 0, line: 1, arrow: 2, dot: 3, ball: 4, label: 5 })[F.kind];
  for (const F of [...n.marks].sort((B, z) => x(B) - x(z))) uo(e, F, _, p, o, i);
  e.restore();
}
function uo(e, n, t, o, i, r) {
  const a = cn, s = (l, c, p, m) => {
    l && (se(e, { family: r.sans, weight: a.label.weight, size: a.label.size }), e.fillStyle = m, e.fillText(l, c, p));
  };
  switch (n.kind) {
    case "zone": {
      const [l, c] = t(n.from), [p, m] = t(n.to);
      e.fillStyle = be(i.accent, a.zoneAlpha), e.fillRect(Math.min(l, p), Math.min(c, m), Math.abs(p - l), Math.abs(m - c));
      break;
    }
    case "line": {
      const l = o.y + n.y / 100 * o.h;
      e.save(), e.setLineDash(a.offside.dash), e.strokeStyle = i.accent, e.lineWidth = a.offside.width, e.beginPath(), e.moveTo(o.x, l), e.lineTo(o.x + o.w, l), e.stroke(), e.restore(), s(n.label, o.x + a.label.gap, l + a.label.size + a.label.gap / 2, i.accent);
      break;
    }
    case "arrow": {
      const [l, c] = t(n.from), [p, m] = t(n.to), y = Math.hypot(p - l, m - c);
      if (y < 1) break;
      const g = (p - l) / y, w = (m - c) / y, d = a.dot.r + a.arrow.width, b = l + g * d, h = c + w * d, k = p - g * d, _ = m - w * d;
      e.save(), n.style === "pass" && e.setLineDash(a.arrow.dash), e.strokeStyle = i.ink, e.lineWidth = a.arrow.width, e.beginPath(), e.moveTo(b, h), e.lineTo(k - g * a.arrow.head * 0.6, _ - w * a.arrow.head * 0.6), e.stroke(), e.restore();
      const x = a.arrow.head;
      e.fillStyle = i.ink, e.beginPath(), e.moveTo(k, _), e.lineTo(k - g * x - w * x * 0.55, _ - w * x + g * x * 0.55), e.lineTo(k - g * x + w * x * 0.55, _ - w * x - g * x * 0.55), e.closePath(), e.fill();
      break;
    }
    case "dot": {
      const [l, c] = t(n.at), p = n.team === "att" ? i.att : n.team === "def" ? i.def : i.ink;
      if (e.beginPath(), e.arc(l, c, a.dot.r, 0, Math.PI * 2), e.fillStyle = p, e.fill(), e.lineWidth = a.dot.stroke, e.strokeStyle = i.turf, e.stroke(), n.team === "player")
        se(e, { family: r.display, weight: r.displayWeight, size: a.dot.label }), e.fillStyle = i.bg, e.textAlign = "center", e.fillText(n.label, l, c + a.dot.label * 0.36), e.textAlign = "left";
      else {
        const m = l + a.dot.r + a.label.gap;
        se(e, { family: r.sans, weight: a.label.weight, size: a.label.size });
        const y = e.measureText(n.label).width, g = m + y > o.x + o.w ? l - a.dot.r - a.label.gap - y : m;
        s(n.label, g, c + a.label.size * 0.36, i.ink);
      }
      break;
    }
    case "ball": {
      const [l, c] = t(n.at);
      e.beginPath(), e.arc(l, c, a.ball.r, 0, Math.PI * 2), e.fillStyle = i.ink, e.fill(), e.lineWidth = a.ball.ring, e.strokeStyle = i.bg, e.stroke();
      break;
    }
    case "label": {
      const [l, c] = t(n.at);
      s(n.text, l, c, i.ink);
      break;
    }
  }
}
function Ui(e, n, t) {
  const { slide: o, variant: i, surface: r } = t;
  if (n.item.kind === "verdict") {
    const a = Dn(i, r, o.attrs.tone), s = Se.border;
    return ae(e, !1), e.strokeStyle = a, e.lineWidth = s, e.beginPath(), e.roundRect(n.x + s / 2, n.y + s / 2, n.w - s, n.h - s, Se.radius), e.stroke(), ae(e, t.onPhoto), se(e, ci(i)), e.fillStyle = a, e.fillText(n.item.label ?? "", n.x + s + Se.padX, n.y + n.h / 2 + Se.size * Se.capHeight / 2), !0;
  }
  return n.item.kind === "diagram" && o.diagram ? (fo(e, o.diagram, n, {
    turf: r.inlineCodeBg,
    line: r.ink,
    att: r.accent,
    def: Dn(i, r, "bad"),
    ink: r.ink,
    bg: r.bg,
    accent: r.accent
  }, {
    sans: i.fonts.sans,
    display: li(i),
    displayWeight: i.headlineWeight ?? 700
  }), !0) : !1;
}
const nt = { padX: 6, h: 0.62, rise: 0.5, radius: 6 }, Ut = { w: 3, rise: 0.32 };
function po(e, n, t) {
  if (n.highlight) {
    ae(e, !1), e.fillStyle = n.highlight;
    const o = Yt(n.lines, n.y, n.size, n.lh);
    n.lines.forEach((i, r) => {
      for (const a of i.runs)
        a.style === "accent" && (e.beginPath(), e.roundRect(n.x + a.x - nt.padX, o[r] - n.size * nt.rise, a.w + nt.padX * 2, n.size * nt.h, nt.radius), e.fill());
    });
  }
  if (ae(e, t && !n.highlight), Ti(
    e,
    n.lines,
    n.x,
    n.y,
    n.size,
    n.lh,
    n.style,
    { text: n.color, accent: n.highlight ? n.color : n.accent, codeBg: "rgba(127,127,127,0.18)", codeText: n.color },
    n.centerW
  ), n.strike) {
    ae(e, !1), e.fillStyle = n.color;
    const o = Yt(n.lines, n.y, n.size, n.lh);
    n.lines.forEach((i, r) => e.fillRect(n.x, o[r] - n.size * Ut.rise - Ut.w / 2, i.width, Ut.w));
  }
}
function mo(e, n, t) {
  ae(e, t), se(e, { family: n.family, weight: 400, size: n.size }), e.direction = "rtl", n.lines.forEach((o, i) => {
    const r = i === n.lines.length - 1, a = n.mark && r ? n.mark.gap + n.mark.w : 0, s = n.widths[i] + a, l = n.align === "center" ? n.x + (n.w + s) / 2 : n.x + n.w, c = n.y + i * n.size * n.lh + n.size * n.baseline;
    e.textAlign = "right", e.fillStyle = n.color, e.fillText(o, l, c), n.mark && r && (e.textAlign = "left", e.fillStyle = n.mark.color, e.fillText(n.mark.text, l - s, c));
  }), e.direction = "ltr", e.textAlign = "left";
}
function Ni(e, n, t, o, i, r) {
  ae(e, !1), e.strokeStyle = i, e.lineWidth = r, e.lineJoin = "miter";
  const a = o / 2;
  for (const s of [0, Math.PI / 4]) {
    e.beginPath();
    for (let l = 0; l < 4; l++) {
      const c = s + l * Math.PI / 2, p = n + a * Math.cos(c), m = t + a * Math.sin(c);
      l === 0 ? e.moveTo(p, m) : e.lineTo(p, m);
    }
    e.closePath(), e.stroke();
  }
}
function $i(e, n) {
  if (n.lex) {
    e.save();
    for (const t of n.lex.els)
      switch (t.k) {
        case "text":
          po(e, t, n.onPhoto);
          break;
        case "label":
          ae(e, n.onPhoto), se(e, t.font), e.fillStyle = t.color, _t(e, t.text, t.x, t.y + t.font.size * 1.3 * 0.78, t.tracking);
          break;
        case "pill":
          ae(e, !1), e.strokeStyle = t.color, e.lineWidth = 2, e.beginPath(), e.roundRect(t.x + 1, t.y + 1, t.w - 2, t.h - 2, t.h / 2), e.stroke(), se(e, t.font), e.fillStyle = t.color, _t(e, t.text, t.x + t.padX, t.y + t.h / 2 + t.font.size * 0.36, t.tracking);
          break;
        case "badge":
          ae(e, !1), e.fillStyle = t.bg, e.beginPath(), e.roundRect(t.x, t.y, t.w, t.h, t.radius), e.fill(), se(e, t.font), e.fillStyle = t.ink, e.textAlign = "center", e.fillText(t.text, t.x + t.w / 2, t.y + t.h / 2 + t.font.size * 0.36), e.textAlign = "left";
          break;
        case "rect":
          ae(e, !1), e.fillStyle = t.fill, e.beginPath(), t.radius ? e.roundRect(t.x, t.y, t.w, t.h, t.radius) : e.rect(t.x, t.y, t.w, t.h), e.fill();
          break;
        case "frame":
          ae(e, !1), e.strokeStyle = t.stroke, e.lineWidth = t.width, e.beginPath(), e.roundRect(t.x + t.width / 2, t.y + t.width / 2, t.w - t.width, t.h - t.width, t.radius), e.stroke();
          break;
        case "clip":
          e.save(), e.beginPath(), e.roundRect(t.x, t.y, t.w, t.h, t.radius), e.clip();
          break;
        case "unclip":
          e.restore();
          break;
        case "icon":
          ae(e, !1), Xe(e, t.name, t.x, t.y, t.size, t.color);
          break;
        case "arabic":
          mo(e, t, n.onPhoto);
          break;
        case "star":
          Ni(e, t.cx, t.cy, t.size, t.color, t.width);
          break;
      }
    e.restore();
  }
}
function wn(e, n) {
  const { slide: t, deck: o, variant: i, surface: r, onPhoto: a } = n, s = i.fonts.sans, l = i.fonts.serif ?? s;
  if (!a && i.deco.blobs) {
    const c = t.type === "cover" || t.type === "end";
    Ya(e, ur(o.slug, t.index), r.blob, c);
  }
  if (n.lex) {
    vt(e, n, r.body, r.muted), Et(e, n, r.muted, r.muted), $i(e, n);
    return;
  }
  if (t.type === "quote" && !n.center) {
    const c = we.quoteMark;
    ae(e, !1), se(e, { family: l, weight: c.weight, size: c.size }), e.fillStyle = be(r.accent, c.alpha), e.fillText("“", c.x, go(n, c.top) + c.size * 0.72);
  }
  vt(e, n, r.body, r.muted), Et(e, n, r.muted, r.muted), e.save(), n.stack.overflow && Li(e);
  for (const c of n.stack.placed) {
    const p = c.item;
    switch (p.kind) {
      case "text":
        Pi(e, c, r, a, n.center);
        break;
      case "badge": {
        const m = we.badge;
        ae(e, !1), e.fillStyle = r.badgeBg, e.beginPath(), e.arc(c.x + m.d / 2, c.y + m.d / 2, m.d / 2, 0, Math.PI * 2), e.fill(), se(e, { family: s, weight: m.weight, size: m.digit }), e.fillStyle = r.badgeInk, e.textAlign = "center", e.fillText(p.label ?? "", c.x + m.d / 2, c.y + m.d / 2 + m.digit * 0.36 + m.opticalY), e.textAlign = "left";
        break;
      }
      case "kicker": {
        const m = we.kicker;
        ae(e, a), se(e, { family: s, weight: m.weight, size: m.size }), e.fillStyle = r.accent, _t(e, p.label ?? "", c.x, c.y + m.size * 0.92, m.tracking);
        break;
      }
      case "attribution": {
        const m = we.attribution;
        ae(e, a), se(e, { family: s, weight: m.weight, size: m.size }), e.fillStyle = r.muted, e.fillText(Mi(e, p.label ?? "", V), c.x, c.y + m.size * 0.92);
        break;
      }
      case "icon":
        n.icon && (ae(e, !1), Xe(e, n.icon, c.x, c.y, we.icon, r.icon));
        break;
      case "code":
        Ri(e, c, i.code, i.fonts.mono, we.code.radius, V);
        break;
      case "cta":
        Oi(e, c, p.label ?? "", r, s);
        break;
      case "number":
        break;
      case "verdict":
      case "diagram":
        Ui(e, c, n);
        break;
    }
  }
  e.restore();
}
function go(e, n) {
  return (e.stack.placed[0]?.y ?? ce.quoteTop) - (ce.quoteTop - n);
}
const Fe = {
  coverHeadline: { weight: 800, max: 116, min: 80, step: 4, lh: 1.05, maxLines: 5, widowFix: !0 },
  coverSubtitle: { weight: 400, max: 40, min: 32, step: 2, lh: 1.45, maxLines: 3 },
  cardHeadline: { weight: 700, max: 84, min: 60, step: 4, lh: 1.12, maxLines: 5, widowFix: !0 },
  codeHeadline: { weight: 700, max: 72, min: 56, step: 4, lh: 1.12, maxLines: 3, widowFix: !0 },
  // body min 30 → 32 for phone legibility (owner, Oct 2026).
  body: { weight: 400, max: 40, min: 32, step: 2, lh: 1.5, maxLines: 6 },
  note: { weight: 400, max: 32, min: 30, step: 2, lh: 1.45, maxLines: 3 },
  quote: { weight: 600, max: 68, min: 48, step: 4, lh: 1.2, maxLines: 7, widowFix: !0 },
  endHeadline: { weight: 800, max: 108, min: 76, step: 4, lh: 1.06, maxLines: 4, widowFix: !0 }
}, bo = {
  coverHeadline: { ...Fe.coverHeadline, max: 136, min: 92 },
  cardHeadline: { ...Fe.cardHeadline, max: 104, min: 72, lh: 1.02, maxLines: 6 },
  codeHeadline: { ...Fe.codeHeadline, max: 88, min: 64, lh: 1.02 },
  endHeadline: { ...Fe.endHeadline, max: 128, min: 88, lh: 1 }
}, ze = {
  number: { size: 44, weight: 600, h: 44, bar: { w: 48, h: 4, gap: 20 } },
  kicker: { size: 26, weight: 600, tracking: 2, padY: 14, padX: 22, border: 2, radius: 12 },
  attribution: { size: 30, weight: 500, lh: 1.3 },
  icon: 112,
  // Short blocks are the payoff: up to 56 px when the block has ≤ shortLines lines (Oct 2026 review).
  code: { max: 44, maxShort: 56, shortLines: 4, min: 28, step: 2, lh: 1.55, maxLines: 14, padX: 36, padY: 32, titleBar: 64, radius: 24 },
  quoteMark: { size: 200, weight: 700, x: 90, top: 330 }
}, de = {
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
function Nn(e) {
  if (ot(e.slide.type)) return pn(e);
  if (st(e.slide.type)) return gn(e);
  const { slide: n, deck: t, variant: o, measurer: i } = e, r = o.fonts.sans, a = o.fonts.mono, s = [], l = [], { surface: c, name: p, onPhoto: m } = St(o, n, e.hasPhoto, s), y = o.headlineWeight, g = o.family === "sport" ? o.fonts.serif ?? r : r, w = (S, u = !1) => {
    const R = u && y ? y : S.weight, K = u ? g : r;
    return { ...S, min: Ai(S.min, K), weight: R, family: K, mono: { family: a, weight: R >= 600 ? 600 : 400 } };
  }, d = [], b = (S) => {
    d.push({ ...S, gap: d.length ? S.gap : 0 });
  }, h = bi(n, t), k = (S) => {
    h && b({ kind: "cta", h: ne.cta.h, w: bt(h, r, i), gap: S, label: h });
  }, _ = () => {
    e.icon && b({ kind: "icon", h: ze.icon, w: ze.icon, gap: de.iconGap });
  }, x = (S) => {
    if (n.badge === null) return;
    const u = ze.number, R = String(n.badge).padStart(2, "0"), K = i.width(R, { family: a, weight: u.weight, size: u.size }) + u.bar.gap + u.bar.w;
    b({ kind: "number", h: u.h, w: K, gap: S, label: R });
  }, F = o.family === "sport" ? { ...Fe, ...bo } : Fe, B = () => {
    if (!n.attrs.kicker) return !1;
    const S = ze.kicker, u = n.attrs.kicker.toUpperCase(), R = i.width(u, { family: a, weight: S.weight, size: S.size }) + S.tracking * Math.max(0, Array.from(u).length - 1) + S.padX * 2;
    return b({ kind: "kicker", h: S.size + S.padY * 2, w: Math.min(R, V), gap: 0, label: u }), !0;
  }, z = (S) => Ta(o.headlineUpper ? xn(S) : S, o.headlinePrefix);
  let D = de.cardTop;
  switch (n.type) {
    case "cover": {
      D = de.coverTop, B(), b({ kind: "text", role: "headline", rich: z(n.headline), spec: w(F.coverHeadline, !0), gap: de.gap, tone: "ink" }), Ae(n.body) || b({ kind: "text", role: "subtitle", rich: n.body, spec: w(Fe.coverSubtitle), gap: de.gap, tone: "muted" });
      break;
    }
    case "card": {
      const S = B(), u = Xt(n, o, i, de.gap);
      u ? b(u) : S || x(0), b({ kind: "text", role: "headline", rich: z(n.headline), spec: w(F.cardHeadline, !0), gap: de.gap, tone: "ink" }), Ae(n.body) || b({ kind: "text", role: "body", rich: n.body, spec: w(Fe.body), gap: de.gap, tone: "body" }), _(), k(ne.cta.gapBefore);
      break;
    }
    case "code": {
      if (x(0), b({ kind: "text", role: "headline", rich: z(n.headline), spec: w(F.codeHeadline, !0), gap: de.codeNumberGap, tone: "ink" }), Ae(n.body) || b({ kind: "text", role: "body", rich: n.body, spec: w(Fe.body), gap: de.codeBodyGap, tone: "muted" }), n.code) {
        const S = ze.code, u = fi(n.code.text, n.code.lang), R = {
          family: a,
          weight: 400,
          max: u.length <= S.shortLines ? S.maxShort : S.max,
          min: S.min,
          step: S.step,
          lh: S.lh,
          maxLines: S.maxLines,
          padX: S.padX,
          padTop: S.padY,
          padBottom: S.padY,
          titleBar: o.code.dots ? S.titleBar : 0
        };
        b({ kind: "code", lines: u, lang: n.code.lang, spec: R, gap: de.codeGap });
      }
      Ae(n.note) || b({ kind: "text", role: "note", rich: n.note, spec: w(Fe.note), gap: de.noteGap, tone: "muted" }), k(ne.cta.gapBefore);
      break;
    }
    case "diagram": {
      const S = Xt(n, o, i, 0);
      S ? b(S) : x(0);
      const u = hi(n, de.codeNumberGap);
      u && b(u), b({ kind: "text", role: "headline", rich: z(n.headline), spec: w(F.codeHeadline, !0), gap: de.codeGap, tone: "ink" }), Ae(n.body) || b({ kind: "text", role: "body", rich: n.body, spec: w(Fe.body), gap: de.codeBodyGap, tone: "body" }), Ae(n.note) || b({ kind: "text", role: "note", rich: n.note, spec: w(Fe.note), gap: de.noteGap, tone: "muted" }), k(ne.cta.gapBefore);
      break;
    }
    case "quote": {
      if (D = de.quoteTop, B(), b({ kind: "text", role: "quote", rich: n.headline, spec: w(Fe.quote), gap: de.gap, tone: "ink" }), n.attribution) {
        const S = ze.attribution, u = `— ${n.attribution}`, R = Math.min(V, i.width(u, { family: a, weight: S.weight, size: S.size }));
        b({ kind: "attribution", h: S.size * S.lh, w: R, gap: de.gap, label: u });
      }
      Ae(n.body) || b({ kind: "text", role: "body", rich: n.body, spec: w(Fe.body), gap: de.quoteBodyGap, tone: "body" }), _(), k(ne.cta.gapBefore);
      break;
    }
    case "end": {
      D = de.endTop, b({ kind: "text", role: "headline", rich: o.headlineUpper ? xn(n.headline) : n.headline, spec: w(F.endHeadline, !0), gap: 0, tone: "ink" }), Ae(n.body) || b({ kind: "text", role: "body", rich: n.body, spec: w(Fe.body), gap: de.gap, tone: "muted" }), _(), k(de.endCtaGap);
      break;
    }
  }
  const T = gi(d, ki(D), i);
  wi(T, n.type === "cover" ? D : ke.stackTopCard, m);
  const j = zt(e, r, a, l), X = Dt(e, r, a, l, !1);
  l.push(...vi(T)), s.push(..._i(n, T));
  const A = T.placed.some((S) => S.item.kind === "icon") ? e.icon : null;
  return {
    slide: n,
    deck: t,
    variant: o,
    surface: c,
    surfaceName: p,
    onPhoto: m,
    stack: T,
    icon: A,
    ctaLabel: h,
    header: j,
    footer: X,
    boxes: l,
    warnings: s
  };
}
const Tt = {
  dotGrid: { spacing: 48, r: 2 },
  glow: { x: 980, y: 260, r: 520 },
  scanlines: { every: 6, h: 2, color: "rgba(0,0,0,0.18)" },
  bigGlyph: { size: 560, weight: 700, alpha: 0.05, right: 1140, baseline: 1980 }
};
function wo(e, n) {
  const { spacing: t, r: o } = Tt.dotGrid;
  e.fillStyle = n;
  for (let i = t / 2; i < ue.h; i += t)
    for (let r = t / 2; r < ue.w; r += t)
      e.beginPath(), e.arc(r, i, o, 0, Math.PI * 2), e.fill();
}
function yo(e, n, t) {
  const { x: o, y: i, r } = Tt.glow, a = e.createRadialGradient(o, i, 0, o, i, r);
  a.addColorStop(0, be(n, t)), a.addColorStop(1, be(n, 0)), e.fillStyle = a, e.fillRect(0, 0, ue.w, ue.h);
}
function $n(e) {
  const { every: n, h: t, color: o } = Tt.scanlines;
  e.fillStyle = o;
  for (let i = 0; i < ue.h; i += n) e.fillRect(0, i, ue.w, t);
}
function ko(e, n, t, o) {
  const i = Tt.bigGlyph;
  se(e, { family: t, weight: i.weight, size: i.size }), e.fillStyle = be(o, i.alpha), e.textAlign = "right", e.fillText(n, i.right, i.baseline), e.textAlign = "left";
}
function jn(e, n) {
  const { slide: t, variant: o, surface: i, onPhoto: r } = n, a = o.fonts.sans, s = o.fonts.mono;
  if (r || (o.deco.dotGrid && o.deco.dotColor && wo(e, o.deco.dotColor), o.deco.glow && yo(e, i.accent, o.deco.glowAlpha ?? 0.08), o.deco.bigGlyph && (t.type === "cover" || t.type === "end") && ko(e, o.deco.bigGlyph, s, i.ink)), n.lex) {
    vt(e, n, i.body, i.muted), Et(e, n, i.muted, i.muted), $i(e, n), !r && o.deco.scanlines && $n(e);
    return;
  }
  if (t.type === "quote") {
    const l = ze.quoteMark;
    ae(e, r), se(e, { family: s, weight: l.weight, size: l.size }), e.fillStyle = i.accent, e.fillText('"', l.x, _o(n, l.top) + l.size * 0.72);
  }
  vt(e, n, i.body, i.muted), Et(e, n, i.muted, i.muted), e.save(), n.stack.overflow && Li(e);
  for (const l of n.stack.placed) {
    const c = l.item;
    switch (c.kind) {
      case "text":
        Pi(e, l, i, r);
        break;
      case "number": {
        const p = ze.number;
        ae(e, r), se(e, { family: s, weight: p.weight, size: p.size }), e.fillStyle = i.accent;
        const m = l.y + p.size * 0.86;
        e.fillText(c.label ?? "", l.x, m);
        const y = e.measureText(c.label ?? "").width, g = m - p.size * 0.36;
        e.fillRect(l.x + y + p.bar.gap, g - p.bar.h / 2, p.bar.w, p.bar.h);
        break;
      }
      case "kicker": {
        const p = ze.kicker;
        ae(e, !1), e.strokeStyle = i.accent, e.lineWidth = p.border, e.beginPath(), e.roundRect(l.x + p.border / 2, l.y + p.border / 2, l.w - p.border, l.h - p.border, p.radius), e.stroke(), ae(e, r), se(e, { family: s, weight: p.weight, size: p.size }), e.fillStyle = i.accent, _t(e, c.label ?? "", l.x + p.padX, l.y + l.h / 2 + p.size * 0.36, p.tracking);
        break;
      }
      case "attribution": {
        const p = ze.attribution;
        ae(e, r), se(e, { family: s, weight: p.weight, size: p.size }), e.fillStyle = i.muted, e.fillText(Mi(e, c.label ?? "", V), l.x, l.y + p.size * 0.92);
        break;
      }
      case "icon":
        n.icon && (ae(e, !1), Xe(e, n.icon, l.x, l.y, ze.icon, i.icon));
        break;
      case "code":
        Ri(e, l, o.code, s, ze.code.radius, V);
        break;
      case "cta":
        Oi(e, l, c.label ?? "", i, a);
        break;
      case "badge":
        break;
      case "verdict":
      case "diagram":
        Ui(e, l, n);
        break;
    }
  }
  e.restore(), !r && o.deco.scanlines && $n(e);
}
function _o(e, n) {
  return (e.stack.placed[0]?.y ?? de.quoteTop) - (de.quoteTop - n);
}
const rt = (e, n, t, o, i, r, a, s, l, c) => ({ bg: e, ink: n, body: t, muted: o, accent: i, badgeBg: r, badgeInk: a, blob: s, icon: l, inlineCodeBg: c }), ji = {
  bg: "#000000",
  ink: "#FFFFFF",
  body: "rgba(255,255,255,0.90)",
  muted: "rgba(255,255,255,0.75)",
  icon: "#FFFFFF",
  blob: "rgba(0,0,0,0)",
  inlineCodeBg: "rgba(255,255,255,0.18)"
}, Wi = {
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
}, vo = {
  id: "lexicon/kamus",
  name: "Kamus",
  family: "lexicon",
  fonts: { serif: "Lora", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    paper: rt("#F6F1E7", "#1E1B18", "#3A342D", "#6E665C", "#A3221B", "#B3261E", "#FFFFFF", "#F6F1E7", "#B3261E", "#EAE1CF"),
    "paper-alt": rt("#EFE7D6", "#1E1B18", "#37312A", "#675F55", "#9E211A", "#B3261E", "#FFFFFF", "#EFE7D6", "#B3261E", "#E3D8C2"),
    deep: rt("#2A211C", "#F6F1E7", "#E1D8C8", "#B3A894", "#F08A7E", "#F08A7E", "#2A211C", "#2A211C", "#F08A7E", "#3A2F28")
  },
  rotation: ["paper", "paper-alt"],
  onPhoto: { ...ji, accent: "#F5B3AA", badgeBg: "#F08A7E", badgeInk: "#2A211C", tint: "#1A1410" },
  code: Wi,
  deco: { blobs: !1, dotGrid: !1, scanlines: !1, glow: !1, bigGlyph: null, doubleRule: !0 },
  swatches: ["#F6F1E7", "#B3261E", "#1E1B18", "#E8DFCC"],
  lex: { rule: "#DCCFB8", highlight: "#F3D9A4", okBg: "#E3EEDB", okInk: "#2E5A2A", badBg: "#F6DCD8", badInk: "#8E1F17" }
}, Eo = {
  id: "lexicon/notebook",
  name: "Notebook",
  family: "lexicon",
  fonts: { serif: "Lora", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    page: rt("#FBFBF7", "#1B2430", "#364152", "#677184", "#2448B8", "#2F5BD3", "#FFFFFF", "#FBFBF7", "#2F5BD3", "#EEF1F8"),
    deep: rt("#1D2A44", "#F4F6FB", "#D5DBE8", "#A3AEC4", "#9DB6FF", "#FFE58A", "#1D2A44", "#1D2A44", "#FFE58A", "#2A3A5C")
  },
  rotation: ["page"],
  onPhoto: { ...ji, accent: "#FFE58A", badgeBg: "#FFE58A", badgeInk: "#1D2A44", tint: "#0E1424" },
  code: Wi,
  deco: { blobs: !1, dotGrid: !1, scanlines: !1, glow: !1, bigGlyph: null, notebook: !0 },
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
}, Fo = [vo, Eo], Nt = {
  doubleRule: { y: 268, thick: 2, thin: 1, gap: 6 },
  notebook: { from: he.top, to: he.bottom, every: 64, h: 2, marginX: 72, marginW: 3, alpha: 0.55 },
  cornerGlyph: { size: 900, alpha: 0.04, x: 640, baseline: 2240 }
};
function Ao(e, n) {
  const { variant: t, surface: o, onPhoto: i } = n;
  if (i) return;
  ae(e, !1);
  const r = t.lex?.rule ?? be(o.muted, 0.3), a = n.surfaceName !== "deep";
  if (t.deco.notebook && a) {
    const s = Nt.notebook;
    e.fillStyle = be(r, s.alpha);
    for (let l = s.from; l <= s.to; l += s.every) e.fillRect(0, l, ue.w, s.h);
    t.lex?.margin && (e.fillStyle = t.lex.margin, e.fillRect(s.marginX, 0, s.marginW, ue.h));
  }
  if (t.deco.doubleRule) {
    const s = Nt.doubleRule;
    e.fillStyle = a ? r : be(o.muted, 0.35), e.fillRect(he.left, s.y, he.right - he.left, s.thick), e.fillRect(he.left, s.y + s.thick + s.gap, he.right - he.left, s.thin);
  }
  if (t.deco.cornerGlyph) {
    const s = Nt.cornerGlyph;
    se(e, { family: t.fonts.serif ?? t.fonts.sans, weight: 700, size: s.size }), e.fillStyle = be(o.ink, s.alpha), e.fillText(t.deco.cornerGlyph, s.x, s.baseline);
  }
}
function xo(e, n) {
  Ao(e, n), wn(e, n);
}
const Ft = (e, n, t, o, i, r, a, s, l, c) => ({ bg: e, ink: n, body: t, muted: o, accent: i, badgeBg: r, badgeInk: a, blob: s, icon: l, inlineCodeBg: c }), Gi = {
  bg: "#000000",
  ink: "#FFFFFF",
  body: "rgba(255,255,255,0.90)",
  muted: "rgba(255,255,255,0.75)",
  icon: "#FFFFFF",
  blob: "rgba(0,0,0,0)",
  inlineCodeBg: "rgba(255,255,255,0.18)"
}, Hi = {
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
}, Zi = { blobs: !1, dotGrid: !1, scanlines: !1, glow: !1, bigGlyph: null, frame: !0, minDarkness: 70 }, Co = {
  id: "serene/fajr",
  name: "Fajr",
  family: "serene",
  fonts: { serif: "Lora", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    paper: Ft("#F5F1E8", "#1F2B24", "#34423A", "#66706A", "#2F5D4A", "#2F5D4A", "#F5F1E8", "#F5F1E8", "#2F5D4A", "#EAE4D6"),
    deep: Ft("#1F3A30", "#F5F1E8", "#DCD8CC", "#A9B0A8", "#D8BC86", "#D8BC86", "#1F3A30", "#1F3A30", "#D8BC86", "#2A4A3E")
  },
  rotation: ["paper"],
  onPhoto: { ...Gi, accent: "#E9D3A6", badgeBg: "#D8BC86", badgeInk: "#1F3A30", tint: "#101A15" },
  code: Hi,
  deco: Zi,
  swatches: ["#F5F1E8", "#2F5D4A", "#B08D57", "#1F2B24"]
}, Bo = {
  id: "serene/isya",
  name: "Isya",
  family: "serene",
  fonts: { serif: "Lora", sans: "DM Sans", mono: "JetBrains Mono" },
  surfaces: {
    night: Ft("#12202B", "#F3EEE2", "#D2CBBB", "#9AA3A8", "#D9B76E", "#D9B76E", "#12202B", "#12202B", "#D9B76E", "#1C2E3C"),
    deep: Ft("#0C161E", "#F3EEE2", "#D2CBBB", "#9AA3A8", "#D9B76E", "#D9B76E", "#0C161E", "#0C161E", "#D9B76E", "#16242F")
  },
  rotation: ["night"],
  onPhoto: { ...Gi, accent: "#E9D3A6", badgeBg: "#D9B76E", badgeInk: "#12202B", tint: "#081016" },
  code: Hi,
  deco: Zi,
  swatches: ["#12202B", "#D9B76E", "#F3EEE2", "#1C2E3C"]
}, So = [Co, Bo], qe = (e, n, t, o, i, r, a, s, l, c) => ({ bg: e, ink: n, body: t, muted: o, accent: i, badgeBg: r, badgeInk: a, blob: s, icon: l, inlineCodeBg: c }), yn = {
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
}, kn = {
  family: "sport",
  fonts: { serif: "Barlow Condensed", sans: "Barlow", mono: "JetBrains Mono" },
  code: si.code,
  deco: { blobs: !1, dotGrid: !1, scanlines: !1, glow: !1, bigGlyph: null },
  headlineWeight: 800,
  headlineUpper: !0
}, Xi = { ok: "#3DDC84", warn: "#F5C518", bad: "#FF6B63" }, zo = {
  ...kn,
  id: "sport/papan",
  name: "Papan",
  surfaces: {
    papan: qe("#0F3324", "#F4F1E8", "#CFE0D3", "#8FB09A", "#F5C518", "#F5C518", "#0F3324", "#0F3324", "#F5C518", "#15452F"),
    deep: qe("#0B2A1D", "#F4F1E8", "#CFE0D3", "#8FB09A", "#F5C518", "#F5C518", "#0B2A1D", "#0B2A1D", "#F5C518", "#123C29")
  },
  rotation: ["papan"],
  onPhoto: { ...yn, tint: "#06140D" },
  semantic: Xi,
  swatches: ["#0F3324", "#15452F", "#F5C518", "#F4F1E8"]
}, Do = {
  ...kn,
  id: "sport/lapangan",
  name: "Lapangan",
  surfaces: {
    lapangan: qe("#14284A", "#F4F1E8", "#D2DBEA", "#93A3C2", "#F5C518", "#F5C518", "#14284A", "#14284A", "#F5C518", "#1C3766"),
    deep: qe("#0F1F3A", "#F4F1E8", "#D2DBEA", "#93A3C2", "#F5C518", "#F5C518", "#0F1F3A", "#0F1F3A", "#F5C518", "#18305A")
  },
  rotation: ["lapangan"],
  onPhoto: { ...yn, tint: "#070E1C" },
  semantic: Xi,
  swatches: ["#14284A", "#1C3766", "#F5C518", "#F4F1E8"]
}, Io = {
  ...kn,
  id: "sport/kapur",
  name: "Kapur",
  surfaces: {
    kapur: qe("#EFECE3", "#141714", "#3A3F3B", "#6F726C", "#8A5A00", "#141714", "#EFECE3", "#EFECE3", "#8A5A00", "#E2DED2"),
    deep: qe("#E6E2D7", "#141714", "#3A3F3B", "#6A6D67", "#8A5A00", "#141714", "#E6E2D7", "#E6E2D7", "#8A5A00", "#D8D3C5")
  },
  rotation: ["kapur"],
  onPhoto: { ...yn, tint: "#0B0C0B" },
  semantic: { ok: "#1E7A43", warn: "#8A5A00", bad: "#B3261E" },
  swatches: ["#EFECE3", "#141714", "#B3261E", "#1E7A43"]
}, To = [zo, Do, Io];
function Mo(e) {
  return st(e.slide.type) ? gn(e) : ot(e.slide.type) ? pn(e) : Jt(e, { center: !0 });
}
const Ro = {
  frame: { inset: 40, width: 2, alpha: 0.35, radius: 24 }
};
function Oo(e, n) {
  const t = Ro.frame;
  ae(e, !1), e.strokeStyle = be(n.surface.accent, t.alpha), e.lineWidth = t.width, e.beginPath(), e.roundRect(t.inset, t.inset, ue.w - t.inset * 2, ue.h - t.inset * 2, t.radius), e.stroke();
}
function Po(e, n) {
  const t = n.stack.placed[0];
  if (n.slide.type !== "end" || !t) return;
  const o = Ne.star;
  Ni(e, ue.w / 2, t.y - o.gap - o.size / 2, o.size, be(n.surface.accent, o.alpha), o.width);
}
function Lo(e, n) {
  n.variant.deco.frame && Oo(e, n), Po(e, n), wn(e, n);
}
const qi = {
  editorial: { layout: (e) => Jt(e), draw: wn },
  dev: { layout: Nn, draw: jn },
  // Normal slides use the editorial layout with lexicon tokens and fonts.
  lexicon: { layout: (e) => Jt(e), draw: xo },
  serene: { layout: Mo, draw: Lo },
  // Sport reuses the dev layout: display face + capitals for headlines, no terminal path.
  sport: { layout: Nn, draw: jn }
}, Uo = [...ya, ...va, ...Fo, ...So, ...To], Ye = new Map(Uo.map((e) => [e.id, e])), No = new Set(qn);
class $o extends Error {
  constructor(n, t) {
    super(`registerVariant("${n}") failed:
- ${t.join(`
- `)}`), this.id = n, this.issues = t, this.name = "VariantError";
  }
  id;
  issues;
}
function jo(e) {
  return ha(e, Object.keys(qi));
}
function _s(e, n = {}) {
  const t = String(e?.id), o = jo(e);
  if (No.has(t) ? o.unshift("built-in templates can't be replaced") : Ye.has(t) && !n.replace && o.unshift("already registered (pass { replace: true } to update it)"), o.length) throw new $o(t, o);
  const i = Object.freeze({ ...e });
  return Ye.set(t, i), i;
}
function vs(e) {
  return Ye.has(e);
}
function Yi(e) {
  const n = Ye.get(e);
  if (!n) throw new Error(`Unknown template ${e}`);
  return n;
}
function Es() {
  return [...Ye.values()];
}
function Wo(e) {
  return Ye.get(e)?.family;
}
function Ki(e) {
  return qi[e];
}
function Go(e, n = {}) {
  return Xr(e, { ...n, templateFamily: Wo });
}
function Vi(e, n) {
  if (typeof OffscreenCanvas < "u") {
    const i = new OffscreenCanvas(e, n), r = i.getContext("2d");
    if (r) return { canvas: i, ctx: r };
  }
  const t = document.createElement("canvas");
  t.width = e, t.height = n;
  const o = t.getContext("2d");
  if (!o) throw new Error("2D canvas not supported");
  return { canvas: t, ctx: o };
}
function Ji(e, n) {
  try {
    return document.fonts.check(`400 40px "${e}"`, n);
  } catch {
    return !1;
  }
}
function Ho(e, n, t, o, i = ue.w, r = ue.h) {
  const a = Math.max(i / e, r / n), s = e * a, l = n * a, c = (y, g, w) => Math.min(w, Math.max(g, y)), p = c(i / 2 - t * s, i - s, 0), m = c(r / 2 - o * l, r - l, 0);
  return { dx: p, dy: m, dw: s, dh: l };
}
function Zo(e) {
  return {
    wash: 0.1 + 0.35 * e,
    stops: [[0, 0.3 + 0.35 * e], [0.38, 0.06], [0.62, 0.1], [1, 0.48 + 0.35 * e]]
  };
}
function Xo(e, n, t, o) {
  const i = Ho(n.width, n.height, n.focalX, n.focalY);
  e.imageSmoothingEnabled = !0, e.imageSmoothingQuality = "high", e.drawImage(n.image, i.dx, i.dy, i.dw, i.dh);
  const r = Zo(Math.min(1, Math.max(0, t / 100)));
  e.fillStyle = be(o, r.wash), e.fillRect(0, 0, ue.w, ue.h);
  const a = e.createLinearGradient(0, 0, 0, ue.h);
  for (const [s, l] of r.stops) a.addColorStop(s, be(o, l));
  e.fillStyle = a, e.fillRect(0, 0, ue.w, ue.h);
}
const $t = { color: "#FF3B30", width: 6, dash: [18, 12] };
function Qi(e, n, t, o, i, r) {
  return Ki(t.family).layout({ slide: e, deck: n, variant: t, icon: i, hasPhoto: r, measurer: o });
}
function er(e, n) {
  return gr(e.slides, e.slug, Ke(n).icons);
}
function qo(e, n, t, o, i) {
  const r = Ci(e, Ji), a = Qi(n, t, o, r, i.icon, !!i.photo);
  e.save(), e.setTransform(1, 0, 0, 1, 0, 0), e.globalAlpha = 1, e.textBaseline = "alphabetic", e.textAlign = "left", e.fillStyle = a.onPhoto ? o.onPhoto.tint : a.surface.bg, e.fillRect(0, 0, ue.w, ue.h);
  const s = Math.max(o.deco.minDarkness ?? 0, i.darkness);
  if (i.photo && Xo(e, i.photo, s, o.onPhoto.tint), Ki(o.family).draw(e, a), i.preview && a.stack.overflow) {
    const l = a.stack.placed[0]?.y ?? ke.stackTopCard;
    e.setLineDash($t.dash), e.strokeStyle = $t.color, e.lineWidth = $t.width, e.strokeRect(he.left, l, V, ke.stackLimit - l), e.setLineDash([]);
  }
  return e.restore(), { warnings: a.warnings, boxes: a.boxes, overflow: a.stack.overflow, layout: a };
}
const Yo = [{ family: "Playfair Display", style: "normal", weight: "600", file: "playfair-display-latin-600-normal.woff2" }, { family: "Playfair Display", style: "normal", weight: "700", file: "playfair-display-latin-700-normal.woff2" }, { family: "Playfair Display", style: "normal", weight: "500", file: "playfair-display-latin-500-normal.woff2" }, { family: "Lora", style: "normal", weight: "500", file: "lora-latin-500-normal.woff2" }, { family: "Lora", style: "normal", weight: "600", file: "lora-latin-600-normal.woff2" }, { family: "Lora", style: "normal", weight: "700", file: "lora-latin-700-normal.woff2" }, { family: "Poppins", style: "normal", weight: "400", file: "poppins-latin-400-normal.woff2" }, { family: "Poppins", style: "normal", weight: "500", file: "poppins-latin-500-normal.woff2" }, { family: "Poppins", style: "normal", weight: "600", file: "poppins-latin-600-normal.woff2" }, { family: "DM Sans", style: "normal", weight: "400", file: "dm-sans-latin-400-normal.woff2" }, { family: "DM Sans", style: "normal", weight: "500", file: "dm-sans-latin-500-normal.woff2" }, { family: "DM Sans", style: "normal", weight: "600", file: "dm-sans-latin-600-normal.woff2" }, { family: "Inter", style: "normal", weight: "400", file: "inter-latin-400-normal.woff2" }, { family: "Inter", style: "normal", weight: "500", file: "inter-latin-500-normal.woff2" }, { family: "Inter", style: "normal", weight: "600", file: "inter-latin-600-normal.woff2" }, { family: "Inter", style: "normal", weight: "700", file: "inter-latin-700-normal.woff2" }, { family: "Inter", style: "normal", weight: "800", file: "inter-latin-800-normal.woff2" }, { family: "JetBrains Mono", style: "normal", weight: "400", file: "jetbrains-mono-latin-400-normal.woff2" }, { family: "JetBrains Mono", style: "normal", weight: "500", file: "jetbrains-mono-latin-500-normal.woff2" }, { family: "JetBrains Mono", style: "normal", weight: "600", file: "jetbrains-mono-latin-600-normal.woff2" }, { family: "JetBrains Mono", style: "normal", weight: "700", file: "jetbrains-mono-latin-700-normal.woff2" }, { family: "Gentium Book Plus", style: "normal", weight: "400", file: "gentium-book-plus-cyrillic-ext-400-normal.woff2", unicodeRange: "U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F" }, { family: "Gentium Book Plus", style: "normal", weight: "400", file: "gentium-book-plus-cyrillic-400-normal.woff2", unicodeRange: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116" }, { family: "Gentium Book Plus", style: "normal", weight: "400", file: "gentium-book-plus-greek-ext-400-normal.woff2", unicodeRange: "U+1F00-1FFF" }, { family: "Gentium Book Plus", style: "normal", weight: "400", file: "gentium-book-plus-greek-400-normal.woff2", unicodeRange: "U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF" }, { family: "Gentium Book Plus", style: "normal", weight: "400", file: "gentium-book-plus-vietnamese-400-normal.woff2", unicodeRange: "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB" }, { family: "Gentium Book Plus", style: "normal", weight: "400", file: "gentium-book-plus-latin-ext-400-normal.woff2", unicodeRange: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" }, { family: "Gentium Book Plus", style: "normal", weight: "400", file: "gentium-book-plus-latin-400-normal.woff2", unicodeRange: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }, { family: "Fraunces", style: "normal", weight: "500", file: "fraunces-latin-500-normal.woff2" }, { family: "Fraunces", style: "normal", weight: "600", file: "fraunces-latin-600-normal.woff2" }, { family: "Fraunces", style: "normal", weight: "700", file: "fraunces-latin-700-normal.woff2" }, { family: "Instrument Sans", style: "normal", weight: "400", file: "instrument-sans-latin-400-normal.woff2" }, { family: "Instrument Sans", style: "normal", weight: "500", file: "instrument-sans-latin-500-normal.woff2" }, { family: "Instrument Sans", style: "normal", weight: "600", file: "instrument-sans-latin-600-normal.woff2" }, { family: "Barlow", style: "normal", weight: "400", file: "barlow-latin-400-normal.woff2" }, { family: "Barlow", style: "normal", weight: "500", file: "barlow-latin-500-normal.woff2" }, { family: "Barlow", style: "normal", weight: "600", file: "barlow-latin-600-normal.woff2" }, { family: "Barlow", style: "normal", weight: "700", file: "barlow-latin-700-normal.woff2" }, { family: "Barlow Condensed", style: "normal", weight: "700", file: "barlow-condensed-latin-700-normal.woff2" }, { family: "Barlow Condensed", style: "normal", weight: "800", file: "barlow-condensed-latin-800-normal.woff2" }, { family: "Amiri Quran", style: "normal", weight: "400", file: "amiri-quran-arabic-400-normal.woff2" }, { family: "Amiri", style: "normal", weight: "400", file: "amiri-arabic-400-normal.woff2" }], Ko = {
  faces: Yo
}, Vo = Ko.faces;
let tr = null, en = null, tn = [];
const Wn = /* @__PURE__ */ new Map();
function Fs(e) {
  if (e.baseUrl !== void 0) {
    const n = String(e.baseUrl);
    tr = n.endsWith("/") ? n : `${n}/`;
  }
  if (e.resolveUrl && (en = e.resolveUrl), e.faces) {
    for (const n of e.faces) {
      if (!n || typeof n.family != "string" || typeof n.url != "string") throw new Error("configureFonts: every face needs { family, weight, url }");
      if (!(typeof n.weight == "number" || Array.isArray(n.weight) && n.weight.length === 2 && n.weight[0] <= n.weight[1])) throw new Error(`configureFonts: weight of "${n.family}" must be a number or [min, max]`);
    }
    tn = [...e.faces, ...tn];
  }
}
function Jo() {
  const e = String(import.meta.url).replace(/[^/]*$/, "");
  return new URL(`${e}../fonts/`).href;
}
function Qo(e) {
  if (en) return en(e);
  const n = tr ?? Jo();
  if (n.startsWith("file:") && typeof location < "u" && location.protocol !== "file:")
    throw new Error(`carousel-core: can't serve fonts from ${n}. Copy the package's fonts/ folder to your public files and call configureFonts({ baseUrl: '/your/path/fonts/' }) first`);
  return /^[a-z][a-z0-9+.-]*:/i.test(n) ? new URL(e, n).href : `${n}${e}`;
}
const es = (e, n) => typeof e == "number" ? e === n : n >= e[0] && n <= e[1];
function ts(e, n, t = "normal") {
  const o = tn.filter((i) => i.family === e && (i.style ?? "normal") === t && es(i.weight, n));
  return o.length ? o : Vo.filter((i) => i.family === e && i.style === t && Number(i.weight) === n).map((i) => ({
    family: e,
    weight: n,
    style: i.style,
    url: Qo(i.file),
    ...i.unicodeRange ? { unicodeRange: i.unicodeRange } : {}
  }));
}
function ns(e, n, t = "normal") {
  const o = ts(e, n, t);
  for (const i of o) {
    const r = typeof i.weight == "number" ? String(i.weight) : `${i.weight[0]} ${i.weight[1]}`, a = `${i.family}|${r}|${i.style ?? "normal"}|${i.unicodeRange ?? ""}|${i.url}`;
    if (Wn.has(a)) continue;
    const s = new FontFace(i.family, `url("${i.url}") format("woff2")`, {
      weight: r,
      style: i.style ?? "normal",
      ...i.unicodeRange ? { unicodeRange: i.unicodeRange } : {}
    });
    document.fonts.add(s), Wn.set(a, s);
  }
  return o.map((i) => i.url);
}
const is = "θɔːæʃʒŋəɜɪʊˈˌð", rs = 8e3;
function as(e) {
  const n = [], t = (i, r) => {
    if (i)
      for (const a of r)
        n.some((s) => s.family === i && s.weight === a) || n.push({ family: i, weight: a });
  }, o = Ke(e).weights(e);
  return o.serif && t(e.fonts.serif, o.serif), t(e.fonts.sans, o.sans), t(e.fonts.mono, o.mono), n.push({ family: "Gentium Book Plus", weight: 400, text: is }), n.push({ family: it, weight: 400, text: Kt }, { family: kt, weight: 400, text: Kt }), n;
}
const jt = /* @__PURE__ */ new Map();
function _n(e, n = rs) {
  const t = jt.get(e.id);
  if (t) return t;
  const o = os(as(e), n, `"${e.name}"`);
  return jt.set(e.id, o), o.catch(() => jt.delete(e.id)), o;
}
const Gn = (e) => `${e.weight} 40px "${e.family}"`;
async function os(e, n, t) {
  const o = new Set(e.map(Gn)), i = Promise.all(e.map(async (r) => {
    const a = Gn(r);
    let s = [];
    try {
      if (s = ns(r.family, r.weight), !(await document.fonts.load(a, r.text ?? "Aa09•—")).length || !document.fonts.check(a, r.text ?? "Aa")) throw new Error("not available after loading");
    } catch (l) {
      const c = s.length ? ` from ${s.join(", ")}` : " (no font file: add it with configureFonts({ faces }))";
      throw new Error(`carousel-core: font ${r.weight} "${r.family}" failed to load${c}: ${l instanceof Error ? l.message : String(l)}`);
    }
    o.delete(a);
  })).then(() => document.fonts.ready).then(() => {
  });
  return ss(i, n, () => `carousel-core: fonts for ${t} didn't load within ${n / 1e3} s; still waiting for ${[...o].map((r) => r.replace(" 40px", "")).join(", ")}`);
}
function ss(e, n, t) {
  return new Promise((o, i) => {
    const r = setTimeout(() => i(new Error(t())), n);
    e.then((a) => {
      clearTimeout(r), o(a);
    }, (a) => {
      clearTimeout(r), i(a);
    });
  });
}
async function ls(e) {
  return "convertToBlob" in e ? e.convertToBlob({ type: "image/png" }) : new Promise((n, t) => e.toBlob((o) => o ? n(o) : t(new Error("PNG encode failed")), "image/png"));
}
async function cs(e, n, t, o) {
  await _n(t);
  const { canvas: i, ctx: r } = Vi(ue.w, ue.h), a = qo(r, e, n, t, { ...o, preview: !1 });
  return { blob: await ls(i), warnings: a.warnings };
}
function As(e, n) {
  const t = URL.createObjectURL(e), o = document.createElement("a");
  o.href = t, o.download = n, o.rel = "noopener", document.body.appendChild(o), o.click(), o.remove(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
}
function xs(e) {
  return _n(typeof e == "string" ? Yi(e) : e);
}
class hs extends Error {
  constructor(n) {
    super(`carousel-core: ${n.length} blocking warning(s): ${n.map((t) => t.message).join("; ")}`), this.warnings = n, this.name = "BlockingWarningsError";
  }
  warnings;
}
function ds(e, n, t = () => !1) {
  const { ctx: o } = Vi(8, 8), i = Ci(o, Ji), r = er(e, n);
  return e.slides.flatMap((a, s) => Qi(a, e, n, i, r[s] ?? null, t(s)).warnings);
}
async function Cs(e, n = {}) {
  const t = n.photos, o = n.photoIds ?? (t && typeof t == "object" ? Object.keys(t) : void 0), i = {
    ...n.defaultTemplate ? { defaultTemplate: n.defaultTemplate } : {},
    ...n.defaultHandle !== void 0 ? { defaultHandle: n.defaultHandle } : {},
    ...o ? { photoIds: o } : {}
  }, r = typeof e == "string" ? Go(e, i) : { deck: e, warnings: [] }, { deck: a } = r, s = Yi(n.template ?? a.template);
  await _n(s);
  const l = async (w) => t ? typeof t == "function" ? await t(w) ?? null : t[w] ?? null : null, c = await Promise.all(a.slides.map((w) => w.photoId ? l(w.photoId) : null)), p = [...r.warnings, ...ds(a, s, (w) => !!c[w])];
  n.onWarnings?.(p, a);
  const m = p.filter(cr);
  if (m.length && (n.onBlocking ?? "throw") === "throw") throw new hs(m);
  const y = er(a, s), g = [];
  for (const [w, d] of a.slides.entries()) {
    const b = await cs(d, a, s, { photo: c[w] ?? null, darkness: n.darkness ?? 50, icon: y[w] ?? null });
    g.push(b.blob), n.onProgress?.(w + 1, a.slides.length);
  }
  return g;
}
function Bs(e, n, t) {
  const o = e.includes(`\r
`) ? `\r
` : `
`, i = on(e), r = sn(i), a = `${n}: ${t}`;
  if (r < 0) {
    const c = e.length ? e : "";
    return `${a}${o}---${o}${c}`;
  }
  const s = new RegExp(`^(\\s*)${n}\\s*:`);
  for (let c = 0; c < r; c++) {
    const p = s.exec(i[c]);
    if (p)
      return i[c] = `${p[1]}${a}`, i.join(o);
  }
  let l = r;
  for (; l > 0 && i[l - 1].trim() === ""; ) l--;
  return i.splice(l, 0, a), i.join(o);
}
function Ss(e, n) {
  const t = on(e), o = sn(t), i = new RegExp(`^\\s*${n}\\s*:\\s*(.*)$`);
  for (let r = 0; r < o; r++) {
    const a = i.exec(t[r]);
    if (a) return a[1].trim();
  }
}
const Hn = 100 * 1024, nn = "deck", nr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", fs = new Map([...nr].map((e, n) => [e, n]));
function us(e) {
  let n = "";
  for (let t = 0; t < e.length; t += 3) {
    const o = e[t] << 16 | (e[t + 1] ?? 0) << 8 | (e[t + 2] ?? 0), i = Math.min(4, Math.ceil((e.length - t) * 8 / 6));
    for (let r = 0; r < i; r++) n += nr[o >> 18 - 6 * r & 63];
  }
  return n;
}
function ps(e) {
  if (e.length % 4 === 1) return null;
  const n = new Uint8Array(Math.floor(e.length * 6 / 8));
  let t = 0, o = 0, i = 0;
  for (const r of e) {
    const a = fs.get(r);
    if (a === void 0) return null;
    t = (t << 6 | a) & 16777215, o += 6, o >= 8 && (o -= 8, n[i++] = t >> o & 255);
  }
  return n;
}
function zs(e, n) {
  const t = us(new TextEncoder().encode(e));
  return `${n.replace(/#.*$/s, "")}#${nn}=${t}`;
}
function ms(e) {
  const n = e.startsWith("#") ? e.slice(1) : e;
  for (const t of n.split("&"))
    if (t.startsWith(`${nn}=`)) return t.slice(nn.length + 1);
  return null;
}
function Ds(e) {
  try {
    const n = ms(String(e));
    if (n === null) return { ok: !1, reason: "missing" };
    if (Math.floor(n.length * 3 / 4) > Hn) return { ok: !1, reason: "too-large" };
    const t = ps(n);
    return t ? t.length > Hn ? { ok: !1, reason: "too-large" } : { ok: !0, text: new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 }).decode(t) } : { ok: !1, reason: "base64" };
  } catch {
    return { ok: !1, reason: "utf8" };
  }
}
var pt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function gs(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function mt(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Wt = { exports: {} };
var Zn;
function bs() {
  return Zn || (Zn = 1, (function(e, n) {
    (function(t) {
      e.exports = t();
    })(function() {
      return (function t(o, i, r) {
        function a(c, p) {
          if (!i[c]) {
            if (!o[c]) {
              var m = typeof mt == "function" && mt;
              if (!p && m) return m(c, !0);
              if (s) return s(c, !0);
              var y = new Error("Cannot find module '" + c + "'");
              throw y.code = "MODULE_NOT_FOUND", y;
            }
            var g = i[c] = { exports: {} };
            o[c][0].call(g.exports, function(w) {
              var d = o[c][1][w];
              return a(d || w);
            }, g, g.exports, t, o, i, r);
          }
          return i[c].exports;
        }
        for (var s = typeof mt == "function" && mt, l = 0; l < r.length; l++) a(r[l]);
        return a;
      })({ 1: [function(t, o, i) {
        var r = t("./utils"), a = t("./support"), s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        i.encode = function(l) {
          for (var c, p, m, y, g, w, d, b = [], h = 0, k = l.length, _ = k, x = r.getTypeOf(l) !== "string"; h < l.length; ) _ = k - h, m = x ? (c = l[h++], p = h < k ? l[h++] : 0, h < k ? l[h++] : 0) : (c = l.charCodeAt(h++), p = h < k ? l.charCodeAt(h++) : 0, h < k ? l.charCodeAt(h++) : 0), y = c >> 2, g = (3 & c) << 4 | p >> 4, w = 1 < _ ? (15 & p) << 2 | m >> 6 : 64, d = 2 < _ ? 63 & m : 64, b.push(s.charAt(y) + s.charAt(g) + s.charAt(w) + s.charAt(d));
          return b.join("");
        }, i.decode = function(l) {
          var c, p, m, y, g, w, d = 0, b = 0, h = "data:";
          if (l.substr(0, h.length) === h) throw new Error("Invalid base64 input, it looks like a data url.");
          var k, _ = 3 * (l = l.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (l.charAt(l.length - 1) === s.charAt(64) && _--, l.charAt(l.length - 2) === s.charAt(64) && _--, _ % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (k = a.uint8array ? new Uint8Array(0 | _) : new Array(0 | _); d < l.length; ) c = s.indexOf(l.charAt(d++)) << 2 | (y = s.indexOf(l.charAt(d++))) >> 4, p = (15 & y) << 4 | (g = s.indexOf(l.charAt(d++))) >> 2, m = (3 & g) << 6 | (w = s.indexOf(l.charAt(d++))), k[b++] = c, g !== 64 && (k[b++] = p), w !== 64 && (k[b++] = m);
          return k;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(t, o, i) {
        var r = t("./external"), a = t("./stream/DataWorker"), s = t("./stream/Crc32Probe"), l = t("./stream/DataLengthProbe");
        function c(p, m, y, g, w) {
          this.compressedSize = p, this.uncompressedSize = m, this.crc32 = y, this.compression = g, this.compressedContent = w;
        }
        c.prototype = { getContentWorker: function() {
          var p = new a(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")), m = this;
          return p.on("end", function() {
            if (this.streamInfo.data_length !== m.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), p;
        }, getCompressedWorker: function() {
          return new a(r.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, c.createWorkerFrom = function(p, m, y) {
          return p.pipe(new s()).pipe(new l("uncompressedSize")).pipe(m.compressWorker(y)).pipe(new l("compressedSize")).withStreamInfo("compression", m);
        }, o.exports = c;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(t, o, i) {
        var r = t("./stream/GenericWorker");
        i.STORE = { magic: "\0\0", compressWorker: function() {
          return new r("STORE compression");
        }, uncompressWorker: function() {
          return new r("STORE decompression");
        } }, i.DEFLATE = t("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(t, o, i) {
        var r = t("./utils"), a = (function() {
          for (var s, l = [], c = 0; c < 256; c++) {
            s = c;
            for (var p = 0; p < 8; p++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            l[c] = s;
          }
          return l;
        })();
        o.exports = function(s, l) {
          return s !== void 0 && s.length ? r.getTypeOf(s) !== "string" ? (function(c, p, m, y) {
            var g = a, w = y + m;
            c ^= -1;
            for (var d = y; d < w; d++) c = c >>> 8 ^ g[255 & (c ^ p[d])];
            return -1 ^ c;
          })(0 | l, s, s.length, 0) : (function(c, p, m, y) {
            var g = a, w = y + m;
            c ^= -1;
            for (var d = y; d < w; d++) c = c >>> 8 ^ g[255 & (c ^ p.charCodeAt(d))];
            return -1 ^ c;
          })(0 | l, s, s.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(t, o, i) {
        i.base64 = !1, i.binary = !1, i.dir = !1, i.createFolders = !0, i.date = null, i.compression = null, i.compressionOptions = null, i.comment = null, i.unixPermissions = null, i.dosPermissions = null;
      }, {}], 6: [function(t, o, i) {
        var r = null;
        r = typeof Promise < "u" ? Promise : t("lie"), o.exports = { Promise: r };
      }, { lie: 37 }], 7: [function(t, o, i) {
        var r = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", a = t("pako"), s = t("./utils"), l = t("./stream/GenericWorker"), c = r ? "uint8array" : "array";
        function p(m, y) {
          l.call(this, "FlateWorker/" + m), this._pako = null, this._pakoAction = m, this._pakoOptions = y, this.meta = {};
        }
        i.magic = "\b\0", s.inherits(p, l), p.prototype.processChunk = function(m) {
          this.meta = m.meta, this._pako === null && this._createPako(), this._pako.push(s.transformTo(c, m.data), !1);
        }, p.prototype.flush = function() {
          l.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, p.prototype.cleanUp = function() {
          l.prototype.cleanUp.call(this), this._pako = null;
        }, p.prototype._createPako = function() {
          this._pako = new a[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var m = this;
          this._pako.onData = function(y) {
            m.push({ data: y, meta: m.meta });
          };
        }, i.compressWorker = function(m) {
          return new p("Deflate", m);
        }, i.uncompressWorker = function() {
          return new p("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(t, o, i) {
        function r(g, w) {
          var d, b = "";
          for (d = 0; d < w; d++) b += String.fromCharCode(255 & g), g >>>= 8;
          return b;
        }
        function a(g, w, d, b, h, k) {
          var _, x, F = g.file, B = g.compression, z = k !== c.utf8encode, D = s.transformTo("string", k(F.name)), T = s.transformTo("string", c.utf8encode(F.name)), j = F.comment, X = s.transformTo("string", k(j)), A = s.transformTo("string", c.utf8encode(j)), S = T.length !== F.name.length, u = A.length !== j.length, R = "", K = "", $ = "", te = F.dir, W = F.date, ee = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          w && !d || (ee.crc32 = g.crc32, ee.compressedSize = g.compressedSize, ee.uncompressedSize = g.uncompressedSize);
          var O = 0;
          w && (O |= 8), z || !S && !u || (O |= 2048);
          var M = 0, Q = 0;
          te && (M |= 16), h === "UNIX" ? (Q = 798, M |= (function(Z, pe) {
            var Ee = Z;
            return Z || (Ee = pe ? 16893 : 33204), (65535 & Ee) << 16;
          })(F.unixPermissions, te)) : (Q = 20, M |= (function(Z) {
            return 63 & (Z || 0);
          })(F.dosPermissions)), _ = W.getUTCHours(), _ <<= 6, _ |= W.getUTCMinutes(), _ <<= 5, _ |= W.getUTCSeconds() / 2, x = W.getUTCFullYear() - 1980, x <<= 4, x |= W.getUTCMonth() + 1, x <<= 5, x |= W.getUTCDate(), S && (K = r(1, 1) + r(p(D), 4) + T, R += "up" + r(K.length, 2) + K), u && ($ = r(1, 1) + r(p(X), 4) + A, R += "uc" + r($.length, 2) + $);
          var q = "";
          return q += `
\0`, q += r(O, 2), q += B.magic, q += r(_, 2), q += r(x, 2), q += r(ee.crc32, 4), q += r(ee.compressedSize, 4), q += r(ee.uncompressedSize, 4), q += r(D.length, 2), q += r(R.length, 2), { fileRecord: m.LOCAL_FILE_HEADER + q + D + R, dirRecord: m.CENTRAL_FILE_HEADER + r(Q, 2) + q + r(X.length, 2) + "\0\0\0\0" + r(M, 4) + r(b, 4) + D + R + X };
        }
        var s = t("../utils"), l = t("../stream/GenericWorker"), c = t("../utf8"), p = t("../crc32"), m = t("../signature");
        function y(g, w, d, b) {
          l.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = w, this.zipPlatform = d, this.encodeFileName = b, this.streamFiles = g, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        s.inherits(y, l), y.prototype.push = function(g) {
          var w = g.meta.percent || 0, d = this.entriesCount, b = this._sources.length;
          this.accumulate ? this.contentBuffer.push(g) : (this.bytesWritten += g.data.length, l.prototype.push.call(this, { data: g.data, meta: { currentFile: this.currentFile, percent: d ? (w + 100 * (d - b - 1)) / d : 100 } }));
        }, y.prototype.openedSource = function(g) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = g.file.name;
          var w = this.streamFiles && !g.file.dir;
          if (w) {
            var d = a(g, w, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: d.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, y.prototype.closedSource = function(g) {
          this.accumulate = !1;
          var w = this.streamFiles && !g.file.dir, d = a(g, w, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(d.dirRecord), w) this.push({ data: (function(b) {
            return m.DATA_DESCRIPTOR + r(b.crc32, 4) + r(b.compressedSize, 4) + r(b.uncompressedSize, 4);
          })(g), meta: { percent: 100 } });
          else for (this.push({ data: d.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, y.prototype.flush = function() {
          for (var g = this.bytesWritten, w = 0; w < this.dirRecords.length; w++) this.push({ data: this.dirRecords[w], meta: { percent: 100 } });
          var d = this.bytesWritten - g, b = (function(h, k, _, x, F) {
            var B = s.transformTo("string", F(x));
            return m.CENTRAL_DIRECTORY_END + "\0\0\0\0" + r(h, 2) + r(h, 2) + r(k, 4) + r(_, 4) + r(B.length, 2) + B;
          })(this.dirRecords.length, d, g, this.zipComment, this.encodeFileName);
          this.push({ data: b, meta: { percent: 100 } });
        }, y.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, y.prototype.registerPrevious = function(g) {
          this._sources.push(g);
          var w = this;
          return g.on("data", function(d) {
            w.processChunk(d);
          }), g.on("end", function() {
            w.closedSource(w.previous.streamInfo), w._sources.length ? w.prepareNextSource() : w.end();
          }), g.on("error", function(d) {
            w.error(d);
          }), this;
        }, y.prototype.resume = function() {
          return !!l.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, y.prototype.error = function(g) {
          var w = this._sources;
          if (!l.prototype.error.call(this, g)) return !1;
          for (var d = 0; d < w.length; d++) try {
            w[d].error(g);
          } catch {
          }
          return !0;
        }, y.prototype.lock = function() {
          l.prototype.lock.call(this);
          for (var g = this._sources, w = 0; w < g.length; w++) g[w].lock();
        }, o.exports = y;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(t, o, i) {
        var r = t("../compressions"), a = t("./ZipFileWorker");
        i.generateWorker = function(s, l, c) {
          var p = new a(l.streamFiles, c, l.platform, l.encodeFileName), m = 0;
          try {
            s.forEach(function(y, g) {
              m++;
              var w = (function(k, _) {
                var x = k || _, F = r[x];
                if (!F) throw new Error(x + " is not a valid compression method !");
                return F;
              })(g.options.compression, l.compression), d = g.options.compressionOptions || l.compressionOptions || {}, b = g.dir, h = g.date;
              g._compressWorker(w, d).withStreamInfo("file", { name: y, dir: b, date: h, comment: g.comment || "", unixPermissions: g.unixPermissions, dosPermissions: g.dosPermissions }).pipe(p);
            }), p.entriesCount = m;
          } catch (y) {
            p.error(y);
          }
          return p;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(t, o, i) {
        function r() {
          if (!(this instanceof r)) return new r();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var a = new r();
            for (var s in this) typeof this[s] != "function" && (a[s] = this[s]);
            return a;
          };
        }
        (r.prototype = t("./object")).loadAsync = t("./load"), r.support = t("./support"), r.defaults = t("./defaults"), r.version = "3.10.2", r.loadAsync = function(a, s) {
          return new r().loadAsync(a, s);
        }, r.external = t("./external"), o.exports = r;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(t, o, i) {
        var r = t("./utils"), a = t("./external"), s = t("./utf8"), l = t("./zipEntries"), c = t("./stream/Crc32Probe"), p = t("./nodejsUtils");
        function m(y) {
          return new a.Promise(function(g, w) {
            var d = y.decompressed.getContentWorker().pipe(new c());
            d.on("error", function(b) {
              w(b);
            }).on("end", function() {
              d.streamInfo.crc32 !== y.decompressed.crc32 ? w(new Error("Corrupted zip : CRC32 mismatch")) : g();
            }).resume();
          });
        }
        o.exports = function(y, g) {
          var w = this;
          return g = r.extend(g || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: s.utf8decode }), p.isNode && p.isStream(y) ? a.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : r.prepareContent("the loaded zip file", y, !0, g.optimizedBinaryString, g.base64).then(function(d) {
            var b = new l(g);
            return b.load(d), b;
          }).then(function(d) {
            var b = [a.Promise.resolve(d)], h = d.files;
            if (g.checkCRC32) for (var k = 0; k < h.length; k++) b.push(m(h[k]));
            return a.Promise.all(b);
          }).then(function(d) {
            for (var b = d.shift(), h = b.files, k = 0; k < h.length; k++) {
              var _ = h[k], x = _.fileNameStr, F = r.resolve(_.fileNameStr);
              w.file(F, _.decompressed, { binary: !0, optimizedBinaryString: !0, date: _.date, dir: _.dir, comment: _.fileCommentStr.length ? _.fileCommentStr : null, unixPermissions: _.unixPermissions, dosPermissions: _.dosPermissions, createFolders: g.createFolders }), _.dir || (w.file(F).unsafeOriginalName = x);
            }
            return b.zipComment.length && (w.comment = b.zipComment), w;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(t, o, i) {
        var r = t("../utils"), a = t("../stream/GenericWorker");
        function s(l, c) {
          a.call(this, "Nodejs stream input adapter for " + l), this._upstreamEnded = !1, this._bindStream(c);
        }
        r.inherits(s, a), s.prototype._bindStream = function(l) {
          var c = this;
          (this._stream = l).pause(), l.on("data", function(p) {
            c.push({ data: p, meta: { percent: 0 } });
          }).on("error", function(p) {
            c.isPaused ? this.generatedError = p : c.error(p);
          }).on("end", function() {
            c.isPaused ? c._upstreamEnded = !0 : c.end();
          });
        }, s.prototype.pause = function() {
          return !!a.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, s.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, o.exports = s;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(t, o, i) {
        var r = t("readable-stream").Readable;
        function a(s, l, c) {
          r.call(this, l), this._helper = s;
          var p = this;
          s.on("data", function(m, y) {
            p.push(m) || p._helper.pause(), c && c(y);
          }).on("error", function(m) {
            p.emit("error", m);
          }).on("end", function() {
            p.push(null);
          });
        }
        t("../utils").inherits(a, r), a.prototype._read = function() {
          this._helper.resume();
        }, o.exports = a;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(t, o, i) {
        o.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(r, a) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(r, a);
          if (typeof r == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(r, a);
        }, allocBuffer: function(r) {
          if (Buffer.alloc) return Buffer.alloc(r);
          var a = new Buffer(r);
          return a.fill(0), a;
        }, isBuffer: function(r) {
          return Buffer.isBuffer(r);
        }, isStream: function(r) {
          return r && typeof r.on == "function" && typeof r.pause == "function" && typeof r.resume == "function";
        } };
      }, {}], 15: [function(t, o, i) {
        function r(F, B, z) {
          var D, T = s.getTypeOf(B), j = s.extend(z || {}, p);
          j.date = j.date || /* @__PURE__ */ new Date(), j.compression !== null && (j.compression = j.compression.toUpperCase()), typeof j.unixPermissions == "string" && (j.unixPermissions = parseInt(j.unixPermissions, 8)), j.unixPermissions && 16384 & j.unixPermissions && (j.dir = !0), j.dosPermissions && 16 & j.dosPermissions && (j.dir = !0), j.dir && (F = h(F)), j.createFolders && (D = b(F)) && k.call(this, D, !0);
          var X = T === "string" && j.binary === !1 && j.base64 === !1;
          z && z.binary !== void 0 || (j.binary = !X), (B instanceof m && B.uncompressedSize === 0 || j.dir || !B || B.length === 0) && (j.base64 = !1, j.binary = !0, B = "", j.compression = "STORE", T = "string");
          var A = null;
          A = B instanceof m || B instanceof l ? B : w.isNode && w.isStream(B) ? new d(F, B) : s.prepareContent(F, B, j.binary, j.optimizedBinaryString, j.base64);
          var S = new y(F, A, j);
          this.files[F] = S;
        }
        var a = t("./utf8"), s = t("./utils"), l = t("./stream/GenericWorker"), c = t("./stream/StreamHelper"), p = t("./defaults"), m = t("./compressedObject"), y = t("./zipObject"), g = t("./generate"), w = t("./nodejsUtils"), d = t("./nodejs/NodejsStreamInputAdapter"), b = function(F) {
          F.slice(-1) === "/" && (F = F.substring(0, F.length - 1));
          var B = F.lastIndexOf("/");
          return 0 < B ? F.substring(0, B) : "";
        }, h = function(F) {
          return F.slice(-1) !== "/" && (F += "/"), F;
        }, k = function(F, B) {
          return B = B !== void 0 ? B : p.createFolders, F = h(F), this.files[F] || r.call(this, F, null, { dir: !0, createFolders: B }), this.files[F];
        };
        function _(F) {
          return Object.prototype.toString.call(F) === "[object RegExp]";
        }
        var x = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(F) {
          var B, z, D;
          for (B in this.files) D = this.files[B], (z = B.slice(this.root.length, B.length)) && B.slice(0, this.root.length) === this.root && F(z, D);
        }, filter: function(F) {
          var B = [];
          return this.forEach(function(z, D) {
            F(z, D) && B.push(D);
          }), B;
        }, file: function(F, B, z) {
          if (arguments.length !== 1) return F = this.root + F, r.call(this, F, B, z), this;
          if (_(F)) {
            var D = F;
            return this.filter(function(j, X) {
              return !X.dir && D.test(j);
            });
          }
          var T = this.files[this.root + F];
          return T && !T.dir ? T : null;
        }, folder: function(F) {
          if (!F) return this;
          if (_(F)) return this.filter(function(T, j) {
            return j.dir && F.test(T);
          });
          var B = this.root + F, z = k.call(this, B), D = this.clone();
          return D.root = z.name, D;
        }, remove: function(F) {
          F = this.root + F;
          var B = this.files[F];
          if (B || (F.slice(-1) !== "/" && (F += "/"), B = this.files[F]), B && !B.dir) delete this.files[F];
          else for (var z = this.filter(function(T, j) {
            return j.name.slice(0, F.length) === F;
          }), D = 0; D < z.length; D++) delete this.files[z[D].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(F) {
          var B, z = {};
          try {
            if ((z = s.extend(F || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: a.utf8encode })).type = z.type.toLowerCase(), z.compression = z.compression.toUpperCase(), z.type === "binarystring" && (z.type = "string"), !z.type) throw new Error("No output type specified.");
            s.checkSupport(z.type), z.platform !== "darwin" && z.platform !== "freebsd" && z.platform !== "linux" && z.platform !== "sunos" || (z.platform = "UNIX"), z.platform === "win32" && (z.platform = "DOS");
            var D = z.comment || this.comment || "";
            B = g.generateWorker(this, z, D);
          } catch (T) {
            (B = new l("error")).error(T);
          }
          return new c(B, z.type || "string", z.mimeType);
        }, generateAsync: function(F, B) {
          return this.generateInternalStream(F).accumulate(B);
        }, generateNodeStream: function(F, B) {
          return (F = F || {}).type || (F.type = "nodebuffer"), this.generateInternalStream(F).toNodejsStream(B);
        } };
        o.exports = x;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(t, o, i) {
        o.exports = t("stream");
      }, { stream: void 0 }], 17: [function(t, o, i) {
        var r = t("./DataReader");
        function a(s) {
          r.call(this, s);
          for (var l = 0; l < this.data.length; l++) s[l] = 255 & s[l];
        }
        t("../utils").inherits(a, r), a.prototype.byteAt = function(s) {
          return this.data[this.zero + s];
        }, a.prototype.lastIndexOfSignature = function(s) {
          for (var l = s.charCodeAt(0), c = s.charCodeAt(1), p = s.charCodeAt(2), m = s.charCodeAt(3), y = this.length - 4; 0 <= y; --y) if (this.data[y] === l && this.data[y + 1] === c && this.data[y + 2] === p && this.data[y + 3] === m) return y - this.zero;
          return -1;
        }, a.prototype.readAndCheckSignature = function(s) {
          var l = s.charCodeAt(0), c = s.charCodeAt(1), p = s.charCodeAt(2), m = s.charCodeAt(3), y = this.readData(4);
          return l === y[0] && c === y[1] && p === y[2] && m === y[3];
        }, a.prototype.readData = function(s) {
          if (this.checkOffset(s), s === 0) return [];
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, l;
        }, o.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(t, o, i) {
        var r = t("../utils");
        function a(s) {
          this.data = s, this.length = s.length, this.index = 0, this.zero = 0;
        }
        a.prototype = { checkOffset: function(s) {
          this.checkIndex(this.index + s);
        }, checkIndex: function(s) {
          if (this.length < this.zero + s || s < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + s + "). Corrupted zip ?");
        }, setIndex: function(s) {
          this.checkIndex(s), this.index = s;
        }, skip: function(s) {
          this.setIndex(this.index + s);
        }, byteAt: function() {
        }, readInt: function(s) {
          var l, c = 0;
          for (this.checkOffset(s), l = this.index + s - 1; l >= this.index; l--) c = (c << 8) + this.byteAt(l);
          return this.index += s, c;
        }, readString: function(s) {
          return r.transformTo("string", this.readData(s));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var s = this.readInt(4);
          return new Date(Date.UTC(1980 + (s >> 25 & 127), (s >> 21 & 15) - 1, s >> 16 & 31, s >> 11 & 31, s >> 5 & 63, (31 & s) << 1));
        } }, o.exports = a;
      }, { "../utils": 32 }], 19: [function(t, o, i) {
        var r = t("./Uint8ArrayReader");
        function a(s) {
          r.call(this, s);
        }
        t("../utils").inherits(a, r), a.prototype.readData = function(s) {
          this.checkOffset(s);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, l;
        }, o.exports = a;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(t, o, i) {
        var r = t("./DataReader");
        function a(s) {
          r.call(this, s);
        }
        t("../utils").inherits(a, r), a.prototype.byteAt = function(s) {
          return this.data.charCodeAt(this.zero + s);
        }, a.prototype.lastIndexOfSignature = function(s) {
          return this.data.lastIndexOf(s) - this.zero;
        }, a.prototype.readAndCheckSignature = function(s) {
          return s === this.readData(4);
        }, a.prototype.readData = function(s) {
          this.checkOffset(s);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, l;
        }, o.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(t, o, i) {
        var r = t("./ArrayReader");
        function a(s) {
          r.call(this, s);
        }
        t("../utils").inherits(a, r), a.prototype.readData = function(s) {
          if (this.checkOffset(s), s === 0) return new Uint8Array(0);
          var l = this.data.subarray(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, l;
        }, o.exports = a;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(t, o, i) {
        var r = t("../utils"), a = t("../support"), s = t("./ArrayReader"), l = t("./StringReader"), c = t("./NodeBufferReader"), p = t("./Uint8ArrayReader");
        o.exports = function(m) {
          var y = r.getTypeOf(m);
          return r.checkSupport(y), y !== "string" || a.uint8array ? y === "nodebuffer" ? new c(m) : a.uint8array ? new p(r.transformTo("uint8array", m)) : new s(r.transformTo("array", m)) : new l(m);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(t, o, i) {
        i.LOCAL_FILE_HEADER = "PK", i.CENTRAL_FILE_HEADER = "PK", i.CENTRAL_DIRECTORY_END = "PK", i.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", i.ZIP64_CENTRAL_DIRECTORY_END = "PK", i.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(t, o, i) {
        var r = t("./GenericWorker"), a = t("../utils");
        function s(l) {
          r.call(this, "ConvertWorker to " + l), this.destType = l;
        }
        a.inherits(s, r), s.prototype.processChunk = function(l) {
          this.push({ data: a.transformTo(this.destType, l.data), meta: l.meta });
        }, o.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(t, o, i) {
        var r = t("./GenericWorker"), a = t("../crc32");
        function s() {
          r.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        t("../utils").inherits(s, r), s.prototype.processChunk = function(l) {
          this.streamInfo.crc32 = a(l.data, this.streamInfo.crc32 || 0), this.push(l);
        }, o.exports = s;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(t, o, i) {
        var r = t("../utils"), a = t("./GenericWorker");
        function s(l) {
          a.call(this, "DataLengthProbe for " + l), this.propName = l, this.withStreamInfo(l, 0);
        }
        r.inherits(s, a), s.prototype.processChunk = function(l) {
          if (l) {
            var c = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = c + l.data.length;
          }
          a.prototype.processChunk.call(this, l);
        }, o.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(t, o, i) {
        var r = t("../utils"), a = t("./GenericWorker");
        function s(l) {
          a.call(this, "DataWorker");
          var c = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, l.then(function(p) {
            c.dataIsReady = !0, c.data = p, c.max = p && p.length || 0, c.type = r.getTypeOf(p), c.isPaused || c._tickAndRepeat();
          }, function(p) {
            c.error(p);
          });
        }
        r.inherits(s, a), s.prototype.cleanUp = function() {
          a.prototype.cleanUp.call(this), this.data = null;
        }, s.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, r.delay(this._tickAndRepeat, [], this)), !0);
        }, s.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (r.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, s.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var l = null, c = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              l = this.data.substring(this.index, c);
              break;
            case "uint8array":
              l = this.data.subarray(this.index, c);
              break;
            case "array":
            case "nodebuffer":
              l = this.data.slice(this.index, c);
          }
          return this.index = c, this.push({ data: l, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, o.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(t, o, i) {
        function r(a) {
          this.name = a || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        r.prototype = { push: function(a) {
          this.emit("data", a);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (a) {
            this.emit("error", a);
          }
          return !0;
        }, error: function(a) {
          return !this.isFinished && (this.isPaused ? this.generatedError = a : (this.isFinished = !0, this.emit("error", a), this.previous && this.previous.error(a), this.cleanUp()), !0);
        }, on: function(a, s) {
          return this._listeners[a].push(s), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(a, s) {
          if (this._listeners[a]) for (var l = 0; l < this._listeners[a].length; l++) this._listeners[a][l].call(this, s);
        }, pipe: function(a) {
          return a.registerPrevious(this);
        }, registerPrevious: function(a) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = a.streamInfo, this.mergeStreamInfo(), this.previous = a;
          var s = this;
          return a.on("data", function(l) {
            s.processChunk(l);
          }), a.on("end", function() {
            s.end();
          }), a.on("error", function(l) {
            s.error(l);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var a = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), a = !0), this.previous && this.previous.resume(), !a;
        }, flush: function() {
        }, processChunk: function(a) {
          this.push(a);
        }, withStreamInfo: function(a, s) {
          return this.extraStreamInfo[a] = s, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var a in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, a) && (this.streamInfo[a] = this.extraStreamInfo[a]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var a = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + a : a;
        } }, o.exports = r;
      }, {}], 29: [function(t, o, i) {
        var r = t("../utils"), a = t("./ConvertWorker"), s = t("./GenericWorker"), l = t("../base64"), c = t("../support"), p = t("../external"), m = null;
        if (c.nodestream) try {
          m = t("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function y(w, d) {
          return new p.Promise(function(b, h) {
            var k = [], _ = w._internalType, x = w._outputType, F = w._mimeType;
            w.on("data", function(B, z) {
              k.push(B), d && d(z);
            }).on("error", function(B) {
              k = [], h(B);
            }).on("end", function() {
              try {
                var B = (function(z, D, T) {
                  switch (z) {
                    case "blob":
                      return r.newBlob(r.transformTo("arraybuffer", D), T);
                    case "base64":
                      return l.encode(D);
                    default:
                      return r.transformTo(z, D);
                  }
                })(x, (function(z, D) {
                  var T, j = 0, X = null, A = 0;
                  for (T = 0; T < D.length; T++) A += D[T].length;
                  switch (z) {
                    case "string":
                      return D.join("");
                    case "array":
                      return Array.prototype.concat.apply([], D);
                    case "uint8array":
                      for (X = new Uint8Array(A), T = 0; T < D.length; T++) X.set(D[T], j), j += D[T].length;
                      return X;
                    case "nodebuffer":
                      return Buffer.concat(D);
                    default:
                      throw new Error("concat : unsupported type '" + z + "'");
                  }
                })(_, k), F);
                b(B);
              } catch (z) {
                h(z);
              }
              k = [];
            }).resume();
          });
        }
        function g(w, d, b) {
          var h = d;
          switch (d) {
            case "blob":
            case "arraybuffer":
              h = "uint8array";
              break;
            case "base64":
              h = "string";
          }
          try {
            this._internalType = h, this._outputType = d, this._mimeType = b, r.checkSupport(h), this._worker = w.pipe(new a(h)), w.lock();
          } catch (k) {
            this._worker = new s("error"), this._worker.error(k);
          }
        }
        g.prototype = { accumulate: function(w) {
          return y(this, w);
        }, on: function(w, d) {
          var b = this;
          return w === "data" ? this._worker.on(w, function(h) {
            d.call(b, h.data, h.meta);
          }) : this._worker.on(w, function() {
            r.delay(d, arguments, b);
          }), this;
        }, resume: function() {
          return r.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(w) {
          if (r.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new m(this, { objectMode: this._outputType !== "nodebuffer" }, w);
        } }, o.exports = g;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(t, o, i) {
        if (i.base64 = !0, i.array = !0, i.string = !0, i.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", i.nodebuffer = typeof Buffer < "u", i.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") i.blob = !1;
        else {
          var r = new ArrayBuffer(0);
          try {
            i.blob = new Blob([r], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var a = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              a.append(r), i.blob = a.getBlob("application/zip").size === 0;
            } catch {
              i.blob = !1;
            }
          }
        }
        try {
          i.nodestream = !!t("readable-stream").Readable;
        } catch {
          i.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(t, o, i) {
        for (var r = t("./utils"), a = t("./support"), s = t("./nodejsUtils"), l = t("./stream/GenericWorker"), c = new Array(256), p = 0; p < 256; p++) c[p] = 252 <= p ? 6 : 248 <= p ? 5 : 240 <= p ? 4 : 224 <= p ? 3 : 192 <= p ? 2 : 1;
        c[254] = c[254] = 1;
        function m() {
          l.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function y() {
          l.call(this, "utf-8 encode");
        }
        i.utf8encode = function(g) {
          return a.nodebuffer ? s.newBufferFrom(g, "utf-8") : (function(w) {
            var d, b, h, k, _, x = w.length, F = 0;
            for (k = 0; k < x; k++) (64512 & (b = w.charCodeAt(k))) == 55296 && k + 1 < x && (64512 & (h = w.charCodeAt(k + 1))) == 56320 && (b = 65536 + (b - 55296 << 10) + (h - 56320), k++), F += b < 128 ? 1 : b < 2048 ? 2 : b < 65536 ? 3 : 4;
            for (d = a.uint8array ? new Uint8Array(F) : new Array(F), k = _ = 0; _ < F; k++) (64512 & (b = w.charCodeAt(k))) == 55296 && k + 1 < x && (64512 & (h = w.charCodeAt(k + 1))) == 56320 && (b = 65536 + (b - 55296 << 10) + (h - 56320), k++), b < 128 ? d[_++] = b : (b < 2048 ? d[_++] = 192 | b >>> 6 : (b < 65536 ? d[_++] = 224 | b >>> 12 : (d[_++] = 240 | b >>> 18, d[_++] = 128 | b >>> 12 & 63), d[_++] = 128 | b >>> 6 & 63), d[_++] = 128 | 63 & b);
            return d;
          })(g);
        }, i.utf8decode = function(g) {
          return a.nodebuffer ? r.transformTo("nodebuffer", g).toString("utf-8") : (function(w) {
            var d, b, h, k, _ = w.length, x = new Array(2 * _);
            for (d = b = 0; d < _; ) if ((h = w[d++]) < 128) x[b++] = h;
            else if (4 < (k = c[h])) x[b++] = 65533, d += k - 1;
            else {
              for (h &= k === 2 ? 31 : k === 3 ? 15 : 7; 1 < k && d < _; ) h = h << 6 | 63 & w[d++], k--;
              1 < k ? x[b++] = 65533 : h < 65536 ? x[b++] = h : (h -= 65536, x[b++] = 55296 | h >> 10 & 1023, x[b++] = 56320 | 1023 & h);
            }
            return x.length !== b && (x.subarray ? x = x.subarray(0, b) : x.length = b), r.applyFromCharCode(x);
          })(g = r.transformTo(a.uint8array ? "uint8array" : "array", g));
        }, r.inherits(m, l), m.prototype.processChunk = function(g) {
          var w = r.transformTo(a.uint8array ? "uint8array" : "array", g.data);
          if (this.leftOver && this.leftOver.length) {
            if (a.uint8array) {
              var d = w;
              (w = new Uint8Array(d.length + this.leftOver.length)).set(this.leftOver, 0), w.set(d, this.leftOver.length);
            } else w = this.leftOver.concat(w);
            this.leftOver = null;
          }
          var b = (function(k, _) {
            var x;
            for ((_ = _ || k.length) > k.length && (_ = k.length), x = _ - 1; 0 <= x && (192 & k[x]) == 128; ) x--;
            return x < 0 || x === 0 ? _ : x + c[k[x]] > _ ? x : _;
          })(w), h = w;
          b !== w.length && (a.uint8array ? (h = w.subarray(0, b), this.leftOver = w.subarray(b, w.length)) : (h = w.slice(0, b), this.leftOver = w.slice(b, w.length))), this.push({ data: i.utf8decode(h), meta: g.meta });
        }, m.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: i.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, i.Utf8DecodeWorker = m, r.inherits(y, l), y.prototype.processChunk = function(g) {
          this.push({ data: i.utf8encode(g.data), meta: g.meta });
        }, i.Utf8EncodeWorker = y;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(t, o, i) {
        var r = t("./support"), a = t("./base64"), s = t("./nodejsUtils"), l = t("./external");
        function c(d) {
          return d;
        }
        function p(d, b) {
          for (var h = 0; h < d.length; ++h) b[h] = 255 & d.charCodeAt(h);
          return b;
        }
        t("setimmediate"), i.newBlob = function(d, b) {
          i.checkSupport("blob");
          try {
            return new Blob([d], { type: b });
          } catch {
            try {
              var h = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return h.append(d), h.getBlob(b);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var m = { stringifyByChunk: function(d, b, h) {
          var k = [], _ = 0, x = d.length;
          if (x <= h) return String.fromCharCode.apply(null, d);
          for (; _ < x; ) b === "array" || b === "nodebuffer" ? k.push(String.fromCharCode.apply(null, d.slice(_, Math.min(_ + h, x)))) : k.push(String.fromCharCode.apply(null, d.subarray(_, Math.min(_ + h, x)))), _ += h;
          return k.join("");
        }, stringifyByChar: function(d) {
          for (var b = "", h = 0; h < d.length; h++) b += String.fromCharCode(d[h]);
          return b;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return r.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return r.nodebuffer && String.fromCharCode.apply(null, s.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function y(d) {
          var b = 65536, h = i.getTypeOf(d), k = !0;
          if (h === "uint8array" ? k = m.applyCanBeUsed.uint8array : h === "nodebuffer" && (k = m.applyCanBeUsed.nodebuffer), k) for (; 1 < b; ) try {
            return m.stringifyByChunk(d, h, b);
          } catch {
            b = Math.floor(b / 2);
          }
          return m.stringifyByChar(d);
        }
        function g(d, b) {
          for (var h = 0; h < d.length; h++) b[h] = d[h];
          return b;
        }
        i.applyFromCharCode = y;
        var w = {};
        w.string = { string: c, array: function(d) {
          return p(d, new Array(d.length));
        }, arraybuffer: function(d) {
          return w.string.uint8array(d).buffer;
        }, uint8array: function(d) {
          return p(d, new Uint8Array(d.length));
        }, nodebuffer: function(d) {
          return p(d, s.allocBuffer(d.length));
        } }, w.array = { string: y, array: c, arraybuffer: function(d) {
          return new Uint8Array(d).buffer;
        }, uint8array: function(d) {
          return new Uint8Array(d);
        }, nodebuffer: function(d) {
          return s.newBufferFrom(d);
        } }, w.arraybuffer = { string: function(d) {
          return y(new Uint8Array(d));
        }, array: function(d) {
          return g(new Uint8Array(d), new Array(d.byteLength));
        }, arraybuffer: c, uint8array: function(d) {
          return new Uint8Array(d);
        }, nodebuffer: function(d) {
          return s.newBufferFrom(new Uint8Array(d));
        } }, w.uint8array = { string: y, array: function(d) {
          return g(d, new Array(d.length));
        }, arraybuffer: function(d) {
          return d.buffer;
        }, uint8array: c, nodebuffer: function(d) {
          return s.newBufferFrom(d);
        } }, w.nodebuffer = { string: y, array: function(d) {
          return g(d, new Array(d.length));
        }, arraybuffer: function(d) {
          return w.nodebuffer.uint8array(d).buffer;
        }, uint8array: function(d) {
          return g(d, new Uint8Array(d.length));
        }, nodebuffer: c }, i.transformTo = function(d, b) {
          if (b = b || "", !d) return b;
          i.checkSupport(d);
          var h = i.getTypeOf(b);
          return w[h][d](b);
        }, i.resolve = function(d) {
          for (var b = d.split("/"), h = [], k = 0; k < b.length; k++) {
            var _ = b[k];
            _ === "." || _ === "" && k !== 0 && k !== b.length - 1 || (_ === ".." ? h.pop() : h.push(_));
          }
          return h.join("/");
        }, i.getTypeOf = function(d) {
          if (typeof d == "string") return "string";
          var b = Object.prototype.toString.call(d);
          return b === "[object Array]" ? "array" : r.nodebuffer && s.isBuffer(d) ? "nodebuffer" : r.uint8array && b === "[object Uint8Array]" ? "uint8array" : r.arraybuffer && b === "[object ArrayBuffer]" ? "arraybuffer" : void 0;
        }, i.checkSupport = function(d) {
          if (!r[d.toLowerCase()]) throw new Error(d + " is not supported by this platform");
        }, i.MAX_VALUE_16BITS = 65535, i.MAX_VALUE_32BITS = -1, i.pretty = function(d) {
          var b, h, k = "";
          for (h = 0; h < (d || "").length; h++) k += "\\x" + ((b = d.charCodeAt(h)) < 16 ? "0" : "") + b.toString(16).toUpperCase();
          return k;
        }, i.delay = function(d, b, h) {
          setImmediate(function() {
            d.apply(h || null, b || []);
          });
        }, i.inherits = function(d, b) {
          function h() {
          }
          h.prototype = b.prototype, d.prototype = new h();
        }, i.extend = function() {
          var d, b, h = {};
          for (d = 0; d < arguments.length; d++) for (b in arguments[d]) Object.prototype.hasOwnProperty.call(arguments[d], b) && h[b] === void 0 && (h[b] = arguments[d][b]);
          return h;
        }, i.prepareContent = function(d, b, h, k, _) {
          return l.Promise.resolve(b).then(function(x) {
            return r.blob && (x instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(x)) !== -1) ? Blob.prototype.arrayBuffer !== void 0 ? x.arrayBuffer() : typeof FileReader < "u" ? new l.Promise(function(F, B) {
              var z = new FileReader();
              z.onload = function(D) {
                F(D.target.result);
              }, z.onerror = function(D) {
                B(D.target.error);
              }, z.readAsArrayBuffer(x);
            }) : l.Promise.reject(new Error(d + " is a Blob, but we have no way of reading it.")) : x;
          }).then(function(x) {
            var F = i.getTypeOf(x);
            return F ? (F === "arraybuffer" ? x = i.transformTo("uint8array", x) : F === "string" && (_ ? x = a.decode(x) : h && k !== !0 && (x = (function(B) {
              return p(B, r.uint8array ? new Uint8Array(B.length) : new Array(B.length));
            })(x))), x) : l.Promise.reject(new Error("Can't read the data of '" + d + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(t, o, i) {
        var r = t("./reader/readerFor"), a = t("./utils"), s = t("./signature"), l = t("./zipEntry"), c = t("./support");
        function p(m) {
          this.files = [], this.loadOptions = m;
        }
        p.prototype = { checkSignature: function(m) {
          if (!this.reader.readAndCheckSignature(m)) {
            this.reader.index -= 4;
            var y = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + a.pretty(y) + ", expected " + a.pretty(m) + ")");
          }
        }, isSignature: function(m, y) {
          var g = this.reader.index;
          this.reader.setIndex(m);
          var w = this.reader.readString(4) === y;
          return this.reader.setIndex(g), w;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var m = this.reader.readData(this.zipCommentLength), y = c.uint8array ? "uint8array" : "array", g = a.transformTo(y, m);
          this.zipComment = this.loadOptions.decodeFileName(g);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var m, y, g, w = this.zip64EndOfCentralSize - 44; 0 < w; ) m = this.reader.readInt(2), y = this.reader.readInt(4), g = this.reader.readData(y), this.zip64ExtensibleData[m] = { id: m, length: y, value: g };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var m, y;
          for (m = 0; m < this.files.length; m++) y = this.files[m], this.reader.setIndex(y.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), y.readLocalPart(this.reader), y.handleUTF8(), y.processAttributes();
        }, readCentralDir: function() {
          var m;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (m = new l({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(m);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var m = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
          if (m < 0) throw this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(m);
          var y = m;
          if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === a.MAX_VALUE_16BITS || this.diskWithCentralDirStart === a.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === a.MAX_VALUE_16BITS || this.centralDirRecords === a.MAX_VALUE_16BITS || this.centralDirSize === a.MAX_VALUE_32BITS || this.centralDirOffset === a.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (m = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(m), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var g = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (g += 20, g += 12 + this.zip64EndOfCentralSize);
          var w = y - g;
          if (0 < w) this.isSignature(y, s.CENTRAL_FILE_HEADER) || (this.reader.zero = w);
          else if (w < 0) throw new Error("Corrupted zip: missing " + Math.abs(w) + " bytes.");
        }, prepareReader: function(m) {
          this.reader = r(m);
        }, load: function(m) {
          this.prepareReader(m), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, o.exports = p;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(t, o, i) {
        var r = t("./reader/readerFor"), a = t("./utils"), s = t("./compressedObject"), l = t("./crc32"), c = t("./utf8"), p = t("./compressions"), m = t("./support");
        function y(g, w) {
          this.options = g, this.loadOptions = w;
        }
        y.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(g) {
          var w, d;
          if (g.skip(22), this.fileNameLength = g.readInt(2), d = g.readInt(2), this.fileName = g.readData(this.fileNameLength), g.skip(d), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((w = (function(b) {
            for (var h in p) if (Object.prototype.hasOwnProperty.call(p, h) && p[h].magic === b) return p[h];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + a.pretty(this.compressionMethod) + " unknown (inner file : " + a.transformTo("string", this.fileName) + ")");
          this.decompressed = new s(this.compressedSize, this.uncompressedSize, this.crc32, w, g.readData(this.compressedSize));
        }, readCentralPart: function(g) {
          this.versionMadeBy = g.readInt(2), g.skip(2), this.bitFlag = g.readInt(2), this.compressionMethod = g.readString(2), this.date = g.readDate(), this.crc32 = g.readInt(4), this.compressedSize = g.readInt(4), this.uncompressedSize = g.readInt(4);
          var w = g.readInt(2);
          if (this.extraFieldsLength = g.readInt(2), this.fileCommentLength = g.readInt(2), this.diskNumberStart = g.readInt(2), this.internalFileAttributes = g.readInt(2), this.externalFileAttributes = g.readInt(4), this.localHeaderOffset = g.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          g.skip(w), this.readExtraFields(g), this.parseZIP64ExtraField(g), this.fileComment = g.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var g = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), g == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), g == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var g = r(this.extraFields[1].value);
            this.uncompressedSize === a.MAX_VALUE_32BITS && (this.uncompressedSize = g.readInt(8)), this.compressedSize === a.MAX_VALUE_32BITS && (this.compressedSize = g.readInt(8)), this.localHeaderOffset === a.MAX_VALUE_32BITS && (this.localHeaderOffset = g.readInt(8)), this.diskNumberStart === a.MAX_VALUE_32BITS && (this.diskNumberStart = g.readInt(4));
          }
        }, readExtraFields: function(g) {
          var w, d, b, h = g.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); g.index + 4 < h; ) w = g.readInt(2), d = g.readInt(2), b = g.readData(d), this.extraFields[w] = { id: w, length: d, value: b };
          g.setIndex(h);
        }, handleUTF8: function() {
          var g = m.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = c.utf8decode(this.fileName), this.fileCommentStr = c.utf8decode(this.fileComment);
          else {
            var w = this.findExtraFieldUnicodePath();
            if (w !== null) this.fileNameStr = w;
            else {
              var d = a.transformTo(g, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(d);
            }
            var b = this.findExtraFieldUnicodeComment();
            if (b !== null) this.fileCommentStr = b;
            else {
              var h = a.transformTo(g, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(h);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var g = this.extraFields[28789];
          if (g) {
            var w = r(g.value);
            return w.readInt(1) !== 1 || l(this.fileName) !== w.readInt(4) ? null : c.utf8decode(w.readData(g.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var g = this.extraFields[25461];
          if (g) {
            var w = r(g.value);
            return w.readInt(1) !== 1 || l(this.fileComment) !== w.readInt(4) ? null : c.utf8decode(w.readData(g.length - 5));
          }
          return null;
        } }, o.exports = y;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(t, o, i) {
        function r(w, d, b) {
          this.name = w, this.dir = b.dir, this.date = b.date, this.comment = b.comment, this.unixPermissions = b.unixPermissions, this.dosPermissions = b.dosPermissions, this._data = d, this._dataBinary = b.binary, this.options = { compression: b.compression, compressionOptions: b.compressionOptions };
        }
        var a = t("./stream/StreamHelper"), s = t("./stream/DataWorker"), l = t("./utf8"), c = t("./compressedObject"), p = t("./stream/GenericWorker");
        r.prototype = { internalStream: function(w) {
          var d = null, b = "string";
          try {
            if (!w) throw new Error("No output type specified.");
            var h = (b = w.toLowerCase()) === "string" || b === "text";
            b !== "binarystring" && b !== "text" || (b = "string"), d = this._decompressWorker();
            var k = !this._dataBinary;
            k && !h && (d = d.pipe(new l.Utf8EncodeWorker())), !k && h && (d = d.pipe(new l.Utf8DecodeWorker()));
          } catch (_) {
            (d = new p("error")).error(_);
          }
          return new a(d, b, "");
        }, async: function(w, d) {
          return this.internalStream(w).accumulate(d);
        }, nodeStream: function(w, d) {
          return this.internalStream(w || "nodebuffer").toNodejsStream(d);
        }, _compressWorker: function(w, d) {
          if (this._data instanceof c && this._data.compression.magic === w.magic) return this._data.getCompressedWorker();
          var b = this._decompressWorker();
          return this._dataBinary || (b = b.pipe(new l.Utf8EncodeWorker())), c.createWorkerFrom(b, w, d);
        }, _decompressWorker: function() {
          return this._data instanceof c ? this._data.getContentWorker() : this._data instanceof p ? this._data : new s(this._data);
        } };
        for (var m = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], y = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, g = 0; g < m.length; g++) r.prototype[m[g]] = y;
        o.exports = r;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(t, o, i) {
        (function(r) {
          var a, s, l = r.MutationObserver || r.WebKitMutationObserver;
          if (l) {
            var c = 0, p = new l(w), m = r.document.createTextNode("");
            p.observe(m, { characterData: !0 }), a = function() {
              m.data = c = ++c % 2;
            };
          } else if (r.setImmediate || r.MessageChannel === void 0) a = "document" in r && "onreadystatechange" in r.document.createElement("script") ? function() {
            var d = r.document.createElement("script");
            d.onreadystatechange = function() {
              w(), d.onreadystatechange = null, d.parentNode.removeChild(d), d = null;
            }, r.document.documentElement.appendChild(d);
          } : function() {
            setTimeout(w, 0);
          };
          else {
            var y = new r.MessageChannel();
            y.port1.onmessage = w, a = function() {
              y.port2.postMessage(0);
            };
          }
          var g = [];
          function w() {
            var d, b;
            s = !0;
            for (var h = g.length; h; ) {
              for (b = g, g = [], d = -1; ++d < h; ) b[d]();
              h = g.length;
            }
            s = !1;
          }
          o.exports = function(d) {
            g.push(d) !== 1 || s || a();
          };
        }).call(this, typeof pt < "u" ? pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(t, o, i) {
        var r = t("immediate");
        function a() {
        }
        var s = {}, l = ["REJECTED"], c = ["FULFILLED"], p = ["PENDING"];
        function m(h) {
          if (typeof h != "function") throw new TypeError("resolver must be a function");
          this.state = p, this.queue = [], this.outcome = void 0, h !== a && d(this, h);
        }
        function y(h, k, _) {
          this.promise = h, typeof k == "function" && (this.onFulfilled = k, this.callFulfilled = this.otherCallFulfilled), typeof _ == "function" && (this.onRejected = _, this.callRejected = this.otherCallRejected);
        }
        function g(h, k, _) {
          r(function() {
            var x;
            try {
              x = k(_);
            } catch (F) {
              return s.reject(h, F);
            }
            x === h ? s.reject(h, new TypeError("Cannot resolve promise with itself")) : s.resolve(h, x);
          });
        }
        function w(h) {
          var k = h && h.then;
          if (h && (typeof h == "object" || typeof h == "function") && typeof k == "function") return function() {
            k.apply(h, arguments);
          };
        }
        function d(h, k) {
          var _ = !1;
          function x(z) {
            _ || (_ = !0, s.reject(h, z));
          }
          function F(z) {
            _ || (_ = !0, s.resolve(h, z));
          }
          var B = b(function() {
            k(F, x);
          });
          B.status === "error" && x(B.value);
        }
        function b(h, k) {
          var _ = {};
          try {
            _.value = h(k), _.status = "success";
          } catch (x) {
            _.status = "error", _.value = x;
          }
          return _;
        }
        (o.exports = m).prototype.finally = function(h) {
          if (typeof h != "function") return this;
          var k = this.constructor;
          return this.then(function(_) {
            return k.resolve(h()).then(function() {
              return _;
            });
          }, function(_) {
            return k.resolve(h()).then(function() {
              throw _;
            });
          });
        }, m.prototype.catch = function(h) {
          return this.then(null, h);
        }, m.prototype.then = function(h, k) {
          if (typeof h != "function" && this.state === c || typeof k != "function" && this.state === l) return this;
          var _ = new this.constructor(a);
          return this.state !== p ? g(_, this.state === c ? h : k, this.outcome) : this.queue.push(new y(_, h, k)), _;
        }, y.prototype.callFulfilled = function(h) {
          s.resolve(this.promise, h);
        }, y.prototype.otherCallFulfilled = function(h) {
          g(this.promise, this.onFulfilled, h);
        }, y.prototype.callRejected = function(h) {
          s.reject(this.promise, h);
        }, y.prototype.otherCallRejected = function(h) {
          g(this.promise, this.onRejected, h);
        }, s.resolve = function(h, k) {
          var _ = b(w, k);
          if (_.status === "error") return s.reject(h, _.value);
          var x = _.value;
          if (x) d(h, x);
          else {
            h.state = c, h.outcome = k;
            for (var F = -1, B = h.queue.length; ++F < B; ) h.queue[F].callFulfilled(k);
          }
          return h;
        }, s.reject = function(h, k) {
          h.state = l, h.outcome = k;
          for (var _ = -1, x = h.queue.length; ++_ < x; ) h.queue[_].callRejected(k);
          return h;
        }, m.resolve = function(h) {
          return h instanceof this ? h : s.resolve(new this(a), h);
        }, m.reject = function(h) {
          var k = new this(a);
          return s.reject(k, h);
        }, m.all = function(h) {
          var k = this;
          if (Object.prototype.toString.call(h) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var _ = h.length, x = !1;
          if (!_) return this.resolve([]);
          for (var F = new Array(_), B = 0, z = -1, D = new this(a); ++z < _; ) T(h[z], z);
          return D;
          function T(j, X) {
            k.resolve(j).then(function(A) {
              F[X] = A, ++B !== _ || x || (x = !0, s.resolve(D, F));
            }, function(A) {
              x || (x = !0, s.reject(D, A));
            });
          }
        }, m.race = function(h) {
          var k = this;
          if (Object.prototype.toString.call(h) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var _ = h.length, x = !1;
          if (!_) return this.resolve([]);
          for (var F = -1, B = new this(a); ++F < _; ) z = h[F], k.resolve(z).then(function(D) {
            x || (x = !0, s.resolve(B, D));
          }, function(D) {
            x || (x = !0, s.reject(B, D));
          });
          var z;
          return B;
        };
      }, { immediate: 36 }], 38: [function(t, o, i) {
        var r = {};
        (0, t("./lib/utils/common").assign)(r, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")), o.exports = r;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(t, o, i) {
        var r = t("./zlib/deflate"), a = t("./utils/common"), s = t("./utils/strings"), l = t("./zlib/messages"), c = t("./zlib/zstream"), p = Object.prototype.toString, m = 0, y = -1, g = 0, w = 8;
        function d(h) {
          if (!(this instanceof d)) return new d(h);
          this.options = a.assign({ level: y, method: w, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: g, to: "" }, h || {});
          var k = this.options;
          k.raw && 0 < k.windowBits ? k.windowBits = -k.windowBits : k.gzip && 0 < k.windowBits && k.windowBits < 16 && (k.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new c(), this.strm.avail_out = 0;
          var _ = r.deflateInit2(this.strm, k.level, k.method, k.windowBits, k.memLevel, k.strategy);
          if (_ !== m) throw new Error(l[_]);
          if (k.header && r.deflateSetHeader(this.strm, k.header), k.dictionary) {
            var x;
            if (x = typeof k.dictionary == "string" ? s.string2buf(k.dictionary) : p.call(k.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(k.dictionary) : k.dictionary, (_ = r.deflateSetDictionary(this.strm, x)) !== m) throw new Error(l[_]);
            this._dict_set = !0;
          }
        }
        function b(h, k) {
          var _ = new d(k);
          if (_.push(h, !0), _.err) throw _.msg || l[_.err];
          return _.result;
        }
        d.prototype.push = function(h, k) {
          var _, x, F = this.strm, B = this.options.chunkSize;
          if (this.ended) return !1;
          x = k === ~~k ? k : k === !0 ? 4 : 0, typeof h == "string" ? F.input = s.string2buf(h) : p.call(h) === "[object ArrayBuffer]" ? F.input = new Uint8Array(h) : F.input = h, F.next_in = 0, F.avail_in = F.input.length;
          do {
            if (F.avail_out === 0 && (F.output = new a.Buf8(B), F.next_out = 0, F.avail_out = B), (_ = r.deflate(F, x)) !== 1 && _ !== m) return this.onEnd(_), !(this.ended = !0);
            F.avail_out !== 0 && (F.avail_in !== 0 || x !== 4 && x !== 2) || (this.options.to === "string" ? this.onData(s.buf2binstring(a.shrinkBuf(F.output, F.next_out))) : this.onData(a.shrinkBuf(F.output, F.next_out)));
          } while ((0 < F.avail_in || F.avail_out === 0) && _ !== 1);
          return x === 4 ? (_ = r.deflateEnd(this.strm), this.onEnd(_), this.ended = !0, _ === m) : x !== 2 || (this.onEnd(m), !(F.avail_out = 0));
        }, d.prototype.onData = function(h) {
          this.chunks.push(h);
        }, d.prototype.onEnd = function(h) {
          h === m && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = h, this.msg = this.strm.msg;
        }, i.Deflate = d, i.deflate = b, i.deflateRaw = function(h, k) {
          return (k = k || {}).raw = !0, b(h, k);
        }, i.gzip = function(h, k) {
          return (k = k || {}).gzip = !0, b(h, k);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(t, o, i) {
        var r = t("./zlib/inflate"), a = t("./utils/common"), s = t("./utils/strings"), l = t("./zlib/constants"), c = t("./zlib/messages"), p = t("./zlib/zstream"), m = t("./zlib/gzheader"), y = Object.prototype.toString;
        function g(d) {
          if (!(this instanceof g)) return new g(d);
          this.options = a.assign({ chunkSize: 16384, windowBits: 0, to: "" }, d || {});
          var b = this.options;
          b.raw && 0 <= b.windowBits && b.windowBits < 16 && (b.windowBits = -b.windowBits, b.windowBits === 0 && (b.windowBits = -15)), !(0 <= b.windowBits && b.windowBits < 16) || d && d.windowBits || (b.windowBits += 32), 15 < b.windowBits && b.windowBits < 48 && (15 & b.windowBits) == 0 && (b.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new p(), this.strm.avail_out = 0;
          var h = r.inflateInit2(this.strm, b.windowBits);
          if (h !== l.Z_OK) throw new Error(c[h]);
          this.header = new m(), r.inflateGetHeader(this.strm, this.header);
        }
        function w(d, b) {
          var h = new g(b);
          if (h.push(d, !0), h.err) throw h.msg || c[h.err];
          return h.result;
        }
        g.prototype.push = function(d, b) {
          var h, k, _, x, F, B, z = this.strm, D = this.options.chunkSize, T = this.options.dictionary, j = !1;
          if (this.ended) return !1;
          k = b === ~~b ? b : b === !0 ? l.Z_FINISH : l.Z_NO_FLUSH, typeof d == "string" ? z.input = s.binstring2buf(d) : y.call(d) === "[object ArrayBuffer]" ? z.input = new Uint8Array(d) : z.input = d, z.next_in = 0, z.avail_in = z.input.length;
          do {
            if (z.avail_out === 0 && (z.output = new a.Buf8(D), z.next_out = 0, z.avail_out = D), (h = r.inflate(z, l.Z_NO_FLUSH)) === l.Z_NEED_DICT && T && (B = typeof T == "string" ? s.string2buf(T) : y.call(T) === "[object ArrayBuffer]" ? new Uint8Array(T) : T, h = r.inflateSetDictionary(this.strm, B)), h === l.Z_BUF_ERROR && j === !0 && (h = l.Z_OK, j = !1), h !== l.Z_STREAM_END && h !== l.Z_OK) return this.onEnd(h), !(this.ended = !0);
            z.next_out && (z.avail_out !== 0 && h !== l.Z_STREAM_END && (z.avail_in !== 0 || k !== l.Z_FINISH && k !== l.Z_SYNC_FLUSH) || (this.options.to === "string" ? (_ = s.utf8border(z.output, z.next_out), x = z.next_out - _, F = s.buf2string(z.output, _), z.next_out = x, z.avail_out = D - x, x && a.arraySet(z.output, z.output, _, x, 0), this.onData(F)) : this.onData(a.shrinkBuf(z.output, z.next_out)))), z.avail_in === 0 && z.avail_out === 0 && (j = !0);
          } while ((0 < z.avail_in || z.avail_out === 0) && h !== l.Z_STREAM_END);
          return h === l.Z_STREAM_END && (k = l.Z_FINISH), k === l.Z_FINISH ? (h = r.inflateEnd(this.strm), this.onEnd(h), this.ended = !0, h === l.Z_OK) : k !== l.Z_SYNC_FLUSH || (this.onEnd(l.Z_OK), !(z.avail_out = 0));
        }, g.prototype.onData = function(d) {
          this.chunks.push(d);
        }, g.prototype.onEnd = function(d) {
          d === l.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = d, this.msg = this.strm.msg;
        }, i.Inflate = g, i.inflate = w, i.inflateRaw = function(d, b) {
          return (b = b || {}).raw = !0, w(d, b);
        }, i.ungzip = w;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(t, o, i) {
        var r = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        i.assign = function(l) {
          for (var c = Array.prototype.slice.call(arguments, 1); c.length; ) {
            var p = c.shift();
            if (p) {
              if (typeof p != "object") throw new TypeError(p + "must be non-object");
              for (var m in p) p.hasOwnProperty(m) && (l[m] = p[m]);
            }
          }
          return l;
        }, i.shrinkBuf = function(l, c) {
          return l.length === c ? l : l.subarray ? l.subarray(0, c) : (l.length = c, l);
        };
        var a = { arraySet: function(l, c, p, m, y) {
          if (c.subarray && l.subarray) l.set(c.subarray(p, p + m), y);
          else for (var g = 0; g < m; g++) l[y + g] = c[p + g];
        }, flattenChunks: function(l) {
          var c, p, m, y, g, w;
          for (c = m = 0, p = l.length; c < p; c++) m += l[c].length;
          for (w = new Uint8Array(m), c = y = 0, p = l.length; c < p; c++) g = l[c], w.set(g, y), y += g.length;
          return w;
        } }, s = { arraySet: function(l, c, p, m, y) {
          for (var g = 0; g < m; g++) l[y + g] = c[p + g];
        }, flattenChunks: function(l) {
          return [].concat.apply([], l);
        } };
        i.setTyped = function(l) {
          l ? (i.Buf8 = Uint8Array, i.Buf16 = Uint16Array, i.Buf32 = Int32Array, i.assign(i, a)) : (i.Buf8 = Array, i.Buf16 = Array, i.Buf32 = Array, i.assign(i, s));
        }, i.setTyped(r);
      }, {}], 42: [function(t, o, i) {
        var r = t("./common"), a = !0, s = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          a = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          s = !1;
        }
        for (var l = new r.Buf8(256), c = 0; c < 256; c++) l[c] = 252 <= c ? 6 : 248 <= c ? 5 : 240 <= c ? 4 : 224 <= c ? 3 : 192 <= c ? 2 : 1;
        function p(m, y) {
          if (y < 65537 && (m.subarray && s || !m.subarray && a)) return String.fromCharCode.apply(null, r.shrinkBuf(m, y));
          for (var g = "", w = 0; w < y; w++) g += String.fromCharCode(m[w]);
          return g;
        }
        l[254] = l[254] = 1, i.string2buf = function(m) {
          var y, g, w, d, b, h = m.length, k = 0;
          for (d = 0; d < h; d++) (64512 & (g = m.charCodeAt(d))) == 55296 && d + 1 < h && (64512 & (w = m.charCodeAt(d + 1))) == 56320 && (g = 65536 + (g - 55296 << 10) + (w - 56320), d++), k += g < 128 ? 1 : g < 2048 ? 2 : g < 65536 ? 3 : 4;
          for (y = new r.Buf8(k), d = b = 0; b < k; d++) (64512 & (g = m.charCodeAt(d))) == 55296 && d + 1 < h && (64512 & (w = m.charCodeAt(d + 1))) == 56320 && (g = 65536 + (g - 55296 << 10) + (w - 56320), d++), g < 128 ? y[b++] = g : (g < 2048 ? y[b++] = 192 | g >>> 6 : (g < 65536 ? y[b++] = 224 | g >>> 12 : (y[b++] = 240 | g >>> 18, y[b++] = 128 | g >>> 12 & 63), y[b++] = 128 | g >>> 6 & 63), y[b++] = 128 | 63 & g);
          return y;
        }, i.buf2binstring = function(m) {
          return p(m, m.length);
        }, i.binstring2buf = function(m) {
          for (var y = new r.Buf8(m.length), g = 0, w = y.length; g < w; g++) y[g] = m.charCodeAt(g);
          return y;
        }, i.buf2string = function(m, y) {
          var g, w, d, b, h = y || m.length, k = new Array(2 * h);
          for (g = w = 0; g < h; ) if ((d = m[g++]) < 128) k[w++] = d;
          else if (4 < (b = l[d])) k[w++] = 65533, g += b - 1;
          else {
            for (d &= b === 2 ? 31 : b === 3 ? 15 : 7; 1 < b && g < h; ) d = d << 6 | 63 & m[g++], b--;
            1 < b ? k[w++] = 65533 : d < 65536 ? k[w++] = d : (d -= 65536, k[w++] = 55296 | d >> 10 & 1023, k[w++] = 56320 | 1023 & d);
          }
          return p(k, w);
        }, i.utf8border = function(m, y) {
          var g;
          for ((y = y || m.length) > m.length && (y = m.length), g = y - 1; 0 <= g && (192 & m[g]) == 128; ) g--;
          return g < 0 || g === 0 ? y : g + l[m[g]] > y ? g : y;
        };
      }, { "./common": 41 }], 43: [function(t, o, i) {
        o.exports = function(r, a, s, l) {
          for (var c = 65535 & r | 0, p = r >>> 16 & 65535 | 0, m = 0; s !== 0; ) {
            for (s -= m = 2e3 < s ? 2e3 : s; p = p + (c = c + a[l++] | 0) | 0, --m; ) ;
            c %= 65521, p %= 65521;
          }
          return c | p << 16 | 0;
        };
      }, {}], 44: [function(t, o, i) {
        o.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(t, o, i) {
        var r = (function() {
          for (var a, s = [], l = 0; l < 256; l++) {
            a = l;
            for (var c = 0; c < 8; c++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            s[l] = a;
          }
          return s;
        })();
        o.exports = function(a, s, l, c) {
          var p = r, m = c + l;
          a ^= -1;
          for (var y = c; y < m; y++) a = a >>> 8 ^ p[255 & (a ^ s[y])];
          return -1 ^ a;
        };
      }, {}], 46: [function(t, o, i) {
        var r, a = t("../utils/common"), s = t("./trees"), l = t("./adler32"), c = t("./crc32"), p = t("./messages"), m = 0, y = 4, g = 0, w = -2, d = -1, b = 4, h = 2, k = 8, _ = 9, x = 286, F = 30, B = 19, z = 2 * x + 1, D = 15, T = 3, j = 258, X = j + T + 1, A = 42, S = 113, u = 1, R = 2, K = 3, $ = 4;
        function te(f, L) {
          return f.msg = p[L], L;
        }
        function W(f) {
          return (f << 1) - (4 < f ? 9 : 0);
        }
        function ee(f) {
          for (var L = f.length; 0 <= --L; ) f[L] = 0;
        }
        function O(f) {
          var L = f.state, P = L.pending;
          P > f.avail_out && (P = f.avail_out), P !== 0 && (a.arraySet(f.output, L.pending_buf, L.pending_out, P, f.next_out), f.next_out += P, L.pending_out += P, f.total_out += P, f.avail_out -= P, L.pending -= P, L.pending === 0 && (L.pending_out = 0));
        }
        function M(f, L) {
          s._tr_flush_block(f, 0 <= f.block_start ? f.block_start : -1, f.strstart - f.block_start, L), f.block_start = f.strstart, O(f.strm);
        }
        function Q(f, L) {
          f.pending_buf[f.pending++] = L;
        }
        function q(f, L) {
          f.pending_buf[f.pending++] = L >>> 8 & 255, f.pending_buf[f.pending++] = 255 & L;
        }
        function Z(f, L) {
          var P, E, v = f.max_chain_length, C = f.strstart, U = f.prev_length, N = f.nice_match, I = f.strstart > f.w_size - X ? f.strstart - (f.w_size - X) : 0, G = f.window, Y = f.w_mask, H = f.prev, J = f.strstart + j, le = G[C + U - 1], re = G[C + U];
          f.prev_length >= f.good_match && (v >>= 2), N > f.lookahead && (N = f.lookahead);
          do
            if (G[(P = L) + U] === re && G[P + U - 1] === le && G[P] === G[C] && G[++P] === G[C + 1]) {
              C += 2, P++;
              do
                ;
              while (G[++C] === G[++P] && G[++C] === G[++P] && G[++C] === G[++P] && G[++C] === G[++P] && G[++C] === G[++P] && G[++C] === G[++P] && G[++C] === G[++P] && G[++C] === G[++P] && C < J);
              if (E = j - (J - C), C = J - j, U < E) {
                if (f.match_start = L, N <= (U = E)) break;
                le = G[C + U - 1], re = G[C + U];
              }
            }
          while ((L = H[L & Y]) > I && --v != 0);
          return U <= f.lookahead ? U : f.lookahead;
        }
        function pe(f) {
          var L, P, E, v, C, U, N, I, G, Y, H = f.w_size;
          do {
            if (v = f.window_size - f.lookahead - f.strstart, f.strstart >= H + (H - X)) {
              for (a.arraySet(f.window, f.window, H, H, 0), f.match_start -= H, f.strstart -= H, f.block_start -= H, L = P = f.hash_size; E = f.head[--L], f.head[L] = H <= E ? E - H : 0, --P; ) ;
              for (L = P = H; E = f.prev[--L], f.prev[L] = H <= E ? E - H : 0, --P; ) ;
              v += H;
            }
            if (f.strm.avail_in === 0) break;
            if (U = f.strm, N = f.window, I = f.strstart + f.lookahead, G = v, Y = void 0, Y = U.avail_in, G < Y && (Y = G), P = Y === 0 ? 0 : (U.avail_in -= Y, a.arraySet(N, U.input, U.next_in, Y, I), U.state.wrap === 1 ? U.adler = l(U.adler, N, Y, I) : U.state.wrap === 2 && (U.adler = c(U.adler, N, Y, I)), U.next_in += Y, U.total_in += Y, Y), f.lookahead += P, f.lookahead + f.insert >= T) for (C = f.strstart - f.insert, f.ins_h = f.window[C], f.ins_h = (f.ins_h << f.hash_shift ^ f.window[C + 1]) & f.hash_mask; f.insert && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[C + T - 1]) & f.hash_mask, f.prev[C & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = C, C++, f.insert--, !(f.lookahead + f.insert < T)); ) ;
          } while (f.lookahead < X && f.strm.avail_in !== 0);
        }
        function Ee(f, L) {
          for (var P, E; ; ) {
            if (f.lookahead < X) {
              if (pe(f), f.lookahead < X && L === m) return u;
              if (f.lookahead === 0) break;
            }
            if (P = 0, f.lookahead >= T && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + T - 1]) & f.hash_mask, P = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), P !== 0 && f.strstart - P <= f.w_size - X && (f.match_length = Z(f, P)), f.match_length >= T) if (E = s._tr_tally(f, f.strstart - f.match_start, f.match_length - T), f.lookahead -= f.match_length, f.match_length <= f.max_lazy_match && f.lookahead >= T) {
              for (f.match_length--; f.strstart++, f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + T - 1]) & f.hash_mask, P = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart, --f.match_length != 0; ) ;
              f.strstart++;
            } else f.strstart += f.match_length, f.match_length = 0, f.ins_h = f.window[f.strstart], f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + 1]) & f.hash_mask;
            else E = s._tr_tally(f, 0, f.window[f.strstart]), f.lookahead--, f.strstart++;
            if (E && (M(f, !1), f.strm.avail_out === 0)) return u;
          }
          return f.insert = f.strstart < T - 1 ? f.strstart : T - 1, L === y ? (M(f, !0), f.strm.avail_out === 0 ? K : $) : f.last_lit && (M(f, !1), f.strm.avail_out === 0) ? u : R;
        }
        function ie(f, L) {
          for (var P, E, v; ; ) {
            if (f.lookahead < X) {
              if (pe(f), f.lookahead < X && L === m) return u;
              if (f.lookahead === 0) break;
            }
            if (P = 0, f.lookahead >= T && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + T - 1]) & f.hash_mask, P = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), f.prev_length = f.match_length, f.prev_match = f.match_start, f.match_length = T - 1, P !== 0 && f.prev_length < f.max_lazy_match && f.strstart - P <= f.w_size - X && (f.match_length = Z(f, P), f.match_length <= 5 && (f.strategy === 1 || f.match_length === T && 4096 < f.strstart - f.match_start) && (f.match_length = T - 1)), f.prev_length >= T && f.match_length <= f.prev_length) {
              for (v = f.strstart + f.lookahead - T, E = s._tr_tally(f, f.strstart - 1 - f.prev_match, f.prev_length - T), f.lookahead -= f.prev_length - 1, f.prev_length -= 2; ++f.strstart <= v && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + T - 1]) & f.hash_mask, P = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), --f.prev_length != 0; ) ;
              if (f.match_available = 0, f.match_length = T - 1, f.strstart++, E && (M(f, !1), f.strm.avail_out === 0)) return u;
            } else if (f.match_available) {
              if ((E = s._tr_tally(f, 0, f.window[f.strstart - 1])) && M(f, !1), f.strstart++, f.lookahead--, f.strm.avail_out === 0) return u;
            } else f.match_available = 1, f.strstart++, f.lookahead--;
          }
          return f.match_available && (E = s._tr_tally(f, 0, f.window[f.strstart - 1]), f.match_available = 0), f.insert = f.strstart < T - 1 ? f.strstart : T - 1, L === y ? (M(f, !0), f.strm.avail_out === 0 ? K : $) : f.last_lit && (M(f, !1), f.strm.avail_out === 0) ? u : R;
        }
        function oe(f, L, P, E, v) {
          this.good_length = f, this.max_lazy = L, this.nice_length = P, this.max_chain = E, this.func = v;
        }
        function ve() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = k, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new a.Buf16(2 * z), this.dyn_dtree = new a.Buf16(2 * (2 * F + 1)), this.bl_tree = new a.Buf16(2 * (2 * B + 1)), ee(this.dyn_ltree), ee(this.dyn_dtree), ee(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new a.Buf16(D + 1), this.heap = new a.Buf16(2 * x + 1), ee(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new a.Buf16(2 * x + 1), ee(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function me(f) {
          var L;
          return f && f.state ? (f.total_in = f.total_out = 0, f.data_type = h, (L = f.state).pending = 0, L.pending_out = 0, L.wrap < 0 && (L.wrap = -L.wrap), L.status = L.wrap ? A : S, f.adler = L.wrap === 2 ? 0 : 1, L.last_flush = m, s._tr_init(L), g) : te(f, w);
        }
        function Te(f) {
          var L = me(f);
          return L === g && (function(P) {
            P.window_size = 2 * P.w_size, ee(P.head), P.max_lazy_match = r[P.level].max_lazy, P.good_match = r[P.level].good_length, P.nice_match = r[P.level].nice_length, P.max_chain_length = r[P.level].max_chain, P.strstart = 0, P.block_start = 0, P.lookahead = 0, P.insert = 0, P.match_length = P.prev_length = T - 1, P.match_available = 0, P.ins_h = 0;
          })(f.state), L;
        }
        function De(f, L, P, E, v, C) {
          if (!f) return w;
          var U = 1;
          if (L === d && (L = 6), E < 0 ? (U = 0, E = -E) : 15 < E && (U = 2, E -= 16), v < 1 || _ < v || P !== k || E < 8 || 15 < E || L < 0 || 9 < L || C < 0 || b < C) return te(f, w);
          E === 8 && (E = 9);
          var N = new ve();
          return (f.state = N).strm = f, N.wrap = U, N.gzhead = null, N.w_bits = E, N.w_size = 1 << N.w_bits, N.w_mask = N.w_size - 1, N.hash_bits = v + 7, N.hash_size = 1 << N.hash_bits, N.hash_mask = N.hash_size - 1, N.hash_shift = ~~((N.hash_bits + T - 1) / T), N.window = new a.Buf8(2 * N.w_size), N.head = new a.Buf16(N.hash_size), N.prev = new a.Buf16(N.w_size), N.lit_bufsize = 1 << v + 6, N.pending_buf_size = 4 * N.lit_bufsize, N.pending_buf = new a.Buf8(N.pending_buf_size), N.d_buf = 1 * N.lit_bufsize, N.l_buf = 3 * N.lit_bufsize, N.level = L, N.strategy = C, N.method = P, Te(f);
        }
        r = [new oe(0, 0, 0, 0, function(f, L) {
          var P = 65535;
          for (P > f.pending_buf_size - 5 && (P = f.pending_buf_size - 5); ; ) {
            if (f.lookahead <= 1) {
              if (pe(f), f.lookahead === 0 && L === m) return u;
              if (f.lookahead === 0) break;
            }
            f.strstart += f.lookahead, f.lookahead = 0;
            var E = f.block_start + P;
            if ((f.strstart === 0 || f.strstart >= E) && (f.lookahead = f.strstart - E, f.strstart = E, M(f, !1), f.strm.avail_out === 0) || f.strstart - f.block_start >= f.w_size - X && (M(f, !1), f.strm.avail_out === 0)) return u;
          }
          return f.insert = 0, L === y ? (M(f, !0), f.strm.avail_out === 0 ? K : $) : (f.strstart > f.block_start && (M(f, !1), f.strm.avail_out), u);
        }), new oe(4, 4, 8, 4, Ee), new oe(4, 5, 16, 8, Ee), new oe(4, 6, 32, 32, Ee), new oe(4, 4, 16, 16, ie), new oe(8, 16, 32, 32, ie), new oe(8, 16, 128, 128, ie), new oe(8, 32, 128, 256, ie), new oe(32, 128, 258, 1024, ie), new oe(32, 258, 258, 4096, ie)], i.deflateInit = function(f, L) {
          return De(f, L, k, 15, 8, 0);
        }, i.deflateInit2 = De, i.deflateReset = Te, i.deflateResetKeep = me, i.deflateSetHeader = function(f, L) {
          return f && f.state ? f.state.wrap !== 2 ? w : (f.state.gzhead = L, g) : w;
        }, i.deflate = function(f, L) {
          var P, E, v, C;
          if (!f || !f.state || 5 < L || L < 0) return f ? te(f, w) : w;
          if (E = f.state, !f.output || !f.input && f.avail_in !== 0 || E.status === 666 && L !== y) return te(f, f.avail_out === 0 ? -5 : w);
          if (E.strm = f, P = E.last_flush, E.last_flush = L, E.status === A) if (E.wrap === 2) f.adler = 0, Q(E, 31), Q(E, 139), Q(E, 8), E.gzhead ? (Q(E, (E.gzhead.text ? 1 : 0) + (E.gzhead.hcrc ? 2 : 0) + (E.gzhead.extra ? 4 : 0) + (E.gzhead.name ? 8 : 0) + (E.gzhead.comment ? 16 : 0)), Q(E, 255 & E.gzhead.time), Q(E, E.gzhead.time >> 8 & 255), Q(E, E.gzhead.time >> 16 & 255), Q(E, E.gzhead.time >> 24 & 255), Q(E, E.level === 9 ? 2 : 2 <= E.strategy || E.level < 2 ? 4 : 0), Q(E, 255 & E.gzhead.os), E.gzhead.extra && E.gzhead.extra.length && (Q(E, 255 & E.gzhead.extra.length), Q(E, E.gzhead.extra.length >> 8 & 255)), E.gzhead.hcrc && (f.adler = c(f.adler, E.pending_buf, E.pending, 0)), E.gzindex = 0, E.status = 69) : (Q(E, 0), Q(E, 0), Q(E, 0), Q(E, 0), Q(E, 0), Q(E, E.level === 9 ? 2 : 2 <= E.strategy || E.level < 2 ? 4 : 0), Q(E, 3), E.status = S);
          else {
            var U = k + (E.w_bits - 8 << 4) << 8;
            U |= (2 <= E.strategy || E.level < 2 ? 0 : E.level < 6 ? 1 : E.level === 6 ? 2 : 3) << 6, E.strstart !== 0 && (U |= 32), U += 31 - U % 31, E.status = S, q(E, U), E.strstart !== 0 && (q(E, f.adler >>> 16), q(E, 65535 & f.adler)), f.adler = 1;
          }
          if (E.status === 69) if (E.gzhead.extra) {
            for (v = E.pending; E.gzindex < (65535 & E.gzhead.extra.length) && (E.pending !== E.pending_buf_size || (E.gzhead.hcrc && E.pending > v && (f.adler = c(f.adler, E.pending_buf, E.pending - v, v)), O(f), v = E.pending, E.pending !== E.pending_buf_size)); ) Q(E, 255 & E.gzhead.extra[E.gzindex]), E.gzindex++;
            E.gzhead.hcrc && E.pending > v && (f.adler = c(f.adler, E.pending_buf, E.pending - v, v)), E.gzindex === E.gzhead.extra.length && (E.gzindex = 0, E.status = 73);
          } else E.status = 73;
          if (E.status === 73) if (E.gzhead.name) {
            v = E.pending;
            do {
              if (E.pending === E.pending_buf_size && (E.gzhead.hcrc && E.pending > v && (f.adler = c(f.adler, E.pending_buf, E.pending - v, v)), O(f), v = E.pending, E.pending === E.pending_buf_size)) {
                C = 1;
                break;
              }
              C = E.gzindex < E.gzhead.name.length ? 255 & E.gzhead.name.charCodeAt(E.gzindex++) : 0, Q(E, C);
            } while (C !== 0);
            E.gzhead.hcrc && E.pending > v && (f.adler = c(f.adler, E.pending_buf, E.pending - v, v)), C === 0 && (E.gzindex = 0, E.status = 91);
          } else E.status = 91;
          if (E.status === 91) if (E.gzhead.comment) {
            v = E.pending;
            do {
              if (E.pending === E.pending_buf_size && (E.gzhead.hcrc && E.pending > v && (f.adler = c(f.adler, E.pending_buf, E.pending - v, v)), O(f), v = E.pending, E.pending === E.pending_buf_size)) {
                C = 1;
                break;
              }
              C = E.gzindex < E.gzhead.comment.length ? 255 & E.gzhead.comment.charCodeAt(E.gzindex++) : 0, Q(E, C);
            } while (C !== 0);
            E.gzhead.hcrc && E.pending > v && (f.adler = c(f.adler, E.pending_buf, E.pending - v, v)), C === 0 && (E.status = 103);
          } else E.status = 103;
          if (E.status === 103 && (E.gzhead.hcrc ? (E.pending + 2 > E.pending_buf_size && O(f), E.pending + 2 <= E.pending_buf_size && (Q(E, 255 & f.adler), Q(E, f.adler >> 8 & 255), f.adler = 0, E.status = S)) : E.status = S), E.pending !== 0) {
            if (O(f), f.avail_out === 0) return E.last_flush = -1, g;
          } else if (f.avail_in === 0 && W(L) <= W(P) && L !== y) return te(f, -5);
          if (E.status === 666 && f.avail_in !== 0) return te(f, -5);
          if (f.avail_in !== 0 || E.lookahead !== 0 || L !== m && E.status !== 666) {
            var N = E.strategy === 2 ? (function(I, G) {
              for (var Y; ; ) {
                if (I.lookahead === 0 && (pe(I), I.lookahead === 0)) {
                  if (G === m) return u;
                  break;
                }
                if (I.match_length = 0, Y = s._tr_tally(I, 0, I.window[I.strstart]), I.lookahead--, I.strstart++, Y && (M(I, !1), I.strm.avail_out === 0)) return u;
              }
              return I.insert = 0, G === y ? (M(I, !0), I.strm.avail_out === 0 ? K : $) : I.last_lit && (M(I, !1), I.strm.avail_out === 0) ? u : R;
            })(E, L) : E.strategy === 3 ? (function(I, G) {
              for (var Y, H, J, le, re = I.window; ; ) {
                if (I.lookahead <= j) {
                  if (pe(I), I.lookahead <= j && G === m) return u;
                  if (I.lookahead === 0) break;
                }
                if (I.match_length = 0, I.lookahead >= T && 0 < I.strstart && (H = re[J = I.strstart - 1]) === re[++J] && H === re[++J] && H === re[++J]) {
                  le = I.strstart + j;
                  do
                    ;
                  while (H === re[++J] && H === re[++J] && H === re[++J] && H === re[++J] && H === re[++J] && H === re[++J] && H === re[++J] && H === re[++J] && J < le);
                  I.match_length = j - (le - J), I.match_length > I.lookahead && (I.match_length = I.lookahead);
                }
                if (I.match_length >= T ? (Y = s._tr_tally(I, 1, I.match_length - T), I.lookahead -= I.match_length, I.strstart += I.match_length, I.match_length = 0) : (Y = s._tr_tally(I, 0, I.window[I.strstart]), I.lookahead--, I.strstart++), Y && (M(I, !1), I.strm.avail_out === 0)) return u;
              }
              return I.insert = 0, G === y ? (M(I, !0), I.strm.avail_out === 0 ? K : $) : I.last_lit && (M(I, !1), I.strm.avail_out === 0) ? u : R;
            })(E, L) : r[E.level].func(E, L);
            if (N !== K && N !== $ || (E.status = 666), N === u || N === K) return f.avail_out === 0 && (E.last_flush = -1), g;
            if (N === R && (L === 1 ? s._tr_align(E) : L !== 5 && (s._tr_stored_block(E, 0, 0, !1), L === 3 && (ee(E.head), E.lookahead === 0 && (E.strstart = 0, E.block_start = 0, E.insert = 0))), O(f), f.avail_out === 0)) return E.last_flush = -1, g;
          }
          return L !== y ? g : E.wrap <= 0 ? 1 : (E.wrap === 2 ? (Q(E, 255 & f.adler), Q(E, f.adler >> 8 & 255), Q(E, f.adler >> 16 & 255), Q(E, f.adler >> 24 & 255), Q(E, 255 & f.total_in), Q(E, f.total_in >> 8 & 255), Q(E, f.total_in >> 16 & 255), Q(E, f.total_in >> 24 & 255)) : (q(E, f.adler >>> 16), q(E, 65535 & f.adler)), O(f), 0 < E.wrap && (E.wrap = -E.wrap), E.pending !== 0 ? g : 1);
        }, i.deflateEnd = function(f) {
          var L;
          return f && f.state ? (L = f.state.status) !== A && L !== 69 && L !== 73 && L !== 91 && L !== 103 && L !== S && L !== 666 ? te(f, w) : (f.state = null, L === S ? te(f, -3) : g) : w;
        }, i.deflateSetDictionary = function(f, L) {
          var P, E, v, C, U, N, I, G, Y = L.length;
          if (!f || !f.state || (C = (P = f.state).wrap) === 2 || C === 1 && P.status !== A || P.lookahead) return w;
          for (C === 1 && (f.adler = l(f.adler, L, Y, 0)), P.wrap = 0, Y >= P.w_size && (C === 0 && (ee(P.head), P.strstart = 0, P.block_start = 0, P.insert = 0), G = new a.Buf8(P.w_size), a.arraySet(G, L, Y - P.w_size, P.w_size, 0), L = G, Y = P.w_size), U = f.avail_in, N = f.next_in, I = f.input, f.avail_in = Y, f.next_in = 0, f.input = L, pe(P); P.lookahead >= T; ) {
            for (E = P.strstart, v = P.lookahead - (T - 1); P.ins_h = (P.ins_h << P.hash_shift ^ P.window[E + T - 1]) & P.hash_mask, P.prev[E & P.w_mask] = P.head[P.ins_h], P.head[P.ins_h] = E, E++, --v; ) ;
            P.strstart = E, P.lookahead = T - 1, pe(P);
          }
          return P.strstart += P.lookahead, P.block_start = P.strstart, P.insert = P.lookahead, P.lookahead = 0, P.match_length = P.prev_length = T - 1, P.match_available = 0, f.next_in = N, f.input = I, f.avail_in = U, P.wrap = C, g;
        }, i.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(t, o, i) {
        o.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(t, o, i) {
        o.exports = function(r, a) {
          var s, l, c, p, m, y, g, w, d, b, h, k, _, x, F, B, z, D, T, j, X, A, S, u, R;
          s = r.state, l = r.next_in, u = r.input, c = l + (r.avail_in - 5), p = r.next_out, R = r.output, m = p - (a - r.avail_out), y = p + (r.avail_out - 257), g = s.dmax, w = s.wsize, d = s.whave, b = s.wnext, h = s.window, k = s.hold, _ = s.bits, x = s.lencode, F = s.distcode, B = (1 << s.lenbits) - 1, z = (1 << s.distbits) - 1;
          e: do {
            _ < 15 && (k += u[l++] << _, _ += 8, k += u[l++] << _, _ += 8), D = x[k & B];
            t: for (; ; ) {
              if (k >>>= T = D >>> 24, _ -= T, (T = D >>> 16 & 255) === 0) R[p++] = 65535 & D;
              else {
                if (!(16 & T)) {
                  if ((64 & T) == 0) {
                    D = x[(65535 & D) + (k & (1 << T) - 1)];
                    continue t;
                  }
                  if (32 & T) {
                    s.mode = 12;
                    break e;
                  }
                  r.msg = "invalid literal/length code", s.mode = 30;
                  break e;
                }
                j = 65535 & D, (T &= 15) && (_ < T && (k += u[l++] << _, _ += 8), j += k & (1 << T) - 1, k >>>= T, _ -= T), _ < 15 && (k += u[l++] << _, _ += 8, k += u[l++] << _, _ += 8), D = F[k & z];
                n: for (; ; ) {
                  if (k >>>= T = D >>> 24, _ -= T, !(16 & (T = D >>> 16 & 255))) {
                    if ((64 & T) == 0) {
                      D = F[(65535 & D) + (k & (1 << T) - 1)];
                      continue n;
                    }
                    r.msg = "invalid distance code", s.mode = 30;
                    break e;
                  }
                  if (X = 65535 & D, _ < (T &= 15) && (k += u[l++] << _, (_ += 8) < T && (k += u[l++] << _, _ += 8)), g < (X += k & (1 << T) - 1)) {
                    r.msg = "invalid distance too far back", s.mode = 30;
                    break e;
                  }
                  if (k >>>= T, _ -= T, (T = p - m) < X) {
                    if (d < (T = X - T) && s.sane) {
                      r.msg = "invalid distance too far back", s.mode = 30;
                      break e;
                    }
                    if (S = h, (A = 0) === b) {
                      if (A += w - T, T < j) {
                        for (j -= T; R[p++] = h[A++], --T; ) ;
                        A = p - X, S = R;
                      }
                    } else if (b < T) {
                      if (A += w + b - T, (T -= b) < j) {
                        for (j -= T; R[p++] = h[A++], --T; ) ;
                        if (A = 0, b < j) {
                          for (j -= T = b; R[p++] = h[A++], --T; ) ;
                          A = p - X, S = R;
                        }
                      }
                    } else if (A += b - T, T < j) {
                      for (j -= T; R[p++] = h[A++], --T; ) ;
                      A = p - X, S = R;
                    }
                    for (; 2 < j; ) R[p++] = S[A++], R[p++] = S[A++], R[p++] = S[A++], j -= 3;
                    j && (R[p++] = S[A++], 1 < j && (R[p++] = S[A++]));
                  } else {
                    for (A = p - X; R[p++] = R[A++], R[p++] = R[A++], R[p++] = R[A++], 2 < (j -= 3); ) ;
                    j && (R[p++] = R[A++], 1 < j && (R[p++] = R[A++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (l < c && p < y);
          l -= j = _ >> 3, k &= (1 << (_ -= j << 3)) - 1, r.next_in = l, r.next_out = p, r.avail_in = l < c ? c - l + 5 : 5 - (l - c), r.avail_out = p < y ? y - p + 257 : 257 - (p - y), s.hold = k, s.bits = _;
        };
      }, {}], 49: [function(t, o, i) {
        var r = t("../utils/common"), a = t("./adler32"), s = t("./crc32"), l = t("./inffast"), c = t("./inftrees"), p = 1, m = 2, y = 0, g = -2, w = 1, d = 852, b = 592;
        function h(A) {
          return (A >>> 24 & 255) + (A >>> 8 & 65280) + ((65280 & A) << 8) + ((255 & A) << 24);
        }
        function k() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new r.Buf16(320), this.work = new r.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function _(A) {
          var S;
          return A && A.state ? (S = A.state, A.total_in = A.total_out = S.total = 0, A.msg = "", S.wrap && (A.adler = 1 & S.wrap), S.mode = w, S.last = 0, S.havedict = 0, S.dmax = 32768, S.head = null, S.hold = 0, S.bits = 0, S.lencode = S.lendyn = new r.Buf32(d), S.distcode = S.distdyn = new r.Buf32(b), S.sane = 1, S.back = -1, y) : g;
        }
        function x(A) {
          var S;
          return A && A.state ? ((S = A.state).wsize = 0, S.whave = 0, S.wnext = 0, _(A)) : g;
        }
        function F(A, S) {
          var u, R;
          return A && A.state ? (R = A.state, S < 0 ? (u = 0, S = -S) : (u = 1 + (S >> 4), S < 48 && (S &= 15)), S && (S < 8 || 15 < S) ? g : (R.window !== null && R.wbits !== S && (R.window = null), R.wrap = u, R.wbits = S, x(A))) : g;
        }
        function B(A, S) {
          var u, R;
          return A ? (R = new k(), (A.state = R).window = null, (u = F(A, S)) !== y && (A.state = null), u) : g;
        }
        var z, D, T = !0;
        function j(A) {
          if (T) {
            var S;
            for (z = new r.Buf32(512), D = new r.Buf32(32), S = 0; S < 144; ) A.lens[S++] = 8;
            for (; S < 256; ) A.lens[S++] = 9;
            for (; S < 280; ) A.lens[S++] = 7;
            for (; S < 288; ) A.lens[S++] = 8;
            for (c(p, A.lens, 0, 288, z, 0, A.work, { bits: 9 }), S = 0; S < 32; ) A.lens[S++] = 5;
            c(m, A.lens, 0, 32, D, 0, A.work, { bits: 5 }), T = !1;
          }
          A.lencode = z, A.lenbits = 9, A.distcode = D, A.distbits = 5;
        }
        function X(A, S, u, R) {
          var K, $ = A.state;
          return $.window === null && ($.wsize = 1 << $.wbits, $.wnext = 0, $.whave = 0, $.window = new r.Buf8($.wsize)), R >= $.wsize ? (r.arraySet($.window, S, u - $.wsize, $.wsize, 0), $.wnext = 0, $.whave = $.wsize) : (R < (K = $.wsize - $.wnext) && (K = R), r.arraySet($.window, S, u - R, K, $.wnext), (R -= K) ? (r.arraySet($.window, S, u - R, R, 0), $.wnext = R, $.whave = $.wsize) : ($.wnext += K, $.wnext === $.wsize && ($.wnext = 0), $.whave < $.wsize && ($.whave += K))), 0;
        }
        i.inflateReset = x, i.inflateReset2 = F, i.inflateResetKeep = _, i.inflateInit = function(A) {
          return B(A, 15);
        }, i.inflateInit2 = B, i.inflate = function(A, S) {
          var u, R, K, $, te, W, ee, O, M, Q, q, Z, pe, Ee, ie, oe, ve, me, Te, De, f, L, P, E, v = 0, C = new r.Buf8(4), U = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!A || !A.state || !A.output || !A.input && A.avail_in !== 0) return g;
          (u = A.state).mode === 12 && (u.mode = 13), te = A.next_out, K = A.output, ee = A.avail_out, $ = A.next_in, R = A.input, W = A.avail_in, O = u.hold, M = u.bits, Q = W, q = ee, L = y;
          e: for (; ; ) switch (u.mode) {
            case w:
              if (u.wrap === 0) {
                u.mode = 13;
                break;
              }
              for (; M < 16; ) {
                if (W === 0) break e;
                W--, O += R[$++] << M, M += 8;
              }
              if (2 & u.wrap && O === 35615) {
                C[u.check = 0] = 255 & O, C[1] = O >>> 8 & 255, u.check = s(u.check, C, 2, 0), M = O = 0, u.mode = 2;
                break;
              }
              if (u.flags = 0, u.head && (u.head.done = !1), !(1 & u.wrap) || (((255 & O) << 8) + (O >> 8)) % 31) {
                A.msg = "incorrect header check", u.mode = 30;
                break;
              }
              if ((15 & O) != 8) {
                A.msg = "unknown compression method", u.mode = 30;
                break;
              }
              if (M -= 4, f = 8 + (15 & (O >>>= 4)), u.wbits === 0) u.wbits = f;
              else if (f > u.wbits) {
                A.msg = "invalid window size", u.mode = 30;
                break;
              }
              u.dmax = 1 << f, A.adler = u.check = 1, u.mode = 512 & O ? 10 : 12, M = O = 0;
              break;
            case 2:
              for (; M < 16; ) {
                if (W === 0) break e;
                W--, O += R[$++] << M, M += 8;
              }
              if (u.flags = O, (255 & u.flags) != 8) {
                A.msg = "unknown compression method", u.mode = 30;
                break;
              }
              if (57344 & u.flags) {
                A.msg = "unknown header flags set", u.mode = 30;
                break;
              }
              u.head && (u.head.text = O >> 8 & 1), 512 & u.flags && (C[0] = 255 & O, C[1] = O >>> 8 & 255, u.check = s(u.check, C, 2, 0)), M = O = 0, u.mode = 3;
            case 3:
              for (; M < 32; ) {
                if (W === 0) break e;
                W--, O += R[$++] << M, M += 8;
              }
              u.head && (u.head.time = O), 512 & u.flags && (C[0] = 255 & O, C[1] = O >>> 8 & 255, C[2] = O >>> 16 & 255, C[3] = O >>> 24 & 255, u.check = s(u.check, C, 4, 0)), M = O = 0, u.mode = 4;
            case 4:
              for (; M < 16; ) {
                if (W === 0) break e;
                W--, O += R[$++] << M, M += 8;
              }
              u.head && (u.head.xflags = 255 & O, u.head.os = O >> 8), 512 & u.flags && (C[0] = 255 & O, C[1] = O >>> 8 & 255, u.check = s(u.check, C, 2, 0)), M = O = 0, u.mode = 5;
            case 5:
              if (1024 & u.flags) {
                for (; M < 16; ) {
                  if (W === 0) break e;
                  W--, O += R[$++] << M, M += 8;
                }
                u.length = O, u.head && (u.head.extra_len = O), 512 & u.flags && (C[0] = 255 & O, C[1] = O >>> 8 & 255, u.check = s(u.check, C, 2, 0)), M = O = 0;
              } else u.head && (u.head.extra = null);
              u.mode = 6;
            case 6:
              if (1024 & u.flags && (W < (Z = u.length) && (Z = W), Z && (u.head && (f = u.head.extra_len - u.length, u.head.extra || (u.head.extra = new Array(u.head.extra_len)), r.arraySet(u.head.extra, R, $, Z, f)), 512 & u.flags && (u.check = s(u.check, R, Z, $)), W -= Z, $ += Z, u.length -= Z), u.length)) break e;
              u.length = 0, u.mode = 7;
            case 7:
              if (2048 & u.flags) {
                if (W === 0) break e;
                for (Z = 0; f = R[$ + Z++], u.head && f && u.length < 65536 && (u.head.name += String.fromCharCode(f)), f && Z < W; ) ;
                if (512 & u.flags && (u.check = s(u.check, R, Z, $)), W -= Z, $ += Z, f) break e;
              } else u.head && (u.head.name = null);
              u.length = 0, u.mode = 8;
            case 8:
              if (4096 & u.flags) {
                if (W === 0) break e;
                for (Z = 0; f = R[$ + Z++], u.head && f && u.length < 65536 && (u.head.comment += String.fromCharCode(f)), f && Z < W; ) ;
                if (512 & u.flags && (u.check = s(u.check, R, Z, $)), W -= Z, $ += Z, f) break e;
              } else u.head && (u.head.comment = null);
              u.mode = 9;
            case 9:
              if (512 & u.flags) {
                for (; M < 16; ) {
                  if (W === 0) break e;
                  W--, O += R[$++] << M, M += 8;
                }
                if (O !== (65535 & u.check)) {
                  A.msg = "header crc mismatch", u.mode = 30;
                  break;
                }
                M = O = 0;
              }
              u.head && (u.head.hcrc = u.flags >> 9 & 1, u.head.done = !0), A.adler = u.check = 0, u.mode = 12;
              break;
            case 10:
              for (; M < 32; ) {
                if (W === 0) break e;
                W--, O += R[$++] << M, M += 8;
              }
              A.adler = u.check = h(O), M = O = 0, u.mode = 11;
            case 11:
              if (u.havedict === 0) return A.next_out = te, A.avail_out = ee, A.next_in = $, A.avail_in = W, u.hold = O, u.bits = M, 2;
              A.adler = u.check = 1, u.mode = 12;
            case 12:
              if (S === 5 || S === 6) break e;
            case 13:
              if (u.last) {
                O >>>= 7 & M, M -= 7 & M, u.mode = 27;
                break;
              }
              for (; M < 3; ) {
                if (W === 0) break e;
                W--, O += R[$++] << M, M += 8;
              }
              switch (u.last = 1 & O, M -= 1, 3 & (O >>>= 1)) {
                case 0:
                  u.mode = 14;
                  break;
                case 1:
                  if (j(u), u.mode = 20, S !== 6) break;
                  O >>>= 2, M -= 2;
                  break e;
                case 2:
                  u.mode = 17;
                  break;
                case 3:
                  A.msg = "invalid block type", u.mode = 30;
              }
              O >>>= 2, M -= 2;
              break;
            case 14:
              for (O >>>= 7 & M, M -= 7 & M; M < 32; ) {
                if (W === 0) break e;
                W--, O += R[$++] << M, M += 8;
              }
              if ((65535 & O) != (O >>> 16 ^ 65535)) {
                A.msg = "invalid stored block lengths", u.mode = 30;
                break;
              }
              if (u.length = 65535 & O, M = O = 0, u.mode = 15, S === 6) break e;
            case 15:
              u.mode = 16;
            case 16:
              if (Z = u.length) {
                if (W < Z && (Z = W), ee < Z && (Z = ee), Z === 0) break e;
                r.arraySet(K, R, $, Z, te), W -= Z, $ += Z, ee -= Z, te += Z, u.length -= Z;
                break;
              }
              u.mode = 12;
              break;
            case 17:
              for (; M < 14; ) {
                if (W === 0) break e;
                W--, O += R[$++] << M, M += 8;
              }
              if (u.nlen = 257 + (31 & O), O >>>= 5, M -= 5, u.ndist = 1 + (31 & O), O >>>= 5, M -= 5, u.ncode = 4 + (15 & O), O >>>= 4, M -= 4, 286 < u.nlen || 30 < u.ndist) {
                A.msg = "too many length or distance symbols", u.mode = 30;
                break;
              }
              u.have = 0, u.mode = 18;
            case 18:
              for (; u.have < u.ncode; ) {
                for (; M < 3; ) {
                  if (W === 0) break e;
                  W--, O += R[$++] << M, M += 8;
                }
                u.lens[U[u.have++]] = 7 & O, O >>>= 3, M -= 3;
              }
              for (; u.have < 19; ) u.lens[U[u.have++]] = 0;
              if (u.lencode = u.lendyn, u.lenbits = 7, P = { bits: u.lenbits }, L = c(0, u.lens, 0, 19, u.lencode, 0, u.work, P), u.lenbits = P.bits, L) {
                A.msg = "invalid code lengths set", u.mode = 30;
                break;
              }
              u.have = 0, u.mode = 19;
            case 19:
              for (; u.have < u.nlen + u.ndist; ) {
                for (; oe = (v = u.lencode[O & (1 << u.lenbits) - 1]) >>> 16 & 255, ve = 65535 & v, !((ie = v >>> 24) <= M); ) {
                  if (W === 0) break e;
                  W--, O += R[$++] << M, M += 8;
                }
                if (ve < 16) O >>>= ie, M -= ie, u.lens[u.have++] = ve;
                else {
                  if (ve === 16) {
                    for (E = ie + 2; M < E; ) {
                      if (W === 0) break e;
                      W--, O += R[$++] << M, M += 8;
                    }
                    if (O >>>= ie, M -= ie, u.have === 0) {
                      A.msg = "invalid bit length repeat", u.mode = 30;
                      break;
                    }
                    f = u.lens[u.have - 1], Z = 3 + (3 & O), O >>>= 2, M -= 2;
                  } else if (ve === 17) {
                    for (E = ie + 3; M < E; ) {
                      if (W === 0) break e;
                      W--, O += R[$++] << M, M += 8;
                    }
                    M -= ie, f = 0, Z = 3 + (7 & (O >>>= ie)), O >>>= 3, M -= 3;
                  } else {
                    for (E = ie + 7; M < E; ) {
                      if (W === 0) break e;
                      W--, O += R[$++] << M, M += 8;
                    }
                    M -= ie, f = 0, Z = 11 + (127 & (O >>>= ie)), O >>>= 7, M -= 7;
                  }
                  if (u.have + Z > u.nlen + u.ndist) {
                    A.msg = "invalid bit length repeat", u.mode = 30;
                    break;
                  }
                  for (; Z--; ) u.lens[u.have++] = f;
                }
              }
              if (u.mode === 30) break;
              if (u.lens[256] === 0) {
                A.msg = "invalid code -- missing end-of-block", u.mode = 30;
                break;
              }
              if (u.lenbits = 9, P = { bits: u.lenbits }, L = c(p, u.lens, 0, u.nlen, u.lencode, 0, u.work, P), u.lenbits = P.bits, L) {
                A.msg = "invalid literal/lengths set", u.mode = 30;
                break;
              }
              if (u.distbits = 6, u.distcode = u.distdyn, P = { bits: u.distbits }, L = c(m, u.lens, u.nlen, u.ndist, u.distcode, 0, u.work, P), u.distbits = P.bits, L) {
                A.msg = "invalid distances set", u.mode = 30;
                break;
              }
              if (u.mode = 20, S === 6) break e;
            case 20:
              u.mode = 21;
            case 21:
              if (6 <= W && 258 <= ee) {
                A.next_out = te, A.avail_out = ee, A.next_in = $, A.avail_in = W, u.hold = O, u.bits = M, l(A, q), te = A.next_out, K = A.output, ee = A.avail_out, $ = A.next_in, R = A.input, W = A.avail_in, O = u.hold, M = u.bits, u.mode === 12 && (u.back = -1);
                break;
              }
              for (u.back = 0; oe = (v = u.lencode[O & (1 << u.lenbits) - 1]) >>> 16 & 255, ve = 65535 & v, !((ie = v >>> 24) <= M); ) {
                if (W === 0) break e;
                W--, O += R[$++] << M, M += 8;
              }
              if (oe && (240 & oe) == 0) {
                for (me = ie, Te = oe, De = ve; oe = (v = u.lencode[De + ((O & (1 << me + Te) - 1) >> me)]) >>> 16 & 255, ve = 65535 & v, !(me + (ie = v >>> 24) <= M); ) {
                  if (W === 0) break e;
                  W--, O += R[$++] << M, M += 8;
                }
                O >>>= me, M -= me, u.back += me;
              }
              if (O >>>= ie, M -= ie, u.back += ie, u.length = ve, oe === 0) {
                u.mode = 26;
                break;
              }
              if (32 & oe) {
                u.back = -1, u.mode = 12;
                break;
              }
              if (64 & oe) {
                A.msg = "invalid literal/length code", u.mode = 30;
                break;
              }
              u.extra = 15 & oe, u.mode = 22;
            case 22:
              if (u.extra) {
                for (E = u.extra; M < E; ) {
                  if (W === 0) break e;
                  W--, O += R[$++] << M, M += 8;
                }
                u.length += O & (1 << u.extra) - 1, O >>>= u.extra, M -= u.extra, u.back += u.extra;
              }
              u.was = u.length, u.mode = 23;
            case 23:
              for (; oe = (v = u.distcode[O & (1 << u.distbits) - 1]) >>> 16 & 255, ve = 65535 & v, !((ie = v >>> 24) <= M); ) {
                if (W === 0) break e;
                W--, O += R[$++] << M, M += 8;
              }
              if ((240 & oe) == 0) {
                for (me = ie, Te = oe, De = ve; oe = (v = u.distcode[De + ((O & (1 << me + Te) - 1) >> me)]) >>> 16 & 255, ve = 65535 & v, !(me + (ie = v >>> 24) <= M); ) {
                  if (W === 0) break e;
                  W--, O += R[$++] << M, M += 8;
                }
                O >>>= me, M -= me, u.back += me;
              }
              if (O >>>= ie, M -= ie, u.back += ie, 64 & oe) {
                A.msg = "invalid distance code", u.mode = 30;
                break;
              }
              u.offset = ve, u.extra = 15 & oe, u.mode = 24;
            case 24:
              if (u.extra) {
                for (E = u.extra; M < E; ) {
                  if (W === 0) break e;
                  W--, O += R[$++] << M, M += 8;
                }
                u.offset += O & (1 << u.extra) - 1, O >>>= u.extra, M -= u.extra, u.back += u.extra;
              }
              if (u.offset > u.dmax) {
                A.msg = "invalid distance too far back", u.mode = 30;
                break;
              }
              u.mode = 25;
            case 25:
              if (ee === 0) break e;
              if (Z = q - ee, u.offset > Z) {
                if ((Z = u.offset - Z) > u.whave && u.sane) {
                  A.msg = "invalid distance too far back", u.mode = 30;
                  break;
                }
                pe = Z > u.wnext ? (Z -= u.wnext, u.wsize - Z) : u.wnext - Z, Z > u.length && (Z = u.length), Ee = u.window;
              } else Ee = K, pe = te - u.offset, Z = u.length;
              for (ee < Z && (Z = ee), ee -= Z, u.length -= Z; K[te++] = Ee[pe++], --Z; ) ;
              u.length === 0 && (u.mode = 21);
              break;
            case 26:
              if (ee === 0) break e;
              K[te++] = u.length, ee--, u.mode = 21;
              break;
            case 27:
              if (u.wrap) {
                for (; M < 32; ) {
                  if (W === 0) break e;
                  W--, O |= R[$++] << M, M += 8;
                }
                if (q -= ee, A.total_out += q, u.total += q, q && (A.adler = u.check = u.flags ? s(u.check, K, q, te - q) : a(u.check, K, q, te - q)), q = ee, (u.flags ? O : h(O)) !== u.check) {
                  A.msg = "incorrect data check", u.mode = 30;
                  break;
                }
                M = O = 0;
              }
              u.mode = 28;
            case 28:
              if (u.wrap && u.flags) {
                for (; M < 32; ) {
                  if (W === 0) break e;
                  W--, O += R[$++] << M, M += 8;
                }
                if (O !== (4294967295 & u.total)) {
                  A.msg = "incorrect length check", u.mode = 30;
                  break;
                }
                M = O = 0;
              }
              u.mode = 29;
            case 29:
              L = 1;
              break e;
            case 30:
              L = -3;
              break e;
            case 31:
              return -4;
            default:
              return g;
          }
          return A.next_out = te, A.avail_out = ee, A.next_in = $, A.avail_in = W, u.hold = O, u.bits = M, (u.wsize || q !== A.avail_out && u.mode < 30 && (u.mode < 27 || S !== 4)) && X(A, A.output, A.next_out, q - A.avail_out) ? (u.mode = 31, -4) : (Q -= A.avail_in, q -= A.avail_out, A.total_in += Q, A.total_out += q, u.total += q, u.wrap && q && (A.adler = u.check = u.flags ? s(u.check, K, q, A.next_out - q) : a(u.check, K, q, A.next_out - q)), A.data_type = u.bits + (u.last ? 64 : 0) + (u.mode === 12 ? 128 : 0) + (u.mode === 20 || u.mode === 15 ? 256 : 0), (Q == 0 && q === 0 || S === 4) && L === y && (L = -5), L);
        }, i.inflateEnd = function(A) {
          if (!A || !A.state) return g;
          var S = A.state;
          return S.window && (S.window = null), A.state = null, y;
        }, i.inflateGetHeader = function(A, S) {
          var u;
          return A && A.state ? (2 & (u = A.state).wrap) == 0 ? g : ((u.head = S).done = !1, y) : g;
        }, i.inflateSetDictionary = function(A, S) {
          var u, R = S.length;
          return A && A.state ? (u = A.state).wrap !== 0 && u.mode !== 11 ? g : u.mode === 11 && a(1, S, R, 0) !== u.check ? -3 : X(A, S, R, R) ? (u.mode = 31, -4) : (u.havedict = 1, y) : g;
        }, i.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(t, o, i) {
        var r = t("../utils/common"), a = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], s = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], l = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], c = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        o.exports = function(p, m, y, g, w, d, b, h) {
          var k, _, x, F, B, z, D, T, j, X = h.bits, A = 0, S = 0, u = 0, R = 0, K = 0, $ = 0, te = 0, W = 0, ee = 0, O = 0, M = null, Q = 0, q = new r.Buf16(16), Z = new r.Buf16(16), pe = null, Ee = 0;
          for (A = 0; A <= 15; A++) q[A] = 0;
          for (S = 0; S < g; S++) q[m[y + S]]++;
          for (K = X, R = 15; 1 <= R && q[R] === 0; R--) ;
          if (R < K && (K = R), R === 0) return w[d++] = 20971520, w[d++] = 20971520, h.bits = 1, 0;
          for (u = 1; u < R && q[u] === 0; u++) ;
          for (K < u && (K = u), A = W = 1; A <= 15; A++) if (W <<= 1, (W -= q[A]) < 0) return -1;
          if (0 < W && (p === 0 || R !== 1)) return -1;
          for (Z[1] = 0, A = 1; A < 15; A++) Z[A + 1] = Z[A] + q[A];
          for (S = 0; S < g; S++) m[y + S] !== 0 && (b[Z[m[y + S]]++] = S);
          if (z = p === 0 ? (M = pe = b, 19) : p === 1 ? (M = a, Q -= 257, pe = s, Ee -= 257, 256) : (M = l, pe = c, -1), A = u, B = d, te = S = O = 0, x = -1, F = (ee = 1 << ($ = K)) - 1, p === 1 && 852 < ee || p === 2 && 592 < ee) return 1;
          for (; ; ) {
            for (D = A - te, j = b[S] < z ? (T = 0, b[S]) : b[S] > z ? (T = pe[Ee + b[S]], M[Q + b[S]]) : (T = 96, 0), k = 1 << A - te, u = _ = 1 << $; w[B + (O >> te) + (_ -= k)] = D << 24 | T << 16 | j | 0, _ !== 0; ) ;
            for (k = 1 << A - 1; O & k; ) k >>= 1;
            if (k !== 0 ? (O &= k - 1, O += k) : O = 0, S++, --q[A] == 0) {
              if (A === R) break;
              A = m[y + b[S]];
            }
            if (K < A && (O & F) !== x) {
              for (te === 0 && (te = K), B += u, W = 1 << ($ = A - te); $ + te < R && !((W -= q[$ + te]) <= 0); ) $++, W <<= 1;
              if (ee += 1 << $, p === 1 && 852 < ee || p === 2 && 592 < ee) return 1;
              w[x = O & F] = K << 24 | $ << 16 | B - d | 0;
            }
          }
          return O !== 0 && (w[B + O] = A - te << 24 | 64 << 16 | 0), h.bits = K, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(t, o, i) {
        o.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(t, o, i) {
        var r = t("../utils/common"), a = 0, s = 1;
        function l(v) {
          for (var C = v.length; 0 <= --C; ) v[C] = 0;
        }
        var c = 0, p = 29, m = 256, y = m + 1 + p, g = 30, w = 19, d = 2 * y + 1, b = 15, h = 16, k = 7, _ = 256, x = 16, F = 17, B = 18, z = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], D = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], T = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], X = new Array(2 * (y + 2));
        l(X);
        var A = new Array(2 * g);
        l(A);
        var S = new Array(512);
        l(S);
        var u = new Array(256);
        l(u);
        var R = new Array(p);
        l(R);
        var K, $, te, W = new Array(g);
        function ee(v, C, U, N, I) {
          this.static_tree = v, this.extra_bits = C, this.extra_base = U, this.elems = N, this.max_length = I, this.has_stree = v && v.length;
        }
        function O(v, C) {
          this.dyn_tree = v, this.max_code = 0, this.stat_desc = C;
        }
        function M(v) {
          return v < 256 ? S[v] : S[256 + (v >>> 7)];
        }
        function Q(v, C) {
          v.pending_buf[v.pending++] = 255 & C, v.pending_buf[v.pending++] = C >>> 8 & 255;
        }
        function q(v, C, U) {
          v.bi_valid > h - U ? (v.bi_buf |= C << v.bi_valid & 65535, Q(v, v.bi_buf), v.bi_buf = C >> h - v.bi_valid, v.bi_valid += U - h) : (v.bi_buf |= C << v.bi_valid & 65535, v.bi_valid += U);
        }
        function Z(v, C, U) {
          q(v, U[2 * C], U[2 * C + 1]);
        }
        function pe(v, C) {
          for (var U = 0; U |= 1 & v, v >>>= 1, U <<= 1, 0 < --C; ) ;
          return U >>> 1;
        }
        function Ee(v, C, U) {
          var N, I, G = new Array(b + 1), Y = 0;
          for (N = 1; N <= b; N++) G[N] = Y = Y + U[N - 1] << 1;
          for (I = 0; I <= C; I++) {
            var H = v[2 * I + 1];
            H !== 0 && (v[2 * I] = pe(G[H]++, H));
          }
        }
        function ie(v) {
          var C;
          for (C = 0; C < y; C++) v.dyn_ltree[2 * C] = 0;
          for (C = 0; C < g; C++) v.dyn_dtree[2 * C] = 0;
          for (C = 0; C < w; C++) v.bl_tree[2 * C] = 0;
          v.dyn_ltree[2 * _] = 1, v.opt_len = v.static_len = 0, v.last_lit = v.matches = 0;
        }
        function oe(v) {
          8 < v.bi_valid ? Q(v, v.bi_buf) : 0 < v.bi_valid && (v.pending_buf[v.pending++] = v.bi_buf), v.bi_buf = 0, v.bi_valid = 0;
        }
        function ve(v, C, U, N) {
          var I = 2 * C, G = 2 * U;
          return v[I] < v[G] || v[I] === v[G] && N[C] <= N[U];
        }
        function me(v, C, U) {
          for (var N = v.heap[U], I = U << 1; I <= v.heap_len && (I < v.heap_len && ve(C, v.heap[I + 1], v.heap[I], v.depth) && I++, !ve(C, N, v.heap[I], v.depth)); ) v.heap[U] = v.heap[I], U = I, I <<= 1;
          v.heap[U] = N;
        }
        function Te(v, C, U) {
          var N, I, G, Y, H = 0;
          if (v.last_lit !== 0) for (; N = v.pending_buf[v.d_buf + 2 * H] << 8 | v.pending_buf[v.d_buf + 2 * H + 1], I = v.pending_buf[v.l_buf + H], H++, N === 0 ? Z(v, I, C) : (Z(v, (G = u[I]) + m + 1, C), (Y = z[G]) !== 0 && q(v, I -= R[G], Y), Z(v, G = M(--N), U), (Y = D[G]) !== 0 && q(v, N -= W[G], Y)), H < v.last_lit; ) ;
          Z(v, _, C);
        }
        function De(v, C) {
          var U, N, I, G = C.dyn_tree, Y = C.stat_desc.static_tree, H = C.stat_desc.has_stree, J = C.stat_desc.elems, le = -1;
          for (v.heap_len = 0, v.heap_max = d, U = 0; U < J; U++) G[2 * U] !== 0 ? (v.heap[++v.heap_len] = le = U, v.depth[U] = 0) : G[2 * U + 1] = 0;
          for (; v.heap_len < 2; ) G[2 * (I = v.heap[++v.heap_len] = le < 2 ? ++le : 0)] = 1, v.depth[I] = 0, v.opt_len--, H && (v.static_len -= Y[2 * I + 1]);
          for (C.max_code = le, U = v.heap_len >> 1; 1 <= U; U--) me(v, G, U);
          for (I = J; U = v.heap[1], v.heap[1] = v.heap[v.heap_len--], me(v, G, 1), N = v.heap[1], v.heap[--v.heap_max] = U, v.heap[--v.heap_max] = N, G[2 * I] = G[2 * U] + G[2 * N], v.depth[I] = (v.depth[U] >= v.depth[N] ? v.depth[U] : v.depth[N]) + 1, G[2 * U + 1] = G[2 * N + 1] = I, v.heap[1] = I++, me(v, G, 1), 2 <= v.heap_len; ) ;
          v.heap[--v.heap_max] = v.heap[1], (function(re, xe) {
            var Ve, Me, Je, ge, ht, Mt, Le = xe.dyn_tree, vn = xe.max_code, ir = xe.stat_desc.static_tree, rr = xe.stat_desc.has_stree, ar = xe.stat_desc.extra_bits, En = xe.stat_desc.extra_base, Qe = xe.stat_desc.max_length, dt = 0;
            for (ge = 0; ge <= b; ge++) re.bl_count[ge] = 0;
            for (Le[2 * re.heap[re.heap_max] + 1] = 0, Ve = re.heap_max + 1; Ve < d; Ve++) Qe < (ge = Le[2 * Le[2 * (Me = re.heap[Ve]) + 1] + 1] + 1) && (ge = Qe, dt++), Le[2 * Me + 1] = ge, vn < Me || (re.bl_count[ge]++, ht = 0, En <= Me && (ht = ar[Me - En]), Mt = Le[2 * Me], re.opt_len += Mt * (ge + ht), rr && (re.static_len += Mt * (ir[2 * Me + 1] + ht)));
            if (dt !== 0) {
              do {
                for (ge = Qe - 1; re.bl_count[ge] === 0; ) ge--;
                re.bl_count[ge]--, re.bl_count[ge + 1] += 2, re.bl_count[Qe]--, dt -= 2;
              } while (0 < dt);
              for (ge = Qe; ge !== 0; ge--) for (Me = re.bl_count[ge]; Me !== 0; ) vn < (Je = re.heap[--Ve]) || (Le[2 * Je + 1] !== ge && (re.opt_len += (ge - Le[2 * Je + 1]) * Le[2 * Je], Le[2 * Je + 1] = ge), Me--);
            }
          })(v, C), Ee(G, le, v.bl_count);
        }
        function f(v, C, U) {
          var N, I, G = -1, Y = C[1], H = 0, J = 7, le = 4;
          for (Y === 0 && (J = 138, le = 3), C[2 * (U + 1) + 1] = 65535, N = 0; N <= U; N++) I = Y, Y = C[2 * (N + 1) + 1], ++H < J && I === Y || (H < le ? v.bl_tree[2 * I] += H : I !== 0 ? (I !== G && v.bl_tree[2 * I]++, v.bl_tree[2 * x]++) : H <= 10 ? v.bl_tree[2 * F]++ : v.bl_tree[2 * B]++, G = I, le = (H = 0) === Y ? (J = 138, 3) : I === Y ? (J = 6, 3) : (J = 7, 4));
        }
        function L(v, C, U) {
          var N, I, G = -1, Y = C[1], H = 0, J = 7, le = 4;
          for (Y === 0 && (J = 138, le = 3), N = 0; N <= U; N++) if (I = Y, Y = C[2 * (N + 1) + 1], !(++H < J && I === Y)) {
            if (H < le) for (; Z(v, I, v.bl_tree), --H != 0; ) ;
            else I !== 0 ? (I !== G && (Z(v, I, v.bl_tree), H--), Z(v, x, v.bl_tree), q(v, H - 3, 2)) : H <= 10 ? (Z(v, F, v.bl_tree), q(v, H - 3, 3)) : (Z(v, B, v.bl_tree), q(v, H - 11, 7));
            G = I, le = (H = 0) === Y ? (J = 138, 3) : I === Y ? (J = 6, 3) : (J = 7, 4);
          }
        }
        l(W);
        var P = !1;
        function E(v, C, U, N) {
          q(v, (c << 1) + (N ? 1 : 0), 3), (function(I, G, Y, H) {
            oe(I), Q(I, Y), Q(I, ~Y), r.arraySet(I.pending_buf, I.window, G, Y, I.pending), I.pending += Y;
          })(v, C, U);
        }
        i._tr_init = function(v) {
          P || ((function() {
            var C, U, N, I, G, Y = new Array(b + 1);
            for (I = N = 0; I < p - 1; I++) for (R[I] = N, C = 0; C < 1 << z[I]; C++) u[N++] = I;
            for (u[N - 1] = I, I = G = 0; I < 16; I++) for (W[I] = G, C = 0; C < 1 << D[I]; C++) S[G++] = I;
            for (G >>= 7; I < g; I++) for (W[I] = G << 7, C = 0; C < 1 << D[I] - 7; C++) S[256 + G++] = I;
            for (U = 0; U <= b; U++) Y[U] = 0;
            for (C = 0; C <= 143; ) X[2 * C + 1] = 8, C++, Y[8]++;
            for (; C <= 255; ) X[2 * C + 1] = 9, C++, Y[9]++;
            for (; C <= 279; ) X[2 * C + 1] = 7, C++, Y[7]++;
            for (; C <= 287; ) X[2 * C + 1] = 8, C++, Y[8]++;
            for (Ee(X, y + 1, Y), C = 0; C < g; C++) A[2 * C + 1] = 5, A[2 * C] = pe(C, 5);
            K = new ee(X, z, m + 1, y, b), $ = new ee(A, D, 0, g, b), te = new ee(new Array(0), T, 0, w, k);
          })(), P = !0), v.l_desc = new O(v.dyn_ltree, K), v.d_desc = new O(v.dyn_dtree, $), v.bl_desc = new O(v.bl_tree, te), v.bi_buf = 0, v.bi_valid = 0, ie(v);
        }, i._tr_stored_block = E, i._tr_flush_block = function(v, C, U, N) {
          var I, G, Y = 0;
          0 < v.level ? (v.strm.data_type === 2 && (v.strm.data_type = (function(H) {
            var J, le = 4093624447;
            for (J = 0; J <= 31; J++, le >>>= 1) if (1 & le && H.dyn_ltree[2 * J] !== 0) return a;
            if (H.dyn_ltree[18] !== 0 || H.dyn_ltree[20] !== 0 || H.dyn_ltree[26] !== 0) return s;
            for (J = 32; J < m; J++) if (H.dyn_ltree[2 * J] !== 0) return s;
            return a;
          })(v)), De(v, v.l_desc), De(v, v.d_desc), Y = (function(H) {
            var J;
            for (f(H, H.dyn_ltree, H.l_desc.max_code), f(H, H.dyn_dtree, H.d_desc.max_code), De(H, H.bl_desc), J = w - 1; 3 <= J && H.bl_tree[2 * j[J] + 1] === 0; J--) ;
            return H.opt_len += 3 * (J + 1) + 5 + 5 + 4, J;
          })(v), I = v.opt_len + 3 + 7 >>> 3, (G = v.static_len + 3 + 7 >>> 3) <= I && (I = G)) : I = G = U + 5, U + 4 <= I && C !== -1 ? E(v, C, U, N) : v.strategy === 4 || G === I ? (q(v, 2 + (N ? 1 : 0), 3), Te(v, X, A)) : (q(v, 4 + (N ? 1 : 0), 3), (function(H, J, le, re) {
            var xe;
            for (q(H, J - 257, 5), q(H, le - 1, 5), q(H, re - 4, 4), xe = 0; xe < re; xe++) q(H, H.bl_tree[2 * j[xe] + 1], 3);
            L(H, H.dyn_ltree, J - 1), L(H, H.dyn_dtree, le - 1);
          })(v, v.l_desc.max_code + 1, v.d_desc.max_code + 1, Y + 1), Te(v, v.dyn_ltree, v.dyn_dtree)), ie(v), N && oe(v);
        }, i._tr_tally = function(v, C, U) {
          return v.pending_buf[v.d_buf + 2 * v.last_lit] = C >>> 8 & 255, v.pending_buf[v.d_buf + 2 * v.last_lit + 1] = 255 & C, v.pending_buf[v.l_buf + v.last_lit] = 255 & U, v.last_lit++, C === 0 ? v.dyn_ltree[2 * U]++ : (v.matches++, C--, v.dyn_ltree[2 * (u[U] + m + 1)]++, v.dyn_dtree[2 * M(C)]++), v.last_lit === v.lit_bufsize - 1;
        }, i._tr_align = function(v) {
          q(v, 2, 3), Z(v, _, X), (function(C) {
            C.bi_valid === 16 ? (Q(C, C.bi_buf), C.bi_buf = 0, C.bi_valid = 0) : 8 <= C.bi_valid && (C.pending_buf[C.pending++] = 255 & C.bi_buf, C.bi_buf >>= 8, C.bi_valid -= 8);
          })(v);
        };
      }, { "../utils/common": 41 }], 53: [function(t, o, i) {
        o.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(t, o, i) {
        (function(r) {
          (function(a, s) {
            if (!a.setImmediate) {
              var l, c, p, m, y = 1, g = {}, w = !1, d = a.document, b = Object.getPrototypeOf && Object.getPrototypeOf(a);
              b = b && b.setTimeout ? b : a, l = {}.toString.call(a.process) === "[object process]" ? function(x) {
                process.nextTick(function() {
                  k(x);
                });
              } : (function() {
                if (a.postMessage && !a.importScripts) {
                  var x = !0, F = a.onmessage;
                  return a.onmessage = function() {
                    x = !1;
                  }, a.postMessage("", "*"), a.onmessage = F, x;
                }
              })() ? (m = "setImmediate$" + Math.random() + "$", a.addEventListener ? a.addEventListener("message", _, !1) : a.attachEvent("onmessage", _), function(x) {
                a.postMessage(m + x, "*");
              }) : a.MessageChannel ? ((p = new MessageChannel()).port1.onmessage = function(x) {
                k(x.data);
              }, function(x) {
                p.port2.postMessage(x);
              }) : d && "onreadystatechange" in d.createElement("script") ? (c = d.documentElement, function(x) {
                var F = d.createElement("script");
                F.onreadystatechange = function() {
                  k(x), F.onreadystatechange = null, c.removeChild(F), F = null;
                }, c.appendChild(F);
              }) : function(x) {
                setTimeout(k, 0, x);
              }, b.setImmediate = function(x) {
                typeof x != "function" && (x = new Function("" + x));
                for (var F = new Array(arguments.length - 1), B = 0; B < F.length; B++) F[B] = arguments[B + 1];
                var z = { callback: x, args: F };
                return g[y] = z, l(y), y++;
              }, b.clearImmediate = h;
            }
            function h(x) {
              delete g[x];
            }
            function k(x) {
              if (w) setTimeout(k, 0, x);
              else {
                var F = g[x];
                if (F) {
                  w = !0;
                  try {
                    (function(B) {
                      var z = B.callback, D = B.args;
                      switch (D.length) {
                        case 0:
                          z();
                          break;
                        case 1:
                          z(D[0]);
                          break;
                        case 2:
                          z(D[0], D[1]);
                          break;
                        case 3:
                          z(D[0], D[1], D[2]);
                          break;
                        default:
                          z.apply(s, D);
                      }
                    })(F);
                  } finally {
                    h(x), w = !1;
                  }
                }
              }
            }
            function _(x) {
              x.source === a && typeof x.data == "string" && x.data.indexOf(m) === 0 && k(+x.data.slice(m.length));
            }
          })(typeof self > "u" ? r === void 0 ? this : r : self);
        }).call(this, typeof pt < "u" ? pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Wt)), Wt.exports;
}
var ws = bs();
const ys = /* @__PURE__ */ gs(ws);
function ks(e, n) {
  const t = rn(n) || "carousel";
  return Array.from({ length: e }, (o, i) => yr(t, i));
}
async function Is(e, n) {
  const t = new ys(), o = ks(e.length, n);
  return e.forEach((i, r) => t.file(o[r], i)), t.generateAsync({ type: "blob", compression: "STORE" });
}
export {
  lr as BLOCKING_CODES,
  qn as BUILTIN_TEMPLATE_IDS,
  hs as BlockingWarningsError,
  ue as CANVAS,
  Yn as DEFAULT_TEMPLATE,
  he as SAFE,
  $o as VariantError,
  Fs as configureFonts,
  er as deckIcons,
  Ds as decodeDeckLink,
  As as downloadBlob,
  zs as encodeDeckLink,
  Is as exportZip,
  Ss as getHeaderKey,
  Yi as getVariant,
  vs as hasVariant,
  cr as isBlocking,
  Qi as layoutSlide,
  ds as layoutWarnings,
  Es as listVariants,
  xs as loadFonts,
  Go as parseDeck,
  _s as registerVariant,
  Cs as renderDeck,
  qo as renderSlide,
  Qr as resolvePhotos,
  Bs as setHeaderKey,
  yr as slideFileName,
  ks as slideFileNames,
  rn as slugify,
  jo as validateVariant
};
//# sourceMappingURL=browser.js.map
