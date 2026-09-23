import type { Matrix } from "./types";
import { zeros } from "./matrix";
import { shapeOf } from "./types";

/** Softmax along last axis (per row). Numerically stable. */
export function softmaxRows(m: Matrix): Matrix {
  const s = shapeOf(m);
  const out = zeros(s.rows, s.cols);
  for (let i = 0; i < s.rows; i++) {
    const row = m[i];
    const max = Math.max(...row);
    const exps = row.map((v) => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    for (let j = 0; j < s.cols; j++) {
      out[i][j] = exps[j] / sum;
    }
  }
  return out;
}

/** Softmax for a 1D vector */
export function softmaxVec(v: number[]): number[] {
  const max = Math.max(...v);
  const exps = v.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function relu(m: Matrix): Matrix {
  return m.map((row) => row.map((v) => Math.max(0, v)));
}

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function sigmoidMatrix(m: Matrix): Matrix {
  return m.map((row) => row.map(sigmoid));
}

export function tanhMatrix(m: Matrix): Matrix {
  return m.map((row) => row.map(Math.tanh));
}
