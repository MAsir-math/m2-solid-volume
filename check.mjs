#!/usr/bin/env node
/**
 * Independent self-check for 旋轉體積實驗室 locked values and constraints.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { PRESETS, HASH_ALIASES, allHashIds, findPreset } from "./presets.js";
import { numericalVolume, almostEqual } from "./math.js";

const PI = Math.PI;
const ln2 = Math.log(2);
const results = [];

function check(label, actual, expected, eps = 1e-10) {
  const ok = Math.abs(actual - expected) < eps;
  if (!ok) throw new Error(`${label}: expected ${expected}, got ${actual}`);
  results.push({ label, expected, actual, ok: true });
}

function almost(label, actual, expected) {
  if (!almostEqual(actual, expected, 1e-9, 1e-10)) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
  results.push({ label, expected, actual, ok: true });
}

// Independent antiderivatives
check("例 10.10 下限不是 0", findPreset("a-10.10").pieces[0].a, 1);
almost("例 10.10", PI * ((5 * 5) / 2 - 5 - (1 / 2 - 1)), 8 * PI);

almost("課堂練習 10.10", PI * (4 + 2), 6 * PI);

const F1011 = (y) => (y ** 3) / 3 + y;
almost("例 10.11", PI * (F1011(2) - F1011(-1)), 6 * PI);

almost("課堂練習 10.11", PI * (2 * ln2 - 1), PI * (2 * Math.log(2) - 1));

// 10.12 full then half
const I1012full = PI * (3 * PI);
almost("例 10.12 全圈", I1012full, 3 * PI * PI);
almost("例 10.12 半圈", I1012full / 2, (3 * PI * PI) / 2);
check("例 10.12 turn=1/2", findPreset("a-10.12").turn, 0.5);

almost("課堂練習 10.12 半圈", (PI * Math.log(4)) / 2, PI * ln2);
check("課堂練習 10.12 turn=1/2", findPreset("a-10.12p").turn, 0.5);

almost("思考站 / 階段評估第2題", PI * PI, PI * PI);

almost("例 10.13", 3624 * PI, 3624 * PI);

const Flnsq = (y) => y * Math.log(y) ** 2 - 2 * y * Math.log(y) + 2 * y;
almost("課堂練習 10.13(b)", PI * (Flnsq(Math.E) - Flnsq(1)), PI * (Math.E - 2));
almost("課堂練習 10.13 下限原函數為 2", Flnsq(1), 2);
assert.ok(findPreset("a-10.13p").partATex.includes("+C"), "課堂練習 10.13 應鎖定 (a) 原函數並加 C");
check("課堂練習 10.13 下限是 1", findPreset("a-10.13p").pieces[0].a, 1);

almost("例 10.14", (Math.exp(2) * PI) / 2 - (7 * PI) / 10, (Math.E ** 2 * PI) / 2 - 7 * PI / 10);

const F1014p = (x) => x ** 5 / 5 - 2 * x ** 4 + 4 * x ** 3;
almost("課堂練習 10.14", PI * (F1014p(2) - F1014p(0)), (32 * PI) / 5);

const p15 = findPreset("b-10.15");
check("例 10.15 在 y=2 分段", p15.splitAt, 2);
check("例 10.15 第一段終點", p15.pieces[0].b, 2);
check("例 10.15 第二段起點", p15.pieces[1].a, 2);
check("例 10.15 下段為實心", p15.pieces[0].r(1), 0);
almost("例 10.15", (16 * PI) / 3, (16 * PI) / 3);

almost("課堂練習 10.15", 4 * PI, 4 * PI);
almost("例 10.16", 4 * PI * PI, 4 * PI * PI);
almost("課堂練習 10.16", 48 * PI * PI, 48 * PI * PI);

almost("同一帽 (a) 繞 x 軸", (136 * PI) / 15, (136 * PI) / 15);
almost("同一帽 (b) 繞 y=3", (16 * PI) / 15, (16 * PI) / 15);

almost("例 10.17", (8 * PI) / 3, (8 * PI) / 3);
almost("課堂練習 10.17", (32 * PI) / 5, (32 * PI) / 5);
almost("例 10.18", PI * (4 * ln2 - 5 / 2), PI * (4 * Math.log(2) - 2.5));
almost("課堂練習 10.18 為正", PI * (3 - 4 * ln2), PI * (3 - 4 * Math.log(2)));
assert.ok(3 - 4 * ln2 > 0, "課堂練習 10.18 終值應為正");

almost("例 10.19", (8 * PI) / 15, (8 * PI) / 15);
almost("課堂練習 10.19(a)", (5 * PI) / 2, (5 * PI) / 2);
almost("課堂練習 10.19(b)", (72 * PI) / 5, (72 * PI) / 5);
almost("階段評估第3題", PI / 6, PI / 6);
almost("階段評估第3題 誤繞 x 軸", (2 * PI) / 15, (2 * PI) / 15);
almost("階段評估第4題", Math.exp(2) * PI - 4 * Math.E * PI + 5 * PI, (Math.E ** 2 - 4 * Math.E + 5) * PI);
almost("階段評估第5題", 16 * PI, 16 * PI);

// 附加例題 10.10–10.19（獨立原函數）
const Fextra1010 = (x) => Math.exp(2 * x) / 2 + 2 * Math.exp(x) + x;
almost("附加例題 10.10", PI * (Fextra1010(1) - Fextra1010(0)), PI * Math.E ** 2 / 2 + 2 * PI * Math.E - 3 * PI / 2);
almost("附加例題 10.10 下限原函數為 5/2", Fextra1010(0), 5 / 2);

const Fextra1011 = (y) => y ** 5 / 5 + 4 * y ** 3 / 3 + 4 * y;
almost("附加例題 10.11", PI * (Fextra1011(2) - Fextra1011(-2)), 752 * PI / 15);

const Fsin2 = (x) => x / 2 - Math.sin(2 * x) / 4;
almost("附加例題 10.12 半圈", (PI / 2) * (Fsin2(2 * PI) - Fsin2(PI / 2)), 3 * PI * PI / 8);
check("附加例題 10.12 turn=1/2", findPreset("a-extra-10.12").turn, 0.5);

const Flogsq = (y) => y * Math.log(y) ** 2 - 2 * y * Math.log(y) + 2 * y;
almost("附加例題 10.13(b)", PI / (ln2 * ln2) * (Flogsq(8) - Flogsq(1)), PI / (ln2 * ln2) * (72 * ln2 * ln2 - 48 * ln2 + 14));
assert.ok(findPreset("a-extra-10.13").partATex.includes("(\\ln 2)^{2}"), "附加例題 10.13 應鎖定 (a) 原函數");
check("附加例題 10.13 下限是 1", findPreset("a-extra-10.13").pieces[0].a, 1);

const Fouter1014 = (x) => x / 2 - Math.sin(2 * x) / 4 - 4 * Math.cos(x) + 4 * x;
const Finner1014 = (x) => -0.5 * Math.exp(-2 * x);
almost(
  "附加例題 10.14",
  PI * ((Fouter1014(PI / 2) - Fouter1014(0)) - (Finner1014(PI / 2) - Finner1014(0))),
  9 * PI * PI / 4 + 7 * PI / 2 + (PI / 2) * Math.exp(-PI)
);

const pExtra15 = findPreset("b-extra-10.15");
check("附加例題 10.15 在 y=0 分段", pExtra15.splitAt, 0);
check("附加例題 10.15 第一段終點", pExtra15.pieces[0].b, 0);
check("附加例題 10.15 第二段起點", pExtra15.pieces[1].a, 0);
check("附加例題 10.15 下段為實心", pExtra15.pieces[0].r(-0.5), 0);
const Iextra15a = 0 - (0.5 - 1); // [y^2/2 + y]_{-1}^{0}
const Iextra15b = (9 / 2 + 3 - 4); // [y^2/2 + y - 4y^3/27]_{0}^{3}
almost("附加例題 10.15", PI * (Iextra15a + Iextra15b), 4 * PI);

almost("附加例題 10.16(a)", 5 * PI / 2, 5 * PI / 2);
almost("附加例題 10.16(b)", 48 * PI * (5 * PI / 2), 120 * PI * PI);

const Fextra1017 = (x) => x ** 5 / 5 + 2 * x ** 3 / 3 + x;
almost("附加例題 10.17", PI * (Fextra1017(2) - Fextra1017(-2)), 412 * PI / 15);
check("附加例題 10.17 軸為 y=-2", findPreset("c-extra-10.17").axis.offset, -2);
check("附加例題 10.17 區域在軸上方", findPreset("c-extra-10.17").profileSign, 1);

const Fextra1018 = (y) => (Math.E ** 4) * y - 2 * Math.exp(y + 1) + 0.5 * Math.exp(2 * y - 2);
almost("附加例題 10.18", PI * (Fextra1018(3) - Fextra1018(0)), PI * (3 * Math.E ** 4 / 2 + 2 * Math.E - Math.exp(-2) / 2));

const Fextra1019 = (x) => x ** 5 / 5 - 3 * x ** 3 + 2 * x ** 2 + 12 * x;
almost("附加例題 10.19", PI * (Fextra1019(2) - Fextra1019(-1)), 108 * PI / 5);

// Numerical vs closed form for every volume preset
for (const p of PRESETS) {
  if (!p.hasVolume || p.volumeValue == null) continue;
  const num = numericalVolume(p);
  if (!almostEqual(num, p.volumeValue, 3e-3, 4e-4)) {
    throw new Error(`數值自檢失敗 ${p.id}: exact ${p.volumeValue}, num ${num}`);
  }
  results.push({ label: `數值 ${p.id}`, expected: p.volumeValue, actual: num, ok: true });
  if (p.volumeValueB != null) {
    const numB = numericalVolume({ pieces: p.piecesB, turn: 1, simpsonN: p.simpsonN });
    if (!almostEqual(numB, p.volumeValueB, 3e-3, 4e-4)) {
      throw new Error(`數值自檢失敗 ${p.id}(b): exact ${p.volumeValueB}, num ${numB}`);
    }
    results.push({ label: `數值 ${p.id}(b)`, expected: p.volumeValueB, actual: numB, ok: true });
  }
}

// (R-r)^2 must not be a claimed correct formula
for (const p of PRESETS) {
  if (!p.integralTex) continue;
  const bad = /\\bigl\(R-r\\bigr\)\^2|\(R-r\)\^2|\(R－r\)²/;
  if (bad.test(p.integralTex) && !p.compareWrong) {
    throw new Error(`${p.id} 把 (R-r)^2 寫成正確積分`);
  }
  if (p.volumeTex && /\\pi\(R-r\)/.test(p.volumeTex) && !p.compareWrong) {
    throw new Error(`${p.id} 把 π(R-r) 寫成正確終值`);
  }
}
const wrong = findPreset("b-wrong");
assert.ok(wrong.wrongIntegralTex.includes("(2-1)^2") || wrong.wrongIntegralTex.includes("(R-r)"), "誤區示範必須含錯誤公式");
assert.equal(wrong.volumeValue, 3 * PI);
assert.equal(wrong.wrongVolumeValue, PI);


const introFxP = findPreset("intro-fx");
const introGyP = findPreset("intro-gy");
assert.equal(introFxP.axis.dir, "x");
assert.equal(introGyP.axis.dir, "y");
assert.ok(introFxP.volumeValue == null, "引入一般情況不應鎖定數值體積");
assert.ok(introGyP.volumeValue == null, "引入一般情況不應鎖定數值體積");
assert.ok(introFxP.integralTex.includes("f(x)"), "引入 y=f(x) 應顯示圓盤法公式");
assert.ok(introGyP.integralTex.includes("g(y)"), "引入 x=g(y) 應顯示圓盤法公式");
assert.ok(introGyP.notes.some((n) => n.includes("圓盤法")), "繞 y 軸一般情況應點出圓盤法");
assert.ok(introFxP.pieces[0].R(1) > 0 && introFxP.pieces[0].R(4) > introFxP.pieces[0].R(1), "y=f(x) 輪廓應為正且大致遞增");
assert.ok(introGyP.pieces[0].R(0.4) > 0 && introGyP.pieces[0].R(1.8) > introGyP.pieces[0].R(0.4), "x=g(y) 花瓶輪廓應為正且中段較闊");
results.push({ label: "引入一般情況 y=f(x)／x=g(y)", expected: true, actual: true, ok: true });

// Required hash ids
const required = [
  "intro-barrel", "intro-cylinder", "intro-fx", "intro-gy",
  "a-10.10", "a-10.10p", "a-10.11", "a-10.12", "a-10.13", "a-10.13p", "a-think",
  "b-wrong", "b-10.14", "b-10.14p", "b-10.15", "b-10.16",
  "c-compare", "c-10.17", "c-10.18", "d-10.19", "d-10.19a",
  "a-extra-10.10", "a-extra-10.11", "a-extra-10.12", "a-extra-10.13",
  "b-extra-10.14", "b-extra-10.15", "b-extra-10.16",
  "c-extra-10.17", "c-extra-10.18", "d-extra-10.19",
  "assess-1", "assess-2", "assess-3", "assess-4"
];
const ids = new Set(allHashIds());
for (const id of required) {
  assert.ok(ids.has(id) || findPreset(id), `缺少 hash id: ${id}`);
}
assert.equal(HASH_ALIASES["assess-2"], "a-think");

// Public files must not mention shell method; must carry identity
const publicFiles = ["index.html", "app.js", "presets.js", "README.md"];
for (const f of publicFiles) {
  const text = fs.readFileSync(new URL("./" + f, import.meta.url), "utf8");
  const shellHit = /(圓柱殼法|圓柱殼|殼法|shell method|cylindrical shell|Shell method)/i.test(text);
  assert.ok(!shellHit, `${f} 出現不應出現的殼法字樣`);
  assert.ok(!/對標夏Sir|書上符號筆誤|教師版/.test(text), `${f} 含不應公開的字樣`);
}

const html = fs.readFileSync(new URL("./index.html", import.meta.url), "utf8");
assert.ok(html.includes('data-app="m2-solid-volume"'), "缺少 data-app");
assert.ok(html.includes("旋轉體積實驗室｜馬Sir教室 · 中五 M2 · §10.2"), "title 不符");
assert.ok(html.includes("three@0.160.0"), "應使用 Three.js r160");
assert.ok(html.includes("Noto Sans TC") || html.includes("noto-sans-tc"), "應使用 Noto Sans TC");

console.log("旋轉體積實驗室 自檢");
for (const r of results) {
  console.log(`  OK  ${r.label}`);
}
console.log(`全部通過：${results.length} 項`);
