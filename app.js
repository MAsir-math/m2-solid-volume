import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PRESETS, MODE_ORDER, MODE_LABELS, HASH_ALIASES, findPreset, presetsForMode } from "./presets.js";
import { numericalVolume, almostEqual } from "./math.js";

const ABOVE = "#7eaf97";
const BELOW = "#d4a090";
const SWAP = "#d2bc76";
const INK = "#1c1b16";
const MUTED = "#534f46";
const FAINT = "#9a9488";
const STROKE = "#1f5a43";
const AXIS_HL = "#8a3a2a";
const SOLID_COL = 0x3f7d62;
const INNER_COL = 0xb56a52;
const CAP_COL = 0x2f5f4b;
const SLICE_COL = 0xc9a227;

const state = {
  mode: "intro",
  presetId: "intro-barrel",
  view: "both",
  angleDeg: 300,
  sliceU: 0.45,
  playing: false,
  lastTs: 0,
  showRegion: true,
  showAxis: true,
  showSlice: true,
  cutaway: false,
  revealedIntegral: false,
  revealedAnswer: false,
  teacherUnlock: false,
  answers: {},
  comparePart: "a",
  wrongMode: "correct",
  assessView: "a",
  judgments: {}
};

let board = null;
let renderer, scene, camera, controls;
let solidGroup, overlayGroup;
let defaultCamPos = new THREE.Vector3();
let defaultCamTarget = new THREE.Vector3();
let playClock = 0;

function $(id) { return document.getElementById(id); }

function currentPreset() {
  return findPreset(state.presetId);
}

function activeSpec(p) {
  if (!p) return p;
  if (p.compareAxes && state.comparePart === "b") {
    return {
      ...p,
      axis: p.axisB,
      pieces: p.piecesB,
      hollow: false,
      profileSign: p.profileSignB,
      volumeTex: p.volumeTexB,
      volumeValue: p.volumeValueB,
      integralTex: p.integralTexB
    };
  }
  if (p.compareWrong && state.wrongMode === "wrong") {
    return {
      ...p,
      hollow: false,
      pieces: [{ a: 0, b: 1, R: () => 1, r: () => 0 }],
      volumeTex: p.wrongVolumeTex,
      volumeValue: p.wrongVolumeValue,
      integralTex: p.wrongIntegralTex
    };
  }
  if (p.judgment) {
    const b = 2, d = 4;
    const views = {
      a: { axis: { dir: "y", offset: 0 }, varName: "y", hollow: false, profileSign: 1, pieces: [{ a: 0, b: d, R: (y) => Math.sqrt(y), r: () => 0 }] },
      b: { axis: { dir: "x", offset: 0 }, varName: "x", hollow: true, profileSign: 1, pieces: [{ a: 0, b, R: () => d, r: (x) => x * x }] },
      c: { axis: { dir: "y", offset: b }, varName: "y", hollow: false, profileSign: -1, pieces: [{ a: 0, b: d, R: (y) => b - Math.sqrt(y), r: () => 0 }] },
      d: { axis: { dir: "x", offset: d }, varName: "x", hollow: true, profileSign: -1, pieces: [{ a: 0, b, R: () => d, r: (x) => d - x * x }] }
    };
    return { ...p, ...views[state.assessView] };
  }
  return p;
}

function tex(s, display) {
  if (!window.katex) return s;
  try { return katex.renderToString(s, { displayMode: !!display, throwOnError: false }); }
  catch { return s; }
}

function fillKatex(el, html) {
  if (!el) return;
  const out = String(html).replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => tex(m, false));
  el.innerHTML = out;
}

function renderDisplay(el, latex) {
  if (!el) return;
  if (!latex) { el.innerHTML = ""; return; }
  if (!window.katex) { el.textContent = latex; return; }
  katex.render(latex, el, { displayMode: true, throwOnError: false });
}

function fmt(n, d = 3) {
  if (!Number.isFinite(n)) return "—";
  const r = Math.round(n);
  if (Math.abs(n - r) < 1e-8) return String(r);
  const s = n.toFixed(d);
  return s.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function fmtAngle(deg) {
  return Math.round(deg) + "°";
}

function linspace(a, b, n) {
  const out = [];
  if (n < 2) return [a, b];
  for (let i = 0; i < n; i++) out.push(a + (b - a) * (i / (n - 1)));
  return out;
}

function tRange(spec) {
  const pcs = spec.pieces || [];
  if (!pcs.length) return [0, 1];
  return [Math.min(...pcs.map((p) => p.a)), Math.max(...pcs.map((p) => p.b))];
}

function pieceAt(spec, t) {
  const pcs = spec.pieces || [];
  const hit = pcs.find((p) => t >= p.a - 1e-10 && t <= p.b + 1e-10);
  return hit || pcs[0];
}

function radiiAt(spec, t) {
  const piece = pieceAt(spec, t);
  if (!piece) return { R: 0, r: 0, piece: null };
  const R = piece.R(t);
  const r = piece.r ? piece.r(t) : 0;
  return { R: Number.isFinite(R) ? Math.max(0, R) : 0, r: Number.isFinite(r) ? Math.max(0, r) : 0, piece };
}

function maxAngleDeg(p) {
  return (p.turn === 0.5) ? 180 : 360;
}

function currentPhiEnd(p) {
  const maxD = maxAngleDeg(p);
  const full = (p.turn === 0.5) ? Math.PI : Math.PI * 2;
  let phi = (Math.max(0, Math.min(state.angleDeg, maxD)) / maxD) * full;
  if (state.cutaway && (p.hollow || (p.compareWrong && state.wrongMode === "correct") || p.compareAxes && state.comparePart === "a")) {
    const gap = (50 * Math.PI) / 180;
    if (phi > full - gap) phi = Math.max(0.2, full - gap);
  }
  return Math.max(phi, 1e-3);
}

/* ---------------- 2D ---------------- */

function drawAxes2D(bbox, ticks) {
  const [xMin, yMax, xMax, yMin] = bbox;
  board.create("line", [[xMin, 0], [xMax, 0]], {
    strokeColor: FAINT, strokeWidth: 1, straightFirst: false, straightLast: false,
    highlight: false, fixed: true, lastArrow: true
  });
  board.create("line", [[0, yMin], [0, yMax]], {
    strokeColor: FAINT, strokeWidth: 1, straightFirst: false, straightLast: false,
    highlight: false, fixed: true, lastArrow: true
  });
  board.create("text", [xMax - 0.08 * (xMax - xMin), -0.08 * (yMax - yMin), "x"], {
    fontSize: 14, color: MUTED, fixed: true, highlight: false, anchorX: "right",
    cssStyle: "font-family: 'Noto Sans TC', sans-serif; font-weight: 700;"
  });
  board.create("text", [0.04 * (xMax - xMin), yMax - 0.06 * (yMax - yMin), "y"], {
    fontSize: 14, color: MUTED, fixed: true, highlight: false,
    cssStyle: "font-family: 'Noto Sans TC', sans-serif; font-weight: 700;"
  });
  if (ticks === "pi") {
    [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, 2 * Math.PI].forEach((x, i) => {
      const labels = ["0", "π/2", "π", "3π/2", "2π"];
      board.create("text", [x, -0.22, labels[i]], {
        fontSize: 12, color: MUTED, fixed: true, highlight: false, anchorX: "middle",
        cssStyle: "font-family: 'Noto Sans TC', sans-serif;"
      });
    });
  }
}

function fillPoly(points, color, opacity) {
  const pts = points.filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
  if (pts.length < 3) return;
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  board.create("curve", [xs, ys], {
    strokeWidth: 0, fillColor: color, fillOpacity: opacity == null ? 0.42 : opacity,
    highlight: false, fixed: true, hasInnerPoints: false
  });
}

function fillYofX(lower, upper, a, b, color) {
  const xs = linspace(a, b, 140);
  const top = [];
  const bot = [];
  xs.forEach((x) => {
    const u = upper(x), l = lower(x);
    if (Number.isFinite(u) && Number.isFinite(l)) {
      top.push([x, u]);
      bot.push([x, l]);
    }
  });
  fillPoly(top.concat(bot.reverse()), color);
}

function fillXofY(inner, outer, c, d, color) {
  const ys = linspace(c, d, 140);
  const right = [];
  const left = [];
  ys.forEach((y) => {
    const o = outer(y), i = inner(y);
    if (Number.isFinite(o) && Number.isFinite(i)) {
      right.push([o, y]);
      left.push([i, y]);
    }
  });
  fillPoly(right.concat(left.reverse()), color);
}

function drawCurveY(f, domain, color) {
  const xs = linspace(domain[0], domain[1], 160);
  const pts = xs.map((x) => [x, f(x)]).filter((p) => Number.isFinite(p[1]));
  if (pts.length < 2) return;
  board.create("curve", [pts.map((p) => p[0]), pts.map((p) => p[1])], {
    strokeColor: color, strokeWidth: 2.2, highlight: false, fixed: true
  });
}

function drawCurveX(g, domain, color) {
  const ys = linspace(domain[0], domain[1], 160);
  const pts = ys.map((y) => [g(y), y]).filter((p) => Number.isFinite(p[0]));
  if (pts.length < 2) return;
  board.create("curve", [pts.map((p) => p[0]), pts.map((p) => p[1])], {
    strokeColor: color, strokeWidth: 2.2, highlight: false, fixed: true
  });
}

function fillRegion(p) {
  const r = p.region;
  if (!r) return;
  if (r.kind === "yofx") fillYofX(r.lower, r.upper, r.a, r.b, ABOVE);
  else if (r.kind === "xofy") fillXofY(r.inner, r.outer, r.c, r.d, ABOVE);
  else if (r.kind === "yofx-abs") {
    fillYofX(() => 0, (x) => Math.max(0, r.upper(x)), r.a, r.b, ABOVE);
    fillYofX((x) => Math.min(0, r.upper(x)), () => 0, r.a, r.b, ABOVE);
  }
  else if (r.kind === "circle") {
    const pts = linspace(0, 2 * Math.PI, 80).map((t) => [r.cx + r.r * Math.cos(t), r.cy + r.r * Math.sin(t)]);
    fillPoly(pts, ABOVE);
  }
  else if (r.kind === "ellipse") {
    const pts = linspace(0, 2 * Math.PI, 90).map((t) => [r.cx + r.rx * Math.cos(t), r.cy + r.ry * Math.sin(t)]);
    fillPoly(pts, ABOVE);
  }
  else if (r.kind === "composite-b1015") {
    fillXofY(() => 0, (y) => Math.sqrt(y), 0, 2, ABOVE);
    fillXofY((y) => y - 2, (y) => Math.sqrt(y), 2, 4, ABOVE);
  }
  else if (r.kind === "composite-b1015p") {
    fillXofY(() => 0, (y) => Math.sqrt(y), 0, 2, ABOVE);
    fillXofY((y) => Math.sqrt(2 * (y - 2)), (y) => Math.sqrt(y), 2, 4, ABOVE);
  }
  else if (r.kind === "assess1") {
    fillYofX((x) => x * x, () => r.d, 0, r.b, ABOVE);
    fillYofX(() => 0, (x) => x * x, 0, r.b, BELOW);
  }
  else if (r.kind === "assess4") {
    fillYofX(() => 1, (x) => Math.exp(-x), -1, 0, ABOVE);
    fillYofX(() => 1, (x) => Math.exp(x), 0, 1, ABOVE);
  }
}

function boardVisible() {
  const el = $("box");
  if (!el) return false;
  if (state.view === "3d") return false;
  return el.clientWidth >= 20 && el.clientHeight >= 20;
}

function resizeBoard() {
  if (board && board.resizeContainer && boardVisible()) board.resizeContainer();
}

function draw2D() {
  const p = currentPreset();
  const spec = activeSpec(p);
  const el = $("box");
  if (!boardVisible()) return;
  if (board) {
    JXG.JSXGraph.freeBoard(board);
    board = null;
    el.innerHTML = "";
  }
  board = JXG.JSXGraph.initBoard("box", {
    boundingbox: p.bbox,
    keepAspectRatio: true,
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false }
  });
  if (state.showRegion) fillRegion(p);
  (p.curves || []).forEach((c) => {
    if (c.type === "yofx") drawCurveY(c.f, c.domain, STROKE);
    else if (c.type === "xofy") drawCurveX(c.g, c.domain, STROKE);
    else if (c.type === "vline") {
      board.create("line", [[c.x, p.bbox[3]], [c.x, p.bbox[1]]], {
        strokeColor: FAINT, strokeWidth: 1.2, dash: 2,
        straightFirst: false, straightLast: false, highlight: false, fixed: true
      });
    } else if (c.type === "hline") {
      const x0 = c.domain ? c.domain[0] : p.bbox[0];
      const x1 = c.domain ? c.domain[1] : p.bbox[2];
      board.create("line", [[x0, c.y], [x1, c.y]], {
        strokeColor: FAINT, strokeWidth: 1.2, dash: 2,
        straightFirst: false, straightLast: false, highlight: false, fixed: true
      });
    } else if (c.type === "circle") {
      board.create("circle", [[c.cx, c.cy], c.r], {
        strokeColor: STROKE, strokeWidth: 2.2, fillColor: "none", highlight: false, fixed: true
      });
    } else if (c.type === "ellipse") {
      const pts = linspace(0, 2 * Math.PI, 90).map((t) => [c.cx + c.rx * Math.cos(t), c.cy + c.ry * Math.sin(t)]);
      board.create("curve", [pts.map((q) => q[0]), pts.map((q) => q[1])], {
        strokeColor: STROKE, strokeWidth: 2.2, highlight: false, fixed: true
      });
    }
  });
  drawAxes2D(p.bbox, p.ticks);
  if (state.showAxis) {
    const ax = spec.axis;
    if (ax.dir === "x") {
      board.create("line", [[p.bbox[0], ax.offset], [p.bbox[2], ax.offset]], {
        strokeColor: AXIS_HL, strokeWidth: 2.4, straightFirst: false, straightLast: false,
        highlight: false, fixed: true, dash: ax.offset === 0 ? 0 : 1
      });
    } else {
      board.create("line", [[ax.offset, p.bbox[3]], [ax.offset, p.bbox[1]]], {
        strokeColor: AXIS_HL, strokeWidth: 2.4, straightFirst: false, straightLast: false,
        highlight: false, fixed: true, dash: ax.offset === 0 ? 0 : 1
      });
    }
  }
  (p.marks || []).forEach((m) => {
    board.create("point", [m.x, m.y], {
      name: m.name || "", size: 3, fillColor: AXIS_HL, strokeColor: AXIS_HL,
      fixed: true, highlight: false, label: { fontSize: 13, color: INK, offset: [8, 10] }
    });
  });
  if (state.showSlice && spec.pieces && spec.pieces.length) {
    const [t0, t1] = tRange(spec);
    const t = t0 + state.sliceU * (t1 - t0);
    const { R, r } = radiiAt(spec, t);
    const ax = spec.axis;
    const sign = spec.profileSign >= 0 ? 1 : -1;
    if (ax.dir === "x") {
      const y0 = ax.offset + sign * r;
      const y1 = ax.offset + sign * R;
      board.create("segment", [[t, y0], [t, y1]], {
        strokeColor: "#6b4d12", strokeWidth: 4, highlight: false, fixed: true
      });
      const mid = (y0 + y1) / 2;
      board.create("text", [t, mid, r > 1e-6 ? "R, r" : "R"], {
        fontSize: 13, color: "#6b4d12", fixed: true, highlight: false,
        cssStyle: "font-family: 'Noto Sans TC', sans-serif; font-weight: 700;"
      });
    } else {
      const x0 = ax.offset + sign * r;
      const x1 = ax.offset + sign * R;
      board.create("segment", [[x0, t], [x1, t]], {
        strokeColor: "#6b4d12", strokeWidth: 4, highlight: false, fixed: true
      });
      const mid = (x0 + x1) / 2;
      board.create("text", [mid, t, r > 1e-6 ? "R, r" : "R"], {
        fontSize: 13, color: "#6b4d12", fixed: true, highlight: false,
        cssStyle: "font-family: 'Noto Sans TC', sans-serif; font-weight: 700;"
      });
    }
  }
  el.setAttribute("aria-label", p.title + "的生成區域");
}

/* ---------------- 3D ---------------- */

function clearGroup(g) {
  while (g.children.length) {
    const ch = g.children[0];
    g.remove(ch);
    ch.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
  }
}

function pointOn(axisDir, axisOffset, t, radius, phi, profileSign) {
  const a = phi + (profileSign >= 0 ? 0 : Math.PI);
  if (axisDir === "x") {
    return [t, axisOffset + radius * Math.cos(a), radius * Math.sin(a)];
  }
  return [axisOffset + radius * Math.cos(a), t, radius * Math.sin(a)];
}

function geomFromArrays(positions, indices) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(positions);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function buildPieceGeometry(axisDir, axisOffset, piece, profileSign, phiEnd, Nt, Np) {
  const hasInner = piece.r && linspace(piece.a, piece.b, 8).some((t) => (piece.r(t) || 0) > 1e-4);
  const ts = linspace(piece.a, piece.b, Nt + 1);
  const phis = linspace(0, phiEnd, Np + 1);
  const positions = [];
  const indices = [];
  function addBox(v) { positions.push(v[0], v[1], v[2]); }
  function idx(grid, i, j, base) { return base + i * (Np + 1) + j; }

  const baseOuter = 0;
  for (const t of ts) {
    const { R } = { R: Math.max(0, piece.R(t) || 0) };
    for (const ph of phis) addBox(pointOn(axisDir, axisOffset, t, R, ph, profileSign));
  }
  for (let i = 0; i < Nt; i++) {
    for (let j = 0; j < Np; j++) {
      const a = idx(0, i, j, baseOuter);
      const b = idx(0, i + 1, j, baseOuter);
      const c = idx(0, i + 1, j + 1, baseOuter);
      const d = idx(0, i, j + 1, baseOuter);
      indices.push(a, b, d, b, c, d);
    }
  }

  let baseInner = 0;
  if (hasInner) {
    baseInner = positions.length / 3;
    for (const t of ts) {
      const r = Math.max(0, piece.r(t) || 0);
      for (const ph of phis) addBox(pointOn(axisDir, axisOffset, t, r, ph, profileSign));
    }
    for (let i = 0; i < Nt; i++) {
      for (let j = 0; j < Np; j++) {
        const a = idx(0, i, j, baseInner);
        const b = idx(0, i + 1, j, baseInner);
        const c = idx(0, i + 1, j + 1, baseInner);
        const d = idx(0, i, j + 1, baseInner);
        indices.push(a, d, b, b, d, c);
      }
    }
  }

  function cap(t, outward) {
    const R = Math.max(0, piece.R(t) || 0);
    const r = hasInner ? Math.max(0, piece.r(t) || 0) : 0;
    const base = positions.length / 3;
    for (const ph of phis) addBox(pointOn(axisDir, axisOffset, t, r, ph, profileSign));
    for (const ph of phis) addBox(pointOn(axisDir, axisOffset, t, R, ph, profileSign));
    for (let j = 0; j < Np; j++) {
      const a = base + j;
      const b = base + j + 1;
      const c = base + (Np + 1) + j + 1;
      const d = base + (Np + 1) + j;
      if (outward) indices.push(a, b, d, b, c, d);
      else indices.push(a, d, b, b, d, c);
    }
  }
  cap(piece.a, false);
  cap(piece.b, true);

  const closed = Math.abs(phiEnd - 2 * Math.PI) < 0.08 || Math.abs(phiEnd - Math.PI) < 0.04;
  if (!closed) {
    [0, phiEnd].forEach((ph) => {
      const base = positions.length / 3;
      for (const t of ts) {
        const R = Math.max(0, piece.R(t) || 0);
        const r = hasInner ? Math.max(0, piece.r(t) || 0) : 0;
        addBox(pointOn(axisDir, axisOffset, t, r, ph, profileSign));
        addBox(pointOn(axisDir, axisOffset, t, R, ph, profileSign));
      }
      for (let i = 0; i < Nt; i++) {
        const a = base + i * 2;
        const b = base + i * 2 + 1;
        const c = base + (i + 1) * 2 + 1;
        const d = base + (i + 1) * 2;
        if (ph === 0) indices.push(a, d, b, b, d, c);
        else indices.push(a, b, d, b, c, d);
      }
    });
  }
  return geomFromArrays(positions, indices);
}

function estimateSolidBox(spec) {
  const box = new THREE.Box3();
  const ax = spec.axis;
  (spec.pieces || []).forEach((piece) => {
    linspace(piece.a, piece.b, 24).forEach((t) => {
      const R = Math.max(0, piece.R(t) || 0);
      for (const ph of [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]) {
        const q = pointOn(ax.dir, ax.offset, t, R, ph, spec.profileSign);
        box.expandByPoint(new THREE.Vector3(q[0], q[1], q[2]));
      }
    });
  });
  if (box.isEmpty()) box.set(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
  return box;
}

function makeMat(color, opts) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.48,
    metalness: 0.04,
    side: THREE.DoubleSide,
    transparent: !!opts?.transparent,
    opacity: opts?.opacity ?? 1,
    flatShading: false
  });
}

function addAxisLine(group, from, to, color, width) {
  const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
  const mat = new THREE.LineBasicMaterial({ color, linewidth: width || 1 });
  group.add(new THREE.Line(geo, mat));
}

function rebuild3D(fit) {
  if (!scene) return;
  const p = currentPreset();
  const spec = activeSpec(p);
  clearGroup(solidGroup);
  clearGroup(overlayGroup);

  const phiEnd = currentPhiEnd(p);
  const Nt = state.playing ? 36 : 56;
  const Np = state.playing ? 36 : 64;
  const ax = spec.axis;

  (spec.pieces || []).forEach((piece) => {
    const geo = buildPieceGeometry(ax.dir, ax.offset, piece, spec.profileSign, phiEnd, Nt, Np);
    const hasInner = piece.r && linspace(piece.a, piece.b, 6).some((t) => (piece.r(t) || 0) > 1e-4);
    const mesh = new THREE.Mesh(geo, makeMat(hasInner ? SOLID_COL : SOLID_COL));
    if (p.compareWrong && state.wrongMode === "wrong") {
      mesh.material.dispose();
      mesh.material = makeMat(INNER_COL);
    }
    solidGroup.add(mesh);
  });

  if (state.showAxis) {
    const box = estimateSolidBox(spec);
    const pad = 0.15 * (box.max.clone().sub(box.min).length() || 1);
    if (ax.dir === "x") {
      addAxisLine(overlayGroup,
        new THREE.Vector3(box.min.x - pad, ax.offset, 0),
        new THREE.Vector3(box.max.x + pad, ax.offset, 0),
        0x8a3a2a, 2);
    } else {
      addAxisLine(overlayGroup,
        new THREE.Vector3(ax.offset, box.min.y - pad, 0),
        new THREE.Vector3(ax.offset, box.max.y + pad, 0),
        0x8a3a2a, 2);
    }
    addAxisLine(overlayGroup, new THREE.Vector3(box.min.x - pad, 0, 0), new THREE.Vector3(box.max.x + pad, 0, 0), 0x9a9488, 1);
    addAxisLine(overlayGroup, new THREE.Vector3(0, box.min.y - pad, 0), new THREE.Vector3(0, box.max.y + pad, 0), 0x9a9488, 1);
  }

  if (state.showSlice && spec.pieces && spec.pieces.length) {
    const [t0, t1] = tRange(spec);
    const t = t0 + state.sliceU * (t1 - t0);
    const { R, r } = radiiAt(spec, t);
    const ring = new THREE.RingGeometry(Math.max(r, 0.0008), Math.max(R, r + 0.002), 64, 1, 0, phiEnd);
    const slice = new THREE.Mesh(ring, makeMat(SLICE_COL, { transparent: true, opacity: 0.82 }));
    if (ax.dir === "x") {
      slice.rotation.y = Math.PI / 2;
      slice.position.set(t, ax.offset, 0);
      if (spec.profileSign < 0) slice.rotation.x = Math.PI;
    } else {
      slice.rotation.x = Math.PI / 2;
      slice.position.set(ax.offset, t, 0);
      if (spec.profileSign < 0) slice.rotation.y = Math.PI;
    }
    overlayGroup.add(slice);
  }

  if (fit) fitCamera(spec);
  updateAxisLabels();
}

function fitCamera(spec) {
  const box = estimateSolidBox(spec);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.8);
  const dist = maxDim * 2.15;
  camera.position.set(center.x + dist * 0.82, center.y + dist * 0.48, center.z + dist * 0.95);
  controls.target.copy(center);
  controls.minDistance = maxDim * 0.35;
  controls.maxDistance = maxDim * 12;
  controls.update();
  defaultCamPos.copy(camera.position);
  defaultCamTarget.copy(controls.target);
}

function resetView() {
  if (!camera) return;
  camera.position.copy(defaultCamPos);
  controls.target.copy(defaultCamTarget);
  controls.update();
}

function updateAxisLabels() {
  const layer = $("axisLabels");
  if (!layer || !camera || !renderer) return;
  const p = currentPreset();
  const spec = activeSpec(p);
  const box = estimateSolidBox(spec);
  const pad = 0.08 * (box.max.clone().sub(box.min).length() || 1);
  const pts = [
    { name: "x", v: new THREE.Vector3(box.max.x + pad, 0, 0) },
    { name: "y", v: new THREE.Vector3(0, box.max.y + pad, 0) }
  ];
  const ax = spec.axis;
  if (ax.dir === "x" && Math.abs(ax.offset) > 1e-6) {
    pts.push({ name: "y = " + fmt(ax.offset, 2), v: new THREE.Vector3(box.max.x + pad, ax.offset, 0) });
  }
  if (ax.dir === "y" && Math.abs(ax.offset) > 1e-6) {
    pts.push({ name: "x = " + fmt(ax.offset, 2), v: new THREE.Vector3(ax.offset, box.max.y + pad, 0) });
  }
  const w = renderer.domElement.clientWidth;
  const h = renderer.domElement.clientHeight;
  layer.innerHTML = "";
  pts.forEach((item) => {
    const v = item.v.clone().project(camera);
    if (v.z > 1) return;
    const el = document.createElement("span");
    el.className = "axis-tag";
    el.textContent = item.name;
    el.style.left = ((v.x * 0.5 + 0.5) * w) + "px";
    el.style.top = ((-v.y * 0.5 + 0.5) * h) + "px";
    layer.appendChild(el);
  });
}

function resize3D() {
  if (!renderer || !camera) return;
  const wrap = $("view3d").parentElement;
  const w = Math.max(100, wrap.clientWidth);
  const h = Math.max(100, wrap.clientHeight);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function init3D() {
  const canvas = $("view3d");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setClearColor(0xfbf8f1, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, 1, 0.05, 500);
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  scene.add(new THREE.HemisphereLight(0xf4efe4, 0x8a8478, 0.85));
  const key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(6, 10, 8);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe8dcc8, 0.35);
  fill.position.set(-6, 3, -4);
  scene.add(fill);
  solidGroup = new THREE.Group();
  overlayGroup = new THREE.Group();
  scene.add(solidGroup);
  scene.add(overlayGroup);
  resize3D();
  function loop(ts) {
    requestAnimationFrame(loop);
    if (state.playing) {
      if (!state.lastTs) state.lastTs = ts;
      const dt = Math.min(0.05, (ts - state.lastTs) / 1000);
      state.lastTs = ts;
      const p = currentPreset();
      const maxD = maxAngleDeg(p);
      state.angleDeg = Math.min(maxD, state.angleDeg + 50 * dt);
      $("angleSlider").value = String(Math.round(state.angleDeg));
      $("angleVal").textContent = fmtAngle(state.angleDeg);
      rebuild3D(false);
      if (state.angleDeg >= maxD - 0.05) {
        state.playing = false;
        $("btnPlay").setAttribute("aria-pressed", "false");
        $("btnPlay").textContent = "播放";
      }
    } else {
      state.lastTs = 0;
    }
    controls.update();
    updateAxisLabels();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(loop);
  window.addEventListener("resize", () => { resize3D(); resizeBoard(); });
  new ResizeObserver(() => { resize3D(); }).observe(canvas.parentElement);
}

/* ---------------- UI ---------------- */

function setView(view) {
  state.view = view;
  const views = $("views");
  views.classList.remove("both", "only2d", "only3d");
  views.classList.add(view === "2d" ? "only2d" : view === "3d" ? "only3d" : "both");
  document.querySelectorAll(".seg [data-view]").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.view === view ? "true" : "false");
  });
  requestAnimationFrame(() => {
    resize3D();
    if (state.view !== "3d") draw2D();
    resizeBoard();
  });
}

function scaffoldComplete(p) {
  if (!p.scaffold || !p.scaffold.length) return true;
  if (state.teacherUnlock) return true;
  return p.scaffold.every((_, i) => state.answers[p.id + ":" + i] === true);
}

function renderScaffold(p) {
  const box = $("scaffold");
  box.innerHTML = "";
  if (p.judgment) {
    p.judgments.forEach((j) => {
      const item = document.createElement("div");
      item.className = "sc-item";
      item.innerHTML = "<p></p><div class='sc-opts'></div><div class='sc-explain' hidden></div>";
      fillKatex(item.querySelector("p"), j.text);
      const opts = item.querySelector(".sc-opts");
      ["正確", "錯誤"].forEach((lab, k) => {
        const isYes = k === 0;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = lab;
        const chosen = state.judgments[j.id];
        if (chosen != null) {
          const userYes = chosen === "yes";
          if ((isYes && j.correct) || (!isYes && !j.correct)) {
            if ((isYes && userYes) || (!isYes && !userYes)) btn.dataset.state = "right";
          } else if ((isYes && userYes) || (!isYes && !userYes)) {
            btn.dataset.state = "wrong";
          }
        }
        btn.addEventListener("click", () => {
          state.judgments[j.id] = isYes ? "yes" : "no";
          renderChrome();
        });
        opts.appendChild(btn);
      });
      const ex = item.querySelector(".sc-explain");
      if (state.judgments[j.id] != null || state.teacherUnlock) {
        ex.hidden = false;
        const ok = (state.judgments[j.id] === "yes") === j.correct;
        fillKatex(ex, (j.correct ? "正確。" : "錯誤。") + " " + j.explain);
      }
      box.appendChild(item);
    });
    return;
  }
  (p.scaffold || []).forEach((s, i) => {
    const item = document.createElement("div");
    item.className = "sc-item";
    item.innerHTML = "<p></p><div class='sc-opts'></div><div class='sc-explain' hidden></div>";
    fillKatex(item.querySelector("p"), (i + 1) + ". " + s.q);
    const key = p.id + ":" + i;
    const chosen = state.answers[key];
    const pick = state.answers[key + ":pick"];
    const opts = item.querySelector(".sc-opts");
    s.options.forEach((opt, k) => {
      const btn = document.createElement("button");
      btn.type = "button";
      fillKatex(btn, opt);
      if (pick != null) {
        if (k === s.answer) btn.dataset.state = "right";
        else if (k === pick) btn.dataset.state = "wrong";
      }
      btn.addEventListener("click", () => {
        state.answers[key] = k === s.answer;
        state.answers[key + ":pick"] = k;
        renderChrome();
      });
      opts.appendChild(btn);
    });
    const ex = item.querySelector(".sc-explain");
    if ((chosen === true || chosen === false) && s.explain) {
      ex.hidden = false;
      fillKatex(ex, s.explain);
    }
    box.appendChild(item);
  });
}

function renderSpecial(p) {
  const wrap = $("specialWrap");
  wrap.innerHTML = "";
  if (p.compareAxes) {
    const lab = document.createElement("p");
    lab.className = "field-label";
    lab.textContent = "對照兩條軸";
    wrap.appendChild(lab);
    const seg = document.createElement("div");
    seg.className = "seg";
    [["a", " (a) 繞 x 軸"], ["b", " (b) 繞 y = 3"]].forEach(([id, labt]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = labt;
      btn.setAttribute("aria-pressed", state.comparePart === id ? "true" : "false");
      btn.addEventListener("click", () => { state.comparePart = id; mount(true); });
      seg.appendChild(btn);
    });
    wrap.appendChild(seg);
  }
  if (p.compareWrong) {
    const lab = document.createElement("p");
    lab.className = "field-label";
    lab.textContent = "正確圓環 / 錯誤模型";
    wrap.appendChild(lab);
    const seg = document.createElement("div");
    seg.className = "seg";
    [["correct", "正確：π(R²−r²)"], ["wrong", "錯誤：π(R−r)²"]].forEach(([id, labt]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = labt;
      btn.setAttribute("aria-pressed", state.wrongMode === id ? "true" : "false");
      btn.addEventListener("click", () => { state.wrongMode = id; mount(true); });
      seg.appendChild(btn);
    });
    wrap.appendChild(seg);
  }
  if (p.judgment) {
    const lab = document.createElement("p");
    lab.className = "field-label";
    lab.textContent = "立體對照（教師可切換）";
    wrap.appendChild(lab);
    const seg = document.createElement("div");
    seg.className = "seg";
    [["a", "(a) R₁ 繞 y 軸"], ["b", "(b) R₁ 繞 x 軸"], ["c", "(c) R₂ 繞 x=b（正確畫法）"], ["d", "(d) R₂ 繞 y=d"]].forEach(([id, labt]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = labt;
      btn.setAttribute("aria-pressed", state.assessView === id ? "true" : "false");
      btn.addEventListener("click", () => { state.assessView = id; mount(true); });
      seg.appendChild(btn);
    });
    wrap.appendChild(seg);
  }
}

function renderSliceBox(p, spec) {
  const box = $("sliceBox");
  if (!spec.pieces || !spec.pieces.length) { box.innerHTML = ""; return; }
  const [t0, t1] = tRange(spec);
  const t = t0 + state.sliceU * (t1 - t0);
  const { R, r, piece } = radiiAt(spec, t);
  const v = spec.varName || "x";
  const dt = "\\Delta " + v;
  const elem = r > 1e-6
    ? "\\pi(R^2-r^2)" + dt
    : "\\pi R^2" + dt;
  const half = p.turn === 0.5 && state.wrongMode !== "wrong" && !p.compareWrong ? "（本題為半圈時，再取一半）" : "";
  let html = "<p>薄片在 \\(" + v + "=" + fmt(t, 3) + "\\)。</p>";
  html += "<p>\\(R=" + fmt(R, 3) + "\\)" + (r > 1e-6 ? "，\\(r=" + fmt(r, 3) + "\\)" : "") + "，厚度 \\(" + dt + "\\)（示意）。</p>";
  html += "<p>體積元素：\\(" + elem + "\\)" + half + "</p>";
  if (piece && piece.tag === "solid") html += "<p>此段是實心圓盤。</p>";
  if (piece && piece.tag === "washer") html += "<p>此段是空心圓環。</p>";
  fillKatex(box, html);
  $("sliceVal").textContent = v + " = " + fmt(t, 3);
  $("sliceLabel").textContent = "薄片位置（沿 " + v + " 軸）";
}

function renderChrome() {
  const p = currentPreset();
  const spec = activeSpec(p);
  $("presetTitle").textContent = p.title;
  fillKatex($("stem"), p.stem || "");
  const prompt = state.mode === "intro" ? (p.studentPrompt || p.teacherPrompt) : (p.studentPrompt || "");
  fillKatex($("prompt"), prompt || "");
  fillKatex($("teacherTip"), "<p>" + (p.teacherTip || "") + "</p><p>" + (p.teacherPrompt || "") + "</p>");

  document.querySelectorAll(".modes button").forEach((btn) => {
    btn.setAttribute("aria-selected", btn.dataset.mode === state.mode ? "true" : "false");
  });

  const sel = $("preset");
  if (sel.dataset.mode !== state.mode) {
    sel.innerHTML = "";
    presetsForMode(state.mode).forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.textContent = (state.mode === "assess" && item.assessLabel) ? item.assessLabel : item.label;
      sel.appendChild(opt);
    });
    sel.dataset.mode = state.mode;
  }
  sel.value = state.presetId;

  renderSpecial(p);
  renderScaffold(p);

  const needs = p.scaffold && p.scaffold.length > 0;
  const done = scaffoldComplete(p);
  const showInt = !needs || done || state.revealedIntegral || state.teacherUnlock;
  const showAns = state.revealedAnswer || state.teacherUnlock;
  $("btnRevealIntegral").hidden = !needs;
  $("btnRevealAnswer").hidden = p.judgment || !p.hasVolume;
  $("btnTeacherReveal").hidden = p.mode === "intro" && !needs;

  const formula = $("formula");
  const answerBox = $("answerBox");
  if (p.hasVolume && showInt && p.integralTex) {
    formula.hidden = false;
    let latex = p.compareAxes
      ? (state.comparePart === "b" ? p.integralTexB : p.integralTex)
      : (p.compareWrong && state.wrongMode === "wrong" ? p.wrongIntegralTex : p.integralTex);
    if (p.partATex) latex = p.partATex + "\\\\[6pt]" + latex;
    renderDisplay(formula, latex);
  } else {
    formula.hidden = true;
    formula.innerHTML = "";
  }

  if (p.hasVolume && showAns && p.volumeValue != null && !(p.compareWrong && state.wrongMode === "wrong" && !showAns)) {
    answerBox.hidden = false;
    const texV = (p.compareAxes && state.comparePart === "b") ? p.volumeTexB
      : (p.compareWrong && state.wrongMode === "wrong") ? p.wrongVolumeTex
      : p.volumeTex;
    answerBox.innerHTML = '<div class="readout"><p class="lbl">體積</p><p class="val" id="volVal"></p></div>';
    if (p.compareAxes) {
      answerBox.innerHTML =
        '<div class="readout"><p class="lbl">(a) 繞 x 軸</p><p class="val" id="volA"></p></div>' +
        '<div class="readout"><p class="lbl">(b) 繞 y = 3</p><p class="val" id="volB"></p></div>';
      renderDisplay($("volA"), p.volumeTex);
      renderDisplay($("volB"), p.volumeTexB);
    } else if (p.compareWrong) {
      answerBox.innerHTML =
        '<div class="readout"><p class="lbl">正確</p><p class="val" id="volA"></p></div>' +
        '<div class="readout"><p class="lbl">錯誤模型</p><p class="val" id="volB"></p></div>';
      renderDisplay($("volA"), p.volumeTex);
      renderDisplay($("volB"), p.wrongVolumeTex);
    } else {
      renderDisplay($("volVal"), texV);
      if (p.wrongAxisTex) {
        const extra = document.createElement("div");
        extra.className = "readout";
        extra.innerHTML = '<p class="lbl">對照</p><p class="val" id="volW"></p>';
        answerBox.appendChild(extra);
        renderDisplay($("volW"), p.wrongAxisTex);
      }
    }
  } else {
    answerBox.hidden = true;
    answerBox.innerHTML = "";
  }

  const notes = $("notes");
  notes.innerHTML = "";
  const list = [];
  if (p.schematic) list.push({ t: "自製示意，非課本插圖。", quiet: true });
  (p.notes || []).forEach((n) => list.push({ t: n, quiet: false }));
  if (p.contrast101) list.push({ t: "對照 §10.1：求面積要在零點分段；繞 x 軸求體積時 [f(x)]² 恒為非負，一般不必只因穿軸而分段。", quiet: false });
  if (p.compareWrong) list.push({ t: "外平方減內平方，不是減完再平方。V＝V₁−V₂ 與圓環公式相同。", quiet: false });
  list.forEach((n) => {
    const el = document.createElement("p");
    el.className = "note" + (n.quiet ? " quiet" : "");
    fillKatex(el, n.t);
    notes.appendChild(el);
  });

  const legend = $("legend");
  if (p.judgment) {
    legend.innerHTML = '<span><i class="swatch" style="background:' + ABOVE + '"></i>R₁（曲線上方，靠 y 軸）</span>' +
      '<span><i class="swatch" style="background:' + BELOW + '"></i>R₂（曲線下方，靠 x = b）</span>';
  } else if (spec.hollow) {
    legend.innerHTML = '<span><i class="swatch" style="background:' + ABOVE + '"></i>生成區域</span>' +
      '<span><i class="swatch" style="background:' + SWAP + '"></i>典型圓環薄片</span>' +
      '<span>赭色線：旋轉軸</span>';
  } else {
    legend.innerHTML = '<span><i class="swatch" style="background:' + ABOVE + '"></i>生成區域</span>' +
      '<span><i class="swatch" style="background:' + SWAP + '"></i>典型圓盤薄片</span>' +
      '<span>赭色線：旋轉軸</span>';
  }

  const maxD = maxAngleDeg(p);
  $("angleSlider").max = String(maxD);
  if (state.angleDeg > maxD) state.angleDeg = maxD;
  $("angleSlider").value = String(Math.round(state.angleDeg));
  $("angleVal").textContent = fmtAngle(state.angleDeg);
  $("sliceSlider").value = String(Math.round(state.sliceU * 1000));
  $("chkRegion").checked = state.showRegion;
  $("chkAxis").checked = state.showAxis;
  $("chkSlice").checked = state.showSlice;
  $("chkCutaway").checked = state.cutaway;
  $("chkCutaway").parentElement.style.display = (spec.hollow || p.compareWrong || p.judgment) ? "" : "none";
  renderSliceBox(p, spec);
}

function syncHash() {
  const want = state.hashAlias || state.presetId;
  if (location.hash.replace(/^#/, "") !== want) {
    history.replaceState(null, "", "#" + want);
  }
}

function setMode(mode, keepPreset) {
  state.mode = mode;
  if (!keepPreset) {
    const list = presetsForMode(mode);
    if (!list.some((p) => p.id === state.presetId)) {
      setPreset(list[0].id, false);
      return;
    }
  }
  renderChrome();
}

function setPreset(id, fromHash) {
  const p = findPreset(id);
  if (!p) return;
  const resolved = HASH_ALIASES[id] ? HASH_ALIASES[id] : (p.id);
  state.presetId = resolved;
  state.hashAlias = (id !== resolved) ? id : null;
  if (id === "assess-2") state.mode = "assess";
  else if (state.mode === "assess" && p.alsoIn && p.alsoIn.includes("assess")) state.mode = "assess";
  else state.mode = p.mode;
  state.revealedIntegral = !(p.scaffold && p.scaffold.length);
  state.revealedAnswer = false;
  state.teacherUnlock = false;
  state.playing = false;
  state.sliceU = 0.45;
  state.comparePart = "a";
  state.wrongMode = "correct";
  state.assessView = "a";
  const hollowish = !!(p.hollow || p.compareWrong || p.compareAxes);
  state.cutaway = hollowish;
  state.angleDeg = hollowish ? maxAngleDeg(p) : Math.max(20, maxAngleDeg(p) * 0.85);
  $("btnPlay").setAttribute("aria-pressed", "false");
  $("btnPlay").textContent = "播放";
  syncHash();
  mount(true);
}

function bootFromHash() {
  const raw = location.hash.replace(/^#/, "");
  if (!raw) return;
  const p = findPreset(raw);
  if (p) {
    state.hashAlias = HASH_ALIASES[raw] ? raw : null;
    state.presetId = p.id;
    state.mode = raw === "assess-2" ? "assess" : p.mode;
  }
}

function mount(fit) {
  renderChrome();
  draw2D();
  rebuild3D(fit);
}

function selfCheck() {
  const failed = [];
  PRESETS.forEach((p) => {
    if (!p.hasVolume || p.volumeValue == null) return;
    const num = numericalVolume(p);
    if (!almostEqual(num, p.volumeValue, 3e-3, 4e-4)) {
      failed.push(p.id + ": expected " + p.volumeValue + ", got " + num);
    }
    if (p.volumeValueB != null) {
      const numB = numericalVolume({ pieces: p.piecesB, turn: 1, simpsonN: p.simpsonN });
      if (!almostEqual(numB, p.volumeValueB, 3e-3, 4e-4)) {
        failed.push(p.id + " (b): expected " + p.volumeValueB + ", got " + numB);
      }
    }
  });
  const a1010 = findPreset("a-10.10");
  if (a1010.pieces[0].a !== 1) failed.push("10.10 lower limit is not 1");
  const b1015 = findPreset("b-10.15");
  if (b1015.splitAt !== 2 || b1015.pieces[0].b !== 2 || b1015.pieces[1].a !== 2) {
    failed.push("10.15 must split at y=2");
  }
  return failed;
}

function ready() {
  if (!window.JXG || !window.katex) {
    document.querySelector(".stage").insertAdjacentHTML(
      "afterbegin",
      '<p class="cdn-fail">圖形或公式套件未能載入。請檢查網絡後重新整理。亦可改用校內已允許的 jsDelivr / cdnjs。</p>'
    );
    return;
  }
  JXG.Options.text.fontSize = 14;
  JXG.Options.text.display = "html";
  JXG.Options.text.useKatex = false;
  JXG.Options.navbar.showCopyright = false;

  const tabs = $("modeTabs");
  MODE_ORDER.forEach((m) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.dataset.mode = m;
    btn.textContent = MODE_LABELS[m];
    btn.addEventListener("click", () => setMode(m, false));
    tabs.appendChild(btn);
  });

  const rawHash = location.hash.replace(/^#/, "");
  if (rawHash && findPreset(rawHash)) {
    // setPreset applies cutaway / angle defaults and mounts
    state.presetId = findPreset(rawHash).id;
  }
  const failed = selfCheck();
  if (failed.length) {
    document.querySelector(".stage").insertAdjacentHTML(
      "afterbegin",
      '<p class="check-fail">內部數值自檢未通過，請勿使用本頁數字作課堂答案，並通知馬Sir。</p>'
    );
    console.error("自檢失敗", failed);
  } else {
    console.log("旋轉體積實驗室 自檢通過：" + PRESETS.filter((p) => p.hasVolume).length + " 項有體積的預設");
  }

  init3D();
  if (rawHash && findPreset(rawHash)) setPreset(rawHash, true);
  else mount(true);

  $("preset").addEventListener("change", (e) => setPreset(e.target.value));
  document.querySelectorAll(".seg [data-view]").forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.view));
  });
  $("btnPlay").addEventListener("click", () => {
    const p = currentPreset();
    if (state.angleDeg >= maxAngleDeg(p) - 0.5) state.angleDeg = 0;
    state.playing = true;
    $("btnPlay").setAttribute("aria-pressed", "true");
    $("btnPlay").textContent = "播放中";
  });
  $("btnPause").addEventListener("click", () => {
    state.playing = false;
    $("btnPlay").setAttribute("aria-pressed", "false");
    $("btnPlay").textContent = "播放";
  });
  $("angleSlider").addEventListener("input", (e) => {
    state.playing = false;
    $("btnPlay").setAttribute("aria-pressed", "false");
    $("btnPlay").textContent = "播放";
    state.angleDeg = Number(e.target.value);
    $("angleVal").textContent = fmtAngle(state.angleDeg);
    rebuild3D(false);
  });
  $("sliceSlider").addEventListener("input", (e) => {
    state.sliceU = Number(e.target.value) / 1000;
    renderChrome();
    draw2D();
    rebuild3D(false);
  });
  $("chkRegion").addEventListener("change", (e) => { state.showRegion = e.target.checked; draw2D(); });
  $("chkAxis").addEventListener("change", (e) => { state.showAxis = e.target.checked; draw2D(); rebuild3D(false); });
  $("chkSlice").addEventListener("change", (e) => { state.showSlice = e.target.checked; draw2D(); rebuild3D(false); });
  $("chkCutaway").addEventListener("change", (e) => { state.cutaway = e.target.checked; rebuild3D(false); });
  $("resetView").addEventListener("click", resetView);
  $("btnRevealIntegral").addEventListener("click", () => {
    const p = currentPreset();
    if (!scaffoldComplete(p)) {
      $("prompt").textContent = "請先完成上面的判斷，再顯示積分。";
      return;
    }
    state.revealedIntegral = true;
    renderChrome();
  });
  $("btnRevealAnswer").addEventListener("click", () => {
    const p = currentPreset();
    if (!scaffoldComplete(p) && (p.scaffold && p.scaffold.length)) {
      $("prompt").textContent = "請先完成判斷並顯示積分，再看答案。";
      return;
    }
    state.revealedIntegral = true;
    state.revealedAnswer = true;
    renderChrome();
  });
  $("btnTeacherReveal").addEventListener("click", () => {
    state.teacherUnlock = true;
    state.revealedIntegral = true;
    state.revealedAnswer = true;
    const p = currentPreset();
    if (p.judgment) {
      p.judgments.forEach((j) => { state.judgments[j.id] = j.correct ? "yes" : "no"; });
    }
    (p.scaffold || []).forEach((s, i) => { state.answers[p.id + ":" + i] = true; });
    renderChrome();
  });
  window.addEventListener("hashchange", () => {
    const raw = location.hash.replace(/^#/, "");
    if (raw && findPreset(raw) && (raw === state.hashAlias || findPreset(raw).id === state.presetId)) {
      return;
    }
    if (raw && findPreset(raw)) setPreset(raw, true);
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
else ready();
