import type { Matrix } from "./types";
import { zeros } from "./matrix";
import { shapeOf } from "./types";

/**
 * Classic sinusoidal positional encoding (Vaswani et al.)
 * PE(pos, 2i)   = sin(pos / 10000^(2i/d))
 * PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
 */
export function sinusoidalPE(
  seqLen: number,
  dModel: number,
  base = 10000,
): Matrix {
  const out = zeros(seqLen, dModel);
  for (let pos = 0; pos < seqLen; pos++) {
    for (let i = 0; i < Math.floor(dModel / 2); i++) {
      const angle = pos / base ** ((2 * i) / dModel);
      out[pos][2 * i] = Math.sin(angle);
      if (2 * i + 1 < dModel) {
        out[pos][2 * i + 1] = Math.cos(angle);
      }
    }
    // odd d_model leftover dim
    if (dModel % 2 === 1) {
      const i = Math.floor(dModel / 2);
      const angle = pos / base ** ((2 * i) / dModel);
      out[pos][dModel - 1] = Math.sin(angle);
    }
  }
  return out;
}

/** Element-wise add embeddings + PE */
export function addPositional(x: Matrix, pe: Matrix): Matrix {
  const sx = shapeOf(x);
  const sp = shapeOf(pe);
  if (sx.rows !== sp.rows || sx.cols !== sp.cols) {
    throw new Error(
      `addPositional: shape mismatch [${sx.rows}×${sx.cols}] + [${sp.rows}×${sp.cols}]`,
    );
  }
  return x.map((row, i) => row.map((v, j) => v + pe[i][j]));
}
