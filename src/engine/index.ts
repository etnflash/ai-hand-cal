export type { Matrix, Shape } from "./types";
export { shapeOf, formatShape } from "./types";
export {
  zeros,
  clone,
  assertShape,
  matmul,
  add,
  addBias,
  transpose,
  scale,
  linear,
} from "./matrix";
export {
  softmaxRows,
  softmaxVec,
  relu,
  sigmoid,
  sigmoidMatrix,
  tanhMatrix,
} from "./activations";
export { attention, selfAttention, applyCausalMask, causalSoftmax } from "./attention";
export type { AttentionResult } from "./attention";
export { checkMatrix, matricesEqual, roundMatrix } from "./checker";
export type { CheckResult, CellStatus } from "./checker";
export { buildHints, findRevealCell } from "./hints";
export type { HintLevel, HintPayload } from "./hints";
export { createRng, randInt, randomMatrix, hashSeed } from "./rng";
export { layerNormRows, rmsNormRows } from "./norm";
export { loraLinear, loraDeltaW } from "./lora";
export { sinusoidalPE, addPositional } from "./positional";
export { conv2dValid, conv1dValid } from "./cnn";
export {
  lstmStepFromGates,
  lstmCellUpdate,
  lstmHidden,
} from "./lstm";
export type { LstmState } from "./lstm";
export { gcnLayer, messageAggregate, addSelfLoops } from "./gnn";
export { reparameterize, klDiag, klDiagRows, klSum } from "./vae";
export { ganSigmoid, discriminatorScore, bceLoss, generatorFoolLoss } from "./gan";
export {
  affineCouple,
  affineCoupleInv,
  scaleShiftMatrix,
  logAbsDetDiag,
  realNvpCouple,
  realNvpCoupleInv,
} from "./flow";
export { diffuseForward, predictX0, diffuseReverseStep } from "./diffusion";
export { concatCache } from "./kvcache";
export { splitHeads, concatHeads, multiHeadAttention } from "./multihead";
export { rope2d, applyRoPE } from "./rope";
export { crossEntropyLogits, softmaxAsRow } from "./loss";
export { applyDropout } from "./dropout";
