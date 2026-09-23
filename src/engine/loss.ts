import { softmaxVec } from "./activations";

/** Cross-entropy for one sample: -log p[y] where p = softmax(logits) */
export function crossEntropyLogits(logits: number[], targetIndex: number): number {
  const p = softmaxVec(logits);
  return -Math.log(p[targetIndex] + 1e-12);
}

/** Softmax probs as row matrix for hand fill */
export function softmaxAsRow(logits: number[]): number[] {
  return softmaxVec(logits);
}
