import { sigmoid } from "./activations";

export type LstmState = { h: number[]; c: number[] };

/**
 * One LSTM step (batch=1). All weight mats are already applied externally —
 * this takes pre-activation gate vectors: i,f,g,o each length hidden.
 * i,f,o via sigmoid; g via tanh; c' = f⊙c + i⊙g; h' = o⊙tanh(c')
 */
export function lstmStepFromGates(
  i: number[],
  f: number[],
  g: number[],
  o: number[],
  cPrev: number[],
): LstmState {
  const n = i.length;
  const c = Array(n);
  const h = Array(n);
  for (let j = 0; j < n; j++) {
    const ii = sigmoid(i[j]);
    const ff = sigmoid(f[j]);
    const gg = Math.tanh(g[j]);
    const oo = sigmoid(o[j]);
    c[j] = ff * cPrev[j] + ii * gg;
    h[j] = oo * Math.tanh(c[j]);
  }
  return { h, c };
}

/** Element-wise helpers for hand lessons when gates are already 0/1 */
export function lstmCellUpdate(
  f: number[],
  cPrev: number[],
  i: number[],
  g: number[],
): number[] {
  return f.map((fj, j) => fj * cPrev[j] + i[j] * g[j]);
}

export function lstmHidden(o: number[], c: number[]): number[] {
  return o.map((oj, j) => oj * Math.tanh(c[j]));
}
