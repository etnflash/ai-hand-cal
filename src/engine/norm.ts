import type { Matrix } from "./types";
import { shapeOf } from "./types";
import { zeros } from "./matrix";

/** LayerNorm over last dim (per row): (x - mean) / sqrt(var + eps) * gamma + beta */
export function layerNormRows(
  m: Matrix,
  gamma?: number[],
  beta?: number[],
  eps = 1e-5,
): Matrix {
  const s = shapeOf(m);
  const out = zeros(s.rows, s.cols);
  for (let i = 0; i < s.rows; i++) {
    const row = m[i];
    const mean = row.reduce((a, b) => a + b, 0) / s.cols;
    const variance =
      row.reduce((a, b) => a + (b - mean) ** 2, 0) / s.cols;
    const denom = Math.sqrt(variance + eps);
    for (let j = 0; j < s.cols; j++) {
      const g = gamma?.[j] ?? 1;
      const b = beta?.[j] ?? 0;
      out[i][j] = ((row[j] - mean) / denom) * g + b;
    }
  }
  return out;
}

/** RMSNorm: x / rms * gamma (no mean centering) */
export function rmsNormRows(
  m: Matrix,
  gamma?: number[],
  eps = 1e-5,
): Matrix {
  const s = shapeOf(m);
  const out = zeros(s.rows, s.cols);
  for (let i = 0; i < s.rows; i++) {
    const row = m[i];
    const ms = row.reduce((a, b) => a + b * b, 0) / s.cols;
    const denom = Math.sqrt(ms + eps);
    for (let j = 0; j < s.cols; j++) {
      const g = gamma?.[j] ?? 1;
      out[i][j] = (row[j] / denom) * g;
    }
  }
  return out;
}
