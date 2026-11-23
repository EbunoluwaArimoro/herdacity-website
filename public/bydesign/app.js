// By Design Board · Becoming HER 2026
// Everything she types stays on her phone (localStorage). Her uploads stay on her phone (IndexedDB).
(function () {
  "use strict";
  const C = window.BYDESIGN_CONFIG || {};
  const E = window.BoardEngine, LOOKS = window.LOOKS, AREAS = window.AREAS;
  const $ = (s) => document.querySelector(s), $$ = (s) => Array.from(document.querySelectorAll(s));
  const KEY = "bydesign.v1", QKEY = "bydesign.optin.queue";
  const N_PHOTOS = C.PHOTOS_PER_BOARD || 28, MAX_PICKS = C.MAX_PICKS || 8, MAX_UP = C.MAX_UPLOADS || 3;
  const rand = () => (Math.random() * 2147483647) | 0;

  // ---------------- state ----------------
  const DEFAULTS = {
    name: "", word: "", wish: "", outcome: "", obstacle: "", if: "", then: "",
    areas: [], trad: { love: ["all"], faith: ["all"] }, picks: {},
    feelings: null, affirmations: null, ownFeel: [], ownAff: [], background: { key: "look" },
    look: null, pal: 0, comp: "collage", seed: 0, photoSeed: 0, textSeed: 0, photoIds: null
  };
  let S = Object.assign(JSON.parse(JSON.stringify(DEFAULTS)), load());
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  if (!S.seed) S.seed = rand();
  if (!S.photoSeed) S.photoSeed = rand();
  if (!S.textSeed) S.textSeed = rand();
  if (!window.BoardEngine.comps.includes(S.comp)) S.comp = "collage";

  let BANK = [], BYID = {};
  const UP = {}; // uploads: id -> {id, area, blob, url, w, h, t}

  // ---------------- uploads storage ----------------
  const db = (() => {
    let p;
    function open() {
      if (!p) p = new Promise((res, rej) => {
        if (!window.indexedDB) return rej(new Error("no idb"));
        const r = indexedDB.open("bydesign", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("uploads", { keyPath: "id" });
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      });
      return p;
    }
    function tx(mode, fn) {
      return open().then((d) => new Promise((res, rej) => {
        const t = d.transaction("uploads", mode); const req = fn(t.objectStore("uploads"));
        t.oncomplete = () => res(req && req.result); t.onerror = () => rej(t.error);
      }));
    }
    return { all: () => tx("readonly", (s) => s.getAll()), put: (v) => tx("readwrite", (s) => s.put(v)), del: (id) => tx("readwrite", (s) => s.delete(id)) };
  })();

  // ---------------- images and fonts ----------------
  const imgCache = new Map();
  function img(src) {
    if (!imgCache.has(src)) imgCache.set(src, new Promise((res, rej) => { const i = new Image(); i.decoding = "async"; i.onload = () => res(i); i.onerror = () => { imgCache.delete(src); rej(new Error("img " + src)); }; i.src = src; }));
    return imgCache.get(src);
  }
  const FAMS = ["Great Vibes", "Pinyon Script", "Noto Serif Display", "EB Garamond", "Anton", "Montserrat", "Inter", "Special Elite", "Courier Prime", "Playfair Display", "Oswald", "Cormorant Garamond", "Old Standard TT", "Caveat", "Libre Baskerville", "League Gothic"];
  const fontDone = new Set();
  function ensureFonts() {
    // load every subset her own words need (Yoruba, Igbo and Hausa letters live outside basic Latin)
    const text = [S.word, feelings().join(" "), affirmations().join(" "), "2027 twenty-seven Home Rest Travel Wealth Love Family Health Faith Growth Career Friends Her"].join(" ");
    const text2 = text + " " + text.toLocaleUpperCase() + " " + text.toLocaleLowerCase();
    if (fontDone.has(text)) return Promise.resolve();
    const jobs = [];
    FAMS.forEach((f) => ["300", "400", "500", "600", "700", "800", "italic 400", "italic 500", "italic 700"].forEach((w) => jobs.push(document.fonts.load(`${w} 40px "${f}"`, text2).catch(() => {}))));
    return Promise.all(jobs).then(() => { fontDone.add(text); });
  }

  // ---------------- photo choice ----------------
  function allowed(b) {
    if (b.a !== "love" && b.a !== "faith") return true;
    const sel = (S.trad && S.trad[b.a]) || ["all"];
    if (sel.includes("all") || !b.t || b.t === "general") return true;
    return sel.includes(b.t);
  }
  function uploadsFor(a) { return Object.values(UP).filter((u) => u.area === a).sort((x, y) => x.t - y.t); }
  function isPicked(id) { return Object.values(S.picks).some((l) => l.includes(id)); }
  // Her uploads first, then her picks, then the engine's choices, spread evenly across her areas.
  function buildPhotoIds() {
    const rng = E.R(S.photoSeed);
    const areas = S.areas.length ? S.areas : ["her"];
    const queues = areas.map((a) => {
      const pri = uploadsFor(a).map((u) => u.id).concat((S.picks[a] || []).filter((id) => BYID[id]));
      const used = new Set(pri);
      const fill = BANK.filter((b) => b.a === a && allowed(b) && !used.has(b.id))
        .map((b) => ({ id: b.id, s: rng() + ((b.lk || []).includes(S.look) ? 0.35 : 0) }))
        .sort((x, y) => y.s - x.s).map((x) => x.id);
      return { pri, fill };
    });
    const out = [];
    for (let i = 0, more = true; more; i++) { more = false; queues.forEach((q) => { if (i < q.pri.length) { out.push(q.pri[i]); more = true; } }); }
    // with one or two themes, her themes fill most of the board and close themes add variety, so it is never thin
    const mine = Math.round(N_PHOTOS * (areas.length === 1 ? 0.7 : areas.length === 2 ? 0.85 : 1));
    for (let i = 0; out.length < mine; i++) {
      let any = false;
      queues.forEach((q) => { if (out.length < mine && i < q.fill.length) { out.push(q.fill[i]); any = true; } });
      if (!any) break;
    }
    const related = []; areas.forEach((a) => ((window.RELATED || {})[a] || []).forEach((r) => { if (!areas.includes(r) && !related.includes(r)) related.push(r); }));
    const used = new Set(out);
    const rq = related.map((a) => rng.shuffle(BANK.filter((b) => b.a === a && !b.sm && !used.has(b.id))).map((b) => b.id));
    for (let i = 0; out.length < N_PHOTOS; i++) { let any = false; rq.forEach((q) => { if (out.length < N_PHOTOS && i < q.length) { out.push(q[i]); any = true; } }); if (!any) break; }
    return out;
  }
  function photoIds() { if (!S.photoIds || !S.photoIds.length) { S.photoIds = buildPhotoIds(); save(); } return S.photoIds; }
  async function photosFor(ids, q, lookKey) {
    const bwShare = (LOOKS[lookKey] || LOOKS.harvest).grade.bwShare || 0;
    const list = await Promise.all(ids.map(async (id) => {
      if (UP[id]) {
        const u = UP[id];
        try { return { img: await img(u.url), focal: [0.5, 0.4], faces: u.faces || [], small: false, bw: false, id, area: u.area }; } catch (e) { return null; }
      }
      const b = BYID[id]; if (!b) return null;
      let im; try { im = await img(`bank/${q === "thumb" ? "thumb" : "full"}/${id}.webp`); } catch (e) { return null; }
      return {
        img: im, focal: b.f || [0.5, 0.38], faces: b.fc || [], small: !!b.sm, id, area: b.a,
        bw: E.R(E.hash(id) ^ S.photoSeed).chance(bwShare),
        heroScore: (isPicked(id) ? 2 : 0) + (b.a === "her" ? 1.5 : 0) + (["travel", "peace", "money"].includes(b.a) ? 0.5 : 0)
      };
    }));
    return list.filter(Boolean);
  }

  // ---------------- sizes ----------------
  function deviceSize() {
    const sw = screen.width || 390, sh = screen.height || 844;
    const dpr = Math.min(window.devicePixelRatio || 2, 3);
    let W = Math.round(Math.min(sw, sh) * dpr), H = Math.round(Math.max(sw, sh) * dpr);
    if (W < 1080) { H = Math.round(H * 1080 / W); W = 1080; }
    if (W > 1440) { H = Math.round(H * 1440 / W); W = 1440; }
    const r = H / W;
    if (r < 1.6 || r > 2.4) { W = 1179; H = 2556; } // laptops and odd screens get an iPhone-shaped board
    return { W, H };
  }
  const RATIO = (() => { const d = deviceSize(); return d.H / d.W; })();
  // her feeling words and affirmations; if she skips, her areas choose for her
  // suggestions for her themes, best first: one from each theme in turn
  function themeList(kind) {
    const lists = S.areas.map((a) => { const t = (window.THEMES || {})[a] || {}; let l = (t[kind] || []).slice(); if (kind === "a" && a === "faith") { const sel = S.trad.faith || ["all"]; ["christian", "muslim"].forEach((k) => { if (sel.includes(k) || sel.includes("all")) l = (t[k] || []).concat(l); }); } return l; });
    const out = []; for (let i = 0; i < 12; i++) lists.forEach((l) => { if (l[i] && !out.includes(l[i])) out.push(l[i]); });
    return out;
  }
  // her own picks first; if she chose only a few, we top up from her themes so the board is never thin
  function feelings() {
    const mine = (S.feelings || []).slice(); const want = 4;
    if (mine.length >= want) return mine;
    themeList("f").concat(window.FEELINGS).forEach((w) => { if (mine.length < want && !mine.includes(w)) mine.push(w); });
    return mine;
  }
  function affirmations() {
    const mine = (S.affirmations || []).slice(); const want = 2;
    if (mine.length >= want) return mine;
    themeList("a").concat(window.AFFIRMATIONS).forEach((w) => { if (mine.length < want && !mine.includes(w)) mine.push(w); });
    return mine;
  }

  async function renderTo(cv, o) {
    await ensureFonts();
    const photos = await photosFor(photoIds(), o.q || "full", o.look);
    return E.render(cv, { W: o.W, H: o.H, lookKey: o.look, pal: o.pal || 0, comp: o.comp, seed: o.seed, textSeed: o.textSeed || S.textSeed, word: S.word.trim(), feelings: feelings(), affirmations: affirmations(), quiet: themeList("a").concat(window.AFFIRMATIONS).find((x) => !affirmations().includes(x)), photos, areas: S.areas, background: await backgroundSpec(o.q) });
  }

  async function backgroundSpec(q) {
    const b = S.background || { key: "look" }; const def = (window.BACKGROUNDS || []).find((x) => x.key === b.key);
    if (!def || def.key === "look") return null;
    if (def.key !== "photo") return def;
    const id = b.photoId && (BYID[b.photoId] || UP[b.photoId]) ? b.photoId : photoIds()[0];
    try { return Object.assign({}, def, { img: await img(UP[id] ? UP[id].url : `bank/${q === "thumb" ? "thumb" : "full"}/${id}.webp`) }); } catch (e) { return null; }
  }

  // ---------------- navigation ----------------
  const ORDER = ["s-welcome", "s-word", "s-wish", "s-outcome", "s-obstacle", "s-plan", "s-areas", "s-trad", "s-pick", "s-feel", "s-affirm", "s-look", "s-boards", "s-refine", "s-save", "s-stay"];
  let hist = [], cur = null, pickIdx = 0, fromRefine = false;
  function go(id, push = true) {
    if (cur && push && cur !== id) hist.push(cur);
    cur = id;
    $$(".screen").forEach((s) => s.classList.toggle("on", s.id === id));
    $("#back").hidden = !hist.length;
    const step = +$("#" + id).dataset.step;
    $("#steps").innerHTML = Array.from({ length: 12 }, (_, i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("");
    window.scrollTo(0, 0);
    if (ENTER[id]) ENTER[id]();
  }
  $("#back").addEventListener("click", () => {
    if (cur === "s-pick" && pickIdx > 0) { pickIdx--; renderPick(); window.scrollTo(0, 0); return; }
    const prev = hist.pop(); if (prev) go(prev, false);
  });
  const needsTrad = () => S.areas.includes("love") || S.areas.includes("faith");

  const FIELDS = { name: "f-name", word: "f-word", wish: "f-wish", outcome: "f-outcome", obstacle: "f-obstacle", if: "f-if", then: "f-then" };
  const REQUIRED = { "s-welcome": ["name"], "s-word": ["word"], "s-wish": ["wish"], "s-outcome": ["outcome"], "s-obstacle": ["obstacle"], "s-plan": ["if", "then"] };
  function valid(id) {
    let ok = true;
    (REQUIRED[id] || []).forEach((k) => {
      const el = $("#" + FIELDS[k]); const f = el.closest(".field");
      if (!S[k].trim()) { ok = false; f.classList.remove("err"); void f.offsetWidth; f.classList.add("err"); el.focus(); }
      else f.classList.remove("err");
    });
    return ok;
  }
  function next() {
    if (!valid(cur)) return;
    const i = ORDER.indexOf(cur);
    if (cur === "s-areas") { pickIdx = 0; return go(needsTrad() ? "s-trad" : "s-pick"); }
    if (cur === "s-trad") { pickIdx = 0; return go("s-pick"); }
    go(ORDER[i + 1]);
  }
  $$(".next").forEach((b) => b.addEventListener("click", next));

  // ---------------- text fields ----------------
  Object.entries(FIELDS).forEach(([k, id]) => {
    const el = $("#" + id); el.value = S[k] || "";
    const cnt = $(`.count[data-for="${id}"]`);
    const upd = () => { if (cnt) cnt.textContent = `${el.value.length}/${el.maxLength}`; };
    upd();
    el.addEventListener("input", () => {
      S[k] = el.value; upd(); el.closest(".field").classList.remove("err"); save();
      if (k === "word") drawWordPreview();
    });
    if (el.tagName === "INPUT") el.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); next(); } });
  });

  function drawWordPreview() {
    const cv = $("#word-preview"), ctx = cv.getContext("2d");
    const w = S.word.trim() || "Abundance";
    const hz = /[ƁƊƘƳɓɗƙƴ]/.test(w);
    ensureFonts().then(() => {
      ctx.fillStyle = "#efe6da"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "#3a2a20"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      let fs = 150; const fam = hz ? "Noto Serif Display" : "Great Vibes";
      do { ctx.font = `400 ${fs}px "${fam}"`; fs -= 4; } while (ctx.measureText(w).width > cv.width * 0.86 && fs > 40);
      ctx.fillText(w, cv.width / 2, 185);
      ctx.font = `400 34px "Noto Serif Display"`; ctx.fillStyle = "#a5532e"; ctx.fillText("2027", cv.width / 2, 258);
      ctx.globalAlpha = S.word.trim() ? 1 : 0.45; ctx.globalAlpha = 1;
    });
  }

  // ---------------- areas ----------------
  function areaCover(a) {
    const prefer = { her: "her", love: "general" };
    const list = BANK.filter((b) => b.a === a && !b.sm && (a !== "love" || b.t === "general"));
    return list.length ? list[E.hash(a) % list.length].id : null;
  }
  function renderAreas() {
    const box = $("#area-tiles");
    box.innerHTML = Object.entries(AREAS).map(([k, v]) => {
      const id = areaCover(k);
      return `<button class="tile ${S.areas.includes(k) ? "on" : ""}" data-a="${k}">${id ? `<img src="bank/thumb/${id}.webp" alt="" loading="lazy">` : ""}<span>${v.label}</span></button>`;
    }).join("");
    $("#areas-next").disabled = S.areas.length < 1;
  }
  $("#area-tiles").addEventListener("click", (e) => {
    const t = e.target.closest(".tile"); if (!t) return;
    const a = t.dataset.a, i = S.areas.indexOf(a);
    if (i >= 0) S.areas.splice(i, 1); else { if (S.areas.length >= 4) return toast("Pick up to 4. Tap one to remove it first."); S.areas.push(a); }
    S.photoIds = null; save(); renderAreas();
  });

  // ---------------- traditions ----------------
  const TRAD = {
    love: [["christian", "Christian (white wedding)"], ["muslim", "Muslim (Nikah)"], ["northern", "Northern"], ["yoruba", "Yoruba"], ["igbo", "Igbo"], ["edo", "Edo"], ["all", "Show me all"]],
    faith: [["christian", "Christian"], ["muslim", "Muslim"], ["all", "Show me all"]]
  };
  function renderTrad() {
    ["love", "faith"].forEach((g) => {
      $("#trad-" + g).hidden = !S.areas.includes(g);
      const sel = S.trad[g] || ["all"];
      $(`.chips[data-group="${g}"]`).innerHTML = TRAD[g].map(([k, l]) => `<button class="chip ${sel.includes(k) ? "on" : ""}" data-k="${k}">${l}</button>`).join("");
    });
  }
  $$(".chips[data-group]").forEach((box) => box.addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    const g = box.dataset.group, k = c.dataset.k;
    let sel = (S.trad[g] || []).filter((x) => x !== "all");
    if (k === "all") sel = ["all"];
    else if (sel.includes(k)) sel = sel.filter((x) => x !== k); else sel.push(k);
    if (!sel.length) sel = ["all"];
    S.trad[g] = sel;
    // drop picks that no longer fit
    if (S.picks[g]) S.picks[g] = S.picks[g].filter((id) => BYID[id] && allowed(BYID[id]));
    S.photoIds = null; save(); renderTrad();
  }));

  // ---------------- choose photos ----------------
  function renderPick() {
    const a = S.areas[pickIdx]; if (!a) return go("s-feel");
    $("#pick-kicker").textContent = `Choose your photos · ${pickIdx + 1} of ${S.areas.length}`;
    $("#pick-title").textContent = AREAS[a].label;
    const picks = S.picks[a] || [];
    const ups = uploadsFor(a);
    const bank = BANK.filter((b) => b.a === a && allowed(b));
    let h = "";
    if (ups.length < MAX_UP) h += `<button class="ph up" data-up="${a}"><b>+</b>Upload my own</button>`;
    h += ups.map((u) => `<div class="ph"><img src="${u.url}" alt=""><span class="mine">Mine</span><button class="x" data-del="${u.id}" aria-label="Remove">×</button></div>`).join("");
    h += bank.map((b) => `<button class="ph ${picks.includes(b.id) ? "on" : ""}" data-id="${b.id}"><img src="bank/thumb/${b.id}.webp" alt="" loading="lazy"></button>`).join("");
    $("#pick-grid").innerHTML = h;
    const n = picks.length + ups.length;
    $("#pick-count").textContent = n ? `${n} chosen` : "We'll choose for you";
    $("#pick-next").textContent = pickIdx < S.areas.length - 1 ? `Next: ${AREAS[S.areas[pickIdx + 1]].label}` : "Next";
  }
  $("#pick-grid").addEventListener("click", async (e) => {
    const a = S.areas[pickIdx];
    const del = e.target.closest("[data-del]");
    if (del) { await removeUpload(del.dataset.del); return renderPick(); }
    if (e.target.closest("[data-up]")) return askUpload(a, () => renderPick());
    const t = e.target.closest(".ph[data-id]"); if (!t) return;
    const id = t.dataset.id; const l = S.picks[a] || (S.picks[a] = []);
    const i = l.indexOf(id);
    if (i >= 0) l.splice(i, 1); else { if (l.length >= MAX_PICKS) return toast(`Up to ${MAX_PICKS} per area. The rest we'll choose to match.`); l.push(id); }
    S.photoIds = null; save();
    t.classList.toggle("on", i < 0);
    const n = l.length + uploadsFor(a).length;
    $("#pick-count").textContent = n ? `${n} chosen` : "We'll choose for you";
  });
  $("#pick-auto").addEventListener("click", () => { S.picks[S.areas[pickIdx]] = []; S.photoIds = null; save(); advancePick(); });
  $("#pick-next").addEventListener("click", advancePick);
  function advancePick() {
    if (pickIdx < S.areas.length - 1) { pickIdx++; renderPick(); window.scrollTo(0, 0); }
    else go("s-feel");
  }

  // uploads
  let uploadCb = null, uploadArea = null;
  function askUpload(area, cb) {
    if (uploadsFor(area).length >= MAX_UP) return toast(`You can add up to ${MAX_UP} of your own photos here.`);
    uploadArea = area; uploadCb = cb; const inp = $("#upload"); inp.value = ""; inp.click();
  }
  $("#upload").addEventListener("change", async (e) => {
    const files = Array.from(e.target.files || []);
    const room = MAX_UP - uploadsFor(uploadArea).length;
    const added = [];
    for (const f of files.slice(0, room)) {
      try { added.push(await ingest(f, uploadArea)); } catch (err) { toast("That photo didn't open. Try a JPEG or PNG, or take a screenshot of it."); }
    }
    if (files.length > room) toast(`Only ${MAX_UP} of your own per area, so we kept the first ${room}.`);
    S.photoIds = null; save();
    if (uploadCb) uploadCb(added);
  });
  async function ingest(file, area) {
    const url = URL.createObjectURL(file);
    const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const sc = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight));
    const cv = document.createElement("canvas"); cv.width = Math.round(im.naturalWidth * sc); cv.height = Math.round(im.naturalHeight * sc);
    cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
    URL.revokeObjectURL(url);
    const blob = await new Promise((r) => cv.toBlob(r, "image/jpeg", 0.88));
    const rec = { id: "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), area, blob, w: cv.width, h: cv.height, t: Date.now() };
    try { await db.put(rec); } catch (e) {}
    UP[rec.id] = Object.assign({}, rec, { url: URL.createObjectURL(blob) });
    return UP[rec.id];
  }
  async function removeUpload(id) {
    try { await db.del(id); } catch (e) {}
    if (UP[id]) URL.revokeObjectURL(UP[id].url);
    delete UP[id]; S.photoIds = null; save();
  }

  // ---------------- feelings and affirmations ----------------
  // chips in two groups: words for her themes, then more words
  function chipGroups(themed, general, own, chosen) {
    const first = own.concat(themed.filter((x) => !own.includes(x)));
    const rest = general.filter((x) => !first.includes(x)).concat(chosen.filter((x) => !first.includes(x) && !general.includes(x)));
    const chip = (w) => `<button class="chip ${chosen.includes(w) ? "on" : ""}" data-w="${esc(w)}">${esc(w)}</button>`;
    return `<p class="group">For your themes</p>` + first.map(chip).join("") + `<p class="group">More</p>` + rest.map(chip).join("");
  }
  function renderFeel() {
    if (!S.feelings) S.feelings = themeList("f").slice(0, 4);
    $("#feel-chips").innerHTML = chipGroups(themeList("f"), window.FEELINGS, S.ownFeel || [], S.feelings);
    $("#feel-next").disabled = false;
  }
  $("#feel-chips").addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return; const w = c.dataset.w; const i = S.feelings.indexOf(w);
    if (i >= 0) S.feelings.splice(i, 1); else { if (S.feelings.length >= 6) return toast("Up to 6 words. Tap one to remove it first."); S.feelings.push(w); }
    save(); renderFeel();
  });
  $("#feel-add").addEventListener("click", () => {
    const v = $("#feel-own").value.trim(); if (!v) return;
    S.ownFeel = [v].concat((S.ownFeel || []).filter((x) => x !== v)); if (!S.feelings.includes(v)) { if (S.feelings.length >= 6) S.feelings.pop(); S.feelings.unshift(v); }
    $("#feel-own").value = ""; save(); renderFeel();
  });
  function renderAff() {
    if (!S.affirmations) S.affirmations = themeList("a").slice(0, 2);
    $("#aff-chips").innerHTML = chipGroups(themeList("a"), window.AFFIRMATIONS, S.ownAff || [], S.affirmations);
    $("#aff-next").disabled = false;
  }
  $("#aff-chips").addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return; const w = c.dataset.w; const i = S.affirmations.indexOf(w);
    if (i >= 0) S.affirmations.splice(i, 1); else { if (S.affirmations.length >= 4) return toast("Up to 4. Tap one to remove it first."); S.affirmations.push(w); }
    save(); renderAff();
  });
  $("#aff-add").addEventListener("click", () => {
    const v = $("#aff-own").value.trim(); if (!v) return;
    S.ownAff = [v].concat((S.ownAff || []).filter((x) => x !== v)); if (!S.affirmations.includes(v)) { if (S.affirmations.length >= 4) S.affirmations.pop(); S.affirmations.unshift(v); }
    $("#aff-own").value = ""; save(); renderAff();
  });
  ["feel-own", "aff-own"].forEach((id) => $("#" + id).addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $(id === "feel-own" ? "#feel-add" : "#aff-add").click(); } }));
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]); }

  // ---------------- looks ----------------
  async function renderLooks() {
    const box = $("#look-tiles");
    const keys = Object.keys(LOOKS);
    box.innerHTML = keys.map((k) => `<button class="look" data-k="${k}"><canvas width="10" height="20"></canvas><b>${LOOKS[k].name}</b><small>${LOOKS[k].feel}</small></button>`).join("");
    const cvs = $$("#look-tiles canvas");
    cvs.forEach((cv) => { cv.style.aspectRatio = `1 / ${RATIO}`; });
    for (let i = 0; i < keys.length; i++) {
      if (cur !== "s-look") return;
      const k = keys[i];
      try { await renderTo(cvs[i], { W: 400, H: Math.round(400 * RATIO), look: k, pal: 0, comp: LOOKS[k].comps[0], seed: S.seed, q: "thumb" }); } catch (e) { console.warn(e); }
      await idle();
    }
  }
  $("#look-tiles").addEventListener("click", (e) => { const b = e.target.closest(".look"); if (b) chooseLook(b.dataset.k); });
  $("#look-unsure").addEventListener("click", () => chooseLook("harvest"));
  function chooseLook(k) {
    if (fromRefine) {
      pushUndo(); S.look = k; if (!LOOKS[k].comps.includes(S.comp)) S.comp = LOOKS[k].comps[0];
      S.pal = 0; save(); fromRefine = false; hist.pop(); return go("s-refine", false);
    }
    S.look = k; save(); go("s-boards");
  }

  // ---------------- three boards ----------------
  let choices = [];
  async function renderBoards() {
    const L = LOOKS[S.look];
    const rng = E.R(S.seed ^ 0x5bd1e995);
    const comps = [], ws = L.compWeights.slice(), cs = L.comps.slice();
    while (comps.length < 3 && cs.length) { const c = rng.weighted(cs, ws); const j = cs.indexOf(c); comps.push(c); cs.splice(j, 1); ws.splice(j, 1); }
    while (comps.length < 3) comps.push(L.comps[comps.length % L.comps.length]);
    choices = comps.map((c, i) => ({ comp: c, seed: (S.seed + i * 7919) | 0, pal: i % L.palettes.length }));
    $("#board-choices").innerHTML = choices.map((c, i) => `<button data-i="${i}"><canvas width="10" height="20"></canvas><small>${E.COMP_NAMES[c.comp] || ""}</small></button>`).join("");
    const cvs = $$("#board-choices canvas");
    cvs.forEach((cv) => { cv.style.aspectRatio = `1 / ${RATIO}`; });
    for (let i = 0; i < choices.length; i++) {
      if (cur !== "s-boards") return;
      const c = choices[i];
      try { await renderTo(cvs[i], { W: 480, H: Math.round(480 * RATIO), look: S.look, pal: c.pal, comp: c.comp, seed: c.seed, q: "thumb" }); } catch (e) { console.warn(e); }
      await idle();
    }
  }
  $("#board-choices").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]"); if (!b) return;
    const c = choices[+b.dataset.i]; Object.assign(S, { comp: c.comp, seed: c.seed, pal: c.pal }); save();
    undo.length = 0; go("s-refine");
  });

  // ---------------- refine ----------------
  const undo = [];
  const snap = () => JSON.stringify({ look: S.look, pal: S.pal, comp: S.comp, seed: S.seed, photoSeed: S.photoSeed, textSeed: S.textSeed, photoIds: S.photoIds, background: S.background });
  function pushUndo() { undo.push(snap()); if (undo.length > 30) undo.shift(); }
  let lastSlots = [], renderToken = 0;
  async function renderRefine() {
    const cv = $("#refine-canvas"); const t = ++renderToken;
    $("#refine-busy").hidden = false;
    const W = 760, H = Math.round(760 * RATIO);
    try {
      const off = document.createElement("canvas");
      const res = await renderTo(off, { W, H, look: S.look, pal: S.pal, comp: S.comp, seed: S.seed, q: "full" });
      if (t !== renderToken) return;
      cv.width = W; cv.height = H; cv.getContext("2d").drawImage(off, 0, 0);
      lastSlots = res.slots;
    } catch (e) { console.warn(e); toast("Something went wrong drawing your board. Try Shuffle photos."); }
    if (t === renderToken) $("#refine-busy").hidden = true;
  }
  $(".controls").addEventListener("click", (e) => {
    const b = e.target.closest(".ctl"); if (!b) return;
    const act = b.dataset.act, L = LOOKS[S.look];
    if (act === "undo") { const s = undo.pop(); if (!s) return toast("Nothing to undo yet."); Object.assign(S, JSON.parse(s)); save(); return renderRefine(); }
    if (act === "look") { fromRefine = true; return go("s-look"); }
    if (act === "background") return openBackgrounds();
    pushUndo();
    if (act === "photos") { S.photoSeed = rand(); S.photoIds = buildPhotoIds(); }
    if (act === "colours") S.pal = (S.pal + 1) % L.palettes.length;
    if (act === "words") S.textSeed = rand();
    if (act === "layout") { const i = L.comps.indexOf(S.comp); S.comp = L.comps[(i + 1) % L.comps.length]; S.seed = rand(); }
    save(); renderRefine();
  });

  // tap a photo to swap it
  let swapIdx = -1;
  $("#refine-canvas").addEventListener("click", (e) => {
    const cv = e.currentTarget, r = cv.getBoundingClientRect();
    const x = (e.clientX - r.left) * cv.width / r.width, y = (e.clientY - r.top) * cv.height / r.height;
    let hit = null;
    for (let i = lastSlots.length - 1; i >= 0; i--) { const s = lastSlots[i], h = s.hit; if (h && x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { hit = s; break; } }
    if (!hit || !hit.photo) return;
    swapIdx = S.photoIds.indexOf(hit.photo.id);
    if (swapIdx < 0) return;
    openSwap(hit.photo);
  });
  // backgrounds: colours and textures, or one of her photos softly blurred
  let sheetMode = "swap";
  function openBackgrounds() {
    sheetMode = "bg"; $("#sheet-title").textContent = "Background";
    const L = LOOKS[S.look]; const cur = (S.background || {}).key || "look";
    $("#sheet-grid").innerHTML = window.BACKGROUNDS.map((b) => {
      const col = b.key === "look" ? L.palettes[S.pal % L.palettes.length].bg : b.color;
      const inner = b.key === "photo" ? `<img src="${UP[photoIds()[0]] ? UP[photoIds()[0]].url : `bank/thumb/${photoIds()[0]}.webp`}" alt="" style="filter:blur(4px)">` : `<span class="sw tex-${b.texture || "paper"}" style="background-color:${col}"></span>`;
      return `<button class="ph bgopt ${cur === b.key ? "on" : ""}" data-bg="${b.key}">${inner}<span class="bgname">${b.name}</span></button>`;
    }).join("");
    $("#sheet").hidden = false;
  }
  function openBgPhotos() {
    sheetMode = "bgphoto"; $("#sheet-title").textContent = "Choose the photo for your background";
    $("#sheet-grid").innerHTML = photoIds().map((id) => `<button class="ph" data-bgid="${id}"><img src="${UP[id] ? UP[id].url : `bank/thumb/${id}.webp`}" alt="" loading="lazy"></button>`).join("");
  }
  function openSwap(ph) {
    sheetMode = "swap";
    const a = ph.area; const label = AREAS[a] ? AREAS[a].label : "Photos";
    $("#sheet-title").textContent = `Swap this photo · ${label}`;
    const inUse = new Set(S.photoIds);
    const opts = BANK.filter((b) => b.a === a && allowed(b) && !inUse.has(b.id) && (ph.small || !b.sm));
    const ups = uploadsFor(a).filter((u) => !inUse.has(u.id));
    let h = "";
    if (uploadsFor(a).length < MAX_UP) h += `<button class="ph up" data-up="${a}"><b>+</b>Upload my own</button>`;
    h += ups.map((u) => `<button class="ph" data-id="${u.id}"><img src="${u.url}" alt=""><span class="mine">Mine</span></button>`).join("");
    h += opts.map((b) => `<button class="ph" data-id="${b.id}"><img src="bank/thumb/${b.id}.webp" alt="" loading="lazy"></button>`).join("");
    $("#sheet-grid").innerHTML = h;
    $("#sheet").hidden = false;
  }
  function closeSheet() { $("#sheet").hidden = true; }
  $("#sheet-close").addEventListener("click", closeSheet);
  $("#sheet").addEventListener("click", (e) => { if (e.target.id === "sheet") closeSheet(); });
  $("#sheet-grid").addEventListener("click", (e) => {
    const bgb = e.target.closest("[data-bg]");
    if (bgb) { if (bgb.dataset.bg === "photo") return openBgPhotos(); pushUndo(); S.background = { key: bgb.dataset.bg }; save(); closeSheet(); return renderRefine(); }
    const bgp = e.target.closest("[data-bgid]");
    if (bgp) { pushUndo(); S.background = { key: "photo", photoId: bgp.dataset.bgid }; save(); closeSheet(); return renderRefine(); }
    const up = e.target.closest("[data-up]");
    if (up) {
      const keep = swapIdx;
      return askUpload(up.dataset.up, (added) => { if (added && added[0]) { swapIdx = keep; doSwap(added[0].id); } });
    }
    const b = e.target.closest(".ph[data-id]"); if (b) doSwap(b.dataset.id);
  });
  function doSwap(id) {
    if (swapIdx < 0) return;
    pushUndo();
    const ids = photoIds().slice(); ids[swapIdx] = id; S.photoIds = ids;
    // remember it as her pick so a shuffle keeps it
    const a = UP[id] ? UP[id].area : BYID[id] && BYID[id].a;
    if (a && !UP[id]) { const l = S.picks[a] || (S.picks[a] = []); if (!l.includes(id)) l.push(id); }
    save(); closeSheet(); renderRefine();
  }

  // ---------------- save ----------------
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform));
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform));
  async function saveBoard(kind) {
    const btn = kind === "laptop" ? $("#save-laptop") : $("#save-phone");
    const label = btn.textContent; btn.disabled = true; btn.textContent = "Getting it ready…";
    try {
      const size = kind === "laptop" ? (C.LAPTOP || { W: 2560, H: 1600 }) : deviceSize();
      const cv = document.createElement("canvas");
      await renderTo(cv, { W: size.W, H: size.H, look: S.look, pal: S.pal, comp: S.comp, seed: S.seed, q: "full" });
      const blob = await new Promise((r) => cv.toBlob(r, "image/png"));
      const safe = (S.word || "board").trim().replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase() || "board";
      const fname = `by-design-2027-${safe}${kind === "laptop" ? "-laptop" : ""}.png`;
      const file = new File([blob], fname, { type: "image/png" });
      if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: "My By Design board" }); return; }
        catch (e) { if (e && e.name === "AbortError") return; }
      }
      const url = URL.createObjectURL(blob);
      $("#saved-img").src = url; $("#saved-dl").href = url; $("#saved-dl").download = fname;
      $("#saved").hidden = false;
      if (!isMobile) $("#saved-dl").click();
    } catch (e) { console.warn(e); toast("We couldn't make the image. Close other apps and try again."); }
    finally { btn.disabled = false; btn.textContent = label; }
  }
  $("#save-phone").addEventListener("click", () => saveBoard("phone"));
  $("#save-laptop").addEventListener("click", () => saveBoard("laptop"));
  $("#saved-close").addEventListener("click", () => { $("#saved").hidden = true; });
  $("#to-save").addEventListener("click", () => go("s-save"));

  // ---------------- opt-in ----------------
  $("#optin").addEventListener("change", (e) => { $("#email-field").hidden = !e.target.checked; if (e.target.checked) $("#f-email").focus(); });
  $("#done").addEventListener("click", () => {
    if ($("#optin").checked) {
      const email = $("#f-email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { const f = $("#email-field"); f.classList.remove("err"); void f.offsetWidth; f.classList.add("err"); return; }
      queueOptin({ name: S.name.trim(), email, consent: true, ts: new Date().toISOString(), source: "By Design · Becoming HER 2026" });
    }
    $("#done").hidden = true; $("#thanks").hidden = false;
  });
  function queueOptin(rec) {
    let q = []; try { q = JSON.parse(localStorage.getItem(QKEY)) || []; } catch (e) {}
    q.push(rec); localStorage.setItem(QKEY, JSON.stringify(q)); flushOptins();
  }
  async function flushOptins() {
    if (!C.OPTIN_URL || !navigator.onLine) return;
    let q = []; try { q = JSON.parse(localStorage.getItem(QKEY)) || []; } catch (e) {}
    const left = [];
    for (const r of q) {
      try {
        // on herdacity.com the site's own /api/subscribe takes JSON; elsewhere a Google Apps Script URL takes plain text
        if (C.OPTIN_URL.startsWith("/")) { const res = await fetch(C.OPTIN_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: r.email, firstName: r.name, source: "bydesign" }) }); if (!res.ok) throw new Error("optin " + res.status); }
        else await fetch(C.OPTIN_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(r) });
      } catch (e) { left.push(r); }
    }
    localStorage.setItem(QKEY, JSON.stringify(left));
  }
  window.addEventListener("online", flushOptins);

  // ---------------- small helpers ----------------
  function confirmFresh() { const b = $("#fresh"); if (b.dataset.sure) return true; b.dataset.sure = "1"; b.textContent = "Tap again to clear everything and start over"; return false; }
  const idle = () => new Promise((r) => setTimeout(r, 16));
  let toastT;
  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.style.cssText = "position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:#2B2D20;color:#fff;padding:12px 18px;border-radius:12px;font:500 14px Inter,sans-serif;z-index:90;max-width:88vw;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.25)"; document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3200);
  }

  const ENTER = {
    "s-word": drawWordPreview,
    "s-plan": () => { if (!S.if.trim() && S.obstacle.trim()) { S.if = S.obstacle.trim().replace(/[.!]$/, ""); $("#f-if").value = S.if; $("#f-if").dispatchEvent(new Event("input")); } },
    "s-areas": renderAreas,
    "s-trad": renderTrad,
    "s-pick": renderPick,
    "s-look": renderLooks,
    "s-boards": renderBoards,
    "s-refine": renderRefine,
    "s-feel": renderFeel,
    "s-affirm": renderAff,
    "s-save": () => { (isIOS ? $("#how-ios") : $("#how-android")).open = isMobile; },
  };

  // in-app browsers (Instagram, Facebook, TikTok...) can't save images
  if (/Instagram|FBAN|FBAV|FB_IAB|Line\/|Snapchat|TikTok|musical_ly|BytedanceWebview/i.test(navigator.userAgent)) {
    $("#inapp").hidden = false;
    $("#copylink").addEventListener("click", () => { navigator.clipboard && navigator.clipboard.writeText(location.href).then(() => toast("Link copied. Paste it into Chrome or Safari.")); });
  }

  // ---------------- start ----------------
  async function start() {
    try { BANK = await (await fetch("bank/bank.json")).json(); } catch (e) { toast("Couldn't load the photos. Check your connection and refresh."); }
    BANK.forEach((b) => { BYID[b.id] = b; });
    try { (await db.all() || []).forEach((r) => { UP[r.id] = Object.assign({}, r, { url: URL.createObjectURL(r.blob) }); }); } catch (e) {}
    if (S.photoIds) S.photoIds = S.photoIds.filter((id) => BYID[id] || UP[id]);
    go("s-welcome", false);
    if (S.word || S.wish || S.areas.length) { $("#fresh").hidden = false; $("#s-welcome .next").textContent = "Continue"; }
    $("#fresh").addEventListener("click", async () => {
      if (!confirmFresh()) return;
      for (const id of Object.keys(UP)) await removeUpload(id);
      localStorage.removeItem(KEY); location.reload();
    });
    flushOptins();
  }
  start();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
  window.__bd = { S: () => S, go, render: renderTo }; // for testing
})();
