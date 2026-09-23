import type { Matrix } from "./types";
import { matmul, scale, transpose, clone } from "./matrix";
import { softmaxRows } from "./activations";
import { shapeOf } from "./types";

export type AttentionResult = {
  scores: Matrix;
  weights: Matrix;
  output: Matrix;
};

/**
 * Scaled dot-product attention:
 * Attention(Q,K,V) = softmax(Q K^T / sqrt(d_k)) V
 */
export function attention(q: Matrix, k: Matrix, v: Matrix): AttentionResult {
  const dk = shapeOf(k).cols;
  const scores = scale(matmul(q, transpose(k)), 1 / Math.sqrt(dk));
  const weights = softmaxRows(scores);
  const output = matmul(weights, v);
  return { scores, weights, output };
}

/** Project X with Wq, Wk, Wv then run attention */
export function selfAttention(
  x: Matrix,
  wq: Matrix,
  wk: Matrix,
  wv: Matrix,
): AttentionResult & { q: Matrix; k: Matrix; v: Matrix } {
  const q = matmul(x, wq);
  const k = matmul(x, wk);
  const v = matmul(x, wv);
  return { q, k, v, ...attention(q, k, v) };
}

/** Lower-triangular causal mask: set j>i to fill (default −1e9) */
export function applyCausalMask(scores: Matrix, fill = -1e9): Matrix {
  const out = clone(scores);
  for (let i = 0; i < out.length; i++) {
    for (let j = 0; j < out[i].length; j++) {
      if (j > i) out[i][j] = fill;
    }
  }
  return out;
}

/** Causal softmax weights from raw scores */
export function causalSoftmax(scores: Matrix, fill = -1e9): Matrix {
  return softmaxRows(applyCausalMask(scores, fill));
}
