/**
 * Locked textbook presets for 旋轉體積實驗室 (§10.2).
 * Disk / washer method only. No arbitrary function input.
 */

const PI = Math.PI;
const ln2 = Math.log(2);
const SQRT2 = Math.SQRT2;

function sq(x) { return x * x; }

/** Schematic profile for 圖 10.1: increasing, slightly concave, like y=f(x) on [1, 4]. */
function introFx(x) {
  return 0.7 + 1.15 / (1 + Math.exp(-3 * ((x - 1) / 3 - 0.45)));
}

/** Schematic vase profile for the y-axis general case, y on [0.4, 3.2]. */
function introGy(y) {
  const t = (y - 0.4) / 2.8;
  return 0.65 + 0.22 * t + 0.42 * Math.sin(Math.PI * t) - 0.08 * Math.sin(2 * Math.PI * t);
}


export const HASH_ALIASES = {
  "assess-2": "a-think"
};

export const MODE_ORDER = ["intro", "A", "B", "C", "assess"];

export const MODE_LABELS = {
  intro: "引入",
  A: "A 圓盤法",
  B: "B 圓環法",
  C: "C／D 平行軸",
  assess: "階段評估"
};

export const PRESETS = [
  // ---------- 引入 ----------
  {
    id: "intro-barrel",
    mode: "intro",
    label: "封面酒桶（自製示意）",
    title: "封面酒桶",
    stem: "一條中間較闊、兩端較窄的輪廓，繞 y 軸旋轉，看起來像酒桶。這是自製示意，不是課本插圖，課堂引入只看動畫，不求酒桶體積。",
    schematic: true,
    hasVolume: false,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 2.4, R: (y) => 0.72 + 0.42 * Math.sin(PI * (y / 2.4)), r: () => 0 }],
    curves: [{ type: "xofy", g: (y) => 0.72 + 0.42 * Math.sin(PI * (y / 2.4)), domain: [0, 2.4] }],
    region: { kind: "xofy", inner: () => 0, outer: (y) => 0.72 + 0.42 * Math.sin(PI * (y / 2.4)), c: 0, d: 2.4 },
    bbox: [-2.4, 3.05, 2.4, -0.45],
    limitsTex: "示意",
    teacherPrompt: "先讓學生看輪廓怎樣「掃」出立體。這一步只建立旋轉的畫面，不要在引入就對酒桶列積分。",
    studentPrompt: "想像把左邊這條輪廓繞著豎直的 y 軸轉一圈。中間較闊的地方，轉出來的圓片半徑也較大。",
    notes: [],
    scaffold: [],
    teacherTip: "開普勒曾用類似想法估計酒桶體積。進入正式課程時，先用下一個「圓柱」說明：每片薄片都是圓盤，半徑若隨位置改變，就把半徑寫成函數。"
  },
  {
    id: "intro-cylinder",
    mode: "intro",
    label: "長方形繞 x 軸成圓柱",
    title: "圓柱：圓盤法的原型",
    stem: "長為 \\(\\ell=3\\)、高為 \\(r=1\\) 的長方形，繞 x 軸旋轉一圈，得到圓柱。體積是 \\(\\pi r^2 \\ell = 3\\pi\\)（自製示意）。",
    schematic: true,
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 3, R: () => 1, r: () => 0 }],
    volumeTex: "3\\pi",
    volumeValue: 3 * PI,
    integralTex: "V=\\pi r^2\\ell=\\pi\\cdot 1^2\\cdot 3=3\\pi",
    curves: [
      { type: "hline", y: 1, domain: [0, 3] },
      { type: "vline", x: 0 },
      { type: "vline", x: 3 }
    ],
    region: { kind: "yofx", lower: () => 0, upper: () => 1, a: 0, b: 3 },
    bbox: [-0.8, 2.4, 4.2, -1.6],
    limitsTex: "[0,3]",
    teacherPrompt: "圓柱可以看成許多厚度為 \\(\\Delta x\\)、半徑同為 \\(r\\) 的薄圓盤疊起來。",
    studentPrompt: "若高不再是常數 \\(r\\)，而變成函數 \\(f(x)\\)，薄片仍然是圓盤，只是半徑改為 \\(f(x)\\)，體積元素就是 \\(\\pi\\bigl[f(x)\\bigr]^2\\Delta x\\)。",
    notes: ["漏 \\(\\pi\\)：圓盤面積是 \\(\\pi R^2\\)，不要只寫 \\(R^2\\Delta x\\)。"],
    scaffold: [],
    teacherTip: "這是圓盤法的原型。下一題用圖 10.1 的一般情況：把高改成函數 \(y=f(x)\)，薄片仍然是圓盤。"
  },
  {
    id: "intro-fx",
    mode: "intro",
    label: "圖 10.1 — y = f(x)、x 軸與 x = a, b，繞 x 軸",
    title: "一般情況：y = f(x) 繞 x 軸",
    stem: "圖 10.1：陰影區域由曲線 \\(y=f(x)\\)、x 軸及直線 \\(x=a\\)、\\(x=b\\) 所圍。若該區域繞 x 軸旋轉一周，便得到一個實心旋轉體。本頁只示範形狀與典型圓盤，不鎖定某個具體函數的數值體積。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 1, b: 4, R: introFx, r: () => 0 }],
    integralTex: "V=\\pi\\int_{a}^{b}\\bigl[f(x)\\bigr]^2\\,dx\\quad\\text{或}\\quad \\pi\\int_{a}^{b} y^2\\,dx",
    sliceRadiusLabel: "f(x)",
    curves: [
      { type: "yofx", f: introFx, domain: [1, 4] },
      { type: "vline", x: 1 },
      { type: "vline", x: 4 }
    ],
    region: { kind: "yofx", lower: () => 0, upper: introFx, a: 1, b: 4 },
    boardLabels: [
      { x: 1, y: -0.32, text: "a" },
      { x: 4, y: -0.32, text: "b" },
      { x: 3.15, y: introFx(3.15) + 0.28, text: "y = f(x)", anchorX: "left" }
    ],
    bbox: [-0.7, 2.7, 5.3, -1.5],
    limitsTex: "[a,b]",
    teacherPrompt: "先對照長方形：高不再是常數，而是 \\(f(x)\\)。每一片厚度為 \\(\\Delta x\\) 的薄片，轉出來仍是圓盤，半徑為 \\(f(x)\\)，體積元素是 \\(\\pi[f(x)]^2\\Delta x\\)。把這些圓盤加起來，再取極限，就得到積分。",
    studentPrompt: "想像把左邊的陰影區域繞 x 軸轉一圈。薄片的半徑隨 \\(x\\) 改變，但形狀仍然是圓盤。",
    notes: ["圓盤面積是 \\(\\pi R^2\\)，這裡 \\(R=f(x)\\)。", "旋轉軸沿 x 方向，所以對 x 積分。"],
    scaffold: [],
    teacherTip: "講完這個 general case，下一題看繞 y 軸、曲線寫成 \\(x=g(y)\\) 的情況，再總結為圓盤法。"
  },
  {
    id: "intro-gy",
    mode: "intro",
    label: "一般情況 — x = g(y)、y = c, d，繞 y 軸",
    title: "一般情況：x = g(y) 繞 y 軸",
    stem: "同理，若旋轉軸是 y 軸：陰影區域在曲線 \\(x=g(y)\\) 與 y 軸之間，\\(y\\) 由 \\(c\\) 到 \\(d\\)。繞 y 軸旋轉一周，薄片是垂直於 y 軸的圓盤，半徑為 \\(g(y)\\)。本頁示範形狀後，把兩種情況總結為圓盤法。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0.4, b: 3.2, R: introGy, r: () => 0 }],
    integralTex: "V=\\pi\\int_{c}^{d}\\bigl[g(y)\\bigr]^2\\,dy\\quad\\text{或}\\quad \\pi\\int_{c}^{d} x^2\\,dy",
    sliceRadiusLabel: "g(y)",
    curves: [
      { type: "xofy", g: introGy, domain: [0.4, 3.2] },
      { type: "hline", y: 0.4, domain: [0, introGy(0.4)] },
      { type: "hline", y: 3.2, domain: [0, introGy(3.2)] }
    ],
    region: { kind: "xofy", inner: () => 0, outer: introGy, c: 0.4, d: 3.2 },
    boardLabels: [
      { x: -0.22, y: 0.4, text: "c", anchorX: "right" },
      { x: -0.22, y: 3.2, text: "d", anchorX: "right" },
      { x: introGy(2.15) + 0.18, y: 2.15, text: "x = g(y)", anchorX: "left" }
    ],
    bbox: [-2.3, 3.85, 2.3, -0.45],
    limitsTex: "[c,d]",
    teacherPrompt: "對 y 積分。體積元素是 \\(\\pi[g(y)]^2\\Delta y\\)。講完兩個 general case，就可以點題：上述求旋轉體體積的方法稱為圓盤法。用圓盤法時，所選的自變量（\\(x\\) 或 \\(y\\)）取決於以哪一條坐標軸為旋轉軸。",
    studentPrompt: "對照上一題：現在軸是 y 軸，半徑改為水平距離 \\(g(y)\\)，薄片仍然是圓盤。這兩種情況合稱圓盤法。",
    notes: [
      "兩個公式只是變量不同：\\(V=\\pi\\int_a^b [f(x)]^2\\,dx\\) 或 \\(V=\\pi\\int_c^d [g(y)]^2\\,dy\\)。",
      "這種方法稱為圓盤法。",
      "所選自變量取決於以哪一條坐標軸為旋轉軸。"
    ],
    scaffold: [],
    teacherTip: "到這裏可以點出名稱「圓盤法」，然後進入模式 A 的例題。"
  },

  // ---------- A 圓盤法 ----------
  {
    id: "a-10.10",
    mode: "A",
    label: "例 10.10 — y = √(x−1)，x 軸、x = 5，繞 x 軸",
    title: "例 10.10",
    stem: "由 \\(y=\\sqrt{x-1}\\)、x 軸及 \\(x=5\\) 所圍的區域，繞 x 軸旋轉一周。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 1, b: 5, R: (x) => Math.sqrt(x - 1), r: () => 0 }],
    volumeTex: "8\\pi",
    volumeValue: 8 * PI,
    integralTex: "V=\\pi\\int_{1}^{5}\\bigl(\\sqrt{x-1}\\bigr)^2\\,dx=\\pi\\int_{1}^{5}(x-1)\\,dx=8\\pi",
    curves: [
      { type: "yofx", f: (x) => Math.sqrt(Math.max(0, x - 1)), domain: [1, 5.2] },
      { type: "vline", x: 5 }
    ],
    region: { kind: "yofx", lower: () => 0, upper: (x) => Math.sqrt(Math.max(0, x - 1)), a: 1, b: 5 },
    bbox: [-0.7, 2.7, 6.2, -1.3],
    limitsTex: "[1,5]",
    teacherPrompt: "下限是曲線與 x 軸的交點 \\(x=1\\)，不是 0。",
    studentPrompt: "先判斷旋轉軸、實心或空心、積分變量、半徑和上下限，再寫積分。",
    notes: ["下限是交點 \\(x=1\\)，不是 0。", "繞 x 軸時，通常對 x 積分，半徑是鉛垂距離。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["x 軸", "y 軸", "x=5"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 x 積分", "對 y 積分"], answer: 0, explain: "軸沿 x 方向，薄片垂直於 x 軸，所以對 x 積分。" },
      { q: "半徑是什麼？", options: ["\\(R=\\sqrt{x-1}\\)", "\\(R=x-1\\)", "\\(R=x\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\([0,5]\\)", "\\([1,5]\\)", "\\([0,1]\\)"], answer: 1, explain: "曲線在 \\(x=1\\) 才接到 x 軸，下限不是 0。" }
    ],
    teacherTip: "投影時先停在「下限是 1 不是 0」，再播放旋轉。"
  },
  {
    id: "a-10.10p",
    mode: "A",
    label: "課堂練習 10.10 — y = √(2x＋1)，兩軸與 x = 2，繞 x 軸",
    title: "課堂練習 10.10",
    stem: "由 \\(y=\\sqrt{2x+1}\\)、兩坐標軸及 \\(x=2\\) 所圍的區域，繞 x 軸旋轉一周。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 2, R: (x) => Math.sqrt(2 * x + 1), r: () => 0 }],
    volumeTex: "6\\pi",
    volumeValue: 6 * PI,
    integralTex: "V=\\pi\\int_{0}^{2}(2x+1)\\,dx=6\\pi",
    curves: [
      { type: "yofx", f: (x) => Math.sqrt(2 * x + 1), domain: [0, 2.2] },
      { type: "vline", x: 2 }
    ],
    region: { kind: "yofx", lower: () => 0, upper: (x) => Math.sqrt(2 * x + 1), a: 0, b: 2 },
    bbox: [-0.7, 3.1, 3.1, -1.3],
    limitsTex: "[0,2]",
    teacherPrompt: "這題可作課閘：請學生先寫出積分，再對答案。",
    studentPrompt: "先自行寫出 \\(V=\\pi\\int R^2\\,dx\\) 的上下限與被積函數，再核對。",
    notes: ["不要漏 \\(\\pi\\)。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 x 積分", "對 y 積分"], answer: 0 },
      { q: "半徑平方是什麼？", options: ["\\(R^2=2x+1\\)", "\\(R^2=\\sqrt{2x+1}\\)", "\\(R^2=x\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\([0,2]\\)", "\\([1,2]\\)", "\\([0,1]\\)"], answer: 0 }
    ],
    teacherTip: "課堂練習當作課閘：先隱藏積分和答案。"
  },
  {
    id: "a-extra-10.10",
    mode: "A",
    label: "附加例題 10.10 — y = eˣ＋1，兩軸與 x = 1，繞 x 軸",
    title: "附加例題 10.10",
    stem: "由 \\(y=e^{x}+1\\)、兩坐標軸及 \\(x=1\\) 所圍的區域，繞 x 軸旋轉一周。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 1, R: (x) => Math.exp(x) + 1, r: () => 0 }],
    volumeTex: "\\dfrac{\\pi e^{2}}{2}+2\\pi e-\\dfrac{3\\pi}{2}",
    volumeValue: PI * Math.E ** 2 / 2 + 2 * PI * Math.E - 3 * PI / 2,
    integralTex: "V=\\pi\\int_{0}^{1}(e^{x}+1)^{2}\\,dx=\\pi\\bigl[e^{2x}/2+2e^{x}+x\\bigr]_{0}^{1}=\\dfrac{\\pi e^{2}}{2}+2\\pi e-\\dfrac{3\\pi}{2}",
    curves: [
      { type: "yofx", f: (x) => Math.exp(x) + 1, domain: [0, 1.15] },
      { type: "vline", x: 1 }
    ],
    region: { kind: "yofx", lower: () => 0, upper: (x) => Math.exp(x) + 1, a: 0, b: 1 },
    bbox: [-0.55, 4.5, 1.85, -0.85],
    limitsTex: "[0,1]",
    teacherPrompt: "展開 \\((e^{x}+1)^{2}=e^{2x}+2e^{x}+1\\)。代入下限 0 時，原函數是 \\(1/2+2=5/2\\)，所以終值裡是 \\(-3\\pi/2\\)，不是 \\(+\\pi/2\\)。",
    studentPrompt: "先判斷旋轉軸、實心或空心、積分變量、半徑和上下限，再寫積分。",
    notes: ["下限是 0。原函數在 0 的值是 \\(5/2\\)，相減後常數項是 \\(-3/2\\)。", "不要漏 \\(\\pi\\)。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["x 軸", "y 軸", "x=1"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 x 積分", "對 y 積分"], answer: 0 },
      { q: "半徑是什麼？", options: ["\\(R=e^{x}+1\\)", "\\(R=e^{x}\\)", "\\(R=x+1\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\([0,1]\\)", "\\([1,e]\\)", "\\([0,e]\\)"], answer: 0 }
    ],
    teacherTip: "核對原函數在下限的值：\\(1/2+2=5/2\\)，終值是 \\(\\pi e^{2}/2+2\\pi e-3\\pi/2\\)。"
  },
  {
    id: "a-10.11",
    mode: "A",
    label: "例 10.11 — x² = y²＋1，y = −1 與 y = 2，繞 y 軸",
    title: "例 10.11",
    stem: "由 \\(x^2=y^2+1\\)、\\(y=-1\\) 及 \\(y=2\\) 所圍、位於 y 軸右側的區域，繞 y 軸旋轉一周。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: -1, b: 2, R: (y) => Math.sqrt(y * y + 1), r: () => 0 }],
    volumeTex: "6\\pi",
    volumeValue: 6 * PI,
    integralTex: "V=\\pi\\int_{-1}^{2}x^2\\,dy=\\pi\\int_{-1}^{2}(y^2+1)\\,dy=6\\pi",
    curves: [
      { type: "xofy", g: (y) => Math.sqrt(y * y + 1), domain: [-1.3, 2.3] },
      { type: "hline", y: -1 },
      { type: "hline", y: 2 }
    ],
    region: { kind: "xofy", inner: () => 0, outer: (y) => Math.sqrt(y * y + 1), c: -1, d: 2 },
    bbox: [-1.2, 2.8, 3.2, -1.8],
    limitsTex: "[-1,2]",
    teacherPrompt: "半徑平方直接用 \\(x^2=y^2+1\\)，不必先開方再平方。",
    studentPrompt: "繞 y 軸時，通常對 y 積分，半徑是水平距離。",
    notes: ["繞 y 軸時不要仍對 x 積分（那不是圓盤／圓環法的標準切法）。", "被積函數是 \\(x^2=y^2+1\\)，不用先開方。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸", "y=2"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0, explain: "軸沿 y 方向，薄片垂直於 y 軸。" },
      { q: "半徑平方是什麼？", options: ["\\(R^2=y^2+1\\)", "\\(R^2=y+1\\)", "\\(R^2=y^2\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\(y:-1\\) 到 \\(2\\)", "\\(y:0\\) 到 \\(2\\)", "\\(x:1\\) 到 \\(2\\)"], answer: 0 }
    ],
    teacherTip: "強調：已知 \\(x^2=y^2+1\\)，被積函數就是這一式。"
  },
  {
    id: "a-10.11p",
    mode: "A",
    label: "課堂練習 10.11 — y = 2/(x²＋2) 與 y = 1/2 的帽，繞 y 軸",
    title: "課堂練習 10.11",
    stem: "由 \\(y=\\dfrac{2}{x^2+2}\\) 與 \\(y=\\dfrac{1}{2}\\) 圍成的「帽」，繞 y 軸旋轉一周。交點為 \\(x=\\pm\\sqrt{2}\\)。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0.5, b: 1, R: (y) => Math.sqrt(2 / y - 2), r: () => 0 }],
    volumeTex: "\\pi(2\\ln 2-1)",
    volumeValue: PI * (2 * ln2 - 1),
    integralTex: "V=\\pi\\int_{1/2}^{1}\\bigl(\\tfrac{2}{y}-2\\bigr)\\,dy=\\pi(2\\ln 2-1)",
    curves: [
      { type: "yofx", f: (x) => 2 / (x * x + 2), domain: [-2.4, 2.4] },
      { type: "hline", y: 0.5 }
    ],
    region: { kind: "yofx", lower: () => 0.5, upper: (x) => 2 / (x * x + 2), a: -SQRT2, b: SQRT2 },
    bbox: [-2.6, 1.35, 2.6, -0.25],
    limitsTex: "[1/2,1]",
    teacherPrompt: "改用 y 作變量：\\(x^2=2/y-2\\)，\\(y\\) 由 \\(1/2\\) 到 1。轉出來是實心（帽在軸附近）。",
    studentPrompt: "先找出交點，再決定用哪一個變量積分。",
    notes: ["繞 y 軸，用 \\(x^2\\) 作被積函數，上下限是 y 的範圍。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸", "y=1/2"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0, explain: "每一層 y 上，帽從 x=0 伸到曲線，中間沒有空洞。" },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "半徑平方是什麼？", options: ["\\(x^2=2/y-2\\)", "\\(x^2=2/(y+2)\\)", "\\(R=2/y\\)"], answer: 0 },
      { q: "y 的上下限？", options: ["\\(1/2\\) 到 \\(1\\)", "\\(0\\) 到 \\(1/2\\)", "\\(-\\sqrt{2}\\) 到 \\(\\sqrt{2}\\)"], answer: 0 }
    ],
    teacherTip: "交點 x=±√2 用來在 2D 圖上標帽的兩端；積分本身對 y 進行。"
  },
  {
    id: "a-extra-10.11",
    mode: "A",
    label: "附加例題 10.11 — x² = y⁴＋4y²＋4，y = −2 與 y = 2，繞 y 軸",
    title: "附加例題 10.11",
    stem: "由 \\(x^{2}=y^{4}+4y^{2}+4\\)、\\(y=-2\\) 及 \\(y=2\\) 所圍的區域，繞 y 軸旋轉一周。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: -2, b: 2, R: (y) => y * y + 2, r: () => 0 }],
    volumeTex: "\\dfrac{752\\pi}{15}",
    volumeValue: 752 * PI / 15,
    integralTex: "V=\\pi\\int_{-2}^{2}(y^{2}+2)^{2}\\,dy=\\pi\\int_{-2}^{2}(y^{4}+4y^{2}+4)\\,dy=\\dfrac{752\\pi}{15}",
    curves: [
      { type: "xofy", g: (y) => y * y + 2, domain: [-2.15, 2.15] },
      { type: "xofy", g: (y) => -(y * y + 2), domain: [-2.15, 2.15] },
      { type: "hline", y: -2 },
      { type: "hline", y: 2 }
    ],
    region: { kind: "xofy", inner: (y) => -(y * y + 2), outer: (y) => y * y + 2, c: -2, d: 2 },
    bbox: [-7.4, 3.3, 7.4, -3.3],
    limitsTex: "[-2,2]",
    teacherPrompt: "先因式分解 \\(x^{2}=(y^{2}+2)^{2}\\)，即 \\(\\lvert x\\rvert=y^{2}+2\\)。平面圖要畫左右兩支；繞 y 軸轉出來仍是實心，不是空心。",
    studentPrompt: "半徑平方可直接用 \\(x^{2}=(y^{2}+2)^{2}\\)，不必先開方再平方。",
    notes: ["平面圖要畫 \\(x=\\pm(y^{2}+2)\\) 兩支。", "區域跨過 y 軸，繞 y 軸後仍是實心圓盤，不要做成圓環。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸", "y=2"], answer: 0 },
      { q: "曲線可改寫成什麼？", options: ["\\(\\lvert x\\rvert=y^{2}+2\\)", "\\(x=y^{2}+4\\)", "\\(x^{2}=y^{2}+4\\)"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤（兩支繞同一軸轉成同一個立體）", "空心圓環（左右兩支中間有孔）"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\(y:-2\\) 到 \\(2\\)", "\\(y:0\\) 到 \\(2\\)", "\\(x:-6\\) 到 \\(6\\)"], answer: 0 }
    ],
    teacherTip: "強調兩支都要畫，但體積仍用實心圓盤 \\(R=y^{2}+2\\)。終值 752π/15。"
  },
  {
    id: "a-10.12",
    mode: "A",
    label: "例 10.12 — y = 1＋cos x，兩軸與 x = 2π，繞 x 軸 180°",
    title: "例 10.12",
    stem: "由 \\(y=1+\\cos x\\)、兩坐標軸及 \\(x=2\\pi\\) 所圍的區域，繞 x 軸旋轉 \\(180^\\circ\\)。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: false,
    turn: 0.5,
    profileSign: 1,
    pieces: [{ a: 0, b: 2 * PI, R: (x) => 1 + Math.cos(x), r: () => 0 }],
    volumeTex: "\\dfrac{3\\pi^2}{2}",
    volumeValue: 3 * PI * PI / 2,
    integralTex: "V=\\dfrac{1}{2}\\pi\\int_{0}^{2\\pi}(1+\\cos x)^2\\,dx=\\dfrac{3\\pi^2}{2}",
    curves: [{ type: "yofx", f: (x) => 1 + Math.cos(x), domain: [0, 2 * PI] }],
    region: { kind: "yofx", lower: () => 0, upper: (x) => 1 + Math.cos(x), a: 0, b: 2 * PI },
    bbox: [-0.7, 2.5, 7.1, -1.2],
    ticks: "pi",
    limitsTex: "[0,2\\pi]",
    teacherPrompt: "這是半圈，體積是全圈的一半。可先把滑桿轉到 180°，再對照 360°。",
    studentPrompt: "注意題目是旋轉 180°，不是一周。",
    notes: ["\\(180^\\circ\\) 是全圈的一半，不要做成 \\(2\\pi\\) 的積分卻忘記乘 \\(1/2\\)。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0 },
      { q: "旋轉了多少？", options: ["180°，是全圈一半", "一周 360°", "90°"], answer: 0 },
      { q: "半徑是什麼？", options: ["\\(R=1+\\cos x\\)", "\\(R=\\cos x\\)", "\\(R=1\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\([0,2\\pi]\\)", "\\([0,\\pi]\\)", "\\([0,1]\\)"], answer: 0 }
    ],
    teacherTip: "先播全圈得出 3π²，再問半圈；或直接在積分前加 1/2。"
  },
  {
    id: "a-10.12p",
    mode: "A",
    label: "課堂練習 10.12 — y = 1/√x，x = 1 與 x = 4，繞 x 軸 180°",
    title: "課堂練習 10.12",
    stem: "由 \\(y=1/\\sqrt{x}\\)、x 軸、\\(x=1\\) 及 \\(x=4\\) 所圍的區域，繞 x 軸旋轉 \\(180^\\circ\\)。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: false,
    turn: 0.5,
    profileSign: 1,
    pieces: [{ a: 1, b: 4, R: (x) => 1 / Math.sqrt(x), r: () => 0 }],
    volumeTex: "\\pi\\ln 2",
    volumeValue: PI * ln2,
    integralTex: "V=\\dfrac{1}{2}\\pi\\int_{1}^{4}\\dfrac{1}{x}\\,dx=\\pi\\ln 2",
    curves: [
      { type: "yofx", f: (x) => 1 / Math.sqrt(x), domain: [0.7, 4.3] },
      { type: "vline", x: 1 },
      { type: "vline", x: 4 }
    ],
    region: { kind: "yofx", lower: () => 0, upper: (x) => 1 / Math.sqrt(x), a: 1, b: 4 },
    bbox: [-0.4, 1.5, 4.8, -0.7],
    limitsTex: "[1,4]",
    teacherPrompt: "全圈會是 \\(2\\pi\\ln 2\\)，半圈才是 \\(\\pi\\ln 2\\)。",
    studentPrompt: "先寫全圈積分，再取一半。",
    notes: ["不要忘記這是 180°。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0 },
      { q: "旋轉了多少？", options: ["180°，是全圈一半", "一周 360°"], answer: 0 },
      { q: "半徑平方是什麼？", options: ["\\(R^2=1/x\\)", "\\(R^2=1/\\sqrt{x}\\)", "\\(R^2=x\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\([1,4]\\)", "\\([0,4]\\)", "\\([1,2]\\)"], answer: 0 }
    ],
    teacherTip: "可先問全圈，再對半。"
  },
  {
    id: "a-extra-10.12",
    mode: "A",
    label: "附加例題 10.12 — y = −sin x 與 x 軸，[π/2, 2π]，繞 x 軸 180°",
    title: "附加例題 10.12",
    stem: "由 \\(y=-\\sin x\\) 與 x 軸、在 \\(x=\\pi/2\\) 到 \\(x=2\\pi\\) 所圍的區域，繞 x 軸旋轉 \\(180^\\circ\\)。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: false,
    turn: 0.5,
    profileSign: 1,
    pieces: [{ a: PI / 2, b: 2 * PI, R: (x) => Math.abs(Math.sin(x)), r: () => 0 }],
    volumeTex: "\\dfrac{3\\pi^{2}}{8}",
    volumeValue: 3 * PI * PI / 8,
    integralTex: "V=\\dfrac{1}{2}\\pi\\int_{\\pi/2}^{2\\pi}\\sin^{2} x\\,dx=\\dfrac{3\\pi^{2}}{8}",
    curves: [{ type: "yofx", f: (x) => -Math.sin(x), domain: [PI / 2, 2 * PI] }],
    region: { kind: "yofx-abs", lower: () => 0, upper: (x) => -Math.sin(x), a: PI / 2, b: 2 * PI },
    bbox: [-0.6, 1.7, 7.1, -1.7],
    ticks: "pi",
    limitsTex: "[\\pi/2,2\\pi]",
    teacherPrompt: "這是半圈，體積是全圈的一半。半徑用 \\(\\lvert-\\sin x\\rvert=\\lvert\\sin x\\rvert\\)，平方後仍是 \\(\\sin^{2} x\\)。曲線在 \\([\\pi/2,\\pi]\\) 位於 x 軸下方。",
    studentPrompt: "注意題目是旋轉 180°，不是一周。穿軸後半徑平方仍非負，一般不必只為求體積而分段。",
    notes: ["\\(180^\\circ\\) 是全圈的一半，積分前要乘 \\(1/2\\)。", "半徑用絕對值，平方後是 \\(\\sin^{2} x\\)。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0 },
      { q: "旋轉了多少？", options: ["180°，是全圈一半", "一周 360°", "90°"], answer: 0 },
      { q: "被積函數是什麼？", options: ["\\(\\sin^{2} x\\)（平方後恒非負）", "\\(-\\sin x\\)", "\\(\\lvert\\sin x\\rvert\\) 但不平方"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\([\\pi/2,2\\pi]\\)", "\\([0,2\\pi]\\)", "\\([0,\\pi]\\)"], answer: 0 }
    ],
    teacherTip: "先把滑桿轉到 180°，再對照 360°。終值是 3π²/8。"
  },
  {
    id: "a-think",
    mode: "A",
    alsoIn: ["assess"],
    assessLabel: "階段評估第 2 題 — y = sin x 與 x 軸，[0, 2π]，繞 x 軸",
    label: "思考站 — y = sin x 與 x 軸，[0, 2π]，繞 x 軸",
    title: "思考站",
    stem: "由 \\(y=\\sin x\\) 與 x 軸、在 \\(x=0\\) 到 \\(x=2\\pi\\) 所圍的區域，繞 x 軸旋轉一周。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 2 * PI, R: (x) => Math.abs(Math.sin(x)), r: () => 0 }],
    volumeTex: "\\pi^2",
    volumeValue: PI * PI,
    integralTex: "V=\\pi\\int_{0}^{2\\pi}\\sin^2 x\\,dx=\\pi^2",
    curves: [{ type: "yofx", f: (x) => Math.sin(x), domain: [0, 2 * PI] }],
    region: { kind: "yofx-abs", lower: () => 0, upper: (x) => Math.sin(x), a: 0, b: 2 * PI },
    bbox: [-0.6, 1.6, 7.0, -1.6],
    ticks: "pi",
    limitsTex: "[0,2\\pi]",
    teacherPrompt: "對照 §10.1：求面積要在零點分段；求繞 x 軸的體積時，\\([f(x)]^2\\) 恒為非負，一般不必只因穿軸而分段。",
    studentPrompt: "曲線穿過 x 軸，體積要不要在 \\(x=\\pi\\) 分段？想一想被積函數是什麼。",
    notes: [
      "穿過 x 軸時，求面積（§10.1）必須在零點分段；繞 x 軸求體積時，\\(\\sin^2 x\\ge 0\\)，可以一次積完。",
      "半徑用 \\(\\lvert\\sin x\\rvert\\)，平方後仍是 \\(\\sin^2 x\\)。"
    ],
    contrast101: true,
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0 },
      { q: "被積函數是什麼？", options: ["\\(\\sin^2 x\\)（恒非負）", "\\(\\sin x\\)（有正有負）", "\\(\\lvert\\sin x\\rvert\\) 但不平方"], answer: 0 },
      { q: "要不要因為穿軸而分段？", options: ["一般不必，平方後不必只因穿軸分段", "一定要在 x=π 分成兩段積分再加起來"], answer: 0, explain: "求面積才必須在零點分段。繞 x 軸時半徑平方恒非負。" },
      { q: "上下限是什麼？", options: ["\\([0,2\\pi]\\)", "\\([0,\\pi]\\)", "\\([0,1]\\)"], answer: 0 }
    ],
    teacherTip: "先問「如果是求面積要怎樣？」再揭示體積不必為穿軸而分段。階段評估第 2 題同題，可用 #assess-2 跳入。"
  },
  {
    id: "a-10.13",
    mode: "A",
    label: "例 10.13 — 區域繞 y 軸（只看形狀）",
    title: "例 10.13",
    stem: "曲線 \\(\\Gamma:\\,y=x^2-4x\\)（\\(4\\le x\\le 10\\)）可改寫為 \\(x=2+\\sqrt{y+4}\\)。區域由 \\(\\Gamma\\)、\\(y=60\\) 與兩軸所圍，繞 y 軸旋轉一周。本頁只鎖定形狀與終值，不示範換元計算。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 60, R: (y) => 2 + Math.sqrt(y + 4), r: () => 0 }],
    volumeTex: "3624\\pi",
    volumeValue: 3624 * PI,
    integralTex: "V=\\pi\\int_{0}^{60}\\bigl(2+\\sqrt{y+4}\\bigr)^2\\,dy=3624\\pi",
    curves: [
      { type: "xofy", g: (y) => 2 + Math.sqrt(y + 4), domain: [0, 60] },
      { type: "hline", y: 60 }
    ],
    region: { kind: "xofy", inner: () => 0, outer: (y) => 2 + Math.sqrt(y + 4), c: 0, d: 60 },
    bbox: [-2.5, 68, 13, -8],
    limitsTex: "[0,60]",
    teacherPrompt: "區域很大，立體像一隻高身的碗。計算涉及換元，課堂上不宜把本頁當成計算機。",
    studentPrompt: "看清楚：每一層 y 從 y 軸伸到曲線，是實心圓盤，半徑為 \\(2+\\sqrt{y+4}\\)。",
    notes: ["繞 y 軸，對 y 積分。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "半徑是什麼？", options: ["\\(R=2+\\sqrt{y+4}\\)", "\\(R=\\sqrt{y+4}\\)", "\\(R=y\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\(y:0\\) 到 \\(60\\)", "\\(x:4\\) 到 \\(10\\)", "\\(y:4\\) 到 \\(10\\)"], answer: 0 }
    ],
    teacherTip: "此題以視覺為主，終值已鎖定。不要在頁面上展開換元步驟。"
  },

  {
    id: "a-10.13p",
    mode: "A",
    label: "課堂練習 10.13 — y = eˣ、y 軸與 y = e，繞 y 軸",
    title: "課堂練習 10.13",
    stem: "(a) 運用分部積分法，求 \\(\\displaystyle\\int(\\ln t)^{2}\\,dt\\)。(b) 設 \\(\\Gamma\\) 為 \\(y=e^{x}\\)，其中 \\(0\\le x\\le 1\\)。由 \\(\\Gamma\\)、y 軸及直線 \\(y=e\\) 所圍的區域，繞 y 軸旋轉一周。本頁鎖定 (a) 的原函數與 (b) 的體積，不把計算做成計算機。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 1, b: Math.E, R: (y) => Math.log(y), r: () => 0 }],
    volumeTex: "\\pi(e-2)",
    volumeValue: PI * (Math.E - 2),
    integralTex: "V=\\pi\\int_{1}^{e}(\\ln y)^{2}\\,dy=\\pi(e-2)",
    partATex: "\\int(\\ln t)^{2}\\,dt=t(\\ln t)^{2}-2t\\ln t+2t+C",
    curves: [
      { type: "yofx", f: (x) => Math.exp(x), domain: [0, 1.15] },
      { type: "hline", y: Math.E }
    ],
    region: { kind: "xofy", inner: () => 0, outer: (y) => Math.log(y), c: 1, d: Math.E },
    bbox: [-0.55, 3.25, 1.7, -0.7],
    limitsTex: "[1,e]",
    teacherPrompt: "這題可作課閘：請學生先完成 (a)，再把 (b) 改成對 y 積分。(a) 原函數已鎖定，記得加 \\(C\\)。(b) 在 \\(x=0\\) 時 \\(y=1\\)，所以 y 從 1 到 \\(e\\)，半徑是 \\(\\ln y\\)。",
    studentPrompt: "先自行完成 (a)，再把 (b) 改成對 y 積分，核對上下限與半徑。",
    notes: ["\\(x=0\\) 時 \\(y=1\\)，下限不是 0。", "繞 y 軸，半徑是 \\(\\ln y\\)。", "不定積分必須加 \\(C\\)。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸", "y=e"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "半徑是什麼？", options: ["\\(R=\\ln y\\)", "\\(R=e^{y}\\)", "\\(R=y\\)"], answer: 0 },
      { q: "y 的上下限？", options: ["\\(1\\) 到 \\(e\\)", "\\(0\\) 到 \\(e\\)", "\\(0\\) 到 \\(1\\)"], answer: 0, explain: "曲線與 y 軸交於 (0, 1)，下限是 1 不是 0。" }
    ],
    teacherTip: "課堂練習當作課閘：先隱藏積分和答案。(a)、(b) 終值已鎖定。y 的下限是 1。"
  },
  {
    id: "a-extra-10.13",
    mode: "A",
    label: "附加例題 10.13 — y = 2ˣ、y 軸與 y = 8，繞 y 軸",
    title: "附加例題 10.13",
    stem: "(a) 運用分部積分法，求 \\(\\displaystyle\\int(\\log_{2} t)^{2}\\,dt\\)。(b) 設 \\(\\Gamma\\) 為 \\(y=2^{x}\\)，其中 \\(0\\le x\\le 3\\)。由 \\(\\Gamma\\)、y 軸及 \\(y=8\\) 所圍的區域，繞 y 軸旋轉一周。本頁鎖定 (a) 的原函數與 (b) 的體積，不把計算做成計算機。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 1, b: 8, R: (y) => Math.log(y) / ln2, r: () => 0 }],
    volumeTex: "\\dfrac{\\pi}{(\\ln 2)^{2}}\\bigl[72(\\ln 2)^{2}-48\\ln 2+14\\bigr]",
    volumeValue: PI / (ln2 * ln2) * (72 * ln2 * ln2 - 48 * ln2 + 14),
    integralTex: "V=\\pi\\int_{1}^{8}(\\log_{2} y)^{2}\\,dy=\\dfrac{\\pi}{(\\ln 2)^{2}}\\bigl[72(\\ln 2)^{2}-48\\ln 2+14\\bigr]",
    partATex: "\\int(\\log_{2} t)^{2}\\,dt=\\dfrac{1}{(\\ln 2)^{2}}\\bigl[t(\\ln t)^{2}-2t\\ln t+2t\\bigr]+C",
    curves: [
      { type: "yofx", f: (x) => 2 ** x, domain: [0, 3.15] },
      { type: "hline", y: 8 }
    ],
    region: { kind: "xofy", inner: () => 0, outer: (y) => Math.log(y) / ln2, c: 1, d: 8 },
    bbox: [-0.7, 9.3, 3.9, -0.7],
    limitsTex: "[1,8]",
    teacherPrompt: "(a) 先把 \\(\\log_{2} t=\\ln t/\\ln 2\\) 再分部積分，原函數已鎖定。(b) 在 \\(x=0\\) 時 \\(y=1\\)，所以 y 從 1 到 8，半徑是 \\(\\log_{2} y\\)。",
    studentPrompt: "先完成 (a)，再把 (b) 改成對 y 積分。",
    notes: ["\\(x=0\\) 時 \\(y=1\\)，下限不是 0。", "繞 y 軸，半徑是 \\(\\log_{2} y\\)。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸", "y=8"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心圓盤", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "半徑是什麼？", options: ["\\(R=\\log_{2} y\\)", "\\(R=2^{y}\\)", "\\(R=y\\)"], answer: 0 },
      { q: "y 的上下限？", options: ["\\(1\\) 到 \\(8\\)", "\\(0\\) 到 \\(8\\)", "\\(0\\) 到 \\(3\\)"], answer: 0, explain: "曲線與 y 軸交於 (0, 1)，下限是 1 不是 0。" }
    ],
    teacherTip: "(a)、(b) 終值已鎖定。不要在頁面上把本題做成計算機。y 的下限是 1。"
  },

  // ---------- B 圓環法 ----------
  {
    id: "b-wrong",
    mode: "B",
    label: "誤區示範 — π(R²−r²) 對比 π(R−r)²",
    title: "誤區示範",
    stem: "自製示意：外半徑 \\(R=2\\)、內半徑 \\(r=1\\)、長 1 的管狀區域，繞 x 軸旋轉一周。正確體積是圓環 \\(\\pi(R^2-r^2)\\)，不是把「厚度」\\(R-r\\) 再當半徑去平方。",
    schematic: true,
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: true,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 1, R: () => 2, r: () => 1 }],
    volumeTex: "3\\pi",
    volumeValue: 3 * PI,
    wrongVolumeTex: "\\pi",
    wrongVolumeValue: PI,
    integralTex: "V=\\pi\\int_{0}^{1}(2^2-1^2)\\,dx=3\\pi",
    wrongIntegralTex: "\\pi\\int_{0}^{1}(2-1)^2\\,dx=\\pi\\quad(\\text{這是錯的})",
    curves: [
      { type: "hline", y: 2, domain: [0, 1] },
      { type: "hline", y: 1, domain: [0, 1] },
      { type: "vline", x: 0 },
      { type: "vline", x: 1 }
    ],
    region: { kind: "yofx", lower: () => 1, upper: () => 2, a: 0, b: 1 },
    bbox: [-0.6, 2.7, 2.2, -1.4],
    limitsTex: "[0,1]",
    compareWrong: true,
    teacherPrompt: "外平方減內平方，不是減完再平方。也可以看成 \\(V=V_1-V_2\\)（大圓盤減去內孔），與圓環公式相同。",
    studentPrompt: "把正確的薄片（有孔的環）和錯誤薄片（半徑為 \\(R-r\\) 的實心小圓盤）對照。",
    notes: ["空心不要寫成 \\(\\pi(R-r)^2\\)，應為 \\(\\pi(R^2-r^2)\\)。"],
    scaffold: [
      { q: "這立體中間有沒有孔？", options: ["有，是空心圓環", "沒有，是實心圓盤"], answer: 0 },
      { q: "正確的體積元素是哪一個？", options: ["\\(\\pi(R^2-r^2)\\Delta x\\)", "\\(\\pi(R-r)^2\\Delta x\\)"], answer: 0, explain: "環的面積是外圓減內圓，不是把環的「寬度」當作半徑。" },
      { q: "若 R=2、r=1，R²−r² 等於多少？", options: ["3", "1", "4"], answer: 0 },
      { q: "(R−r)² 等於多少？", options: ["1（較小，而且不是本題要用的量）", "3", "4"], answer: 0 },
      { q: "V=V₁−V₂ 與圓環公式的關係？", options: ["相同：π∫R² 減去 π∫r²", "完全是另一套方法，結果不同"], answer: 0 }
    ],
    teacherTip: "用剖視讓學生看見孔。切換「正確／錯誤薄片」時，錯誤那個是實心小圓盤，體積偏小。"
  },
  {
    id: "b-10.14",
    mode: "B",
    label: "例 10.14 — y = x²、y = eˣ，y 軸與 x = 1，繞 x 軸",
    title: "例 10.14",
    stem: "由 \\(y=x^2\\)、\\(y=e^x\\)、y 軸及 \\(x=1\\) 所圍的區域，繞 x 軸旋轉一周。在 \\([0,1]\\) 上 \\(e^x\\ge x^2\\)。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: true,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 1, R: (x) => Math.exp(x), r: (x) => x * x }],
    volumeTex: "\\dfrac{e^2\\pi}{2}-\\dfrac{7\\pi}{10}",
    volumeValue: (Math.exp(2) * PI) / 2 - (7 * PI) / 10,
    integralTex: "V=\\pi\\int_{0}^{1}\\bigl(e^{2x}-x^4\\bigr)\\,dx=\\dfrac{e^2\\pi}{2}-\\dfrac{7\\pi}{10}",
    curves: [
      { type: "yofx", f: (x) => Math.exp(x), domain: [0, 1.15] },
      { type: "yofx", f: (x) => x * x, domain: [0, 1.15] },
      { type: "vline", x: 1 }
    ],
    region: { kind: "yofx", lower: (x) => x * x, upper: (x) => Math.exp(x), a: 0, b: 1 },
    bbox: [-0.45, 3.1, 1.7, -0.6],
    limitsTex: "[0,1]",
    teacherPrompt: "外半徑 \\(e^x\\)，內半徑 \\(x^2\\)。不要寫成 \\((e^x-x^2)^2\\)。",
    studentPrompt: "先確認哪一條較遠離 x 軸。",
    notes: ["空心是 \\(\\pi(R^2-r^2)\\)，不是 \\(\\pi(R-r)^2\\)。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["空心圓環", "實心圓盤"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 x 積分", "對 y 積分"], answer: 0 },
      { q: "外、內半徑？", options: ["外 \\(e^x\\)，內 \\(x^2\\)", "外 \\(x^2\\)，內 \\(e^x\\)", "半徑 \\(e^x-x^2\\)"], answer: 0 },
      { q: "正確被積函數？", options: ["\\(e^{2x}-x^4\\)", "\\((e^x-x^2)^2\\)", "\\(e^x-x^2\\)"], answer: 0 }
    ],
    teacherTip: "特別對照錯誤寫法 (eˣ−x²)²。"
  },
  {
    id: "b-10.14p",
    mode: "B",
    label: "課堂練習 10.14 — y = 4x−x² 與 y = 2x，繞 x 軸",
    title: "課堂練習 10.14",
    stem: "由 \\(y=4x-x^2\\) 與 \\(y=2x\\) 所圍的區域，繞 x 軸旋轉一周。交點為 \\(x=0,\\,2\\)，拋物線在上。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: true,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 2, R: (x) => 4 * x - x * x, r: (x) => 2 * x }],
    volumeTex: "\\dfrac{32\\pi}{5}",
    volumeValue: 32 * PI / 5,
    integralTex: "V=\\pi\\int_{0}^{2}\\bigl[(4x-x^2)^2-(2x)^2\\bigr]\\,dx=\\dfrac{32\\pi}{5}",
    curves: [
      { type: "yofx", f: (x) => 4 * x - x * x, domain: [-0.2, 4.2] },
      { type: "yofx", f: (x) => 2 * x, domain: [-0.2, 2.4] }
    ],
    region: { kind: "yofx", lower: (x) => 2 * x, upper: (x) => 4 * x - x * x, a: 0, b: 2 },
    bbox: [-0.5, 4.6, 3.3, -0.7],
    limitsTex: "[0,2]",
    teacherPrompt: "常見錯誤是寫 \\((4x-x^2-2x)^2=(2x-x^2)^2\\)。",
    studentPrompt: "這題可作課閘。先寫被積函數，再對答案。",
    notes: ["不要把兩條曲線的差再平方；要先各自平方再減。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["空心圓環", "實心圓盤"], answer: 0 },
      { q: "交點是什麼？", options: ["\\(x=0,\\,2\\)", "\\(x=0,\\,4\\)", "\\(x=2,\\,4\\)"], answer: 0 },
      { q: "外、內半徑？", options: ["外 \\(4x-x^2\\)，內 \\(2x\\)", "外 \\(2x\\)，內 \\(4x-x^2\\)", "半徑 \\(4x-x^2-2x\\)"], answer: 0 },
      { q: "正確被積函數？", options: ["\\((4x-x^2)^2-(2x)^2\\)", "\\((4x-x^2-2x)^2\\)", "\\(4x-x^2-2x\\)"], answer: 0 }
    ],
    teacherTip: "課閘：對照錯誤 (4x−x²−2x)²。"
  },
  {
    id: "b-extra-10.14",
    mode: "B",
    label: "附加例題 10.14 — y = sin x＋2 與 y = e⁻ˣ，y 軸與 x = π/2，繞 x 軸",
    title: "附加例題 10.14",
    stem: "由 \\(y=\\sin x+2\\)、\\(y=e^{-x}\\)、y 軸及 \\(x=\\pi/2\\) 所圍的區域，繞 x 軸旋轉一周。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: true,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: PI / 2, R: (x) => Math.sin(x) + 2, r: (x) => Math.exp(-x) }],
    volumeTex: "\\dfrac{9\\pi^{2}}{4}+\\dfrac{7\\pi}{2}+\\dfrac{\\pi}{2}e^{-\\pi}",
    volumeValue: 9 * PI * PI / 4 + 7 * PI / 2 + (PI / 2) * Math.exp(-PI),
    integralTex: "V=\\pi\\int_{0}^{\\pi/2}\\bigl[(\\sin x+2)^{2}-e^{-2x}\\bigr]\\,dx=\\dfrac{9\\pi^{2}}{4}+\\dfrac{7\\pi}{2}+\\dfrac{\\pi}{2}e^{-\\pi}",
    curves: [
      { type: "yofx", f: (x) => Math.sin(x) + 2, domain: [0, PI / 2] },
      { type: "yofx", f: (x) => Math.exp(-x), domain: [0, PI / 2] },
      { type: "vline", x: PI / 2 }
    ],
    region: { kind: "yofx", lower: (x) => Math.exp(-x), upper: (x) => Math.sin(x) + 2, a: 0, b: PI / 2 },
    bbox: [-0.45, 3.7, 2.15, -0.55],
    ticks: "pi",
    limitsTex: "[0,\\pi/2]",
    teacherPrompt: "外半徑 \\(\\sin x+2\\)，內半徑 \\(e^{-x}\\)。要先各自平方再減，不要減完再平方。",
    studentPrompt: "先判斷哪一條較遠離 x 軸，那一條就是外半徑。",
    notes: ["外平方減內平方，不是減完再平方。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["x 軸", "y 軸", "x=π/2"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["空心圓環", "實心圓盤"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 x 積分", "對 y 積分"], answer: 0 },
      { q: "外、內半徑？", options: ["外 \\(\\sin x+2\\)，內 \\(e^{-x}\\)", "外 \\(e^{-x}\\)，內 \\(\\sin x+2\\)", "半徑 \\(\\sin x+2-e^{-x}\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\([0,\\pi/2]\\)", "\\([0,\\pi]\\)", "\\([\\pi/2,\\pi]\\)"], answer: 0 }
    ],
    teacherTip: "終值是 \\(9\\pi^{2}/4+7\\pi/2+(\\pi/2)e^{-\\pi}\\)。"
  },
  {
    id: "b-10.15",
    mode: "B",
    label: "例 10.15 — y = x²、y = x＋2、y 軸，繞 y 軸",
    title: "例 10.15",
    stem: "由 \\(\\Gamma:\\,y=x^2\\)、直線 \\(L:\\,y=x+2\\) 及 y 軸所圍的區域，繞 y 軸旋轉一周。(a) 交點 \\(A(2,4)\\)。(b) 必須沿 \\(y=2\\) 分段。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: true,
    turn: 1,
    profileSign: 1,
    splitAt: 2,
    pieces: [
      { a: 0, b: 2, R: (y) => Math.sqrt(y), r: () => 0, tag: "solid" },
      { a: 2, b: 4, R: (y) => Math.sqrt(y), r: (y) => y - 2, tag: "washer" }
    ],
    volumeTex: "\\dfrac{16\\pi}{3}",
    volumeValue: 16 * PI / 3,
    integralTex: "V=\\pi\\int_{0}^{2} y\\,dy+\\pi\\int_{2}^{4}\\bigl[y-(y-2)^2\\bigr]\\,dy=\\dfrac{16\\pi}{3}",
    curves: [
      { type: "yofx", f: (x) => x * x, domain: [0, 2.2] },
      { type: "yofx", f: (x) => x + 2, domain: [0, 2.2] }
    ],
    region: { kind: "composite-b1015" },
    bbox: [-0.5, 4.7, 3.0, -0.5],
    limitsTex: "[0,2]\\cup[2,4]",
    teacherPrompt: "\\(y=0\\) 到 \\(2\\) 是實心圓盤（\\(x^2=y\\)）；\\(y=2\\) 到 \\(4\\) 是圓環（內 \\(x=y-2\\)，外 \\(x=\\sqrt{y}\\)）。",
    studentPrompt: "先標交點 A，再問：用水平薄片時，在哪一條水平線性質會改變？",
    notes: ["在 \\(y=2\\) 必須分段：下段實心，上段空心。"],
    marks: [{ x: 2, y: 4, name: "A(2, 4)" }, { x: 0, y: 2, name: "y=2" }],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸"], answer: 0 },
      { q: "交點 A 的坐標？", options: ["\\((2,4)\\)", "\\((4,2)\\)", "\\((0,2)\\)"], answer: 0 },
      { q: "為什麼要在 y=2 分段？", options: ["下段碰到 y 軸是實心，上段中間有直線造成的孔", "只是為了計算方便，其實可以不分段"], answer: 0 },
      { q: "y=0 到 2 的半徑？", options: ["實心，\\(R=\\sqrt{y}\\)", "圓環，內半徑 \\(y-2\\)", "\\(R=y\\)"], answer: 0 },
      { q: "y=2 到 4 的外、內半徑？", options: ["外 \\(\\sqrt{y}\\)，內 \\(y-2\\)", "外 \\(y-2\\)，內 \\(\\sqrt{y}\\)", "半徑 \\(\\sqrt{y}-(y-2)\\)"], answer: 0 }
    ],
    teacherTip: "終值是 16π/3。移動薄片滑桿跨過 y=2，看薄片由圓盤變成圓環。"
  },
  {
    id: "b-10.15p",
    mode: "B",
    label: "課堂練習 10.15 — y = x² 與 y = x²/2＋2、y 軸，繞 y 軸",
    title: "課堂練習 10.15",
    stem: "由 \\(y=x^2\\)、\\(y=x^2/2+2\\) 及 y 軸所圍的區域，繞 y 軸旋轉一周。(a) 交點 \\(A(2,4)\\)。(b) 同樣在 \\(y=2\\) 分段。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: true,
    turn: 1,
    profileSign: 1,
    splitAt: 2,
    pieces: [
      { a: 0, b: 2, R: (y) => Math.sqrt(y), r: () => 0, tag: "solid" },
      { a: 2, b: 4, R: (y) => Math.sqrt(y), r: (y) => Math.sqrt(2 * (y - 2)), tag: "washer" }
    ],
    volumeTex: "4\\pi",
    volumeValue: 4 * PI,
    integralTex: "V=\\pi\\int_{0}^{2} y\\,dy+\\pi\\int_{2}^{4}\\bigl[y-2(y-2)\\bigr]\\,dy=4\\pi",
    curves: [
      { type: "yofx", f: (x) => x * x, domain: [0, 2.2] },
      { type: "yofx", f: (x) => x * x / 2 + 2, domain: [0, 2.2] }
    ],
    region: { kind: "composite-b1015p" },
    bbox: [-0.5, 4.7, 3.0, -0.5],
    limitsTex: "[0,2]\\cup[2,4]",
    teacherPrompt: "下段實心；上段外 \\(\\sqrt{y}\\)、內 \\(\\sqrt{2(y-2)}\\)。",
    studentPrompt: "對照例 10.15 的分段想法。",
    notes: ["同樣在 y=2 分段。"],
    marks: [{ x: 2, y: 4, name: "A(2, 4)" }],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸"], answer: 0 },
      { q: "交點 A 的坐標？", options: ["\\((2,4)\\)", "\\((4,2)\\)", "\\((0,2)\\)"], answer: 0 },
      { q: "要在哪裡分段？", options: ["\\(y=2\\)", "\\(x=2\\)", "不必分段"], answer: 0 },
      { q: "y=0 到 2？", options: ["實心，\\(R=\\sqrt{y}\\)", "空心圓環"], answer: 0 },
      { q: "y=2 到 4 的外、內？", options: ["外 \\(\\sqrt{y}\\)，內 \\(\\sqrt{2(y-2)}\\)", "外 \\(\\sqrt{2(y-2)}\\)，內 \\(\\sqrt{y}\\)"], answer: 0 }
    ],
    teacherTip: "終值 4π。與例 10.15 同一種分段結構。"
  },
  {
    id: "b-extra-10.15",
    mode: "B",
    label: "附加例題 10.15 — y = x²−1、2y = 3x、y 軸，繞 y 軸",
    title: "附加例題 10.15",
    stem: "由 \\(\\Gamma:\\,y=x^{2}-1\\)、直線 \\(L:\\,2y=3x\\) 及 y 軸所圍的區域，繞 y 軸旋轉一周。(a) 已知 \\(\\Gamma\\) 與 \\(L\\) 在第一象限相交於 \\(A\\)，求 \\(A\\) 的坐標。(b) 必須沿 \\(y=0\\) 分段。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: true,
    turn: 1,
    profileSign: 1,
    splitAt: 0,
    pieces: [
      { a: -1, b: 0, R: (y) => Math.sqrt(y + 1), r: () => 0, tag: "solid" },
      { a: 0, b: 3, R: (y) => Math.sqrt(y + 1), r: (y) => (2 / 3) * y, tag: "washer" }
    ],
    volumeTex: "4\\pi",
    volumeValue: 4 * PI,
    integralTex: "V=\\pi\\int_{-1}^{0}(y+1)\\,dy+\\pi\\int_{0}^{3}\\bigl[(y+1)-\\bigl(\\tfrac{2}{3}y\\bigr)^{2}\\bigr]\\,dy=4\\pi",
    curves: [
      { type: "yofx", f: (x) => x * x - 1, domain: [0, 2.2] },
      { type: "yofx", f: (x) => (3 / 2) * x, domain: [0, 2.2] }
    ],
    region: { kind: "composite-bextra1015" },
    bbox: [-0.6, 3.8, 2.8, -1.6],
    limitsTex: "[-1,0]\\cup[0,3]",
    marks: [{ x: 2, y: 3, name: "A(2, 3)" }, { x: 0, y: 0, name: "y=0" }],
    teacherPrompt: "\\(\\Gamma\\) 的 y 截距是 \\(-1\\)，\\(L\\) 的 y 截距是 0。改寫 \\(x=\\sqrt{y+1}\\)、\\(x=\\tfrac{2}{3}y\\)。\\(y=-1\\) 到 0 是實心，\\(y=0\\) 到 3 是圓環。",
    studentPrompt: "先標交點 A，再問：用水平薄片時，在哪一條水平線性質會改變？",
    notes: ["必須在 \\(y=0\\) 分段：下段實心，上段空心。", "交點是 \\(A(2,3)\\)。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸"], answer: 0 },
      { q: "交點 A 的坐標？", options: ["\\((2,3)\\)", "\\((3,2)\\)", "\\((0,0)\\)"], answer: 0 },
      { q: "為什麼要在 y=0 分段？", options: ["下段碰到 y 軸是實心，上段中間有直線造成的孔", "只是為了計算方便，其實可以不分段"], answer: 0 },
      { q: "y=−1 到 0 的半徑？", options: ["實心，\\(R=\\sqrt{y+1}\\)", "圓環，內半徑 \\(\\tfrac{2}{3}y\\)", "\\(R=y+1\\)"], answer: 0 },
      { q: "y=0 到 3 的外、內半徑？", options: ["外 \\(\\sqrt{y+1}\\)，內 \\(\\tfrac{2}{3}y\\)", "外 \\(\\tfrac{2}{3}y\\)，內 \\(\\sqrt{y+1}\\)", "半徑 \\(\\sqrt{y+1}-\\tfrac{2}{3}y\\)"], answer: 0 }
    ],
    teacherTip: "終值是 4π。移動薄片滑桿跨過 y=0，看薄片由圓盤變成圓環。"
  },
  {
    id: "b-10.16",
    mode: "B",
    label: "例 10.16 — 圓 (x−2)²＋y² = 1 繞 y 軸成環面",
    title: "例 10.16 環面",
    stem: "(a) \\(\\displaystyle\\int_{-1}^{1}\\sqrt{1-t^2}\\,dt=\\dfrac{\\pi}{2}\\)。(b) 圓 \\((x-2)^2+y^2=1\\) 繞 y 軸旋轉一周，成環面。左右支為 \\(x=2\\pm\\sqrt{1-y^2}\\)，\\(y\\) 由 \\(-1\\) 到 \\(1\\)。可用 \\((a+b)^2-(a-b)^2=4ab\\)。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: true,
    turn: 1,
    profileSign: 1,
    pieces: [{
      a: -1,
      b: 1,
      R: (y) => 2 + Math.sqrt(Math.max(0, 1 - y * y)),
      r: (y) => 2 - Math.sqrt(Math.max(0, 1 - y * y))
    }],
    volumeTex: "4\\pi^2",
    volumeValue: 4 * PI * PI,
    integralTex: "V=\\pi\\int_{-1}^{1}4\\cdot 2\\sqrt{1-y^2}\\,dy=8\\pi\\cdot\\dfrac{\\pi}{2}=4\\pi^2",
    partATex: "\\int_{-1}^{1}\\sqrt{1-t^2}\\,dt=\\dfrac{\\pi}{2}",
    curves: [{ type: "circle", cx: 2, cy: 0, r: 1 }],
    region: { kind: "circle", cx: 2, cy: 0, r: 1 },
    bbox: [-0.8, 2.2, 4.0, -2.2],
    limitsTex: "[-1,1]",
    simpsonN: 2000,
    teacherPrompt: "這是動畫亮點。剖開環面，讓學生看見「甜甜圈」的孔。用 4ab 化簡平方差。",
    studentPrompt: "先完成 (a) 的半圓面積，再代入 (b)。",
    notes: ["外平方減內平方可用 \\(4ab\\) 化簡，其中 \\(a=2\\)、\\(b=\\sqrt{1-y^2}\\)。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸", "圓心所在豎線 x=2"], answer: 0 },
      { q: "轉出來是什麼？", options: ["中間有孔的環面", "實心球"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "外、內支是什麼？", options: ["\\(x=2\\pm\\sqrt{1-y^2}\\)", "\\(x=\\pm\\sqrt{1-y^2}\\)", "\\(x=2\\)"], answer: 0 },
      { q: "(a+b)²−(a−b)² 等於？", options: ["\\(4ab\\)", "\\(2ab\\)", "\\((2b)^2\\)"], answer: 0 }
    ],
    teacherTip: "知多一點。只做圓環法，不要引入其他切法。"
  },
  {
    id: "b-10.16p",
    mode: "B",
    label: "課堂練習 10.16 — 橢圓 x²/9＋(y−4)²/4 = 1 繞 x 軸",
    title: "課堂練習 10.16",
    stem: "橢圓 \\(\\dfrac{x^2}{9}+\\dfrac{(y-4)^2}{4}=1\\) 繞 x 軸旋轉一周。(a) \\(\\displaystyle\\int_{-3}^{3}\\sqrt{1-x^2/9}\\,dx=\\dfrac{3\\pi}{2}\\)。(b) 成環面，體積 \\(48\\pi^2\\)。",
    hasVolume: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: true,
    turn: 1,
    profileSign: 1,
    pieces: [{
      a: -3,
      b: 3,
      R: (x) => 4 + 2 * Math.sqrt(Math.max(0, 1 - x * x / 9)),
      r: (x) => 4 - 2 * Math.sqrt(Math.max(0, 1 - x * x / 9))
    }],
    volumeTex: "48\\pi^2",
    volumeValue: 48 * PI * PI,
    integralTex: "V=\\pi\\int_{-3}^{3}32\\sqrt{1-x^2/9}\\,dx=48\\pi^2",
    partATex: "\\int_{-3}^{3}\\sqrt{1-\\dfrac{x^2}{9}}\\,dx=\\dfrac{3\\pi}{2}",
    curves: [{ type: "ellipse", cx: 0, cy: 4, rx: 3, ry: 2 }],
    region: { kind: "ellipse", cx: 0, cy: 4, rx: 3, ry: 2 },
    bbox: [-4.2, 7.2, 4.2, -1.2],
    limitsTex: "[-3,3]",
    simpsonN: 2000,
    teacherPrompt: "橢圓全程在 x 軸上方，繞 x 軸後仍是環面。同樣用 4ab。",
    studentPrompt: "先做 (a)，再寫外、內半徑。",
    notes: ["外 \\(4+2\\sqrt{1-x^2/9}\\)，內 \\(4-2\\sqrt{1-x^2/9}\\)。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["x 軸", "y 軸", "y=4"], answer: 0 },
      { q: "轉出來是什麼？", options: ["中間有孔的環面", "實心橢球"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 x 積分", "對 y 積分"], answer: 0 },
      { q: "外、內半徑的「中線」是？", options: ["\\(y=4\\)，再加減鉛垂半軸", "\\(y=0\\)", "\\(x=0\\)"], answer: 0 },
      { q: "(a) 的積分值？", options: ["\\(3\\pi/2\\)", "\\(3\\pi\\)", "\\(\\pi/2\\)"], answer: 0 }
    ],
    teacherTip: "與例 10.16 同一思路，只是改繞 x 軸。"
  },
  {
    id: "b-extra-10.16",
    mode: "B",
    label: "附加例題 10.16 — 橢圓 (x−4)²/9＋y²/25 = 1 繞 y 軸成環面",
    title: "附加例題 10.16 環面",
    stem: "(a) \\(\\displaystyle\\int_{-5}^{5}\\sqrt{1-t^{2}/25}\\,dt=\\dfrac{5\\pi}{2}\\)。(b) 橢圓 \\(\\dfrac{(x-4)^{2}}{9}+\\dfrac{y^{2}}{25}=1\\) 繞 y 軸旋轉一周，成環面。左右支為 \\(x=4\\pm 3\\sqrt{1-y^{2}/25}\\)，\\(y\\) 由 \\(-5\\) 到 \\(5\\)。可用 \\((a+b)^{2}-(a-b)^{2}=4ab\\)。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: true,
    turn: 1,
    profileSign: 1,
    pieces: [{
      a: -5,
      b: 5,
      R: (y) => 4 + 3 * Math.sqrt(Math.max(0, 1 - y * y / 25)),
      r: (y) => 4 - 3 * Math.sqrt(Math.max(0, 1 - y * y / 25))
    }],
    volumeTex: "120\\pi^{2}",
    volumeValue: 120 * PI * PI,
    integralTex: "V=\\pi\\int_{-5}^{5}4\\cdot 4\\cdot 3\\sqrt{1-y^{2}/25}\\,dy=48\\pi\\cdot\\dfrac{5\\pi}{2}=120\\pi^{2}",
    partATex: "\\int_{-5}^{5}\\sqrt{1-\\dfrac{t^{2}}{25}}\\,dt=\\dfrac{5\\pi}{2}",
    curves: [{ type: "ellipse", cx: 4, cy: 0, rx: 3, ry: 5 }],
    region: { kind: "ellipse", cx: 4, cy: 0, rx: 3, ry: 5 },
    bbox: [-1.4, 6.6, 8.6, -6.6],
    limitsTex: "[-5,5]",
    simpsonN: 2000,
    teacherPrompt: "剖開環面，讓學生看見中間的孔。用 4ab 化簡平方差，其中 \\(a=4\\)、\\(b=3\\sqrt{1-y^{2}/25}\\)。",
    studentPrompt: "先完成 (a)，再代入 (b)。",
    notes: ["外平方減內平方可用 \\(4ab\\) 化簡。", "這是中間有孔的環面，不是實心橢球。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸", "豎線 x=4"], answer: 0 },
      { q: "轉出來是什麼？", options: ["中間有孔的環面", "實心橢球"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "外、內支是什麼？", options: ["\\(x=4\\pm 3\\sqrt{1-y^{2}/25}\\)", "\\(x=\\pm 3\\sqrt{1-y^{2}/25}\\)", "\\(x=4\\)"], answer: 0 },
      { q: "(a) 的積分值？", options: ["\\(5\\pi/2\\)", "\\(5\\pi\\)", "\\(\\pi/2\\)"], answer: 0 }
    ],
    teacherTip: "與例 10.16 同一思路。終值 120π²。記得打開剖視，看見孔。"
  },

  // ---------- C/D 平行軸 ----------
  {
    id: "c-compare",
    mode: "C",
    label: "同一帽兩軸對照（自製示意）",
    title: "同一帽，兩條軸",
    stem: "自製示意：\\(y=4x-x^2\\) 與 \\(y=3\\) 圍成的帽，交點 \\(x=1,\\,3\\)。(a) 繞 x 軸：空心圓環。(b) 繞 \\(y=3\\)：實心。這是概念對照，不是課本題號。",
    schematic: true,
    hasVolume: true,
    compareAxes: true,
    axis: { dir: "x", offset: 0 },
    varName: "x",
    hollow: true,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 1, b: 3, R: (x) => 4 * x - x * x, r: () => 3 }],
    piecesB: [{ a: 1, b: 3, R: (x) => (4 * x - x * x) - 3, r: () => 0 }],
    axisB: { dir: "x", offset: 3 },
    profileSignB: -1,
    volumeTex: "\\dfrac{136\\pi}{15}",
    volumeValue: 136 * PI / 15,
    volumeTexB: "\\dfrac{16\\pi}{15}",
    volumeValueB: 16 * PI / 15,
    integralTex: "V_a=\\pi\\int_{1}^{3}\\bigl[(4x-x^2)^2-3^2\\bigr]\\,dx=\\dfrac{136\\pi}{15}",
    integralTexB: "V_b=\\pi\\int_{1}^{3}(4x-x^2-3)^2\\,dx=\\dfrac{16\\pi}{15}",
    curves: [
      { type: "yofx", f: (x) => 4 * x - x * x, domain: [0, 4] },
      { type: "hline", y: 3 }
    ],
    region: { kind: "yofx", lower: () => 3, upper: (x) => 4 * x - x * x, a: 1, b: 3 },
    bbox: [-0.4, 5.0, 4.4, -0.8],
    limitsTex: "[1,3]",
    teacherPrompt: "同一塊帽：繞 x 軸要平方差；繞帽邊那條直線 y=3 卻是差的平方，而且是實心。這是口頭測試的關鍵對照。",
    studentPrompt: "先判斷兩次旋轉，哪一次中間有孔。半徑永遠是到「那一條旋轉軸」的距離，不是永遠把 y 拿去平方。",
    notes: [
      "繞 y=k 或 x=h 時，仍寫 y² 或 x² 就錯了；半徑是到該直線的距離。",
      "因為平方，當 f(x)≤k 時，[f(x)−k]² 與 [k−f(x)]² 相同。"
    ],
    scaffold: [
      { q: "帽與 y=3 的交點？", options: ["\\(x=1,\\,3\\)", "\\(x=0,\\,4\\)", "\\(x=2\\)"], answer: 0 },
      { q: "繞 x 軸是實心還是空心？", options: ["空心圓環（帽離 x 軸中間有空隙）", "實心圓盤"], answer: 0 },
      { q: "繞 y=3 是實心還是空心？", options: ["實心（帽貼著這條軸）", "空心圓環"], answer: 0 },
      { q: "繞 x 軸的被積函數？", options: ["\\((4x-x^2)^2-3^2\\)（平方差）", "\\((4x-x^2-3)^2\\)（差的平方）"], answer: 0 },
      { q: "繞 y=3 的被積函數？", options: ["\\((4x-x^2-3)^2\\)（差的平方）", "\\((4x-x^2)^2-3^2\\)（平方差）"], answer: 0 }
    ],
    teacherTip: "用切換 (a)/(b) 看兩個立體。數值已獨立核對：136π/15 與 16π/15。"
  },
  {
    id: "c-10.17",
    mode: "C",
    label: "例 10.17 — y² = x、y 軸、y = 2，繞 y = 2",
    title: "例 10.17",
    stem: "由 \\(y^2=x\\)、y 軸及 \\(y=2\\) 所圍的區域，繞直線 \\(y=2\\) 旋轉一周。半徑為 \\(2-\\sqrt{x}\\)，\\(x\\) 由 0 到 4。",
    hasVolume: true,
    axis: { dir: "x", offset: 2 },
    varName: "x",
    hollow: false,
    turn: 1,
    profileSign: -1,
    pieces: [{ a: 0, b: 4, R: (x) => 2 - Math.sqrt(x), r: () => 0 }],
    volumeTex: "\\dfrac{8\\pi}{3}",
    volumeValue: 8 * PI / 3,
    integralTex: "V=\\pi\\int_{0}^{4}(2-\\sqrt{x})^2\\,dx=\\dfrac{8\\pi}{3}",
    curves: [
      { type: "xofy", g: (y) => y * y, domain: [0, 2.2] },
      { type: "hline", y: 2 }
    ],
    region: { kind: "yofx", lower: (x) => Math.sqrt(x), upper: () => 2, a: 0, b: 4 },
    bbox: [-0.7, 3.1, 5.0, -0.7],
    limitsTex: "[0,4]",
    teacherPrompt: "軸是 y=2，半徑是到這條直線的距離，不是 y 本身。",
    studentPrompt: "區域在軸下方，半徑寫 \\(2-\\sqrt{x}\\) 或 \\(\\lvert\\sqrt{x}-2\\rvert\\) 都可以，因為最後要平方。",
    notes: ["繞 y=k 時，半徑是到 y=k 的距離，不要仍寫成 y²。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(y=2\\)", "y 軸", "x 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心（區域貼著 y=2）", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 x 積分", "對 y 積分"], answer: 0, explain: "軸平行於 x 軸，薄片垂直於軸，所以對 x 積分。" },
      { q: "半徑是什麼？", options: ["\\(2-\\sqrt{x}\\)", "\\(\\sqrt{x}\\)", "\\(2\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\(x:0\\) 到 \\(4\\)", "\\(y:0\\) 到 \\(2\\)", "\\(x:0\\) 到 \\(2\\)"], answer: 0 }
    ],
    teacherTip: "強調半徑是鉛垂距離 |y−2。"
  },
  {
    id: "c-10.17p",
    mode: "C",
    label: "課堂練習 10.17 — y = −x²＋3x＋1，y 軸、y = 1 與 x = 2，繞 y = 1",
    title: "課堂練習 10.17",
    stem: "由 \\(y=-x^2+3x+1\\)、y 軸、\\(y=1\\) 及 \\(x=2\\) 所圍的區域，繞直線 \\(y=1\\) 旋轉一周。",
    hasVolume: true,
    axis: { dir: "x", offset: 1 },
    varName: "x",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 2, R: (x) => -x * x + 3 * x, r: () => 0 }],
    volumeTex: "\\dfrac{32\\pi}{5}",
    volumeValue: 32 * PI / 5,
    integralTex: "V=\\pi\\int_{0}^{2}(-x^2+3x)^2\\,dx=\\dfrac{32\\pi}{5}",
    curves: [
      { type: "yofx", f: (x) => -x * x + 3 * x + 1, domain: [-0.2, 2.3] },
      { type: "hline", y: 1 },
      { type: "vline", x: 2 }
    ],
    region: { kind: "yofx", lower: () => 1, upper: (x) => -x * x + 3 * x + 1, a: 0, b: 2 },
    bbox: [-0.5, 3.6, 3.0, -0.4],
    limitsTex: "[0,2]",
    teacherPrompt: "半徑是 \\((-x^2+3x+1)-1=-x^2+3x\\)。",
    studentPrompt: "區域在 y=1 上方，貼著這條軸，所以是實心。",
    notes: ["半徑是到 y=1 的距離，不是把 y 直接平方。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(y=1\\)", "y 軸", "x 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 x 積分", "對 y 積分"], answer: 0 },
      { q: "半徑是什麼？", options: ["\\(-x^2+3x\\)", "\\(-x^2+3x+1\\)", "\\(1\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\([0,2]\\)", "\\([1,2]\\)", "\\([0,1]\\)"], answer: 0 }
    ],
    teacherTip: "在 x=0，曲線剛好通過 (0,1)，與軸相接。"
  },
  {
    id: "c-extra-10.17",
    mode: "C",
    label: "附加例題 10.17 — y = x²−1，x = ±2 與 y = −2，繞 y = −2",
    title: "附加例題 10.17",
    stem: "由 \\(y=x^{2}-1\\)、\\(x=-2\\)、\\(x=2\\) 及 \\(y=-2\\) 所圍的區域，繞直線 \\(y=-2\\) 旋轉一周。半徑為 \\(x^{2}+1\\)，\\(x\\) 由 \\(-2\\) 到 \\(2\\)。",
    hasVolume: true,
    axis: { dir: "x", offset: -2 },
    varName: "x",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: -2, b: 2, R: (x) => x * x + 1, r: () => 0 }],
    volumeTex: "\\dfrac{412\\pi}{15}",
    volumeValue: 412 * PI / 15,
    integralTex: "V=\\pi\\int_{-2}^{2}(x^{2}+1)^{2}\\,dx=\\dfrac{412\\pi}{15}",
    curves: [
      { type: "yofx", f: (x) => x * x - 1, domain: [-2.15, 2.15] },
      { type: "hline", y: -2 },
      { type: "vline", x: -2 },
      { type: "vline", x: 2 }
    ],
    region: { kind: "yofx", lower: () => -2, upper: (x) => x * x - 1, a: -2, b: 2 },
    bbox: [-3.1, 4.0, 3.1, -2.9],
    limitsTex: "[-2,2]",
    teacherPrompt: "軸是 y=−2，區域在軸上方並貼著這條軸，所以是實心。半徑是 \\((x^{2}-1)-(-2)=x^{2}+1\\)，不是把 y 直接平方。",
    studentPrompt: "半徑永遠是到「那一條旋轉軸」的距離。",
    notes: ["繞 y=k 時，半徑是到 y=k 的距離，不要仍寫成 y²。", "區域貼著 y=−2，是實心。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(y=-2\\)", "x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心（區域貼著 y=−2）", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 x 積分", "對 y 積分"], answer: 0, explain: "軸平行於 x 軸，薄片垂直於軸，所以對 x 積分。" },
      { q: "半徑是什麼？", options: ["\\(x^{2}+1\\)", "\\(x^{2}-1\\)", "\\(-2\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\(x:-2\\) 到 \\(2\\)", "\\(y:-2\\) 到 \\(3\\)", "\\(x:0\\) 到 \\(2\\)"], answer: 0 }
    ],
    teacherTip: "強調半徑是鉛垂距離 \\(\\lvert y-(-2)\\rvert\\)。終值 412π/15。"
  },
  {
    id: "c-10.18",
    mode: "C",
    label: "例 10.18 — y = ln x、x = 2 與 x 軸，繞 x = 2",
    title: "例 10.18",
    stem: "由 \\(y=\\ln x\\)、\\(x=2\\) 及 x 軸所圍的區域，繞直線 \\(x=2\\) 旋轉一周。改寫 \\(x=e^y\\)，半徑 \\(2-e^y\\)，\\(y\\) 由 0 到 \\(\\ln 2\\)。",
    hasVolume: true,
    axis: { dir: "y", offset: 2 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: -1,
    pieces: [{ a: 0, b: ln2, R: (y) => 2 - Math.exp(y), r: () => 0 }],
    volumeTex: "\\pi\\bigl(4\\ln 2-\\dfrac{5}{2}\\bigr)",
    volumeValue: PI * (4 * ln2 - 5 / 2),
    integralTex: "V=\\pi\\int_{0}^{\\ln 2}(2-e^y)^2\\,dy=\\pi\\bigl(4\\ln 2-\\tfrac{5}{2}\\bigr)",
    curves: [
      { type: "yofx", f: (x) => Math.log(x), domain: [0.6, 2.15] },
      { type: "vline", x: 2 }
    ],
    region: { kind: "xofy", inner: (y) => Math.exp(y), outer: () => 2, c: 0, d: ln2 },
    bbox: [-0.4, 1.15, 2.8, -0.45],
    limitsTex: "[0,\\ln 2]",
    teacherPrompt: "軸平行於 y 軸，應對 y 積分。半徑是水平距離 2−eʸ。",
    studentPrompt: "不要對 x 積分硬寫成圓盤；軸是豎的，薄片要垂直於這條豎軸。",
    notes: ["繞 x=h 時，半徑是水平距離，不要仍寫 x²。", "積分變量通常沿該軸（這裡是 y）。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(x=2\\)", "y 軸", "x 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心（區域貼著 x=2）", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "半徑是什麼？", options: ["\\(2-e^y\\)", "\\(e^y\\)", "\\(\\ln x\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\(y:0\\) 到 \\(\\ln 2\\)", "\\(x:1\\) 到 \\(2\\)", "\\(y:0\\) 到 \\(2\\)"], answer: 0 }
    ],
    teacherTip: "終值 π(4 ln 2 − 5/2) 為正。"
  },
  {
    id: "c-10.18p",
    mode: "C",
    label: "課堂練習 10.18 — y = 1/x−1、x = 2 與 x 軸，繞 x = 2",
    title: "課堂練習 10.18",
    stem: "由 \\(y=1/x-1\\)、\\(x=2\\) 及 x 軸所圍的區域，繞直線 \\(x=2\\) 旋轉一周。\\(x=1/(y+1)\\)，\\(y\\) 由 \\(-1/2\\) 到 0。",
    hasVolume: true,
    axis: { dir: "y", offset: 2 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: -1,
    pieces: [{ a: -0.5, b: 0, R: (y) => 2 - 1 / (y + 1), r: () => 0 }],
    volumeTex: "\\pi(3-4\\ln 2)",
    volumeValue: PI * (3 - 4 * ln2),
    integralTex: "V=\\pi\\int_{-1/2}^{0}\\Bigl(2-\\dfrac{1}{y+1}\\Bigr)^2\\,dy=\\pi(3-4\\ln 2)",
    curves: [
      { type: "yofx", f: (x) => 1 / x - 1, domain: [0.7, 2.2] },
      { type: "vline", x: 2 }
    ],
    region: { kind: "xofy", inner: (y) => 1 / (y + 1), outer: () => 2, c: -0.5, d: 0 },
    bbox: [-0.3, 0.55, 2.7, -0.85],
    limitsTex: "[-1/2,0]",
    teacherPrompt: "區域在 x 軸下方，但半徑仍是水平距離。終值 \\(\\pi(3-4\\ln 2)\\) 為正。",
    studentPrompt: "先改寫 x 為 y 的函數，再寫半徑 2−x(y)。",
    notes: ["結果是正數：3−4 ln 2 > 0。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(x=2\\)", "x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "x 改寫成什麼？", options: ["\\(x=1/(y+1)\\)", "\\(x=1/y-1\\)", "\\(x=y+1\\)"], answer: 0 },
      { q: "y 的上下限？", options: ["\\(-1/2\\) 到 \\(0\\)", "\\(0\\) 到 \\(1/2\\)", "\\(1\\) 到 \\(2\\)"], answer: 0 }
    ],
    teacherTip: "若有學生得到負值，多半是上下限或平方前的符號處理錯了；平方後應為正。"
  },
  {
    id: "c-extra-10.18",
    mode: "C",
    label: "附加例題 10.18 — y = ln x＋1、x 軸與 x = e²，繞 x = e²",
    title: "附加例題 10.18",
    stem: "由 \\(y=\\ln x+1\\)、x 軸及 \\(x=e^{2}\\) 所圍的區域，繞直線 \\(x=e^{2}\\) 旋轉一周。改寫 \\(x=e^{y-1}\\)，半徑 \\(e^{2}-e^{y-1}\\)，\\(y\\) 由 0 到 3。",
    hasVolume: true,
    axis: { dir: "y", offset: Math.E ** 2 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: -1,
    pieces: [{ a: 0, b: 3, R: (y) => Math.E ** 2 - Math.exp(y - 1), r: () => 0 }],
    volumeTex: "\\pi\\bigl(\\dfrac{3e^{4}}{2}+2e-\\dfrac{1}{2}e^{-2}\\bigr)",
    volumeValue: PI * (3 * Math.E ** 4 / 2 + 2 * Math.E - Math.exp(-2) / 2),
    integralTex: "V=\\pi\\int_{0}^{3}(e^{2}-e^{y-1})^{2}\\,dy=\\pi\\bigl(\\tfrac{3}{2}e^{4}+2e-\\tfrac{1}{2}e^{-2}\\bigr)",
    curves: [
      { type: "yofx", f: (x) => Math.log(x) + 1, domain: [Math.exp(-1), Math.E ** 2 + 0.15] },
      { type: "vline", x: Math.E ** 2 }
    ],
    region: { kind: "xofy", inner: (y) => Math.exp(y - 1), outer: () => Math.E ** 2, c: 0, d: 3 },
    bbox: [-0.7, 3.7, 8.6, -0.7],
    limitsTex: "[0,3]",
    teacherPrompt: "曲線與 \\(x=e^{2}\\) 交於 \\(y=3\\)，與 x 軸交於 \\(x=e^{-1}\\)。軸平行於 y 軸，應對 y 積分。區域貼著 \\(x=e^{2}\\)，是實心。",
    studentPrompt: "先改寫 x 為 y 的函數，再寫半徑 \\(e^{2}-x(y)\\)。",
    notes: ["繞 x=h 時，半徑是水平距離，不要仍寫 x²。", "積分變量通常沿該軸（這裡是 y）。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(x=e^{2}\\)", "y 軸", "x 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心（區域貼著 \\(x=e^{2}\\)）", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "半徑是什麼？", options: ["\\(e^{2}-e^{y-1}\\)", "\\(e^{y-1}\\)", "\\(\\ln x+1\\)"], answer: 0 },
      { q: "y 的上下限？", options: ["\\(0\\) 到 \\(3\\)", "\\(0\\) 到 \\(e^{2}\\)", "\\(-1\\) 到 \\(3\\)"], answer: 0 }
    ],
    teacherTip: "終值 \\(\\pi(3e^{4}/2+2e-e^{-2}/2)\\)。"
  },
  {
    id: "d-10.19",
    mode: "C",
    label: "例 10.19 — y = 3x² 與 y = 1/3，繞 y = 2",
    title: "例 10.19",
    stem: "由 \\(y=3x^2\\) 與 \\(y=1/3\\) 所圍的區域，繞直線 \\(y=2\\) 旋轉一周。交點 \\(x=\\pm 1/3\\)。軸在區域上方。",
    hasVolume: true,
    axis: { dir: "x", offset: 2 },
    varName: "x",
    hollow: true,
    turn: 1,
    profileSign: -1,
    pieces: [{ a: -1 / 3, b: 1 / 3, R: (x) => 2 - 3 * x * x, r: () => 5 / 3 }],
    volumeTex: "\\dfrac{8\\pi}{15}",
    volumeValue: 8 * PI / 15,
    integralTex: "V=\\pi\\int_{-1/3}^{1/3}\\bigl[(2-3x^2)^2-(5/3)^2\\bigr]\\,dx=\\dfrac{8\\pi}{15}",
    curves: [
      { type: "yofx", f: (x) => 3 * x * x, domain: [-0.7, 0.7] },
      { type: "hline", y: 1 / 3 }
    ],
    region: { kind: "yofx", lower: (x) => 3 * x * x, upper: () => 1 / 3, a: -1 / 3, b: 1 / 3 },
    bbox: [-0.9, 2.5, 0.9, -0.25],
    limitsTex: "[-1/3,1/3]",
    teacherPrompt: "軸在區域上方。直線 y=1/3 較接近軸，是內半徑 5/3；拋物線較遠離軸，是外半徑 2−3x²。",
    studentPrompt: "先量兩條邊界到 y=2 的距離，哪一條較大就是外半徑。",
    notes: ["繞 y=2，半徑是到 y=2 的距離，不要寫成 y²。", "外半徑是離軸較遠的那一條。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(y=2\\)", "x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["空心圓環（區域不貼著 y=2）", "實心圓盤"], answer: 0 },
      { q: "哪一條邊界離 y=2 較近？", options: ["直線 \\(y=1/3\\)，內半徑 \\(5/3\\)", "拋物線 \\(y=3x^2\\)"], answer: 0 },
      { q: "外半徑是什麼？", options: ["\\(2-3x^2\\)", "\\(5/3\\)", "\\(3x^2\\)"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\(x=\\pm 1/3\\)", "\\(x=\\pm 1\\)", "\\(y=0\\) 到 \\(1/3\\)"], answer: 0 }
    ],
    teacherTip: "區域很小，投影時可把 2D 圖放大。強調：離軸遠的是外半徑。"
  },
  {
    id: "d-10.19a",
    mode: "C",
    label: "課堂練習 10.19(a) — y = eˣ、x = ln 2、兩軸，繞 y = 2",
    title: "課堂練習 10.19(a)",
    stem: "由 \\(y=e^x\\)、\\(x=\\ln 2\\) 及兩軸所圍的區域，繞直線 \\(y=2\\) 旋轉一周。外半徑 2，內半徑 \\(2-e^x\\)，\\(x\\) 由 0 到 \\(\\ln 2\\)。",
    hasVolume: true,
    axis: { dir: "x", offset: 2 },
    varName: "x",
    hollow: true,
    turn: 1,
    profileSign: -1,
    pieces: [{ a: 0, b: ln2, R: () => 2, r: (x) => 2 - Math.exp(x) }],
    volumeTex: "\\dfrac{5\\pi}{2}",
    volumeValue: 5 * PI / 2,
    integralTex: "V=\\pi\\int_{0}^{\\ln 2}\\bigl[2^2-(2-e^x)^2\\bigr]\\,dx=\\dfrac{5\\pi}{2}",
    curves: [
      { type: "yofx", f: (x) => Math.exp(x), domain: [-0.15, 0.85] },
      { type: "vline", x: ln2 },
      { type: "hline", y: 2 }
    ],
    region: { kind: "yofx", lower: () => 0, upper: (x) => Math.exp(x), a: 0, b: ln2 },
    bbox: [-0.45, 2.6, 1.25, -0.35],
    limitsTex: "[0,\\ln 2]",
    teacherPrompt: "常見錯誤：把 eˣ 當成外半徑。其實 x 軸離 y=2 更遠，外半徑是 2。",
    studentPrompt: "區域從 x 軸伸到曲線。哪一條離 y=2 較遠？",
    notes: ["不要把 eˣ 當成外半徑；外半徑是到 x 軸的距離 2。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(y=2\\)", "x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["空心圓環", "實心圓盤"], answer: 0 },
      { q: "外半徑是什麼？", options: ["2（到 x 軸）", "\\(e^x\\)", "\\(2-e^x\\)"], answer: 0, explain: "x 軸離 y=2 更遠。" },
      { q: "內半徑是什麼？", options: ["\\(2-e^x\\)", "\\(e^x\\)", "2"], answer: 0 },
      { q: "上下限是什麼？", options: ["\\([0,\\ln 2]\\)", "\\([0,2]\\)", "\\([1,2]\\)"], answer: 0 }
    ],
    teacherTip: "對照錯誤：把曲線當成外圈。"
  },
  {
    id: "d-10.19b",
    mode: "C",
    label: "課堂練習 10.19(b) — y² = x＋1 與 y = x−1，繞 x = 3",
    title: "課堂練習 10.19(b)",
    stem: "由 \\(y^2=x+1\\)、\\(y=x-1\\) 及 x 軸所圍的區域，繞直線 \\(x=3\\) 旋轉一周。左支 \\(x=y^2-1\\)，右支 \\(x=y+1\\)，\\(y\\) 由 0 到 2。外半徑 \\(4-y^2\\)，內半徑 \\(2-y\\)。",
    hasVolume: true,
    axis: { dir: "y", offset: 3 },
    varName: "y",
    hollow: true,
    turn: 1,
    profileSign: -1,
    pieces: [{ a: 0, b: 2, R: (y) => 4 - y * y, r: (y) => 2 - y }],
    volumeTex: "\\dfrac{72\\pi}{5}",
    volumeValue: 72 * PI / 5,
    integralTex: "V=\\pi\\int_{0}^{2}\\bigl[(4-y^2)^2-(2-y)^2\\bigr]\\,dy=\\dfrac{72\\pi}{5}",
    curves: [
      { type: "xofy", g: (y) => y * y - 1, domain: [0, 2.15] },
      { type: "yofx", f: (x) => x - 1, domain: [1, 3.1] }
    ],
    region: { kind: "xofy", inner: (y) => y * y - 1, outer: (y) => y + 1, c: 0, d: 2 },
    bbox: [-1.6, 2.6, 3.6, -0.5],
    limitsTex: "[0,2]",
    teacherPrompt: "軸在區域右側。左邊界離軸較遠，是外半徑。",
    studentPrompt: "先改用 y 作變量，再量兩條邊界到 x=3 的水平距離。",
    notes: ["繞 x=3，應對 y 積分，半徑是水平距離。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(x=3\\)", "y 軸", "x 軸"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "外半徑是什麼？", options: ["\\(4-y^2\\)（左支離軸較遠）", "\\(2-y\\)", "\\(y^2-1\\)"], answer: 0 },
      { q: "內半徑是什麼？", options: ["\\(2-y\\)", "\\(4-y^2\\)", "\\(y+1\\)"], answer: 0 },
      { q: "y 的上下限？", options: ["\\(0\\) 到 \\(2\\)", "\\(-1\\) 到 \\(2\\)", "\\(0\\) 到 \\(3\\)"], answer: 0 }
    ],
    teacherTip: "可選。終值 72π/5。"
  },
  {
    id: "d-extra-10.19",
    mode: "C",
    label: "附加例題 10.19 — y = x²−2 與 y = x，繞 y = 2",
    title: "附加例題 10.19",
    stem: "由 \\(y=x^{2}-2\\) 與 \\(y=x\\) 所圍的區域，繞直線 \\(y=2\\) 旋轉一周。交點 \\(x=-1\\) 與 \\(x=2\\)。軸在區域上方。",
    hasVolume: true,
    axis: { dir: "x", offset: 2 },
    varName: "x",
    hollow: true,
    turn: 1,
    profileSign: -1,
    pieces: [{ a: -1, b: 2, R: (x) => 4 - x * x, r: (x) => 2 - x }],
    volumeTex: "\\dfrac{108\\pi}{5}",
    volumeValue: 108 * PI / 5,
    integralTex: "V=\\pi\\int_{-1}^{2}\\bigl[(4-x^{2})^{2}-(2-x)^{2}\\bigr]\\,dx=\\dfrac{108\\pi}{5}",
    curves: [
      { type: "yofx", f: (x) => x * x - 2, domain: [-1.25, 2.2] },
      { type: "yofx", f: (x) => x, domain: [-1.25, 2.2] }
    ],
    region: { kind: "yofx", lower: (x) => x * x - 2, upper: (x) => x, a: -1, b: 2 },
    bbox: [-1.9, 3.0, 2.9, -2.7],
    limitsTex: "[-1,2]",
    teacherPrompt: "軸在區域上方。拋物線離 y=2 較遠，是外半徑 \\(4-x^{2}\\)；直線 y=x 較近，是內半徑 \\(2-x\\)。",
    studentPrompt: "先量兩條邊界到 y=2 的距離，哪一條較大就是外半徑。",
    notes: ["繞 y=2，半徑是到 y=2 的距離，不要寫成 y²。", "外半徑是離軸較遠的那一條。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(y=2\\)", "x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["空心圓環（區域不貼著 y=2）", "實心圓盤"], answer: 0 },
      { q: "交點的 x 坐標？", options: ["\\(x=-1,\\,2\\)", "\\(x=0,\\,2\\)", "\\(x=\\pm 2\\)"], answer: 0 },
      { q: "哪一條邊界離 y=2 較遠？", options: ["拋物線 \\(y=x^{2}-2\\)，外半徑 \\(4-x^{2}\\)", "直線 \\(y=x\\)"], answer: 0 },
      { q: "內半徑是什麼？", options: ["\\(2-x\\)", "\\(4-x^{2}\\)", "\\(x\\)"], answer: 0 }
    ],
    teacherTip: "這個區域比 例 10.19 大。強調：離軸遠的是外半徑。終值 108π/5。"
  },

  // ---------- 階段評估 ----------
  {
    id: "assess-1",
    mode: "assess",
    label: "第 1 題 — 判斷題（矩形被 y=x² 分成 R₁、R₂）",
    title: "階段評估第 1 題",
    stem: "示意：矩形 \\([0,b]\\times[0,d]\\)，其中 \\(d=b^2\\)，被 \\(y=x^2\\) 分成 \\(R_1\\)（曲線上方、靠 y 軸）與 \\(R_2\\)（曲線下方、靠 \\(x=b\\)）。圖中取 \\(b=2\\)、\\(d=4\\)。判斷下列四式是否正確。",
    schematic: true,
    hasVolume: false,
    judgment: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 4, R: (y) => Math.sqrt(y), r: () => 0 }],
    curves: [
      { type: "yofx", f: (x) => x * x, domain: [0, 2] },
      { type: "vline", x: 2 },
      { type: "hline", y: 4 }
    ],
    region: { kind: "assess1", b: 2, d: 4 },
    bbox: [-0.55, 4.7, 2.7, -0.45],
    limitsTex: "示意",
    teacherPrompt: "必須配合圖。特別討論 (c)：繞豎軸卻對 x 積分，而且半徑寫成 (y−b)，兩處都不對。",
    studentPrompt: "先分清 R₁、R₂，再判斷旋轉後是實心還是空心，以及應對哪個變量積分。",
    notes: ["繞豎軸時，圓盤／圓環的薄片垂直於豎軸，應對 y 積分。"],
    judgments: [
      {
        id: "a",
        text: "(a) \\(R_1\\) 繞 y 軸：實心，\\(\\pi\\displaystyle\\int_0^d x^2\\,dy\\)（其中 \\(x^2=y\\)）",
        correct: true,
        explain: "正確。R₁ 在曲線左側，每層從 y 軸伸到 x=√y，是實心圓盤。"
      },
      {
        id: "b",
        text: "(b) \\(R_1\\) 繞 x 軸：圓環，\\(\\pi\\displaystyle\\int_0^b\\bigl[d^2-(x^2)^2\\bigr]\\,dx\\)",
        correct: true,
        explain: "正確。鉛垂薄片從 y=x² 到 y=d，繞 x 軸後中間有孔，外半徑 d、內半徑 x²。"
      },
      {
        id: "c",
        text: "(c) \\(R_2\\) 繞 x=b：\\(\\pi\\displaystyle\\int_0^b (y-b)^2\\,dx\\)",
        correct: false,
        explain: "錯誤。軸是豎的，應對 y 積分；半徑是水平距離 b−√y，不是 (y−b)。"
      },
      {
        id: "d",
        text: "(d) \\(R_2\\) 繞 y=d：外半徑 d、內半徑 d−x²",
        correct: true,
        explain: "正確。R₂ 從 x 軸到曲線，繞 y=d 後是圓環，外 d、內 d−x²。"
      }
    ],
    scaffold: [],
    teacherTip: "四題逐一揭示。圖中 R₁ 用綠色、R₂ 用土色。"
  },
  {
    id: "assess-3",
    mode: "assess",
    label: "第 3 題 — y = x² 與 y = x 圍成，繞 y 軸",
    title: "階段評估第 3 題",
    stem: "由 \\(y=x^2\\) 與 \\(y=x\\) 所圍的區域，繞 y 軸旋轉一周。",
    hasVolume: true,
    axis: { dir: "y", offset: 0 },
    varName: "y",
    hollow: true,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: 0, b: 1, R: (y) => Math.sqrt(y), r: (y) => y }],
    volumeTex: "\\dfrac{\\pi}{6}",
    volumeValue: PI / 6,
    integralTex: "V=\\pi\\int_{0}^{1}\\bigl(y-y^2\\bigr)\\,dy=\\dfrac{\\pi}{6}",
    wrongAxisTex: "\\text{若誤繞 x 軸：}\\ \\pi\\int_{0}^{1}(x^2-x^4)\\,dx=\\dfrac{2\\pi}{15}",
    wrongAxisValue: 2 * PI / 15,
    curves: [
      { type: "yofx", f: (x) => x * x, domain: [0, 1.15] },
      { type: "yofx", f: (x) => x, domain: [0, 1.15] }
    ],
    region: { kind: "yofx", lower: (x) => x * x, upper: (x) => x, a: 0, b: 1 },
    bbox: [-0.35, 1.25, 1.35, -0.25],
    limitsTex: "[0,1]",
    teacherPrompt: "外半徑 √y（拋物線），內半徑 y（直線）。若誤繞 x 軸會得到 2π/15。",
    studentPrompt: "繞 y 軸，改用 y 作變量。",
    notes: ["積分變量要跟旋轉軸：繞 y 軸就對 y 積分。", "若誤繞 x 軸，會得到 2π/15，不是本題答案。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["y 軸", "x 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["空心圓環", "實心圓盤"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "外、內半徑？", options: ["外 \\(\\sqrt{y}\\)，內 \\(y\\)", "外 \\(y\\)，內 \\(\\sqrt{y}\\)", "半徑 \\(x-x^2\\)"], answer: 0 },
      { q: "若誤繞 x 軸會得到？", options: ["\\(2\\pi/15\\)（不是本題）", "同樣是 \\(\\pi/6\\)"], answer: 0 }
    ],
    teacherTip: "揭示後可對照「誤繞 x 軸」的 2π/15。"
  },
  {
    id: "assess-4",
    mode: "assess",
    label: "第 4 題 — y = eˣ 與 y = e⁻ˣ，y=1 上方的帽，繞 y = 1",
    title: "階段評估第 4 題",
    stem: "由 \\(y=e^x\\) 與 \\(y=e^{-x}\\)，在 \\(x=-1\\) 到 \\(x=1\\) 之間、\\(y=1\\) 上方的帽，繞直線 \\(y=1\\) 旋轉一周。",
    hasVolume: true,
    axis: { dir: "x", offset: 1 },
    varName: "x",
    hollow: false,
    turn: 1,
    profileSign: 1,
    pieces: [
      { a: -1, b: 0, R: (x) => Math.exp(-x) - 1, r: () => 0 },
      { a: 0, b: 1, R: (x) => Math.exp(x) - 1, r: () => 0 }
    ],
    volumeTex: "e^2\\pi-4e\\pi+5\\pi",
    volumeValue: Math.exp(2) * PI - 4 * Math.E * PI + 5 * PI,
    integralTex: "V=\\pi\\int_{-1}^{0}(e^{-x}-1)^2\\,dx+\\pi\\int_{0}^{1}(e^x-1)^2\\,dx=e^2\\pi-4e\\pi+5\\pi",
    curves: [
      { type: "yofx", f: (x) => Math.exp(x), domain: [-1.15, 1.15] },
      { type: "yofx", f: (x) => Math.exp(-x), domain: [-1.15, 1.15] },
      { type: "hline", y: 1 },
      { type: "vline", x: -1 },
      { type: "vline", x: 1 }
    ],
    region: { kind: "assess4" },
    bbox: [-1.6, 3.1, 1.6, -0.3],
    limitsTex: "[-1,0]\\cup[0,1]",
    teacherPrompt: "帽貼著 y=1，是實心。左右對稱，可用一半再乘 2。",
    studentPrompt: "半徑是到 y=1 的距離，不是 eˣ 本身。",
    notes: ["繞 y=1，半徑為 |f(x)−1|；平方後 (f(x)−1)² 即可。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(y=1\\)", "x 軸", "y 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["實心（帽貼著 y=1）", "空心圓環"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 x 積分", "對 y 積分"], answer: 0 },
      { q: "x≥0 時半徑是什麼？", options: ["\\(e^x-1\\)", "\\(e^x\\)", "\\(1\\)"], answer: 0 },
      { q: "為什麼可以在 x=0 分成兩段？", options: ["左邊由 e⁻ˣ 作上界，右邊由 eˣ 作上界", "因為穿過 x 軸"], answer: 0 }
    ],
    teacherTip: "終值 e²π−4eπ+5π。"
  },
  {
    id: "assess-5",
    mode: "assess",
    label: "第 5 題 — x = −y²＋2 與 x = y² 透鏡，繞 x = −2",
    title: "階段評估第 5 題",
    stem: "由 \\(x=-y^2+2\\) 與 \\(x=y^2\\) 圍成的透鏡形區域，繞直線 \\(x=-2\\) 旋轉一周。交點 \\(y=\\pm 1\\)，外半徑 \\(4-y^2\\)，內半徑 \\(y^2+2\\)。",
    hasVolume: true,
    axis: { dir: "y", offset: -2 },
    varName: "y",
    hollow: true,
    turn: 1,
    profileSign: 1,
    pieces: [{ a: -1, b: 1, R: (y) => 4 - y * y, r: (y) => y * y + 2 }],
    volumeTex: "16\\pi",
    volumeValue: 16 * PI,
    integralTex: "V=\\pi\\int_{-1}^{1}\\bigl[(4-y^2)^2-(y^2+2)^2\\bigr]\\,dy=16\\pi",
    curves: [
      { type: "xofy", g: (y) => -y * y + 2, domain: [-1.25, 1.25] },
      { type: "xofy", g: (y) => y * y, domain: [-1.25, 1.25] }
    ],
    region: { kind: "xofy", inner: (y) => y * y, outer: (y) => 2 - y * y, c: -1, d: 1 },
    bbox: [-2.7, 1.7, 2.5, -1.7],
    limitsTex: "[-1,1]",
    teacherPrompt: "軸在區域左側。右邊界離軸較遠，是外半徑 4−y²。",
    studentPrompt: "先找交點，再量兩條邊界到 x=−2 的水平距離。",
    notes: ["繞 x=−2，半徑是水平距離，應對 y 積分。"],
    scaffold: [
      { q: "旋轉軸是哪一條？", options: ["\\(x=-2\\)", "y 軸", "x 軸"], answer: 0 },
      { q: "轉出來是實心還是空心？", options: ["空心圓環（透鏡不貼著 x=−2）", "實心圓盤"], answer: 0 },
      { q: "應對哪個變量積分？", options: ["對 y 積分", "對 x 積分"], answer: 0 },
      { q: "外半徑是什麼？", options: ["\\(4-y^2\\)", "\\(y^2+2\\)", "\\(2-y^2\\)"], answer: 0 },
      { q: "交點的 y 值？", options: ["\\(\\pm 1\\)", "\\(\\pm 2\\)", "\\(0,\\,1\\)"], answer: 0 }
    ],
    teacherTip: "可選。終值 16π。"
  }
];

export function findPreset(id) {
  const resolved = HASH_ALIASES[id] || id;
  return PRESETS.find((p) => p.id === resolved || (p.aliases && p.aliases.includes(id))) || null;
}

export function presetsForMode(mode) {
  return PRESETS.filter((p) => p.mode === mode || (p.alsoIn && p.alsoIn.includes(mode)));
}

export function allHashIds() {
  const ids = PRESETS.map((p) => p.id);
  ids.push(...Object.keys(HASH_ALIASES));
  return ids;
}
