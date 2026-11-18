/** Shared numerical helpers (browser + node). */

export function simpson(f, a, b, n = 800) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  if (a === b) return 0;
  let lo = a, hi = b, sign = 1;
  if (hi < lo) { lo = b; hi = a; sign = -1; }
  let N = n;
  if (N < 2) N = 2;
  if (N % 2) N += 1;
  const h = (hi - lo) / N;
  let s = f(lo) + f(hi);
  for (let i = 1; i < N; i++) {
    const x = lo + i * h;
    s += f(x) * (i % 2 ? 4 : 2);
  }
  return sign * s * h / 3;
}

export function numericalVolume(preset) {
  if (!preset.pieces || !preset.pieces.length) return null;
  let acc = 0;
  const n = preset.simpsonN || 800;
  for (const piece of preset.pieces) {
    acc += simpson((t) => {
      const R = piece.R(t);
      const r = piece.r ? piece.r(t) : 0;
      if (!Number.isFinite(R) || !Number.isFinite(r)) return 0;
      const d = R * R - r * r;
      return d > 0 ? d : 0;
    }, piece.a, piece.b, n);
  }
  const turn = preset.turn == null ? 1 : preset.turn;
  return Math.PI * acc * turn;
}

export function almostEqual(actual, expected, rel = 2e-3, abs = 2e-4) {
  if (!Number.isFinite(actual) || !Number.isFinite(expected)) return false;
  const err = Math.abs(actual - expected);
  const scale = Math.max(1, Math.abs(expected));
  return err <= Math.max(abs, rel * scale);
}
