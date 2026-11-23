/* By Design Board engine, version 2.
   Modelled on the Harvest 26 boards: packed photos, words and affirmations each in their own style,
   line art and leaves in the spaces, and nothing ever covering a face. */
(function () {
  "use strict";

  // ---------- seeded randomness ----------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function R(seed) {
    const r = mulberry32(seed);
    const o = () => r();
    o.range = (a, b) => a + (b - a) * r();
    o.int = (a, b) => Math.floor(a + (b - a + 1) * r());
    o.pick = (arr) => arr[Math.floor(r() * arr.length)];
    o.chance = (p) => r() < p;
    o.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    o.weighted = (items, weights) => { const s = weights.reduce((x, y) => x + y, 0); let t = r() * s; for (let i = 0; i < items.length; i++) { t -= weights[i]; if (t <= 0) return items[i]; } return items[items.length - 1]; };
    return o;
  }

  // ---------- texture ----------
  let grainC = null;
  function grainPattern(ctx) {
    if (!grainC) {
      grainC = document.createElement("canvas"); grainC.width = grainC.height = 180;
      const g = grainC.getContext("2d"); const d = g.createImageData(180, 180); const r = mulberry32(7);
      for (let i = 0; i < d.data.length; i += 4) { const v = 120 + r() * 135; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
      g.putImageData(d, 0, 0);
    }
    return ctx.createPattern(grainC, "repeat");
  }
  function grain(ctx, x, y, w, h, a) { ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = grainPattern(ctx); ctx.fillRect(x, y, w, h); ctx.restore(); }

  // ---------- colour ----------
  function rgb(hex) { const h = hex.replace("#", ""); const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function hexA(hex, a) { const c = rgb(hex); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }
  function lum(hex) { return rgb(hex).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0); }
  function contrast(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function textOn(bg, pal) { return contrast(bg, pal.ink) >= contrast(bg, pal.light) ? pal.ink : pal.light; }
  const isDark = (hex) => lum(hex) < 0.18;

  // ---------- text ----------
  // Fonts that lack Hausa hooked letters (or draw them without hooks), and fonts with no accents at all.
  const HOOK = /[\u0181\u018A\u0198\u01B3\u0253\u0257\u0199\u01B4]/;
  const MARKS = /[\u0300-\u036F\u1E00-\u1EFF]/; // tone marks and dots below: Yoruba and Igbo
  // only these faces stack Yoruba marks cleanly; the others hand over to a close cousin
  const MARKS_OK = new Set(["Noto Serif Display", "EB Garamond", "Montserrat", "Inter", "Anton", "Great Vibes", "Pinyon Script"]);
  const HOOK_OK = new Set(["Noto Serif Display", "EB Garamond", "Montserrat", "Inter", "Anton"]);
  const COUSIN = { "Playfair Display": "Noto Serif Display", "Cormorant Garamond": "EB Garamond", "Old Standard TT": "EB Garamond", "Libre Baskerville": "EB Garamond", Oswald: "Anton", "League Gothic": "Anton", "Special Elite": "Montserrat", "Courier Prime": "Montserrat", Caveat: "Noto Serif Display", "Great Vibes": "Noto Serif Display", "Pinyon Script": "Noto Serif Display" };
  function famFor(text, f) {
    if (HOOK.test(text) && !HOOK_OK.has(f)) return COUSIN[f] || "Noto Serif Display";
    if (MARKS.test(text.normalize("NFD")) && !MARKS_OK.has(f)) return COUSIN[f] || "Noto Serif Display";
    return f;
  }
  function font(st, wt, size, fam) { return `${st || "normal"} ${wt || 400} ${Math.max(1, Math.round(size))}px "${fam}"`; }
  const graphemes = (s) => (typeof Intl !== "undefined" && Intl.Segmenter) ? Array.from(new Intl.Segmenter().segment(s), x => x.segment) : (s.match(/\P{M}\p{M}*/gu) || []);
  function measure(ctx, s, tr) { const w = ctx.measureText(s).width; return tr ? w + Math.max(0, graphemes(s).length - 1) * tr : w; }
  function fillT(ctx, s, x, y, tr, align) {
    if (!tr) { ctx.textAlign = align || "left"; ctx.fillText(s, x, y); return; }
    const w = measure(ctx, s, tr); let cx = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
    ctx.textAlign = "left"; for (const g of graphemes(s)) { ctx.fillText(g, cx, y); cx += ctx.measureText(g).width + tr; }
  }
  function wrap(ctx, text, maxW, tr) {
    const words = String(text).split(/\s+/).filter(Boolean); const lines = []; let line = "";
    for (const w of words) { const t = line ? line + " " + w : w; if (measure(ctx, t, tr) <= maxW || !line) line = t; else { lines.push(line); line = w; } }
    if (line) lines.push(line); return lines;
  }
  // shrink until the text fits the box on whole words; never cut a word
  function fit(ctx, text, w, h, o) {
    for (let size = o.max; size >= o.min; size *= 0.95) {
      ctx.font = font(o.st, o.wt, size, o.fam); const tr = (o.track || 0) * size;
      const lines = o.single ? [text] : wrap(ctx, text, w, tr); const lh = size * (o.lh || 1.2);
      const widest = Math.max(...lines.map(l => measure(ctx, l, tr)));
      if (lines.length * lh <= h && widest <= w && (!o.maxLines || lines.length <= o.maxLines)) return { size, lines, lh, tr };
    }
    ctx.font = font(o.st, o.wt, o.min, o.fam); const tr = (o.track || 0) * o.min;
    return { size: o.min, lines: o.single ? [text] : wrap(ctx, text, w, tr), lh: o.min * (o.lh || 1.2), tr };
  }
  function drawFit(ctx, f, x, y, w, h, align, color, o) {
    ctx.fillStyle = color; ctx.textBaseline = "alphabetic";
    const total = f.lines.length * f.lh; let yy = y + (h - total) / 2 + f.lh * (o && o.base || 0.78);
    const xx = align === "left" ? x : align === "right" ? x + w : x + w / 2;
    f.lines.forEach((l, i) => {
      if (o && o.emph && i === f.lines.length - 1) {
        // last word in capitals, for emphasis
        const parts = l.split(" "); const last = parts.pop(); const head = parts.length ? parts.join(" ") + " " : "";
        const full = head + last.toLocaleUpperCase(); fillT(ctx, full, xx, yy, f.tr, align);
      } else fillT(ctx, l, xx, yy, f.tr, align);
      yy += f.lh;
    });
  }

  // ---------- geometry ----------
  const inter = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  const grow = (r, k) => ({ x: r.x - k, y: r.y - k, w: r.w + 2 * k, h: r.h + 2 * k });
  function rotAABB(r, cx, cy, rot) {
    if (!rot) return r; const c = Math.cos(rot), s = Math.sin(rot);
    const pts = [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h]].map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); const x0 = Math.min(...xs), y0 = Math.min(...ys);
    return { x: x0, y: y0, w: Math.max(...xs) - x0, h: Math.max(...ys) - y0 };
  }

  // ---------- shapes ----------
  function shadow(ctx, u, k) { ctx.shadowColor = `rgba(0,0,0,${0.24 * (k || 1)})`; ctx.shadowBlur = u * 1.4; ctx.shadowOffsetX = u * 0.2; ctx.shadowOffsetY = u * 0.45; }
  function noShadow(ctx) { ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }
  function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function torn(ctx, x, y, w, h, rng, amp, sides) {
    sides = sides || "tblr"; const st = Math.max(6, Math.round(w / (amp * 2.2))), sv = Math.max(4, Math.round(h / (amp * 2.2)));
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let i = 1; i <= st; i++) ctx.lineTo(x + w * i / st, y + (sides.includes("t") ? rng.range(-amp, amp) * 0.5 + amp * 0.5 : 0));
    for (let i = 1; i <= sv; i++) ctx.lineTo(x + w - (sides.includes("r") ? rng.range(0, amp) : 0), y + h * i / sv);
    for (let i = st - 1; i >= 0; i--) ctx.lineTo(x + w * i / st, y + h - (sides.includes("b") ? rng.range(-amp, amp) * 0.5 + amp * 0.5 : 0));
    for (let i = sv - 1; i >= 1; i--) ctx.lineTo(x + (sides.includes("l") ? rng.range(0, amp) : 0), y + h * i / sv);
    ctx.closePath();
  }
  function jag(ctx, x, y, w, h, rng, amp) { // masking tape: torn short ends
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y);
    const n = 6; for (let i = 1; i <= n; i++) ctx.lineTo(x + w + (i % 2 ? amp : -amp * 0.3) * rng.range(0.5, 1), y + h * i / n);
    ctx.lineTo(x, y + h); for (let i = n - 1; i >= 1; i--) ctx.lineTo(x + (i % 2 ? -amp : amp * 0.3) * rng.range(0.5, 1), y + h * i / n);
    ctx.closePath();
  }

  // ---------- photos ----------
  // Crop that keeps faces in, with the face about a third of the way down.
  function coverMap(img, w, h, ph) {
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    const s = Math.max(w / iw, h / ih), sw = w / s, sh = h / s;
    const F = ph.faces || [];
    let cx, cy;
    if (F.length) {
      let x0 = 1, y0 = 1, x1 = 0, y1 = 0; F.forEach(f => { x0 = Math.min(x0, f[0]); y0 = Math.min(y0, f[1]); x1 = Math.max(x1, f[0] + f[2]); y1 = Math.max(y1, f[1] + f[3]); });
      if ((x1 - x0) * iw > sw * 0.92 || (y1 - y0) * ih > sh * 0.7) { const L = F.slice().sort((a, b) => b[2] * b[3] - a[2] * a[3])[0]; x0 = L[0]; y0 = L[1]; x1 = L[0] + L[2]; y1 = L[1] + L[3]; }
      cx = (x0 + x1) / 2 * iw; cy = (y0 + y1) / 2 * ih + sh * 0.14;
    } else { cx = (ph.focal ? ph.focal[0] : 0.5) * iw; cy = (ph.focal ? ph.focal[1] : 0.45) * ih; }
    let sx = Math.max(0, Math.min(iw - sw, cx - sw / 2)), sy = Math.max(0, Math.min(ih - sh, cy - sh / 2));
    return { sx, sy, sw, sh, s, iw, ih };
  }
  function grade(ctx, x, y, w, h, g, bw) {
    ctx.save();
    const lay = (op, a, c) => { if (!a) return; ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    if (bw) lay("saturation", 1, "#808080");
    if (!bw) { lay("soft-light", g.warm, "#c98a4b"); lay("soft-light", g.rosy, "#e48aa0"); lay("soft-light", g.green, "#7d8f4e"); lay("saturation", g.desat, "#808080"); lay("overlay", (g.sat || 0) * 0.6, "#ff7a3c"); }
    if (g.contrast > 0) lay("overlay", g.contrast, "#7a7a7a");
    lay("multiply", g.dark, "#3a2a24"); lay("screen", g.fade, "#f3e6d4");
    ctx.restore();
  }
  // draws one photo tile; returns its face boxes in board coordinates
  function photoTile(ctx, t, ph, look, pal, u, rng) {
    const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t.rot || 0);
    const X = -t.w / 2, Y = -t.h / 2; let ix = X, iy = Y, iw = t.w, ih = t.h;
    if (t.frame === "white" || t.frame === "polaroid") {
      const b = Math.min(t.w, t.h) * (t.frame === "polaroid" ? 0.05 : 0.04); const bb = t.frame === "polaroid" ? b * 3 : b;
      shadow(ctx, u, 0.9); ctx.fillStyle = "#fbf9f5"; ctx.fillRect(X, Y, t.w, t.h); noShadow(ctx);
      grain(ctx, X, Y, t.w, t.h, 0.04);
      ix = X + b; iy = Y + b; iw = t.w - 2 * b; ih = t.h - b - bb;
    } else if (t.shadow) { shadow(ctx, u, 0.7); ctx.fillStyle = pal.dark; ctx.fillRect(X, Y, t.w, t.h); noShadow(ctx); }
    let faces = [];
    if (ph && ph.img) {
      const m = coverMap(ph.img, iw, ih, ph);
      ctx.save(); ctx.beginPath(); ctx.rect(ix, iy, iw, ih); ctx.clip();
      ctx.drawImage(ph.img, m.sx, m.sy, m.sw, m.sh, ix, iy, iw, ih);
      grade(ctx, ix, iy, iw, ih, look.grade, ph.bw); ctx.restore();
      // where no face was found, protect the upper middle of the photo, where a head usually is
      const fl = (ph.faces && ph.faces.length) ? ph.faces : null;
      faces = (fl || [null]).map(f => {
        if (!f) { const r = { x: ix + iw * 0.32, y: iy + ih * 0.14, w: iw * 0.36, h: ih * 0.36 }; return rotAABB({ x: r.x + cx, y: r.y + cy, w: r.w, h: r.h }, cx, cy, t.rot || 0); }
        const fx = (f[0] * m.iw - m.sx) * m.s + ix, fy = (f[1] * m.ih - m.sy) * m.s + iy, fw = f[2] * m.iw * m.s, fh = f[3] * m.ih * m.s;
        // a head is bigger than the detected face: add hair above and a little around
        const r = { x: fx - fw * 0.3, y: fy - fh * 0.55, w: fw * 1.6, h: fh * 1.75 };
        const x0 = Math.max(ix, r.x), y0 = Math.max(iy, r.y), x1 = Math.min(ix + iw, r.x + r.w), y1 = Math.min(iy + ih, r.y + r.h);
        return x1 > x0 && y1 > y0 ? rotAABB({ x: x0 + cx, y: y0 + cy, w: x1 - x0, h: y1 - y0 }, cx, cy, t.rot || 0) : null;
      }).filter(Boolean);
    } else { ctx.fillStyle = pal.taupe; ctx.fillRect(ix, iy, iw, ih); }
    ctx.restore();
    return faces;
  }
  function pin(ctx, x, y, u, color) {
    ctx.save(); shadow(ctx, u * 0.6, 1.2); ctx.fillStyle = color || "#f4f1ec"; ctx.beginPath(); ctx.arc(x, y, u * 1.5, 0, 6.3); ctx.fill(); noShadow(ctx);
    const g = ctx.createRadialGradient(x - u * 0.5, y - u * 0.5, u * 0.1, x, y, u * 1.5); g.addColorStop(0, "rgba(255,255,255,0.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, u * 1.5, 0, 6.3); ctx.fill(); ctx.restore();
  }
  function tapePiece(ctx, cx, cy, w, h, rot, color, rng) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.globalAlpha = 0.78; ctx.fillStyle = color;
    jag(ctx, -w / 2, -h / 2, w, h, rng, h * 0.12); ctx.fill(); ctx.globalAlpha = 0.25; grain(ctx, -w / 2, -h / 2, w, h, 0.25); ctx.restore();
  }

  // ---------- line art ----------
  const pathCache = {};
  function icon(ctx, name, x, y, size, rot, color, alpha) {
    const A = window.ART; if (!A || !A.icons[name]) return;
    if (!pathCache[name]) pathCache[name] = A.icons[name].map(d => new Path2D(d));
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); const k = size / A.size; ctx.scale(k, k); ctx.translate(-A.size / 2, -A.size / 2);
    ctx.globalAlpha = alpha === undefined ? 1 : alpha; ctx.fillStyle = color; pathCache[name].forEach(p => ctx.fill(p)); ctx.restore();
  }
  // leafy branch, like the green sprigs on the laptop board
  function branch(ctx, x, y, len, ang, pal, rng, u, kind) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    const bend = rng.range(-0.22, 0.22) * len;
    const pt = (t) => [bend * 2 * t * (1 - t) * 1.2, -len * t];
    ctx.strokeStyle = hexA(pal.line, 0.7); ctx.lineWidth = u * 0.22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0, 0); for (let t = 0.05; t <= 1.001; t += 0.05) { const p = pt(t); ctx.lineTo(p[0], p[1]); } ctx.stroke();
    const n = rng.int(7, 11);
    for (let i = 1; i <= n; i++) {
      const t = 0.12 + 0.86 * i / n; const [px, py] = pt(t); const side = i % 2 ? 1 : -1;
      const ll = len * (kind === "round" ? 0.11 : 0.17) * (1.05 - t * 0.45) * rng.range(0.85, 1.15);
      const a = side * rng.range(0.5, 0.95) - 0.1;
      ctx.save(); ctx.translate(px, py); ctx.rotate(a);
      ctx.fillStyle = hexA(pal.leaf, rng.range(0.45, 0.7)); ctx.beginPath();
      if (kind === "round") { ctx.ellipse(0, -ll * 0.9, ll * 0.75, ll * 0.9, 0, 0, 6.3); }
      else { ctx.moveTo(0, 0); ctx.quadraticCurveTo(ll * 0.42, -ll * 0.5, 0, -ll * 1.25); ctx.quadraticCurveTo(-ll * 0.42, -ll * 0.5, 0, 0); }
      ctx.fill(); ctx.strokeStyle = hexA(pal.line, 0.35); ctx.lineWidth = u * 0.1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -ll * (kind === "round" ? 1.6 : 1.15)); ctx.stroke();
      ctx.restore();
    }
    if (kind !== "round") { const [tx, ty] = pt(1); ctx.fillStyle = hexA(pal.leaf, 0.6); ctx.beginPath(); ctx.ellipse(tx, ty - len * 0.05, len * 0.035, len * 0.07, 0, 0, 6.3); ctx.fill(); }
    ctx.restore();
  }
  function lineSprig(ctx, x, y, len, ang, color, u, rng) { // outline-only sprig, like a doodle
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.strokeStyle = color; ctx.lineWidth = u * 0.2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(len * 0.12, -len * 0.5, 0, -len); ctx.stroke();
    const n = rng.int(5, 7);
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1), py = -len * t, px = len * 0.12 * 2 * t * (1 - t) * 1.0, s = i % 2 ? 1 : -1, ll = len * 0.2 * (1 - t * 0.4);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + s * ll * 0.9, py - ll * 0.1, px + s * ll, py - ll * 0.7); ctx.quadraticCurveTo(px + s * ll * 0.2, py - ll * 0.6, px, py); ctx.stroke();
    }
    ctx.restore();
  }
  function smiley(ctx, x, y, r, color, u) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = u * 0.28; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(x, y, r, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - r * 0.55, y - r * 0.35); ctx.quadraticCurveTo(x - r * 0.35, y - r * 0.65, x - r * 0.15, y - r * 0.35); ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x + r * 0.35, y - r * 0.4, u * 0.35, 0, 6.3); ctx.fill(); ctx.restore();
  }
  function sparkle(ctx, x, y, s, color) {
    ctx.save(); ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s); ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s);
    ctx.fill(); ctx.restore();
  }
  function swash(ctx, x, y, w, color, u) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = u * 0.3; ctx.lineCap = "round"; ctx.beginPath();
    ctx.moveTo(x, y); ctx.bezierCurveTo(x + w * 0.3, y + u * 2, x + w * 0.55, y - u * 1.5, x + w * 0.8, y + u * 0.5);
    ctx.bezierCurveTo(x + w * 0.95, y + u * 1.5, x + w * 0.9, y - u * 2.5, x + w * 0.78, y - u * 1); ctx.stroke(); ctx.restore();
  }

  // ---------- text pieces ----------
  // Cards fill a box. Each style is its own little object, like the pieces on the Harvest board.
  const CARDS = {
    taupeCaps: { paper: "taupe", fam: "Cormorant Garamond", wt: 600, caps: true, track: 0.12, lh: 1.35, max: 0.13 },
    greyType: { paper: "grey", fam: "Old Standard TT", wt: 400, lh: 1.35, max: 0.17 },
    lined: { paper: "cream", fam: "Libre Baskerville", wt: 700, lh: 1.32, align: "left", lines: true, emph: true, max: 0.16 },
    whiteCond: { paper: "white", fam: "League Gothic", wt: 400, caps: true, lh: 0.98, max: 0.5, track: 0.02 },
    greyCond: { paper: "grey", fam: "League Gothic", wt: 400, caps: true, lh: 0.98, max: 0.42, track: 0.02 },
    creamSerif: { paper: "cream", fam: "Playfair Display", wt: 700, lh: 1.18, max: 0.2 },
    sticky: { paper: "sticky", fam: "Caveat", wt: 600, lh: 1.08, max: 0.24, sticky: true },
    scriptCard: { paper: "cream", fam: "Great Vibes", wt: 400, lh: 1.1, max: 0.24 },
    darkItalic: { paper: "dark", fam: "Playfair Display", st: "italic", wt: 400, lh: 1.25, max: 0.18 }
  };
  function card(ctx, b, text, styleKey, pal, u, rng) {
    const S = CARDS[styleKey] || CARDS.greyType; const paper = pal[S.paper] || pal.cream;
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(b.rot || 0); const X = -b.w / 2, Y = -b.h / 2;
    shadow(ctx, u, S.sticky ? 1.2 : 0.8); ctx.fillStyle = paper;
    if (b.edge === "torn") torn(ctx, X, Y, b.w, b.h, rng, u * 0.7, "tb"); else { ctx.beginPath(); ctx.rect(X, Y, b.w, b.h); }
    ctx.fill(); noShadow(ctx);
    grain(ctx, X, Y, b.w, b.h, isDark(paper) ? 0.12 : 0.07);
    if (S.lines) { ctx.strokeStyle = hexA(pal.ink, 0.08); ctx.lineWidth = u * 0.12; for (let yy = Y + b.h * 0.12; yy < Y + b.h; yy += u * 2.6) { ctx.beginPath(); ctx.moveTo(X, yy); ctx.lineTo(X + b.w, yy); ctx.stroke(); } const vg = ctx.createRadialGradient(0, 0, b.w * 0.2, 0, 0, b.w * 0.8); vg.addColorStop(0, "rgba(120,90,50,0)"); vg.addColorStop(1, "rgba(120,90,50,0.16)"); ctx.fillStyle = vg; ctx.fillRect(X, Y, b.w, b.h); }
    if (S.sticky) { ctx.fillStyle = "rgba(0,0,0,0.05)"; ctx.beginPath(); ctx.moveTo(X + b.w, Y + b.h * 0.8); ctx.lineTo(X + b.w, Y + b.h); ctx.lineTo(X + b.w * 0.8, Y + b.h); ctx.fill(); }
    if (b.doodle) icon(ctx, b.doodle, X + b.w * 0.82, Y + b.h * 0.2, Math.min(b.w, b.h) * 0.22, 0, textOn(paper, pal), 0.35);
    const t = S.caps ? text.toLocaleUpperCase() : text; const fam = famFor(t, S.fam);
    const pad = Math.min(b.w, b.h) * (S.caps && S.fam === "League Gothic" ? 0.1 : 0.14);
    const single = !/\s/.test(t);
    const f = fit(ctx, t, b.w - pad * 2, b.h - pad * 2, { fam, st: fam === "Noto Serif Display" && S.st ? "italic" : S.st, wt: S.wt, track: S.track, lh: S.lh, max: Math.min(b.h * 0.9, b.w * S.max * (single ? 1.6 : 1)), min: u * 1.3, single: single && S.fam === "League Gothic" });
    drawFit(ctx, f, X + pad, Y + pad, b.w - pad * 2, b.h - pad * 2, S.align || "center", textOn(paper, pal), { emph: S.emph && /\s/.test(t) });
    ctx.restore();
  }
  // Strips size themselves to the word: dark strip, rust strip, torn paper, masking tape, label maker.
  const STRIPS = {
    darkSerif: { bg: "dark", fam: "Playfair Display", wt: 700, lower: true },
    accentCaps: { bg: "accent", fam: "Oswald", wt: 400, caps: true, track: 0.06 },
    accentItalic: { bg: "accent", fam: "Playfair Display", st: "italic", wt: 400 },
    tornBold: { bg: "cream", fam: "Playfair Display", wt: 700, torn: true },
    tape: { bg: "tape", fam: "Special Elite", wt: 400, caps: true, track: 0.22, tape: true },
    label: { bg: "dark", fam: "Courier Prime", wt: 400, caps: true, track: 0.16, label: true },
    whiteSerif: { bg: "white", fam: "Cormorant Garamond", wt: 600, caps: true, track: 0.1 },
    script: { bg: null, fam: "Great Vibes", wt: 400 }
  };
  function stripSize(ctx, text, styleKey, size) {
    const S = STRIPS[styleKey]; const t = S.caps ? text.toLocaleUpperCase() : S.lower ? text.toLocaleLowerCase() : text; const fam = famFor(t, S.fam);
    const fs = size * (S.bg ? 1 : 1.9); ctx.font = font(S.st, S.wt, fs, fam); const tr = (S.track || 0) * fs;
    const tw = measure(ctx, t, tr); const padX = fs * (S.tape ? 0.9 : 0.55); const h = fs * (S.bg ? 1.55 : 1.3);
    return { w: tw + padX * 2, h, t, fam, fs, tr, S };
  }
  function strip(ctx, x, y, text, styleKey, size, rot, pal, u, rng) { // x,y = centre
    const m = stripSize(ctx, text, styleKey, size); const S = m.S;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); const X = -m.w / 2, Y = -m.h / 2;
    let bgc = S.bg ? (pal[S.bg] || pal.cream) : null;
    if (S.tape) { ctx.globalAlpha = 0.92; ctx.fillStyle = pal.tape; jag(ctx, X, Y, m.w, m.h, rng, m.h * 0.12); ctx.fill(); ctx.globalAlpha = 1; grain(ctx, X, Y, m.w, m.h, 0.18); }
    else if (S.label) { shadow(ctx, u * 0.6, 1); ctx.fillStyle = bgc; rrect(ctx, X, Y, m.w, m.h, m.h * 0.12); ctx.fill(); noShadow(ctx); ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(X, Y + m.h * 0.08, m.w, m.h * 0.18); }
    else if (S.torn) { shadow(ctx, u * 0.8, 0.9); ctx.fillStyle = bgc; torn(ctx, X, Y, m.w, m.h, rng, m.h * 0.1); ctx.fill(); noShadow(ctx); grain(ctx, X, Y, m.w, m.h, 0.08); }
    else if (bgc) { shadow(ctx, u * 0.8, 0.8); ctx.fillStyle = bgc; ctx.fillRect(X, Y, m.w, m.h); noShadow(ctx); grain(ctx, X, Y, m.w, m.h, isDark(bgc) ? 0.14 : 0.07); }
    ctx.font = font(S.st, S.wt, m.fs, m.fam); ctx.textBaseline = "middle";
    ctx.fillStyle = bgc ? (S.label ? "#f4f1ea" : textOn(S.tape ? pal.tape : bgc, pal)) : pal.ink;
    if (!bgc && isDark(pal.bg)) ctx.fillStyle = pal.light;
    fillT(ctx, m.t, 0, m.fs * 0.06, m.tr, "center");
    ctx.restore();
    return rotAABB({ x: x - m.w / 2, y: y - m.h / 2, w: m.w, h: m.h }, x, y, rot || 0);
  }

  // ---------- titles ----------
  function title(ctx, b, word, styleKey, pal, u, rng, onBg) {
    const W = word || "2027"; const ink = pal.ink;
    if (styleKey === "script") {
      // big script word with 2027 swinging off it, like "Harvest board 26"
      const host = onBg ? pal.bg : pal.cream; const col = onBg ? (isDark(pal.bgPaper) ? pal.light : pal.ink) : ink;
      if (!onBg) { ctx.save(); shadow(ctx, u, 0.7); ctx.fillStyle = pal.cream; ctx.fillRect(b.x, b.y, b.w, b.h); noShadow(ctx); grain(ctx, b.x, b.y, b.w, b.h, 0.07); ctx.restore(); }
      const fam = famFor(W, "Great Vibes");
      ctx.font = font("normal", 400, 100, fam); const ww0 = ctx.measureText(W).width; ctx.font = font("normal", 400, 100, "Great Vibes"); const yw0 = ctx.measureText("2027").width * 0.75;
      let size = Math.min(b.h * 0.62, (b.w * 0.92) / ((ww0 + yw0 * 0.85) / 100));
      ctx.save(); ctx.fillStyle = col; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      ctx.font = font("normal", 400, size, fam); const ww = ctx.measureText(W).width; const yw = yw0 * size / 100;
      const total = ww + yw * 0.85; const x0 = b.x + (b.w - total) / 2; const base = b.y + b.h * 0.8;
      ctx.fillText(W, x0, base);
      ctx.font = font("normal", 400, size * 0.75, "Great Vibes"); ctx.fillText("2027", x0 + ww - yw * 0.05, base - size * 0.68);
      ctx.restore(); swash(ctx, x0 + total * 0.1, base + size * 0.12, total * 0.75, hexA(col, 0.55), u);
      return;
    }
    ctx.save(); ctx.translate(b.x + b.w / 2, b.y + b.h / 2); ctx.rotate(b.rot || 0); const X = -b.w / 2, Y = -b.h / 2;
    if (styleKey === "editorial") {
      shadow(ctx, u, 0.8); ctx.fillStyle = pal.dark === pal.ink ? pal.white : pal.cream; ctx.fillRect(X, Y, b.w, b.h); noShadow(ctx); grain(ctx, X, Y, b.w, b.h, 0.06);
      const paper = pal.dark === pal.ink ? pal.white : pal.cream; const c = textOn(paper, pal);
      ctx.strokeStyle = hexA(c, 0.7); ctx.lineWidth = u * 0.15; ctx.beginPath(); ctx.moveTo(X + b.w * 0.1, Y + b.h * 0.2); ctx.lineTo(X + b.w * 0.9, Y + b.h * 0.2); ctx.moveTo(X + b.w * 0.1, Y + b.h * 0.8); ctx.lineTo(X + b.w * 0.9, Y + b.h * 0.8); ctx.stroke();
      const t = W.toLocaleUpperCase(); const fam = famFor(t, "Playfair Display");
      const f = fit(ctx, t, b.w * 0.82, b.h * 0.36, { fam, wt: 400, track: 0.14, max: b.h * 0.34, min: u * 2, single: true });
      drawFit(ctx, f, X + b.w * 0.09, Y + b.h * 0.24, b.w * 0.82, b.h * 0.36, "center", c);
      ctx.font = font("italic", 500, b.h * 0.13, "Cormorant Garamond"); ctx.fillStyle = c; fillT(ctx, "twenty twenty-seven", 0, Y + b.h * 0.72, b.h * 0.01, "center");
      ctx.restore(); return;
    }
    if (styleKey === "poster") {
      shadow(ctx, u, 0.8); ctx.fillStyle = pal.sticky; ctx.fillRect(X, Y, b.w, b.h); noShadow(ctx); grain(ctx, X, Y, b.w, b.h, 0.06);
      const t = W.toLocaleUpperCase(); const fam = famFor(t, "League Gothic");
      const f = fit(ctx, t, b.w * 0.86, b.h * 0.58, { fam, wt: 400, max: b.h * 0.6, min: u * 2, single: true, lh: 1 });
      drawFit(ctx, f, X + b.w * 0.07, Y + b.h * 0.08, b.w * 0.86, b.h * 0.58, "center", pal.dark, { base: 0.85 });
      ctx.font = font("normal", 400, b.h * 0.26, "League Gothic"); ctx.lineWidth = u * 0.3; ctx.strokeStyle = pal.accent; ctx.textAlign = "center"; ctx.strokeText("2027", 0, Y + b.h * 0.92);
      ctx.restore(); return;
    }
    // "harvest": cream card, faint engraved drawing behind, big 2027 and her word in spaced capitals
    shadow(ctx, u, 0.85); ctx.fillStyle = pal.cream; ctx.fillRect(X, Y, b.w, b.h); noShadow(ctx); grain(ctx, X, Y, b.w, b.h, 0.08);
    icon(ctx, b.motif || "grains", X + b.w * 0.62, Y + b.h * 0.45, b.h * 0.95, -0.15, pal.ink, 0.1);
    lineSprig(ctx, X + b.w * 0.07, Y + b.h * 0.62, b.h * 0.45, -0.1, hexA(pal.ink, 0.35), u, rng);
    const c = textOn(pal.cream, pal);
    ctx.fillStyle = c; ctx.font = font("normal", 800, b.h * 0.4, "Playfair Display"); ctx.textBaseline = "alphabetic"; ctx.textAlign = "center";
    let fs = b.h * 0.4; while (ctx.measureText("2027").width > b.w * 0.7) { fs *= 0.94; ctx.font = font("normal", 800, fs, "Playfair Display"); }
    ctx.fillText("2027", 0, Y + b.h * 0.5);
    const t = W.toLocaleUpperCase(); const fam = famFor(t, "Old Standard TT");
    const f = fit(ctx, t, b.w * 0.8, b.h * 0.3, { fam, wt: 400, track: 0.12, max: b.h * 0.16, min: u * 1.4, lh: 1.15 });
    drawFit(ctx, f, X + b.w * 0.1, Y + b.h * 0.55, b.w * 0.8, b.h * 0.34, "center", c);
    ctx.restore();
  }

  // ---------- layout helpers ----------
  // Split a rectangle into cells of varied sizes, the way a collage board is built.
  function guillotine(rng, rect, target, minW, minH) {
    let cells = [rect]; let guard = 0;
    while (cells.length < target && guard++ < 400) {
      cells.sort((a, b) => b.w * b.h - a.w * a.h);
      let idx = cells.findIndex(c => !c.done); if (idx < 0) break; const c = cells[idx];
      const r = rng.range(0.36, 0.64); const asp = c.w / c.h;
      let vertical = asp > 1.25 ? true : asp < 0.75 ? false : rng.chance(0.5);
      if (vertical && c.w * Math.min(r, 1 - r) < minW) vertical = false;
      if (!vertical && c.h * Math.min(r, 1 - r) < minH) { if (c.w * Math.min(r, 1 - r) >= minW) vertical = true; else { c.done = true; continue; } }
      cells.splice(idx, 1);
      if (vertical) cells.push({ x: c.x, y: c.y, w: c.w * r, h: c.h }, { x: c.x + c.w * r, y: c.y, w: c.w * (1 - r), h: c.h });
      else cells.push({ x: c.x, y: c.y, w: c.w, h: c.h * r }, { x: c.x, y: c.y + c.h * r, w: c.w, h: c.h * (1 - r) });
    }
    return cells;
  }
  // choose photos for slots: her uploads and picks first, matched to the slot's shape, faces into bigger slots
  function assign(slots, photos) {
    const left = photos.slice(); const out = new Map();
    slots.slice().sort((a, b) => b.w * b.h - a.w * a.h).forEach(s => {
      if (!left.length) return; const sa = s.w / s.h; let best = 0, bs = -1e9;
      for (let i = 0; i < Math.min(5, left.length); i++) {
        const p = left[i]; const pa = (p.img.naturalWidth || p.img.width) / (p.img.naturalHeight || p.img.height);
        const sc = -Math.abs(Math.log(sa / pa)) + ((p.faces && p.faces.length) ? 0.25 : 0) - (p.small && s.w * s.h > 0 ? (s.big ? 2 : 0.3) : 0) - i * 0.12;
        if (sc > bs) { bs = sc; best = i; }
      }
      out.set(s, left.splice(best, 1)[0]);
    });
    return out;
  }
  function freeSpot(rng, w, h, region, avoid, tries) {
    let best = null, bestD = -1;
    for (let k = 0; k < (tries || 50); k++) {
      const r = { x: rng.range(region.x, region.x + region.w - w), y: rng.range(region.y, region.y + region.h - h), w, h };
      if (avoid.some(a => inter(a, r) > 0)) continue;
      const cx = r.x + w / 2, cy = r.y + h / 2;
      const d = Math.min(...avoid.map(a => Math.hypot(Math.max(a.x - cx, 0, cx - (a.x + a.w)), Math.max(a.y - cy, 0, cy - (a.y + a.h)))), 1e9);
      if (d > bestD) { bestD = d; best = r; }
    }
    return best;
  }

  // ---------- backgrounds ----------
  // Paints the board background: a colour with a texture, or her own photo softly blurred.
  function paintBg(ctx, st, color) {
    const { W, H, u, rng, pal } = st; const bg = st.bgSpec;
    if (bg && bg.texture === "photo" && bg.img) {
      const im = bg.img, iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height;
      const s = Math.max(W / iw, H / ih); const c = document.createElement("canvas"); c.width = Math.max(8, Math.round(W / 24)); c.height = Math.max(8, Math.round(H / 24));
      const g = c.getContext("2d"); g.drawImage(im, (iw - W / s) / 2, (ih - H / s) / 2, W / s, H / s, 0, 0, c.width, c.height);
      ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; ctx.drawImage(c, 0, 0, W, H);
      ctx.fillStyle = hexA(color, 0.35); ctx.fillRect(0, 0, W, H); ctx.restore(); grain(ctx, 0, 0, W, H, 0.08); return;
    }
    ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
    const tex = bg ? bg.texture : "paper"; const dark = isDark(color); const ink = dark ? "#ffffff" : pal.ink;
    if (tex === "kraft") { grain(ctx, 0, 0, W, H, 0.2); ctx.save(); for (let i = 0; i < 900; i++) { ctx.strokeStyle = rng.chance(0.5) ? "rgba(70,45,25,0.12)" : "rgba(255,240,215,0.14)"; ctx.lineWidth = u * 0.08; const x = rng() * W, y = rng() * H, a = rng() * 6.3, l = u * rng.range(0.6, 2.2); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke(); } ctx.restore(); return; }
    grain(ctx, 0, 0, W, H, tex === "paper" ? 0.1 : 0.07);
    ctx.save();
    if (tex === "linen") { ctx.strokeStyle = hexA(ink, 0.05); ctx.lineWidth = u * 0.06; const g = u * 0.45; for (let x = 0; x < W; x += g) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += g) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
    if (tex === "grid") { ctx.strokeStyle = hexA("#7a8fa8", 0.22); ctx.lineWidth = u * 0.07; const g = u * 4.2; for (let x = g / 2; x < W; x += g) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = g / 2; y < H; y += g) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
    if (tex === "dots") { ctx.fillStyle = hexA(ink, 0.22); const g = u * 4; for (let x = g / 2; x < W; x += g) for (let y = g / 2; y < H; y += g) { ctx.beginPath(); ctx.arc(x, y, u * 0.18, 0, 6.3); ctx.fill(); } }
    if (tex === "wash") { [pal.accent, pal.leaf, pal.taupe, pal.accent, pal.leaf].forEach(c => { const x = rng() * W, y = rng() * H, r = (W + H) * rng.range(0.12, 0.25); const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(c, 0.16)); g.addColorStop(1, hexA(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }); }
    ctx.restore();
  }

  // ---------- compositions ----------
  // Each returns nothing; it draws, and records photo hit boxes in st.slots.
  function textPlan(spec, rng, look) {
    const feelings = (spec.feelings || []).filter(Boolean).slice(0, 6);
    const affs = (spec.affirmations || []).filter(Boolean).slice(0, 4);
    // condensed capitals are for single words; sentences get the paper styles
    const cs = rng.shuffle(look.cards.filter(k => k !== "whiteCond" && k !== "greyCond"));
    return { feelings, affs, cardStyles: cs.length ? cs : ["greyType"], stripStyles: rng.shuffle(look.strips), title: spec.titleStyle || rng.pick(look.titles) };
  }

  function collage(ctx, st) {
    const { W, H, rng, pal, look, u, land } = st; const T = st.text;
    // region below the clock (phone) or the whole screen (laptop)
    const top = land ? 0 : H * 0.255; const region = { x: -W * 0.01, y: top, w: W * 1.02, h: H - top + H * 0.005 };
    // title cell carved in first, near the middle
    const tw = land ? W * rng.range(0.24, 0.3) : W * rng.range(0.44, 0.54), th = land ? H * rng.range(0.24, 0.3) : H * rng.range(0.12, 0.145);
    const tx = land ? W * rng.range(0.4, 0.5) : rng.chance(0.5) ? W * rng.range(0.22, 0.3) : W * rng.range(0.2, 0.34);
    const ty = land ? H * rng.range(0.32, 0.42) : H * rng.range(0.47, 0.55);
    const titleR = { x: tx, y: ty, w: tw, h: th };
    const parts = [{ x: region.x, y: region.y, w: region.w, h: ty - region.y }, { x: region.x, y: ty + th, w: region.w, h: region.y + region.h - ty - th }, { x: region.x, y: ty, w: tx - region.x, h: th }, { x: tx + tw, y: ty, w: region.x + region.w - tx - tw, h: th }];
    const minW = W * (land ? 0.08 : 0.17), minH = land ? H * 0.14 : W * 0.15;
    let cells = [];
    parts.forEach(p => { if (p.w < minW * 0.8 || p.h < minH * 0.6) return; const n = Math.max(1, Math.round((p.w * p.h) / (land ? W * H * 0.045 : W * W * 0.085))); cells = cells.concat(guillotine(rng, p, n, minW, minH)); });
    // a ragged top edge, so the collage doesn't start on a ruler line
    if (!land) cells.forEach(c => { if (Math.abs(c.y - region.y) < 1) { const d = H * rng.range(0, 0.03); c.y -= d; c.h += d; } });
    // choose text cells: affirmations and one feeling word as cards, spread out
    const textCells = []; const safe = (c) => land ? (c.x > W * 0.12 && c.y + c.h < H * 0.92) : (c.y > H * 0.29 && c.y + c.h < H * 0.92 && c.x > -1 && c.x + c.w < W + 1);
    const cand = rng.shuffle(cells.filter(c => safe(c) && c.w > W * (land ? 0.1 : 0.22) && c.h > (land ? H * 0.15 : W * 0.18) && c.w / c.h < 2.4 && c.w / c.h > 0.5));
    const nCards = Math.min(T.affs.length, land ? 3 : 3) + (T.feelings.length > 3 ? 1 : 0);
    [land ? 0.18 : 0.36, land ? 0.12 : 0.24].forEach(gap => {
      for (const c of cand) {
        if (textCells.length >= nCards || textCells.includes(c)) continue;
        const near = textCells.some(o => Math.hypot((o.x + o.w / 2) - (c.x + c.w / 2), (o.y + o.h / 2) - (c.y + c.h / 2)) < W * gap);
        if (!near) textCells.push(c);
      }
    });
    const photoCells = cells.filter(c => !textCells.includes(c));
    photoCells.forEach(c => { c.big = c.w * c.h > W * W * 0.12; });
    const map = assign(photoCells, st.photos);
    // decide frames: most photos sit flush, some are white-bordered prints lifted above, a few with pins
    const lifted = []; const flat = [];
    photoCells.forEach(c => { if (!map.get(c)) return; (rng.chance(look.frames.white + look.frames.polaroid) ? lifted : flat).push(c); });
    // background
    paintBg(ctx, st, pal.bg);
    if (!land) topArt(ctx, st);
    const faces = []; const texts = [];
    flat.forEach(c => { const f = photoTile(ctx, { x: c.x, y: c.y, w: c.w, h: c.h }, map.get(c), look, pal, u, rng); faces.push(...f); st.slots.push({ hit: c, photo: map.get(c) }); });
    // text cards (drawn before lifted prints so a print can overlap a card edge, never a face)
    textCells.forEach((c, i) => {
      const b = { x: c.x + u * 0.3, y: c.y + u * 0.3, w: c.w - u * 0.6, h: c.h - u * 0.6, rot: rng.range(-0.015, 0.015) };
      if (i < Math.min(T.affs.length, 3)) card(ctx, Object.assign(b, { doodle: rng.chance(0.3) ? rng.pick(st.motifs) : null }), T.affs[i], T.cardStyles[i % T.cardStyles.length], pal, u, rng);
      else { const word = T.feelings.pop(); if (word) card(ctx, b, word, rng.pick(["whiteCond", "greyCond"].filter(k => look.cards.includes(k)).concat(["whiteCond"])), pal, u, rng); }
      texts.push(c);
    });
    // lifted prints: grow a little past their cell on sides where no face would be covered
    lifted.forEach(c => {
      const ph = map.get(c); const g = Math.min(c.w, c.h) * rng.range(0.04, 0.09); const t = { x: c.x, y: c.y, w: c.w, h: c.h, rot: rng.range(-0.025, 0.025) };
      ["l", "r", "t", "b"].forEach(s => {
        const probe = s === "l" ? { x: c.x - g, y: c.y, w: g, h: c.h } : s === "r" ? { x: c.x + c.w, y: c.y, w: g, h: c.h } : s === "t" ? { x: c.x, y: c.y - g, w: c.w, h: g } : { x: c.x, y: c.y + c.h, w: c.w, h: g };
        if (faces.some(f => inter(f, probe) > 0) || texts.some(f => inter(grow(f, -u), probe) > 0) || inter(titleR, probe) > 0) return;
        if (s === "l") { t.x -= g; t.w += g; } else if (s === "r") t.w += g; else if (s === "t") { t.y -= g; t.h += g; } else t.h += g;
      });
      t.frame = rng.chance(look.frames.polaroid / Math.max(0.01, look.frames.white + look.frames.polaroid)) ? "polaroid" : "white";
      const f = photoTile(ctx, t, ph, look, pal, u, rng); faces.push(...f); st.slots.push({ hit: c, photo: ph });
      // a pin or tape on top, only where there is no face
      const pinAt = { x: t.x + t.w / 2 - u * 2, y: t.y + u * 0.5, w: u * 4, h: u * 4 };
      if (rng.chance(look.pins) && !f.some(fr => inter(fr, pinAt) > 0)) pin(ctx, t.x + t.w / 2, t.y + u * 2.2, u);
      else if (rng.chance(look.tape)) { const tp = { x: t.x + t.w * 0.3, y: t.y - u * 1.5, w: t.w * 0.4, h: u * 3 }; if (!faces.some(fr => inter(fr, tp) > 0)) tapePiece(ctx, t.x + t.w / 2, t.y, Math.min(t.w * 0.45, u * 16), u * 3.2, rng.range(-0.08, 0.08), pal.tape, rng); }
    });
    // title
    title(ctx, Object.assign({}, titleR, { rot: rng.range(-0.01, 0.01), motif: st.motif }), st.word, T.title === "script" ? "script" : T.title, pal, u, rng, false);
    texts.push(titleR);
    // feeling words as strips over the seams, kept off faces and other words
    st.faces = faces; placeStrips(ctx, st, T.feelings.slice(), faces, texts, land ? { x: W * 0.13, y: H * 0.05, w: W * 0.85, h: H * 0.83 } : { x: W * 0.04, y: H * 0.3, w: W * 0.92, h: H * 0.6 }, cells);
  }

  function placeStrips(ctx, st, words, faces, texts, area, cells) {
    const { rng, pal, u, W, H } = st; const T = st.text; let si = 0;
    words.forEach(word => {
      const style = T.stripStyles[si++ % T.stripStyles.length]; if (style === "script" && !st.allowScript) { return placeOne("tornBold"); }
      placeOne(style);
      function placeOne(sk) {
        const size = u * rng.range(3.1, 4.3);
        const m = stripSize(ctx, word, sk, size);
        for (let k = 0; k < 60; k++) {
          let x, y;
          if (cells && cells.length && k < 45) { const c = rng.pick(cells); x = c.x + c.w * rng.range(0.2, 0.8); y = rng.chance(0.5) ? c.y : c.y + c.h; }
          else { x = rng.range(area.x + m.w / 2, area.x + area.w - m.w / 2); y = rng.range(area.y + m.h / 2, area.y + area.h - m.h / 2); }
          const r = { x: x - m.w / 2, y: y - m.h / 2, w: m.w, h: m.h };
          if (r.x < area.x || r.x + r.w > area.x + area.w || r.y < area.y || r.y + r.h > area.y + area.h) continue;
          if (faces.some(f => inter(f, grow(r, u * 0.5)) > 0)) continue;
          if (texts.some(t => inter(t, grow(r, u * 0.8)) > 0)) continue;
          const box = strip(ctx, x, y, word, sk, size, rng.range(-0.05, 0.05), pal, u, rng); texts.push(box); return;
        }
      }
    });
  }

  // the top of a phone board sits under the clock: keep it calm but not plain
  function topArt(ctx, st, bgc) {
    const { W, H, rng, pal, u } = st;
    const dark = isDark(bgc || pal.bg); const col = dark ? hexA(pal.light, 0.16) : hexA(pal.line, 0.22);
    if (st.look.art > 0.5) { branch(ctx, W * 0.99, H * 0.26, H * 0.12, -0.55, Object.assign({}, pal, { leaf: dark ? pal.light : pal.leaf, line: dark ? pal.light : pal.line }), rng, u); }
    lineSprig(ctx, W * 0.6, H * 0.255, H * 0.05, 0.3, col, u, rng);
    // a faded affirmation behind the widgets
    const quiet = (st.quiet || st.text.affs[st.text.affs.length - 1] || "").toLocaleUpperCase(); if (!quiet) return;
    const fam = famFor(quiet, "League Gothic");
    const f = fit(ctx, quiet, W * 0.42, H * 0.09, { fam, wt: 400, lh: 1.0, max: H * 0.035, min: u * 2, track: 0.02 });
    ctx.save(); ctx.globalAlpha = dark ? 0.16 : 0.2; drawFit(ctx, f, W * 0.05, H * 0.155, W * 0.42, H * 0.09, "left", dark ? pal.light : pal.ink); ctx.restore();
    for (let i = 0; i < 4; i++) sparkle(ctx, W * rng.range(0.1, 0.9), H * rng.range(0.03, 0.1), u * rng.range(0.7, 1.3), dark ? hexA(pal.light, 0.5) : hexA(pal.line, 0.35));
  }

  function scrapbook(ctx, st) {
    const { W, H, rng, pal, look, u, land } = st; const T = st.text;
    const bg = pal.bgPaper; paintBg(ctx, st, bg);
    const darkBg = isDark(bg); const lineCol = darkBg ? hexA(pal.light, 0.5) : hexA(pal.line, 0.55);
    const palBg = Object.assign({}, pal, { bg });
    // title in the middle, big script with the year swinging off it
    const titleR = land ? { x: W * 0.36, y: H * 0.34, w: W * 0.36, h: H * 0.3 } : { x: W * 0.06, y: H * 0.555, w: W * 0.88, h: H * 0.12 };
    const avoid = [titleR]; const faces = []; const texts = [titleR];
    // botanicals first, behind everything
    const leafPal = Object.assign({}, pal, { line: darkBg ? pal.light : pal.line, leaf: darkBg ? pal.taupe : pal.leaf });
    const nb = Math.round(2 + look.art * 2);
    for (let i = 0; i < nb; i++) {
      const side = i % 4; const len = (land ? H : W) * rng.range(0.28, 0.42);
      const pos = side === 0 ? [W * rng.range(0.0, 0.05), H * rng.range(land ? 0.6 : 0.7, 0.98), rng.range(0.1, 0.5)] : side === 1 ? [W * rng.range(0.95, 1.0), H * rng.range(land ? 0.3 : 0.35, 0.6), rng.range(-0.6, -0.15)] : side === 2 ? [W * rng.range(0.3, 0.7), H * (land ? 1.0 : 1.0), rng.range(-0.3, 0.3)] : [W * rng.range(0.0, 0.04), H * rng.range(land ? 0.25 : 0.3, 0.45), rng.range(0.4, 0.9)];
      branch(ctx, pos[0], pos[1], len, pos[2], leafPal, rng, u, rng.chance(0.3) ? "round" : "long");
    }
    if (!land) topArt(ctx, st, bg);
    // a big line drawing behind the title
    icon(ctx, st.motif, titleR.x + titleR.w * 0.78, titleR.y + titleR.h * 0.4, titleR.h * 1.1, 0.2, darkBg ? pal.light : pal.line, 0.1);
    // prints: polaroids scattered on a loose grid above and below the title
    const spots = [];
    if (land) {
      // staggered rows across the whole screen, so the laptop board is as full as the phone one
      [0.17, 0.5, 0.84].forEach((y, r) => { for (let x = (r % 2 ? 0.115 : 0.06); x < 0.99; x += 0.112) spots.push([x, y + (r === 1 ? 0 : (x * 7 % 1 - 0.5) * 0.05)]); });
    } else {
      // staggered rows: two above the title, three below
      [0.355, 0.45, 0.755, 0.86, 0.96].forEach((y, r) => (r % 2 ? [0.3, 0.7] : [0.14, 0.5, 0.86]).forEach(x => spots.push([x, y])));
    }
    const order = land ? rng.shuffle(spots) : spots;
    const placed = []; let pi = 0;
    for (const [fx, fy] of order) {
      const ph = st.photos[pi]; if (!ph) break;
      const asp = (ph.img.naturalWidth || ph.img.width) / (ph.img.naturalHeight || ph.img.height);
      const base0 = (land ? H * rng.range(0.25, 0.31) : W * rng.range(0.29, 0.33));
      const frame = rng.chance(0.55) ? "polaroid" : "white";
      let ok = false, t, w, h;
      for (let k = 0; k < 26 && !ok; k++) {
        // if a spot is crowded, nudge further and shrink a little rather than give up
        const base = base0 * (k < 12 ? 1 : k < 20 ? 0.88 : 0.78); const b = base * (frame === "polaroid" ? 0.05 : 0.04);
        w = base; h = base / Math.max(0.72, Math.min(1.35, asp)) + (frame === "polaroid" ? b * 4 : b * 2);
        const cx = W * fx + rng.range(-1, 1) * W * (0.03 + k * 0.004), cy = H * fy + rng.range(-1, 1) * H * (0.015 + k * 0.002);
        t = { x: cx - w / 2, y: cy - h / 2, w, h, rot: rng.range(-0.12, 0.12), frame };
        const bb = rotAABB(t, cx, cy, t.rot);
        if (inter(bb, titleR) > bb.w * bb.h * 0.04) continue;
        if (!land && bb.y < H * 0.255) continue;
        if (faces.some(f => inter(f, bb) > 0)) continue;
        if (placed.some(p => inter(p, bb) > Math.min(p.w * p.h, bb.w * bb.h) * (land ? 0.3 : 0.38))) continue;
        ok = true;
      }
      if (!ok) continue;
      const f = photoTile(ctx, t, ph, look, pal, u, rng); faces.push(...f); const bb = rotAABB(t, t.x + w / 2, t.y + h / 2, t.rot); placed.push(bb); avoid.push(bb);
      st.slots.push({ hit: bb, photo: ph }); pi++;
      const tp = { x: t.x + t.w * 0.3, y: t.y - u * 1.6, w: t.w * 0.4, h: u * 3.2 };
      if (rng.chance(look.tape + 0.2) && !faces.some(fr => inter(fr, tp) > 0)) tapePiece(ctx, t.x + t.w / 2 + rng.range(-1, 1) * u * 3, t.y + u * 0.4, Math.min(t.w * 0.4, u * 14), u * 3, t.rot + rng.range(-0.15, 0.15), pal.tape, rng);
    }
    // second pass: if the grid left the board thin, tuck more prints wherever they fit without covering a face
    const target = land ? 18 : 12;
    for (let tries = 0; placed.length < target && st.photos[pi] && tries < 400; tries++) {
      const ph = st.photos[pi]; const asp = (ph.img.naturalWidth || ph.img.width) / (ph.img.naturalHeight || ph.img.height);
      const base = (land ? H * rng.range(0.2, 0.26) : W * rng.range(0.24, 0.29)); const frame = rng.chance(0.5) ? "polaroid" : "white"; const bd = base * (frame === "polaroid" ? 0.05 : 0.04);
      const w = base, h = base / Math.max(0.72, Math.min(1.35, asp)) + (frame === "polaroid" ? bd * 4 : bd * 2);
      const cx = rng.range(w * 0.35, W - w * 0.35), cy = rng.range(land ? h * 0.4 : H * 0.27 + h / 2, H - h * 0.3);
      const t = { x: cx - w / 2, y: cy - h / 2, w, h, rot: rng.range(-0.12, 0.12), frame }; const bb = rotAABB(t, cx, cy, t.rot);
      if (inter(bb, titleR) > 0 || (!land && bb.y < H * 0.255) || faces.some(f => inter(f, bb) > 0) || placed.some(p => inter(p, bb) > Math.min(p.w * p.h, bb.w * bb.h) * 0.4)) continue;
      const f = photoTile(ctx, t, ph, look, pal, u, rng); faces.push(...f); placed.push(bb); avoid.push(bb); st.slots.push({ hit: bb, photo: ph }); pi++;
    }
    title(ctx, titleR, st.word, "script", Object.assign({}, pal, { bgPaper: bg }), u, rng, true);
    // area names in typewriter capitals, like "Home", "Rest", "Travel"
    const areaWords = (st.areas || []).map(a => (window.AREAS[a] || {}).short).filter(Boolean).slice(0, 3);
    const region = land ? { x: W * 0.13, y: H * 0.04, w: W * 0.84, h: H * 0.84 } : { x: W * 0.03, y: H * 0.29, w: W * 0.94, h: H * 0.62 };
    areaWords.forEach(word => {
      ctx.font = font("normal", 700, u * 3.6, "Courier Prime"); const tw = measure(ctx, word, u * 0.3), th = u * 4;
      const vertical = !land && rng.chance(0.25);
      const s = freeSpot(rng, vertical ? th : tw, vertical ? tw : th, region, avoid.concat(texts), 60); if (!s) return;
      ctx.save(); ctx.fillStyle = darkBg ? pal.light : pal.ink; ctx.textBaseline = "middle";
      if (vertical) { ctx.translate(s.x + s.w / 2, s.y + s.h / 2); ctx.rotate(Math.PI / 2); fillT(ctx, word, 0, 0, u * 0.3, "center"); }
      else { ctx.translate(s.x + s.w / 2, s.y + s.h / 2); ctx.rotate(rng.range(-0.06, 0.06)); fillT(ctx, word, 0, 0, u * 0.3, "center"); }
      ctx.restore(); texts.push(s);
    });
    // affirmations on small cards in the open spaces
    T.affs.slice(0, 2).forEach((a, i) => {
      const w = land ? W * 0.15 : W * 0.4, h = land ? H * 0.17 : W * 0.26;
      let s = freeSpot(rng, w, h, region, avoid.concat(texts), 80);
      // no open space left: let the card overlap the edge of a print, never a face or the title
      for (let k = 0; !s && k < 80; k++) { const r = { x: rng.range(region.x, region.x + region.w - w), y: rng.range(region.y, region.y + region.h - h), w, h }; if (!faces.some(f => inter(f, grow(r, u)) > 0) && !texts.some(t => inter(t, grow(r, u)) > 0)) s = r; }
      if (!s) return;
      card(ctx, Object.assign(s, { rot: rng.range(-0.05, 0.05) }), a, T.cardStyles[i % T.cardStyles.length], pal, u, rng); texts.push(s);
    });
    // feeling words as strips and pieces of tape
    st.allowScript = true;
    st.faces = faces; placeStrips(ctx, st, T.feelings.slice(0, 4), faces, texts.concat(placed.map(p => grow(p, -Math.min(p.w, p.h) * 0.3))), region, null);
    doodles(ctx, st, avoid.concat(texts), region, lineCol);
  }

  // line drawings, smileys and sparkles in whatever space is left, so nothing is plain
  function doodles(ctx, st, avoid, region, col) {
    const { rng, u, pal } = st; const n = Math.round(4 + st.look.art * 5);
    for (let i = 0; i < n; i++) {
      const s = u * rng.range(5, 9); const spot = freeSpot(rng, s, s, region, avoid, 40); if (!spot) continue;
      const cx = spot.x + s / 2, cy = spot.y + s / 2; const k = rng();
      if (k < 0.12) smiley(ctx, cx, cy, s * 0.35, col, u);
      else if (k < 0.3) { sparkle(ctx, cx, cy, s * 0.22, col); sparkle(ctx, cx + s * 0.3, cy - s * 0.25, s * 0.1, col); }
      else if (k < 0.45) lineSprig(ctx, cx, cy + s * 0.4, s * 0.9, rng.range(-0.5, 0.5), col, u, rng);
      else icon(ctx, rng.pick(st.motifs), cx, cy, s, rng.range(-0.2, 0.2), col, 0.9);
      avoid.push(spot);
    }
  }

  function masonry(ctx, st) {
    const { W, H, rng, pal, look, u, land } = st; const T = st.text;
    paintBg(ctx, st, pal.bg);
    if (!land) topArt(ctx, st);
    const cols = land ? 6 : 3; const m = W * (land ? 0.012 : 0.03), g = W * (land ? 0.008 : 0.018);
    const x0 = land ? W * 0.12 : m; const colW = ((land ? W * 0.875 : W - 2 * m) - g * (cols - 1)) / cols;
    const y0 = land ? H * 0.03 : H * 0.265; const heights = Array(cols).fill(y0);
    const titleH = land ? H * 0.24 : H * 0.12; const titleAt = land ? null : H * rng.range(0.47, 0.53);
    const items = []; let titleR = null;
    const affs = T.affs.slice(0, 3); const feelCard = T.feelings.length > 3 ? T.feelings.pop() : null;
    const textQueue = affs.map(a => ({ type: "aff", text: a })); if (feelCard) textQueue.splice(1, 0, { type: "word", text: feelCard });
    let pi = 0, guard = 0, sinceText = 0;
    if (land) { const tw = colW * 2 + g; const tc = 2; titleR = { x: x0 + tc * (colW + g), y: H * 0.36, w: tw, h: titleH }; }
    while (Math.min(...heights) < H + u && guard++ < 80) {
      let c = heights.indexOf(Math.min(...heights));
      if (!land && titleAt && !titleR && Math.min(...heights) > titleAt - H * 0.08) {
        const top = Math.max(...heights) + g; titleR = { x: m, y: top, w: W - 2 * m, h: titleH }; for (let i = 0; i < cols; i++) heights[i] = top + titleH + g; continue;
      }
      if (land && titleR) { // keep the title block clear in landscape
        const cx = x0 + c * (colW + g); if (cx + colW > titleR.x && cx < titleR.x + titleR.w && heights[c] < titleR.y + titleR.h && heights[c] + colW > titleR.y) { if (heights[c] < titleR.y - u * 4) { items.push({ type: "gap", x: cx, y: heights[c], w: colW, h: titleR.y - g - heights[c] }); } heights[c] = titleR.y + titleR.h + g; continue; }
      }
      const x = x0 + c * (colW + g); const y = heights[c];
      const wantText = textQueue.length && sinceText >= 3 && y > (land ? 0 : H * 0.3) && y < H * 0.8 && (!land || x > W * 0.12);
      if (wantText) { const tq = textQueue.shift(); const h = colW * (tq.type === "word" ? 0.6 : rng.range(0.8, 1.05)); items.push({ type: tq.type, text: tq.text, x, y, w: colW, h }); heights[c] += h + g; sinceText = 0; continue; }
      const ph = st.photos[pi % Math.max(1, st.photos.length)]; pi++;
      const asp = ph ? (ph.img.naturalWidth || ph.img.width) / (ph.img.naturalHeight || ph.img.height) : 0.8;
      const h = colW / Math.max(0.68, Math.min(1.3, asp)) * rng.range(0.92, 1.08);
      items.push({ type: "photo", ph, x, y, w: colW, h }); heights[c] += h + g; sinceText++;
    }
    const faces = [], texts = [];
    const framed = look.frames.white > 0.3;
    items.filter(i => i.type === "photo" && i.ph).forEach(it => { const f = photoTile(ctx, { x: it.x, y: it.y, w: it.w, h: it.h, frame: framed && rng.chance(0.5) ? "white" : null, shadow: !framed }, it.ph, look, pal, u, rng); faces.push(...f); st.slots.push({ hit: it, photo: it.ph }); });
    items.filter(i => i.type === "gap").forEach(it => { icon(ctx, rng.pick(st.motifs), it.x + it.w / 2, it.y + it.h / 2, Math.min(it.w, it.h) * 0.5, 0, isDark(pal.bg) ? pal.light : pal.line, 0.5); });
    let ci = 0;
    items.filter(i => i.type === "aff" || i.type === "word").forEach(it => {
      if (it.type === "word") card(ctx, it, it.text, rng.pick(["whiteCond", "greyCond"]), pal, u, rng);
      else card(ctx, Object.assign(it, { doodle: rng.chance(0.35) ? rng.pick(st.motifs) : null }), it.text, T.cardStyles[ci++ % T.cardStyles.length], pal, u, rng);
      texts.push(it);
    });
    if (titleR) { title(ctx, titleR, st.word, T.title === "script" ? "script" : T.title, pal, u, rng, false); texts.push(titleR); if (!land) { icon(ctx, st.motif, titleR.x + titleR.w * 0.9, titleR.y + titleR.h * 0.2, titleR.h * 0.35, 0.2, pal.ink, 0); } }
    st.faces = faces; placeStrips(ctx, st, T.feelings.slice(), faces, texts, land ? { x: W * 0.13, y: H * 0.05, w: W * 0.85, h: H * 0.83 } : { x: W * 0.04, y: H * 0.3, w: W * 0.92, h: H * 0.6 }, items.filter(i => i.type === "photo").map(i => ({ x: i.x, y: i.y, w: i.w, h: i.h + g / 2 })));
  }

  const COMPS = { collage, scrapbook, masonry };
  const COMP_NAMES = { collage: "Collage", scrapbook: "Scrapbook", masonry: "Gallery wall" };

  function avgColour(img) {
    const c = document.createElement("canvas"); c.width = c.height = 8; const g = c.getContext("2d"); g.drawImage(img, 0, 0, 8, 8);
    const d = g.getImageData(0, 0, 8, 8).data; let r = 0, gg = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; }
    const n = d.length / 4; return "#" + [r, gg, b].map(v => Math.round(v / n * 0.8).toString(16).padStart(2, "0")).join("");
  }

  // ---------- main ----------
  // spec: { W, H, lookKey, pal, comp, seed, word, feelings:[], affirmations:[], photos:[{img,faces,focal,small,bw,id,area}], areas:[] }
  function render(canvas, spec) {
    const { W, H } = spec; canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const look = Object.assign({ key: spec.lookKey }, window.LOOKS[spec.lookKey]);
    let pal = look.palettes[(spec.pal || 0) % look.palettes.length];
    const bgSpec = spec.background && spec.background.key !== "look" ? spec.background : null;
    if (bgSpec) {
      let col = bgSpec.color;
      if (bgSpec.texture === "photo") { col = bgSpec.img ? avgColour(bgSpec.img) : pal.bg; }
      if (col) pal = Object.assign({}, pal, { bg: col, bgPaper: col });
    }
    const land = W > H; const u = (land ? H : W) / 100;
    const rng = R(spec.seed >>> 0);
    const trng = R((spec.textSeed || spec.seed) >>> 0);
    const A = window.ART || { areas: {} };
    const motifs = []; (spec.areas || []).forEach(a => (A.areas[a] || []).forEach(n => motifs.push(n))); (A.areas.any || ["sparkle"]).forEach(n => motifs.push(n));
    const st = {
      W, H, rng, pal, look, u, land, word: spec.word, areas: spec.areas, photos: (spec.photos || []).filter(p => p && p.img),
      text: textPlan(spec, trng, look), motifs, bgSpec, quiet: spec.quiet, motif: rng.pick(motifs.slice(0, Math.max(1, motifs.length - 10))) || "sparkle", slots: []
    };
    (COMPS[spec.comp] || collage)(ctx, st);
    return { slots: st.slots.map((s, i) => ({ hit: s.hit, photo: s.photo, index: i })), faces: st.faces || [] };
  }

  window.BoardEngine = { render, R, hash, COMP_NAMES, comps: Object.keys(COMPS) };
})();
