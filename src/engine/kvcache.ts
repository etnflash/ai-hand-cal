import type { Matrix } from "./types";

/** Append new keys/values to cache along sequence axis (rows) */
export function concatCache(past: Matrix, neu: Matrix): Matrix {
  if ((past[0]?.length ?? 0) !== (neu[0]?.length ?? 0)) {
    throw new Error("concatCache: dim mismatch");
  }
  return [...past.map((r) => [...r]), ...neu.map((r) => [...r])];
}

/**
 * Attention with KV cache: Q is new tokens only [Tq×d],
 * K,V are full cache [Tk×d]
 */
export { attention as attentionWithCache } from "./attention";
