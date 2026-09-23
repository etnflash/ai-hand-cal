import type { Matrix } from "./types";
import { matmul } from "./matrix";

/** Simple GCN-style: H' = Â X W */
export function gcnLayer(aHat: Matrix, x: Matrix, w: Matrix): Matrix {
  return matmul(matmul(aHat, x), w);
}

/** Message pass: A @ X */
export function messageAggregate(adj: Matrix, x: Matrix): Matrix {
  return matmul(adj, x);
}

export function addSelfLoops(adj: Matrix): Matrix {
  return adj.map((row, i) => row.map((v, j) => (i === j ? v + 1 : v)));
}
