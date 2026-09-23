import type { Matrix } from "./types";
import { matmul, add, scale } from "./matrix";

/**
 * LoRA forward: y = x @ W + scale * (x @ A @ B)
 * where A is [in×r], B is [r×out]
 */
export function loraLinear(
  x: Matrix,
  w: Matrix,
  a: Matrix,
  b: Matrix,
  loraScale = 1,
): Matrix {
  const base = matmul(x, w);
  const delta = scale(matmul(matmul(x, a), b), loraScale);
  return add(base, delta);
}

/** Low-rank update ΔW = scale * (A @ B) */
export function loraDeltaW(a: Matrix, b: Matrix, loraScale = 1): Matrix {
  return scale(matmul(a, b), loraScale);
}
