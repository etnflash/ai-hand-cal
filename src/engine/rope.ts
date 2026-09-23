import type { Matrix } from "./types";
import { zeros } from "./matrix";
import { shapeOf } from "./types";

/**
 * Apply 2D RoPE to pairs (x0,x1): rotate by θ = pos
 * For hand calc we use θ in radians given explicitly, or pos as angle.
 */
export function rope2d(x: number, y: number, theta: number): [number, number] {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [x * c - y * s, x * s + y * c];
}

/** Apply RoPE to each row: cols must be even. theta_i = pos * freq (freq=1 for hand). */
export function applyRoPE(m: Matrix, positions?: number[]): Matrix {
  const { rows, cols } = shapeOf(m);
  if (cols % 2 !== 0) throw new Error("applyRoPE: even dim required");
  const out = zeros(rows, cols);
  for (let i = 0; i < rows; i++) {
    const pos = positions?.[i] ?? i;
    for (let j = 0; j < cols; j += 2) {
      const [a, b] = rope2d(m[i][j], m[i][j + 1], pos);
      out[i][j] = a;
      out[i][j + 1] = b;
    }
  }
  return out;
}
