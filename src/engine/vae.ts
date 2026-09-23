import type { Matrix } from "./types";

/** Reparameterization: z = μ + σ ⊙ ε */
export function reparameterize(mu: Matrix, sigma: Matrix, eps: Matrix): Matrix {
  return mu.map((row, i) =>
    row.map((m, j) => m + sigma[i][j] * eps[i][j]),
  );
}

/**
 * KL for diagonal Gaussian vs N(0,1), per-dim:
 * ½ (μ² + σ² − 1 − log σ²)   where logVar = log(σ²)
 * Equivalent: −½ (1 + logVar − μ² − exp(logVar))
 */
export function klDiag(mu: number[], logVar: number[]): number[] {
  return mu.map((m, i) => {
    const lv = logVar[i];
    const v = Math.exp(lv);
    return -0.5 * (1 + lv - m * m - v) || 0;
  });
}

/** Row-wise KL; each row is a latent vector */
export function klDiagRows(mu: Matrix, logVar: Matrix): Matrix {
  return mu.map((row, i) => klDiag(row, logVar[i]));
}

/** Sum of KL dims (ELBO의 KL 항) */
export function klSum(mu: number[], logVar: number[]): number {
  return klDiag(mu, logVar).reduce((a, b) => a + b, 0);
}
