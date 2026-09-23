import type { Matrix } from "./types";
import { attention } from "./attention";
import { shapeOf } from "./types";

/** Split last dim into nHeads chunks: [T, d] → heads of [T, d/n] */
export function splitHeads(m: Matrix, nHeads: number): Matrix[] {
  const { rows, cols } = shapeOf(m);
  if (cols % nHeads !== 0) {
    throw new Error(`splitHeads: cols ${cols} not divisible by ${nHeads}`);
  }
  const dh = cols / nHeads;
  return Array.from({ length: nHeads }, (_, h) =>
    m.map((row) => row.slice(h * dh, (h + 1) * dh)),
  );
}

/** Concat heads along last dim */
export function concatHeads(heads: Matrix[]): Matrix {
  const rows = heads[0].length;
  return Array.from({ length: rows }, (_, i) =>
    heads.flatMap((h) => h[i]),
  );
}

/** Multi-head: for each head run attention, then concat */
export function multiHeadAttention(
  q: Matrix,
  k: Matrix,
  v: Matrix,
  nHeads: number,
): Matrix {
  const qs = splitHeads(q, nHeads);
  const ks = splitHeads(k, nHeads);
  const vs = splitHeads(v, nHeads);
  const outs = qs.map((qh, i) => attention(qh, ks[i], vs[i]).output);
  return concatHeads(outs);
}
