import type { Matrix, Shape } from "./types";
import { shapeOf } from "./types";

export function zeros(rows: number, cols: number): Matrix {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

export function clone(m: Matrix): Matrix {
  return m.map((row) => [...row]);
}

export function assertShape(m: Matrix, expected: Shape, label = "matrix"): void {
  const s = shapeOf(m);
  if (s.rows !== expected.rows || s.cols !== expected.cols) {
    throw new Error(
      `${label}: expected [${expected.rows}×${expected.cols}], got [${s.rows}×${s.cols}]`,
    );
  }
}

/** C = A @ B */
export function matmul(a: Matrix, b: Matrix): Matrix {
  const sa = shapeOf(a);
  const sb = shapeOf(b);
  if (sa.cols !== sb.rows) {
    throw new Error(
      `matmul: incompatible shapes [${sa.rows}×${sa.cols}] @ [${sb.rows}×${sb.cols}]`,
    );
  }
  const out = zeros(sa.rows, sb.cols);
  for (let i = 0; i < sa.rows; i++) {
    for (let j = 0; j < sb.cols; j++) {
      let sum = 0;
      for (let k = 0; k < sa.cols; k++) {
        sum += a[i][k] * b[k][j];
      }
      out[i][j] = sum;
    }
  }
  return out;
}

export function add(a: Matrix, b: Matrix): Matrix {
  const sa = shapeOf(a);
  assertShape(b, sa, "add(b)");
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

/** Broadcast bias row vector [1×n] or [n] across rows of x */
export function addBias(x: Matrix, bias: number[]): Matrix {
  const sx = shapeOf(x);
  if (bias.length !== sx.cols) {
    throw new Error(
      `addBias: bias length ${bias.length} != cols ${sx.cols}`,
    );
  }
  return x.map((row) => row.map((v, j) => v + bias[j]));
}

export function transpose(m: Matrix): Matrix {
  const s = shapeOf(m);
  const out = zeros(s.cols, s.rows);
  for (let i = 0; i < s.rows; i++) {
    for (let j = 0; j < s.cols; j++) {
      out[j][i] = m[i][j];
    }
  }
  return out;
}

export function scale(m: Matrix, factor: number): Matrix {
  return m.map((row) => row.map((v) => v * factor));
}

export function linear(x: Matrix, w: Matrix, b?: number[]): Matrix {
  const y = matmul(x, w);
  return b ? addBias(y, b) : y;
}
