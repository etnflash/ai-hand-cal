import type { Matrix } from "./types";

/**
 * DDPM forward: x_t = √ᾱ x_0 + √(1-ᾱ) ε
 */
export function diffuseForward(
  x0: Matrix,
  eps: Matrix,
  alphaBar: number,
): Matrix {
  const sa = Math.sqrt(alphaBar);
  const sn = Math.sqrt(1 - alphaBar);
  return x0.map((row, i) =>
    row.map((v, j) => sa * v + sn * eps[i][j]),
  );
}

/** One-step denoise toy: x0_hat = (x_t - √(1-ᾱ) ε) / √ᾱ */
export function predictX0(
  xt: Matrix,
  eps: Matrix,
  alphaBar: number,
): Matrix {
  const sa = Math.sqrt(alphaBar);
  const sn = Math.sqrt(1 - alphaBar);
  return xt.map((row, i) =>
    row.map((v, j) => (v - sn * eps[i][j]) / sa),
  );
}

/**
 * Toy reverse mean (ε predicted known):
 * 동일 공식으로 x0를 복원한 뒤, 선택적으로 다시 noise.
 * 손계산용: ᾱ_prev 로 “한 스텝 전” 샘플 근사
 * x_{t-1} ≈ √ᾱ_prev · x̂0 + √(1-ᾱ_prev) · ε
 */
export function diffuseReverseStep(
  xt: Matrix,
  epsPred: Matrix,
  alphaBar: number,
  alphaBarPrev: number,
): Matrix {
  const x0hat = predictX0(xt, epsPred, alphaBar);
  return diffuseForward(x0hat, epsPred, alphaBarPrev);
}
