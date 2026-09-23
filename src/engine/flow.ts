import type { Matrix } from "./types";

/** Affine coupling (simplified): y = s⊙x + t */
export function affineCouple(
  x: number[],
  s: number[],
  t: number[],
): number[] {
  return x.map((xi, i) => xi * s[i] + t[i]);
}

export function affineCoupleInv(
  y: number[],
  s: number[],
  t: number[],
): number[] {
  return y.map((yi, i) => (yi - t[i]) / s[i]);
}

export function scaleShiftMatrix(
  x: Matrix,
  s: Matrix,
  t: Matrix,
): Matrix {
  return x.map((row, i) => row.map((v, j) => v * s[i][j] + t[i][j]));
}

/** log|det| for diagonal affine: Σ log|s_i| */
export function logAbsDetDiag(s: number[]): number {
  return s.reduce((a, v) => a + Math.log(Math.abs(v)), 0);
}

/**
 * RealNVP-style split coupling on even length vector:
 * y[:h]=x[:h], y[h:]=s⊙x[h:]+t
 */
export function realNvpCouple(
  x: number[],
  s: number[],
  t: number[],
): number[] {
  const h = x.length / 2;
  if (x.length % 2 !== 0 || s.length !== h || t.length !== h) {
    throw new Error("realNvpCouple: bad shapes");
  }
  const y = x.slice();
  for (let i = 0; i < h; i++) {
    y[h + i] = x[h + i] * s[i] + t[i];
  }
  return y;
}

export function realNvpCoupleInv(
  y: number[],
  s: number[],
  t: number[],
): number[] {
  const h = y.length / 2;
  const x = y.slice();
  for (let i = 0; i < h; i++) {
    x[h + i] = (y[h + i] - t[i]) / s[i];
  }
  return x;
}
