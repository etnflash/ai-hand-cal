/** Sigmoid for scalar */
export function ganSigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/** Linear discriminator score D = σ(w·x + b) */
export function discriminatorScore(
  x: number[],
  w: number[],
  b: number,
): number {
  let s = b;
  for (let i = 0; i < x.length; i++) s += w[i] * x[i];
  return ganSigmoid(s);
}

/** Binary cross-entropy for one label: −[y log p + (1−y) log(1−p)] */
export function bceLoss(p: number, y: 0 | 1): number {
  const eps = 1e-12;
  const pp = Math.min(1 - eps, Math.max(eps, p));
  return -(y * Math.log(pp) + (1 - y) * Math.log(1 - pp));
}

/** Generator non-saturating term: −log D(G(z)) */
export function generatorFoolLoss(dFake: number): number {
  return bceLoss(dFake, 1);
}
