import type { Matrix } from "./types";

/** Apply binary dropout mask (1=keep): y = x ⊙ mask / keepProb  (or without scale if keepProb=1 for hand) */
export function applyDropout(
  x: Matrix,
  mask: Matrix,
  keepProb = 1,
): Matrix {
  const scale = keepProb > 0 && keepProb < 1 ? 1 / keepProb : 1;
  return x.map((row, i) =>
    row.map((v, j) => v * mask[i][j] * scale),
  );
}
